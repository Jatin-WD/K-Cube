/* Real HTTP tests against the actual app/middleware, isolated from the real catalog/DB. */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

test('admin product/media lifecycle through public API and storefront SSR', async (t) => {
  t.diagnostic(process.env.KCUBE_FRONTEND_TEST_URL ? 'Storefront SSR assertions enabled' : 'API-only run; set KCUBE_FRONTEND_TEST_URL for storefront SSR assertions');
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'kcube-product-e2e-'));
  const realCatalog = path.resolve(__dirname, '../data/shop-products.json');
  const before = crypto.createHash('sha256').update(await fs.readFile(realCatalog)).digest('hex');
  process.env.KCUBE_SHOP_DATA_DIR = temp;
  process.env.JWT_SECRET = 'isolated-product-test-secret-not-used-outside-this-process';
  process.env.JWT_REFRESH_SECRET = 'isolated-product-refresh-test-secret';
  process.env.NODE_ENV = 'test';
  const app = require('../dist/app').app;
  const server = await new Promise((resolve, reject) => {
    const candidate = app.listen(Number(process.env.KCUBE_E2E_PORT || (process.env.KCUBE_FRONTEND_TEST_URL ? 4000 : 0)), '127.0.0.1', () => resolve(candidate));
    candidate.on('error', reject);
  });
  const port = server.address().port;
  const token = (role, admin_scope) => jwt.sign({ id: 999999, role, category_access: 'none', admin_scope }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const admin = token('admin', 'commerce');
  const call = async (route, { method = 'GET', body, auth = admin, type } = {}) => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1${route}`, {
      method,
      headers: { ...(auth ? { Authorization: `Bearer ${auth}` } : {}), ...(body ? { 'Content-Type': type || 'application/json' } : {}) },
      body: body ? (type ? body : JSON.stringify(body)) : undefined,
    });
    const data = response.headers.get('content-type')?.includes('json') ? await response.json() : await response.arrayBuffer();
    return { response, status: response.status, data };
  };
  let image;
  let gallery;
  const slug = 'kcube-e2e-product';
  const product = { slug, title: { en: 'K-CUBE E2E Product', ko: 'Test', hi: 'Test' }, price: 321, rewardPoints: 12, inStock: true, status: 'draft', featured: true, categoryKey: 'snacks' };
  try {
    await t.test('protects product and media writes with role and scope checks', async () => {
      assert.equal((await call('/admin/kfood/products', { auth: '' })).status, 401);
      assert.equal((await call('/admin/kfood/products', { auth: token('user', '') })).status, 403);
      assert.equal((await call('/admin/kfood/products', { auth: token('admin', 'content') })).status, 403);
      assert.equal((await call('/admin/kfood/media', { method: 'POST', body: Buffer.from('x'), type: 'image/png', auth: '' })).status, 401);
    });
    await t.test('uploads and optimizes real image files, rejects invalid and oversized files', async () => {
      const png = await sharp({ create: { width: 32, height: 24, channels: 3, background: '#f5a623' } }).png().toBuffer();
      const first = await call('/admin/kfood/media', { method: 'POST', body: png, type: 'image/png' });
      assert.equal(first.status, 200);
      image = first.data.data;
      gallery = (await call('/admin/kfood/media', { method: 'POST', body: png, type: 'image/png' })).data.data;
      const served = await call(image.url.replace('/api/v1', ''), { auth: '' });
      assert.equal(served.status, 200);
      assert.equal(served.response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal((await sharp(Buffer.from(served.data)).metadata()).format, 'webp');
      assert.equal((await call('/admin/kfood/media')).data.data.length, 2);
      assert.equal((await call('/admin/kfood/media', { method: 'POST', body: Buffer.from('<svg/>'), type: 'image/png' })).status, 400);
      assert.equal((await call('/admin/kfood/media', { method: 'POST', body: png.subarray(0, 24), type: 'image/png' })).status, 400);
      assert.equal((await call('/admin/kfood/media', { method: 'POST', body: Buffer.alloc(5 * 1024 * 1024 + 1), type: 'image/png' })).status, 413);
    });
    await t.test('creates draft with gallery, validates price and duplicate slugs', async () => {
      const result = await call('/admin/kfood/products', { method: 'POST', body: { ...product, image: image.url, gallery: [gallery.url] } });
      assert.equal(result.status, 200);
      assert.equal(result.data.data.gallery[0], gallery.url);
      assert.equal((await call('/shop/products', { auth: '' })).data.data.length, 0);
      assert.equal((await call(`/shop/products/${slug}`, { auth: '' })).status, 404);
      assert.equal((await call('/admin/kfood/products', { method: 'POST', body: product })).status, 409);
      assert.equal((await call('/admin/kfood/products', { method: 'POST', body: { ...product, slug: 'negative', price: -1 } })).status, 400);
      assert.equal((await call('/admin/kfood/products', { method: 'POST', body: { ...product, slug: 'bad-image', image: 'javascript:alert(1)' } })).status, 400);
    });
    await t.test('publishes to public catalog, homepage and product detail without static fallback', async () => {
      assert.equal((await call(`/admin/kfood/products/${slug}`, { method: 'PATCH', body: { status: 'published' } })).status, 200);
      const result = await call(`/shop/products/${slug}`, { auth: '' });
      assert.equal(result.data.data.featured, true);
      assert.equal(result.data.data.gallery.length, 1);
      const persisted = JSON.parse(await fs.readFile(path.join(temp, 'shop-products.json'), 'utf8'));
      assert.equal(persisted[0].status, 'published');
      if (process.env.KCUBE_FRONTEND_TEST_URL) {
        for (const route of ['/', '/shop', `/shop/${slug}`]) {
          const page = await fetch(`${process.env.KCUBE_FRONTEND_TEST_URL}${route}`);
          const html = await page.text();
          assert.equal(page.status, 200, route);
          assert.ok(html.includes('K-CUBE E2E Product'), `${route} must render live product`);
          if (route === '/' || route === '/shop') assert.match(html, /<h3[^>]*>K-CUBE E2E Product<\/h3>/);
          assert.ok(html.includes(image.filename), `${route} must render uploaded cover`);
          if (route.includes(slug)) assert.ok(html.includes(gallery.filename), 'detail must include gallery');
        }
      }
    });
    await t.test('cosmetics navigation destination filters beauty products', async () => {
      const beauty = await call('/admin/kfood/products', { method: 'POST', body: { ...product, slug: 'cosmetic-e2e', title: { en: 'Cosmetic E2E Item' }, categoryKey: 'beauty', status: 'published', image: image.url } });
      assert.equal(beauty.status, 200);
      assert.equal(beauty.data.data.store, 'moa_beauty');
      if (process.env.KCUBE_FRONTEND_TEST_URL) {
        const page = await fetch(`${process.env.KCUBE_FRONTEND_TEST_URL}/shop?category=beauty`);
        const html = await page.text();
        assert.equal(page.status, 200);
        assert.match(html, /<h3[^>]*>Cosmetic E2E Item<\/h3>/);
        assert.doesNotMatch(html, /<h3[^>]*>K-CUBE E2E Product<\/h3>/);
        assert.ok(html.includes('Cosmetics &amp; K-Beauty'));
      }
      await call('/admin/kfood/products/cosmetic-e2e', { method: 'DELETE' });
    });
    await t.test('updates price/stock, prevents deleting in-use images and hides drafts', async () => {
      const result = await call(`/admin/kfood/products/${slug}`, { method: 'PATCH', body: { price: 456, inStock: false, compareAtPrice: null, externalProductUrl: '' } });
      assert.equal(result.data.data.price, 456);
      const live = await call(`/shop/products/${slug}`, { auth: '' });
      assert.equal(live.data.data.inStock, false);
      assert.equal(live.data.data.stockLabel.en, 'Out of stock');
      assert.equal((await call(`/admin/kfood/media/${image.filename}`, { method: 'DELETE' })).status, 409);
      await call(`/admin/kfood/products/${slug}`, { method: 'PATCH', body: { status: 'draft' } });
      assert.equal((await call(`/shop/products/${slug}`, { auth: '' })).status, 404);
      assert.equal((await call('/shop/products', { auth: '' })).data.data.length, 0);
    });
    await t.test('drafts do not resurrect legacy hardcoded products', async () => {
      const legacy = 'brown-rice-green-tea-100t';
      assert.equal((await call('/admin/kfood/products', { method: 'POST', body: { ...product, slug: legacy } })).status, 200);
      if (process.env.KCUBE_FRONTEND_TEST_URL) assert.equal((await fetch(`${process.env.KCUBE_FRONTEND_TEST_URL}/shop/${legacy}`)).status, 404);
      await call(`/admin/kfood/products/${legacy}`, { method: 'DELETE' });
    });
    await t.test('serializes concurrent writes without losing products', async () => {
      const results = await Promise.all(['one', 'two'].map((name) => call('/admin/kfood/products', { method: 'POST', body: { ...product, slug: `parallel-${name}` } })));
      assert.ok(results.every((result) => result.status === 200));
      assert.equal((await call('/admin/kfood/products')).data.data.length, 3);
      for (const name of ['one', 'two']) await call(`/admin/kfood/products/parallel-${name}`, { method: 'DELETE' });
    });
    await t.test('deletes product and unused media, with deleted detail returning 404', async () => {
      assert.equal((await call(`/admin/kfood/products/${slug}`, { method: 'DELETE' })).status, 200);
      assert.equal((await call(`/shop/products/${slug}`, { auth: '' })).status, 404);
      assert.equal((await call('/admin/kfood/products')).data.data.length, 0);
      for (const item of [image, gallery]) assert.equal((await call(`/admin/kfood/media/${item.filename}`, { method: 'DELETE' })).status, 200);
      if (process.env.KCUBE_FRONTEND_TEST_URL) assert.equal((await fetch(`${process.env.KCUBE_FRONTEND_TEST_URL}/shop/${slug}`)).status, 404);
      assert.equal((await call('/admin/kfood/media')).data.data.length, 0);
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await require('../dist/db/pool').default.end();
    assert.equal(crypto.createHash('sha256').update(await fs.readFile(realCatalog)).digest('hex'), before, 'Existing catalog must remain unchanged');
    assert.equal(path.dirname(temp), os.tmpdir());
    assert.ok(path.basename(temp).startsWith('kcube-product-e2e-'));
    await fs.rm(temp, { recursive: true, force: true });
  }
});

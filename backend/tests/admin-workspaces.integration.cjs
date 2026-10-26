const test = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_SECRET = 'admin-workspace-test-only';
process.env.JWT_REFRESH_SECRET = 'admin-workspace-refresh-test-only';
process.env.RATE_LIMIT_MAX = '1000';
process.env.ADMIN_READ_RATE_LIMIT_MAX = '1000';
const jwt = require('jsonwebtoken');
const pool = require('../dist/db/pool').default;
const mailer = require('../dist/services/mailer');
// No database connection, real mail, real accounts or production writes.
mailer.sendVerificationEmail = async () => ({ skipped: false });
mailer.sendUserRegistrationNotificationEmail = async () => ({ skipped: true });
const now = '2026-10-26T09:00:00.000Z';
const users = [{ id: 1, full_name: 'Fixture member', email: 'member@example.test', phone: '0000000000', role: 'member', status: 'active', points: 50, city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', created_at: now, verified: 1 }];
const applications = [];
const ledger = [];
const cmsPages = [];
const cmsBlocks = [];
const originalQuery = pool.query;
const originalConnection = pool.getConnection;
pool.query = async (raw, values = []) => {
  const sql = raw.replace(/\s+/g, ' ').trim();
  if (sql.startsWith('INSERT INTO cms_pages')) { const row = { id: cmsPages.length + 1, slug: values[0], page_type: values[1], title_en: values[2], title_ko: values[3], title_hi: values[4], seo_title: values[5], seo_description: values[6], status: values[7] }; cmsPages.push(row); return [{ insertId: row.id }]; }
  if (sql.startsWith('INSERT INTO cms_blocks')) { const row = { id: cmsBlocks.length + 1, page_id: values[0], block_key: values[1], block_type: values[2], content_en: values[4], content_ko: values[5], content_hi: values[6], status: values[7] }; cmsBlocks.push(row); return [{ insertId: row.id }]; }
  if (sql.includes('FROM cms_pages') && sql.includes("status = 'published'")) return [cmsPages.filter(row => row.slug === values[0] && row.status === 'published')];
  if (sql.includes('FROM cms_blocks') && sql.includes("status = 'published'")) return [cmsBlocks.filter(row => row.page_id === values[0] && row.status === 'published')];
  if (sql.includes("'manpower' AS source_type")) return [applications.map(application => { const user = users.find(user => user.id === application.user_id); return { ...application, source_type: 'manpower', source_label: 'Manpower application', title: application.role_interest, applicant_name: user.full_name, applicant_email: user.email, submitted_at: application.created_at }; })];
  if (/AS source_type/.test(sql)) return [[]];
  if (sql.startsWith('SELECT COUNT(*) AS total')) return [[{ total: users.length, totalPoints: users.reduce((sum, user) => sum + user.points, 0) }]];
  if (sql.includes('FROM users WHERE status')) return [users.map(user => ({ ...user }))];
  if (sql.startsWith('SELECT u.id, u.full_name, u.email, u.phone')) return [users.map(user => ({ ...user }))];
  if (sql.startsWith('SELECT id FROM users WHERE LOWER') || sql.startsWith('SELECT id FROM users WHERE referral_code')) return [[]];
  if (sql.startsWith('INSERT INTO users')) {
    const columns = sql.match(/INSERT INTO users \(([^)]+)\)/)[1].split(',').map(value => value.trim());
    const user = { id: users.length + 1, points: 0, status: 'pending', verified: 0, created_at: now, last_login: null };
    columns.slice(0, -2).forEach((column, index) => { user[column] = values[index]; });
    users.push(user); return [{ insertId: user.id }];
  }
  if (sql.startsWith('SELECT id FROM users WHERE id') || sql.startsWith('SELECT id, points FROM users WHERE id')) return [users.filter(user => user.id === Number(values[0]))];
  if (sql.startsWith('SELECT points FROM users')) return [users.filter(user => user.id === Number(values[0]))];
  if (sql.startsWith('UPDATE users SET points')) { const user = users.find(user => user.id === values[3]); user.points = Math.max(0, user.points + values[0]); return [{ affectedRows: 1 }]; }
  if (sql.startsWith('INSERT INTO point_transactions')) { ledger.push({ user_id: values[0], delta: values[3], balance: values[4], metadata: JSON.parse(values[6]), admin: values[7] }); return [{ insertId: ledger.length }]; }
  if (sql.startsWith('INSERT INTO manpower_applications')) { applications.push({ id: applications.length + 1, user_id: values[0], role_interest: values[1], experience: values[2], status: 'submitted', created_at: now }); return [{ insertId: applications.length }]; }
  if (sql.startsWith('SELECT a.*, u.full_name')) return [applications.map(application => ({ ...users.find(user => user.id === application.user_id), ...application }))];
  if (sql.startsWith('UPDATE manpower_applications')) { const application = applications.find(item => item.id === values[3]); if (!application) return [{ affectedRows: 0 }]; Object.assign(application, { status: values[0], review_note: values[1], reviewed_by: values[2] }); return [{ affectedRows: 1 }]; }
  if (/^(INSERT IGNORE INTO auth_identities|DELETE FROM email_verification_tokens|INSERT INTO email_verification_tokens)/.test(sql)) return [{ affectedRows: 1 }];
  throw new Error(`Unexpected fixture query: ${sql}`);
};
pool.getConnection = async () => ({ query: (...args) => pool.query(...args), beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release: () => {} });
const app = require('../dist/app').app;

test('admin workspace HTTP integration with isolated database fixtures', async t => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  const token = (role, scope = null, id = 1) => jwt.sign({ id, role, category_access: 'category_c', admin_scope: scope }, process.env.JWT_SECRET);
  const admin = token('admin', 'super_admin', 99);
  const member = token('member');
  const request = async (path, auth, method = 'GET', body) => {
    const response = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: `Bearer ${auth}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: response.status, body: await response.json() };
  };
  try {
    await t.test('locations resolve outside the previous hardcoded map', async () => {
      const response = await request('/locations?country=India&state=Uttar%20Pradesh');
      assert.equal(response.status, 200);
      assert.ok(response.body.data.some(city => city.name === 'Lucknow'));
    });
    await t.test('anonymous and wrong-scope access cannot read community details or change balances', async () => {
      assert.equal((await request('/admin/community-map')).status, 401);
      assert.equal((await request('/admin/community-map', token('admin', 'analytics'))).status, 403);
      assert.equal((await request('/admin/points/adjust', member, 'POST', { user_id: 1, points_delta: 10, reason: 'Forbidden' })).status, 403);
    });
    await t.test('registration saves location and new member immediately appears at the matched city', async () => {
      const registered = await request('/auth/register', null, 'POST', { full_name: 'New signup', username: 'signup', email: 'signup@example.test', phone: '0000000001', password: 'fixture-test-only-password', country: 'IN', state: 'UP', city: 'Lucknow' });
      assert.equal(registered.status, 201);
      assert.equal(users[1].country, 'India');
      assert.equal(users[1].state, 'Uttar Pradesh');
      const response = await request('/admin/community-map?selectedCountry=India&selectedState=Uttar%20Pradesh&selectedCity=Lucknow', admin);
      assert.equal(response.body.data.metrics.totalUsers, 2);
      const city = response.body.data.locations.cities.find(city => city.label === 'Lucknow');
      assert.equal(city.users, 2); assert.equal(city.mapped, true);
      assert.ok(Math.abs(city.latitude - 26.84) < 0.1);
      assert.equal(response.body.data.selectedUsers[1].email, 'signup@example.test');
    });
    await t.test('unknown towns keep their saved details and receive no guessed city pin', async () => {
      users.push({ ...users[0], id: 3, city: 'Unmatched fixture town', email: 'unknown@example.test' });
      const response = await request('/admin/community-map', admin);
      const city = response.body.data.locations.cities.find(city => city.label === 'Unmatched fixture town');
      assert.equal(city.mapped, false); assert.equal(city.latitude, null);
      assert.equal(response.body.data.selectedUsers.length, 3);
    });
    await t.test('all balances include zero-point accounts', async () => {
      const response = await request('/admin/points/users', admin);
      assert.equal(response.status, 200); assert.equal(response.body.data.total, 3);
      assert.ok(response.body.data.users.some(user => user.points === 0));
    });
    await t.test('increase and decrease preserve audit metadata and reject overdraw', async () => {
      assert.equal((await request('/admin/points/adjust', admin, 'POST', { user_id: 1, points_delta: 20, reason: 'Approved contribution' })).body.data.balance, 70);
      assert.equal((await request('/admin/points/adjust', admin, 'POST', { user_id: 1, points_delta: -10, reason: 'Correct duplicate award' })).body.data.balance, 60);
      assert.equal(ledger[1].admin, 99); assert.equal(ledger[1].metadata.reason, 'Correct duplicate award');
      assert.equal((await request('/admin/points/adjust', admin, 'POST', { user_id: 1, points_delta: -1000, reason: 'Too much' })).status, 409);
      assert.equal(users[0].points, 60); assert.equal(ledger.length, 2);
    });
    await t.test('content editors publish through the real CMS routes and public API', async () => {
      const contentAdmin = token('admin', 'content', 77);
      const page = await request('/learning/cms/pages', contentAdmin, 'POST', { slug: 'about', pageType: 'landing', titleEn: 'About K-CUBE', status: 'published' });
      assert.equal(page.status, 201);
      const settings = { title: 'Our Korean world', description: 'A community built around culture.', cards: [{ title: 'Discover', description: 'Explore with us', href: '/activities', cta: 'Explore' }] };
      const block = await request('/admin/cms/blocks', contentAdmin, 'POST', { page_id: page.body.data.id, block_key: 'page-settings', block_type: 'hero', content_en: settings, status: 'published' });
      assert.equal(block.status, 200);
      const published = await request('/learning/cms/public/about');
      assert.equal(published.status, 200);
      assert.deepEqual(published.body.data.blocks[0].contentEn, settings);
      assert.equal((await request('/admin/cms/blocks', member, 'POST', { page_id: 1, block_key: 'page-settings', block_type: 'hero' })).status, 403);
    });
    await t.test('manpower applications use account identity and support scoped review', async () => {
      assert.equal((await request('/manpower/apply', null, 'POST', {})).status, 401);
      const submitted = await request('/manpower/apply', member, 'POST', { role: 'Event crew', experience: 'Fixture experience in event coordination and support.', user_id: 99 });
      assert.equal(submitted.status, 201); assert.equal(applications[0].user_id, 1);
      assert.equal((await request('/admin/manpower', token('admin', 'commerce'))).status, 403);
      const listed = await request('/admin/manpower', admin); assert.equal(listed.body.data[0].email, 'member@example.test');
      assert.equal((await request('/admin/manpower/1', admin, 'PATCH', { status: 'reviewing', review_note: 'Schedule discussion' })).status, 200);
      assert.equal(applications[0].reviewed_by, 99); assert.equal(applications[0].status, 'reviewing');
      const feed = await request('/admin/submissions', admin);
      assert.equal(feed.status, 200);
      assert.ok(feed.body.data.some(row => row.source_type === 'manpower' && row.applicant_email === 'member@example.test'));
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
    pool.query = originalQuery; pool.getConnection = originalConnection;
    await pool.end();
  }
});

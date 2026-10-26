const test = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_SECRET = 'rate-limit-test-secret-only';
process.env.JWT_REFRESH_SECRET = 'rate-limit-refresh-test-only';
process.env.RATE_LIMIT_MAX = '2';
process.env.ADMIN_READ_RATE_LIMIT_MAX = '4';
const express = require('express');
const jwt = require('jsonwebtoken');
const limiter = require('../dist/middleware/rateLimiter').default;

test('workspace reads have bounded signed-user quotas; public and mutations remain limited', async () => {
  const app = express();
  app.use('/api/v1', limiter);
  app.use((req, res) => res.json({ ok: true }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  const token = id => jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET);
  const request = (path, auth, method = 'GET') => fetch(base + path, {
    method, headers: auth ? { Authorization: `Bearer ${auth}` } : {},
  });
  try {
    assert.equal((await request('/shop')).status, 200);
    assert.equal((await request('/admin/dashboard', jwt.sign({ id: 1, role: 'admin' }, 'forged'))).status, 200);
    assert.equal((await request('/shop')).status, 429);
    for (const path of ['/admin/dashboard', '/users', '/learning/admin/tracks', '/learning/cms/pages']) {
      assert.equal((await request(path, token(1))).status, 200);
    }
    const blocked = await request('/admin/community-map', token(1));
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers.get('retry-after')) > 0);
    assert.equal((await request('/admin/community-map', token(2))).status, 200);
    assert.equal((await request('/admin/kfood/products', token(2), 'POST')).status, 429);
    assert.equal((await request('/auth/login', token(2), 'POST')).status, 429);
    assert.equal((await request('/admin/dashboard', jwt.sign({ id: 3, role: 'user' }, process.env.JWT_SECRET))).status, 429);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

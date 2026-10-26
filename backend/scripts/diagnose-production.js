// Read-only production check. Does not bootstrap, migrate, seed or change records.
const fs = require('fs');
const config = require('../dist/config');
const pool = require('../dist/db/pool').default;
const { databaseFailure } = require('../dist/lib/databaseFailure');

(async () => {
  const docker = fs.existsSync('/.dockerenv');
  const loopback = ['localhost', '127.0.0.1', '::1'].includes(config.MYSQL_HOST);
  console.log(JSON.stringify({ check: 'configuration', docker, databaseHostIsLoopback: loopback, databaseNameConfigured: Boolean(config.MYSQL_DATABASE), databaseUserConfigured: Boolean(config.MYSQL_USER), databasePasswordConfigured: Boolean(config.MYSQL_PASSWORD) }));
  if (docker && loopback) console.log('NOTE: localhost is this Node container, not the VPS MySQL host. Use the actual database hostname.');
  try {
    await pool.query('SELECT 1');
    console.log('PASS: MySQL connection and authentication');
    await pool.query(`SELECT u.id, u.full_name, u.status, u.points, u.city, u.state, u.country, u.created_at, u.last_login,
      COALESCE(MAX(CASE WHEN ai.verified = TRUE THEN 1 ELSE 0 END), 0) AS verified
      FROM users u LEFT JOIN auth_identities ai ON ai.user_id = u.id
      GROUP BY u.id, u.full_name, u.status, u.points, u.city, u.state, u.country, u.created_at, u.last_login LIMIT 0`);
    console.log('PASS: Community-map tables, columns and read permissions');
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE status <> 'deleted' AND role NOT IN ('admin','manager')");
    console.log(JSON.stringify({ check: 'communityUsers', count: Number(rows[0].count) }));
  } catch (error) {
    const result = databaseFailure(error);
    console.log(JSON.stringify({ check: 'database', ok: false, driverCode: error.code || 'UNKNOWN', code: result.code, message: result.message }));
    process.exitCode = 1;
  } finally { await pool.end(); }
})().catch(() => { console.error('Diagnostic failed without exposing connection details.'); process.exitCode = 1; });

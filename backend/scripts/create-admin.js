const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const exampleEnvPath = path.resolve(__dirname, '../.env.example');

dotenv.config({ path: envPath });
if (!fs.existsSync(envPath) && fs.existsSync(exampleEnvPath)) {
  dotenv.config({ path: exampleEnvPath });
}

const requiredEnv = (key, fallback) => {
  const value = process.env[key];
  if (value) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`${key} environment variable is required`);
};

const MYSQL_HOST = process.env.MYSQL_HOST || '127.0.0.1';
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'kcube';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || 'K-CUBE Admin';
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();

const randomPassword = () =>
  `Kcube@${crypto.randomBytes(6).toString('hex')}${crypto.randomInt(10, 99)}`;

const generateReferralCode = (username) => {
  const slug = String(username || 'admin').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 10) || 'admin';
  return `${slug}${crypto.randomBytes(3).toString('hex')}`.toUpperCase();
};

const run = async () => {
  const email = ADMIN_EMAIL || `admin-${Date.now()}@kcube.local`;
  const password = ADMIN_PASSWORD || randomPassword();
  const username = ADMIN_USERNAME || 'admin';
  const passwordHash = await bcrypt.hash(password, 12);
  const referralCode = generateReferralCode(username);

  const pool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  try {
    const [existingRows] = await pool.query('SELECT id, email, username FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? LIMIT 1', [
      email.toLowerCase(),
      username.toLowerCase(),
    ]);
    const existing = existingRows[0];

    if (existing) {
      await pool.query(
        'UPDATE users SET full_name = ?, password_hash = ?, role = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [ADMIN_FULL_NAME, passwordHash, 'admin', 'active', existing.id],
      );
      console.log(JSON.stringify({
        created: false,
        userId: existing.id,
        email: existing.email,
        username: existing.username,
        password,
      }, null, 2));
      return;
    }

    const [result] = await pool.query(
      `INSERT INTO users
        (full_name, username, email, phone, password_hash, role, category_access, admin_scope, referral_code, created_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)` ,
      [ADMIN_FULL_NAME, username, email, null, passwordHash, 'admin', 'category_c', 'super_admin', referralCode, 'active'],
    );

    const userId = result.insertId;
    await pool.query(
      'INSERT IGNORE INTO auth_identities (user_id, provider, provider_user_id, email, verified, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())',
      [userId, 'password', email, email],
    );

    console.log(JSON.stringify({
      created: true,
      userId,
      email,
      username,
      password,
    }, null, 2));
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

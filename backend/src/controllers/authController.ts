import crypto from 'crypto';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import pool from '../db/pool';
import { awardPoints } from '../services/pointsService';

const jwtSecret: Secret = process.env.JWT_SECRET || 'secret';
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || 'refreshSecret';

const signToken = (payload: object, secret: Secret, expiresIn: string) => jwt.sign(payload as any, secret as any, { expiresIn } as any);
const awardWelcomePoints = async (userId: number) => {
  return awardPoints({
    userId,
    sourceType: 'welcome',
    sourceSlug: 'welcome-bonus',
    points: 250,
    metadata: { reason: 'First registration welcome award' },
    once: true,
  });
};

export const register = async (req: Request, res: Response) => {
  const { full_name, username, email, phone, password, category_access, referral_code } = req.body;
  if (!email || !password || !username || !full_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const referralCode = `KC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1', [email, username]);
  if ((existing as any[]).length) {
    return res.status(409).json({ error: 'Email or username already registered' });
  }
  let referrer: any = null;
  if (referral_code) {
    const [referrerRows] = await pool.query('SELECT id, referral_code FROM users WHERE referral_code = ? AND status = ? LIMIT 1', [referral_code, 'active']);
    referrer = (referrerRows as any[])[0] || null;
    if (!referrer) return res.status(400).json({ error: 'Invalid referral code' });
  }
  const result = await pool.query(
    `INSERT INTO users (full_name, username, email, phone, password_hash, role, category_access, referral_code, referred_by, created_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'active')`,
    [full_name, username, email, phone || null, passwordHash, 'member', category_access || 'category_c', referralCode, referrer?.referral_code || null]
  );
  const userId = (result as any)[0].insertId;
  await awardWelcomePoints(userId);
  if (referrer) {
    await pool.query(
      'INSERT INTO referrals (referrer_user_id, referred_user_id, referral_code, status, referrer_points, referred_points, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [referrer.id, userId, referrer.referral_code, 'qualified', 150, 100],
    );
    await awardPoints({
      userId: referrer.id,
      sourceType: 'referral',
      sourceSlug: `referral-${userId}`,
      points: 150,
      metadata: { referred_user_id: userId, referral_code: referrer.referral_code },
      once: true,
    });
    await awardPoints({
      userId,
      sourceType: 'referral',
      sourceSlug: `referred-by-${referrer.id}`,
      points: 100,
      metadata: { referrer_user_id: referrer.id, referral_code: referrer.referral_code },
      once: true,
    });
  }
  const token = signToken({ id: userId, role: 'member', category_access: category_access || 'category_c' }, jwtSecret, '1h');
  const refreshToken = signToken({ id: userId }, refreshSecret, '30d');
  const [userRows] = await pool.query('SELECT points, referral_code FROM users WHERE id = ? LIMIT 1', [userId]);
  const savedUser = (userRows as any[])[0] || {};
  return res.status(201).json({ user: { id: userId, email, username, full_name, category_access, points: savedUser.points ?? 250, referral_code: savedUser.referral_code }, token, refreshToken });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  const user = (rows as any[])[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
  const refreshToken = signToken({ id: user.id }, refreshSecret, '30d');
  await pool.query('INSERT INTO session_logs (user_id, ip_address, device, created_at) VALUES (?, ?, ?, NOW())', [user.id, req.ip, req.headers['user-agent'] || 'unknown']);
  return res.json({ user: { id: user.id, email: user.email, username: user.username, full_name: user.full_name, role: user.role, category_access: user.category_access, points: user.points }, token, refreshToken });
};

const generateOtpCode = () => crypto.randomInt(100000, 999999).toString();

export const sendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  const otpCode = generateOtpCode();
  await pool.query(
    'INSERT INTO otp_requests (phone, otp_code, expires_at, created_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), NOW(), FALSE)',
    [phone, otpCode]
  );

  // TODO: integrate SMS gateway provider here
  return res.json({ success: true, message: 'OTP sent to phone', otpCode });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, otp_code } = req.body;
  if (!phone || !otp_code) return res.status(400).json({ error: 'Phone and OTP are required' });

  const [rows] = await pool.query(
    'SELECT id, user_id FROM otp_requests WHERE phone = ? AND otp_code = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [phone, otp_code]
  );
  const request = (rows as any[])[0];
  if (!request) return res.status(401).json({ error: 'Invalid or expired OTP' });

  await pool.query('UPDATE otp_requests SET used = TRUE WHERE id = ?', [request.id]);

  let userId = request.user_id;
  if (!userId) {
    const username = `kcube_${crypto.randomBytes(4).toString('hex')}`;
    const referralCode = `KC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const result = await pool.query(
      'INSERT INTO users (full_name, username, phone, password_hash, role, category_access, referral_code, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
      ['K-CUBE Member', username, phone, '', 'member', 'category_c', referralCode, 'active']
    );
    userId = (result as any)[0].insertId;
    await awardWelcomePoints(userId);
  }

  const [userRows] = await pool.query('SELECT id, email, username, full_name, role, category_access, points FROM users WHERE id = ? LIMIT 1', [userId]);
  const user = (userRows as any[])[0];
  const token = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
  const refreshToken = signToken({ id: user.id }, refreshSecret, '30d');

  return res.json({ user, token, refreshToken });
};

export const googleAuth = async (req: Request, res: Response) => {
  const { google_id, email, full_name } = req.body;
  if (!google_id || !email) return res.status(400).json({ error: 'Google ID and email are required' });

  const [rows] = await pool.query('SELECT id, role, category_access, google_id FROM users WHERE google_id = ? OR email = ? LIMIT 1', [google_id, email]);
  let user = (rows as any[])[0];
  if (!user) {
    const username = `kcube_${Math.random().toString(36).slice(2, 8)}`;
    const referralCode = `KC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const result = await pool.query(
      'INSERT INTO users (full_name, username, email, google_id, role, category_access, referral_code, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
      [full_name, username, email, google_id, 'member', 'category_c', referralCode, 'active']
    );
    user = { id: (result as any)[0].insertId, role: 'member', category_access: 'category_c' };
    await awardWelcomePoints(user.id);
  } else if (!user.google_id) {
    await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [google_id, user.id]);
  }

  const token = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
  const refreshToken = signToken({ id: user.id }, refreshSecret, '30d');
  const [userRows] = await pool.query('SELECT points FROM users WHERE id = ? LIMIT 1', [user.id]);
  const points = (userRows as any[])[0]?.points ?? 0;
  return res.json({ user: { id: user.id, email, full_name, role: user.role, category_access: user.category_access, points }, token, refreshToken });
};

export const verifyToken = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    return res.json({ valid: true, payload });
  } catch (error) {
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(400).json({ error: 'Missing refresh token' });
  try {
    const payload = jwt.verify(token, refreshSecret) as { id: number };
    const [rows] = await pool.query('SELECT id, role, category_access, email, username, full_name FROM users WHERE id = ? LIMIT 1', [payload.id]);
    const user = (rows as any[])[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const newToken = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
    return res.json({ token: newToken });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token invalid' });
  }
};

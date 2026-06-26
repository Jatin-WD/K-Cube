import crypto from 'crypto';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import pool from '../db/pool';
import { awardPoints } from '../services/pointsService';
import { created, fail, ok } from '../lib/apiResponse';
import { JWT_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_AUTH_REDIRECT_URI, GOOGLE_ALLOWED_WORKSPACE_DOMAIN } from '../config';

const jwtSecret: Secret = JWT_SECRET;
const refreshSecret: Secret = JWT_REFRESH_SECRET;

const signToken = (payload: object, secret: Secret, expiresIn: string) => jwt.sign(payload as any, secret as any, { expiresIn } as any);
const normalizeEmail = (email?: string) => String(email || '').trim().toLowerCase();

const verifyGoogleCredential = async (body: any) => {
  const clientId = GOOGLE_CLIENT_ID;
  if (!clientId) throw Object.assign(new Error('GOOGLE_CLIENT_ID is not configured'), { status: 500, code: 'GOOGLE_NOT_CONFIGURED' });

  let idToken = body.credential;
  if (!idToken && body.code) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: body.code,
        client_id: clientId,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: body.redirect_uri || GOOGLE_AUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const tokenPayload = await response.json() as any;
    if (!response.ok || !tokenPayload.id_token) {
      throw Object.assign(new Error(tokenPayload.error_description || 'Google authorization code exchange failed'), { status: 401, code: 'GOOGLE_CODE_INVALID' });
    }
    idToken = tokenPayload.id_token;
  }

  if (!idToken) throw Object.assign(new Error('Google credential or authorization code is required'), { status: 400, code: 'VALIDATION_ERROR' });

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  const claims = await response.json() as any;
  if (!response.ok) throw Object.assign(new Error(claims.error_description || 'Google credential is invalid'), { status: 401, code: 'GOOGLE_TOKEN_INVALID' });
  if (claims.aud !== clientId) throw Object.assign(new Error('Google audience mismatch'), { status: 401, code: 'GOOGLE_AUDIENCE_MISMATCH' });
  if (claims.email_verified !== 'true' && claims.email_verified !== true) throw Object.assign(new Error('Google email is not verified'), { status: 401, code: 'GOOGLE_EMAIL_UNVERIFIED' });
  const allowedDomain = GOOGLE_ALLOWED_WORKSPACE_DOMAIN;
  if (allowedDomain && claims.hd !== allowedDomain) throw Object.assign(new Error('Google Workspace domain is not allowed'), { status: 403, code: 'GOOGLE_DOMAIN_FORBIDDEN' });
  return claims;
};

const publicUserSelect = 'id, email, username, full_name, role, category_access, points, xp, level, referral_code, profile_image';

const issueTokens = (user: any) => ({
  token: signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h'),
  refreshToken: signToken({ id: user.id }, refreshSecret, '30d'),
});
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
    return fail(res, 400, 'VALIDATION_ERROR', 'Missing required fields');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const referralCode = `KC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1', [email, username]);
  if ((existing as any[]).length) {
    return fail(res, 409, 'ACCOUNT_EXISTS', 'Email or username already registered');
  }
  let referrer: any = null;
  if (referral_code) {
    const [referrerRows] = await pool.query('SELECT id, referral_code FROM users WHERE referral_code = ? AND status = ? LIMIT 1', [referral_code, 'active']);
    referrer = (referrerRows as any[])[0] || null;
    if (!referrer) return fail(res, 400, 'INVALID_REFERRAL', 'Invalid referral code');
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
  await pool.query(
    'INSERT IGNORE INTO auth_identities (user_id, provider, provider_user_id, email, verified, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())',
    [userId, 'password', normalizeEmail(email), normalizeEmail(email)],
  );
  return created(res, { user: { id: userId, email, username, full_name, role: 'member', category_access, points: savedUser.points ?? 250, referral_code: savedUser.referral_code }, token, refreshToken });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  const user = (rows as any[])[0];
  if (!user) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }
  const token = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
  const refreshToken = signToken({ id: user.id }, refreshSecret, '30d');
  await pool.query('INSERT INTO session_logs (user_id, ip_address, device, created_at) VALUES (?, ?, ?, NOW())', [user.id, req.ip, req.headers['user-agent'] || 'unknown']);
  return ok(res, { user: { id: user.id, email: user.email, username: user.username, full_name: user.full_name, role: user.role, category_access: user.category_access, points: user.points, referral_code: user.referral_code }, token, refreshToken });
};

const generateOtpCode = () => crypto.randomInt(100000, 999999).toString();

export const sendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return fail(res, 400, 'VALIDATION_ERROR', 'Phone number is required');

  const otpCode = generateOtpCode();
  await pool.query(
    'INSERT INTO otp_requests (phone, otp_code, expires_at, created_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), NOW(), FALSE)',
    [phone, otpCode]
  );

  // TODO: integrate SMS gateway provider here
  return ok(res, process.env.NODE_ENV === 'production' ? { message: 'OTP sent to phone' } : { message: 'OTP sent to phone', otpCode });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, otp_code } = req.body;
  if (!phone || !otp_code) return fail(res, 400, 'VALIDATION_ERROR', 'Phone and OTP are required');

  const [rows] = await pool.query(
    'SELECT id, user_id FROM otp_requests WHERE phone = ? AND otp_code = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [phone, otp_code]
  );
  const request = (rows as any[])[0];
  if (!request) return fail(res, 401, 'INVALID_OTP', 'Invalid or expired OTP');

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

  await pool.query(
    'INSERT IGNORE INTO auth_identities (user_id, provider, provider_user_id, phone, verified, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())',
    [user.id, 'phone_otp', phone, phone],
  );
  return ok(res, { user, token, refreshToken });
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const claims = await verifyGoogleCredential(req.body);
    const googleSub = String(claims.sub);
    const email = normalizeEmail(claims.email);
    const fullName = claims.name || email.split('@')[0] || 'K-CUBE Member';
    const profileImage = claims.picture || null;

    const [identityRows] = await pool.query('SELECT user_id FROM auth_identities WHERE provider = ? AND provider_user_id = ? LIMIT 1', ['google', googleSub]);
    let userId = (identityRows as any[])[0]?.user_id;
    let isNewUser = false;

    if (!userId) {
      const [emailRows] = await pool.query(`SELECT ${publicUserSelect}, google_id FROM users WHERE email = ? LIMIT 1`, [email]);
      const existingUser = (emailRows as any[])[0];
      if (existingUser?.google_id && existingUser.google_id !== googleSub) {
        return fail(res, 409, 'GOOGLE_ACCOUNT_CONFLICT', 'This email is linked to another Google account');
      }

      if (existingUser) {
        userId = existingUser.id;
        await pool.query('UPDATE users SET google_id = ?, profile_image = COALESCE(profile_image, ?) WHERE id = ?', [googleSub, profileImage, userId]);
      } else {
        const username = `kcube_${crypto.randomBytes(4).toString('hex')}`;
        const referralCode = `KC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
        const result = await pool.query(
          'INSERT INTO users (full_name, username, email, google_id, profile_image, role, category_access, referral_code, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
          [fullName, username, email, googleSub, profileImage, 'member', 'category_c', referralCode, 'active']
        );
        userId = (result as any)[0].insertId;
        isNewUser = true;
        await awardWelcomePoints(userId);
      }

      await pool.query(
        'INSERT INTO auth_identities (user_id, provider, provider_user_id, email, verified, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())',
        [userId, 'google', googleSub, email],
      );
    }

    const [userRows] = await pool.query(`SELECT ${publicUserSelect} FROM users WHERE id = ? LIMIT 1`, [userId]);
    const user = (userRows as any[])[0];
    const tokens = issueTokens(user);
    return ok(res, { user, ...tokens, isNewUser });
  } catch (error: any) {
    return fail(res, error.status || 500, error.code || 'GOOGLE_AUTH_FAILED', error.message || 'Google authentication failed');
  }
};

export const verifyToken = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return fail(res, 401, 'UNAUTHORIZED', 'Missing token');
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    return ok(res, { valid: true, payload });
  } catch (error) {
    return fail(res, 401, 'INVALID_TOKEN', 'Invalid token');
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) return fail(res, 400, 'VALIDATION_ERROR', 'Missing refresh token');
  try {
    const payload = jwt.verify(token, refreshSecret) as { id: number };
    const [rows] = await pool.query('SELECT id, role, category_access, email, username, full_name FROM users WHERE id = ? LIMIT 1', [payload.id]);
    const user = (rows as any[])[0];
    if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
    const newToken = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
    return ok(res, { token: newToken });
  } catch (error) {
    return fail(res, 401, 'INVALID_REFRESH_TOKEN', 'Refresh token invalid');
  }
};

export const logout = async (_req: Request, res: Response) => ok(res, { loggedOut: true });

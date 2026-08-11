import crypto from 'crypto';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import pool from '../db/pool';
import { awardPoints } from '../services/pointsService';
import { created, fail, ok } from '../lib/apiResponse';
import { JWT_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_AUTH_REDIRECT_URI, GOOGLE_ALLOWED_WORKSPACE_DOMAIN } from '../config';
import { buildVerificationUrl, createVerificationToken, hashVerificationToken, sendVerificationEmail } from '../services/mailer';

const jwtSecret: Secret = JWT_SECRET;
const refreshSecret: Secret = JWT_REFRESH_SECRET;

const signToken = (payload: object, secret: Secret, expiresIn: string) => jwt.sign(payload as any, secret as any, { expiresIn } as any);
const normalizeEmail = (email?: string) => String(email || '').trim().toLowerCase();
const normalizeUsername = (username?: string) => String(username || '').trim();
const normalizeName = (name?: string) => String(name || '').trim();
const normalizeReferralCode = (code?: string | null) => String(code || '').trim().toUpperCase();
const generateReferralCode = (username: string) => {
  const slug = username.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 10) || 'kcube';
  return `${slug}${crypto.randomBytes(3).toString('hex')}`.toUpperCase();
};
const REFERRAL_BONUS_POINTS = 30;
const resolveReferralCode = (bodyOrQuery: any) => normalizeReferralCode(bodyOrQuery?.referral_code ?? bodyOrQuery?.referralCode ?? bodyOrQuery?.ref ?? bodyOrQuery?.referred_by);

const generateUniqueReferralCode = async (username: string) => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const referralCode = generateReferralCode(username);
    const [rows] = await pool.query('SELECT id FROM users WHERE referral_code = ? LIMIT 1', [referralCode]);
    if (!(rows as any[]).length) {
      return referralCode;
    }
  }

  return `${generateReferralCode(username)}${crypto.randomBytes(2).toString('hex')}`.toUpperCase();
};

const findReferrerByCode = async (referralCode: string) => {
  const normalizedCode = normalizeReferralCode(referralCode);
  if (!normalizedCode) return null;

  const [rows] = await pool.query(
    'SELECT id, referral_code FROM users WHERE UPPER(referral_code) = ? LIMIT 1',
    [normalizedCode],
  );
  return (rows as any[])[0] || null;
};

const awardReferralPoints = async (referredUserId: number, referralCode?: string | null) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      'SELECT id FROM referrals WHERE referred_user_id = ? LIMIT 1 FOR UPDATE',
      [referredUserId],
    );
    if ((existingRows as any[]).length) {
      await connection.rollback();
      return { awarded: false };
    }

    const [userRows] = await connection.query(
      'SELECT id, referred_by FROM users WHERE id = ? LIMIT 1 FOR UPDATE',
      [referredUserId],
    );
    const user = (userRows as any[])[0];
    if (!user) {
      await connection.rollback();
      return { awarded: false };
    }

    const normalizedCode = normalizeReferralCode(referralCode || user.referred_by);
    if (!normalizedCode) {
      await connection.rollback();
      return { awarded: false };
    }

    const [referrerRows] = await connection.query(
      'SELECT id, referral_code FROM users WHERE UPPER(referral_code) = ? LIMIT 1 FOR UPDATE',
      [normalizedCode],
    );
    const referrer = (referrerRows as any[])[0];
    if (!referrer) {
      await connection.rollback();
      return { awarded: false };
    }
    if (Number(referrer.id) === Number(referredUserId)) {
      await connection.rollback();
      throw Object.assign(new Error('Self-referrals are not allowed'), { status: 400, code: 'SELF_REFERRAL_NOT_ALLOWED' });
    }

    await connection.query(
      'UPDATE users SET points = GREATEST(points + ?, 0), xp = GREATEST(xp + ?, 0), korea_score = GREATEST(korea_score + ?, 0) WHERE id = ?',
      [REFERRAL_BONUS_POINTS, REFERRAL_BONUS_POINTS, REFERRAL_BONUS_POINTS, referrer.id],
    );

    const [balanceRows] = await connection.query('SELECT points FROM users WHERE id = ? LIMIT 1', [referrer.id]);
    const balance = Number((balanceRows as any[])[0]?.points ?? 0);

    await connection.query(
      `INSERT INTO referrals
        (referrer_user_id, referred_user_id, referral_code, status, referrer_points, referred_points, created_at, qualified_at)
       VALUES (?, ?, ?, 'qualified', ?, 0, NOW(), NOW())`,
      [referrer.id, referredUserId, referrer.referral_code, REFERRAL_BONUS_POINTS],
    );

    await connection.query(
      `INSERT INTO point_transactions
        (user_id, source_type, source_slug, points_delta, balance_after, status, metadata, created_by, created_at)
       VALUES (?, 'referral', ?, ?, ?, 'approved', ?, NULL, NOW())`,
      [
        referrer.id,
        `referral-${referredUserId}`,
        REFERRAL_BONUS_POINTS,
        balance,
        JSON.stringify({
          referrer_user_id: referrer.id,
          referred_user_id: referredUserId,
          referral_code: referrer.referral_code,
          bonus_points: REFERRAL_BONUS_POINTS,
        }),
      ],
    );

    await connection.query('UPDATE users SET referred_by = COALESCE(referred_by, ?) WHERE id = ?', [referrer.referral_code, referredUserId]);

    await connection.commit();
    return { awarded: true, referralCode: referrer.referral_code, referrerUserId: referrer.id, balance };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

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

const publicUserSelect = 'id, email, username, full_name, role, category_access, points, xp, level, profile_image, referral_code, referred_by';

const issueTokens = (user: any) => ({
  token: signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h'),
  refreshToken: signToken({ id: user.id }, refreshSecret, '30d'),
});
const awardWelcomePoints = async (userId: number) => {
  return awardPoints({
    userId,
    sourceType: 'welcome',
    sourceSlug: 'welcome-bonus',
    points: 100,
    metadata: { reason: 'First registration welcome award' },
    once: true,
  });
};

const issueEmailVerification = async (userId: number, email: string, fullName: string) => {
  const token = createVerificationToken();
  const tokenHash = hashVerificationToken(token);
  const verificationUrl = buildVerificationUrl(token);

  await pool.query('DELETE FROM email_verification_tokens WHERE user_id = ?', [userId]);
  await pool.query(
    'INSERT INTO email_verification_tokens (user_id, token_hash, expires_at, created_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR), NOW())',
    [userId, tokenHash]
  );
  try {
    await sendVerificationEmail(email, fullName, verificationUrl);
  } catch (error) {
    console.error('Failed to send verification email', error);
  }

  return { verificationUrl };
};

export const register = async (req: Request, res: Response) => {
  const { full_name, username, email, phone, password, category_access } = req.body;
  const referralCode = resolveReferralCode(req.body);
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username);
  const normalizedFullName = normalizeName(full_name);
  const categoryAccess = category_access || 'category_c';
  if (!normalizedEmail || !password || !normalizedUsername || !normalizedFullName) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Missing required fields');
  }
  if (referralCode) {
    const referrer = await findReferrerByCode(referralCode);
    if (!referrer) {
      return fail(res, 400, 'INVALID_REFERRAL_CODE', 'Referral code is invalid');
    }
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? LIMIT 1', [normalizedEmail, normalizedUsername.toLowerCase()]);
  if ((existing as any[]).length) {
    return fail(res, 409, 'ACCOUNT_EXISTS', 'Email or username already registered');
  }
  const userReferralCode = await generateUniqueReferralCode(normalizedUsername);
  const result = await pool.query(
    `INSERT INTO users (full_name, username, email, phone, password_hash, role, category_access, referral_code, referred_by, created_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'pending')`,
    [normalizedFullName, normalizedUsername, normalizedEmail, phone || null, passwordHash, 'member', categoryAccess, userReferralCode, referralCode || null]
  );
  const userId = (result as any)[0].insertId;
  await pool.query(
    'INSERT IGNORE INTO auth_identities (user_id, provider, provider_user_id, email, verified, created_at, updated_at) VALUES (?, ?, ?, ?, FALSE, NOW(), NOW())',
    [userId, 'password', normalizedEmail, normalizedEmail],
  );
  const { verificationUrl } = await issueEmailVerification(userId, normalizedEmail, normalizedFullName);
  return created(res, {
    user: {
      id: userId,
      email: normalizedEmail,
      username: normalizedUsername,
      full_name: normalizedFullName,
      role: 'member',
      category_access: categoryAccess,
      referral_code: userReferralCode,
      referred_by: referralCode || null,
      points: 0,
      status: 'pending',
    },
    verificationRequired: true,
    message: 'Verification email sent. Please confirm your email before signing in.',
    verificationUrl: process.env.NODE_ENV === 'production' ? undefined : verificationUrl,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Email and password are required');
  }
  const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1', [normalizedEmail]);
  const user = (rows as any[])[0];
  if (!user) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }
  if (user.status !== 'active') {
    return fail(res, 403, 'EMAIL_NOT_VERIFIED', 'Please verify your email address before signing in');
  }
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }
  const token = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
  const refreshToken = signToken({ id: user.id }, refreshSecret, '30d');
  await pool.query('INSERT INTO session_logs (user_id, ip_address, device, created_at) VALUES (?, ?, ?, NOW())', [user.id, req.ip, req.headers['user-agent'] || 'unknown']);
  return ok(res, {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      category_access: user.category_access,
      referral_code: user.referral_code,
      points: Number(user.points ?? 0),
    },
    token,
    refreshToken,
  });
};

export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Email is required');
  }

  const [rows] = await pool.query(
    'SELECT id, full_name, email, status FROM users WHERE LOWER(email) = ? LIMIT 1',
    [normalizedEmail]
  );
  const user = (rows as any[])[0];
  if (!user) {
    return fail(res, 404, 'NOT_FOUND', 'Account not found');
  }
  if (user.status === 'active') {
    return ok(res, { alreadyVerified: true, message: 'Account is already verified.' });
  }

  const { verificationUrl } = await issueEmailVerification(user.id, user.email, user.full_name);
  return ok(res, {
    resent: true,
    message: 'Verification email sent again. Please check your inbox.',
    verificationUrl: process.env.NODE_ENV === 'production' ? undefined : verificationUrl,
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const token = String(req.body?.token || req.query?.token || '').trim();
  if (!token) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Verification token is required');
  }

  const tokenHash = hashVerificationToken(token);
  const [rows] = await pool.query(
    `SELECT email_verification_tokens.id as token_id, email_verification_tokens.user_id, users.email, users.full_name, users.status
     FROM email_verification_tokens
     INNER JOIN users ON users.id = email_verification_tokens.user_id
     WHERE email_verification_tokens.token_hash = ? AND email_verification_tokens.used_at IS NULL AND email_verification_tokens.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );
  const record = (rows as any[])[0];
  if (!record) {
    return fail(res, 400, 'INVALID_VERIFICATION_TOKEN', 'Verification link is invalid or expired');
  }

  if (record.status !== 'active') {
    await pool.query('UPDATE users SET status = ? WHERE id = ?', ['active', record.user_id]);
    await awardWelcomePoints(record.user_id);
    await awardReferralPoints(record.user_id);
  }
  await pool.query('UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?', [record.token_id]);
  await pool.query('UPDATE auth_identities SET verified = TRUE, updated_at = NOW() WHERE user_id = ? AND provider = ?', [record.user_id, 'password']);

  return ok(res, {
    verified: true,
    message: 'Email verified successfully. You can now sign in.',
    email: record.email,
  });
};

const generateOtpCode = () => crypto.randomInt(100000, 999999).toString();

export const sendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return fail(res, 400, 'VALIDATION_ERROR', 'Phone number is required');

  const otpCode = generateOtpCode();
  await pool.query('UPDATE otp_requests SET used = TRUE WHERE phone = ? AND used = FALSE', [phone]);
  await pool.query(
    'INSERT INTO otp_requests (phone, otp_code, expires_at, created_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), NOW(), FALSE)',
    [phone, otpCode]
  );

  // Temporary flow: return the code directly until SMS provider wiring is added.
  return ok(res, { message: 'OTP generated', otpCode });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, otp_code, full_name, username, email, category_access } = req.body;
  const referralCode = resolveReferralCode(req.body);
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
    const normalizedEmail = normalizeEmail(email) || null;
    const normalizedUsername = normalizeUsername(username) || `kcube_${crypto.randomBytes(4).toString('hex')}`;
    const normalizedFullName = normalizeName(full_name) || 'K-CUBE Member';
    const categoryAccess = category_access || 'category_c';
    const userReferralCode = await generateUniqueReferralCode(normalizedUsername);
    if (referralCode) {
      const referrer = await findReferrerByCode(referralCode);
      if (!referrer) {
        return fail(res, 400, 'INVALID_REFERRAL_CODE', 'Referral code is invalid');
      }
    }
    if (normalizedEmail) {
      const [existingEmailRows] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1', [normalizedEmail]);
      userId = (existingEmailRows as any[])[0]?.id || null;
    }
    if (!userId) {
      const [existingPhoneRows] = await pool.query('SELECT id FROM users WHERE phone = ? LIMIT 1', [phone]);
      userId = (existingPhoneRows as any[])[0]?.id || null;
    }
    const result = await pool.query(
      'INSERT INTO users (full_name, username, email, phone, password_hash, role, category_access, referral_code, referred_by, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
      [normalizedFullName, normalizedUsername, normalizedEmail, phone, '', 'member', categoryAccess, userReferralCode, referralCode || null, 'active']
    );
    userId = (result as any)[0].insertId;
    await awardWelcomePoints(userId);
    await awardReferralPoints(userId, referralCode);
  } else {
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];
    const normalizedFullName = normalizeName(full_name);
    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);
    const categoryAccess = category_access || 'category_c';

    if (normalizedFullName) {
      updateFields.push('full_name = ?');
      updateValues.push(normalizedFullName);
    }
    if (normalizedUsername) {
      updateFields.push('username = ?');
      updateValues.push(normalizedUsername);
    }
    if (normalizedEmail) {
      updateFields.push('email = COALESCE(email, ?)');
      updateValues.push(normalizedEmail);
    }
    if (categoryAccess) {
      updateFields.push('category_access = COALESCE(category_access, ?)');
      updateValues.push(categoryAccess);
    }
    if (updateFields.length) {
      await pool.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, userId]);
    }
  }

  const [userRows] = await pool.query('SELECT id, email, username, full_name, role, category_access, points, referral_code, referred_by FROM users WHERE id = ? LIMIT 1', [userId]);
  const user = (userRows as any[])[0];
  const token = signToken({ id: user.id, role: user.role, category_access: user.category_access }, jwtSecret, '1h');
  const refreshToken = signToken({ id: user.id }, refreshSecret, '30d');

  await pool.query(
    'INSERT IGNORE INTO auth_identities (user_id, provider, provider_user_id, phone, verified, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())',
    [user.id, 'phone_otp', phone, phone],
  );
  return ok(res, {
    user: {
      ...user,
      points: Number(user.points ?? 0),
    },
    token,
    refreshToken,
  });
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const claims = await verifyGoogleCredential(req.body);
    const googleSub = String(claims.sub);
    const email = normalizeEmail(claims.email);
    const fullName = claims.name || email.split('@')[0] || 'K-CUBE Member';
    const profileImage = claims.picture || null;
    const referralCode = resolveReferralCode(req.body);

    const [identityRows] = await pool.query('SELECT user_id FROM auth_identities WHERE provider = ? AND provider_user_id = ? LIMIT 1', ['google', googleSub]);
    let userId = (identityRows as any[])[0]?.user_id;
    let isNewUser = false;

    if (!userId) {
      const [emailRows] = await pool.query(`SELECT ${publicUserSelect}, google_id FROM users WHERE LOWER(email) = ? LIMIT 1`, [email]);
      const existingUser = (emailRows as any[])[0];
      if (existingUser?.google_id && existingUser.google_id !== googleSub) {
        return fail(res, 409, 'GOOGLE_ACCOUNT_CONFLICT', 'This email is linked to another Google account');
      }

      if (existingUser) {
        userId = existingUser.id;
        await pool.query('UPDATE users SET google_id = ?, profile_image = COALESCE(profile_image, ?) WHERE id = ?', [googleSub, profileImage, userId]);
      } else {
        const username = `kcube_${crypto.randomBytes(4).toString('hex')}`;
        if (referralCode) {
          const referrer = await findReferrerByCode(referralCode);
          if (!referrer) {
            return fail(res, 400, 'INVALID_REFERRAL_CODE', 'Referral code is invalid');
          }
        }
        const userReferralCode = await generateUniqueReferralCode(username);
        const result = await pool.query(
          'INSERT INTO users (full_name, username, email, google_id, profile_image, role, category_access, referral_code, referred_by, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
          [fullName, username, email, googleSub, profileImage, 'member', 'category_c', userReferralCode, referralCode || null, 'active']
        );
        userId = (result as any)[0].insertId;
        isNewUser = true;
        await awardWelcomePoints(userId);
        await awardReferralPoints(userId, referralCode);
      }

      await pool.query(
        'INSERT INTO auth_identities (user_id, provider, provider_user_id, email, verified, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())',
        [userId, 'google', googleSub, email],
      );
    }

    const [userRows] = await pool.query(`SELECT ${publicUserSelect} FROM users WHERE id = ? LIMIT 1`, [userId]);
    const user = (userRows as any[])[0];
    const tokens = issueTokens(user);
    return ok(res, {
      user: {
        ...user,
        points: Number(user.points ?? 0),
      },
      ...tokens,
      isNewUser,
    });
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

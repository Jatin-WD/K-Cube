import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../lib/apiResponse';

const profileFields = 'id, full_name, username, email, phone, profile_image, role, category_access, xp, points, level, badges, streak, korea_score, city, state, country, referral_code, referred_by, created_at, last_login, status';
const adminListProfileFields = `
  u.id, u.full_name, u.username, u.email,
  COALESCE(u.phone, india_application.phone) AS phone,
  u.profile_image, u.role, u.category_access, u.admin_scope, u.xp, u.points, u.level, u.badges,
  u.streak, u.korea_score,
  COALESCE(u.city, india_application.current_city) AS city,
  u.state,
  COALESCE(u.country, india_application.nationality) AS country,
  u.referral_code, u.referred_by, u.created_at, u.last_login, u.status
`;

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const [rows] = await pool.query(`SELECT ${profileFields} FROM users WHERE id = ? LIMIT 1`, [userId]);
  const user = (rows as any[])[0];
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
  return ok(res, user);
};

export const getPointsWallet = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const [balanceRows] = await pool.query(
    'SELECT points FROM users WHERE id = ? LIMIT 1',
    [userId],
  );
  const balance = (balanceRows as any[])[0];
  if (!balance) return fail(res, 404, 'NOT_FOUND', 'User not found');

  const [transactionRows] = await pool.query(
    `SELECT id, source_type, source_slug, points_delta, balance_after, status, metadata, created_at
     FROM point_transactions
     WHERE user_id = ?
     ORDER BY created_at DESC, id DESC
     LIMIT 25`,
    [userId],
  );

  const [summaryRows] = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN points_delta > 0 AND status = 'approved' THEN points_delta ELSE 0 END), 0) AS lifetime_earned,
       COALESCE(SUM(CASE WHEN points_delta < 0 AND status = 'approved' THEN ABS(points_delta) ELSE 0 END), 0) AS redeemed,
       COALESCE(SUM(CASE WHEN status = 'pending' THEN points_delta ELSE 0 END), 0) AS pending
     FROM point_transactions
     WHERE user_id = ?`,
    [userId],
  );

  return ok(res, {
    balance: Number(balance.points ?? 0),
    summary: (summaryRows as any[])[0] || { lifetime_earned: 0, redeemed: 0, pending: 0 },
    transactions: transactionRows,
  });
};

export const updateOwnProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const allowed = ['full_name', 'phone', 'city', 'state', 'country', 'profile_image'];
  const entries = Object.entries(req.body || {})
    .filter(([key]) => allowed.includes(key))
    .map(([key, value]) => [key, typeof value === 'string' ? value.trim() || null : value] as const);
  if (!entries.length) return fail(res, 400, 'VALIDATION_ERROR', 'No valid profile changes provided');
  if (entries.some(([key, value]) => key === 'full_name' && (!value || String(value).length < 2))) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Full name must contain at least 2 characters');
  }

  await pool.query(
    `UPDATE users SET ${entries.map(([key]) => `${key} = ?`).join(', ')} WHERE id = ?`,
    [...entries.map(([, value]) => value), userId],
  );
  const [rows] = await pool.query(`SELECT ${profileFields} FROM users WHERE id = ? LIMIT 1`, [userId]);
  return ok(res, (rows as any[])[0] || { id: userId });
};

export const changeOwnPassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const currentPassword = String(req.body?.current_password || '');
  const newPassword = String(req.body?.new_password || '');
  const confirmPassword = String(req.body?.confirm_password || '');
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Current password and a new password of at least 8 characters are required');
  }
  if (newPassword !== confirmPassword) {
    return fail(res, 400, 'VALIDATION_ERROR', 'New password and confirmation do not match');
  }

  const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [userId]);
  const user = (rows as any[])[0];
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
  if (!user.password_hash || !(await bcrypt.compare(currentPassword, String(user.password_hash)))) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
  await pool.query('UPDATE auth_identities SET verified = TRUE, updated_at = NOW() WHERE user_id = ? AND provider = ?', [userId, 'password']);
  return ok(res, { changed: true });
};

export const listUsers = async (req: Request, res: Response) => {
  const { role, status, q } = req.query;
  const where: string[] = [];
  const values: unknown[] = [];
  if (role) {
    where.push('u.role = ?');
    values.push(role);
  }
  if (status) {
    where.push('u.status = ?');
    values.push(status);
  }
  if (q) {
    where.push('(u.full_name LIKE ? OR u.email LIKE ? OR u.username LIKE ?)');
    values.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const [rows] = await pool.query(
    `SELECT ${adminListProfileFields}
     FROM users u
     LEFT JOIN india_pre_selection_applications india_application
       ON india_application.user_id = u.id
       AND india_application.id = (
         SELECT latest_application.id
         FROM india_pre_selection_applications latest_application
         WHERE latest_application.user_id = u.id
         ORDER BY latest_application.updated_at DESC, latest_application.id DESC
         LIMIT 1
       )
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY u.created_at DESC LIMIT 300`,
    values,
  );
  return ok(res, rows);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const allowed = ['full_name', 'phone', 'role', 'category_access', 'status', 'city', 'state', 'country', 'profile_image'];
  const entries = Object.entries(req.body).filter(([key]) => allowed.includes(key));
  if (!entries.length) return fail(res, 400, 'VALIDATION_ERROR', 'No valid changes provided');
  await pool.query(`UPDATE users SET ${entries.map(([key]) => `${key} = ?`).join(', ')} WHERE id = ?`, [...entries.map(([, value]) => value), id]);
  return ok(res, { id: Number(id) });
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return fail(res, 400, 'VALIDATION_ERROR', 'Valid user id is required');
  if (req.user?.id === id) return fail(res, 400, 'VALIDATION_ERROR', 'You cannot delete your own account');
  const [rows] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [id]);
  if (!(rows as any[])[0]) return fail(res, 404, 'NOT_FOUND', 'User not found');
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return ok(res, { id });
};

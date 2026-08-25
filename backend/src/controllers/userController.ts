import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../lib/apiResponse';

const profileFields = 'id, full_name, username, email, phone, profile_image, role, category_access, xp, points, level, badges, streak, korea_score, city, state, country, referral_code, referred_by, created_at, last_login, status';
const adminListProfileFields = `
  u.id, u.full_name, u.username, u.email,
  COALESCE(u.phone, application.phone) AS phone,
  u.profile_image, u.role, u.category_access, u.xp, u.points, u.level, u.badges,
  u.streak, u.korea_score,
  COALESCE(u.city, application.current_city) AS city,
  u.state,
  COALESCE(u.country, application.nationality) AS country,
  u.referral_code, u.referred_by, u.created_at, u.last_login, u.status
`;

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const [rows] = await pool.query(`SELECT ${profileFields} FROM users WHERE id = ? LIMIT 1`, [userId]);
  const user = (rows as any[])[0];
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
  return ok(res, user);
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
     LEFT JOIN (
       SELECT latest.user_id, latest.phone, latest.current_city, latest.nationality
       FROM (
         SELECT a.user_id, a.phone, a.current_city, a.nationality,
           ROW_NUMBER() OVER (PARTITION BY a.user_id ORDER BY a.updated_at DESC, a.id DESC) AS row_number
         FROM india_pre_selection_applications a
       ) latest
       WHERE latest.row_number = 1
     ) application ON application.user_id = u.id
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

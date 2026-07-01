import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../lib/apiResponse';

const profileFields = 'id, full_name, username, email, phone, profile_image, role, category_access, xp, points, level, badges, streak, korea_score, city, state, country, referral_code, referred_by, created_at, last_login, status';

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
    where.push('role = ?');
    values.push(role);
  }
  if (status) {
    where.push('status = ?');
    values.push(status);
  }
  if (q) {
    where.push('(full_name LIKE ? OR email LIKE ? OR username LIKE ?)');
    values.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const [rows] = await pool.query(
    `SELECT ${profileFields} FROM users ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC LIMIT 300`,
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

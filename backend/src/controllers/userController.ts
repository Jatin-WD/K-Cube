import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const [rows] = await pool.query('SELECT id, full_name, username, email, phone, profile_image, xp, points, level, badges, streak, korea_score, city, state, country, referral_code, referred_by, created_at, last_login, status, category_access FROM users WHERE id = ? LIMIT 1', [userId]);
  const user = (rows as any[])[0];
  return res.json({ user });
};

export const listUsers = async (req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT id, full_name, username, city, state, country, level, badges, category_access, role FROM users ORDER BY created_at DESC LIMIT 200');
  return res.json({ data: rows });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  if (!fields) return res.status(400).json({ error: 'No changes provided' });
  await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
  return res.json({ success: true });
};

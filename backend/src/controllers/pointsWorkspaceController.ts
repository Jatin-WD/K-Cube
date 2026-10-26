import { Request, Response } from 'express';
import pool from '../db/pool';
import { ok } from '../lib/apiResponse';

export const listPointBalances = async (req: Request, res: Response) => {
  const pageValue = Number(req.query.page);
  const page = Number.isSafeInteger(pageValue) ? Math.max(1, Math.min(1000000, pageValue)) : 1;
  const size = 40;
  const search = String(req.query.q || '').trim().slice(0, 200);
  const where = "status <> 'deleted' AND role NOT IN ('admin', 'manager')" + (search ? ' AND (full_name LIKE ? OR email LIKE ? OR id = ?)' : '');
  const values = search ? [`%${search}%`, `%${search}%`, Number(search) || 0] : [];
  const [counts] = await pool.query(`SELECT COUNT(*) AS total, COALESCE(SUM(points),0) AS totalPoints FROM users WHERE ${where}`, values);
  const [rows] = await pool.query(`SELECT id, full_name, email, points, status, city, state, country FROM users WHERE ${where} ORDER BY points DESC, id ASC LIMIT ? OFFSET ?`, [...values, size, (page - 1) * size]);
  return ok(res, { users: rows, ...(counts as any[])[0], page, pageSize: size });
};

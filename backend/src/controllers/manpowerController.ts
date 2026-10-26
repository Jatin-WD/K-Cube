import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import pool from '../db/pool';
import { created, fail, ok } from '../lib/apiResponse';
export const applyForManpower = async (req: AuthRequest, res: Response) => {
  const role = String(req.body.role || '').trim();
  const experience = String(req.body.experience || '').trim();
  if (!['Event crew', 'Content & creative', 'Operations'].includes(role) || experience.length < 20 || experience.length > 5000) return fail(res, 400, 'VALIDATION_ERROR', 'Choose a role and describe your experience in 20–5000 characters');
  const [result] = await pool.query('INSERT INTO manpower_applications (user_id, role_interest, experience) VALUES (?, ?, ?)', [req.user!.id, role, experience]);
  return created(res, { id: (result as any).insertId, status: 'submitted' });
};
export const listManpower = async (_req: AuthRequest, res: Response) => {
  const [rows] = await pool.query(`SELECT a.*, u.full_name, u.email, u.phone, u.city, u.state, u.country FROM manpower_applications a JOIN users u ON u.id = a.user_id ORDER BY a.created_at DESC, a.id DESC`);
  return ok(res, rows);
};
export const reviewManpower = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const status = String(req.body.status || '');
  const note = String(req.body.review_note || '').trim();
  if (!Number.isSafeInteger(id) || id <= 0 || !['submitted', 'reviewing', 'accepted', 'rejected'].includes(status) || note.length > 3000) return fail(res, 400, 'VALIDATION_ERROR', 'A valid application, review status and note under 3000 characters are required');
  const [result] = await pool.query('UPDATE manpower_applications SET status = ?, review_note = ?, reviewed_by = ?, updated_at = NOW() WHERE id = ?', [status, note, req.user!.id, id]);
  if (!(result as any).affectedRows) return fail(res, 404, 'NOT_FOUND', 'Application not found');
  return ok(res, { id, status });
};

import { Request, Response } from 'express';
import pool from '../db/pool';
import { awardPoints } from '../services/pointsService';
import { fail, ok } from '../lib/apiResponse';

export const getAdminDashboard = async (_req: Request, res: Response) => {
  const [userCounts] = await pool.query('SELECT COUNT(*) as totalUsers, SUM(points) as totalPoints, SUM(xp) as totalXp FROM users');
  const [chapterCounts] = await pool.query('SELECT COUNT(*) as approvedChapters FROM chapters WHERE status = ?', ['approved']);
  const [activityCounts] = await pool.query('SELECT COUNT(*) as activityEvents FROM activities');
  return ok(res, {
    metrics: {
      ...((userCounts as any[])[0] || {}),
      ...((chapterCounts as any[])[0] || {}),
      ...((activityCounts as any[])[0] || {}),
    },
  });
};

export const manageUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const allowed = ['full_name', 'phone', 'role', 'category_access', 'status', 'city', 'state', 'country', 'profile_image'];
  const entries = Object.entries(req.body).filter(([key]) => allowed.includes(key));
  const fields = entries.map(([key]) => `${key} = ?`).join(', ');
  if (!fields) return fail(res, 400, 'VALIDATION_ERROR', 'No valid changes provided');
  await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...entries.map(([, value]) => value), id]);
  return ok(res, { id: Number(id) });
};

export const approveChapter = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('UPDATE chapters SET status = ? WHERE id = ?', ['approved', id]);
  return ok(res, { chapterId: id });
};

export const publishAnnouncement = async (req: Request, res: Response) => {
  const { title, body, created_by } = req.body;
  if (!title || !body || !created_by) return fail(res, 400, 'VALIDATION_ERROR', 'Missing required fields');
  await pool.query(
    'INSERT INTO admin_announcements (title, body, created_by, tags, status, created_at) VALUES (?, ?, ?, JSON_ARRAY(), ?, NOW())',
    [title, body, created_by, 'published'],
  );
  return ok(res, {});
};

export const getSystemAnalytics = async (_req: Request, res: Response) => {
  const [results] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE status = 'active') as activeUsers,
      (SELECT COUNT(*) FROM session_logs WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)) as sessionsLast24h,
      (SELECT COUNT(*) FROM lessons WHERE active = TRUE) as activeLessons,
      (SELECT COUNT(*) FROM rewards WHERE active = TRUE) as activeRewards
  `);
  return ok(res, { analytics: (results as any[])[0] || {} });
};

export const listContentUploads = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT uploads.*, users.full_name, users.email
    FROM content_uploads uploads
    JOIN users ON users.id = uploads.user_id
    ORDER BY uploads.created_at DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const reviewContentUpload = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, points_reward = 0, review_note } = req.body;
  if (!['approved', 'rejected'].includes(status)) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid status');

  const [rows] = await pool.query('SELECT * FROM content_uploads WHERE id = ? LIMIT 1', [id]);
  const upload = (rows as any[])[0];
  if (!upload) return fail(res, 404, 'NOT_FOUND', 'Upload not found');

  await pool.query(
    'UPDATE content_uploads SET status = ?, points_reward = ?, review_note = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW() WHERE id = ?',
    [status, points_reward, review_note || null, req.user?.id || null, id],
  );

  if (status === 'approved' && Number(points_reward) > 0) {
    await awardPoints({
      userId: upload.user_id,
      sourceType: 'activity',
      sourceSlug: `upload-${id}`,
      points: Number(points_reward),
      metadata: { category: upload.category, title: upload.title, review_note },
      createdBy: req.user?.id || null,
      once: true,
    });
  }

  return ok(res, { id: Number(id), status });
};

export const listPointTransactions = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT tx.*, users.full_name, users.email
    FROM point_transactions tx
    JOIN users ON users.id = tx.user_id
    ORDER BY tx.created_at DESC
    LIMIT 500
  `);
  return ok(res, rows);
};

export const adjustPoints = async (req: any, res: Response) => {
  const { user_id, points_delta, reason } = req.body;
  const points = Number(points_delta);
  if (!user_id || !Number.isFinite(points) || points === 0) return fail(res, 400, 'VALIDATION_ERROR', 'user_id and non-zero points_delta are required');
  const award = await awardPoints({
    userId: Number(user_id),
    sourceType: 'admin_adjustment',
    sourceSlug: `admin-adjustment-${Date.now()}`,
    points,
    metadata: { reason: reason || 'Manual admin adjustment' },
    createdBy: req.user?.id || null,
  });
  return ok(res, { user_id: Number(user_id), points_delta: points, balance: award.balance });
};

export const listKFoodClaims = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT purchases.*, users.full_name, users.email
    FROM kfood_purchases purchases
    JOIN users ON users.id = purchases.user_id
    ORDER BY purchases.created_at DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const reviewKFoodClaim = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, points_reward, review_note } = req.body;
  if (!['approved', 'rejected'].includes(status)) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid status');

  const [rows] = await pool.query('SELECT * FROM kfood_purchases WHERE id = ? LIMIT 1', [id]);
  const claim = (rows as any[])[0];
  if (!claim) return fail(res, 404, 'NOT_FOUND', 'Claim not found');

  const points = Number(points_reward ?? claim.points_reward ?? 0);
  await pool.query(
    'UPDATE kfood_purchases SET status = ?, points_reward = ?, review_note = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW() WHERE id = ?',
    [status, points, review_note || null, req.user?.id || null, id],
  );

  if (status === 'approved' && points > 0) {
    await awardPoints({
      userId: claim.user_id,
      sourceType: 'kfood',
      sourceSlug: `kfood-order-${claim.order_id}`,
      points,
      metadata: { order_id: claim.order_id, order_total: claim.order_total, review_note },
      createdBy: req.user?.id || null,
      once: true,
    });
  }

  return ok(res, { id: Number(id), status });
};

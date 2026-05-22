import { Request, Response } from 'express';
import pool from '../db/pool';
import { awardPoints } from '../services/pointsService';

export const getAdminDashboard = async (req: Request, res: Response) => {
  const [userCounts] = await pool.query('SELECT COUNT(*) as totalUsers, SUM(points) as totalPoints, SUM(xp) as totalXp FROM users');
  const [chapterCounts] = await pool.query('SELECT COUNT(*) as approvedChapters FROM chapters WHERE status = ?', ['approved']);
  const [activityCounts] = await pool.query('SELECT COUNT(*) as activityEvents FROM activities');
  return res.json({
    metrics: {
      ...((userCounts as any[])[0] || {}),
      ...((chapterCounts as any[])[0] || {}),
      ...((activityCounts as any[])[0] || {}),
    },
  });
};

export const manageUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
  if (!fields) return res.status(400).json({ error: 'No changes provided' });
  const values = Object.values(updates);
  await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
  return res.json({ success: true });
};

export const approveChapter = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('UPDATE chapters SET status = ? WHERE id = ?', ['approved', id]);
  return res.json({ success: true, chapterId: id });
};

export const publishAnnouncement = async (req: Request, res: Response) => {
  const { title, body, created_by } = req.body;
  if (!title || !body || !created_by) return res.status(400).json({ error: 'Missing required fields' });
  await pool.query(
    'INSERT INTO admin_announcements (title, body, created_by, tags, status, created_at) VALUES (?, ?, ?, JSON_ARRAY(), ?, NOW())',
    [title, body, created_by, 'published']
  );
  return res.json({ success: true });
};

export const getSystemAnalytics = async (req: Request, res: Response) => {
  const [results] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE status = 'active') as activeUsers,
      (SELECT COUNT(*) FROM session_logs WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)) as sessionsLast24h,
      (SELECT COUNT(*) FROM lessons WHERE active = TRUE) as activeLessons,
      (SELECT COUNT(*) FROM rewards WHERE active = TRUE) as activeRewards
  `);
  return res.json({ analytics: (results as any[])[0] || {} });
};

export const listContentUploads = async (req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT uploads.*, users.full_name, users.email
    FROM content_uploads uploads
    JOIN users ON users.id = uploads.user_id
    ORDER BY uploads.created_at DESC
    LIMIT 300
  `);
  return res.json({ data: rows });
};

export const reviewContentUpload = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, points_reward = 0, review_note } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const [rows] = await pool.query('SELECT * FROM content_uploads WHERE id = ? LIMIT 1', [id]);
  const upload = (rows as any[])[0];
  if (!upload) return res.status(404).json({ error: 'Upload not found' });

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

  return res.json({ success: true });
};

export const listPointTransactions = async (req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT tx.*, users.full_name, users.email
    FROM point_transactions tx
    JOIN users ON users.id = tx.user_id
    ORDER BY tx.created_at DESC
    LIMIT 500
  `);
  return res.json({ data: rows });
};

export const listKFoodClaims = async (req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT purchases.*, users.full_name, users.email
    FROM kfood_purchases purchases
    JOIN users ON users.id = purchases.user_id
    ORDER BY purchases.created_at DESC
    LIMIT 300
  `);
  return res.json({ data: rows });
};

export const reviewKFoodClaim = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, points_reward, review_note } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const [rows] = await pool.query('SELECT * FROM kfood_purchases WHERE id = ? LIMIT 1', [id]);
  const claim = (rows as any[])[0];
  if (!claim) return res.status(404).json({ error: 'Claim not found' });

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

  return res.json({ success: true });
};

import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { awardPoints } from '../services/pointsService';

export const createContentUpload = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { category, title, description, video_url, thumbnail_url } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!category || !title || !video_url) return res.status(400).json({ error: 'Category, title and video URL are required' });

  const [result] = await pool.query(
    `INSERT INTO content_uploads
      (user_id, category, title, description, video_url, thumbnail_url, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
    [userId, category, title, description || null, video_url, thumbnail_url || null],
  );

  return res.status(201).json({ success: true, uploadId: (result as any).insertId });
};

export const listMyUploads = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const [rows] = await pool.query('SELECT * FROM content_uploads WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return res.json({ data: rows });
};

export const completeLesson = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { lesson_id, accuracy = 100 } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!lesson_id) return res.status(400).json({ error: 'Lesson ID is required' });

  const [lessonRows] = await pool.query('SELECT id, slug, points_reward FROM lessons WHERE id = ? AND active = TRUE LIMIT 1', [lesson_id]);
  const lesson = (lessonRows as any[])[0];
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  await pool.query(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed, accuracy, streak, updated_at)
     VALUES (?, ?, TRUE, ?, 1, NOW())
     ON DUPLICATE KEY UPDATE completed = TRUE, accuracy = VALUES(accuracy), streak = streak + 1, updated_at = NOW()`,
    [userId, lesson_id, accuracy],
  );

  const points = Number(lesson.points_reward || 40);
  const award = await awardPoints({
    userId,
    sourceType: 'lesson',
    sourceSlug: `lesson-${lesson.slug}`,
    points,
    metadata: { lesson_id, accuracy },
    once: true,
  });

  return res.json({ success: true, pointsAwarded: award.awarded ? points : 0, balance: award.balance });
};

export const trackKFoodClick = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || null;
  const { item_slug, action = 'visit_kfood', source = 'kcube' } = req.body;
  await pool.query(
    'INSERT INTO kfood_clicks (user_id, item_slug, action, source, created_at) VALUES (?, ?, ?, ?, NOW())',
    [userId, item_slug || null, action, source],
  );
  return res.json({ success: true, redirectUrl: `https://k-food.in/?kcube_source=${encodeURIComponent(String(source))}&item=${encodeURIComponent(String(item_slug || 'home'))}` });
};

export const claimKFoodPurchase = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { order_id, order_total, coupon_code } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!order_id) return res.status(400).json({ error: 'Order ID is required' });

  const [existing] = await pool.query('SELECT id FROM kfood_purchases WHERE order_id = ? LIMIT 1', [order_id]);
  if ((existing as any[]).length) return res.status(409).json({ error: 'Order already claimed' });

  const points = Math.max(50, Math.floor(Number(order_total || 0) / 10));
  await pool.query(
    `INSERT INTO kfood_purchases
      (user_id, order_id, order_total, coupon_code, status, points_reward, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'pending_review', ?, NOW(), NOW())`,
    [userId, order_id, Number(order_total || 0), coupon_code || null, points],
  );

  return res.status(201).json({ success: true, status: 'pending_review', estimatedPoints: points });
};

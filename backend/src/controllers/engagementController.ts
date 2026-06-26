import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { awardPoints } from '../services/pointsService';
import { created, fail, ok } from '../lib/apiResponse';

export const createContentUpload = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { category, title, description, video_url, thumbnail_url } = req.body;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  if (!category || !title || !video_url) return fail(res, 400, 'VALIDATION_ERROR', 'Category, title and video URL are required');

  const [result] = await pool.query(
    `INSERT INTO content_uploads
      (user_id, category, title, description, video_url, thumbnail_url, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
    [userId, category, title, description || null, video_url, thumbnail_url || null],
  );

  return created(res, { uploadId: (result as any).insertId });
};

export const listMyUploads = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const [rows] = await pool.query('SELECT * FROM content_uploads WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return ok(res, rows);
};

export const completeLesson = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { lesson_id, accuracy = 100 } = req.body;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  if (!lesson_id) return fail(res, 400, 'VALIDATION_ERROR', 'Lesson ID is required');

  const [lessonRows] = await pool.query('SELECT id, slug, points_reward FROM lessons WHERE id = ? AND active = TRUE LIMIT 1', [lesson_id]);
  const lesson = (lessonRows as any[])[0];
  if (!lesson) return fail(res, 404, 'NOT_FOUND', 'Lesson not found');

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

  return ok(res, { pointsAwarded: award.awarded ? points : 0, balance: award.balance });
};

export const trackKFoodClick = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || null;
  const { item_slug, action = 'visit_kfood', source = 'kcube' } = req.body;
  await pool.query(
    'INSERT INTO kfood_clicks (user_id, item_slug, action, source, created_at) VALUES (?, ?, ?, ?, NOW())',
    [userId, item_slug || null, action, source],
  );
  return ok(res, { redirectUrl: `https://k-food.in/?kcube_source=${encodeURIComponent(String(source))}&item=${encodeURIComponent(String(item_slug || 'home'))}` });
};

export const claimKFoodPurchase = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { order_id, order_total, coupon_code } = req.body;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  if (!order_id) return fail(res, 400, 'VALIDATION_ERROR', 'Order ID is required');

  const [existing] = await pool.query('SELECT id FROM kfood_purchases WHERE order_id = ? LIMIT 1', [order_id]);
  if ((existing as any[]).length) return fail(res, 409, 'ORDER_ALREADY_CLAIMED', 'Order already claimed');

  const points = Math.max(50, Math.floor(Number(order_total || 0) / 10));
  await pool.query(
    `INSERT INTO kfood_purchases
      (user_id, order_id, order_total, coupon_code, status, points_reward, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'pending_review', ?, NOW(), NOW())`,
    [userId, order_id, Number(order_total || 0), coupon_code || null, points],
  );

  return created(res, { status: 'pending_review', estimatedPoints: points });
};

export const trackLearningCourseAction = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || null;
  const { course_id, course_title, track_slug, action, price = 0, points_reward = 0, metadata = {} } = req.body;
  if (!course_id || !course_title || !track_slug || !['cart', 'trial', 'purchase'].includes(action)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'course_id, course_title, track_slug and valid action are required');
  }

  const points = Number(points_reward || (action === 'cart' ? 10 : action === 'trial' ? 40 : 250));
  const [result] = await pool.query(
    `INSERT INTO learning_course_orders
      (user_id, course_id, course_title, track_slug, action, price, points_reward, status, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [userId, course_id, course_title, track_slug, action, Number(price || 0), points, action === 'cart' ? 'pending' : 'confirmed', JSON.stringify(metadata)],
  );

  let balance;
  if (userId && points > 0) {
    const award = await awardPoints({
      userId,
      sourceType: 'lesson',
      sourceSlug: `course-${action}-${course_id}`,
      points,
      metadata: { course_id, course_title, track_slug, action, price },
      once: action !== 'purchase',
    });
    balance = award.balance;
  }

  return created(res, { id: (result as any).insertId, action, pointsReward: points, balance });
};

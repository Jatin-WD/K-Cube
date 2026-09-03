import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
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
  const {
    lesson_id,
    accuracy = 100,
    track_slug,
    session_seed,
    attempts = [],
    metadata = {},
    total_questions,
    correct_answers,
    session_points,
  } = req.body;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const normalizeDate = (value: Date) =>
    value.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  if (track_slug) {
    const sessionMeta = typeof metadata === 'string'
      ? (() => {
          try {
            return JSON.parse(metadata);
          } catch {
            return {};
          }
        })()
      : metadata || {};

    const completionSeed = String(session_seed || sessionMeta.sessionSeed || `${track_slug}-${Date.now()}`);
    const attemptList = Array.isArray(attempts) ? attempts : [];
    const trackTitle = sessionMeta.trackTitle || sessionMeta.title || track_slug;
    const trackEyebrow = sessionMeta.trackEyebrow || sessionMeta.eyebrow || 'Learning track';
    const trackIntro = sessionMeta.trackIntro || sessionMeta.intro || `Auto-synced track data for ${track_slug}.`;
    const trackAccent = sessionMeta.trackAccent || sessionMeta.accent || '#19c37d';
    const rewardPoints = 0;
    const bankSize = Number(sessionMeta.trackBankSize ?? attemptList.length ?? 0);
    const stepSize = Number(sessionMeta.trackStepSize ?? 10);
    const overview = Array.isArray(sessionMeta.trackOverview) ? sessionMeta.trackOverview : [];
    const loginCopy = Array.isArray(sessionMeta.trackLoginCopy) ? sessionMeta.trackLoginCopy : [];

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `
          INSERT INTO learning_tracks
            (slug, title, eyebrow, intro, accent, reward_points, bank_size, step_size, overview, login_copy, active, sort_order, created_by, updated_by, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, 0, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            eyebrow = VALUES(eyebrow),
            intro = VALUES(intro),
            accent = VALUES(accent),
            reward_points = VALUES(reward_points),
            bank_size = GREATEST(bank_size, VALUES(bank_size)),
            step_size = VALUES(step_size),
            overview = VALUES(overview),
            login_copy = VALUES(login_copy),
            active = TRUE,
            updated_by = VALUES(updated_by),
            updated_at = NOW()
        `,
        [track_slug, trackTitle, trackEyebrow, trackIntro, trackAccent, rewardPoints, bankSize, stepSize, JSON.stringify(overview), JSON.stringify(loginCopy), userId, userId],
      );

      const [trackRows] = await connection.query('SELECT id, slug, reward_points FROM learning_tracks WHERE slug = ? LIMIT 1', [track_slug]);
      const track = (trackRows as any[])[0];
      if (!track) {
        await connection.rollback();
        return fail(res, 404, 'NOT_FOUND', 'Learning track not found');
      }

      const [progressRows] = await connection.query(
        'SELECT * FROM user_learning_progress WHERE user_id = ? AND track_id = ? LIMIT 1 FOR UPDATE',
        [userId, track.id],
      );
      const progress = (progressRows as any[])[0];
      const now = new Date();
      const todayStamp = normalizeDate(now);
      const yesterdayStamp = normalizeDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
      const lastStamp = progress?.last_completed_at ? normalizeDate(new Date(progress.last_completed_at)) : null;

      let currentStreak = Number(progress?.current_streak || 0);
      if (!progress) {
        currentStreak = 1;
      } else if (lastStamp === todayStamp) {
        currentStreak = Math.max(currentStreak, 1);
      } else if (lastStamp === yesterdayStamp) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      const correctCount = attemptList.filter((attempt: any) => Boolean(attempt?.isCorrect ?? attempt?.is_correct)).length;
      const resolvedTotalQuestions = Number(total_questions ?? attemptList.length ?? 0);
      const resolvedCorrectAnswers = Number(correct_answers ?? correctCount);
      const resolvedAccuracy = resolvedTotalQuestions > 0
        ? Number(((resolvedCorrectAnswers / resolvedTotalQuestions) * 100).toFixed(2))
        : Number(accuracy || 100);
      const resolvedSessionPoints = 0;

      const [sessionInsert] = await connection.query(
        `
          INSERT INTO learning_sessions
            (user_id, track_id, session_seed, total_questions, correct_answers, session_points, accuracy, streak_before, streak_after, completed_at, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `,
        [userId, track.id, completionSeed, resolvedTotalQuestions, resolvedCorrectAnswers, resolvedSessionPoints, resolvedAccuracy, Number(progress?.current_streak || 0), currentStreak],
      );
      const sessionId = (sessionInsert as any).insertId;

      for (const [index, attempt] of attemptList.entries()) {
        const questionKey = String(attempt?.questionKey ?? attempt?.question_key ?? attempt?.questionId ?? attempt?.question_id ?? `question-${index + 1}`);
        await connection.query(
          `
            INSERT INTO learning_session_answers
              (session_id, question_id, question_key, user_answer, expected_answer, is_correct, points_awarded, answered_at)
            VALUES (?, NULL, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
              user_answer = VALUES(user_answer),
              expected_answer = VALUES(expected_answer),
              is_correct = VALUES(is_correct),
              points_awarded = VALUES(points_awarded),
              answered_at = NOW()
          `,
          [
            sessionId,
            questionKey,
            String(attempt?.userAnswer ?? attempt?.user_answer ?? ''),
            String(attempt?.expectedAnswer ?? attempt?.expected_answer ?? ''),
            Boolean(attempt?.isCorrect ?? attempt?.is_correct) ? 1 : 0,
            0,
          ],
        );
      }

      await connection.query(
        `
          INSERT INTO user_learning_progress
            (user_id, track_id, current_streak, best_streak, last_completed_at, last_session_id, total_sessions, total_correct, total_points, updated_at)
          VALUES (?, ?, ?, ?, NOW(), ?, 1, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            current_streak = VALUES(current_streak),
            best_streak = GREATEST(best_streak, VALUES(best_streak)),
            last_completed_at = VALUES(last_completed_at),
            last_session_id = VALUES(last_session_id),
            total_sessions = total_sessions + 1,
            total_correct = total_correct + VALUES(total_correct),
            total_points = total_points + VALUES(total_points),
            updated_at = NOW()
        `,
        [userId, track.id, currentStreak, Math.max(Number(progress?.best_streak || 0), currentStreak), sessionId, resolvedCorrectAnswers, resolvedSessionPoints],
      );

      await connection.commit();

      return ok(res, {
        sessionId,
        trackSlug: track.slug,
        totalQuestions: resolvedTotalQuestions,
        correctAnswers: resolvedCorrectAnswers,
        accuracy: resolvedAccuracy,
        streak: currentStreak,
        pointsAwarded: 0,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  if (!lesson_id) return fail(res, 400, 'VALIDATION_ERROR', 'Lesson ID is required');

  const [lessonRows] = await pool.query('SELECT id, slug FROM lessons WHERE id = ? AND active = TRUE LIMIT 1', [lesson_id]);
  const lesson = (lessonRows as any[])[0];
  if (!lesson) return fail(res, 404, 'NOT_FOUND', 'Lesson not found');

  await pool.query(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed, accuracy, streak, updated_at)
     VALUES (?, ?, TRUE, ?, 1, NOW())
     ON DUPLICATE KEY UPDATE completed = TRUE, accuracy = VALUES(accuracy), streak = streak + 1, updated_at = NOW()`,
    [userId, lesson_id, accuracy],
  );

  return ok(res, { pointsAwarded: 0 });
};

export const trackKFoodClick = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || null;
  const { item_slug, action = 'visit_kfood', source = 'kcube' } = req.body;
  await pool.query(
    'INSERT INTO kfood_clicks (user_id, item_slug, action, source, created_at) VALUES (?, ?, ?, ?, NOW())',
    [userId, item_slug || null, action, source],
  );
  return ok(res, { redirectUrl: '/shop' });
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
  const { course_id, course_title, track_slug, action, price = 0, metadata = {} } = req.body;
  if (!course_id || !course_title || !track_slug || !['cart', 'trial', 'purchase'].includes(action)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'course_id, course_title, track_slug and valid action are required');
  }

  const points = 0;
  const [result] = await pool.query(
    `INSERT INTO learning_course_orders
      (user_id, course_id, course_title, track_slug, action, price, points_reward, status, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [userId, course_id, course_title, track_slug, action, Number(price || 0), points, action === 'cart' ? 'pending' : 'confirmed', JSON.stringify(metadata)],
  );

  return created(res, { id: (result as any).insertId, action, pointsReward: 0 });
};

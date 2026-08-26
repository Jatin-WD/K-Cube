import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { created, fail, ok } from '../lib/apiResponse';

type QuizType = 'choice' | 'cards' | 'arrange' | 'listen' | 'speak' | 'match';

const asArray = (value: unknown, fallback: unknown[] = []) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const parseJson = <T,>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
};

const mapQuestion = (row: any) => ({
  id: Number(row.id),
  questionKey: row.question_key,
  type: row.type as QuizType,
  tag: row.tag,
  prompt: row.prompt,
  korean: row.korean,
  answer: row.answer,
  options: asArray(row.options, []),
  words: asArray(row.words, []),
  cards: asArray(row.cards, []),
  pairs: asArray(row.pairs, []),
  hint: row.hint,
  points: Number(row.points || 0),
  active: Boolean(row.active),
  sortOrder: Number(row.sort_order || 0),
});

const mapTrack = (row: any, questions: any[] = []) => ({
  id: Number(row.id),
  slug: row.slug,
  title: row.title,
  eyebrow: row.eyebrow,
  intro: row.intro,
  accent: row.accent,
  rewardPoints: Number(row.reward_points || 0),
  bankSize: Number(row.bank_size || questions.length || 0),
  stepSize: Number(row.step_size || 10),
  overview: asArray(row.overview, []),
  loginCopy: asArray(row.login_copy, []),
  active: Boolean(row.active),
  sortOrder: Number(row.sort_order || 0),
  questionPool: questions,
});

const loadTrackBySlug = async (slug: string) => {
  const [trackRows] = await pool.query('SELECT * FROM learning_tracks WHERE slug = ? LIMIT 1', [slug]);
  const track = (trackRows as any[])[0];
  if (!track) return null;

  const [questionRows] = await pool.query(
    'SELECT * FROM learning_questions WHERE track_id = ? AND active = TRUE ORDER BY sort_order ASC, id ASC',
    [track.id],
  );

  return mapTrack(track, (questionRows as any[]).map(mapQuestion));
};

export const listLearningTracks = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT t.*, COUNT(q.id) AS question_count
    FROM learning_tracks t
    LEFT JOIN learning_questions q ON q.track_id = t.id AND q.active = TRUE
    GROUP BY t.id
    ORDER BY t.sort_order ASC, t.id ASC
  `);

  return ok(
    res,
    (rows as any[]).map((row) => ({
      ...mapTrack(row),
      bankSize: Number(row.question_count || row.bank_size || 0),
      questionPool: undefined,
    })),
  );
};

export const getLearningTrack = async (req: Request, res: Response) => {
  const track = await loadTrackBySlug(String(req.params.slug));
  if (!track) return fail(res, 404, 'NOT_FOUND', 'Learning track not found');
  return ok(res, track);
};

export const listMyLearningProgress = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const [rows] = await pool.query(
    `
      SELECT p.*, t.slug, t.title, t.eyebrow, t.accent
      FROM user_learning_progress p
      JOIN learning_tracks t ON t.id = p.track_id
      WHERE p.user_id = ?
      ORDER BY p.updated_at DESC
    `,
    [userId],
  );

  const [sessions] = await pool.query(
    `
      SELECT s.*, t.slug, t.title
      FROM learning_sessions s
      JOIN learning_tracks t ON t.id = s.track_id
      WHERE s.user_id = ?
      ORDER BY s.completed_at DESC
      LIMIT 50
    `,
    [userId],
  );

  return ok(res, {
    progress: (rows as any[]).map((row) => ({
      trackSlug: row.slug,
      trackTitle: row.title,
      eyebrow: row.eyebrow,
      accent: row.accent,
      currentStreak: Number(row.current_streak || 0),
      bestStreak: Number(row.best_streak || 0),
      lastCompletedAt: row.last_completed_at,
      totalSessions: Number(row.total_sessions || 0),
      totalCorrect: Number(row.total_correct || 0),
      totalPoints: Number(row.total_points || 0),
    })),
    sessions: (sessions as any[]).map((row) => ({
      id: Number(row.id),
      trackSlug: row.slug,
      trackTitle: row.title,
      totalQuestions: Number(row.total_questions || 0),
      correctAnswers: Number(row.correct_answers || 0),
      sessionPoints: Number(row.session_points || 0),
      accuracy: Number(row.accuracy || 0),
      streakBefore: Number(row.streak_before || 0),
      streakAfter: Number(row.streak_after || 0),
      completedAt: row.completed_at,
    })),
  });
};

export const adminListLearningTracks = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT t.*, COUNT(q.id) AS question_count
    FROM learning_tracks t
    LEFT JOIN learning_questions q ON q.track_id = t.id
    GROUP BY t.id
    ORDER BY t.sort_order ASC, t.id ASC
  `);

  return ok(
    res,
    (rows as any[]).map((row) => ({
      ...mapTrack(row),
      bankSize: Number(row.question_count || row.bank_size || 0),
      questionPool: undefined,
    })),
  );
};

export const adminUpsertLearningTrack = async (req: AuthRequest, res: Response) => {
  const { id, slug, title, eyebrow, intro, accent = '#19c37d', rewardPoints = 0, stepSize = 10, overview = [], loginCopy = [], active = true, sortOrder = 0 } = req.body;
  if (!slug || !title || !eyebrow || !intro) {
    return fail(res, 400, 'VALIDATION_ERROR', 'slug, title, eyebrow and intro are required');
  }

  const createPayload = [
    slug,
    title,
    eyebrow,
    intro,
    accent,
    Number(rewardPoints || 0),
    Number(stepSize || 10),
    JSON.stringify(asArray(overview, [])),
    JSON.stringify(asArray(loginCopy, [])),
    Boolean(active) ? 1 : 0,
    Number(sortOrder || 0),
    req.user?.id || null,
    req.user?.id || null,
  ];

  if (id) {
    const updatePayload = [
      slug,
      title,
      eyebrow,
      intro,
      accent,
      Number(rewardPoints || 0),
      Number(stepSize || 10),
      JSON.stringify(asArray(overview, [])),
      JSON.stringify(asArray(loginCopy, [])),
      Boolean(active) ? 1 : 0,
      Number(sortOrder || 0),
      req.user?.id || null,
      id,
    ];
    await pool.query(
      `
        UPDATE learning_tracks
        SET slug = ?, title = ?, eyebrow = ?, intro = ?, accent = ?, reward_points = ?, step_size = ?,
            overview = ?, login_copy = ?, active = ?, sort_order = ?, updated_by = ?, updated_at = NOW()
        WHERE id = ?
      `,
      updatePayload,
    );
    return ok(res, { id: Number(id) });
  }

  const [result] = await pool.query(
    `
      INSERT INTO learning_tracks
        (slug, title, eyebrow, intro, accent, reward_points, step_size, overview, login_copy, active, sort_order, created_by, updated_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    createPayload,
  );

  return created(res, { id: (result as any).insertId });
};

export const adminDeleteLearningTrack = async (req: Request, res: Response) => {
  await pool.query('DELETE FROM learning_tracks WHERE id = ?', [req.params.id]);
  return ok(res, { id: Number(req.params.id) });
};

export const adminListLearningQuestions = async (req: Request, res: Response) => {
  const { trackId } = req.query;
  const params: any[] = [];
  let sql = `
    SELECT q.*, t.slug AS track_slug, t.title AS track_title
    FROM learning_questions q
    JOIN learning_tracks t ON t.id = q.track_id
  `;
  if (trackId) {
    sql += ' WHERE q.track_id = ?';
    params.push(String(trackId));
  }
  sql += ' ORDER BY q.sort_order ASC, q.id ASC LIMIT 500';

  const [rows] = await pool.query(sql, params);
  return ok(
    res,
    (rows as any[]).map((row) => ({
      id: Number(row.id),
      trackId: Number(row.track_id),
      trackSlug: row.track_slug,
      trackTitle: row.track_title,
      questionKey: row.question_key,
      type: row.type,
      tag: row.tag,
      prompt: row.prompt,
      korean: row.korean,
      answer: row.answer,
      options: asArray(row.options, []),
      words: asArray(row.words, []),
      cards: asArray(row.cards, []),
      pairs: asArray(row.pairs, []),
      hint: row.hint,
      points: Number(row.points || 0),
      sortOrder: Number(row.sort_order || 0),
      active: Boolean(row.active),
    })),
  );
};

export const adminUpsertLearningQuestion = async (req: AuthRequest, res: Response) => {
  const {
    id,
    trackId,
    questionKey,
    type,
    tag,
    prompt,
    korean,
    answer,
    options = [],
    words = [],
    cards = [],
    pairs = [],
    hint,
    points = 0,
    sortOrder = 0,
    active = true,
  } = req.body;

  if (!trackId || !questionKey || !type || !tag || !prompt || !korean || !answer || !hint) {
    return fail(res, 400, 'VALIDATION_ERROR', 'trackId, questionKey, type, tag, prompt, korean, answer and hint are required');
  }

  const values = [
    Number(trackId),
    String(questionKey),
    type,
    tag,
    prompt,
    korean,
    answer,
    JSON.stringify(asArray(options, [])),
    JSON.stringify(asArray(words, [])),
    JSON.stringify(asArray(cards, [])),
    JSON.stringify(asArray(pairs, [])),
    hint,
    Number(points || 0),
    Number(sortOrder || 0),
    Boolean(active) ? 1 : 0,
    req.user?.id || null,
    req.user?.id || null,
  ];

  if (id) {
    const updateValues = [
      Number(trackId),
      String(questionKey),
      type,
      tag,
      prompt,
      korean,
      answer,
      JSON.stringify(asArray(options, [])),
      JSON.stringify(asArray(words, [])),
      JSON.stringify(asArray(cards, [])),
      JSON.stringify(asArray(pairs, [])),
      hint,
      Number(points || 0),
      Number(sortOrder || 0),
      Boolean(active) ? 1 : 0,
      req.user?.id || null,
      id,
    ];
    await pool.query(
      `
        UPDATE learning_questions
        SET track_id = ?, question_key = ?, type = ?, tag = ?, prompt = ?, korean = ?, answer = ?,
            options = ?, words = ?, cards = ?, pairs = ?, hint = ?, points = ?, sort_order = ?, active = ?,
            updated_by = ?, updated_at = NOW()
        WHERE id = ?
      `,
      updateValues,
    );
    return ok(res, { id: Number(id) });
  }

  const [result] = await pool.query(
    `
      INSERT INTO learning_questions
        (track_id, question_key, type, tag, prompt, korean, answer, options, words, cards, pairs, hint, points, sort_order, active, created_by, updated_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    values,
  );

  await pool.query('UPDATE learning_tracks SET bank_size = (SELECT COUNT(*) FROM learning_questions WHERE track_id = ? AND active = TRUE), updated_by = ?, updated_at = NOW() WHERE id = ?', [
    Number(trackId),
    req.user?.id || null,
    Number(trackId),
  ]);

  return created(res, { id: (result as any).insertId });
};

export const adminDeleteLearningQuestion = async (req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT track_id FROM learning_questions WHERE id = ? LIMIT 1', [req.params.id]);
  const question = (rows as any[])[0];
  await pool.query('DELETE FROM learning_questions WHERE id = ?', [req.params.id]);
  if (question?.track_id) {
    await pool.query(
      'UPDATE learning_tracks SET bank_size = (SELECT COUNT(*) FROM learning_questions WHERE track_id = ? AND active = TRUE), updated_at = NOW() WHERE id = ?',
      [question.track_id, question.track_id],
    );
  }
  return ok(res, { id: Number(req.params.id) });
};

export const listCmsPages = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(
    'SELECT * FROM cms_pages ORDER BY page_type ASC, created_at DESC',
  );
  return ok(
    res,
    (rows as any[]).map((row) => ({
      id: Number(row.id),
      slug: row.slug,
      pageType: row.page_type,
      titleEn: row.title_en,
      titleKo: row.title_ko,
      titleHi: row.title_hi,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      status: row.status,
      publishedAt: row.published_at,
    })),
  );
};

export const getPublicCmsPage = async (req: Request, res: Response) => {
  const [rows] = await pool.query(
    `SELECT id, slug, page_type, title_en, title_ko, title_hi, seo_title, seo_description, status
     FROM cms_pages
     WHERE slug = ? AND status = 'published'
     LIMIT 1`,
    [req.params.slug],
  );
  const page = (rows as any[])[0];
  if (!page) return fail(res, 404, 'NOT_FOUND', 'Published CMS page not found');

  const [blockRows] = await pool.query(
    `SELECT block_key, block_type, content_en, content_ko, content_hi
     FROM cms_blocks
     WHERE page_id = ? AND status = 'published'
     ORDER BY sort_order ASC, id ASC`,
    [page.id],
  );
  return ok(res, {
    id: Number(page.id),
    slug: page.slug,
    pageType: page.page_type,
    titleEn: page.title_en,
    titleKo: page.title_ko,
    titleHi: page.title_hi,
    seoTitle: page.seo_title,
    seoDescription: page.seo_description,
    status: page.status,
    blocks: (blockRows as any[]).map((block) => ({
      blockKey: block.block_key,
      blockType: block.block_type,
      contentEn: block.content_en,
      contentKo: block.content_ko,
      contentHi: block.content_hi,
    })),
  });
};

export const upsertCmsPage = async (req: AuthRequest, res: Response) => {
  const { id, slug, pageType, titleEn, titleKo = null, titleHi = null, seoTitle = null, seoDescription = null, status = 'draft' } = req.body;
  if (!slug || !pageType || !titleEn) {
    return fail(res, 400, 'VALIDATION_ERROR', 'slug, pageType and titleEn are required');
  }

  if (id) {
    await pool.query(
      `
        UPDATE cms_pages
        SET slug = ?, page_type = ?, title_en = ?, title_ko = ?, title_hi = ?, seo_title = ?, seo_description = ?, status = ?, updated_by = ?, published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END, updated_at = NOW()
        WHERE id = ?
      `,
      [slug, pageType, titleEn, titleKo, titleHi, seoTitle, seoDescription, status, req.user?.id || null, status, id],
    );
    return ok(res, { id: Number(id) });
  }

  const [result] = await pool.query(
    `
      INSERT INTO cms_pages
        (slug, page_type, title_en, title_ko, title_hi, seo_title, seo_description, status, created_by, updated_by, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'published' THEN NOW() ELSE NULL END, NOW(), NOW())
    `,
    [slug, pageType, titleEn, titleKo, titleHi, seoTitle, seoDescription, status, req.user?.id || null, req.user?.id || null, status],
  );

  return created(res, { id: (result as any).insertId });
};

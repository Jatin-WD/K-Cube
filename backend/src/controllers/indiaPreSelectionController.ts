import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { awardPoints } from '../services/pointsService';
import { created, fail, ok } from '../lib/apiResponse';

const APPLICATION_POINTS = 130;
const APPLICATION_SOURCE_SLUG = 'india-pre-selection-application';

const applicationFields = `
  id, user_id, full_name, email, phone, nationality, current_city, date_of_birth,
  performance_category, biography, video_link, message, status, points_awarded,
  submitted_at, updated_at
`;

const cleanText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const cleanNullableText = (value: unknown) => {
  const text = cleanText(value);
  return text.length ? text : null;
};

const parseDate = (value: unknown) => {
  const text = cleanText(value);
  if (!text) return null;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
};

const getCurrentUser = async (userId: number) => {
  const [rows] = await pool.query(
    'SELECT id, full_name, email, phone FROM users WHERE id = ? LIMIT 1',
    [userId],
  );
  return (rows as any[])[0] || null;
};

export const getMyIndiaPreSelectionApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const [rows] = await pool.query(
    `SELECT ${applicationFields} FROM india_pre_selection_applications WHERE user_id = ? LIMIT 1`,
    [req.user.id],
  );

  const application = (rows as any[])[0] || null;
  return ok(res, { application });
};

export const submitIndiaPreSelectionApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const user = await getCurrentUser(req.user.id);
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');

  const fullName = cleanText(req.body.full_name || user.full_name);
  const email = cleanText(req.body.email || user.email);
  const phone = cleanNullableText(req.body.phone || user.phone);
  const nationality = cleanNullableText(req.body.nationality);
  const currentCity = cleanNullableText(req.body.current_city);
  const dateOfBirth = parseDate(req.body.date_of_birth);
  const performanceCategory = cleanText(req.body.performance_category);
  const biography = cleanNullableText(req.body.biography);
  const videoLink = cleanText(req.body.video_link);
  const message = cleanNullableText(req.body.message);

  if (!fullName || !email || !performanceCategory || !videoLink) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Full name, email, performance category and video link are required');
  }

  if (dateOfBirth === undefined) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Date of birth must be a valid date');
  }

  const [existingRows] = await pool.query(
    `SELECT ${applicationFields} FROM india_pre_selection_applications WHERE user_id = ? LIMIT 1`,
    [req.user.id],
  );
  const existing = (existingRows as any[])[0] || null;

  const values = [
    req.user.id,
    fullName,
    email,
    phone,
    nationality,
    currentCity,
    dateOfBirth,
    performanceCategory,
    biography,
    videoLink,
    message,
  ];

  let applicationId = existing?.id || null;
  let isNewApplication = false;

  if (existing) {
    await pool.query(
      `UPDATE india_pre_selection_applications
       SET full_name = ?, email = ?, phone = ?, nationality = ?, current_city = ?, date_of_birth = ?,
           performance_category = ?, biography = ?, video_link = ?, message = ?, status = 'submitted', updated_at = NOW()
       WHERE user_id = ?`,
      [...values.slice(1), req.user.id],
    );
  } else {
    const [result] = await pool.query(
      `INSERT INTO india_pre_selection_applications
        (user_id, full_name, email, phone, nationality, current_city, date_of_birth, performance_category, biography, video_link, message, status, points_awarded, submitted_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, NOW(), NOW())`,
      [
        req.user.id,
        fullName,
        email,
        phone,
        nationality,
        currentCity,
        dateOfBirth,
        performanceCategory,
        biography,
        videoLink,
        message,
        APPLICATION_POINTS,
      ],
    );
    applicationId = (result as any).insertId;
    isNewApplication = true;
  }

  const [latestRows] = await pool.query(
    `SELECT ${applicationFields} FROM india_pre_selection_applications WHERE user_id = ? LIMIT 1`,
    [req.user.id],
  );
  const application = (latestRows as any[])[0] || null;

  let awardedPoints = 0;
  let balance: number | null = null;

  if (isNewApplication) {
    const award = await awardPoints({
      userId: req.user.id,
      sourceType: 'event',
      sourceSlug: APPLICATION_SOURCE_SLUG,
      points: APPLICATION_POINTS,
      metadata: {
        application_id: applicationId,
        application_type: 'india_pre_selection',
        performance_category: performanceCategory,
      },
      createdBy: req.user.id,
      once: true,
    });
    awardedPoints = award.awarded ? APPLICATION_POINTS : 0;
    balance = award.awarded ? (award.balance ?? null) : null;
    if (awardedPoints > 0) {
      await pool.query(
        'UPDATE india_pre_selection_applications SET points_awarded = ? WHERE user_id = ?',
        [APPLICATION_POINTS, req.user.id],
      );
    }
  } else {
    awardedPoints = Number(application?.points_awarded || 0);
  }

  const [responseRows] = await pool.query(
    `SELECT ${applicationFields} FROM india_pre_selection_applications WHERE user_id = ? LIMIT 1`,
    [req.user.id],
  );

  return (isNewApplication ? created : ok)(res, {
    application: (responseRows as any[])[0] || application,
    points_awarded: awardedPoints,
    points_balance: balance,
    submitted: isNewApplication,
    updated: !isNewApplication,
  });
};

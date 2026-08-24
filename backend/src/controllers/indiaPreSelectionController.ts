import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { awardPoints } from '../services/pointsService';
import { created, fail, ok } from '../lib/apiResponse';
import { syncIndiaPreSelectionApplicationToSheets } from '../services/googleSheetsService';
import { sendIndiaPreSelectionSubmissionEmail } from '../services/mailer';

const APPLICATION_POINTS = 200;
const APPLICATION_SOURCE_SLUG = 'india-pre-selection-application';
const PERFORMANCE_CATEGORIES = new Set([
  'Singer',
  'Musical artist',
  'Dancer',
  'Group performance',
  'Instrumentalist',
  'Other',
]);

const applicationFields = `
  id, user_id, full_name, email, phone, nationality, current_city, date_of_birth,
  performance_category, biography, video_link, message, status, points_awarded,
  submitted_at, updated_at
`;

const applicationWithReviewFields = `
  a.id,
  a.user_id,
  a.full_name,
  a.email,
  a.phone,
  a.nationality,
  a.current_city,
  a.date_of_birth,
  a.performance_category,
  a.biography,
  a.video_link,
  a.message,
  a.status,
  a.points_awarded,
  a.submitted_at,
  a.updated_at,
  reviewer.full_name AS reviewed_by_name,
  reviewer.email AS reviewed_by_email,
  JSON_UNQUOTE(JSON_EXTRACT(review.after_state, '$.review_note')) AS review_note,
  review.reviewed_at
`;

const applicationWithReviewQuery = `
  SELECT ${applicationWithReviewFields}
  FROM india_pre_selection_applications a
  LEFT JOIN (
    SELECT latest.entity_id, latest.after_state, latest.admin_user_id AS created_by, latest.created_at AS reviewed_at
    FROM (
      SELECT
        entity_id,
        after_state,
        admin_user_id,
        created_at,
        id,
        ROW_NUMBER() OVER (PARTITION BY entity_id ORDER BY created_at DESC, id DESC) AS rn
      FROM admin_audit_logs
      WHERE entity_type = 'india_pre_selection_application' AND action = 'review'
    ) latest
    WHERE latest.rn = 1
  ) review ON review.entity_id = a.id
  LEFT JOIN users reviewer ON reviewer.id = review.created_by
  WHERE a.user_id = ?
  LIMIT 1
`;

const cleanText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const cleanNullableText = (value: unknown) => {
  const text = cleanText(value);
  return text.length ? text : null;
};

const cleanEmail = (value: unknown) => cleanText(value).toLowerCase();

const parseDate = (value: unknown) => {
  const text = cleanText(value);
  if (!text) return null;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return undefined;
  const today = new Date();
  if (parsed.getTime() > today.getTime()) return undefined;
  return parsed.toISOString().slice(0, 10);
};

const normalizeVideoLink = (value: unknown) => {
  const text = cleanText(value);
  if (!text) return null;

  const candidate = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname) return null;
    return url.toString();
  } catch {
    return null;
  }
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
    applicationWithReviewQuery,
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
  const email = cleanEmail(req.body.email || user.email);
  const phone = cleanNullableText(req.body.phone || user.phone);
  const nationality = cleanNullableText(req.body.nationality);
  const currentCity = cleanNullableText(req.body.current_city);
  const dateOfBirth = parseDate(req.body.date_of_birth);
  const performanceCategory = cleanText(req.body.performance_category);
  const biography = cleanNullableText(req.body.biography);
  const videoLink = normalizeVideoLink(req.body.video_link);
  const message = cleanNullableText(req.body.message);

  if (!fullName || !email || !performanceCategory || !videoLink) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Full name, email, performance category and a valid video link are required');
  }

  if (dateOfBirth === undefined) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Date of birth must be a valid date');
  }

  if (!PERFORMANCE_CATEGORIES.has(performanceCategory)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Select a valid performance category');
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

    if (application) {
      void syncIndiaPreSelectionApplicationToSheets({
        ...application,
        points_awarded: awardedPoints > 0 ? APPLICATION_POINTS : Number(application.points_awarded || 0),
        submitted_at: application.submitted_at || new Date().toISOString(),
        updated_at: application.updated_at || new Date().toISOString(),
      }).catch((syncError: unknown) => {
        console.error('Failed to sync India pre-selection application to Google Sheets', syncError);
      });

    }
  } else {
    awardedPoints = Number(application?.points_awarded || 0);
  }

  if (application) {
    void sendIndiaPreSelectionSubmissionEmail(application).catch((mailError: unknown) => {
      console.error('Failed to send India pre-selection submission email', mailError);
    });
  }

  const [responseRows] = await pool.query(applicationWithReviewQuery, [req.user.id]);

  return (isNewApplication ? created : ok)(res, {
    application: (responseRows as any[])[0] || application,
    points_awarded: awardedPoints,
    points_balance: balance,
    submitted: isNewApplication,
    updated: !isNewApplication,
  });
};

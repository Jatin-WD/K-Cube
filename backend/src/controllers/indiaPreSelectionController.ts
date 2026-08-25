import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { created, fail, ok } from '../lib/apiResponse';
import { syncIndiaPreSelectionApplicationToSheets } from '../services/googleSheetsService';
import { sendIndiaPreSelectionSubmissionEmail } from '../services/mailer';

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.com',
  'yopmail.com', 'sharklasers.com', 'getnada.com', 'fakeinbox.com',
]);
const PUBLIC_VIDEO_HOSTS = new Set([
  'drive.google.com', 'docs.google.com', 'dropbox.com', 'www.dropbox.com',
  'dropboxusercontent.com', 'vimeo.com', 'player.vimeo.com', 'dailymotion.com',
  'www.dailymotion.com', 'streamable.com', 'loom.com', 'www.loom.com',
  'wistia.com', 'fast.wistia.net', 'mux.com',
]);
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

const isValidEmail = (value: string) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)) return false;
  const domain = value.split('@').pop() || '';
  return !DISPOSABLE_EMAIL_DOMAINS.has(domain);
};

const normalizePhone = (value: unknown) => cleanText(value).replace(/[\s().-]/g, '');

const isValidPhone = (value: string) => /^\+[1-9]\d{7,14}$/.test(value);

const isValidPersonName = (value: string) => /^[\p{L}][\p{L}\s.'-]{1,99}$/u.test(value);

const isValidPublicVideoLink = (value: string) => {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com') || hostname === 'youtu.be') return false;
    if (PUBLIC_VIDEO_HOSTS.has(hostname) || PUBLIC_VIDEO_HOSTS.has(`www.${hostname}`)) {
      if (hostname.includes('google.com')) return /\/(file|drive|open|uc)\b|\/folders?\//i.test(url.pathname);
      return true;
    }
    return /\.(mp4|webm|mov|m4v)(?:$|[?#])/i.test(url.pathname);
  } catch {
    return false;
  }
};

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
    `SELECT u.id, u.full_name, u.email, u.phone,
       EXISTS(
         SELECT 1 FROM auth_identities ai
         WHERE ai.user_id = u.id AND ai.email = u.email AND ai.verified = TRUE
       ) AS email_verified
     FROM users u WHERE u.id = ? LIMIT 1`,
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
  const phone = normalizePhone(req.body.phone || user.phone);
  const nationality = cleanText(req.body.nationality);
  const currentCity = cleanText(req.body.current_city);
  const dateOfBirth = parseDate(req.body.date_of_birth);
  const performanceCategory = cleanText(req.body.performance_category);
  const biography = cleanText(req.body.biography);
  const videoLink = normalizeVideoLink(req.body.video_link);
  const message = cleanText(req.body.message);

  if (!fullName || !email || !phone || !nationality || !currentCity || !dateOfBirth || !performanceCategory || !biography || !videoLink) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Please complete every required field with proper details');
  }

  if (!isValidPersonName(fullName)) return fail(res, 400, 'VALIDATION_ERROR', 'Enter a valid full name');
  if (!user.email_verified) {
    return fail(res, 400, 'EMAIL_NOT_VERIFIED', 'Verify your K-CUBE account email before submitting this application');
  }
  if (!isValidEmail(email) || email !== String(user.email || '').toLowerCase()) {
    return fail(res, 400, 'EMAIL_NOT_VERIFIED', 'Use the verified email address linked to your K-CUBE account');
  }
  if (!isValidPhone(phone)) return fail(res, 400, 'VALIDATION_ERROR', 'Enter a valid phone number with country code, for example +919876543210');
  if (nationality.length < 2 || nationality.length > 80) return fail(res, 400, 'VALIDATION_ERROR', 'Enter a valid nationality');
  if (currentCity.length < 2 || currentCity.length > 100) return fail(res, 400, 'VALIDATION_ERROR', 'Enter a valid current city');

  if (dateOfBirth === undefined) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Date of birth must be a valid date');
  }

  if (!PERFORMANCE_CATEGORIES.has(performanceCategory)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Select a valid performance category');
  }

  if (biography.length < 30 || biography.length > 2000 || !/[\p{L}]/u.test(biography)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Biography must contain at least 30 meaningful characters');
  }
  if (message.length > 1000) return fail(res, 400, 'VALIDATION_ERROR', 'Message must be 1000 characters or fewer');
  if (!isValidPublicVideoLink(videoLink)) {
    return fail(res, 400, 'INVALID_VIDEO_LINK', 'Use a public Google Drive or public video link. YouTube links are not accepted.');
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
           performance_category = ?, biography = ?, video_link = ?, message = ?, status = 'pending', updated_at = NOW()
       WHERE user_id = ?`,
      [...values.slice(1), req.user.id],
    );
  } else {
    const [result] = await pool.query(
      `INSERT INTO india_pre_selection_applications
        (user_id, full_name, email, phone, nationality, current_city, date_of_birth, performance_category, biography, video_link, message, status, points_awarded, submitted_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW(), NOW())`,
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
        0,
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
    if (application) {
      void syncIndiaPreSelectionApplicationToSheets({
        ...application,
        points_awarded: 0,
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

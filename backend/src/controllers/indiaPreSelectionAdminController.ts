import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../lib/apiResponse';

const allowedStatuses = new Set([
  'submitted',
  'reviewing',
  'shortlisted',
  'selected',
  'rejected',
  'withdrawn',
]);

const reviewEntityType = 'india_pre_selection_application';

const listQuery = `
  SELECT
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
    u.full_name AS user_full_name,
    u.email AS user_email,
    u.phone AS user_phone,
    reviewer.full_name AS reviewed_by_name,
    reviewer.email AS reviewed_by_email,
    JSON_UNQUOTE(JSON_EXTRACT(review.after_state, '$.review_note')) AS review_note,
    review.reviewed_at
  FROM india_pre_selection_applications a
  LEFT JOIN users u ON u.id = a.user_id
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
      WHERE entity_type = ? AND action = 'review'
    ) latest
    WHERE latest.rn = 1
  ) review ON review.entity_id = a.id
  LEFT JOIN users reviewer ON reviewer.id = review.created_by
  ORDER BY a.updated_at DESC, a.submitted_at DESC
  LIMIT 300
`;

const detailQuery = `
  SELECT
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
    u.full_name AS user_full_name,
    u.email AS user_email,
    u.phone AS user_phone,
    reviewer.full_name AS reviewed_by_name,
    reviewer.email AS reviewed_by_email,
    JSON_UNQUOTE(JSON_EXTRACT(review.after_state, '$.review_note')) AS review_note,
    review.reviewed_at
  FROM india_pre_selection_applications a
  LEFT JOIN users u ON u.id = a.user_id
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
      WHERE entity_type = ? AND action = 'review'
    ) latest
    WHERE latest.rn = 1
  ) review ON review.entity_id = a.id
  LEFT JOIN users reviewer ON reviewer.id = review.created_by
  WHERE a.id = ?
  LIMIT 1
`;

const normalizeStatus = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const fetchApplication = async (id: string | number) => {
  const [rows] = await pool.query(detailQuery, [reviewEntityType, id]);
  return (rows as any[])[0] || null;
};

export const listIndiaPreSelectionApplications = async (_req: AuthRequest, res: Response) => {
  const [rows] = await pool.query(listQuery, [reviewEntityType]);
  return ok(res, rows);
};

export const reviewIndiaPreSelectionApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const status = normalizeStatus(req.body?.status);
  const reviewNote = normalizeText(req.body?.review_note);

  if (!allowedStatuses.has(status)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid application status');
  }

  const current = await fetchApplication(id);
  if (!current) {
    return fail(res, 404, 'NOT_FOUND', 'Application not found');
  }

  const beforeState = {
    status: current.status,
    review_note: current.review_note || null,
    reviewed_at: current.reviewed_at || null,
    points_awarded: Number(current.points_awarded || 0),
  };

  await pool.query(
    'UPDATE india_pre_selection_applications SET status = ?, updated_at = NOW() WHERE id = ?',
    [status, id],
  );

  await pool.query(
    `INSERT INTO admin_audit_logs
      (admin_user_id, action, entity_type, entity_id, before_state, after_state, ip_address, created_at)
     VALUES (?, 'review', ?, ?, ?, ?, ?, NOW())`,
    [
      req.user.id,
      reviewEntityType,
      id,
      JSON.stringify(beforeState),
      JSON.stringify({
        status,
        review_note: reviewNote || null,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString(),
      }),
      req.ip || null,
    ],
  );

  const updated = await fetchApplication(id);
  return ok(res, { application: updated });
};

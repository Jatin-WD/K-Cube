import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { fail, ok } from '../lib/apiResponse';
import { awardPoints } from '../services/pointsService';
import { sendIndiaPreSelectionDecisionEmail } from '../services/mailer';

const allowedStatuses = new Set([
  'pending',
  'submitted',
  'reviewing',
  'shortlisted',
  'selected',
  'approved',
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
  if (status === 'rejected' && !reviewNote) {
    return fail(res, 400, 'REVIEW_NOTE_REQUIRED', 'A rejection reason is required');
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

  let pointsAwarded = Number(current.points_awarded || 0);
  let pointsBalance: number | null = null;
  if (['approved', 'selected'].includes(status) && pointsAwarded === 0) {
    const award = await awardPoints({
      userId: Number(current.user_id),
      sourceType: 'event',
      sourceSlug: `india-pre-selection-application-${id}`,
      points: 200,
      metadata: {
        application_id: Number(id),
        application_type: 'india_pre_selection',
        performance_category: current.performance_category,
        review_note: reviewNote || null,
      },
      createdBy: req.user.id,
      once: true,
    });
    if (award.awarded) {
      pointsAwarded = 200;
      pointsBalance = award.balance ?? null;
      await pool.query('UPDATE india_pre_selection_applications SET points_awarded = ? WHERE id = ?', [pointsAwarded, id]);
    }
  }

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
  if (['approved', 'selected', 'rejected'].includes(status)) {
    const decisionStatus: 'approved' | 'rejected' = status === 'rejected' ? 'rejected' : 'approved';
    void sendIndiaPreSelectionDecisionEmail({
      to: current.email || current.user_email,
      fullName: current.full_name || current.user_full_name || 'Applicant',
      status: decisionStatus,
      reviewNote,
      pointsAwarded,
    }).catch((mailError: unknown) => {
      console.error('Failed to send India pre-selection decision email', mailError);
    });
  }
  return ok(res, { application: updated, points_awarded: pointsAwarded, points_balance: pointsBalance });
};

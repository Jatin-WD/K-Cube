import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import pool from '../db/pool';
import { awardPoints } from '../services/pointsService';
import { fail, ok } from '../lib/apiResponse';
import { AuthRequest } from '../middleware/auth';
import { createShopProduct, deleteShopProduct, listShopProducts, updateShopProduct } from '../services/shopCatalogService';
export { syncWooCommerceProducts } from './shopController';

const profileFields = 'id, full_name, username, email, phone, role, category_access, admin_scope, profile_image, city, state, country, status, created_at, last_login';

const normalizeEmail = (value?: string) => String(value || '').trim().toLowerCase();
const normalizeUsername = (value?: string) => String(value || '').trim();
const normalizeName = (value?: string) => String(value || '').trim();
const parseJsonColumn = (value: unknown) => {
  if (typeof value !== 'string') return value;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'string') {
      try {
        return JSON.parse(parsed);
      } catch {
        return parsed;
      }
    }
    return parsed;
  } catch {
    return value;
  }
};
const buildReferralCode = (username: string) => {
  const base = normalizeUsername(username).replace(/[^a-z0-9]+/gi, '').slice(0, 10).toUpperCase() || 'ADMIN';
  return `${base}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
};

const ensureUniqueReferralCode = async (username: string) => {
  for (let index = 0; index < 8; index += 1) {
    const code = buildReferralCode(username);
    const [rows] = await pool.query('SELECT id FROM users WHERE referral_code = ? LIMIT 1', [code]);
    if (!(rows as any[]).length) return code;
  }
  return `${buildReferralCode(username)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
};

export const getAdminDashboard = async (_req: Request, res: Response) => {
  const [userCounts] = await pool.query('SELECT COUNT(*) as totalUsers, SUM(points) as totalPoints, SUM(xp) as totalXp FROM users');
  const [chapterCounts] = await pool.query('SELECT COUNT(*) as approvedChapters FROM chapters WHERE status = ?', ['approved']);
  const [activityCounts] = await pool.query('SELECT COUNT(*) as activityEvents FROM activities');
  return ok(res, {
    metrics: {
      ...((userCounts as any[])[0] || {}),
      ...((chapterCounts as any[])[0] || {}),
      ...((activityCounts as any[])[0] || {}),
    },
  });
};

export const getAdminProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  const [rows] = await pool.query(`SELECT ${profileFields} FROM users WHERE id = ? LIMIT 1`, [userId]);
  const user = (rows as any[])[0];
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
  return ok(res, user);
};

export const updateAdminProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  const allowed = ['full_name', 'phone', 'city', 'state', 'country', 'profile_image'];
  const entries = Object.entries(req.body || {}).filter(([key]) => allowed.includes(key));
  if (!entries.length) return fail(res, 400, 'VALIDATION_ERROR', 'No valid changes provided');
  await pool.query(`UPDATE users SET ${entries.map(([key]) => `${key} = ?`).join(', ')} WHERE id = ?`, [...entries.map(([, value]) => value), userId]);
  const [rows] = await pool.query(`SELECT ${profileFields} FROM users WHERE id = ? LIMIT 1`, [userId]);
  return ok(res, (rows as any[])[0] || { id: userId });
};

export const changeAdminPassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  const currentPassword = String(req.body?.current_password || '').trim();
  const nextPassword = String(req.body?.new_password || '').trim();
  if (!currentPassword || !nextPassword || nextPassword.length < 8) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Current password and a new password of at least 8 characters are required');
  }

  const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [userId]);
  const user = (rows as any[])[0];
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
  const isValid = await bcrypt.compare(currentPassword, String(user.password_hash || ''));
  if (!isValid) return fail(res, 401, 'INVALID_CREDENTIALS', 'Current password is incorrect');

  const passwordHash = await bcrypt.hash(nextPassword, 12);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
  await pool.query('UPDATE auth_identities SET verified = TRUE, updated_at = NOW() WHERE user_id = ? AND provider = ?', [userId, 'password']);
  return ok(res, { changed: true });
};

export const listAdminAccounts = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT ${profileFields}
    FROM users
    WHERE role = 'admin'
    ORDER BY created_at DESC
    LIMIT 200
  `);
  return ok(res, rows);
};

export const createAdminAccount = async (req: AuthRequest, res: Response) => {
  const fullName = normalizeName(req.body?.full_name);
  const username = normalizeUsername(req.body?.username);
  const email = normalizeEmail(req.body?.email);
  const phone = String(req.body?.phone || '').trim() || null;
  const password = String(req.body?.password || '').trim();
  const categoryAccess = req.body?.category_access || 'category_c';
  const adminScope = String(req.body?.admin_scope || 'submissions');
  const allowedScopes = new Set(['user_management', 'submissions', 'india_pre_selection', 'content', 'commerce', 'events', 'analytics']);
  if (!allowedScopes.has(adminScope) && adminScope !== 'super_admin') {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid admin access category');
  }
  const status = req.body?.status || 'active';

  if (!fullName || !username || !email || !password) {
    return fail(res, 400, 'VALIDATION_ERROR', 'full_name, username, email and password are required');
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? LIMIT 1', [email, username.toLowerCase()]);
  if ((existing as any[]).length) {
    return fail(res, 409, 'ACCOUNT_EXISTS', 'Email or username already registered');
  }

  const referralCode = await ensureUniqueReferralCode(username);
  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    `INSERT INTO users (full_name, username, email, phone, password_hash, role, category_access, admin_scope, referral_code, created_at, status)
     VALUES (?, ?, ?, ?, ?, 'admin', ?, ?, ?, NOW(), ?)`,
    [fullName, username, email, phone, passwordHash, categoryAccess, adminScope, referralCode, status],
  );
  const userId = (result as any).insertId;
  await pool.query(
    'INSERT IGNORE INTO auth_identities (user_id, provider, provider_user_id, email, verified, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())',
    [userId, 'password', email, email],
  );
  return ok(res, { id: userId, role: 'admin' });
};

export const listKFoodProducts = async (_req: Request, res: Response) => {
  const products = await listShopProducts();
  return ok(res, products);
};

export const createKFoodProduct = async (req: Request, res: Response) => {
  const product = await createShopProduct(req.body || {});
  return ok(res, product);
};

export const updateKFoodProduct = async (req: Request, res: Response) => {
  const product = await updateShopProduct(String(req.params.slug || ''), req.body || {});
  if (!product) return fail(res, 404, 'NOT_FOUND', 'Product not found');
  return ok(res, product);
};

export const deleteKFoodProduct = async (req: Request, res: Response) => {
  const deleted = await deleteShopProduct(String(req.params.slug || ''));
  if (!deleted) return fail(res, 404, 'NOT_FOUND', 'Product not found');
  return ok(res, { deleted: true });
};

export const getKFoodOverview = async (_req: Request, res: Response) => {
  const products = await listShopProducts();
  const [paymentRows] = await pool.query(`
    SELECT
      po.id,
      po.receipt,
      po.context_ref,
      po.amount,
      po.currency,
      po.status AS payment_status,
      COALESCE(f.fulfillment_status, JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.dispatch_status')), 'pending') AS dispatch_status,
      COALESCE(f.tracking_number, JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.tracking_number'))) AS tracking_number,
      COALESCE(f.carrier, JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.carrier'))) AS carrier,
      COALESCE(f.dispatch_method, JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.dispatch_method'))) AS dispatch_method,
      COALESCE(f.shipping_name, JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.shipping_name'))) AS shipping_name,
      COALESCE(f.shipping_phone, JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.shipping_phone'))) AS shipping_phone,
      COALESCE(f.shipping_address, JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.shipping_address'))) AS shipping_address,
      COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.commission_rate')) AS DECIMAL(6,2)), 8) AS commission_rate,
      COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(po.notes, '$.commission_amount')) AS DECIMAL(12,2)), ROUND(po.amount * 0.08, 2)) AS commission_amount,
      po.customer_email,
      po.customer_phone,
      po.created_at,
      f.id AS fulfillment_id,
      f.fulfillment_status,
      f.shipped_at,
      f.delivered_at,
      f.courier_notes
    FROM payment_orders po
    LEFT JOIN kfood_fulfillments f ON f.payment_order_id = po.id
    WHERE po.context_type = 'shop'
    ORDER BY po.created_at DESC
    LIMIT 50
  `);
  const [paymentSummaryRows] = await pool.query(`
    SELECT
      status AS payment_status,
      COUNT(*) AS total_orders,
      ROUND(SUM(amount), 2) AS total_amount
    FROM payment_orders
    WHERE context_type = 'shop'
    GROUP BY status
    ORDER BY total_amount DESC
  `);
  const [weeklyRows] = await pool.query(`
    SELECT
      DATE(created_at) AS period,
      COUNT(*) AS total_orders,
      ROUND(SUM(amount), 2) AS total_amount,
      ROUND(SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(notes, '$.commission_amount')) AS DECIMAL(12,2)), amount * 0.08)), 2) AS commission_amount
    FROM payment_orders
    WHERE context_type = 'shop' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(created_at)
    ORDER BY period DESC
  `);
  const [monthlyRows] = await pool.query(`
    SELECT
      DATE_FORMAT(created_at, '%Y-%m-01') AS period,
      COUNT(*) AS total_orders,
      ROUND(SUM(amount), 2) AS total_amount,
      ROUND(SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(notes, '$.commission_amount')) AS DECIMAL(12,2)), amount * 0.08)), 2) AS commission_amount
    FROM payment_orders
    WHERE context_type = 'shop' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-01')
    ORDER BY period DESC
  `);
  const [claimSummaryRows] = await pool.query(`
    SELECT
      status AS claim_status,
      COUNT(*) AS total_claims,
      ROUND(SUM(order_total), 2) AS total_amount,
      ROUND(SUM(CASE WHEN status = 'approved' THEN order_total * 0.08 ELSE 0 END), 2) AS commission_amount
    FROM kfood_purchases
    GROUP BY status
    ORDER BY total_claims DESC
  `);

  return ok(res, {
    productSummary: {
      totalProducts: products.length,
      inStockProducts: products.filter((product) => product.inStock).length,
      outOfStockProducts: products.filter((product) => !product.inStock).length,
    },
    products,
    orders: paymentRows,
    paymentSummary: paymentSummaryRows,
    weeklyReport: weeklyRows,
    monthlyReport: monthlyRows,
    claimSummary: claimSummaryRows,
  });
};

export const listKFoodFulfillments = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT
      f.id,
      f.payment_order_id,
      f.fulfillment_status,
      f.tracking_number,
      f.carrier,
      f.dispatch_method,
      f.shipping_name,
      f.shipping_phone,
      f.shipping_address,
      f.shipped_at,
      f.delivered_at,
      f.courier_notes,
      f.created_at,
      f.updated_at,
      po.receipt,
      po.context_ref,
      po.amount,
      po.currency,
      po.status AS payment_status,
      u.full_name,
      u.email
    FROM kfood_fulfillments f
    JOIN payment_orders po ON po.id = f.payment_order_id
    LEFT JOIN users u ON u.id = po.user_id
    WHERE po.context_type = 'shop'
    ORDER BY f.updated_at DESC, f.created_at DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const upsertKFoodFulfillment = async (req: Request, res: Response) => {
  const body = req.body || {};
  const paymentOrderId = Number(body.payment_order_id || 0);
  if (!paymentOrderId) return fail(res, 400, 'VALIDATION_ERROR', 'payment_order_id is required');

  const allowedStatuses = new Set(['pending', 'packed', 'dispatched', 'in_transit', 'delivered', 'returned', 'cancelled']);
  const fulfillmentStatus = allowedStatuses.has(String(body.fulfillment_status || '').toLowerCase()) ? String(body.fulfillment_status).toLowerCase() : 'pending';

  await pool.query(
    `
      INSERT INTO kfood_fulfillments
        (payment_order_id, fulfillment_status, tracking_number, carrier, dispatch_method, shipping_name, shipping_phone, shipping_address, shipped_at, delivered_at, courier_notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        fulfillment_status = VALUES(fulfillment_status),
        tracking_number = VALUES(tracking_number),
        carrier = VALUES(carrier),
        dispatch_method = VALUES(dispatch_method),
        shipping_name = VALUES(shipping_name),
        shipping_phone = VALUES(shipping_phone),
        shipping_address = VALUES(shipping_address),
        shipped_at = VALUES(shipped_at),
        delivered_at = VALUES(delivered_at),
        courier_notes = VALUES(courier_notes),
        updated_at = NOW()
    `,
    [
      paymentOrderId,
      fulfillmentStatus,
      body.tracking_number || null,
      body.carrier || null,
      body.dispatch_method || null,
      body.shipping_name || null,
      body.shipping_phone || null,
      body.shipping_address || null,
      body.shipped_at || null,
      body.delivered_at || null,
      body.courier_notes || null,
    ],
  );

  return ok(res, { payment_order_id: paymentOrderId, fulfillment_status: fulfillmentStatus });
};

export const listAdminSubmissions = async (_req: Request, res: Response) => {
  const safeQuery = async <T,>(label: string, sql: string, params: unknown[] = []) => {
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (error) {
      console.error(`Failed to load admin submissions source: ${label}`, error);
      return [] as T[];
    }
  };

  const [uploads, india, events, courses, claims] = await Promise.all([
    safeQuery(
      'content_upload',
      `
        SELECT
          uploads.id,
          'content_upload' AS source_type,
          'Content Upload' AS source_label,
          uploads.category AS submission_kind,
          uploads.title,
          uploads.description,
          uploads.status,
          uploads.review_note,
          uploads.points_reward,
          uploads.created_at AS submitted_at,
          uploads.reviewed_at,
          users.full_name AS applicant_name,
          users.email AS applicant_email,
          users.phone AS applicant_phone,
          JSON_OBJECT('video_url', uploads.video_url, 'thumbnail_url', uploads.thumbnail_url) AS payload
        FROM content_uploads uploads
        LEFT JOIN users ON users.id = uploads.user_id
        ORDER BY uploads.created_at DESC
        LIMIT 150
      `,
    ),
    safeQuery(
      'india_pre_selection',
      `
        SELECT
          a.id,
          'india_pre_selection' AS source_type,
          'India Pre-Selection' AS source_label,
          a.performance_category AS submission_kind,
          a.full_name AS title,
          a.biography AS description,
          a.status,
          NULL AS review_note,
          a.points_awarded AS points_reward,
          a.submitted_at,
          a.updated_at AS reviewed_at,
          a.full_name AS applicant_name,
          a.email AS applicant_email,
          a.phone AS applicant_phone,
          JSON_OBJECT(
            'nationality', a.nationality,
            'current_city', a.current_city,
            'date_of_birth', a.date_of_birth,
            'video_link', a.video_link,
            'message', a.message
          ) AS payload
        FROM india_pre_selection_applications a
        ORDER BY a.updated_at DESC, a.submitted_at DESC
        LIMIT 150
      `,
    ),
    safeQuery(
      'event_rsvp',
      `
        SELECT
          rsvp.id,
          'event_rsvp' AS source_type,
          'Event RSVP' AS source_label,
          e.slug AS submission_kind,
          e.title,
          CONCAT('RSVP status: ', rsvp.status) AS description,
          rsvp.status,
          NULL AS review_note,
          0 AS points_reward,
          rsvp.created_at AS submitted_at,
          rsvp.updated_at AS reviewed_at,
          u.full_name AS applicant_name,
          u.email AS applicant_email,
          u.phone AS applicant_phone,
          JSON_OBJECT(
            'event_id', e.id,
            'event_slug', e.slug,
            'event_title', e.title,
            'checked_in_at', rsvp.checked_in_at
          ) AS payload
        FROM platform_event_rsvps rsvp
        LEFT JOIN platform_events e ON e.id = rsvp.event_id
        LEFT JOIN users u ON u.id = rsvp.user_id
        ORDER BY rsvp.updated_at DESC, rsvp.created_at DESC
        LIMIT 150
      `,
    ),
    safeQuery(
      'learning_course',
      `
        SELECT
          co.id,
          'learning_course' AS source_type,
          'Learning Course' AS source_label,
          co.action AS submission_kind,
          co.course_title AS title,
          co.track_slug AS description,
          co.status,
          NULL AS review_note,
          co.points_reward,
          co.created_at AS submitted_at,
          co.updated_at AS reviewed_at,
          u.full_name AS applicant_name,
          u.email AS applicant_email,
          u.phone AS applicant_phone,
          JSON_OBJECT(
            'course_id', co.course_id,
            'course_title', co.course_title,
            'track_slug', co.track_slug,
            'action', co.action,
            'price', co.price,
            'payment_status', co.payment_status
          ) AS payload
        FROM learning_course_orders co
        LEFT JOIN users u ON u.id = co.user_id
        ORDER BY co.updated_at DESC, co.created_at DESC
        LIMIT 150
      `,
    ),
    safeQuery(
      'kfood_purchase',
      `
        SELECT
          kp.id,
          'kfood_purchase' AS source_type,
          'K-Food Purchase' AS source_label,
          kp.order_id AS submission_kind,
          kp.order_id AS title,
          CONCAT('Order total: ', kp.order_total) AS description,
          kp.status,
          kp.review_note,
          kp.points_reward,
          kp.created_at AS submitted_at,
          kp.reviewed_at,
          u.full_name AS applicant_name,
          u.email AS applicant_email,
          u.phone AS applicant_phone,
          JSON_OBJECT(
            'order_total', kp.order_total,
            'coupon_code', kp.coupon_code,
            'reviewed_by', kp.reviewed_by
          ) AS payload
        FROM kfood_purchases kp
        LEFT JOIN users u ON u.id = kp.user_id
        ORDER BY kp.updated_at DESC, kp.created_at DESC
        LIMIT 150
      `,
    ),
  ]);

  const rows = [
    ...(uploads as any[]),
    ...(india as any[]),
    ...(events as any[]),
    ...(courses as any[]),
    ...(claims as any[]),
  ].sort((left, right) => new Date(String(right.submitted_at || right.reviewed_at || 0)).getTime() - new Date(String(left.submitted_at || left.reviewed_at || 0)).getTime());

  return ok(res, rows);
};

export const reviewAdminSubmission = async (req: any, res: Response) => {
  const source = String(req.params.source || '');
  const id = Number(req.params.id);
  const decision = String(req.body?.status || '');
  if (!Number.isInteger(id) || id <= 0 || !['approved', 'rejected'].includes(decision)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'A valid submission and review decision are required');
  }

  if (source === 'event_rsvp') {
    const status = decision === 'approved' ? 'registered' : 'cancelled';
    const [result] = await pool.query('UPDATE platform_event_rsvps SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    if (!(result as any).affectedRows) return fail(res, 404, 'NOT_FOUND', 'Event RSVP not found');
  } else if (source === 'learning_course') {
    const status = decision === 'approved' ? 'confirmed' : 'cancelled';
    const [result] = await pool.query('UPDATE learning_course_orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    if (!(result as any).affectedRows) return fail(res, 404, 'NOT_FOUND', 'Learning course submission not found');
  } else {
    return fail(res, 400, 'UNSUPPORTED_SOURCE', 'This submission source has its own review workflow');
  }

  return ok(res, { source, id, status: decision });
};

export const listRecentAdminActions = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT
      l.id,
      l.action,
      l.entity_type,
      l.entity_id,
      l.created_at,
      l.ip_address,
      a.full_name AS admin_name,
      a.email AS admin_email,
      JSON_UNQUOTE(JSON_EXTRACT(l.before_state, '$.status')) AS before_status,
      JSON_UNQUOTE(JSON_EXTRACT(l.after_state, '$.status')) AS after_status,
      JSON_UNQUOTE(JSON_EXTRACT(l.after_state, '$.review_note')) AS review_note
    FROM admin_audit_logs l
    LEFT JOIN users a ON a.id = l.admin_user_id
    ORDER BY l.created_at DESC, l.id DESC
    LIMIT 50
  `);
  return ok(res, rows);
};

export const manageUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const allowed = ['full_name', 'phone', 'role', 'category_access', 'admin_scope', 'status', 'city', 'state', 'country', 'profile_image'];
  const entries = Object.entries(req.body).filter(([key]) => allowed.includes(key));
  const fields = entries.map(([key]) => `${key} = ?`).join(', ');
  if (!fields) return fail(res, 400, 'VALIDATION_ERROR', 'No valid changes provided');
  await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...entries.map(([, value]) => value), id]);
  return ok(res, { id: Number(id) });
};

export const approveChapter = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('UPDATE chapters SET status = ? WHERE id = ?', ['approved', id]);
  return ok(res, { chapterId: id });
};

export const listChapters = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT
      c.*,
      u.full_name AS leader_name,
      u.email AS leader_email
    FROM chapters c
    LEFT JOIN users u ON u.id = c.leader_id
    ORDER BY c.updated_at DESC, c.created_at DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const upsertChapter = async (req: Request, res: Response) => {
  const body = req.body || {};
  if (!body.name || !body.slug || !body.city || !body.state || !body.country) {
    return fail(res, 400, 'VALIDATION_ERROR', 'name, slug, city, state and country are required');
  }

  const values = [
    body.name,
    body.slug,
    body.description || null,
    body.city,
    body.state,
    body.country,
    body.leader_id || null,
    Number(body.member_count || 0),
    body.latitude ?? null,
    body.longitude ?? null,
    body.status || 'pending',
  ];

  if (body.id) {
    await pool.query(
      `UPDATE chapters
       SET name = ?, slug = ?, description = ?, city = ?, state = ?, country = ?, leader_id = ?, member_count = ?,
           latitude = ?, longitude = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [...values, body.id],
    );
    return ok(res, { id: Number(body.id) });
  }

  const [result] = await pool.query(
    `INSERT INTO chapters
       (name, slug, description, city, state, country, leader_id, member_count, latitude, longitude, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    values,
  );
  return ok(res, { id: (result as any).insertId });
};

export const deleteChapter = async (req: Request, res: Response) => {
  await pool.query('DELETE FROM chapters WHERE id = ?', [req.params.id]);
  return ok(res, { id: Number(req.params.id) });
};

export const publishAnnouncement = async (req: Request, res: Response) => {
  const { title, body, created_by } = req.body;
  if (!title || !body || !created_by) return fail(res, 400, 'VALIDATION_ERROR', 'Missing required fields');
  await pool.query(
    'INSERT INTO admin_announcements (title, body, created_by, tags, status, created_at) VALUES (?, ?, ?, JSON_ARRAY(), ?, NOW())',
    [title, body, created_by, 'published'],
  );
  return ok(res, {});
};

export const listCmsBlocks = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT
      b.*,
      p.slug AS page_slug,
      p.title_en AS page_title
    FROM cms_blocks b
    JOIN cms_pages p ON p.id = b.page_id
    ORDER BY b.sort_order ASC, b.id DESC
    LIMIT 500
  `);
  return ok(res, (rows as any[]).map((row) => ({
    ...row,
    content_en: parseJsonColumn(row.content_en),
    content_ko: parseJsonColumn(row.content_ko),
    content_hi: parseJsonColumn(row.content_hi),
  })));
};

export const upsertCmsBlock = async (req: Request, res: Response) => {
  const body = req.body || {};
  if (!body.page_id || !body.block_key || !body.block_type) {
    return fail(res, 400, 'VALIDATION_ERROR', 'page_id, block_key and block_type are required');
  }

  const values = [
    Number(body.page_id),
    body.block_key,
    body.block_type,
    Number(body.sort_order || 0),
    JSON.stringify(body.content_en ?? {}),
    JSON.stringify(body.content_ko ?? {}),
    JSON.stringify(body.content_hi ?? {}),
    body.status || 'published',
  ];

  if (body.id) {
    await pool.query(
      `UPDATE cms_blocks
       SET page_id = ?, block_key = ?, block_type = ?, sort_order = ?, content_en = ?, content_ko = ?, content_hi = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [...values, body.id],
    );
    return ok(res, { id: Number(body.id) });
  }

  const [result] = await pool.query(
    `INSERT INTO cms_blocks
       (page_id, block_key, block_type, sort_order, content_en, content_ko, content_hi, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    values,
  );
  return ok(res, { id: (result as any).insertId });
};

export const deleteCmsBlock = async (req: Request, res: Response) => {
  await pool.query('DELETE FROM cms_blocks WHERE id = ?', [req.params.id]);
  return ok(res, { id: Number(req.params.id) });
};

export const syncStaticCmsContent = async (req: AuthRequest, res: Response) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const pageTypeByCategory: Record<string, string> = {
    activities: 'activity',
    learning: 'learning',
    kfood: 'kfood',
    rewards: 'reward',
    events: 'event',
  };
  let pagesCreated = 0;
  let blocksCreated = 0;

  for (const item of items) {
    const slug = String(item?.slug || '').trim();
    const category = String(item?.category || '').trim();
    const titleEn = String(item?.title?.en || '').trim();
    const pageType = pageTypeByCategory[category];
    if (!slug || !titleEn || !pageType) continue;

    const [pageRows] = await pool.query('SELECT id FROM cms_pages WHERE slug = ? LIMIT 1', [slug]);
    let pageId = Number((pageRows as any[])[0]?.id || 0);
    if (!pageId) {
      const [result] = await pool.query(
        `INSERT INTO cms_pages
          (slug, page_type, title_en, title_ko, title_hi, seo_title, seo_description, status, created_by, updated_by, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, NOW(), NOW(), NOW())`,
        [
          slug,
          pageType,
          titleEn,
          item?.title?.ko || null,
          item?.title?.hi || null,
          item?.seo || titleEn,
          item?.summary?.en || null,
          req.user?.id || null,
          req.user?.id || null,
        ],
      );
      pageId = Number((result as any).insertId);
      pagesCreated += 1;
    }

    const [blockRows] = await pool.query(
      "SELECT id FROM cms_blocks WHERE page_id = ? AND block_key = 'static_detail_content' LIMIT 1",
      [pageId],
    );
    if (!(blockRows as any[]).length) {
      const content = JSON.stringify(item);
      await pool.query(
        `INSERT INTO cms_blocks
          (page_id, block_key, block_type, sort_order, content_en, content_ko, content_hi, status, created_at, updated_at)
         VALUES (?, 'static_detail_content', 'rich_text', 0, ?, ?, ?, 'published', NOW(), NOW())`,
        [pageId, content, content, content],
      );
      blocksCreated += 1;
    }
  }

  return ok(res, { pagesCreated, blocksCreated, skippedExisting: items.length - pagesCreated });
};

export const getSystemAnalytics = async (_req: Request, res: Response) => {
  const [results] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE status = 'active') as activeUsers,
      (SELECT COUNT(*) FROM session_logs WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)) as sessionsLast24h,
      (SELECT COUNT(*) FROM lessons WHERE active = TRUE) as activeLessons,
      (SELECT COUNT(*) FROM rewards WHERE active = TRUE) as activeRewards
  `);
  return ok(res, { analytics: (results as any[])[0] || {} });
};

export const listAnnouncements = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT announcements.*, users.full_name as creator_name, users.email as creator_email
    FROM admin_announcements announcements
    LEFT JOIN users ON users.id = announcements.created_by
    ORDER BY announcements.created_at DESC
    LIMIT 200
  `);
  return ok(res, rows);
};

export const listContentUploads = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT
      uploads.*,
      COALESCE(users.full_name, 'Unknown user') AS full_name,
      COALESCE(users.email, 'unknown@example.com') AS email
    FROM content_uploads uploads
    LEFT JOIN users ON users.id = uploads.user_id
    ORDER BY uploads.created_at DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const reviewContentUpload = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, points_reward = 0, review_note } = req.body;
  if (!['approved', 'rejected'].includes(status)) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid status');

  const [rows] = await pool.query('SELECT * FROM content_uploads WHERE id = ? LIMIT 1', [id]);
  const upload = (rows as any[])[0];
  if (!upload) return fail(res, 404, 'NOT_FOUND', 'Upload not found');

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

  return ok(res, { id: Number(id), status });
};

export const listPointTransactions = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT tx.*, users.full_name, users.email
    FROM point_transactions tx
    JOIN users ON users.id = tx.user_id
    ORDER BY tx.created_at DESC
    LIMIT 500
  `);
  return ok(res, rows);
};

export const adjustPoints = async (req: any, res: Response) => {
  const { user_id, points_delta, reason } = req.body;
  const points = Number(points_delta);
  if (!user_id || !Number.isFinite(points) || points === 0) return fail(res, 400, 'VALIDATION_ERROR', 'user_id and non-zero points_delta are required');
  const award = await awardPoints({
    userId: Number(user_id),
    sourceType: 'admin_adjustment',
    sourceSlug: `admin-adjustment-${Date.now()}`,
    points,
    metadata: { reason: reason || 'Manual admin adjustment' },
    createdBy: req.user?.id || null,
  });
  return ok(res, { user_id: Number(user_id), points_delta: points, balance: award.balance });
};

export const listKFoodClaims = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT purchases.*, users.full_name, users.email
    FROM kfood_purchases purchases
    JOIN users ON users.id = purchases.user_id
    ORDER BY purchases.created_at DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const reviewKFoodClaim = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, points_reward, review_note } = req.body;
  if (!['approved', 'rejected'].includes(status)) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid status');

  const [rows] = await pool.query('SELECT * FROM kfood_purchases WHERE id = ? LIMIT 1', [id]);
  const claim = (rows as any[])[0];
  if (!claim) return fail(res, 404, 'NOT_FOUND', 'Claim not found');

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

  return ok(res, { id: Number(id), status });
};

export const listRewards = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT id, name, description, tier, cost_points, active, image_url, metadata, created_at
    FROM rewards
    ORDER BY created_at DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const upsertReward = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body || {};
  if (!body.name) return fail(res, 400, 'VALIDATION_ERROR', 'name is required');

  const payload = [
    body.name,
    body.description || null,
    body.tier || 'bronze',
    Number(body.cost_points || 0),
    body.active === false ? 0 : 1,
    body.image_url || null,
    JSON.stringify(body.metadata || {}),
  ];

  if (id) {
    await pool.query(
      'UPDATE rewards SET name = ?, description = ?, tier = ?, cost_points = ?, active = ?, image_url = ?, metadata = ? WHERE id = ?',
      [...payload, id],
    );
    return ok(res, { id: Number(id) });
  }

  const [result] = await pool.query(
    'INSERT INTO rewards (name, description, tier, cost_points, active, image_url, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
    payload,
  );
  return ok(res, { id: (result as any).insertId });
};

export const retireReward = async (req: Request, res: Response) => {
  await pool.query('UPDATE rewards SET active = FALSE WHERE id = ?', [req.params.id]);
  return ok(res, { id: Number(req.params.id), active: false });
};

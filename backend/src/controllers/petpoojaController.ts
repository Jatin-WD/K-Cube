import crypto from 'crypto';
import { Request, Response } from 'express';
import pool from '../db/pool';
import { fail, ok } from '../lib/apiResponse';

const getHeader = (req: Request, name: string) => String(req.headers[name.toLowerCase()] || '');

const verifySignature = (req: Request) => {
  const secret = process.env.PETPOOJA_WEBHOOK_SECRET;
  if (!secret) return true;
  const signature = getHeader(req, 'x-petpooja-signature') || getHeader(req, 'x-hub-signature-256');
  if (!signature) return false;
  const payload = JSON.stringify(req.body || {});
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const cleanSignature = signature.replace(/^sha256=/, '');
  if (expected.length !== cleanSignature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(cleanSignature));
};

const readFirst = (...values: unknown[]) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');

const normalizePetpoojaOrder = (payload: any) => {
  const order = payload?.order || payload?.data?.order || payload?.data || payload;
  const customer = order?.customer || order?.customer_details || {};
  const coupon = order?.coupon || order?.coupon_code || order?.discount_code || order?.promo_code;
  return {
    event_type: payload?.event || payload?.event_type || 'order.updated',
    external_order_id: String(readFirst(order?.order_id, order?.id, order?.invoice_no, order?.bill_no, payload?.order_id) || ''),
    order_total: Number(readFirst(order?.order_total, order?.total, order?.grand_total, order?.net_amount, 0)),
    coupon_code: coupon ? String(coupon).trim().toUpperCase() : null,
    customer_email: readFirst(customer?.email, order?.email) ? String(readFirst(customer?.email, order?.email)).trim().toLowerCase() : null,
    customer_phone: readFirst(customer?.phone, customer?.mobile, order?.phone, order?.mobile) ? String(readFirst(customer?.phone, customer?.mobile, order?.phone, order?.mobile)).trim() : null,
    order_status: String(readFirst(order?.status, order?.order_status, payload?.status, 'received')),
    raw_payload: payload,
  };
};

const findAttributedUser = async (order: ReturnType<typeof normalizePetpoojaOrder>) => {
  if (order.coupon_code) {
    const [rows] = await pool.query('SELECT id FROM users WHERE referral_code = ? LIMIT 1', [order.coupon_code]);
    const user = (rows as any[])[0];
    if (user) return user.id;
  }
  if (order.customer_email) {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [order.customer_email]);
    const user = (rows as any[])[0];
    if (user) return user.id;
  }
  if (order.customer_phone) {
    const [rows] = await pool.query('SELECT id FROM users WHERE phone = ? LIMIT 1', [order.customer_phone]);
    const user = (rows as any[])[0];
    if (user) return user.id;
  }
  return null;
};

export const receivePetpoojaWebhook = async (req: Request, res: Response) => {
  if (!verifySignature(req)) return fail(res, 401, 'INVALID_SIGNATURE', 'Petpooja webhook signature is invalid');

  const order = normalizePetpoojaOrder(req.body);
  if (!order.external_order_id) return fail(res, 400, 'VALIDATION_ERROR', 'Petpooja order id is required');

  const userId = await findAttributedUser(order);
  await pool.query(
    `INSERT INTO petpooja_order_events
      (external_order_id, event_type, order_status, order_total, coupon_code, customer_email, customer_phone, user_id, raw_payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [order.external_order_id, order.event_type, order.order_status, order.order_total, order.coupon_code, order.customer_email, order.customer_phone, userId, JSON.stringify(order.raw_payload)],
  );

  if (userId && ['completed', 'delivered', 'paid', 'settled'].includes(order.order_status.toLowerCase())) {
    const points = Math.max(50, Math.floor(order.order_total / 10));
    await pool.query(
      `INSERT INTO kfood_purchases (user_id, order_id, order_total, coupon_code, status, points_reward, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'pending_review', ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE order_total = VALUES(order_total), coupon_code = VALUES(coupon_code), updated_at = NOW()`,
      [userId, order.external_order_id, order.order_total, order.coupon_code, points],
    );
  }

  return ok(res, { received: true, order_id: order.external_order_id, attributed_user_id: userId });
};

export const getPetpoojaStatus = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) as total_events,
      SUM(user_id IS NOT NULL) as attributed_events,
      MAX(created_at) as last_event_at
    FROM petpooja_order_events
  `);
  return ok(res, {
    configured: Boolean(process.env.PETPOOJA_WEBHOOK_SECRET || process.env.PETPOOJA_API_BASE_URL),
    webhook_path: '/api/v1/integrations/petpooja/webhook',
    stats: (rows as any[])[0] || {},
  });
};

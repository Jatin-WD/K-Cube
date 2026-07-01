import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { awardPoints } from '../services/pointsService';
import { created, fail, ok } from '../lib/apiResponse';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../config';

type PaymentContextType = 'shop' | 'course' | 'trial' | 'event' | 'reward' | 'other';
type PaymentStatus = 'created' | 'attempted' | 'paid' | 'failed' | 'refunded' | 'cancelled';

const allowedContexts = new Set<PaymentContextType>(['shop', 'course', 'trial', 'event', 'reward', 'other']);

const readJson = <T,>(value: unknown, fallback: T): T => {
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

const serializeJson = (value: unknown) => JSON.stringify(value ?? {});

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildReceipt = (contextType: PaymentContextType, contextRef: string | null | undefined) => {
  const suffix = randomBytes(4).toString('hex');
  const base = `rcpt_${contextType}_${String(contextRef || 'order').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 18)}_${Date.now().toString(36)}_${suffix}`;
  return base.slice(0, 80);
};

const createGatewayOrder = async ({
  amount,
  currency,
  receipt,
  notes,
}: {
  amount: number;
  currency: string;
  receipt: string;
  notes: Record<string, unknown>;
}) => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw Object.assign(new Error('Razorpay is not configured'), { status: 503, code: 'RAZORPAY_NOT_CONFIGURED' });
  }

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.description || payload?.error?.message || 'Unable to create Razorpay order';
    throw Object.assign(new Error(message), { status: response.status || 500, code: payload?.error?.code || 'RAZORPAY_ORDER_CREATE_FAILED' });
  }

  return payload as {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    notes?: Record<string, unknown>;
  };
};

const normalizeSignature = (expected: string, actual: string) => {
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const actualBuffer = Buffer.from(actual, 'utf8');
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, actualBuffer);
};

export const createPaymentOrder = async (req: AuthRequest, res: any) => {
  const userId = req.user?.id;
  const {
    amount,
    currency = 'INR',
    contextType = 'other',
    contextRef = null,
    receipt,
    notes = {},
    items = [],
    customerEmail = null,
    customerPhone = null,
    course = null,
  } = req.body || {};

  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');

  const resolvedAmount = toNumber(amount);
  if (resolvedAmount <= 0) {
    return fail(res, 400, 'VALIDATION_ERROR', 'amount must be greater than zero');
  }

  if (!allowedContexts.has(contextType)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid payment context');
  }

  const resolvedCurrency = String(currency || 'INR').toUpperCase();
  const resolvedReceipt = String(receipt || buildReceipt(contextType, contextRef));
  const resolvedCourse = course && typeof course === 'object' ? course : null;
  const resolvedNotes = {
    ...readJson<Record<string, unknown>>(notes, {}),
    contextType,
    contextRef,
    requestedAt: new Date().toISOString(),
    ...(resolvedCourse ? { course: resolvedCourse } : {}),
  };

  const [insertResult] = await pool.query(
    `
      INSERT INTO payment_orders
        (user_id, provider, context_type, context_ref, amount, currency, receipt, status, notes, items, customer_email, customer_phone, created_at, updated_at)
      VALUES (?, 'razorpay', ?, ?, ?, ?, ?, 'created', ?, ?, ?, ?, NOW(), NOW())
    `,
    [
      userId,
      contextType,
      contextRef ? String(contextRef) : null,
      resolvedAmount,
      resolvedCurrency,
      resolvedReceipt,
      serializeJson(resolvedNotes),
      serializeJson(items),
      customerEmail ? String(customerEmail) : null,
      customerPhone ? String(customerPhone) : null,
    ],
  );

  const paymentOrderId = (insertResult as any).insertId as number;

  try {
    const gatewayOrder = await createGatewayOrder({
      amount: Math.round(resolvedAmount * 100),
      currency: resolvedCurrency,
      receipt: resolvedReceipt,
      notes: resolvedNotes,
    });

    await pool.query(
      `
        UPDATE payment_orders
        SET razorpay_order_id = ?, status = 'attempted', updated_at = NOW()
        WHERE id = ?
      `,
      [gatewayOrder.id, paymentOrderId],
    );

    if (contextType === 'course' || contextType === 'trial') {
      const coursePayload = resolvedCourse || {};
      const courseId = String((coursePayload as any).courseId || contextRef || '');
      const courseTitle = String((coursePayload as any).courseTitle || (resolvedNotes as any).courseTitle || contextRef || 'Course');
      const trackSlug = String((coursePayload as any).trackSlug || (resolvedNotes as any).trackSlug || 'general');
      const action = contextType === 'trial' ? 'trial' : 'purchase';
      const price = toNumber((coursePayload as any).price ?? resolvedAmount);
      const pointsReward = Math.max(0, Math.round(toNumber((coursePayload as any).pointsReward ?? (resolvedNotes as any).pointsReward ?? 0)));

      await pool.query(
        `
          INSERT INTO learning_course_orders
            (user_id, course_id, course_title, track_slug, action, price, points_reward, status, payment_order_id, razorpay_order_id, payment_status, payment_currency, metadata, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, 'created', ?, ?, NOW(), NOW())
        `,
        [
          userId,
          courseId || gatewayOrder.id,
          courseTitle,
          trackSlug,
          action,
          price,
          pointsReward,
          paymentOrderId,
          gatewayOrder.id,
          resolvedCurrency,
          serializeJson({
            ...resolvedNotes,
            course: coursePayload,
          }),
        ],
      );
    }

    return created(res, {
      paymentOrderId,
      razorpayOrderId: gatewayOrder.id,
      amount: resolvedAmount,
      currency: resolvedCurrency,
      receipt: resolvedReceipt,
      keyId: RAZORPAY_KEY_ID,
      contextType,
      contextRef,
      notes: resolvedNotes,
    });
  } catch (error: any) {
    await pool.query(
      `UPDATE payment_orders SET status = 'failed', updated_at = NOW() WHERE id = ?`,
      [paymentOrderId],
    );
    return fail(res, error.status || 500, error.code || 'RAZORPAY_ORDER_CREATE_FAILED', error.message || 'Unable to create payment order');
  }
};

export const verifyPaymentOrder = async (req: AuthRequest, res: any) => {
  const userId = req.user?.id;
  const {
    paymentOrderId = null,
    razorpayOrderId = null,
    razorpayPaymentId = null,
    razorpaySignature = null,
  } = req.body || {};

  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return fail(res, 400, 'VALIDATION_ERROR', 'razorpayOrderId, razorpayPaymentId and razorpaySignature are required');
  }

  const [rows] = await pool.query(
    `
      SELECT *
      FROM payment_orders
      WHERE (razorpay_order_id = ? OR id = ?)
        AND user_id = ?
      LIMIT 1
    `,
    [razorpayOrderId, paymentOrderId || 0, userId],
  );
  const paymentOrder = (rows as any[])[0];

  if (!paymentOrder) {
    return fail(res, 404, 'NOT_FOUND', 'Payment order not found');
  }

  if (!RAZORPAY_KEY_SECRET) {
    return fail(res, 503, 'RAZORPAY_NOT_CONFIGURED', 'Razorpay is not configured');
  }

  const expectedSignature = createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (!normalizeSignature(expectedSignature, String(razorpaySignature))) {
    await pool.query(
      `
        UPDATE payment_orders
        SET status = 'failed',
            razorpay_payment_id = ?,
            razorpay_signature = ?,
            updated_at = NOW()
        WHERE id = ?
      `,
      [razorpayPaymentId, razorpaySignature, paymentOrder.id],
    );

    await pool.query(
      `
        UPDATE learning_course_orders
        SET status = 'cancelled',
            payment_status = 'failed',
            razorpay_payment_id = ?,
            updated_at = NOW()
        WHERE payment_order_id = ?
      `,
      [razorpayPaymentId, paymentOrder.id],
    );

    return fail(res, 400, 'PAYMENT_VERIFICATION_FAILED', 'Payment signature could not be verified');
  }

  const notes = readJson<Record<string, any>>(paymentOrder.notes, {});
  const items = readJson<any[]>(paymentOrder.items, []);
  const resolvedPoints = Math.max(
    0,
    Math.round(
      toNumber(notes.pointsReward ?? notes.rewardPoints ?? notes.points_reward ?? 0),
    ),
  );

  await pool.query(
    `
      UPDATE payment_orders
      SET status = 'paid',
          razorpay_payment_id = ?,
          razorpay_signature = ?,
          verified_at = NOW(),
          updated_at = NOW()
      WHERE id = ?
    `,
    [razorpayPaymentId, razorpaySignature, paymentOrder.id],
  );

  if (paymentOrder.context_type === 'course' || paymentOrder.context_type === 'trial') {
    const [learningRows] = await pool.query('SELECT * FROM learning_course_orders WHERE payment_order_id = ? LIMIT 1', [paymentOrder.id]);
    const learningOrder = (learningRows as any[])[0];
    if (learningOrder) {
      await pool.query(
        `
          UPDATE learning_course_orders
          SET status = 'confirmed',
              razorpay_order_id = ?,
              razorpay_payment_id = ?,
              payment_status = 'paid',
              payment_currency = ?,
              updated_at = NOW()
          WHERE payment_order_id = ?
        `,
        [razorpayOrderId, razorpayPaymentId, String(paymentOrder.currency || 'INR'), paymentOrder.id],
      );
    } else {
      const coursePayload = readJson<Record<string, any>>(notes.course || {}, {});
      await pool.query(
        `
          INSERT INTO learning_course_orders
            (user_id, course_id, course_title, track_slug, action, price, points_reward, status, payment_order_id, razorpay_order_id, razorpay_payment_id, payment_status, payment_currency, metadata, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, 'paid', ?, ?, NOW(), NOW())
        `,
        [
          userId,
          String(coursePayload.courseId || paymentOrder.context_ref || paymentOrder.id),
          String(coursePayload.courseTitle || notes.courseTitle || paymentOrder.context_ref || 'Course'),
          String(coursePayload.trackSlug || notes.trackSlug || 'general'),
          paymentOrder.context_type === 'trial' ? 'trial' : 'purchase',
          toNumber(coursePayload.price ?? paymentOrder.amount),
          Math.max(0, Math.round(toNumber(coursePayload.pointsReward ?? notes.pointsReward ?? 0))),
          paymentOrder.id,
          razorpayOrderId,
          razorpayPaymentId,
          String(paymentOrder.currency || 'INR'),
          serializeJson({ ...notes, course: coursePayload }),
        ],
      );
    }
  }

  let balance: number | undefined;
  if (resolvedPoints > 0) {
    const award = await awardPoints({
      userId,
      sourceType: 'activity',
      sourceSlug: `razorpay-payment-${paymentOrder.id}`,
      points: resolvedPoints,
      metadata: {
        payment_order_id: paymentOrder.id,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        context_type: paymentOrder.context_type,
        context_ref: paymentOrder.context_ref,
        notes,
        items,
      },
      once: true,
    });
    balance = award.balance;
  }

  return ok(res, {
    paymentOrderId: Number(paymentOrder.id),
    razorpayOrderId,
    razorpayPaymentId,
    status: 'paid' as PaymentStatus,
    contextType: paymentOrder.context_type,
    contextRef: paymentOrder.context_ref,
    pointsAwarded: resolvedPoints,
    balance,
  });
};

import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX, ADMIN_READ_RATE_LIMIT_MAX, JWT_SECRET } from '../config';

const publicLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Only signed admin credentials on workspace reads get this separate quota.
// Authentication, public traffic and all mutations retain the original limit.
const adminIds = new WeakMap<object, number>();
const adminReadLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: ADMIN_READ_RATE_LIMIT_MAX,
  keyGenerator: (req) => `admin-read:${adminIds.get(req)}`,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many admin requests. Please wait before refreshing.' },
});

const rateLimiter: RequestHandler = (req, res, next) => {
  const workspaceRead = (req.method === 'GET' || req.method === 'HEAD') &&
    /^\/(?:admin(?:\/|$)|users\/?$|learning\/(?:admin(?:\/|$)|cms\/pages(?:\/|$)))/.test(req.path);
  if (workspaceRead && req.headers.authorization?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(req.headers.authorization.slice(7), JWT_SECRET);
      if (typeof payload !== 'string' && payload.role === 'admin' &&
          Number.isSafeInteger(payload.id) && payload.id > 0) {
        adminIds.set(req, payload.id);
        return adminReadLimiter(req, res, next);
      }
    } catch {
      // Forged or expired tokens never grant a different quota.
    }
  }
  return publicLimiter(req, res, next);
};

export default rateLimiter;

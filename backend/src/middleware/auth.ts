import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { fail } from '../lib/apiResponse';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  user?: { id: number; role: string; category_access: string; admin_scope?: string | null };
}

export const requireAuth = (allowedAccess: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        id: number;
        role: string;
        category_access: string;
        admin_scope?: string | null;
      };
      req.user = payload;
      if (allowedAccess.length) {
        const hasRole = allowedAccess.includes(payload.role);
        const hasCategory = allowedAccess.includes(payload.category_access);
        if (!hasRole && !hasCategory) {
          return fail(res, 403, 'FORBIDDEN', 'Forbidden');
        }
      }
      next();
    } catch (error) {
      return fail(res, 401, 'INVALID_TOKEN', 'Invalid token');
    }
  };
};

export const requireAdminScope = (allowedScopes: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
    if (user.role === 'manager') return next();
    if (user.role !== 'admin') return fail(res, 403, 'FORBIDDEN', 'Admin access required');
    if (!allowedScopes.length || user.admin_scope === 'super_admin' || allowedScopes.includes(user.admin_scope || '')) {
      return next();
    }
    return fail(res, 403, 'FORBIDDEN', 'This admin account does not have access to this workspace');
  };
};

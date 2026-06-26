import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { fail } from '../lib/apiResponse';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  user?: { id: number; role: string; category_access: string };
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

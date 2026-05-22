import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number; role: string; category_access: string };
}

export const requireAuth = (allowedAccess: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
        id: number;
        role: string;
        category_access: string;
      };
      req.user = payload;
      if (allowedAccess.length) {
        const hasRole = allowedAccess.includes(payload.role);
        const hasCategory = allowedAccess.includes(payload.category_access);
        if (!hasRole && !hasCategory) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

import { Response } from 'express';

export const ok = (res: Response, data: unknown = {}) => res.json({ success: true, data });

export const created = (res: Response, data: unknown = {}) => res.status(201).json({ success: true, data });

export const fail = (res: Response, status: number, code: string, message: string) =>
  res.status(status).json({ success: false, error: { code, message } });

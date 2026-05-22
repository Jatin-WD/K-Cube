import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';

export const searchEntities = async (req: AuthRequest, res: Response) => {
  const query = (req.query.q as string) || '';
  const category = (req.query.category as string) || 'all';
  if (!query.trim()) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchValue = `%${query}%`;
  const result = await pool.query(
    `SELECT entity_type, entity_id, title, description FROM search_index WHERE title LIKE ? OR description LIKE ? LIMIT 12`,
    [searchValue, searchValue]
  );

  return res.json({ query, category, hits: result[0] });
};

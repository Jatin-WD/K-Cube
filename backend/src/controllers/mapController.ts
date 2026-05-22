import { Request, Response } from 'express';
import pool from '../db/pool';

export const getChapters = async (req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT id, name, city, state, country, description, leader_id, member_count, latitude, longitude, created_at, status FROM chapters WHERE status = ? ORDER BY member_count DESC', ['approved']);
  return res.json({ chapters: rows });
};

export const getChapterDetails = async (req: Request, res: Response) => {
  const chapterId = req.params.id;
  const [rows] = await pool.query('SELECT * FROM chapters WHERE id = ? LIMIT 1', [chapterId]);
  const chapter = (rows as any[])[0];
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  return res.json({ chapter });
};

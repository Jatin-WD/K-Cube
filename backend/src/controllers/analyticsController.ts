import { Request, Response } from 'express';
import pool from '../db/pool';

export const getAnalyticsSummary = async (req: Request, res: Response) => {
  const [userCountRows] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
  const [activeCountRows] = await pool.query("SELECT COUNT(*) as activeUsers FROM users WHERE status = 'active'");
  const [chapterCountRows] = await pool.query('SELECT COUNT(*) as chapters FROM chapters WHERE status = ?', ['approved']);
  const [sessionRows] = await pool.query('SELECT COUNT(*) as activeSessions FROM session_logs WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)');
  return res.json({
    summary: {
      totalUsers: (userCountRows as any[])[0].totalUsers,
      activeUsers: (activeCountRows as any[])[0].activeUsers,
      chapters: (chapterCountRows as any[])[0].chapters,
      activeSessions: (sessionRows as any[])[0].activeSessions,
    },
  });
};

import pool from '../db/pool';

export type PointSource =
  | 'welcome'
  | 'activity'
  | 'lesson'
  | 'kfood'
  | 'event'
  | 'referral'
  | 'admin_adjustment'
  | 'redemption'
  | 'trip_bonus';

interface AwardPointsInput {
  userId: number;
  sourceType: PointSource;
  sourceSlug: string;
  points: number;
  status?: 'pending' | 'approved' | 'rejected' | 'reversed';
  metadata?: Record<string, unknown>;
  createdBy?: number | null;
  once?: boolean;
}

export const awardPoints = async ({
  userId,
  sourceType,
  sourceSlug,
  points,
  status = 'approved',
  metadata = {},
  createdBy = null,
  once = false,
}: AwardPointsInput) => {
  if (!Number.isFinite(points) || points === 0) {
    throw new Error('Points must be a non-zero number');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (once) {
      const [existing] = await connection.query(
        'SELECT id FROM point_transactions WHERE user_id = ? AND source_type = ? AND source_slug = ? LIMIT 1 FOR UPDATE',
        [userId, sourceType, sourceSlug],
      );
      if ((existing as any[]).length) {
        await connection.rollback();
        return { awarded: false };
      }
    }

    const shouldApplyBalance = status === 'approved';
    if (shouldApplyBalance) {
      await connection.query('UPDATE users SET points = GREATEST(points + ?, 0), xp = GREATEST(xp + ?, 0), korea_score = GREATEST(korea_score + ?, 0) WHERE id = ?', [
        points,
        Math.max(points, 0),
        Math.max(points, 0),
        userId,
      ]);
    }

    const [rows] = await connection.query('SELECT points FROM users WHERE id = ? LIMIT 1', [userId]);
    const balance = Number((rows as any[])[0]?.points ?? 0);

    await connection.query(
      `INSERT INTO point_transactions
        (user_id, source_type, source_slug, points_delta, balance_after, status, metadata, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, sourceType, sourceSlug, points, balance, status, JSON.stringify(metadata), createdBy],
    );

    await connection.commit();
    return { awarded: true, balance };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

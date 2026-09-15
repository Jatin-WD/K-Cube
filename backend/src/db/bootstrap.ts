import pool from './pool';

export const bootstrapDatabase = async () => {
  // Existing MySQL volumes do not rerun database/schema.sql. Keep required
  // tables self-healing so older installations can use the learning APIs.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_learning_progress (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      track_id BIGINT UNSIGNED NOT NULL,
      current_streak INT UNSIGNED NOT NULL DEFAULT 0,
      best_streak INT UNSIGNED NOT NULL DEFAULT 0,
      last_completed_at DATETIME DEFAULT NULL,
      last_session_id BIGINT UNSIGNED DEFAULT NULL,
      total_sessions INT UNSIGNED NOT NULL DEFAULT 0,
      total_correct INT UNSIGNED NOT NULL DEFAULT 0,
      total_points INT UNSIGNED NOT NULL DEFAULT 0,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_learning_progress (user_id, track_id),
      INDEX idx_learning_progress_user (user_id)
      -- Do not add foreign keys here: legacy installations can have older
      -- table definitions/engines, which makes MySQL reject this migration.
      -- The canonical schema still defines the relationships for fresh DBs.
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await pool.query("ALTER TABLE users ADD COLUMN admin_scope VARCHAR(64) DEFAULT NULL AFTER category_access").catch(() => undefined);
  await pool.query("UPDATE users SET admin_scope = 'super_admin' WHERE role = 'admin' AND (admin_scope IS NULL OR admin_scope = '')").catch(() => undefined);
  await pool.query(`
    ALTER TABLE india_pre_selection_applications
    MODIFY COLUMN status ENUM('pending','submitted','reviewing','shortlisted','selected','approved','rejected','withdrawn') NOT NULL DEFAULT 'pending'
  `).catch(() => undefined);

  // Seed the four-session Korean Language & Culture Class series once.
  // INSERT IGNORE keeps admin edits and RSVP records intact on later restarts.
  const koreanClassSessions = [
    ['Free Korean Language & Culture Class — Week 1', '2026-09-22 15:00:00', '2026-09-22 16:00:00'],
    ['Free Korean Language & Culture Class — Week 2', '2026-09-29 15:00:00', '2026-09-29 16:00:00'],
    ['Free Korean Language & Culture Class — Week 3', '2026-10-06 15:00:00', '2026-10-06 16:00:00'],
    ['Free Korean Language & Culture Class — Week 4', '2026-10-13 15:00:00', '2026-10-13 16:00:00'],
  ];
  for (const [title, startsAt, endsAt] of koreanClassSessions) {
    const slug = `korean-language-culture-class-${startsAt.slice(0, 10)}`;
    await pool.query(
      `INSERT IGNORE INTO platform_events
        (title, slug, description, category, starts_at, ends_at, timezone, location_name, location_address, points_reward, status, sync_status, created_at, updated_at)
       VALUES (?, ?, ?, 'korean_language', ?, ?, 'Asia/Kolkata', ?, ?, 0, 'published', 'not_requested', NOW(), NOW())`,
      [
        title,
        slug,
        'A free four-week Korean language and culture class for the K-CUBE community. Learn practical Korean and explore Korean culture in a friendly classroom setting.',
        startsAt,
        endsAt,
        'Korea Edge Cube - Gr',
        'Plot 149, Sector 44 Rd, Gurugram, Haryana 122023',
      ],
    ).catch((error) => console.error(`Korean class event seed failed for ${slug}:`, error));
  }
  // Correct legacy Itaewon awards exactly once and leave an auditable reversal entry.
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [legacyRows] = await connection.query(
      `SELECT id, user_id, points_awarded
       FROM india_pre_selection_applications
       WHERE status = 'submitted'
       FOR UPDATE`,
    );
    for (const application of legacyRows as any[]) {
      const reversalSlug = `india-pre-selection-reversal-${application.id}`;
      const [existingReversal] = await connection.query(
        'SELECT id FROM point_transactions WHERE user_id = ? AND source_type = ? AND source_slug = ? LIMIT 1',
        [application.user_id, 'event', reversalSlug],
      );
      if (!(existingReversal as any[]).length && Number(application.points_awarded || 0) > 0) {
        const points = Number(application.points_awarded || 0);
        await connection.query(
          'UPDATE users SET points = GREATEST(points - ?, 0), xp = GREATEST(xp - ?, 0), korea_score = GREATEST(korea_score - ?, 0) WHERE id = ?',
          [points, points, points, application.user_id],
        );
        const [userRows] = await connection.query('SELECT points FROM users WHERE id = ? LIMIT 1', [application.user_id]);
        const balance = Number((userRows as any[])[0]?.points || 0);
        await connection.query(
          `INSERT INTO point_transactions
            (user_id, source_type, source_slug, points_delta, balance_after, status, metadata, created_by, created_at)
           VALUES (?, 'event', ?, ?, ?, 'reversed', ?, NULL, NOW())`,
          [application.user_id, reversalSlug, -points, balance, JSON.stringify({ application_id: application.id, reason: 'Legacy Itaewon submission points were awarded before admin approval was required' })],
        );
      }
      await connection.query(
        'UPDATE india_pre_selection_applications SET status = ?, points_awarded = 0, updated_at = NOW() WHERE id = ?',
        ['pending', application.id],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS kfood_fulfillments (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      payment_order_id BIGINT UNSIGNED NOT NULL,
      fulfillment_status ENUM('pending','packed','dispatched','in_transit','delivered','returned','cancelled') NOT NULL DEFAULT 'pending',
      tracking_number VARCHAR(120) DEFAULT NULL,
      carrier VARCHAR(120) DEFAULT NULL,
      dispatch_method VARCHAR(120) DEFAULT NULL,
      shipping_name VARCHAR(200) DEFAULT NULL,
      shipping_phone VARCHAR(30) DEFAULT NULL,
      shipping_address TEXT DEFAULT NULL,
      shipped_at DATETIME DEFAULT NULL,
      delivered_at DATETIME DEFAULT NULL,
      courier_notes TEXT DEFAULT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_kfood_fulfillment_payment_order (payment_order_id),
      INDEX idx_kfood_fulfillment_status (fulfillment_status),
      INDEX idx_kfood_fulfillment_payment_order (payment_order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_sent_emails (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      created_by BIGINT UNSIGNED DEFAULT NULL,
      delivery_mode ENUM('bulk','single') NOT NULL,
      recipient_count INT UNSIGNED NOT NULL DEFAULT 0,
      recipients_json JSON NOT NULL,
      recipient_names_json JSON DEFAULT NULL,
      cc_addresses TEXT DEFAULT NULL,
      subject VARCHAR(255) NOT NULL,
      body MEDIUMTEXT NOT NULL,
      status ENUM('sent','failed') NOT NULL,
      error_message TEXT DEFAULT NULL,
      sent_at DATETIME DEFAULT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_admin_sent_emails_created_at (created_at),
      INDEX idx_admin_sent_emails_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  await pool.query('ALTER TABLE admin_sent_emails ADD COLUMN recipient_names_json JSON DEFAULT NULL AFTER recipients_json').catch(() => undefined);
};

export default bootstrapDatabase;

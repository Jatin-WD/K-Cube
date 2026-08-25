import pool from './pool';

export const bootstrapDatabase = async () => {
  await pool.query(`
    ALTER TABLE india_pre_selection_applications
    MODIFY COLUMN status ENUM('pending','submitted','reviewing','shortlisted','selected','approved','rejected','withdrawn') NOT NULL DEFAULT 'pending'
  `).catch(() => undefined);
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
};

export default bootstrapDatabase;

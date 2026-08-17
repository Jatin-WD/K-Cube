import pool from './pool';

export const bootstrapDatabase = async () => {
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
      CONSTRAINT fk_kfood_fulfillment_payment_order FOREIGN KEY (payment_order_id) REFERENCES payment_orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export default bootstrapDatabase;

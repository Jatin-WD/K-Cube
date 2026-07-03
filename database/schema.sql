-- K-CUBE database schema for premium gamified Korean ecosystem

CREATE DATABASE IF NOT EXISTS kcube CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kcube;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(200) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  google_id VARCHAR(255) DEFAULT NULL,
  role ENUM('admin','manager','member','guest') NOT NULL DEFAULT 'member',
  category_access ENUM('category_a','category_b','category_c') NOT NULL DEFAULT 'category_c',
  profile_image VARCHAR(512) DEFAULT NULL,
  xp INT UNSIGNED NOT NULL DEFAULT 0,
  points INT UNSIGNED NOT NULL DEFAULT 0,
  level INT UNSIGNED NOT NULL DEFAULT 1,
  badges JSON DEFAULT (JSON_ARRAY()),
  streak INT UNSIGNED NOT NULL DEFAULT 0,
  korea_score INT UNSIGNED NOT NULL DEFAULT 0,
  city VARCHAR(100) DEFAULT NULL,
  state VARCHAR(100) DEFAULT NULL,
  country VARCHAR(100) DEFAULT 'India',
  referral_code VARCHAR(50) NOT NULL UNIQUE,
  referred_by VARCHAR(50) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT NULL,
  status ENUM('active','suspended','pending','deleted') NOT NULL DEFAULT 'active',
  digital_passport_id VARCHAR(100) GENERATED ALWAYS AS (CONCAT('KCUBE-', LPAD(id, 8, '0'))) VIRTUAL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auth_identities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  provider ENUM('password','google','phone_otp') NOT NULL,
  provider_user_id VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_identity_provider_user (provider, provider_user_id),
  INDEX idx_identity_user (user_id),
  CONSTRAINT fk_identity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bootstrap admin account for a fresh install.
-- Login:
--   email: admin@kcube.local
--   password: Admin@12345!
-- If you want a different admin, change these values before importing the schema.
INSERT IGNORE INTO users (
  full_name,
  username,
  email,
  phone,
  password_hash,
  role,
  category_access,
  referral_code,
  created_at,
  status
) VALUES (
  'K-CUBE Admin',
  'admin',
  'admin@kcube.local',
  NULL,
  '$2b$12$6iCqRAiIiov6zndYDe3cfeEsC4RweWIvpHEt1z0jCQ2LCzfXX8yCu',
  'admin',
  'category_c',
  'KCUBEADMIN',
  NOW(),
  'active'
);

CREATE TABLE IF NOT EXISTS referrals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  referrer_user_id BIGINT UNSIGNED NOT NULL,
  referred_user_id BIGINT UNSIGNED NOT NULL,
  referral_code VARCHAR(50) NOT NULL,
  status ENUM('pending','qualified','rejected','reversed') NOT NULL DEFAULT 'pending',
  referrer_points INT UNSIGNED NOT NULL DEFAULT 0,
  referred_points INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  qualified_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_referred_user (referred_user_id),
  INDEX idx_referrer_user (referrer_user_id),
  CONSTRAINT fk_referral_referrer FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_referral_referred FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS session_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  device VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_session_user (user_id),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS otp_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  phone VARCHAR(30) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_otp_phone (phone),
  CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_email_verification_token_hash (token_hash),
  INDEX idx_email_verification_user (user_id),
  CONSTRAINT fk_email_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chapters (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  leader_id BIGINT UNSIGNED DEFAULT NULL,
  member_count INT UNSIGNED NOT NULL DEFAULT 0,
  latitude DECIMAL(10,7) DEFAULT NULL,
  longitude DECIMAL(10,7) DEFAULT NULL,
  status ENUM('pending','approved','archived') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_chapter_city (city),
  INDEX idx_chapter_state (state),
  INDEX idx_chapter_status (status),
  CONSTRAINT fk_chapter_leader FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rewards (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  tier ENUM('bronze','silver','gold','diamond') NOT NULL DEFAULT 'bronze',
  cost_points INT UNSIGNED NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url VARCHAR(512) DEFAULT NULL,
  metadata JSON DEFAULT (JSON_OBJECT()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_rewards (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  reward_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending','claimed','redeemed','expired') NOT NULL DEFAULT 'pending',
  earned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  redeemed_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_user_reward_user (user_id),
  INDEX idx_user_reward_reward (reward_id),
  CONSTRAINT fk_user_reward_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_reward_reward FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(80) NOT NULL,
  category VARCHAR(80) DEFAULT NULL,
  xp_reward INT UNSIGNED NOT NULL DEFAULT 0,
  points_reward INT UNSIGNED NOT NULL DEFAULT 0,
  metadata JSON DEFAULT (JSON_OBJECT()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_activity_user (user_id),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS lessons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  level ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  xp_reward INT UNSIGNED NOT NULL DEFAULT 0,
  points_reward INT UNSIGNED NOT NULL DEFAULT 0,
  content JSON DEFAULT (JSON_ARRAY()),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS lesson_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  lesson_id BIGINT UNSIGNED NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  accuracy DECIMAL(5,2) DEFAULT 0,
  streak INT UNSIGNED DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_lesson_user (user_id, lesson_id),
  INDEX idx_lesson_progress_user (user_id),
  INDEX idx_lesson_progress_lesson (lesson_id),
  CONSTRAINT fk_lesson_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_lesson_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS content_uploads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  category ENUM('k_dance','k_song','k_drama','k_culture','k_food') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  video_url VARCHAR(1024) NOT NULL,
  thumbnail_url VARCHAR(1024) DEFAULT NULL,
  status ENUM('pending','approved','rejected','archived') NOT NULL DEFAULT 'pending',
  points_reward INT UNSIGNED NOT NULL DEFAULT 0,
  review_note TEXT DEFAULT NULL,
  reviewed_by BIGINT UNSIGNED DEFAULT NULL,
  reviewed_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_upload_user (user_id),
  INDEX idx_upload_status (status),
  INDEX idx_upload_category (category),
  CONSTRAINT fk_upload_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_upload_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS search_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  query TEXT NOT NULL,
  category VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_search_history_user (user_id),
  CONSTRAINT fk_search_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS fraud_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  event_type VARCHAR(100) NOT NULL,
  source_ip VARCHAR(45) DEFAULT NULL,
  user_agent VARCHAR(255) DEFAULT NULL,
  details JSON DEFAULT (JSON_OBJECT()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS search_index (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  tags JSON DEFAULT (JSON_ARRAY()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_search_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kfood_clicks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  item_slug VARCHAR(255) DEFAULT NULL,
  action VARCHAR(100) DEFAULT NULL,
  source VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_kfood_user (user_id),
  CONSTRAINT fk_kfood_clicks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kfood_purchases (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  order_id VARCHAR(120) NOT NULL,
  order_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  coupon_code VARCHAR(80) DEFAULT NULL,
  status ENUM('pending_review','approved','rejected','reversed') NOT NULL DEFAULT 'pending_review',
  points_reward INT UNSIGNED NOT NULL DEFAULT 0,
  review_note TEXT DEFAULT NULL,
  reviewed_by BIGINT UNSIGNED DEFAULT NULL,
  reviewed_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_kfood_order (order_id),
  INDEX idx_kfood_purchase_user (user_id),
  INDEX idx_kfood_purchase_status (status),
  CONSTRAINT fk_kfood_purchase_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_kfood_purchase_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS engagement_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  event_name VARCHAR(120) NOT NULL,
  metadata JSON DEFAULT (JSON_OBJECT()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_engagement_user (user_id),
  CONSTRAINT fk_engagement_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_announcements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  tags JSON DEFAULT (JSON_ARRAY()),
  created_by BIGINT UNSIGNED DEFAULT NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_announcements_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chapters_members (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chapter_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('leader','member') NOT NULL DEFAULT 'member',
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_chapter_member (chapter_id, user_id),
  CONSTRAINT fk_chapter_member_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  CONSTRAINT fk_chapter_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS point_transactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  source_type ENUM('welcome','activity','lesson','kfood','event','referral','admin_adjustment','redemption','trip_bonus') NOT NULL,
  source_slug VARCHAR(255) DEFAULT NULL,
  points_delta INT NOT NULL,
  balance_after INT UNSIGNED NOT NULL,
  status ENUM('pending','approved','rejected','reversed') NOT NULL DEFAULT 'approved',
  metadata JSON DEFAULT (JSON_OBJECT()),
  created_by BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_point_user (user_id),
  INDEX idx_point_source (source_type, source_slug),
  CONSTRAINT fk_point_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_point_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS platform_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'k_culture',
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  timezone VARCHAR(80) NOT NULL DEFAULT 'Asia/Kolkata',
  location_name VARCHAR(255) DEFAULT NULL,
  location_address TEXT DEFAULT NULL,
  online_meeting_url VARCHAR(1024) DEFAULT NULL,
  capacity INT UNSIGNED DEFAULT NULL,
  points_reward INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('draft','published','cancelled','archived') NOT NULL DEFAULT 'draft',
  google_calendar_event_id VARCHAR(255) DEFAULT NULL,
  google_calendar_html_link VARCHAR(1024) DEFAULT NULL,
  sync_status ENUM('not_requested','pending','synced','failed') NOT NULL DEFAULT 'not_requested',
  created_by BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_platform_events_status_start (status, starts_at),
  CONSTRAINT fk_platform_event_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS platform_event_rsvps (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('registered','cancelled','checked_in','no_show') NOT NULL DEFAULT 'registered',
  checked_in_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_platform_event_user (event_id, user_id),
  INDEX idx_platform_event_rsvp_user (user_id),
  CONSTRAINT fk_platform_event_rsvp_event FOREIGN KEY (event_id) REFERENCES platform_events(id) ON DELETE CASCADE,
  CONSTRAINT fk_platform_event_rsvp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS google_calendar_connections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider VARCHAR(40) NOT NULL DEFAULT 'google',
  calendar_id VARCHAR(255) NOT NULL,
  calendar_name VARCHAR(255) DEFAULT NULL,
  sync_mode ENUM('admin_oauth','service_account') NOT NULL DEFAULT 'admin_oauth',
  status ENUM('active','disabled','error') NOT NULL DEFAULT 'active',
  token_encrypted TEXT DEFAULT NULL,
  created_by BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_google_calendar (provider, calendar_id),
  CONSTRAINT fk_calendar_connection_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS google_calendar_sync_jobs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id BIGINT UNSIGNED NOT NULL,
  action ENUM('upsert','cancel','delete') NOT NULL DEFAULT 'upsert',
  status ENUM('queued','running','completed','failed') NOT NULL DEFAULT 'queued',
  attempts INT UNSIGNED NOT NULL DEFAULT 0,
  payload JSON DEFAULT (JSON_OBJECT()),
  response_payload JSON DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_calendar_jobs_status (status, created_at),
  CONSTRAINT fk_calendar_job_event FOREIGN KEY (event_id) REFERENCES platform_events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS petpooja_order_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  external_order_id VARCHAR(160) NOT NULL,
  event_type VARCHAR(120) NOT NULL,
  order_status VARCHAR(80) DEFAULT NULL,
  order_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  coupon_code VARCHAR(80) DEFAULT NULL,
  customer_email VARCHAR(255) DEFAULT NULL,
  customer_phone VARCHAR(30) DEFAULT NULL,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  raw_payload JSON DEFAULT (JSON_OBJECT()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_petpooja_order (external_order_id),
  INDEX idx_petpooja_user (user_id),
  CONSTRAINT fk_petpooja_event_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_course_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  course_id VARCHAR(160) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  track_slug VARCHAR(160) NOT NULL,
  action ENUM('cart','trial','purchase') NOT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  points_reward INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  payment_order_id BIGINT UNSIGNED DEFAULT NULL,
  razorpay_order_id VARCHAR(255) DEFAULT NULL,
  razorpay_payment_id VARCHAR(255) DEFAULT NULL,
  payment_status ENUM('created','paid','failed','refunded','cancelled') NOT NULL DEFAULT 'created',
  payment_currency CHAR(3) NOT NULL DEFAULT 'INR',
  metadata JSON DEFAULT (JSON_OBJECT()),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_learning_order_user (user_id),
  INDEX idx_learning_order_course (course_id),
  INDEX idx_learning_order_payment (payment_order_id),
  CONSTRAINT fk_learning_course_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payment_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  provider ENUM('razorpay') NOT NULL DEFAULT 'razorpay',
  context_type ENUM('shop','course','trial','event','reward','other') NOT NULL DEFAULT 'other',
  context_ref VARCHAR(255) DEFAULT NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  receipt VARCHAR(80) NOT NULL,
  status ENUM('created','attempted','paid','failed','refunded','cancelled') NOT NULL DEFAULT 'created',
  razorpay_order_id VARCHAR(255) DEFAULT NULL,
  razorpay_payment_id VARCHAR(255) DEFAULT NULL,
  razorpay_signature VARCHAR(255) DEFAULT NULL,
  notes JSON DEFAULT (JSON_OBJECT()),
  items JSON DEFAULT (JSON_ARRAY()),
  customer_email VARCHAR(255) DEFAULT NULL,
  customer_phone VARCHAR(30) DEFAULT NULL,
  verified_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_payment_order_receipt (receipt),
  UNIQUE KEY uniq_payment_order_razorpay_order (razorpay_order_id),
  INDEX idx_payment_order_user (user_id),
  INDEX idx_payment_order_context (context_type, context_ref),
  CONSTRAINT fk_payment_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cms_pages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  page_type ENUM('home','activity','learning','kfood','reward','event','about','trip','landing') NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_ko VARCHAR(255) DEFAULT NULL,
  title_hi VARCHAR(255) DEFAULT NULL,
  seo_title VARCHAR(255) DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  created_by BIGINT UNSIGNED DEFAULT NULL,
  updated_by BIGINT UNSIGNED DEFAULT NULL,
  published_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_cms_page_type (page_type),
  INDEX idx_cms_status (status),
  CONSTRAINT fk_cms_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_cms_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cms_blocks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_id BIGINT UNSIGNED NOT NULL,
  block_key VARCHAR(120) NOT NULL,
  block_type ENUM('hero','rich_text','card_grid','faq','cta','form','reward_rule','seo_schema') NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  content_en JSON DEFAULT (JSON_OBJECT()),
  content_ko JSON DEFAULT (JSON_OBJECT()),
  content_hi JSON DEFAULT (JSON_OBJECT()),
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_cms_block_page (page_id),
  CONSTRAINT fk_cms_block_page FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_tracks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(160) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  eyebrow VARCHAR(255) NOT NULL,
  intro TEXT NOT NULL,
  accent VARCHAR(32) NOT NULL DEFAULT '#19c37d',
  reward_points INT UNSIGNED NOT NULL DEFAULT 0,
  bank_size INT UNSIGNED NOT NULL DEFAULT 0,
  step_size INT UNSIGNED NOT NULL DEFAULT 10,
  overview JSON DEFAULT (JSON_ARRAY()),
  login_copy JSON DEFAULT (JSON_ARRAY()),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_by BIGINT UNSIGNED DEFAULT NULL,
  updated_by BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_learning_tracks_active (active, sort_order),
  CONSTRAINT fk_learning_tracks_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_learning_tracks_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_questions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  track_id BIGINT UNSIGNED NOT NULL,
  question_key VARCHAR(255) NOT NULL,
  type ENUM('choice','cards','arrange','listen','speak','match') NOT NULL,
  tag VARCHAR(120) NOT NULL,
  prompt TEXT NOT NULL,
  korean VARCHAR(255) NOT NULL,
  answer VARCHAR(255) NOT NULL,
  options JSON DEFAULT NULL,
  words JSON DEFAULT NULL,
  cards JSON DEFAULT NULL,
  pairs JSON DEFAULT NULL,
  hint TEXT NOT NULL,
  points INT UNSIGNED NOT NULL DEFAULT 0,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by BIGINT UNSIGNED DEFAULT NULL,
  updated_by BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_learning_question_key (track_id, question_key),
  INDEX idx_learning_question_track (track_id, active, sort_order),
  CONSTRAINT fk_learning_question_track FOREIGN KEY (track_id) REFERENCES learning_tracks(id) ON DELETE CASCADE,
  CONSTRAINT fk_learning_question_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_learning_question_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  track_id BIGINT UNSIGNED NOT NULL,
  session_seed VARCHAR(255) NOT NULL,
  total_questions INT UNSIGNED NOT NULL DEFAULT 0,
  correct_answers INT UNSIGNED NOT NULL DEFAULT 0,
  session_points INT NOT NULL DEFAULT 0,
  accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,
  streak_before INT UNSIGNED NOT NULL DEFAULT 0,
  streak_after INT UNSIGNED NOT NULL DEFAULT 0,
  completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_learning_session_seed (user_id, track_id, session_seed),
  INDEX idx_learning_sessions_user (user_id, completed_at),
  INDEX idx_learning_sessions_track (track_id, completed_at),
  CONSTRAINT fk_learning_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_learning_session_track FOREIGN KEY (track_id) REFERENCES learning_tracks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_session_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED DEFAULT NULL,
  question_key VARCHAR(255) NOT NULL,
  user_answer TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  points_awarded INT NOT NULL DEFAULT 0,
  answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_learning_answer (session_id, question_key),
  INDEX idx_learning_answer_session (session_id),
  CONSTRAINT fk_learning_answer_session FOREIGN KEY (session_id) REFERENCES learning_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_learning_answer_question FOREIGN KEY (question_id) REFERENCES learning_questions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  INDEX idx_learning_progress_user (user_id),
  CONSTRAINT fk_learning_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_learning_progress_track FOREIGN KEY (track_id) REFERENCES learning_tracks(id) ON DELETE CASCADE,
  CONSTRAINT fk_learning_progress_session FOREIGN KEY (last_session_id) REFERENCES learning_sessions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id BIGINT UNSIGNED DEFAULT NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(120) NOT NULL,
  entity_id BIGINT UNSIGNED DEFAULT NULL,
  before_state JSON DEFAULT NULL,
  after_state JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_audit_admin (admin_user_id),
  INDEX idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_admin FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO lessons (title, slug, description, level, xp_reward, points_reward, content, active)
VALUES
  ('Day 1: Hangul Vowels', 'day-1-hangul-vowels', 'Learn the core Korean vowels and complete a short recognition task.', 'beginner', 40, 40, JSON_ARRAY('ㅏ a', 'ㅓ eo', 'ㅗ o', 'ㅜ u', 'ㅡ eu', 'ㅣ i'), TRUE),
  ('Day 2: Hangul Consonants', 'day-2-hangul-consonants', 'Practice the first Korean consonants and sound matching.', 'beginner', 45, 45, JSON_ARRAY('ㄱ g/k', 'ㄴ n', 'ㄷ d/t', 'ㄹ r/l', 'ㅁ m'), TRUE),
  ('Day 3: Greetings', 'day-3-korean-greetings', 'Use simple Korean greetings in everyday conversations.', 'beginner', 50, 50, JSON_ARRAY('안녕하세요', '감사합니다', '반갑습니다'), TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), points_reward = VALUES(points_reward), active = TRUE;

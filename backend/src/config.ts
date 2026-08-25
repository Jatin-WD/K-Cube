import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
const exampleEnvPath = path.resolve(__dirname, '../.env.example');

dotenv.config({ path: envPath });
if (!fs.existsSync(envPath) && fs.existsSync(exampleEnvPath)) {
  dotenv.config({ path: exampleEnvPath });
}

const requiredEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (value) {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error(`${key} environment variable is required`);
};

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = Number(process.env.PORT || 4000);
export const API_PREFIX = process.env.API_PREFIX || '/api/v1';
export const KCUBE_SERVE_FRONTEND = process.env.KCUBE_SERVE_FRONTEND || 'false';
export const APP_URL = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
export const JWT_SECRET = requiredEnv('JWT_SECRET');
export const JWT_REFRESH_SECRET = requiredEnv('JWT_REFRESH_SECRET');
export const MYSQL_HOST = process.env.MYSQL_HOST || '127.0.0.1';
export const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'kcube';
export const MYSQL_USER = process.env.MYSQL_USER || 'root';
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
export const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 100);
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_AUTH_REDIRECT_URI = process.env.GOOGLE_AUTH_REDIRECT_URI || '';
export const GOOGLE_ALLOWED_WORKSPACE_DOMAIN = process.env.GOOGLE_ALLOWED_WORKSPACE_DOMAIN || '';
export const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';
export const GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL || '';
export const GOOGLE_CALENDAR_PRIVATE_KEY = process.env.GOOGLE_CALENDAR_PRIVATE_KEY || '';
export const GOOGLE_WORKSPACE_DELEGATED_ADMIN_EMAIL = process.env.GOOGLE_WORKSPACE_DELEGATED_ADMIN_EMAIL || '';
export const GOOGLE_CALENDAR_SYNC_MODE = process.env.GOOGLE_CALENDAR_SYNC_MODE || 'admin_oauth';
export const GOOGLE_SHEETS_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
export const GOOGLE_SHEETS_TAB_NAME = process.env.GOOGLE_SHEETS_TAB_NAME || 'Applications';
export const GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL || '';
export const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY || '';
export const GOOGLE_SHEETS_SYNC_ENABLED = String(process.env.GOOGLE_SHEETS_SYNC_ENABLED || '').toLowerCase() === 'true';
export const INDIA_PRE_SELECTION_EMAIL_CC = (process.env.INDIA_PRE_SELECTION_EMAIL_CC || 'kcubeadm@gmail.com,taehwanlim@gmail.com,lkmallshop@gmail.com')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
export const SMTP_SECURE = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const SMTP_FROM = process.env.SMTP_FROM || 'K-CUBE <no-reply@k-cube.local>';
export const REGISTRATION_NOTIFICATION_EMAIL = process.env.REGISTRATION_NOTIFICATION_EMAIL || SMTP_USER;
export const PETPOOJA_API_BASE_URL = process.env.PETPOOJA_API_BASE_URL || '';
export const PETPOOJA_API_KEY = process.env.PETPOOJA_API_KEY || '';
export const PETPOOJA_WEBHOOK_SECRET = process.env.PETPOOJA_WEBHOOK_SECRET || '';
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

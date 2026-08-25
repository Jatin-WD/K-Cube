import { Request, Response } from 'express';
import pool from '../db/pool';
import { fail, ok } from '../lib/apiResponse';
import { AuthRequest } from '../middleware/auth';
import { sendAdminEmail } from '../services/mailer';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const parseEmails = (value: unknown) => String(value || '')
  .split(/[;,\n]/)
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const uniqueEmails = (emails: string[]) => [...new Set(emails)];
const validateEmails = (emails: string[]) => emails.every((email) => emailPattern.test(email));

const recordEmail = async (payload: {
  createdBy: number | null;
  mode: 'bulk' | 'single';
  recipients: string[];
  recipientNames: string[];
  cc: string[];
  subject: string;
  body: string;
  status: 'sent' | 'failed';
  errorMessage?: string | null;
}) => {
  const [result] = await pool.query(
    `INSERT INTO admin_sent_emails
      (created_by, delivery_mode, recipient_count, recipients_json, cc_addresses, subject, body, status, error_message, sent_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.createdBy,
      payload.mode,
      payload.recipients.length,
      JSON.stringify(payload.recipients),
      payload.cc.length ? payload.cc.join(', ') : null,
      payload.subject,
      payload.body,
      payload.status,
      payload.errorMessage || null,
      payload.status === 'sent' ? new Date() : null,
    ],
  );
  return Number((result as { insertId?: number }).insertId || 0);
};

const updateRecipientNames = async (id: number, names: string[]) => {
  await pool.query('UPDATE admin_sent_emails SET recipient_names_json = ? WHERE id = ?', [JSON.stringify(names), id]);
};

export const listSentAdminEmails = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT id, delivery_mode, recipient_count, recipients_json, recipient_names_json, cc_addresses, subject, body, status, error_message, sent_at, created_at
    FROM admin_sent_emails
    ORDER BY created_at DESC, id DESC
    LIMIT 300
  `);
  return ok(res, rows);
};

export const getAdminEmailRecipientCount = async (_req: Request, res: Response) => {
  const [rows] = await pool.query(`
    SELECT COUNT(DISTINCT LOWER(TRIM(email))) AS count
    FROM users
    WHERE email IS NOT NULL AND TRIM(email) <> '' AND status <> 'deleted'
  `);
  return ok(res, { count: Number((rows as Array<{ count: number }>)[0]?.count || 0) });
};

export const sendAdminEmailMessage = async (req: AuthRequest, res: Response) => {
  const mode = req.body?.mode === 'bulk' ? 'bulk' : 'single';
  const subject = String(req.body?.subject || '').trim();
  const body = String(req.body?.body || '').trim();
  const cc = uniqueEmails(parseEmails(req.body?.cc));

  if (!subject || subject.length > 255 || !body) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Subject and message are required. Subject must be 255 characters or less.');
  }
  if (!validateEmails(cc)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'One or more CC email addresses are invalid.');
  }

  let recipients: string[];
  let recipientNames: string[];
  if (mode === 'bulk') {
    const [rows] = await pool.query(`
      SELECT LOWER(TRIM(email)) AS email, MAX(full_name) AS full_name
      FROM users
      WHERE email IS NOT NULL AND TRIM(email) <> '' AND status <> 'deleted'
      GROUP BY LOWER(TRIM(email))
    `);
    const recipientRows = rows as Array<{ email: string; full_name: string | null }>;
    recipients = uniqueEmails(recipientRows.map((row) => row.email).filter(Boolean));
    const nameByEmail = new Map(recipientRows.map((row) => [row.email, row.full_name || row.email]));
    recipientNames = recipients.map((email) => nameByEmail.get(email) || email);
    if (!recipients.length) return fail(res, 400, 'NO_RECIPIENTS', 'No non-deleted users with an email address were found.');
  } else {
    recipients = uniqueEmails(parseEmails(req.body?.to));
    const [userRows] = await pool.query('SELECT full_name FROM users WHERE LOWER(email) = ? LIMIT 1', [recipients[0] || '']);
    recipientNames = [String((userRows as Array<{ full_name: string | null }>)[0]?.full_name || recipients[0] || '')];
    if (recipients.length !== 1 || !validateEmails(recipients)) {
      return fail(res, 400, 'VALIDATION_ERROR', 'Enter exactly one valid recipient email address.');
    }
  }

  if (mode === 'single' && cc.includes(recipients[0])) {
    return fail(res, 400, 'VALIDATION_ERROR', 'The recipient cannot also be in CC.');
  }

  try {
    if (mode === 'bulk') {
      const batchSize = 75;
      for (let index = 0; index < recipients.length; index += batchSize) {
        const batch = recipients.slice(index, index + batchSize);
        await sendAdminEmail({ to: process.env.SMTP_USER || recipients[0], bcc: batch, subject, body });
      }
    } else {
      await sendAdminEmail({ to: recipients[0], cc, subject, body });
    }

    const emailId = await recordEmail({ createdBy: req.user?.id || null, mode, recipients, recipientNames, cc, subject, body, status: 'sent' });
    if (emailId) await updateRecipientNames(emailId, recipientNames);
    return ok(res, { mode, recipient_count: recipients.length, sent: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email delivery failed';
    const emailId = await recordEmail({ createdBy: req.user?.id || null, mode, recipients, recipientNames, cc, subject, body, status: 'failed', errorMessage: message }).catch(() => 0);
    if (emailId) await updateRecipientNames(emailId, recipientNames).catch(() => undefined);
    return fail(res, 502, 'EMAIL_DELIVERY_FAILED', message);
  }
};

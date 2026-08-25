import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { APP_URL, INDIA_PRE_SELECTION_EMAIL_CC, NODE_ENV, REGISTRATION_NOTIFICATION_EMAIL, SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_SECURE, SMTP_USER } from '../config';

let transporter: nodemailer.Transporter | null = null;

// A local placeholder sender breaks Gmail/domain alignment and often lands in spam.
const getFromAddress = () => SMTP_FROM.includes('@k-cube.local') ? SMTP_USER : (SMTP_FROM || SMTP_USER);

const getTransporter = () => {
  if (transporter) return transporter;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  return transporter;
};

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const sendAdminEmail = async (message: {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
}) => {
  const mailer = getTransporter();
  if (!mailer) throw new Error('SMTP is not configured for admin email delivery');

  const from = getFromAddress();
  const body = String(message.body || '').trim();
  await mailer.sendMail({
    from,
    replyTo: SMTP_USER || from,
    to: message.to,
    cc: message.cc?.length ? message.cc : undefined,
    bcc: message.bcc?.length ? message.bcc : undefined,
    subject: message.subject,
    text: body,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;white-space:pre-wrap">${escapeHtml(body)}</div>`,
  });

  return { skipped: false };
};

export const buildVerificationUrl = (token: string) => {
  const url = new URL('/verify-email', APP_URL);
  url.searchParams.set('token', token);
  return url.toString();
};

export const createVerificationToken = () => crypto.randomBytes(32).toString('hex');

export const hashVerificationToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const sendVerificationEmail = async (to: string, fullName: string, verificationUrl: string) => {
  const mailer = getTransporter();
  const from = getFromAddress();

  if (!mailer) {
    const error = new Error('SMTP is not configured for verification email delivery');
    if (NODE_ENV !== 'production') {
      console.log('[email:verification]', { to, verificationUrl });
      return { skipped: true, error };
    }
    throw error;
  }

  await mailer.sendMail({
    from,
    replyTo: SMTP_USER || from,
    to,
    subject: 'Verify your K-CUBE account',
    headers: {
      'X-Auto-Response-Suppress': 'All',
      'Auto-Submitted': 'auto-generated',
    },
    text: `Hi ${fullName},\n\nPlease verify your K-CUBE account by opening this link:\n${verificationUrl}\n\nIf you did not sign up, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 16px">Verify your K-CUBE account</h2>
        <p style="margin:0 0 16px">Hi ${fullName},</p>
        <p style="margin:0 0 20px">Please confirm your email address to activate your account and continue to sign in.</p>
        <p style="margin:0 0 24px"><a href="${verificationUrl}" style="display:inline-block;background:#ffc400;color:#111827;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">Verify email</a></p>
        <p style="margin:0 0 8px;font-size:14px;color:#6b7280">If the button does not work, copy this link:</p>
        <p style="margin:0;font-size:14px;color:#2563eb;word-break:break-all">${verificationUrl}</p>
      </div>
    `,
  });

  return { skipped: false };
};

export const sendUserRegistrationNotificationEmail = async (user: {
  full_name: string;
  username: string;
  email: string;
  phone?: string | null;
  category_access?: string | null;
  registered_at?: string | Date | null;
}) => {
  const mailer = getTransporter();
  if (!mailer || !REGISTRATION_NOTIFICATION_EMAIL) {
    console.warn('[email:user-registration] SMTP or recipient is not configured; notification skipped');
    return { skipped: true };
  }

  await mailer.sendMail({
    from: getFromAddress(),
    to: REGISTRATION_NOTIFICATION_EMAIL,
    replyTo: user.email,
    subject: `New K-CUBE user registered: ${user.full_name}`,
    text: [
      'A new user registered on K-CUBE.',
      `Name: ${user.full_name}`,
      `Username: ${user.username}`,
      `Email: ${user.email}`,
      `Phone: ${user.phone || 'Not provided'}`,
      `Category: ${user.category_access || 'Not provided'}`,
      `Registered at: ${user.registered_at || new Date().toISOString()}`,
    ].join('\n'),
  });

  return { skipped: false };
};

export const sendIndiaPreSelectionSubmissionEmail = async (application: {
  full_name: string;
  email: string;
  performance_category: string;
  video_link: string;
  current_city?: string | null;
  submitted_at?: string | Date | null;
}) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn('[email:india-pre-selection] SMTP is not configured; notification skipped', {
      smtpHostConfigured: Boolean(SMTP_HOST),
      smtpUserConfigured: Boolean(SMTP_USER),
      smtpPasswordConfigured: Boolean(SMTP_PASSWORD),
      recipients: INDIA_PRE_SELECTION_EMAIL_CC,
    });
    return { skipped: true };
  }

  await mailer.sendMail({
    from: SMTP_FROM,
    to: INDIA_PRE_SELECTION_EMAIL_CC,
    replyTo: application.email,
    subject: `India Pre-Selection application received: ${application.full_name}`,
    text: [
      `A new India Pre-Selection application was submitted by ${application.full_name}.`,
      `Applicant email: ${application.email}`,
      `Category: ${application.performance_category}`,
      `City: ${application.current_city || 'Not provided'}`,
      `Video link: ${application.video_link}`,
      `Submitted at: ${application.submitted_at || new Date().toISOString()}`,
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 16px">India Pre-Selection application received</h2>
        <p><strong>Applicant:</strong> ${application.full_name}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Category:</strong> ${application.performance_category}</p>
        <p><strong>City:</strong> ${application.current_city || 'Not provided'}</p>
        <p><strong>Video:</strong> <a href="${application.video_link}">${application.video_link}</a></p>
        <p><strong>Submitted:</strong> ${application.submitted_at || new Date().toISOString()}</p>
      </div>
    `,
  });

  return { skipped: false };
};

export const sendIndiaPreSelectionDecisionEmail = async (decision: {
  to: string;
  fullName: string;
  status: 'approved' | 'rejected';
  reviewNote?: string | null;
  pointsAwarded?: number;
}) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn('[email:india-pre-selection-decision] SMTP is not configured; notification skipped');
    return { skipped: true };
  }

  const approved = decision.status === 'approved';
  const reason = decision.reviewNote || (approved ? 'Your application met the current review requirements.' : 'The application did not meet the current review requirements.');
  const subject = approved
    ? 'K-CUBE India Pre-Selection application approved'
    : 'K-CUBE India Pre-Selection application update';
  const text = approved
    ? `Hi ${decision.fullName},\n\nYour ITAEWON World Music Spirit 2026 India Pre-Selection application has been approved. ${decision.pointsAwarded || 200} points have been added to your K-CUBE account.\n\nReview note: ${reason}\n\nRegards,\nK-CUBE Admin`
    : `Hi ${decision.fullName},\n\nThank you for applying for the ITAEWON World Music Spirit 2026 India Pre-Selection. We are sorry to inform you that your application was not approved at this stage.\n\nReason: ${reason}\n\nRegards,\nK-CUBE Admin`;

  await mailer.sendMail({
    from: getFromAddress(),
    to: decision.to,
    replyTo: SMTP_USER || getFromAddress(),
    subject,
    text,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827"><h2>${approved ? 'Application approved' : 'Application update'}</h2><p>Hi ${decision.fullName},</p><p>${approved ? `Your ITAEWON World Music Spirit 2026 India Pre-Selection application has been approved. <strong>${decision.pointsAwarded || 200} points</strong> have been added to your K-CUBE account.` : 'Thank you for applying for the ITAEWON World Music Spirit 2026 India Pre-Selection. We are sorry to inform you that your application was not approved at this stage.'}</p><p><strong>${approved ? 'Review note' : 'Reason'}:</strong> ${reason}</p><p>Regards,<br>K-CUBE Admin</p></div>`,
  });

  return { skipped: false };
};

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { APP_URL, INDIA_PRE_SELECTION_EMAIL_CC, NODE_ENV, SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_SECURE, SMTP_USER } from '../config';

let transporter: nodemailer.Transporter | null = null;

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

export const buildVerificationUrl = (token: string) => {
  const url = new URL('/verify-email', APP_URL);
  url.searchParams.set('token', token);
  return url.toString();
};

export const createVerificationToken = () => crypto.randomBytes(32).toString('hex');

export const hashVerificationToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const sendVerificationEmail = async (to: string, fullName: string, verificationUrl: string) => {
  const mailer = getTransporter();

  if (!mailer) {
    if (NODE_ENV !== 'production') {
      console.log('[email:verification]', { to, verificationUrl });
    }
    return { skipped: true };
  }

  await mailer.sendMail({
    from: SMTP_FROM,
    to,
    subject: 'Verify your K-CUBE account',
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
    if (NODE_ENV !== 'production') {
      console.log('[email:india-pre-selection]', { to: application.email, cc: INDIA_PRE_SELECTION_EMAIL_CC });
    }
    return { skipped: true };
  }

  await mailer.sendMail({
    from: SMTP_FROM,
    to: application.email,
    cc: INDIA_PRE_SELECTION_EMAIL_CC,
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

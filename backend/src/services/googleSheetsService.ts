import crypto from 'crypto';
import {
  GOOGLE_SHEETS_PRIVATE_KEY,
  GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SHEETS_SPREADSHEET_ID,
  GOOGLE_SHEETS_SYNC_ENABLED,
  GOOGLE_SHEETS_TAB_NAME,
} from '../config';

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

type SheetApplicationPayload = {
  id?: number | null;
  user_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  nationality?: string | null;
  current_city?: string | null;
  date_of_birth?: string | null;
  performance_category: string;
  biography?: string | null;
  video_link: string;
  message?: string | null;
  status?: string | null;
  points_awarded?: number | null;
  submitted_at?: string | Date | null;
  updated_at?: string | Date | null;
};

type TokenCache = {
  accessToken: string;
  expiresAt: number;
} | null;

let tokenCache: TokenCache = null;

const normalizePrivateKey = (value: string) => value.replace(/\\n/g, '\n').trim();

const base64Url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const buildJwt = () => {
  const privateKey = normalizePrivateKey(GOOGLE_SHEETS_PRIVATE_KEY);
  if (!GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SHEETS_SPREADSHEET_ID || !privateKey) {
    return null;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({
    iss: GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3600,
  }));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${payload}`);
  signer.end();
  const signature = base64Url(signer.sign(privateKey));

  return `${header}.${payload}.${signature}`;
};

const getAccessToken = async () => {
  if (tokenCache && tokenCache.expiresAt - 60_000 > Date.now()) {
    return tokenCache.accessToken;
  }

  const assertion = buildJwt();
  if (!assertion) return null;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Google Sheets token exchange failed: ${response.status} ${payload}`);
  }

  const data = await response.json() as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000,
  };

  return data.access_token;
};

const toCellValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' ? value : String(value);
};

export const syncIndiaPreSelectionApplicationToSheets = async (application: SheetApplicationPayload) => {
  if (!GOOGLE_SHEETS_SYNC_ENABLED) return;
  if (!GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEETS_SPREADSHEET_ID) return;

  const accessToken = await getAccessToken();
  if (!accessToken) return;

  const sheetName = GOOGLE_SHEETS_TAB_NAME || 'Applications';
  const submittedAt = toCellValue(application.submitted_at || application.updated_at || new Date());
  const updatedAt = toCellValue(application.updated_at || application.submitted_at || new Date());
  const row = [
    submittedAt,
    toCellValue(application.id ?? ''),
    toCellValue(application.user_id),
    toCellValue(application.full_name),
    toCellValue(application.email),
    toCellValue(application.phone),
    toCellValue(application.nationality),
    toCellValue(application.current_city),
    toCellValue(application.date_of_birth),
    toCellValue(application.performance_category),
    toCellValue(application.biography),
    toCellValue(application.video_link),
    toCellValue(application.message),
    toCellValue(application.status),
    toCellValue(application.points_awarded),
    updatedAt,
  ];

  const range = encodeURIComponent(`${sheetName}!A1`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        majorDimension: 'ROWS',
        values: [row],
      }),
    },
  );

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${payload}`);
  }
};

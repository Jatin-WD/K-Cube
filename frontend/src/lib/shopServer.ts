import 'server-only';

/** Prefer an explicit origin; never derive internal fetch targets from request headers. */
export async function shopServerBase() {
  if (process.env.KCUBE_API_ORIGIN) return `${process.env.KCUBE_API_ORIGIN.replace(/\/$/, '')}/api/v1`;
  if (process.env.NEXT_PUBLIC_API_URL?.startsWith('http')) return process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.KCUBE_SERVE_FRONTEND === 'true' ? process.env.PORT || '4000' : '4000';
  return `http://127.0.0.1:${port}/api/v1`;
}

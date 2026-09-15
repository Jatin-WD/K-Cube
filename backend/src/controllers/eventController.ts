import { Response } from 'express';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth';
import { awardPoints } from '../services/pointsService';
import { created, fail, ok } from '../lib/apiResponse';

const eventFields = `
  id, title, slug, description, category, starts_at, ends_at, timezone,
  location_name, location_address, online_meeting_url, capacity, points_reward,
  status, google_calendar_event_id, google_calendar_html_link, sync_status,
  created_at, updated_at
`;

const publicEventFields = `${eventFields},
  CASE
    WHEN status = 'cancelled' THEN 'cancelled'
    WHEN starts_at <= NOW() THEN 'completed'
    WHEN capacity IS NOT NULL AND (SELECT COUNT(*) FROM platform_event_rsvps r WHERE r.event_id = platform_events.id AND r.status = 'registered') >= capacity THEN 'full'
    ELSE 'registration_open'
  END AS registration_status`;

const ensureSlug = (title: string, slug?: string) =>
  (slug || title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 220);

const ensureKoreanClassSessions = async () => {
  const sessions = [
    ['Week 1', '2026-09-22 15:00:00', '2026-09-22 16:00:00'],
    ['Week 2', '2026-09-29 15:00:00', '2026-09-29 16:00:00'],
    ['Week 3', '2026-10-06 15:00:00', '2026-10-06 16:00:00'],
    ['Week 4', '2026-10-13 15:00:00', '2026-10-13 16:00:00'],
  ];
  for (const [week, startsAt, endsAt] of sessions) {
    await pool.query(
      `INSERT IGNORE INTO platform_events
        (title, slug, description, category, starts_at, ends_at, timezone, location_name, location_address, points_reward, status, sync_status, created_at, updated_at)
       VALUES (?, ?, ?, 'korean_language', ?, ?, 'Asia/Kolkata', ?, ?, 100, 'published', 'not_requested', NOW(), NOW())
       ON DUPLICATE KEY UPDATE points_reward = 100, updated_at = NOW()`,
      [
        `Free Korean Language & Culture Class - ${week}`,
        `korean-language-culture-class-${startsAt.slice(0, 10)}`,
        'A free four-week Korean language and culture class for the K-CUBE community.',
        startsAt,
        endsAt,
        'Korea Edge Cube - Gr',
        'Plot 149, Sector 44 Rd, Gurugram, Haryana 122023',
      ],
    );
  }
};

export const listEvents = async (_req: AuthRequest, res: Response) => {
  await ensureKoreanClassSessions().catch((error) => console.error('Korean class session ensure failed:', error));
  const [rows] = await pool.query(`SELECT ${publicEventFields} FROM platform_events WHERE status = 'published' ORDER BY starts_at ASC`);
  return ok(res, rows);
};

export const listMyRsvps = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  const [rows] = await pool.query(
    `SELECT event_id, status
     FROM platform_event_rsvps
     WHERE user_id = ? AND status IN ('registered', 'checked_in')`,
    [req.user.id],
  );
  return ok(res, rows);
};

export const listAdminEvents = async (_req: AuthRequest, res: Response) => {
  await ensureKoreanClassSessions().catch((error) => console.error('Korean class admin sync failed:', error));
  const [rows] = await pool.query(`SELECT ${eventFields} FROM platform_events ORDER BY updated_at DESC LIMIT 300`);
  return ok(res, rows);
};

export const listEventAttendees = async (req: AuthRequest, res: Response) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.event_id, r.user_id, r.status, r.checked_in_at, r.created_at,
            u.full_name, u.email, u.phone
     FROM platform_event_rsvps r
     JOIN users u ON u.id = r.user_id
     WHERE r.event_id = ?
     ORDER BY r.created_at ASC`,
    [req.params.id],
  );
  return ok(res, rows);
};

export const getEventBySlug = async (req: AuthRequest, res: Response) => {
  const [rows] = await pool.query(`SELECT ${publicEventFields} FROM platform_events WHERE slug = ? AND status IN ('published','cancelled') LIMIT 1`, [req.params.slug]);
  const event = (rows as any[])[0];
  if (!event) return fail(res, 404, 'NOT_FOUND', 'Event not found');
  return ok(res, event);
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  const body = req.body;
  if (!body.title || !body.starts_at || !body.ends_at) return fail(res, 400, 'VALIDATION_ERROR', 'Title, starts_at and ends_at are required');
  const slug = ensureSlug(body.title, body.slug);
  const [result] = await pool.query(
    `INSERT INTO platform_events
      (title, slug, description, category, starts_at, ends_at, timezone, location_name, location_address,
       online_meeting_url, capacity, points_reward, status, sync_status, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      body.title,
      slug,
      body.description || null,
      body.category || 'k_culture',
      body.starts_at,
      body.ends_at,
      body.timezone || 'Asia/Kolkata',
      body.location_name || null,
      body.location_address || null,
      body.online_meeting_url || null,
      body.capacity || null,
      Number(body.points_reward || 0),
      body.status || 'draft',
      body.sync_to_google_calendar ? 'pending' : 'not_requested',
      req.user?.id || null,
    ],
  );
  const id = (result as any).insertId;
  if (body.sync_to_google_calendar) {
    await pool.query('INSERT INTO google_calendar_sync_jobs (event_id, action, status, payload, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', [
      id,
      'upsert',
      'queued',
      JSON.stringify({ reason: 'event_created' }),
    ]);
  }
  return created(res, { id, slug, sync_status: body.sync_to_google_calendar ? 'pending' : 'not_requested' });
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  const allowed = ['title', 'slug', 'description', 'category', 'starts_at', 'ends_at', 'timezone', 'location_name', 'location_address', 'online_meeting_url', 'capacity', 'points_reward', 'status'];
  const updates = Object.entries(req.body).filter(([key]) => allowed.includes(key));
  if (!updates.length) return fail(res, 400, 'VALIDATION_ERROR', 'No valid event fields provided');
  const fields = updates.map(([key]) => `${key} = ?`).join(', ');
  await pool.query(`UPDATE platform_events SET ${fields}, sync_status = IF(google_calendar_event_id IS NULL, sync_status, 'pending'), updated_at = NOW() WHERE id = ?`, [
    ...updates.map(([, value]) => value),
    req.params.id,
  ]);
  await pool.query('INSERT INTO google_calendar_sync_jobs (event_id, action, status, payload, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', [
    req.params.id,
    req.body.status === 'cancelled' ? 'cancel' : 'upsert',
    'queued',
    JSON.stringify({ reason: 'event_updated', fields: updates.map(([key]) => key) }),
  ]);
  return ok(res, { id: Number(req.params.id), sync_status: 'pending' });
};

export const archiveEvent = async (req: AuthRequest, res: Response) => {
  await pool.query('UPDATE platform_events SET status = ?, updated_at = NOW() WHERE id = ?', ['archived', req.params.id]);
  return ok(res, { id: Number(req.params.id), status: 'archived' });
};

export const rsvpEvent = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [events] = await connection.query('SELECT id, capacity FROM platform_events WHERE id = ? AND status = ? LIMIT 1 FOR UPDATE', [req.params.id, 'published']);
    const event = (events as any[])[0];
    if (!event) {
      await connection.rollback();
      return fail(res, 404, 'NOT_FOUND', 'Event not found');
    }

    const [existingRows] = await connection.query(
      'SELECT status FROM platform_event_rsvps WHERE event_id = ? AND user_id = ? LIMIT 1 FOR UPDATE',
      [event.id, req.user.id],
    );
    const existingStatus = (existingRows as any[])[0]?.status;
    if (existingStatus === 'checked_in') {
      await connection.commit();
      return ok(res, { event_id: event.id, status: 'checked_in' });
    }
    if (existingStatus === 'registered') {
      await connection.commit();
      return ok(res, { event_id: event.id, status: 'registered' });
    }

    if (event.capacity) {
      const [countRows] = await connection.query('SELECT COUNT(*) as total FROM platform_event_rsvps WHERE event_id = ? AND status = ?', [event.id, 'registered']);
      if (Number((countRows as any[])[0]?.total || 0) >= Number(event.capacity)) {
        await connection.rollback();
        return fail(res, 409, 'EVENT_FULL', 'Event capacity is full');
      }
    }
    await connection.query(
      `INSERT INTO platform_event_rsvps (event_id, user_id, status, created_at, updated_at)
       VALUES (?, ?, 'registered', NOW(), NOW())
       ON DUPLICATE KEY UPDATE status = 'registered', updated_at = NOW()`,
      [event.id, req.user.id],
    );
    await connection.commit();
    return ok(res, { event_id: event.id, status: 'registered' });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const cancelRsvp = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) return fail(res, 401, 'UNAUTHORIZED', 'Unauthorized');
  await pool.query('UPDATE platform_event_rsvps SET status = ?, updated_at = NOW() WHERE event_id = ? AND user_id = ?', ['cancelled', req.params.id, req.user.id]);
  return ok(res, { event_id: Number(req.params.id), status: 'cancelled' });
};

export const checkInEvent = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.body.user_id);
  if (!userId) return fail(res, 400, 'VALIDATION_ERROR', 'user_id is required');
  const [events] = await pool.query('SELECT id, points_reward, slug, status FROM platform_events WHERE id = ? LIMIT 1', [req.params.id]);
  const event = (events as any[])[0];
  if (!event) return fail(res, 404, 'NOT_FOUND', 'Event not found');
  if (event.status === 'cancelled') return fail(res, 409, 'EVENT_CANCELLED', 'Cancelled events cannot record attendance');
  await pool.query(
    `INSERT INTO platform_event_rsvps (event_id, user_id, status, checked_in_at, created_at, updated_at)
     VALUES (?, ?, 'checked_in', NOW(), NOW(), NOW())
     ON DUPLICATE KEY UPDATE status = 'checked_in', checked_in_at = NOW(), updated_at = NOW()`,
    [event.id, userId],
  );
  const isKoreanClass = event.slug.startsWith('korean-language-culture-class-');
  const points = isKoreanClass ? 100 : Number(req.body.points_reward ?? event.points_reward ?? 0);
  let balance;
  let pointsAwarded = 0;
  let bonusPoints = 0;
  if (points > 0) {
    const award = await awardPoints({
      userId,
      sourceType: 'event',
      sourceSlug: `event-${event.slug}`,
      points,
      metadata: { event_id: event.id },
      createdBy: req.user?.id || null,
      once: true,
    });
    balance = award.balance;
    pointsAwarded = award.awarded ? points : 0;
  }
  if (isKoreanClass) {
    const [attendanceRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM platform_event_rsvps r
       JOIN platform_events e ON e.id = r.event_id
       WHERE r.user_id = ?
         AND r.status = 'checked_in'
         AND e.slug LIKE 'korean-language-culture-class-%'`,
      [userId],
    );
    if (Number((attendanceRows as any[])[0]?.total || 0) >= 4) {
      const bonus = await awardPoints({
        userId,
        sourceType: 'event',
        sourceSlug: 'korean-language-culture-class-4-session-bonus',
        points: 100,
        metadata: { reason: 'Completed all four Korean Language & Culture Class sessions' },
        createdBy: req.user?.id || null,
        once: true,
      });
      balance = bonus.balance;
      bonusPoints = bonus.awarded ? 100 : 0;
    }
  }
  return ok(res, { event_id: event.id, user_id: userId, status: 'checked_in', points_awarded: pointsAwarded, bonus_points_awarded: bonusPoints, balance });
};

export const syncEventToGoogleCalendar = async (req: AuthRequest, res: Response) => {
  const calendarId = req.body.calendar_id || process.env.GOOGLE_CALENDAR_ID || 'primary';
  const googleEventId = `kcube-${req.params.id}`;
  const htmlLink = `https://calendar.google.com/calendar/event?eid=${encodeURIComponent(googleEventId)}`;
  await pool.query(
    'UPDATE platform_events SET google_calendar_event_id = ?, google_calendar_html_link = ?, sync_status = ?, updated_at = NOW() WHERE id = ?',
    [googleEventId, htmlLink, 'synced', req.params.id],
  );
  await pool.query('INSERT INTO google_calendar_sync_jobs (event_id, action, status, payload, response_payload, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())', [
    req.params.id,
    'upsert',
    'completed',
    JSON.stringify({ calendar_id: calendarId, send_updates: req.body.send_updates || 'all' }),
    JSON.stringify({ mode: process.env.GOOGLE_CALENDAR_SYNC_MODE || 'admin_oauth', simulated: !process.env.GOOGLE_CALENDAR_PRIVATE_KEY }),
  ]);
  return ok(res, { event_id: Number(req.params.id), google_calendar_event_id: googleEventId, google_calendar_html_link: htmlLink, sync_status: 'synced' });
};

export const listCalendarConnections = async (_req: AuthRequest, res: Response) => {
  const [rows] = await pool.query('SELECT id, provider, calendar_id, calendar_name, sync_mode, status, created_at, updated_at FROM google_calendar_connections ORDER BY updated_at DESC');
  return ok(res, rows);
};

export const upsertCalendarConnection = async (req: AuthRequest, res: Response) => {
  const body = req.body;
  const calendarId = body.calendar_id || process.env.GOOGLE_CALENDAR_ID || 'primary';
  await pool.query(
    `INSERT INTO google_calendar_connections (provider, calendar_id, calendar_name, sync_mode, status, created_by, created_at, updated_at)
     VALUES ('google', ?, ?, ?, 'active', ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE calendar_name = VALUES(calendar_name), sync_mode = VALUES(sync_mode), status = 'active', updated_at = NOW()`,
    [calendarId, body.calendar_name || 'K-CUBE Calendar', body.sync_mode || process.env.GOOGLE_CALENDAR_SYNC_MODE || 'admin_oauth', req.user?.id || null],
  );
  return ok(res, { calendar_id: calendarId, status: 'active' });
};

export const runCalendarSync = async (_req: AuthRequest, res: Response) => {
  const [rows] = await pool.query('SELECT id, event_id FROM google_calendar_sync_jobs WHERE status = ? ORDER BY created_at ASC LIMIT 20', ['queued']);
  const jobs = rows as any[];
  for (const job of jobs) {
    await pool.query('UPDATE google_calendar_sync_jobs SET status = ?, attempts = attempts + 1, updated_at = NOW() WHERE id = ?', ['completed', job.id]);
    await pool.query('UPDATE platform_events SET sync_status = ? WHERE id = ?', ['synced', job.event_id]);
  }
  return ok(res, { processed: jobs.length });
};

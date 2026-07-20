import { createHmac } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { db } from '../db';
import { logger } from '../lib/logger';

const router = Router();
const allowedEventTypes = new Set([
  'page_view',
  'navigation_click',
  'button_click',
  'service_click',
  'line_click',
  'external_link_click',
  'contact_form_start',
  'contact_form_submit',
  'contact_form_success',
  'contact_form_error',
]);
const forbiddenMetadataKeys = new Set(['name', 'phone', 'email', 'password', 'message', 'details', 'token', 'secret']);
const allowedMetadataKeys = new Set(['serviceKey', 'destinationPath', 'linkType', 'formName', 'result', 'httpStatusGroup']);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many analytics requests' },
  handler: (req, res) => {
    logger.warn('analytics', 'rate_limited', 'Analytics request rate limit reached', {
      requestId: req.requestId,
      path: req.originalUrl,
    });
    res.status(429).json({ success: false, message: 'Too many analytics requests' });
  },
});

const text = (value: unknown, max: number): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

const requireUuid = (value: unknown): string | null => {
  const candidate = text(value, 80);
  return candidate && uuidPattern.test(candidate) ? candidate : null;
};

const pagePath = (value: unknown): string | null => {
  const candidate = text(value, 300);
  return candidate?.startsWith('/') ? candidate : null;
};

const dateText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const hashVisitor = (visitorId: string): string => {
  const secret = process.env.ANALYTICS_HASH_SECRET?.trim() || process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) throw new Error('Analytics hash secret is not configured');
  return createHmac('sha256', secret).update(visitorId).digest('hex');
};

const sanitizeMetadata = (value: unknown): string | null => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const clean: Record<string, string> = {};
  for (const [key, raw] of Object.entries(source)) {
    if (forbiddenMetadataKeys.has(key.toLowerCase()) || !allowedMetadataKeys.has(key)) throw new Error('Invalid metadata');
    if (typeof raw !== 'string' && typeof raw !== 'number' && typeof raw !== 'boolean') throw new Error('Invalid metadata');
    clean[key] = String(raw).slice(0, 120);
  }
  const serialized = JSON.stringify(clean);
  if (serialized.length > 1000) throw new Error('Invalid metadata');
  return serialized === '{}' ? null : serialized;
};

const upsertSession = db.prepare(`
  INSERT INTO analytics_sessions (
    session_id, visitor_id_hash, first_page, last_page, referrer, utm_source, utm_medium,
    utm_campaign, device_type, browser, operating_system, started_at, last_seen_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  ON CONFLICT(session_id) DO UPDATE SET
    last_page = excluded.last_page,
    last_seen_at = datetime('now')
`);

const insertEvent = db.prepare(`
  INSERT OR IGNORE INTO analytics_events (
    event_id, session_id, event_type, event_name, page_path, element_id, metadata, created_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertBatch = db.transaction((payload: {
  sessionId: string;
  visitorHash: string;
  session: Record<string, unknown>;
  events: Record<string, unknown>[];
}) => {
  const firstEventPath = pagePath(payload.events[0]?.pagePath) ?? '/';
  upsertSession.run(
    payload.sessionId,
    payload.visitorHash,
    pagePath(payload.session.firstPage) ?? firstEventPath,
    firstEventPath,
    text(payload.session.referrer, 500),
    text(payload.session.utmSource, 120),
    text(payload.session.utmMedium, 120),
    text(payload.session.utmCampaign, 120),
    text(payload.session.deviceType, 40),
    text(payload.session.browser, 80),
    text(payload.session.operatingSystem, 80)
  );

  let accepted = 0;
  for (const event of payload.events) {
    const eventId = requireUuid(event.eventId);
    const eventType = text(event.eventType, 60);
    const eventName = text(event.eventName, 120);
    const path = pagePath(event.pagePath);
    const createdAt = dateText(event.createdAt) ?? new Date().toISOString();
    if (!eventId || !eventType || !allowedEventTypes.has(eventType) || !eventName || !path) throw new Error('Invalid event');
    const result = insertEvent.run(
      eventId,
      payload.sessionId,
      eventType,
      eventName,
      path,
      text(event.elementId, 120),
      sanitizeMetadata(event.metadata),
      createdAt
    );
    accepted += result.changes;
  }
  return accepted;
});

router.post('/events', analyticsLimiter, (req: Request, res: Response): void => {
  const startedAt = Date.now();
  try {
    const body = req.body as Record<string, unknown>;
    const sessionId = requireUuid(body.sessionId);
    const visitorId = requireUuid(body.visitorId);
    const events = Array.isArray(body.events) ? body.events as Record<string, unknown>[] : [];
    if (!sessionId || !visitorId || events.length < 1 || events.length > 20) {
      logger.warn('analytics', 'payload_rejected', 'Analytics payload rejected', {
        requestId: req.requestId,
        reason: 'invalid_shape',
        eventCount: events.length,
      });
      res.status(400).json({ success: false, message: 'Invalid analytics payload' });
      return;
    }
    const accepted = insertBatch({
      sessionId,
      visitorHash: hashVisitor(visitorId),
      session: typeof body.session === 'object' && body.session ? body.session as Record<string, unknown> : {},
      events,
    });
    logger.debug('analytics', 'events_saved', 'Analytics events saved', {
      requestId: req.requestId,
      received: events.length,
      accepted,
      durationMs: Date.now() - startedAt,
    });
    res.json({ success: true, accepted });
  } catch (error) {
    logger.warn('analytics', 'payload_rejected', 'Analytics payload rejected', {
      requestId: req.requestId,
      reason: 'validation_error',
      error,
    });
    res.status(400).json({ success: false, message: 'Invalid analytics payload' });
  }
});

export default router;

import { Router, type Response } from 'express';
import { db } from '../db';
import type { AdminRequest } from '../security/admin-session';

const router = Router();
const eventTypes = new Set([
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

const text = (value: unknown, max: number): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
};

const numberParam = (value: unknown, fallback: number, min: number, max: number): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

const eventWhere = (query: AdminRequest['query']): { where: string; values: unknown[] } => {
  const clauses: string[] = [];
  const values: unknown[] = [];
  const from = text(query.from, 30);
  const to = text(query.to, 30);
  const eventType = text(query.eventType, 60);
  const eventName = text(query.eventName, 120);
  if (from) {
    clauses.push('created_at >= ?');
    values.push(from.includes('T') ? from : `${from}T00:00:00.000Z`);
  }
  if (to) {
    clauses.push('created_at <= ?');
    values.push(to.includes('T') ? to : `${to}T23:59:59.999Z`);
  }
  if (eventType && eventTypes.has(eventType)) {
    clauses.push('event_type = ?');
    values.push(eventType);
  }
  if (eventName) {
    clauses.push('event_name = ?');
    values.push(eventName);
  }
  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values };
};

const sessionWhere = (query: AdminRequest['query']): { where: string; values: unknown[] } => {
  const clauses: string[] = [];
  const values: unknown[] = [];
  const from = text(query.from, 30);
  const to = text(query.to, 30);
  if (from) {
    clauses.push('started_at >= ?');
    values.push(from.includes('T') ? from : `${from}T00:00:00.000Z`);
  }
  if (to) {
    clauses.push('started_at <= ?');
    values.push(to.includes('T') ? to : `${to}T23:59:59.999Z`);
  }
  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values };
};

const scalar = (sql: string, values: unknown[] = []): number => (db.prepare(sql).get(...values) as { count: number }).count;

router.get('/analytics/overview', (req: AdminRequest, res: Response): void => {
  const { where, values } = eventWhere(req.query);
  const { where: sessionFilter, values: sessionValues } = sessionWhere(req.query);
  const sessions = scalar(`SELECT COUNT(*) AS count FROM analytics_sessions ${sessionFilter}`, sessionValues);
  const pageViews = scalar(`SELECT COUNT(*) AS count FROM analytics_events ${where ? `${where} AND` : 'WHERE'} event_type = 'page_view'`, values);
  const contactFormSuccess = scalar(`SELECT COUNT(*) AS count FROM analytics_events ${where ? `${where} AND` : 'WHERE'} event_type = 'contact_form_success'`, values);
  const timeline = db.prepare(`
    SELECT date(created_at) AS date, COUNT(*) AS count
    FROM analytics_events
    ${where}
    GROUP BY date(created_at)
    ORDER BY date ASC
    LIMIT 120
  `).all(...values);

  res.header('Cache-Control', 'no-store').json({
    success: true,
    message: 'โหลดข้อมูลสำเร็จ',
    data: {
      pageViews,
      sessions,
      estimatedUniqueVisitors: scalar(`SELECT COUNT(DISTINCT visitor_id_hash) AS count FROM analytics_sessions ${sessionFilter ? `${sessionFilter} AND` : 'WHERE'} visitor_id_hash IS NOT NULL`, sessionValues),
      buttonClicks: scalar(`SELECT COUNT(*) AS count FROM analytics_events ${where ? `${where} AND` : 'WHERE'} event_type = 'button_click'`, values),
      serviceClicks: scalar(`SELECT COUNT(*) AS count FROM analytics_events ${where ? `${where} AND` : 'WHERE'} event_type = 'service_click'`, values),
      lineClicks: scalar(`SELECT COUNT(*) AS count FROM analytics_events ${where ? `${where} AND` : 'WHERE'} event_type = 'line_click'`, values),
      contactFormSubmits: scalar(`SELECT COUNT(*) AS count FROM analytics_events ${where ? `${where} AND` : 'WHERE'} event_type = 'contact_form_submit'`, values),
      contactFormSuccess,
      conversionRate: sessions ? Number(((contactFormSuccess / sessions) * 100).toFixed(2)) : 0,
      averagePagesPerSession: sessions ? Number((pageViews / sessions).toFixed(2)) : 0,
      timeline,
    },
  });
});

router.get('/analytics/pages', (req: AdminRequest, res: Response): void => {
  const { where, values } = eventWhere({ ...req.query, eventType: 'page_view' });
  const total = scalar(`SELECT COUNT(*) AS count FROM analytics_events ${where}`, values);
  const rows = db.prepare(`
    SELECT page_path AS pagePath, COUNT(*) AS views, COUNT(DISTINCT session_id) AS uniqueSessions
    FROM analytics_events
    ${where}
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT ?
  `).all(...values, numberParam(req.query.limit, 20, 1, 100)) as Array<Record<string, number | string>>;
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดข้อมูลสำเร็จ', data: rows.map(row => ({ ...row, percentage: total ? Number((Number(row.views) / total * 100).toFixed(2)) : 0 })) });
});

router.get('/analytics/events', (req: AdminRequest, res: Response): void => {
  const { where, values } = eventWhere(req.query);
  const rows = db.prepare(`
    SELECT event_type AS eventType, event_name AS eventName, COUNT(*) AS count, COUNT(DISTINCT session_id) AS uniqueSessions
    FROM analytics_events
    ${where}
    GROUP BY event_type, event_name
    ORDER BY count DESC
    LIMIT ?
  `).all(...values, numberParam(req.query.limit, 50, 1, 100));
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดข้อมูลสำเร็จ', data: rows });
});

router.get('/analytics/referrers', (req: AdminRequest, res: Response): void => {
  const { where, values } = sessionWhere(req.query);
  const rows = db.prepare(`
    SELECT COALESCE(NULLIF(referrer, ''), '(direct)') AS referrer, COUNT(*) AS sessions
    FROM analytics_sessions
    ${where}
    GROUP BY COALESCE(NULLIF(referrer, ''), '(direct)')
    ORDER BY sessions DESC
    LIMIT ?
  `).all(...values, numberParam(req.query.limit, 20, 1, 100));
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดข้อมูลสำเร็จ', data: rows });
});

router.get('/analytics/devices', (req: AdminRequest, res: Response): void => {
  const { where, values } = sessionWhere(req.query);
  const rows = db.prepare(`
    SELECT COALESCE(device_type, 'unknown') AS deviceType,
      COALESCE(browser, 'unknown') AS browser,
      COALESCE(operating_system, 'unknown') AS operatingSystem,
      COUNT(*) AS sessions
    FROM analytics_sessions
    ${where}
    GROUP BY device_type, browser, operating_system
    ORDER BY sessions DESC
    LIMIT ?
  `).all(...values, numberParam(req.query.limit, 50, 1, 100));
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดข้อมูลสำเร็จ', data: rows });
});

export default router;

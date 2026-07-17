import 'dotenv/config';
import { db } from '../db';

const days = Number(process.env.ANALYTICS_RETENTION_DAYS ?? 180);
const retentionDays = Number.isFinite(days) && days > 0 ? days : 180;
const eventResult = db.prepare("DELETE FROM analytics_events WHERE created_at < datetime('now', ?)").run(`-${retentionDays} days`);
const sessionResult = db.prepare(`
  DELETE FROM analytics_sessions
  WHERE started_at < datetime('now', ?)
    AND session_id NOT IN (SELECT DISTINCT session_id FROM analytics_events)
`).run(`-${retentionDays} days`);

console.log(JSON.stringify({ deletedEvents: eventResult.changes, deletedSessions: sessionResult.changes }));

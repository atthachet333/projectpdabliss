import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { db } from '../db';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Demo seed is disabled in production');
}

const pages = ['/', '/services', '/contact', '/about'];
const referrers = ['', 'https://www.google.com/search?q=pda+bliss', 'https://line.me/', 'https://facebook.com/'];
const devices = [
  ['mobile', 'Chrome', 'Android'],
  ['desktop', 'Chrome', 'Windows'],
  ['mobile', 'Safari', 'iOS'],
  ['desktop', 'Edge', 'Windows'],
] as const;
const services = ['service_01', 'service_02', 'service_03', 'service_04', 'service_05', 'service_06'];
const leadStatuses = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED'];

const insertSession = db.prepare(`
  INSERT OR IGNORE INTO analytics_sessions (
    session_id, visitor_id_hash, first_page, last_page, referrer, device_type, browser,
    operating_system, started_at, last_seen_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertEvent = db.prepare(`
  INSERT OR IGNORE INTO analytics_events (
    event_id, session_id, event_type, event_name, page_path, element_id, metadata, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertLead = db.prepare(`
  INSERT INTO contact_leads (
    name, phone, email, topic, details, source_page, status, email_delivery_status, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const existingSessions = db.prepare('SELECT COUNT(*) AS count FROM analytics_sessions');
const existingLeads = db.prepare('SELECT COUNT(*) AS count FROM contact_leads');

const count = (statement: typeof existingSessions): number => (statement.get() as { count: number }).count;

const seed = db.transaction(() => {
  let events = 0;
  let sessions = 0;
  let leads = 0;

  if (count(existingSessions) < 20) {
    for (let day = 59; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      const dailySessions = 4 + (day % 7);
      for (let index = 0; index < dailySessions; index++) {
        const sessionId = randomUUID();
        const page = pages[(day + index) % pages.length];
        const referrer = referrers[(day + index) % referrers.length];
        const device = devices[(day + index) % devices.length];
        const startedAt = new Date(date.getTime() + index * 37 * 60 * 1000).toISOString();
        insertSession.run(sessionId, randomUUID().replaceAll('-', ''), page, page, referrer, device[0], device[1], device[2], startedAt, startedAt);
        sessions += 1;
        for (const path of [page, ...(index % 2 === 0 ? ['/services'] : [])]) {
          insertEvent.run(randomUUID(), sessionId, 'page_view', 'page_view', path, null, null, startedAt);
          events += 1;
        }
        if (index % 2 === 0) {
          insertEvent.run(randomUUID(), sessionId, 'service_click', services[(day + index) % services.length], '/services', services[(day + index) % services.length], JSON.stringify({ serviceKey: services[(day + index) % services.length] }), startedAt);
          events += 1;
        }
        if (index % 3 === 0) {
          insertEvent.run(randomUUID(), sessionId, 'line_click', 'line_official_contact', page, 'line_official_contact', JSON.stringify({ linkType: 'line' }), startedAt);
          events += 1;
        }
        if (index % 4 === 0) {
          insertEvent.run(randomUUID(), sessionId, 'contact_form_submit', 'contact_form_submit', '/contact', null, JSON.stringify({ formName: 'contact_page_form' }), startedAt);
          insertEvent.run(randomUUID(), sessionId, index % 8 === 0 ? 'contact_form_error' : 'contact_form_success', index % 8 === 0 ? 'contact_form_error' : 'contact_form_success', '/contact', null, JSON.stringify({ formName: 'contact_page_form', result: index % 8 === 0 ? 'error' : 'success' }), startedAt);
          events += 2;
        }
      }
    }
  }

  if (count(existingLeads) < 10) {
    for (let index = 0; index < 24; index++) {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const createdAt = date.toISOString();
      insertLead.run(
        `ลูกค้าทดลอง ${index + 1}`,
        `08000000${String(index).padStart(2, '0')}`,
        index % 3 === 0 ? null : `demo${index + 1}@example.com`,
        ['แจ้งเข้า - เปลี่ยนนายจ้าง', 'ขึ้นทะเบียนแรงงาน', 'รายงานตัว 90D', 'ทำเล่ม CI, Passport, PJ'][index % 4],
        'ข้อมูลตัวอย่างสำหรับทดสอบระบบหลังบ้าน',
        pages[index % pages.length],
        leadStatuses[index % leadStatuses.length],
        index % 5 === 0 ? 'FAILED' : 'SENT',
        createdAt,
        createdAt
      );
      leads += 1;
    }
  }

  return { sessions, events, leads };
});

console.log(JSON.stringify(seed()));

import { Router, type Response } from 'express';
import { db } from '../db';
import { logger } from '../lib/logger';
import type { AdminRequest } from '../security/admin-session';
import type { ApiResponse } from '../types/contact';

const router = Router();
const statuses = new Set(['NEW', 'CONTACTED', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED']);
const emailStatuses = new Set(['PENDING', 'SENT', 'FAILED']);
const sortColumns: Record<string, string> = {
  id: 'id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  status: 'status',
  email_delivery_status: 'email_delivery_status',
};

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

const mapLead = (row: Record<string, unknown>) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  email: row.email,
  topic: row.topic,
  details: row.details,
  sourcePage: row.source_page,
  status: row.status,
  emailDeliveryStatus: row.email_delivery_status,
  emailProviderId: row.email_provider_id,
  note: row.note,
  assignedTo: row.assigned_to,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const leadWhere = (query: AdminRequest['query']): { where: string; values: unknown[] } => {
  const clauses: string[] = [];
  const values: unknown[] = [];
  const search = text(query.search, 120);
  const status = text(query.status, 30);
  const emailDeliveryStatus = text(query.emailDeliveryStatus, 30);
  const from = text(query.from, 30);
  const to = text(query.to, 30);

  if (search) {
    const like = `%${search}%`;
    clauses.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR topic LIKE ? OR details LIKE ?)');
    values.push(like, like, like, like, like);
  }
  if (status && statuses.has(status)) {
    clauses.push('status = ?');
    values.push(status);
  }
  if (emailDeliveryStatus && emailStatuses.has(emailDeliveryStatus)) {
    clauses.push('email_delivery_status = ?');
    values.push(emailDeliveryStatus);
  }
  if (from) {
    clauses.push('created_at >= ?');
    values.push(from);
  }
  if (to) {
    clauses.push('created_at <= ?');
    values.push(to);
  }

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values };
};

router.get('/leads', (req: AdminRequest, res: Response): void => {
  const page = numberParam(req.query.page, 1, 1, 100000);
  const limit = numberParam(req.query.limit, 20, 1, 100);
  const sortByInput = text(req.query.sortBy, 40) ?? 'created_at';
  const sortBy = sortColumns[sortByInput] ?? 'created_at';
  const sortOrder = text(req.query.sortOrder, 10)?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;
  const { where, values } = leadWhere(req.query);

  const total = (db.prepare(`SELECT COUNT(*) AS count FROM contact_leads ${where}`).get(...values) as { count: number }).count;
  const rows = db.prepare(`
    SELECT id, name, phone, email, topic, details, source_page, status, email_delivery_status,
      email_provider_id, note, assigned_to, created_at, updated_at
    FROM contact_leads
    ${where}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `).all(...values, limit, offset) as Record<string, unknown>[];

  res.header('Cache-Control', 'no-store').json({
    success: true,
    message: 'โหลดข้อมูลสำเร็จ',
    data: rows.map(mapLead),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

router.get('/leads/:id', (req: AdminRequest, res: Response<ApiResponse<unknown>>): void => {
  const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
  const row = db.prepare(`
    SELECT id, name, phone, email, topic, details, source_page, status, email_delivery_status,
      email_provider_id, note, assigned_to, created_at, updated_at
    FROM contact_leads
    WHERE id = ?
  `).get(id) as Record<string, unknown> | undefined;

  if (!row) {
    res.status(404).json({ success: false, message: 'ไม่พบข้อมูล Lead' });
    return;
  }

  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดข้อมูลสำเร็จ', data: mapLead(row) });
});

router.patch('/leads/:id', (req: AdminRequest, res: Response<ApiResponse<unknown>>): void => {
  const body = req.body as Record<string, unknown>;
  const allowed = new Set(['status', 'note', 'assignedTo']);
  if (Object.keys(body).some(key => !allowed.has(key))) {
    res.status(400).json({ success: false, message: 'ข้อมูลที่ส่งมาไม่ถูกต้อง' });
    return;
  }

  const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
  const current = db.prepare('SELECT id, status, note, assigned_to FROM contact_leads WHERE id = ?').get(id) as { id: number; status: string; note: string | null; assigned_to: string | null } | undefined;
  if (!current) {
    logger.warn('admin_leads', 'lead_update_not_found', 'Admin tried to update a missing lead', {
      requestId: req.requestId,
      adminId: req.admin?.id,
      leadId: id,
    });
    res.status(404).json({ success: false, message: 'ไม่พบข้อมูล Lead' });
    return;
  }

  const status = text(body.status, 30);
  const note = body.note === null ? null : text(body.note, 1000);
  const assignedTo = body.assignedTo === null ? null : text(body.assignedTo, 120);
  if (status && !statuses.has(status)) {
    logger.warn('admin_leads', 'lead_update_rejected', 'Admin lead update rejected', {
      requestId: req.requestId,
      adminId: req.admin?.id,
      leadId: id,
      reason: 'invalid_status',
    });
    res.status(400).json({ success: false, message: 'สถานะไม่ถูกต้อง' });
    return;
  }

  db.prepare(`
    UPDATE contact_leads
    SET status = ?,
      note = ?,
      assigned_to = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(status ?? current.status, body.note === undefined ? current.note : note, body.assignedTo === undefined ? current.assigned_to : assignedTo, id);

  const row = db.prepare(`
    SELECT id, name, phone, email, topic, details, source_page, status, email_delivery_status,
      email_provider_id, note, assigned_to, created_at, updated_at
    FROM contact_leads WHERE id = ?
  `).get(id) as Record<string, unknown>;
  logger.info('admin_leads', 'lead_updated', 'Admin lead updated', {
    requestId: req.requestId,
    adminId: req.admin?.id,
    leadId: id,
    changedFields: Object.keys(body),
    previousStatus: current.status,
    nextStatus: row.status,
  });
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'บันทึกข้อมูลสำเร็จ', data: mapLead(row) });
});

router.get('/dashboard/summary', (req: AdminRequest, res: Response): void => {
  const { where, values } = leadWhere(req.query);
  const statusCounts = db.prepare(`
    SELECT status, COUNT(*) AS count
    FROM contact_leads
    ${where}
    GROUP BY status
  `).all(...values) as { status: string; count: number }[];
  const emailCounts = db.prepare(`
    SELECT email_delivery_status AS status, COUNT(*) AS count
    FROM contact_leads
    ${where}
    GROUP BY email_delivery_status
  `).all(...values) as { status: string; count: number }[];
  const totalLeads = (db.prepare(`SELECT COUNT(*) AS count FROM contact_leads ${where}`).get(...values) as { count: number }).count;
  const recentLeads = db.prepare(`
    SELECT id, name, phone, email, topic, details, source_page, status, email_delivery_status,
      email_provider_id, note, assigned_to, created_at, updated_at
    FROM contact_leads
    ORDER BY created_at DESC
    LIMIT 5
  `).all() as Record<string, unknown>[];
  const countStatus = (status: string): number => statusCounts.find(row => row.status === status)?.count ?? 0;
  const countEmail = (status: string): number => emailCounts.find(row => row.status === status)?.count ?? 0;

  res.header('Cache-Control', 'no-store').json({
    success: true,
    message: 'โหลดข้อมูลสำเร็จ',
    data: {
      totalLeads,
      newLeads: countStatus('NEW'),
      contactedLeads: countStatus('CONTACTED'),
      followUpLeads: countStatus('FOLLOW_UP'),
      completedLeads: countStatus('COMPLETED'),
      cancelledLeads: countStatus('CANCELLED'),
      todayLeads: (db.prepare("SELECT COUNT(*) AS count FROM contact_leads WHERE date(created_at) = date('now')").get() as { count: number }).count,
      thisWeekLeads: (db.prepare("SELECT COUNT(*) AS count FROM contact_leads WHERE created_at >= datetime('now', '-7 days')").get() as { count: number }).count,
      thisMonthLeads: (db.prepare("SELECT COUNT(*) AS count FROM contact_leads WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get() as { count: number }).count,
      emailSent: countEmail('SENT'),
      emailFailed: countEmail('FAILED'),
      recentLeads: recentLeads.map(mapLead),
    },
  });
});

export default router;

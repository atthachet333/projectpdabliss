import { Router, type Request, type Response } from 'express';
import { Resend } from 'resend';
import { db } from '../db';
import type { ApiResponse, ContactRequestBody } from '../types/contact';

const router = Router();
const failMessage = 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง';
const emailKeys = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_RECEIVER_EMAIL'] as const;

type CleanContact = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  subject?: string;
  message?: string;
  pageUrl?: string;
};

const text = (value: unknown, max: number): string | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
};

const escapeHtml = (value = ''): string =>
  value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char));

const validate = (body: ContactRequestBody): { data?: CleanContact; errors?: string[]; bot?: boolean } => {
  if (text(body.website, 200)) return { bot: true };

  const data: CleanContact = {
    name: text(body.name, 120) ?? '',
    phone: text(body.phone, 40) ?? '',
    email: text(body.email, 160),
    service: text(body.service, 160),
    subject: text(body.subject, 160) ?? text(body.topic, 160),
    message: text(body.message, 1200) ?? text(body.details, 1200),
    pageUrl: text(body.pageUrl, 300),
  };

  const errors: string[] = [];
  if (!data.name) errors.push('กรุณาระบุชื่อ');
  if (!data.phone) errors.push('กรุณาระบุเบอร์โทรศัพท์');
  if (body.email !== undefined && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  if (body.consent !== undefined && body.consent !== true) errors.push('กรุณายอมรับเงื่อนไขการเก็บข้อมูล');
  if (['name', 'phone', 'email', 'service', 'topic', 'subject', 'message', 'details', 'pageUrl'].some(key => body[key as keyof ContactRequestBody] !== undefined && typeof body[key as keyof ContactRequestBody] !== 'string')) {
    errors.push('ข้อมูลไม่ถูกต้อง');
  }

  return errors.length ? { errors } : { data };
};

const mailBody = (data: CleanContact): string => {
  const rows = [
    ['ชื่อผู้ติดต่อ', data.name],
    ['เบอร์โทรศัพท์', data.phone],
    ['อีเมล', data.email ?? '-'],
    ['บริการที่สนใจ', data.service ?? '-'],
    ['หัวข้อ', data.subject ?? '-'],
    ['รายละเอียด', data.message ?? '-'],
    ['วันที่และเวลา', new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })],
    ['หน้าที่ส่งข้อความ', data.pageUrl ?? '-'],
  ];

  return `<p>มีผู้ติดต่อด่วนผ่านเว็บไซต์ PDA Bliss</p>${rows
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join('')}`;
};

const missingEmailKeys = (): string[] => emailKeys.filter(key => !process.env[key]?.trim());

const logEmailStatus = (missing: string[]): void => {
  for (const key of emailKeys) {
    console.warn(`${key} configured: ${!missing.includes(key)}`);
  }
  console.warn(`Missing email config: ${missing.join(', ')}`);
};

const providerErrorInfo = (error: unknown): Record<string, unknown> => {
  if (!error || typeof error !== 'object') return { message: 'Unknown error' };
  const meta = error as {
    name?: unknown;
    message?: unknown;
    code?: unknown;
    statusCode?: unknown;
    status?: unknown;
    responseCode?: unknown;
    response?: unknown;
  };

  return {
    name: meta.name,
    code: meta.code,
    status: meta.status ?? meta.statusCode,
    responseCode: meta.responseCode,
    response: meta.response,
    message: meta.message ?? 'Unknown error',
  };
};

const providerStatus = (error: unknown): number => {
  if (!error || typeof error !== 'object') return 502;
  const status = (error as { status?: unknown; statusCode?: unknown }).status ?? (error as { statusCode?: unknown }).statusCode;
  return typeof status === 'number' && status >= 400 && status <= 599 ? status : 502;
};

const findRecentLead = db.prepare(`
  SELECT id, email_delivery_status
  FROM contact_leads
  WHERE name = ?
    AND phone = ?
    AND COALESCE(email, '') = COALESCE(?, '')
    AND COALESCE(topic, '') = COALESCE(?, '')
    AND details = ?
    AND COALESCE(source_page, '') = COALESCE(?, '')
    AND created_at >= datetime('now', '-2 minutes')
  ORDER BY id DESC
  LIMIT 1
`);

const insertLead = db.prepare(`
  INSERT INTO contact_leads (name, phone, email, topic, details, source_page, email_delivery_status)
  VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
`);

const updateLeadDelivery = db.prepare(`
  UPDATE contact_leads
  SET email_delivery_status = ?, email_provider_id = ?, updated_at = datetime('now')
  WHERE id = ?
`);

const leadValues = (data: CleanContact): [string, string, string | null, string | null, string, string | null] => [
  data.name,
  data.phone,
  data.email ?? null,
  data.subject ?? data.service ?? null,
  data.message ?? '-',
  data.pageUrl ?? null,
];

router.post('/', async (req: Request<Record<string, never>, ApiResponse<never>, ContactRequestBody>, res: Response<ApiResponse<never>>): Promise<void> => {
  const result = validate(req.body);
  if (result.bot) {
    res.json({ success: true, message: 'ส่งข้อความเรียบร้อยแล้ว' });
    return;
  }
  if (result.errors || !result.data) {
    res.status(400).json({ success: false, message: failMessage, errors: result.errors });
    return;
  }

  const values = leadValues(result.data);
  const recentLead = findRecentLead.get(...values) as { id: number; email_delivery_status: string } | undefined;
  if (recentLead) {
    if (recentLead.email_delivery_status === 'FAILED') {
      res.status(502).json({ success: false, message: failMessage });
      return;
    }
    res.json({ success: true, message: 'ส่งข้อความเรียบร้อยแล้ว' });
    return;
  }

  const leadId = Number(insertLead.run(...values).lastInsertRowid);
  const missing = missingEmailKeys();
  if (missing.length) {
    logEmailStatus(missing);
    updateLeadDelivery.run('FAILED', null, leadId);
    res.status(503).json({ success: false, message: failMessage, errors: missing.map(key => `Missing environment variable: ${key}`) });
    return;
  }

  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_RECEIVER_EMAIL } = process.env as Record<(typeof emailKeys)[number], string>;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_RECEIVER_EMAIL],
      subject: `[ติดต่อด่วนจากเว็บไซต์ PDA Bliss] ${result.data.name}`,
      html: mailBody(result.data),
      ...(result.data.email ? { replyTo: result.data.email } : {}),
    });

    if (error) throw error;
    updateLeadDelivery.run('SENT', data?.id ?? null, leadId);
    console.log(`Resend email id returned: ${Boolean(data?.id)}`);

    res.json({ success: true, message: 'ส่งข้อความเรียบร้อยแล้ว' });
  } catch (error) {
    updateLeadDelivery.run('FAILED', null, leadId);
    console.error('Contact email failed', providerErrorInfo(error));
    res.status(providerStatus(error)).json({ success: false, message: failMessage });
  }
});

export default router;

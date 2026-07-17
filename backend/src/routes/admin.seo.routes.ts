import { Router, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { db } from '../db';
import type { AdminRequest } from '../security/admin-session';
import { scanAllSeoPages, scanSeoPage, type SeoIssue } from '../seo/seo-scanner';
import { clearSeoCache } from '../seo/public-seo';
import type { ApiResponse } from '../types/contact';

const router = Router();
const scanLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'สแกนบ่อยเกินไป กรุณาลองใหม่ภายหลัง' },
});

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
const jsonText = (value: unknown, max: number): string | null | undefined => {
  if (value === null) return null;
  const raw = text(value, max);
  if (!raw) return raw;
  if (raw.includes('</script')) throw new Error('Unsafe JSON');
  JSON.parse(raw);
  return raw;
};
const keywordJson = (value: unknown): string | null | undefined => {
  if (value === null) return null;
  const raw = text(value, 500);
  if (!raw) return raw;
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed) || parsed.some(item => typeof item !== 'string')) throw new Error('Invalid keywords');
  return JSON.stringify(parsed.slice(0, 20));
};
const has = (body: Record<string, unknown>, key: string): boolean => Object.prototype.hasOwnProperty.call(body, key);
const safeUrl = (value: unknown): string | null | undefined => {
  if (value === null) return null;
  const raw = text(value, 500);
  if (!raw) return raw;
  const url = new URL(raw);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid URL');
  return raw;
};
const twitterCards = new Set(['summary', 'summary_large_image']);
const publicFields = [
  'page_name', 'title', 'meta_description', 'canonical_url', 'robots_index', 'robots_follow',
  'og_title', 'og_description', 'og_image', 'twitter_card', 'primary_keyword',
  'secondary_keywords', 'schema_type', 'schema_json',
];
const snapshot = (row: Record<string, unknown>): Record<string, unknown> => Object.fromEntries(publicFields.map(field => [field, row[field]]));
const parseIssues = (value: unknown): SeoIssue[] => {
  if (typeof value !== 'string') return [];
  try {
    return JSON.parse(value) as SeoIssue[];
  } catch {
    return [];
  }
};
const latestAuditJoin = `
  LEFT JOIN seo_audits latest ON latest.id = (
    SELECT id FROM seo_audits WHERE route_path = seo_pages.route_path ORDER BY id DESC LIMIT 1
  )
`;
const mapPage = (row: Record<string, unknown>) => ({
  id: row.id,
  routePath: row.route_path,
  pageName: row.page_name,
  title: row.title,
  metaDescription: row.meta_description,
  canonicalUrl: row.canonical_url,
  robotsIndex: Boolean(row.robots_index),
  robotsFollow: Boolean(row.robots_follow),
  ogTitle: row.og_title,
  ogDescription: row.og_description,
  ogImage: row.og_image,
  twitterCard: row.twitter_card,
  primaryKeyword: row.primary_keyword,
  secondaryKeywords: row.secondary_keywords,
  schemaType: row.schema_type,
  schemaJson: row.schema_json,
  isActive: Boolean(row.is_active),
  latestAudit: row.overall_score === null || row.overall_score === undefined ? null : {
    id: row.audit_id,
    overallScore: row.overall_score,
    technicalScore: row.technical_score,
    contentScore: row.content_score,
    metadataScore: row.metadata_score,
    accessibilityScore: row.accessibility_score,
    performanceScore: row.performance_score,
    issues: parseIssues(row.issues_json),
    createdAt: row.audit_created_at,
  },
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
const auditSelect = `
  SELECT id, route_path AS routePath, overall_score AS overallScore, technical_score AS technicalScore,
    content_score AS contentScore, metadata_score AS metadataScore, accessibility_score AS accessibilityScore,
    performance_score AS performanceScore, issues_json AS issuesJson, metrics_json AS metricsJson,
    source_type AS sourceType, created_at AS createdAt
  FROM seo_audits
`;

router.get('/seo/summary', (_req: AdminRequest, res: Response): void => {
  const rows = db.prepare(`
    SELECT seo_pages.route_path, seo_pages.page_name, latest.overall_score, latest.issues_json, latest.created_at
    FROM seo_pages
    ${latestAuditJoin}
    WHERE seo_pages.is_active = 1
    ORDER BY seo_pages.id
  `).all() as Record<string, unknown>[];
  const issues = rows.flatMap(row => parseIssues(row.issues_json));
  const scanned = rows.filter(row => typeof row.overall_score === 'number');
  const pagesNeedingWork = rows
    .filter(row => typeof row.overall_score !== 'number' || Number(row.overall_score) < 80)
    .sort((a, b) => Number(a.overall_score ?? -1) - Number(b.overall_score ?? -1))
    .slice(0, 5);
  const pendingRecommendations = (db.prepare("SELECT COUNT(*) AS count FROM seo_recommendations WHERE status = 'DRAFT'").get() as { count: number }).count;

  res.header('Cache-Control', 'no-store').json({
    success: true,
    message: 'โหลดข้อมูล SEO สำเร็จ',
    data: {
      averageScore: scanned.length ? Math.round(scanned.reduce((sum, row) => sum + Number(row.overall_score), 0) / scanned.length) : 0,
      scannedPages: scanned.length,
      totalPages: rows.length,
      criticalIssues: issues.filter(issue => issue.severity === 'CRITICAL').length,
      highIssues: issues.filter(issue => issue.severity === 'HIGH').length,
      readyPages: scanned.filter(row => Number(row.overall_score) >= 80).length,
      pendingRecommendations,
      metadataMissing: issues.filter(issue => issue.category === 'metadata').length,
      missingH1: issues.filter(issue => issue.code === 'MISSING_H1').length,
      missingAlt: issues.filter(issue => issue.code === 'IMAGE_MISSING_ALT').length,
      missingSchema: issues.filter(issue => issue.code === 'MISSING_SCHEMA').length,
      bestPage: scanned.sort((a, b) => Number(b.overall_score) - Number(a.overall_score))[0] ?? null,
      pagesNeedingWork,
      commonIssues: Object.entries(issues.reduce<Record<string, number>>((acc, item) => {
        acc[item.code] = (acc[item.code] ?? 0) + 1;
        return acc;
      }, {})).map(([code, count]) => ({ code, count })).sort((a, b) => b.count - a.count).slice(0, 6),
    },
  });
});

router.get('/seo/pages', (req: AdminRequest, res: Response): void => {
  const score = text(req.query.score, 20);
  const rows = db.prepare(`
    SELECT seo_pages.*, latest.id AS audit_id, latest.overall_score, latest.technical_score,
      latest.content_score, latest.metadata_score, latest.accessibility_score, latest.performance_score,
      latest.issues_json, latest.created_at AS audit_created_at
    FROM seo_pages
    ${latestAuditJoin}
    WHERE seo_pages.is_active = 1
    ORDER BY seo_pages.id
  `).all() as Record<string, unknown>[];
  const filtered = rows.filter(row => {
    const latest = Number(row.overall_score ?? -1);
    const issues = parseIssues(row.issues_json);
    if (score === 'lt50') return latest >= 0 && latest < 50;
    if (score === '50to79') return latest >= 50 && latest < 80;
    if (score === 'gte80') return latest >= 80;
    if (score === 'critical') return issues.some(issue => issue.severity === 'CRITICAL');
    if (score === 'meta') return issues.some(issue => issue.category === 'metadata');
    if (score === 'schema') return issues.some(issue => issue.code === 'MISSING_SCHEMA');
    if (score === 'never') return latest < 0;
    return true;
  });
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดข้อมูล SEO Pages สำเร็จ', data: filtered.map(mapPage) });
});

router.get('/seo/pages/:id', (req: AdminRequest, res: Response<ApiResponse<unknown>>): void => {
  const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
  const row = db.prepare(`
    SELECT seo_pages.*, latest.id AS audit_id, latest.overall_score, latest.technical_score,
      latest.content_score, latest.metadata_score, latest.accessibility_score, latest.performance_score,
      latest.issues_json, latest.created_at AS audit_created_at
    FROM seo_pages
    ${latestAuditJoin}
    WHERE seo_pages.id = ?
  `).get(id) as Record<string, unknown> | undefined;
  if (!row) {
    res.status(404).json({ success: false, message: 'ไม่พบหน้า SEO' });
    return;
  }
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดข้อมูลสำเร็จ', data: mapPage(row) });
});

router.patch('/seo/pages/:id', (req: AdminRequest, res: Response<ApiResponse<unknown>>): void => {
  try {
    const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
    const current = db.prepare('SELECT * FROM seo_pages WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!current) {
      res.status(404).json({ success: false, message: 'ไม่พบหน้า SEO' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    if (has(body, 'title') && !text(body.title, 120)) {
      res.status(400).json({ success: false, message: 'SEO Title ห้ามว่าง' });
      return;
    }
    const twitterCard = has(body, 'twitterCard') ? text(body.twitterCard, 60) : current.twitter_card;
    if (twitterCard && !twitterCards.has(String(twitterCard))) {
      res.status(400).json({ success: false, message: 'Twitter Card ไม่ถูกต้อง' });
      return;
    }
    const schemaJson = has(body, 'schemaJson') ? jsonText(body.schemaJson, 10000) : current.schema_json;
    const secondaryKeywords = has(body, 'secondaryKeywords') ? keywordJson(body.secondaryKeywords) : current.secondary_keywords;
    db.prepare(`
      UPDATE seo_pages
      SET page_name = COALESCE(?, page_name),
        title = ?, meta_description = ?, canonical_url = ?,
        robots_index = ?, robots_follow = ?, og_title = ?, og_description = ?,
        og_image = ?, twitter_card = ?, primary_keyword = ?, secondary_keywords = ?,
        schema_type = ?, schema_json = ?, updated_by_admin_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      text(body.pageName, 120),
      has(body, 'title') ? text(body.title, 120) ?? null : current.title,
      has(body, 'metaDescription') ? text(body.metaDescription, 220) ?? null : current.meta_description,
      has(body, 'canonicalUrl') ? safeUrl(body.canonicalUrl) ?? null : current.canonical_url,
      has(body, 'robotsIndex') ? (body.robotsIndex === false ? 0 : 1) : current.robots_index,
      has(body, 'robotsFollow') ? (body.robotsFollow === false ? 0 : 1) : current.robots_follow,
      has(body, 'ogTitle') ? text(body.ogTitle, 120) ?? null : current.og_title,
      has(body, 'ogDescription') ? text(body.ogDescription, 220) ?? null : current.og_description,
      has(body, 'ogImage') ? safeUrl(body.ogImage) ?? null : current.og_image,
      twitterCard ?? null,
      has(body, 'primaryKeyword') ? text(body.primaryKeyword, 120) ?? null : current.primary_keyword,
      secondaryKeywords ?? null,
      has(body, 'schemaType') ? text(body.schemaType, 80) ?? null : current.schema_type,
      schemaJson ?? null,
      req.admin?.id ?? null,
      id
    );
    const row = db.prepare('SELECT * FROM seo_pages WHERE id = ?').get(id) as Record<string, unknown>;
    db.prepare(`
      INSERT INTO seo_change_logs (seo_page_id, route_path, changed_by_admin_id, old_values_json, new_values_json)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, row.route_path, req.admin?.id ?? null, JSON.stringify(snapshot(current)), JSON.stringify(snapshot(row)));
    clearSeoCache(String(row.route_path));
    res.header('Cache-Control', 'no-store').json({ success: true, message: 'บันทึกข้อมูล SEO สำเร็จ', data: mapPage(row) });
  } catch {
    res.status(400).json({ success: false, message: 'ข้อมูล SEO ไม่ถูกต้อง' });
  }
});

router.post('/seo/scan', scanLimiter, (req: AdminRequest, res: Response): void => {
  const results = scanAllSeoPages(req.admin?.id);
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'สแกน SEO ทั้งเว็บไซต์สำเร็จ', data: results });
});

router.post('/seo/scan/:routePath', scanLimiter, (req: AdminRequest, res: Response<ApiResponse<unknown>>): void => {
  try {
    const routePath = Array.isArray(req.params.routePath) ? req.params.routePath[0] : req.params.routePath;
    const result = scanSeoPage(decodeURIComponent(routePath), req.admin?.id);
    res.header('Cache-Control', 'no-store').json({ success: true, message: 'สแกน SEO สำเร็จ', data: result });
  } catch {
    res.status(404).json({ success: false, message: 'ไม่พบ route ที่ต้องการสแกน' });
  }
});

router.get('/seo/audits', (req: AdminRequest, res: Response): void => {
  const routePath = text(req.query.routePath, 200);
  const limit = numberParam(req.query.limit, 50, 1, 100);
  const rows = routePath
    ? db.prepare(`${auditSelect} WHERE route_path = ? ORDER BY id DESC LIMIT ?`).all(routePath, limit)
    : db.prepare(`${auditSelect} ORDER BY id DESC LIMIT ?`).all(limit);
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดประวัติ Audit สำเร็จ', data: rows });
});

router.get('/seo/audits/:id', (req: AdminRequest, res: Response<ApiResponse<unknown>>): void => {
  const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
  const row = db.prepare(`${auditSelect} WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!row) {
    res.status(404).json({ success: false, message: 'ไม่พบ Audit' });
    return;
  }
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลด Audit สำเร็จ', data: row });
});

router.get('/seo/recommendations', (_req: AdminRequest, res: Response): void => {
  const rows = db.prepare('SELECT * FROM seo_recommendations ORDER BY id DESC LIMIT 100').all();
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดคำแนะนำสำเร็จ', data: rows });
});

router.patch('/seo/recommendations/:id', (req: AdminRequest, res: Response<ApiResponse<unknown>>): void => {
  const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
  const status = text((req.body as { status?: unknown }).status, 20);
  if (!status || !['DRAFT', 'APPROVED', 'REJECTED', 'APPLIED'].includes(status)) {
    res.status(400).json({ success: false, message: 'สถานะคำแนะนำไม่ถูกต้อง' });
    return;
  }
  db.prepare("UPDATE seo_recommendations SET status = ?, approved_by_admin_id = ?, approved_at = CASE WHEN ? = 'APPROVED' THEN datetime('now') ELSE approved_at END, updated_at = datetime('now') WHERE id = ?").run(status, req.admin?.id ?? null, status, id);
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'อัปเดตคำแนะนำสำเร็จ' });
});

router.post('/seo/recommendations/:id/apply', (req: AdminRequest, res: Response<ApiResponse<never>>): void => {
  const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
  db.prepare("UPDATE seo_recommendations SET status = 'APPLIED', applied_at = datetime('now'), updated_at = datetime('now') WHERE id = ? AND status = 'APPROVED'").run(id);
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'บันทึกสถานะนำไปใช้แล้ว' });
});

router.get('/seo/experiments', (_req: AdminRequest, res: Response): void => {
  const rows = db.prepare('SELECT * FROM seo_experiments ORDER BY id DESC LIMIT 100').all();
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'โหลดแผนทดลองสำเร็จ', data: rows });
});

router.post('/seo/experiments', (req: AdminRequest, res: Response<ApiResponse<never>>): void => {
  const body = req.body as Record<string, unknown>;
  const routePath = text(body.routePath, 200);
  const name = text(body.experimentName, 160);
  const hypothesis = text(body.hypothesis, 1000);
  const metric = text(body.metricName, 120);
  if (!routePath || !name || !hypothesis || !metric) {
    res.status(400).json({ success: false, message: 'ข้อมูลแผนทดลองไม่ครบ' });
    return;
  }
  db.prepare('INSERT INTO seo_experiments (route_path, experiment_name, hypothesis, metric_name) VALUES (?, ?, ?, ?)').run(routePath, name, hypothesis, metric);
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'สร้างแผนทดลองสำเร็จ' });
});

router.patch('/seo/experiments/:id', (req: AdminRequest, res: Response<ApiResponse<never>>): void => {
  const id = numberParam(req.params.id, 0, 1, Number.MAX_SAFE_INTEGER);
  const status = text((req.body as { status?: unknown }).status, 20);
  if (!status || !['DRAFT', 'RUNNING', 'COMPLETED', 'CANCELLED'].includes(status)) {
    res.status(400).json({ success: false, message: 'สถานะแผนทดลองไม่ถูกต้อง' });
    return;
  }
  db.prepare("UPDATE seo_experiments SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'อัปเดตแผนทดลองสำเร็จ' });
});

export default router;

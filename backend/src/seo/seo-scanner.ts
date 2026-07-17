import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { db } from '../db';

export type SeoIssue = {
  code: string;
  category: 'metadata' | 'content' | 'technical' | 'links' | 'images' | 'accessibility' | 'performance';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  evidence: string;
  recommendation: string;
  affectedElement?: string;
  autoFixAvailable: boolean;
};

export type SeoAuditResult = {
  routePath: string;
  overallScore: number;
  technicalScore: number;
  contentScore: number;
  metadataScore: number;
  accessibilityScore: number;
  performanceScore: number;
  issues: SeoIssue[];
  metrics: Record<string, number | string | boolean>;
};

type SeoPageRow = {
  route_path: string;
  page_name: string;
  title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots_index: number;
  robots_follow: number;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_card: string | null;
  primary_keyword: string | null;
  schema_json: string | null;
};

const pageFiles: Record<string, string> = {
  '/': 'HomePage.tsx',
  '/about': 'AboutPage.tsx',
  '/services': 'ServicesPage.tsx',
  '/process': 'ProcessPage.tsx',
  '/contact': 'ContactPage.tsx',
};

const repoRoot = resolve(process.cwd(), '..');
const publicRoot = resolve(repoRoot, 'frontend', 'public');
const pageRoot = resolve(repoRoot, 'frontend', 'src', 'pages');

const pageStatement = db.prepare(`
  SELECT route_path, page_name, title, meta_description, canonical_url, robots_index, robots_follow,
    og_title, og_description, og_image, twitter_card, primary_keyword, schema_json
  FROM seo_pages
  WHERE route_path = ?
`);

const insertAudit = db.prepare(`
  INSERT INTO seo_audits (
    route_path, overall_score, technical_score, content_score, metadata_score,
    accessibility_score, performance_score, issues_json, metrics_json, source_type, created_by_admin_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SOURCE_SCAN', ?)
`);

const clamp = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));
const matches = (source: string, pattern: RegExp): number => source.match(pattern)?.length ?? 0;
const textLength = (source: string): number => source.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
const hasText = (value: string | null | undefined): boolean => Boolean(value?.trim());

const issue = (
  issues: SeoIssue[],
  code: SeoIssue['code'],
  category: SeoIssue['category'],
  severity: SeoIssue['severity'],
  message: string,
  evidence: string,
  recommendation: string,
  affectedElement?: string
): void => {
  issues.push({ code, category, severity, message, evidence, recommendation, affectedElement, autoFixAvailable: false });
};

const scoreFromDeductions = (base: number, deductions: number): number => clamp(((base - deductions) / base) * 100);

export const scanSeoPage = (routePath: string, adminId?: number): SeoAuditResult => {
  const page = pageStatement.get(routePath) as SeoPageRow | undefined;
  if (!page) throw new Error('SEO page not found');

  const fileName = pageFiles[routePath];
  const filePath = fileName ? resolve(pageRoot, fileName) : '';
  const sourceExists = Boolean(filePath && existsSync(filePath));
  const source = sourceExists ? readFileSync(filePath, 'utf8') : '';
  const issues: SeoIssue[] = [];

  let metadataDeduct = 0;
  let contentDeduct = 0;
  let technicalDeduct = 0;
  let linksDeduct = 0;
  let imagesDeduct = 0;
  let accessibilityDeduct = 0;
  let performanceDeduct = 0;

  if (!sourceExists) {
    technicalDeduct += 8;
    issue(issues, 'SOURCE_FILE_NOT_FOUND', 'technical', 'HIGH', 'ไม่พบไฟล์ source ของหน้านี้', routePath, 'ตรวจ route configuration และ mapping ของ scanner');
  }

  if (!hasText(page.title)) {
    metadataDeduct += 8;
    issue(issues, 'MISSING_TITLE', 'metadata', 'HIGH', 'หน้านี้ยังไม่มี SEO Title', page.route_path, 'เพิ่ม title ที่สื่อสารบริการและคำสำคัญหลัก');
  } else if (page.title!.length < 30 || page.title!.length > 65) {
    metadataDeduct += 3;
    issue(issues, 'TITLE_LENGTH_OUT_OF_RANGE', 'metadata', 'MEDIUM', 'ความยาว SEO Title ยังไม่เหมาะสม', `${page.title!.length} characters`, 'ปรับ title ให้อยู่ประมาณ 30-65 ตัวอักษร');
  }
  if (!hasText(page.meta_description)) {
    metadataDeduct += 6;
    issue(issues, 'MISSING_META_DESCRIPTION', 'metadata', 'HIGH', 'หน้านี้ยังไม่มี Meta Description', page.route_path, 'เพิ่มคำอธิบายที่ชัดเจนและมี CTA');
  } else if (page.meta_description!.length < 80 || page.meta_description!.length > 160) {
    metadataDeduct += 3;
    issue(issues, 'DESCRIPTION_LENGTH_OUT_OF_RANGE', 'metadata', 'MEDIUM', 'ความยาว Meta Description ยังไม่เหมาะสม', `${page.meta_description!.length} characters`, 'ปรับ description ให้อยู่ประมาณ 80-160 ตัวอักษร');
  }
  if (!hasText(page.canonical_url)) {
    metadataDeduct += 3;
    issue(issues, 'MISSING_CANONICAL', 'metadata', 'MEDIUM', 'ยังไม่ได้กำหนด Canonical URL', page.route_path, 'เพิ่ม canonical ให้ตรงกับ route');
  }
  if (!hasText(page.og_title) || !hasText(page.og_description)) {
    metadataDeduct += 2;
    issue(issues, 'INCOMPLETE_OPEN_GRAPH', 'metadata', 'LOW', 'Open Graph ยังไม่ครบ', page.route_path, 'เพิ่ม OG title และ description');
  }
  if (!hasText(page.twitter_card)) {
    metadataDeduct += 1;
    issue(issues, 'MISSING_TWITTER_CARD', 'metadata', 'LOW', 'ยังไม่ได้กำหนด Twitter Card', page.route_path, 'กำหนด twitter_card เช่น summary_large_image');
  }

  const h1Count = matches(source, /<h1\b/gi);
  const h2Count = matches(source, /<h2\b/gi);
  const imageCount = matches(source, /<img\b/gi);
  const missingAltCount = (source.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) ?? []).length;
  const linkCount = matches(source, /<(Link|a)\b/gi);
  const ctaCount = matches(source, /(ติดต่อ|ปรึกษา|ส่งข้อมูล|สอบถาม|LINE|ดูบริการ)/g);
  const wordishLength = textLength(source);

  if (h1Count === 0) {
    contentDeduct += 8;
    issue(issues, 'MISSING_H1', 'content', 'HIGH', 'หน้านี้ไม่มี H1', page.route_path, 'เพิ่ม H1 หลักหนึ่งจุดต่อหน้า');
  }
  if (h1Count > 1) {
    contentDeduct += 5;
    issue(issues, 'MULTIPLE_H1', 'content', 'MEDIUM', 'หน้านี้มี H1 มากกว่า 1 จุด', `${h1Count} H1`, 'คง H1 หลักไว้หนึ่งจุด และเปลี่ยนหัวข้อรองเป็น H2/H3');
  }
  if (h2Count === 0) {
    contentDeduct += 2;
    issue(issues, 'MISSING_H2', 'content', 'LOW', 'ยังไม่มี H2 สำหรับแบ่งเนื้อหา', page.route_path, 'เพิ่มหัวข้อรองเพื่อช่วยโครงสร้างเนื้อหา');
  }
  if (wordishLength < 1200) {
    contentDeduct += 4;
    issue(issues, 'THIN_CONTENT', 'content', 'MEDIUM', 'เนื้อหาหน้านี้อาจบางเกินไป', `${wordishLength} characters`, 'เพิ่มรายละเอียดที่ตอบ intent ของผู้ค้นหา');
  }
  if (ctaCount === 0) {
    contentDeduct += 3;
    issue(issues, 'MISSING_CTA', 'content', 'MEDIUM', 'ยังไม่พบ CTA ชัดเจน', page.route_path, 'เพิ่มปุ่มหรือข้อความชวนติดต่อที่สอดคล้องกับหน้า');
  }
  if (hasText(page.primary_keyword)) {
    const keyword = page.primary_keyword!.toLowerCase();
    const combined = `${page.title ?? ''} ${page.meta_description ?? ''} ${source}`.toLowerCase();
    if (!combined.includes(keyword)) {
      contentDeduct += 3;
      issue(issues, 'PRIMARY_KEYWORD_NOT_FOUND', 'content', 'LOW', 'ไม่พบคำสำคัญหลักใน metadata หรือเนื้อหา', page.primary_keyword!, 'ปรับ title/description/H1 ให้มี keyword อย่างเป็นธรรมชาติ');
    }
  }

  if (!existsSync(resolve(publicRoot, 'robots.txt'))) {
    technicalDeduct += 4;
    issue(issues, 'MISSING_ROBOTS_TXT', 'technical', 'MEDIUM', 'ยังไม่มี robots.txt', 'frontend/public/robots.txt', 'เพิ่ม robots.txt ใน Phase SEO-B');
  }
  if (!existsSync(resolve(publicRoot, 'sitemap.xml'))) {
    technicalDeduct += 4;
    issue(issues, 'MISSING_SITEMAP', 'technical', 'MEDIUM', 'ยังไม่มี sitemap.xml', 'frontend/public/sitemap.xml', 'เพิ่ม sitemap.xml ใน Phase SEO-B');
  }
  if (!hasText(page.schema_json)) {
    technicalDeduct += 5;
    issue(issues, 'MISSING_SCHEMA', 'technical', 'LOW', 'ยังไม่มี Structured Data', page.route_path, 'เพิ่ม JSON-LD ที่ตรงกับเนื้อหาจริงใน Phase SEO-B');
  } else {
    try {
      JSON.parse(page.schema_json!);
    } catch {
      technicalDeduct += 8;
      issue(issues, 'INVALID_SCHEMA_JSON', 'technical', 'HIGH', 'schema_json parse ไม่ได้', page.route_path, 'แก้ JSON-LD ให้เป็น JSON ที่ถูกต้อง');
    }
  }

  if (linkCount === 0) {
    linksDeduct += 8;
    issue(issues, 'NO_LINKS_FOUND', 'links', 'MEDIUM', 'ไม่พบ internal/external links ใน source', page.route_path, 'เพิ่ม internal links ไปยังหน้าที่เกี่ยวข้อง');
  }
  if (/คลิกที่นี่/g.test(source)) {
    linksDeduct += 3;
    issue(issues, 'GENERIC_ANCHOR_TEXT', 'links', 'LOW', 'พบ anchor text กว้างเกินไป', 'คลิกที่นี่', 'ใช้ข้อความลิงก์ที่อธิบายปลายทาง');
  }

  if (missingAltCount > 0) {
    imagesDeduct += Math.min(10, missingAltCount * 3);
    issue(issues, 'IMAGE_MISSING_ALT', 'images', 'HIGH', 'พบรูปที่ไม่มี alt', `${missingAltCount} images`, 'เพิ่ม alt ที่อธิบายภาพอย่างกระชับ');
  }
  if (imageCount > 0 && !/loading=/.test(source)) {
    imagesDeduct += 2;
    issue(issues, 'NO_LAZY_LOADING_IMAGES', 'images', 'LOW', 'ยังไม่พบ lazy loading บนรูปภาพ', `${imageCount} images`, 'พิจารณา loading=\"lazy\" กับรูปที่ไม่ใช่ hero');
  }

  const inputWithoutLabel = (source.match(/<input\b/gi)?.length ?? 0) > 0 && !/<label\b/i.test(source);
  if (inputWithoutLabel) {
    accessibilityDeduct += 5;
    issue(issues, 'FORM_LABEL_MISSING', 'accessibility', 'HIGH', 'พบ input โดยไม่มี label', page.route_path, 'เพิ่ม label หรือ aria-label ให้ field');
  }
  if (/<button\b(?![^>]*aria-label)[^>]*>\s*<\/button>/i.test(source)) {
    accessibilityDeduct += 5;
    issue(issues, 'BUTTON_WITHOUT_NAME', 'accessibility', 'HIGH', 'พบ button ที่ไม่มี accessible name', page.route_path, 'เพิ่มข้อความหรือ aria-label');
  }

  const sourceKb = Buffer.byteLength(source, 'utf8') / 1024;
  if (sourceKb > 80) {
    performanceDeduct += 2;
    issue(issues, 'LARGE_SOURCE_FILE', 'performance', 'LOW', 'ไฟล์หน้าใหญ่ ควรระวัง bundle size', `${sourceKb.toFixed(1)} KB source`, 'แยก component เฉพาะเมื่อ bundle จริงมีปัญหา');
  }

  const metadataScore = scoreFromDeductions(20, metadataDeduct);
  const contentScore = scoreFromDeductions(20, contentDeduct + linksDeduct * 0.35 + imagesDeduct * 0.25);
  const technicalScore = scoreFromDeductions(20, technicalDeduct);
  const accessibilityScore = scoreFromDeductions(10, accessibilityDeduct);
  const performanceScore = scoreFromDeductions(5, performanceDeduct);
  const overallScore = clamp(
    metadataScore * 0.2 +
      contentScore * 0.2 +
      technicalScore * 0.2 +
      scoreFromDeductions(15, linksDeduct) * 0.15 +
      scoreFromDeductions(10, imagesDeduct) * 0.1 +
      accessibilityScore * 0.1 +
      performanceScore * 0.05
  );

  const metrics = { h1Count, h2Count, imageCount, missingAltCount, linkCount, ctaCount, sourceKb: Number(sourceKb.toFixed(1)), sourceExists };
  insertAudit.run(routePath, overallScore, technicalScore, contentScore, metadataScore, accessibilityScore, performanceScore, JSON.stringify(issues), JSON.stringify(metrics), adminId ?? null);

  return { routePath, overallScore, technicalScore, contentScore, metadataScore, accessibilityScore, performanceScore, issues, metrics };
};

export const scanAllSeoPages = (adminId?: number): SeoAuditResult[] => {
  const rows = db.prepare('SELECT route_path AS routePath FROM seo_pages WHERE is_active = 1 ORDER BY id').all() as { routePath: string }[];
  return rows.map(row => scanSeoPage(row.routePath, adminId));
};

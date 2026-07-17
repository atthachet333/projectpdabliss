import 'dotenv/config';
import { db } from '../db';

const siteUrl = (process.env.PUBLIC_SITE_URL || 'http://localhost:4546').replace(/\/+$/, '');
const pages = [
  ['/', 'หน้าแรก', 'บริการเอกสารแรงงานต่างด้าว | PDA Bliss', 'ให้คำปรึกษาและดำเนินการด้านเอกสารแรงงานต่างด้าว แจ้งเข้า แจ้งออก ขึ้นทะเบียน รายงานตัว 90 วัน หนังสือเดินทาง และบริการที่เกี่ยวข้อง', 'บริการเอกสารแรงงานต่างด้าว', 'WebSite'],
  ['/about', 'เกี่ยวกับ PDA Bliss', 'เกี่ยวกับ PDA Bliss | ผู้ให้บริการเอกสารแรงงาน', 'รู้จัก PDA Bliss ผู้ให้บริการด้านเอกสารแรงงานต่างด้าว พร้อมทีมงานที่ให้คำปรึกษาและดูแลทุกขั้นตอน', 'ผู้ให้บริการเอกสารแรงงาน', 'AboutPage'],
  ['/services', 'บริการ', 'บริการเอกสารแรงงานต่างด้าวครบวงจร | PDA Bliss', 'รวมบริการแจ้งเข้า เปลี่ยนนายจ้าง ขึ้นทะเบียนแรงงาน รายงานตัว 90 วัน หนังสือเดินทาง CI Passport PJ และต่อมติ', 'บริการเอกสารแรงงานต่างด้าวครบวงจร', 'Service'],
  ['/process', 'ขั้นตอนบริการ', 'ขั้นตอนการใช้บริการเอกสารแรงงาน | PDA Bliss', 'ดูขั้นตอนการเตรียมเอกสาร การติดต่อ และกระบวนการให้บริการของ PDA Bliss อย่างเป็นระบบ', 'ขั้นตอนบริการเอกสารแรงงาน', 'WebPage'],
  ['/contact', 'ติดต่อเรา', 'ติดต่อ PDA Bliss | ปรึกษาเอกสารแรงงาน', 'ติดต่อ PDA Bliss เพื่อสอบถามและขอคำปรึกษาด้านเอกสารแรงงานต่างด้าว ผ่านแบบฟอร์ม LINE Official หรือช่องทางติดต่อของเรา', 'ปรึกษาเอกสารแรงงาน', 'ContactPage'],
] as const;

const update = db.prepare(`
  UPDATE seo_pages
  SET page_name = COALESCE(NULLIF(page_name, ''), ?),
    title = COALESCE(NULLIF(title, ''), ?),
    meta_description = COALESCE(NULLIF(meta_description, ''), ?),
    canonical_url = COALESCE(NULLIF(canonical_url, ''), ?),
    og_title = COALESCE(NULLIF(og_title, ''), ?),
    og_description = COALESCE(NULLIF(og_description, ''), ?),
    twitter_card = COALESCE(NULLIF(twitter_card, ''), 'summary_large_image'),
    primary_keyword = COALESCE(NULLIF(primary_keyword, ''), ?),
    secondary_keywords = COALESCE(NULLIF(secondary_keywords, ''), '[]'),
    schema_type = COALESCE(NULLIF(schema_type, ''), ?),
    updated_at = datetime('now')
  WHERE route_path = ?
    AND (
      NULLIF(page_name, '') IS NULL OR NULLIF(title, '') IS NULL OR
      NULLIF(meta_description, '') IS NULL OR NULLIF(canonical_url, '') IS NULL OR
      NULLIF(og_title, '') IS NULL OR NULLIF(og_description, '') IS NULL OR
      NULLIF(twitter_card, '') IS NULL OR NULLIF(primary_keyword, '') IS NULL OR
      NULLIF(secondary_keywords, '') IS NULL OR NULLIF(schema_type, '') IS NULL
    )
`);
const insert = db.prepare('INSERT OR IGNORE INTO seo_pages (route_path, page_name) VALUES (?, ?)');

let touched = 0;
for (const [routePath, pageName, title, description, keyword, schemaType] of pages) {
  insert.run(routePath, pageName);
  const canonical = `${siteUrl}${routePath === '/' ? '' : routePath}`;
  const result = update.run(pageName, title, description, canonical, title, description, keyword, schemaType, routePath);
  touched += result.changes;
}

console.log(JSON.stringify({ pages: pages.length, touched }));

export type PublicSeoConfig = {
  routePath: string;
  pageName: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  twitterCard: string;
  primaryKeyword: string | null;
  secondaryKeywords: string[];
  schemaType: string;
  schemaJson: Record<string, unknown>;
};

const siteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL ?? 'http://localhost:4546').replace(/\/+$/, '');
const canonical = (path: string): string => `${siteUrl}${path === '/' ? '' : path}`;

export const seoDefaults: Record<string, PublicSeoConfig> = {
  '/': {
    routePath: '/',
    pageName: 'หน้าแรก',
    title: 'บริการเอกสารแรงงานต่างด้าว | PDA Bliss',
    metaDescription: 'ให้คำปรึกษาและดำเนินการด้านเอกสารแรงงานต่างด้าว แจ้งเข้า แจ้งออก ขึ้นทะเบียน รายงานตัว 90 วัน หนังสือเดินทาง และบริการที่เกี่ยวข้อง',
    canonicalUrl: canonical('/'),
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: 'บริการเอกสารแรงงานต่างด้าว | PDA Bliss',
    ogDescription: 'ให้คำปรึกษาและดำเนินการด้านเอกสารแรงงานต่างด้าว แจ้งเข้า แจ้งออก ขึ้นทะเบียน รายงานตัว 90 วัน หนังสือเดินทาง และบริการที่เกี่ยวข้อง',
    ogImage: null,
    twitterCard: 'summary_large_image',
    primaryKeyword: 'บริการเอกสารแรงงานต่างด้าว',
    secondaryKeywords: [],
    schemaType: 'WebSite',
    schemaJson: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'PDA Bliss', url: canonical('/') },
  },
  '/about': page('/about', 'เกี่ยวกับ PDA Bliss', 'เกี่ยวกับ PDA Bliss | ผู้ให้บริการเอกสารแรงงาน', 'รู้จัก PDA Bliss ผู้ให้บริการด้านเอกสารแรงงานต่างด้าว พร้อมทีมงานที่ให้คำปรึกษาและดูแลทุกขั้นตอน', 'AboutPage'),
  '/services': page('/services', 'บริการ', 'บริการเอกสารแรงงานต่างด้าวครบวงจร | PDA Bliss', 'รวมบริการแจ้งเข้า เปลี่ยนนายจ้าง ขึ้นทะเบียนแรงงาน รายงานตัว 90 วัน หนังสือเดินทาง CI Passport PJ และต่อมติ', 'Service'),
  '/process': page('/process', 'ขั้นตอนบริการ', 'ขั้นตอนการใช้บริการเอกสารแรงงาน | PDA Bliss', 'ดูขั้นตอนการเตรียมเอกสาร การติดต่อ และกระบวนการให้บริการของ PDA Bliss อย่างเป็นระบบ', 'WebPage'),
  '/contact': page('/contact', 'ติดต่อเรา', 'ติดต่อ PDA Bliss | ปรึกษาเอกสารแรงงาน', 'ติดต่อ PDA Bliss เพื่อสอบถามและขอคำปรึกษาด้านเอกสารแรงงานต่างด้าว ผ่านแบบฟอร์ม LINE Official หรือช่องทางติดต่อของเรา', 'ContactPage'),
};

function page(routePath: string, pageName: string, title: string, metaDescription: string, schemaType: string): PublicSeoConfig {
  return {
    routePath,
    pageName,
    title,
    metaDescription,
    canonicalUrl: canonical(routePath),
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: title,
    ogDescription: metaDescription,
    ogImage: null,
    twitterCard: 'summary_large_image',
    primaryKeyword: null,
    secondaryKeywords: [],
    schemaType,
    schemaJson: { '@context': 'https://schema.org', '@type': schemaType, name: title, description: metaDescription, url: canonical(routePath) },
  };
}

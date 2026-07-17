import { db } from '../db';

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

type SeoRow = {
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
  secondary_keywords: string | null;
  schema_type: string | null;
  schema_json: string | null;
  updated_at: string;
};

const publicRoutes = new Set(['/', '/about', '/services', '/process', '/contact']);
const cache = new Map<string, PublicSeoConfig>();

export const clearSeoCache = (routePath?: string): void => {
  if (routePath) cache.delete(routePath);
  else cache.clear();
};

export const siteUrl = (): string => {
  const configured = process.env.PUBLIC_SITE_URL || process.env.FRONTEND_ORIGIN || 'http://localhost:4546';
  const value = configured.replace(/\/+$/, '');
  if (process.env.NODE_ENV === 'production' && value.includes('localhost')) {
    throw new Error('PUBLIC_SITE_URL must not be localhost in production');
  }
  return value;
};

export const canonicalFor = (routePath: string): string => `${siteUrl()}${routePath === '/' ? '' : routePath}`;

const parseKeywords = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return parsed.filter(item => typeof item === 'string').slice(0, 20);
  } catch {
    return value.split(',').map(item => item.trim()).filter(Boolean).slice(0, 20);
  }
  return [];
};

const safeJson = (value: string | null): Record<string, unknown> | null => {
  if (!value || value.includes('</script')) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
};

export const buildSchemaForPage = (row: SeoRow, canonicalUrl: string): Record<string, unknown> => {
  const custom = safeJson(row.schema_json);
  if (custom) return custom;
  const siteName = process.env.PUBLIC_SITE_NAME || 'PDA Bliss';
  const logoUrl = process.env.PUBLIC_LOGO_URL || undefined;
  const organization = {
    '@type': 'Organization',
    name: siteName,
    url: siteUrl(),
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(process.env.PUBLIC_CONTACT_EMAIL ? { email: process.env.PUBLIC_CONTACT_EMAIL } : {}),
    ...(process.env.PUBLIC_LINE_URL ? { sameAs: [process.env.PUBLIC_LINE_URL] } : {}),
  };
  const type = row.route_path === '/contact' ? 'ContactPage' : row.route_path === '/about' ? 'AboutPage' : row.route_path === '/services' ? 'Service' : 'WebPage';
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: row.title || row.page_name,
    description: row.meta_description || undefined,
    url: canonicalUrl,
    publisher: organization,
  };
};

export const getPublicSeoConfig = (routePath: string): PublicSeoConfig | null => {
  if (!publicRoutes.has(routePath)) return null;
  const cached = cache.get(routePath);
  if (cached) return cached;
  const row = db.prepare(`
    SELECT route_path, page_name, title, meta_description, canonical_url, robots_index, robots_follow,
      og_title, og_description, og_image, twitter_card, primary_keyword, secondary_keywords,
      schema_type, schema_json, updated_at
    FROM seo_pages
    WHERE route_path = ? AND is_active = 1
  `).get(routePath) as SeoRow | undefined;
  if (!row || !row.title || !row.meta_description) return null;
  const canonicalUrl = row.canonical_url || canonicalFor(routePath);
  const config: PublicSeoConfig = {
    routePath,
    pageName: row.page_name,
    title: row.title,
    metaDescription: row.meta_description,
    canonicalUrl,
    robotsIndex: Boolean(row.robots_index),
    robotsFollow: Boolean(row.robots_follow),
    ogTitle: row.og_title || row.title,
    ogDescription: row.og_description || row.meta_description,
    ogImage: row.og_image || process.env.PUBLIC_DEFAULT_OG_IMAGE || null,
    twitterCard: row.twitter_card || 'summary_large_image',
    primaryKeyword: row.primary_keyword,
    secondaryKeywords: parseKeywords(row.secondary_keywords),
    schemaType: row.schema_type || 'WebPage',
    schemaJson: buildSchemaForPage(row, canonicalUrl),
  };
  cache.set(routePath, config);
  return config;
};

export const escapeXml = (value: string): string => value.replace(/[<>&'"]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]!));

export const sitemapRows = (): SeoRow[] => db.prepare(`
  SELECT route_path, page_name, title, meta_description, canonical_url, robots_index, robots_follow,
    og_title, og_description, og_image, twitter_card, primary_keyword, secondary_keywords,
    schema_type, schema_json, updated_at
  FROM seo_pages
  WHERE is_active = 1 AND robots_index = 1
  ORDER BY id
`).all() as SeoRow[];

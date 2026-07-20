import { Router, type Request, type Response } from 'express';
import { logger } from '../lib/logger';
import { canonicalFor, escapeXml, getPublicSeoConfig, sitemapRows, siteUrl } from '../seo/public-seo';
import type { ApiResponse } from '../types/contact';

const router = Router();
const priorities: Record<string, string> = {
  '/': '1.0',
  '/services': '0.9',
  '/contact': '0.8',
  '/process': '0.7',
  '/about': '0.6',
};

const validPath = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const path = value.trim();
  if (!path.startsWith('/') || path.includes('..') || path.startsWith('/admin') || path.startsWith('/api')) return null;
  return path === '' ? '/' : path;
};

router.get('/api/seo/page', (req: Request, res: Response<ApiResponse<unknown>>): void => {
  const path = validPath(req.query.path);
  if (!path) {
    logger.warn('seo', 'page_config_rejected', 'SEO config request rejected', {
      requestId: req.requestId,
      reason: 'invalid_path',
    });
    res.status(400).json({ success: false, message: 'path ไม่ถูกต้อง' });
    return;
  }
  const config = getPublicSeoConfig(path);
  if (!config) {
    logger.warn('seo', 'page_config_not_found', 'SEO config was not found', {
      requestId: req.requestId,
      path,
    });
    res.status(404).json({ success: false, message: 'ไม่พบ SEO config' });
    return;
  }
  logger.debug('seo', 'page_config_served', 'SEO config served', {
    requestId: req.requestId,
    path,
  });
  res.header('Cache-Control', 'public, max-age=300').json({ success: true, message: 'โหลด SEO config สำเร็จ', data: config });
});

router.get('/sitemap.xml', (req: Request, res: Response): void => {
  try {
    const rows = sitemapRows();
    const urls = rows.map(row => {
      const loc = row.canonical_url || canonicalFor(row.route_path);
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(new Date(`${row.updated_at.replace(' ', 'T')}Z`).toISOString())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priorities[row.route_path] ?? '0.5'}</priority>
  </url>`;
    }).join('\n');
    logger.info('seo', 'sitemap_generated', 'Sitemap generated', {
      requestId: req.requestId,
      urlCount: rows.length,
    });
    res.type('application/xml').header('Cache-Control', 'public, max-age=3600').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
  } catch (error) {
    logger.error('seo', 'sitemap_generation_failed', 'Sitemap generation failed, using fallback', {
      requestId: req.requestId,
      error,
    });
    const fallback = ['/', '/about', '/services', '/process', '/contact'].map(path => `  <url><loc>${escapeXml(canonicalFor(path))}</loc></url>`).join('\n');
    res.type('application/xml').header('Cache-Control', 'public, max-age=300').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${fallback}</urlset>`);
  }
});

router.get('/robots.txt', (req: Request, res: Response): void => {
  logger.debug('seo', 'robots_served', 'robots.txt served', { requestId: req.requestId });
  res
    .type('text/plain')
    .header('Cache-Control', 'public, max-age=3600')
    .send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Sitemap: ${siteUrl()}/sitemap.xml
`);
});

export default router;

import { seoDefaults, type PublicSeoConfig } from '../seo/seo-defaults';
import { API_BASE_URL } from '../config/api';
const cache = new Map<string, PublicSeoConfig>();

export const getPublicSeo = async (path: string): Promise<PublicSeoConfig> => {
  const fallback = seoDefaults[path] ?? seoDefaults['/'];
  if (cache.has(path)) return cache.get(path)!;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`${API_BASE_URL}/api/seo/page?path=${encodeURIComponent(path)}`, { signal: controller.signal });
    if (!response.ok) return fallback;
    const body = await response.json() as { data?: PublicSeoConfig };
    const config = body.data ?? fallback;
    cache.set(path, config);
    return config;
  } catch {
    return fallback;
  } finally {
    window.clearTimeout(timer);
  }
};

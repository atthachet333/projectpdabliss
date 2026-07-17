import { seoDefaults, type PublicSeoConfig } from '../seo/seo-defaults';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4547';
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

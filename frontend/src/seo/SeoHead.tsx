import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPublicSeo } from '../services/seo-api';
import type { PublicSeoConfig } from './seo-defaults';

const upsertMeta = (selector: string, attr: 'name' | 'property', key: string, content?: string | null): void => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const applySeo = (config: PublicSeoConfig): void => {
  document.title = config.title;
  upsertMeta('meta[name="description"]', 'name', 'description', config.metaDescription);
  upsertMeta('meta[name="robots"]', 'name', 'robots', `${config.robotsIndex ? 'index' : 'noindex'},${config.robotsFollow ? 'follow' : 'nofollow'}`);
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = config.canonicalUrl;
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', config.ogTitle);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', config.ogDescription);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', config.canonicalUrl);
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'PDA Bliss');
  upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', 'th_TH');
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', config.ogImage);
  upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', config.twitterCard);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', config.ogTitle);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', config.ogDescription);
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', config.ogImage);
  document.getElementById('pda-json-ld')?.remove();
  const json = JSON.stringify(config.schemaJson).replace(/<\/script/gi, '<\\/script');
  const script = document.createElement('script');
  script.id = 'pda-json-ld';
  script.type = 'application/ld+json';
  script.text = json;
  document.head.appendChild(script);
};

export const SeoHead = (): null => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    let active = true;
    void getPublicSeo(location.pathname).then(config => {
      if (active) applySeo(config);
    });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  return null;
};

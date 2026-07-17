import { API_BASE_URL } from '../config/api';
const visitorKey = 'pda_analytics_visitor_id';
const sessionKey = 'pda_analytics_session_id';
const startedForms = new Set<string>();
let lastTrackedPageView = '';

type EventType =
  | 'page_view'
  | 'navigation_click'
  | 'button_click'
  | 'service_click'
  | 'line_click'
  | 'external_link_click'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error';

type Metadata = {
  serviceKey?: string;
  destinationPath?: string;
  linkType?: string;
  formName?: string;
  result?: string;
  httpStatusGroup?: string;
};

type QueuedEvent = {
  eventId: string;
  eventType: EventType;
  eventName: string;
  pagePath: string;
  elementId?: string;
  metadata?: Metadata;
  createdAt: string;
};

const queue: QueuedEvent[] = [];
let flushTimer: number | undefined;
let warned = false;

const uuid = (): string => crypto.randomUUID();

export const getOrCreateVisitorId = (): string => {
  const existing = localStorage.getItem(visitorKey);
  if (existing) return existing;
  const next = uuid();
  localStorage.setItem(visitorKey, next);
  return next;
};

export const getOrCreateSessionId = (): string => {
  const existing = sessionStorage.getItem(sessionKey);
  if (existing) return existing;
  const next = uuid();
  sessionStorage.setItem(sessionKey, next);
  return next;
};

const pagePath = (): string => window.location.pathname || '/';

const deviceType = (): string => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const browser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/')) return 'Safari';
  return 'unknown';
};

const os = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'unknown';
};

const sessionInfo = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    firstPage: pagePath(),
    referrer: document.referrer,
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    deviceType: deviceType(),
    browser: browser(),
    operatingSystem: os(),
  };
};

const scheduleFlush = (): void => {
  if (flushTimer !== undefined) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = undefined;
    void flushAnalytics();
  }, 1000);
};

export const trackEvent = (eventType: EventType, eventName: string, options: { elementId?: string; metadata?: Metadata; pagePath?: string } = {}): void => {
  if (window.location.pathname.startsWith('/admin')) return;
  queue.push({
    eventId: uuid(),
    eventType,
    eventName,
    pagePath: options.pagePath ?? pagePath(),
    elementId: options.elementId,
    metadata: options.metadata,
    createdAt: new Date().toISOString(),
  });
  scheduleFlush();
};

export const trackPageView = (path: string): void => {
  if (path.startsWith('/admin') || lastTrackedPageView === path) return;
  lastTrackedPageView = path;
  trackEvent('page_view', 'page_view', { pagePath: path });
};

export const trackNavigation = (eventName: string, destinationPath: string): void => {
  trackEvent('navigation_click', eventName, { metadata: { destinationPath } });
};

export const trackFormEvent = (eventName: string, formName: string, result?: string): void => {
  if (eventName === 'contact_form_start') {
    const key = `${formName}:${getOrCreateSessionId()}`;
    if (startedForms.has(key)) return;
    startedForms.add(key);
  }
  trackEvent(eventName as EventType, eventName, { metadata: { formName, ...(result ? { result } : {}) } });
};

export const flushAnalytics = async (): Promise<void> => {
  const events = queue.splice(0, 20);
  if (!events.length) return;
  const body = JSON.stringify({
    sessionId: getOrCreateSessionId(),
    visitorId: getOrCreateVisitorId(),
    session: sessionInfo(),
    events,
  });
  try {
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon && blob.size < 60000) {
      navigator.sendBeacon(`${API_BASE_URL}/api/analytics/events`, blob);
      return;
    }
    await fetch(`${API_BASE_URL}/api/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    if (!warned) {
      warned = true;
      console.warn('Analytics tracking failed');
    }
  }
};

export const initializeAnalytics = (): void => {
  getOrCreateVisitorId();
  getOrCreateSessionId();
  window.addEventListener('pagehide', () => void flushAnalytics());
};

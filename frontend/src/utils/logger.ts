import { trackEvent, trackNavigation, trackPageView } from './analytics';

export const logUserAction = (action: string, details: Record<string, unknown> = {}): void => {
  if (action === 'PAGE_VIEW' && typeof details.path === 'string') {
    trackPageView(details.path);
    return;
  }
  if (action === 'CLICK_CONSULT_BUTTON') {
    trackEvent('button_click', 'consultation_button', { metadata: { destinationPath: '/contact' } });
    return;
  }
  if (action === 'VIEW_SERVICE_DETAIL') {
    trackEvent('service_click', 'service_card_click', {
      metadata: { serviceKey: String(details.serviceId ?? 'service') },
    });
    return;
  }
  if (action.includes('NAV')) {
    trackNavigation(action.toLowerCase(), String(details.path ?? ''));
  }
};

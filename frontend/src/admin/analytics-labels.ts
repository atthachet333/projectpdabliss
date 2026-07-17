export const pageLabel = (path: string): string => ({
  '/': 'หน้าแรก',
  '/about': 'เกี่ยวกับเรา',
  '/services': 'บริการ',
  '/contact': 'ติดต่อเรา',
}[path] ?? path);

export const eventLabel = (name: string): string => ({
  page_view: 'ดูหน้าเว็บ',
  consultation_button: 'ปุ่มปรึกษาฟรี',
  hero_view_all_services: 'ดูบริการทั้งหมด',
  line_official_contact: 'ติดต่อ LINE Official',
  footer_urgent_contact_submit: 'ส่งฟอร์มด่วน',
  contact_form_success: 'ส่งฟอร์มสำเร็จ',
  contact_form_submit: 'กดส่งฟอร์ม',
  service_card_click: 'คลิกการ์ดบริการ',
}[name] ?? name);

export const eventTypeLabel = (type: string): string => ({
  page_view: 'Page View',
  navigation_click: 'Navigation',
  button_click: 'Button',
  service_click: 'Service',
  line_click: 'LINE',
  contact_form_submit: 'Form',
  contact_form_success: 'Form',
  contact_form_error: 'Form',
}[type] ?? type);

export const referrerLabel = (value: string): string => {
  if (!value || value === '(direct)') return 'Direct';
  try {
    const host = new URL(value).hostname.replace(/^www\./, '');
    if (host.includes('google')) return 'Google';
    if (host.includes('facebook')) return 'Facebook';
    if (host.includes('line')) return 'LINE';
    if (host.includes('tiktok')) return 'TikTok';
    return host;
  } catch {
    return value;
  }
};

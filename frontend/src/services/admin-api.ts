import { API_BASE_URL } from '../config/api';

export type AdminUser = {
  id: number;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN';
  isActive?: boolean;
  mustChangePassword?: boolean;
};

export type LeadStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'COMPLETED' | 'CANCELLED';
export type EmailDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';

export type ContactLead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  topic: string | null;
  details: string;
  sourcePage: string | null;
  status: LeadStatus;
  emailDeliveryStatus: EmailDeliveryStatus;
  emailProviderId?: string | null;
  note?: string | null;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DashboardSummary = {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  followUpLeads: number;
  completedLeads: number;
  cancelledLeads: number;
  todayLeads: number;
  thisWeekLeads: number;
  thisMonthLeads: number;
  emailSent: number;
  emailFailed: number;
  recentLeads: ContactLead[];
};

export type AnalyticsQuery = {
  from?: string;
  to?: string;
  period?: 'day' | 'week' | 'month';
  page?: number;
  limit?: number;
  eventType?: string;
  eventName?: string;
};

export type AnalyticsOverview = {
  pageViews: number;
  sessions: number;
  estimatedUniqueVisitors: number;
  buttonClicks: number;
  serviceClicks: number;
  lineClicks: number;
  contactFormSubmits: number;
  contactFormSuccess: number;
  conversionRate: number;
  averagePagesPerSession: number;
  timeline: Array<{ date: string; count: number }>;
};

export type AnalyticsPage = {
  pagePath: string;
  views: number;
  uniqueSessions: number;
  percentage: number;
};

export type AnalyticsEventRow = {
  eventType: string;
  eventName: string;
  count: number;
  uniqueSessions: number;
};

export type AnalyticsReferrer = {
  referrer: string;
  sessions: number;
};

export type AnalyticsDevice = {
  deviceType: string;
  browser: string;
  operatingSystem: string;
  sessions: number;
};

export type SeoIssue = {
  code: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  evidence: string;
  recommendation: string;
  affectedElement?: string;
  autoFixAvailable: boolean;
};

export type SeoAuditBrief = {
  id: number;
  overallScore: number;
  technicalScore: number;
  contentScore: number;
  metadataScore: number;
  accessibilityScore: number;
  performanceScore: number;
  issues: SeoIssue[];
  createdAt: string;
};

export type SeoPage = {
  id: number;
  routePath: string;
  pageName: string;
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  primaryKeyword: string | null;
  secondaryKeywords: string | null;
  schemaType: string | null;
  schemaJson: string | null;
  isActive: boolean;
  latestAudit: SeoAuditBrief | null;
  createdAt: string;
  updatedAt: string;
};

export type SeoSummary = {
  averageScore: number;
  scannedPages: number;
  totalPages: number;
  criticalIssues: number;
  highIssues: number;
  readyPages: number;
  pendingRecommendations: number;
  metadataMissing: number;
  missingH1: number;
  missingAlt: number;
  missingSchema: number;
  bestPage: { route_path: string; page_name: string; overall_score: number } | null;
  pagesNeedingWork: Array<{ route_path: string; page_name: string; overall_score: number | null; issues_json?: string }>;
  commonIssues: Array<{ code: string; count: number }>;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
};

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const request = async <T>(path: string, init: RequestInit = {}): Promise<ApiEnvelope<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => ({ success: false, message: 'เกิดข้อผิดพลาด' })) as ApiEnvelope<T>;
  if (!response.ok) throw new AdminApiError(body.message || 'เกิดข้อผิดพลาด', response.status);
  return body;
};

const queryString = (params: Record<string, string | number | undefined>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : '';
};

export const loginAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const body = await request<{ admin: AdminUser }>('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return body.data!.admin;
};

export const getCurrentAdmin = async (): Promise<AdminUser> => {
  const body = await request<{ admin: AdminUser }>('/api/admin/auth/me');
  return body.data!.admin;
};

export const logoutAdmin = async (): Promise<void> => {
  await request('/api/admin/auth/logout', { method: 'POST', body: '{}' });
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const body = await request<DashboardSummary>('/api/admin/dashboard/summary');
  return body.data!;
};

export type LeadFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  emailDeliveryStatus?: string;
  from?: string;
  to?: string;
};

export const getLeads = async (filters: LeadFilters = {}): Promise<{ data: ContactLead[]; pagination: Pagination }> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const body = await request<ContactLead[]>(`/api/admin/leads?${params.toString()}`);
  return { data: body.data ?? [], pagination: body.pagination! };
};

export const getLeadById = async (id: string): Promise<ContactLead> => {
  const body = await request<ContactLead>(`/api/admin/leads/${encodeURIComponent(id)}`);
  return body.data!;
};

export const updateLead = async (id: number, payload: { status?: LeadStatus; note?: string; assignedTo?: string }): Promise<ContactLead> => {
  const body = await request<ContactLead>(`/api/admin/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return body.data!;
};

export const getAnalyticsOverview = async (params: AnalyticsQuery = {}): Promise<AnalyticsOverview> => {
  const body = await request<AnalyticsOverview>(`/api/admin/analytics/overview${queryString(params)}`);
  return body.data!;
};

export const getAnalyticsPages = async (params: AnalyticsQuery = {}): Promise<AnalyticsPage[]> => {
  const body = await request<AnalyticsPage[]>(`/api/admin/analytics/pages${queryString(params)}`);
  return body.data ?? [];
};

export const getAnalyticsEvents = async (params: AnalyticsQuery = {}): Promise<AnalyticsEventRow[]> => {
  const body = await request<AnalyticsEventRow[]>(`/api/admin/analytics/events${queryString(params)}`);
  return body.data ?? [];
};

export const getAnalyticsReferrers = async (params: AnalyticsQuery = {}): Promise<AnalyticsReferrer[]> => {
  const body = await request<AnalyticsReferrer[]>(`/api/admin/analytics/referrers${queryString(params)}`);
  return body.data ?? [];
};

export const getAnalyticsDevices = async (params: AnalyticsQuery = {}): Promise<AnalyticsDevice[]> => {
  const body = await request<AnalyticsDevice[]>(`/api/admin/analytics/devices${queryString(params)}`);
  return body.data ?? [];
};

export const getSeoSummary = async (): Promise<SeoSummary> => {
  const body = await request<SeoSummary>('/api/admin/seo/summary');
  return body.data!;
};

export const getSeoPages = async (score = ''): Promise<SeoPage[]> => {
  const body = await request<SeoPage[]>(`/api/admin/seo/pages${queryString({ score })}`);
  return body.data ?? [];
};

export const getSeoPage = async (id: string): Promise<SeoPage> => {
  const body = await request<SeoPage>(`/api/admin/seo/pages/${encodeURIComponent(id)}`);
  return body.data!;
};

export const updateSeoPage = async (id: number, payload: Partial<{
  pageName: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  schemaType: string;
  schemaJson: string;
}>): Promise<SeoPage> => {
  const body = await request<SeoPage>(`/api/admin/seo/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return body.data!;
};

export const scanSeoSite = async (): Promise<void> => {
  await request('/api/admin/seo/scan', { method: 'POST', body: '{}' });
};

export const scanSeoPage = async (routePath: string): Promise<void> => {
  await request(`/api/admin/seo/scan/${encodeURIComponent(routePath)}`, { method: 'POST', body: '{}' });
};

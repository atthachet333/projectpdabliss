import dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config({ path: '.env' });
const base = 'http://localhost:4547';
const email = process.env.DEFAULT_ADMIN_EMAIL;
const password = process.env.DEFAULT_ADMIN_PASSWORD;
const post = async (path, body, cookie = '') => {
  const response = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { Origin: 'http://localhost:4546', 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(body),
  });
  return { response, body: await response.json().catch(() => ({})) };
};
const get = async (path, cookie = '') => {
  const response = await fetch(`${base}${path}`, {
    headers: { Origin: 'http://localhost:4546', ...(cookie ? { Cookie: cookie } : {}) },
  });
  return { response, body: await response.json().catch(() => ({})) };
};

const login = await post('/api/admin/auth/login', { email, password });
const cookieHeader = login.response.headers.get('set-cookie') || '';
const cookie = cookieHeader.split(';')[0] || '';
const me = await get('/api/admin/auth/me', cookie);
const summary = await get('/api/admin/dashboard/summary', cookie);
const leads = await get('/api/admin/leads', cookie);
const analytics = await get('/api/admin/analytics/overview', cookie);
await post('/api/admin/auth/logout', {}, cookie);
const afterLogout = await get('/api/admin/leads', cookie);

const db = new Database(process.env.DATABASE_PATH || './data/pda-bliss.sqlite');
const row = db.prepare('SELECT id, password_hash, is_active, role, must_change_password FROM admin_users WHERE email = ?').get(String(email).toLowerCase());
const matchModule = await import('bcryptjs');
const passwordMatches = await matchModule.default.compare(String(password), row.password_hash);

console.log(JSON.stringify({
  defaultAdminFound: Boolean(row),
  passwordMatches,
  active: Boolean(row?.is_active),
  mustChangePassword: Boolean(row?.must_change_password),
  role: row?.role,
  loginStatus: login.response.status,
  setCookieIssued: cookieHeader.includes('pda_admin_session='),
  cookieSecureInDev: cookieHeader.toLowerCase().includes('secure'),
  meStatus: me.response.status,
  meUser: me.body.data?.admin ? {
    emailMatches: me.body.data.admin.email === email,
    role: me.body.data.admin.role,
    mustChangePassword: me.body.data.admin.mustChangePassword,
  } : null,
  dashboardStatus: summary.response.status,
  leadsStatus: leads.response.status,
  analyticsStatus: analytics.response.status,
  afterLogoutStatus: afterLogout.response.status,
}));

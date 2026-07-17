import bcrypt from 'bcryptjs';
import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { db } from '../db';
import {
  clearSessionCookie,
  hashIp,
  hashSessionToken,
  newSessionToken,
  normalizeEmail,
  sessionMaxAgeMs,
  setSessionCookie,
  type AdminRequest,
} from '../security/admin-session';
import { requireAdmin } from '../middleware/requireAdmin';
import type { ApiResponse } from '../types/contact';

const router = Router();
const loginMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';

type AdminUserRow = {
  id: number;
  email: string;
  password_hash: string;
  role: 'SUPERADMIN' | 'ADMIN';
  is_active: number;
  must_change_password: number;
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'พยายามเข้าสู่ระบบบ่อยเกินไป กรุณาลองใหม่ภายหลัง' },
});

const findAdminByEmail = db.prepare('SELECT id, email, password_hash, role, is_active, must_change_password FROM admin_users WHERE email = ?');
const insertSession = db.prepare(`
  INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at, user_agent, ip_hash)
  VALUES (?, ?, datetime('now', ?), ?, ?)
`);
const updateLastLogin = db.prepare('UPDATE admin_users SET last_login_at = datetime(\'now\'), updated_at = datetime(\'now\') WHERE id = ?');
const deleteSession = db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?');

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

router.post('/login', loginLimiter, async (req: Request, res: Response<ApiResponse<{ admin: { id: number; email: string; role: string; mustChangePassword: boolean } }>>): Promise<void> => {
  res.header('Cache-Control', 'no-store');
  const body = (req.body ?? {}) as { email?: unknown; password?: unknown };
  const email = normalizeEmail(text(body.email));
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) {
    res.status(401).json({ success: false, message: loginMessage });
    return;
  }

  const admin = findAdminByEmail.get(email) as AdminUserRow | undefined;
  if (!admin || !admin.is_active || !(await bcrypt.compare(password, admin.password_hash))) {
    res.status(401).json({ success: false, message: loginMessage });
    return;
  }

  const token = newSessionToken();
  const maxAgeHours = Math.ceil(sessionMaxAgeMs() / 60 / 60 / 1000);
  insertSession.run(admin.id, hashSessionToken(token), `+${maxAgeHours} hours`, req.get('user-agent')?.slice(0, 300) ?? null, hashIp(req.ip));
  updateLastLogin.run(admin.id);
  setSessionCookie(res, token);

  res.json({
    success: true,
    message: 'เข้าสู่ระบบสำเร็จ',
    data: { admin: { id: admin.id, email: admin.email, role: admin.role, mustChangePassword: Boolean(admin.must_change_password) } },
  });
});

router.get('/me', requireAdmin, (req: AdminRequest, res: Response<ApiResponse<{ admin: NonNullable<AdminRequest['admin']> }>>): void => {
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'เข้าสู่ระบบอยู่', data: { admin: req.admin! } });
});

router.post('/logout', requireAdmin, (req: AdminRequest, res: Response<ApiResponse<never>>): void => {
  if (req.adminSessionTokenHash) deleteSession.run(req.adminSessionTokenHash);
  clearSessionCookie(res);
  res.header('Cache-Control', 'no-store').json({ success: true, message: 'ออกจากระบบสำเร็จ' });
});

export default router;

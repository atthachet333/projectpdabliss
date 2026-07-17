import type { NextFunction, Response } from 'express';
import { db } from '../db';
import { hashSessionToken, readCookie, type AdminRequest } from '../security/admin-session';
import type { ApiResponse } from '../types/contact';

type SessionRow = {
  token_hash: string;
  expires_at: string;
  id: number;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN';
  is_active: number;
  must_change_password: number;
};

const findSession = db.prepare(`
  SELECT
    admin_sessions.token_hash,
    admin_sessions.expires_at,
    admin_users.id,
    admin_users.email,
    admin_users.role,
    admin_users.is_active,
    admin_users.must_change_password
  FROM admin_sessions
  JOIN admin_users ON admin_users.id = admin_sessions.admin_user_id
  WHERE admin_sessions.token_hash = ?
`);

const touchSession = db.prepare('UPDATE admin_sessions SET last_used_at = datetime(\'now\') WHERE token_hash = ?');
const deleteSession = db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?');
const deleteExpiredSessions = db.prepare('DELETE FROM admin_sessions WHERE expires_at <= datetime(\'now\')');

export const requireAdmin = (req: AdminRequest, res: Response<ApiResponse<never>>, next: NextFunction): void => {
  try {
    deleteExpiredSessions.run();
    const token = readCookie(req);
    if (!token) {
      res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
      return;
    }

    const tokenHash = hashSessionToken(token);
    const session = findSession.get(tokenHash) as SessionRow | undefined;
    if (!session || session.expires_at <= new Date().toISOString().slice(0, 19).replace('T', ' ') || !session.is_active) {
      deleteSession.run(tokenHash);
      res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
      return;
    }

    touchSession.run(tokenHash);
    req.adminSessionTokenHash = tokenHash;
    req.admin = {
      id: session.id,
      email: session.email,
      role: session.role,
      isActive: Boolean(session.is_active),
      mustChangePassword: Boolean(session.must_change_password),
    };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
  }
};

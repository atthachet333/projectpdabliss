import { createHash, createHmac, randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';

export type AdminRole = 'SUPERADMIN' | 'ADMIN';

export type AdminUserSafe = {
  id: number;
  email: string;
  role: AdminRole;
  isActive: boolean;
  mustChangePassword?: boolean;
};

export type AdminRequest = Request & {
  admin?: AdminUserSafe;
  adminSessionTokenHash?: string;
};

const secret = (): string => {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not configured');
  return value;
};

export const cookieName = (): string => process.env.ADMIN_COOKIE_NAME?.trim() || 'pda_admin_session';

export const sessionMaxAgeMs = (): number => {
  const hours = Number(process.env.ADMIN_SESSION_MAX_AGE_HOURS ?? 8);
  return (Number.isFinite(hours) && hours > 0 ? hours : 8) * 60 * 60 * 1000;
};

export const newSessionToken = (): string => randomBytes(32).toString('base64url');

export const hashSessionToken = (token: string): string => createHmac('sha256', secret()).update(token).digest('hex');

export const hashIp = (ip?: string): string | null => {
  if (!ip) return null;
  return createHmac('sha256', secret()).update(ip).digest('hex');
};

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const readCookie = (req: Request, name = cookieName()): string | undefined => {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (rawKey === name) return decodeURIComponent(rawValue.join('='));
  }
  return undefined;
};

export const setSessionCookie = (res: Response, token: string): void => {
  res.cookie(cookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionMaxAgeMs(),
  });
};

export const clearSessionCookie = (res: Response): void => {
  res.clearCookie(cookieName(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
};

export const safeHash = (value: string): string => createHash('sha256').update(value).digest('hex');

import bcrypt from 'bcryptjs';
import { db } from '../db';
import { normalizeEmail } from '../security/admin-session';

const validRoles = new Set(['SUPERADMIN', 'ADMIN']);
const examplePassword = 'ChangeMe12345!';

const findAdmin = db.prepare('SELECT id FROM admin_users WHERE email = ?');
const insertAdmin = db.prepare(`
  INSERT INTO admin_users (email, password_hash, role, is_active, must_change_password)
  VALUES (?, ?, ?, 1, ?)
`);
const resetAdmin = db.prepare(`
  UPDATE admin_users
  SET password_hash = ?,
    role = ?,
    is_active = 1,
    must_change_password = 0,
    updated_at = datetime('now')
  WHERE id = ?
`);
const deleteAdminSessions = db.prepare('DELETE FROM admin_sessions WHERE admin_user_id = ?');

export const ensureDefaultAdmin = async (): Promise<boolean> => {
  const forceReset = process.env.FORCE_RESET_DEFAULT_ADMIN === 'true';
  if (process.env.AUTO_CREATE_DEFAULT_ADMIN !== 'true') {
    console.log('Default admin ensured: false');
    console.log('Default admin password reset: false');
    return false;
  }

  const rawEmail = process.env.DEFAULT_ADMIN_EMAIL?.trim();
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? '';
  const role = validRoles.has(process.env.DEFAULT_ADMIN_ROLE ?? '') ? process.env.DEFAULT_ADMIN_ROLE as 'SUPERADMIN' | 'ADMIN' : 'SUPERADMIN';

  if (!rawEmail || !password || password.length < 12) {
    console.log('Default admin ensured: false');
    console.log('Default admin password reset: false');
    throw new Error('Default admin configuration is invalid');
  }

  if (process.env.NODE_ENV === 'production') {
    if (forceReset) console.warn('Default admin password reset skipped in production');
    if (password === examplePassword) {
      console.log('Default admin ensured: false');
      console.log('Default admin password reset: false');
      throw new Error('Default admin example password cannot be used in production');
    }
  }

  const email = normalizeEmail(rawEmail);
  const existing = findAdmin.get(email) as { id: number } | undefined;
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);
  const passwordHash = await bcrypt.hash(password, Number.isFinite(rounds) && rounds >= 10 ? rounds : 12);

  if (existing) {
    if (forceReset && process.env.NODE_ENV !== 'production') {
      resetAdmin.run(passwordHash, role, existing.id);
      deleteAdminSessions.run(existing.id);
      console.log('Default admin ensured: true');
      console.log('Default admin password reset: true');
      return true;
    }
    console.log('Default admin ensured: true');
    console.log('Default admin password reset: false');
    return false;
  }

  insertAdmin.run(email, passwordHash, role, forceReset && process.env.NODE_ENV !== 'production' ? 0 : 1);
  console.log('Default admin ensured: true');
  console.log('Default admin password reset: false');
  return true;
};

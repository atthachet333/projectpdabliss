import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { db } from '../db';
import { normalizeEmail } from '../security/admin-session';

const passwordMinLength = 12;
const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);
const bcryptRounds = Number.isFinite(rounds) && rounds >= 10 ? rounds : 12;
const validRoles = new Set(['SUPERADMIN', 'ADMIN']);

const promptMissing = async (): Promise<{ email: string; password: string; role: 'SUPERADMIN' | 'ADMIN' }> => {
  const rl = createInterface({ input, output });
  try {
    const email = process.env.ADMIN_EMAIL ?? await rl.question('Admin email: ');
    const password = process.env.ADMIN_PASSWORD ?? await rl.question('Admin password (min 12 chars): ');
    const roleInput = process.env.ADMIN_ROLE ?? await rl.question('Role [SUPERADMIN|ADMIN] (default SUPERADMIN): ');
    const role = validRoles.has(roleInput.trim()) ? roleInput.trim() as 'SUPERADMIN' | 'ADMIN' : 'SUPERADMIN';
    return { email, password, role };
  } finally {
    rl.close();
  }
};

const findAdmin = db.prepare('SELECT id FROM admin_users WHERE email = ?');
const insertAdmin = db.prepare(`
  INSERT INTO admin_users (email, password_hash, role)
  VALUES (?, ?, ?)
`);

const main = async (): Promise<void> => {
  const { email: rawEmail, password, role } = await promptMissing();
  const email = normalizeEmail(rawEmail);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('Invalid admin email');
    process.exit(1);
  }

  if (password.length < passwordMinLength) {
    console.error('Admin password must be at least 12 characters');
    process.exit(1);
  }

  if (findAdmin.get(email)) {
    console.error('Admin email already exists');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, bcryptRounds);
  insertAdmin.run(email, passwordHash, role);
  console.log('Admin user created');
};

void main();

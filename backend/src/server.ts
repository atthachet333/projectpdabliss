import 'dotenv/config';
import { app } from './app';
import { ensureDefaultAdmin } from './scripts/default-admin';
const port=Number(process.env.PORT)||4547;
const emailKeys = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_RECEIVER_EMAIL'] as const;
const adminKeys = ['ADMIN_SESSION_SECRET', 'ADMIN_COOKIE_NAME', 'ADMIN_SESSION_MAX_AGE_HOURS', 'BCRYPT_ROUNDS', 'DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASSWORD', 'DEFAULT_ADMIN_ROLE', 'AUTO_CREATE_DEFAULT_ADMIN', 'FORCE_RESET_DEFAULT_ADMIN'] as const;
console.log(`Backend working directory: ${process.cwd()}`);
for (const key of emailKeys) console.log(`${key} configured: ${Boolean(process.env[key]?.trim())}`);
for (const key of adminKeys) console.log(`${key} configured: ${Boolean(process.env[key]?.trim())}`);

const start = async (): Promise<void> => {
  await ensureDefaultAdmin();
  app.listen(port,()=>console.log(`เซิร์ฟเวอร์ PDA BLISS ทำงานที่ http://localhost:${port}`));
};

void start();

import 'dotenv/config';
import { initDb } from '../db';
import { ensureDefaultAdmin } from './default-admin';

const main = async (): Promise<void> => {
  initDb();
  await ensureDefaultAdmin();
  console.log('Database initialized');
};

void main();

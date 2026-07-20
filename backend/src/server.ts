import 'dotenv/config';
import { app } from './app';
import { db } from './db';
import { logger } from './lib/logger';
import { ensureDefaultAdmin } from './scripts/default-admin';
const port=Number(process.env.PORT)||4547;
const emailKeys = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_RECEIVER_EMAIL'] as const;
const adminKeys = ['ADMIN_SESSION_SECRET', 'ADMIN_COOKIE_NAME', 'ADMIN_SESSION_MAX_AGE_HOURS', 'BCRYPT_ROUNDS', 'DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASSWORD', 'DEFAULT_ADMIN_ROLE', 'AUTO_CREATE_DEFAULT_ADMIN', 'FORCE_RESET_DEFAULT_ADMIN'] as const;

const start = async (): Promise<void> => {
  logger.info('startup', 'application_starting', 'Backend application is starting', {
    port,
    workingDirectory: process.cwd(),
    nodeVersion: process.version,
    emailConfigReady: emailKeys.every(key => Boolean(process.env[key]?.trim())),
    adminConfigReady: adminKeys.every(key => Boolean(process.env[key]?.trim())),
    databaseConfigured: Boolean(process.env.DATABASE_PATH?.trim()),
  });

  await ensureDefaultAdmin();
  const server = app.listen(port, () => logger.info('startup', 'application_ready', 'Backend application is ready', { port }));

  const shutdown = (signal: string): void => {
    logger.info('shutdown', 'application_stopping', 'Backend application is stopping', { signal });
    server.close(() => {
      db.close();
      logger.info('shutdown', 'application_stopped', 'Backend application stopped', { signal });
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

process.on('unhandledRejection', error => {
  logger.fatal('process', 'unhandled_rejection', 'Unhandled promise rejection', { error });
});

process.on('uncaughtException', error => {
  logger.fatal('process', 'uncaught_exception', 'Uncaught exception', { error });
  process.exit(1);
});

void start().catch(error => {
  logger.fatal('startup', 'application_start_failed', 'Backend application failed to start', { error });
  process.exit(1);
});

import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { db } from './db';
import { logger, sanitizeLogData } from './lib/logger';
import { requestLogger } from './middleware/request-logger.middleware';
import { requireAdmin } from './middleware/requireAdmin';
import adminAuthRoutes from './routes/admin.auth.routes';
import adminAnalyticsRoutes from './routes/admin.analytics.routes';
import adminLeadsRoutes from './routes/admin.leads.routes';
import adminSeoRoutes from './routes/admin.seo.routes';
import analyticsRoutes from './routes/analytics.routes';
import contactRoutes from './routes/contact.routes';
import seoRoutes from './routes/seo.routes';
import type { ApiResponse } from './types/contact';

const configuredOrigins = process.env.FRONTEND_ORIGINS ?? process.env.FRONTEND_ORIGIN ?? '';
const allowedOrigins = configuredOrigins
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

logger.info('config', 'cors_origins_loaded', 'Allowed CORS origins loaded', {
  allowedOriginCount: allowedOrigins.length,
  allowNoOrigin: true,
});

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);
app.use(requestLogger);
app.use(express.json({ limit: '1mb' }));

// Endpoint สำหรับเช็คสถานะเซิร์ฟเวอร์
app.get('/api/health', (_req: Request, res: Response<ApiResponse<Record<string, unknown>>>) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({
      success: true,
      message: 'ระบบพร้อมให้บริการ',
      data: {
        status: 'ok',
        service: 'pdabliss-backend',
        environment: process.env.NODE_ENV || 'development',
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        checks: {
          database: 'ok',
          emailConfiguration: ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_RECEIVER_EMAIL'].every(key => Boolean(process.env[key]?.trim())) ? 'ok' : 'missing',
        },
      },
    });
  } catch (error) {
    logger.error('health', 'health_check_failed', 'Health check failed', { error });
    res.status(503).json({ success: false, message: 'ระบบไม่พร้อมให้บริการ', data: { status: 'error' } });
  }
});

// Endpoint ใหม่สำหรับรับ Log การกระทำต่างๆ จาก Frontend
app.post('/api/logs', (req: Request, res: Response) => {
  const { action, details, timestamp } = req.body;
  logger.info('frontend', 'client_log_received', 'Frontend log received', {
    requestId: req.requestId,
    action,
    clientTimestamp: timestamp,
    detailKeys: details && typeof details === 'object' ? Object.keys(sanitizeLogData(details)).slice(0, 20) : [],
  });
  res.status(200).json({ success: true, message: 'บันทึก Log สำเร็จ' });
});

const requireAllowedOrigin = (req: Request, res: Response<ApiResponse<never>>, next: NextFunction): void => {
  if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    next();
    return;
  }
  const origin = req.get('origin');
  if (!origin || allowedOrigins.includes(origin)) {
    next();
    return;
  }
  logger.warn('security', 'cors_origin_blocked', 'Blocked request from disallowed origin', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    origin,
  });
  res.status(403).json({ success: false, message: 'Origin not allowed' });
};

// Routes หลัก
app.use('/api/admin/auth', requireAllowedOrigin, adminAuthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', requireAllowedOrigin, requireAdmin, adminLeadsRoutes);
app.use('/api/admin', requireAllowedOrigin, requireAdmin, adminAnalyticsRoutes);
app.use('/api/admin', requireAllowedOrigin, requireAdmin, adminSeoRoutes);
app.use('/api/contact', contactRoutes);
app.use(seoRoutes);

// จัดการกรณีหา Route ไม่พบ (404)
app.use((_req: Request, res: Response<ApiResponse<never>>) => 
  res.status(404).json({ success: false, message: 'ไม่พบเส้นทางที่ร้องขอ' })
);

// จัดการ Error ภายในระบบ (500)
app.use((error: Error, req: Request, res: Response<ApiResponse<unknown>>, _next: NextFunction) => {
  if ((error as Error & { type?: string; status?: number }).type === 'entity.parse.failed') {
    logger.warn('http', 'invalid_json_body', 'Request body JSON parsing failed', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: 400,
    });
    res.status(400).json({ success: false, message: 'รูปแบบ JSON ไม่ถูกต้อง', data: { requestId: req.requestId } });
    return;
  }

  if (error.message === 'Origin not allowed by CORS') {
    logger.warn('security', 'cors_origin_blocked', 'Blocked request from disallowed CORS origin', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      origin: req.get('origin'),
    });
    res.status(403).json({ success: false, message: 'Origin not allowed by CORS' });
    return;
  }

  logger.error('http', 'unhandled_error', 'Unhandled server error', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    error,
  });
  res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบ', data: { requestId: req.requestId } });
});

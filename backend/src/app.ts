import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan'; // เพิ่ม Morgan เข้ามาสำหรับทำระบบ Log
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

console.log('Allowed CORS origins:', allowedOrigins);

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
app.use(express.json({ limit: '1mb' }));

// เปิดใช้งาน Morgan เพื่อ log ทุก Request ที่เข้ามา (แสดงผลใน Console)
app.use(morgan('dev'));

// Endpoint สำหรับเช็คสถานะเซิร์ฟเวอร์
app.get('/api/health', (_req: Request, res: Response<ApiResponse<{status: string}>>) => 
  res.json({ success: true, message: 'ระบบพร้อมให้บริการ', data: { status: 'ปกติ' } })
);

// Endpoint ใหม่สำหรับรับ Log การกระทำต่างๆ จาก Frontend
app.post('/api/logs', (req: Request, res: Response) => {
  const { action, details, timestamp } = req.body;
  console.log(`[FRONTEND LOG] ${action} at ${timestamp}:`, details);
  // ตรงนี้ในอนาคตคุณสามารถเขียนโค้ดเพื่อบันทึก Log ลง Database ได้ครับ
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
app.use((error: Error, _req: Request, res: Response<ApiResponse<never>>, _next: NextFunction) => {
  if (error.message === 'Origin not allowed by CORS') {
    res.status(403).json({ success: false, message: 'Origin not allowed by CORS' });
    return;
  }

  console.error(error);
  res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบ' });
});

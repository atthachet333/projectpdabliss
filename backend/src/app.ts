import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan'; // เพิ่ม Morgan เข้ามาสำหรับทำระบบ Log
import contactRoutes from './routes/contact.routes';
import type { ApiResponse } from './types/contact';

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4546' }));
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

// Routes หลัก
app.use('/api/contact', contactRoutes);

// จัดการกรณีหา Route ไม่พบ (404)
app.use((_req: Request, res: Response<ApiResponse<never>>) => 
  res.status(404).json({ success: false, message: 'ไม่พบเส้นทางที่ร้องขอ' })
);

// จัดการ Error ภายในระบบ (500)
app.use((error: Error, _req: Request, res: Response<ApiResponse<never>>, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบ' });
});
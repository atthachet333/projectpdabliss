import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
    startedAt?: number;
  }
}

const requestIdPattern = /^[a-zA-Z0-9._:-]{1,80}$/;

const requestPath = (req: Request): string => req.originalUrl.split('?')[0] || req.path;

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const incomingId = req.get('x-request-id');
  const requestId = incomingId && requestIdPattern.test(incomingId) ? incomingId : randomUUID();
  req.requestId = requestId;
  req.startedAt = Date.now();
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const durationMs = Date.now() - (req.startedAt ?? Date.now());
    const statusCode = res.statusCode;
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : requestPath(req) === '/api/health' ? 'debug' : 'info';
    const admin = (req as Request & { admin?: { role?: string } }).admin;
    logger[level]('http', 'request_completed', 'HTTP request completed', {
      requestId,
      method: req.method,
      path: requestPath(req),
      statusCode,
      durationMs,
      userRole: admin?.role,
    });
  });

  next();
};

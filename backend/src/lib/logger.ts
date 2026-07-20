import { createWriteStream, existsSync, mkdirSync, renameSync, rmSync, statSync, type WriteStream } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const levelWeight: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

const environment = process.env.NODE_ENV || 'development';
const configuredLevel = (process.env.LOG_LEVEL || (environment === 'production' ? 'info' : 'debug')).toLowerCase() as LogLevel;
const minimumLevel = levelWeight[configuredLevel] ? configuredLevel : 'info';
const logFormat = process.env.LOG_FORMAT || (environment === 'production' ? 'json' : 'pretty');
const includeStack = process.env.LOG_INCLUDE_STACK === 'true' || environment !== 'production';
const logDirectory = resolve(process.cwd(), process.env.LOG_DIRECTORY || 'logs');
const maxFiles = Math.max(1, Number(process.env.LOG_MAX_FILES ?? 14) || 14);

const sensitiveKeyPattern = /(password|token|secret|cookie|authorization|api[_-]?key|session|hash)/i;
const sizePattern = /^(\d+)([kmg])?$/i;

const maxBytes = (() => {
  const match = String(process.env.LOG_MAX_SIZE || '10m').trim().match(sizePattern);
  if (!match) return 10 * 1024 * 1024;
  const value = Number(match[1]);
  const unit = match[2]?.toLowerCase();
  if (unit === 'g') return value * 1024 * 1024 * 1024;
  if (unit === 'm') return value * 1024 * 1024;
  if (unit === 'k') return value * 1024;
  return value;
})();

type LogFileName = 'backend-combined.log' | 'backend-error.log' | 'http-access.log' | 'admin-auth.log';

const streams = new Map<LogFileName, { stream: WriteStream; bytes: number }>();

const openStream = (fileName: LogFileName): { stream: WriteStream; bytes: number } => {
  mkdirSync(logDirectory, { recursive: true });
  const filePath = join(logDirectory, fileName);
  const bytes = existsSync(filePath) ? statSync(filePath).size : 0;
  const stream = createWriteStream(filePath, { flags: 'a' });
  const state = { stream, bytes };
  streams.set(fileName, state);
  return state;
};

const rotate = (fileName: LogFileName): void => {
  const current = streams.get(fileName);
  current?.stream.end();
  const filePath = join(logDirectory, fileName);
  const dir = dirname(filePath);
  const base = basename(filePath);
  for (let index = maxFiles - 1; index >= 1; index -= 1) {
    const from = join(dir, `${base}.${index}`);
    const to = join(dir, `${base}.${index + 1}`);
    if (index === maxFiles - 1 && existsSync(to)) rmSync(to, { force: true });
    if (existsSync(from)) renameSync(from, to);
  }
  if (existsSync(filePath)) renameSync(filePath, join(dir, `${base}.1`));
  openStream(fileName);
};

const writeFileLine = (fileName: LogFileName, line: string): void => {
  const state = streams.get(fileName) ?? openStream(fileName);
  const bytes = Buffer.byteLength(line);
  if (state.bytes + bytes > maxBytes) rotate(fileName);
  const next = streams.get(fileName) ?? openStream(fileName);
  next.bytes += bytes;
  next.stream.write(line);
};

(['backend-combined.log', 'backend-error.log', 'http-access.log', 'admin-auth.log'] as const).forEach(openStream);

export const maskEmail = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || !value.includes('@')) return undefined;
  const [name, domain] = value.split('@');
  if (!name || !domain) return undefined;
  return `${name.slice(0, 2)}***@${domain}`;
};

export const maskPhone = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 4) return '***';
  return `${'*'.repeat(Math.max(3, digits.length - 4))}${digits.slice(-4)}`;
};

const redactValue = (key: string, value: unknown): unknown => {
  if (sensitiveKeyPattern.test(key)) return '[REDACTED]';
  if (/email/i.test(key)) return maskEmail(value) ?? value;
  if (/phone|tel|mobile/i.test(key)) return maskPhone(value) ?? value;
  if (value instanceof Error) return safeError(value);
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(item => redactValue(key, item));

  const clean: Record<string, unknown> = {};
  for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
    clean[childKey] = redactValue(childKey, childValue);
  }
  return clean;
};

export const sanitizeLogData = (data: Record<string, unknown> = {}): Record<string, unknown> => {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) clean[key] = redactValue(key, value);
  return clean;
};

export const safeError = (error: unknown): Record<string, unknown> => {
  if (!(error instanceof Error)) return { safeErrorMessage: String(error) };
  return {
    errorName: error.name,
    safeErrorMessage: error.message,
    ...(includeStack && error.stack ? { stack: error.stack } : {}),
  };
};

const shouldLog = (level: LogLevel): boolean => levelWeight[level] >= levelWeight[minimumLevel];

const write = (level: LogLevel, module: string, event: string, message: string, data: Record<string, unknown> = {}): void => {
  const payload = sanitizeLogData({
    timestamp: new Date().toISOString(),
    level,
    service: 'pdabliss-backend',
    environment,
    module,
    event,
    message,
    ...data,
  });
  const jsonLine = `${JSON.stringify(payload)}\n`;
  if (levelWeight[level] >= levelWeight.info) writeFileLine('backend-combined.log', jsonLine);
  if (level === 'error' || level === 'fatal') writeFileLine('backend-error.log', jsonLine);
  if (module === 'http' && event === 'request_completed') writeFileLine('http-access.log', jsonLine);
  if (module === 'admin_auth') writeFileLine('admin-auth.log', jsonLine);
  if (!shouldLog(level)) return;

  if (logFormat === 'json') {
    const line = jsonLine.trimEnd();
    if (level === 'error' || level === 'fatal') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
    return;
  }

  const { timestamp, service, ...rest } = payload;
  const context = Object.entries(rest)
    .filter(([key]) => !['level', 'module', 'event', 'message'].includes(key))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(' ');
  const line = `[${timestamp}] ${level.toUpperCase()} ${module}.${event} ${message}${context ? ` ${context}` : ''}`;
  if (level === 'error' || level === 'fatal') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
  void service;
};

export const logger = {
  debug: (module: string, event: string, message: string, data?: Record<string, unknown>) => write('debug', module, event, message, data),
  info: (module: string, event: string, message: string, data?: Record<string, unknown>) => write('info', module, event, message, data),
  warn: (module: string, event: string, message: string, data?: Record<string, unknown>) => write('warn', module, event, message, data),
  error: (module: string, event: string, message: string, data?: Record<string, unknown>) => write('error', module, event, message, data),
  fatal: (module: string, event: string, message: string, data?: Record<string, unknown>) => write('fatal', module, event, message, data),
};

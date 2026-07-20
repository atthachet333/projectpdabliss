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

const sensitiveKeyPattern = /(password|token|secret|cookie|authorization|api[_-]?key|session|hash)/i;

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
  if (!(error instanceof Error)) return { message: String(error) };
  return {
    name: error.name,
    message: error.message,
    ...(includeStack && error.stack ? { stack: error.stack } : {}),
  };
};

const shouldLog = (level: LogLevel): boolean => levelWeight[level] >= levelWeight[minimumLevel];

const write = (level: LogLevel, module: string, event: string, message: string, data: Record<string, unknown> = {}): void => {
  if (!shouldLog(level)) return;
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

  if (logFormat === 'json') {
    const line = JSON.stringify(payload);
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

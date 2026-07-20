type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const weights: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = (import.meta.env.VITE_LOG_LEVEL || (import.meta.env.DEV ? 'debug' : 'warn')).toLowerCase() as LogLevel;
const minimumLevel = weights[configuredLevel] ? configuredLevel : 'warn';
const sensitiveKeyPattern = /(password|token|secret|cookie|authorization|api[_-]?key|session)/i;

const maskEmail = (value: unknown): unknown => {
  if (typeof value !== 'string' || !value.includes('@')) return value;
  const [name, domain] = value.split('@');
  return name && domain ? `${name.slice(0, 2)}***@${domain}` : value;
};

const sanitize = (data: Record<string, unknown> = {}): Record<string, unknown> => {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (sensitiveKeyPattern.test(key)) clean[key] = '[REDACTED]';
    else if (/email/i.test(key)) clean[key] = maskEmail(value);
    else if (value instanceof Error) clean[key] = { name: value.name, message: value.message };
    else clean[key] = value;
  }
  return clean;
};

const shouldLog = (level: LogLevel): boolean => weights[level] >= weights[minimumLevel];

const write = (level: LogLevel, event: string, message: string, data: Record<string, unknown> = {}): void => {
  if (!shouldLog(level)) return;
  const payload = sanitize({
    timestamp: new Date().toISOString(),
    level,
    service: 'pdabliss-frontend',
    event,
    message,
    path: window.location.pathname,
    ...data,
  });
  if (level === 'error') console.error(event, payload);
  else if (level === 'warn') console.warn(event, payload);
  else console.log(event, payload);
};

export const appLogger = {
  debug: (event: string, message: string, data?: Record<string, unknown>) => write('debug', event, message, data),
  info: (event: string, message: string, data?: Record<string, unknown>) => write('info', event, message, data),
  warn: (event: string, message: string, data?: Record<string, unknown>) => write('warn', event, message, data),
  error: (event: string, message: string, data?: Record<string, unknown>) => write('error', event, message, data),
};

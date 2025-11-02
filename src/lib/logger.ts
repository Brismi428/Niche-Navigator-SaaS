import { randomUUID } from 'crypto';

/**
 * Structured logging utility for security and observability
 *
 * SECURITY: This implementation prevents sensitive data leakage by:
 * - Sanitizing error messages before logging
 * - Redacting sensitive fields (passwords, tokens, secrets, credit cards)
 * - Using request IDs for tracing without exposing user data
 * - Structured JSON output for security monitoring tools
 * - Different log levels for development vs production
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  requestId?: string;
  userId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Sensitive field names that should be redacted from logs
 * SECURITY: Add any fields that might contain sensitive data
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'api_key',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'creditCard',
  'credit_card',
  'cardNumber',
  'card_number',
  'cvv',
  'ssn',
  'authorization',
  'cookie',
  'session',
];

/**
 * Redact sensitive fields from an object
 * @param obj - Object to sanitize
 * @returns Sanitized object with sensitive fields redacted
 */
function redactSensitiveData(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    // Check if field should be redacted
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = redactSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize error for logging
 * SECURITY: Removes stack traces in production and sanitizes error messages
 */
function sanitizeError(error: unknown): LogEntry['error'] {
  if (!(error instanceof Error)) {
    return {
      name: 'UnknownError',
      message: String(error),
    };
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: error.name,
    message: error.message,
    // Only include stack traces in development
    stack: isProduction ? undefined : error.stack,
  };
}

/**
 * Format log entry as JSON
 */
function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

/**
 * Log a message with structured context
 */
function log(level: LogLevel, message: string, context?: LogContext, error?: unknown): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ? (redactSensitiveData(context) as LogContext) : undefined,
    error: error ? sanitizeError(error) : undefined,
  };

  const formattedLog = formatLogEntry(entry);

  // Use appropriate console method based on level
  switch (level) {
    case 'debug':
      console.debug(formattedLog);
      break;
    case 'info':
      console.info(formattedLog);
      break;
    case 'warn':
      console.warn(formattedLog);
      break;
    case 'error':
      console.error(formattedLog);
      break;
  }
}

/**
 * Generate a unique request ID for tracing
 */
export function generateRequestId(): string {
  return randomUUID();
}

/**
 * Logger class with convenience methods
 */
class Logger {
  private defaultContext?: LogContext;

  constructor(defaultContext?: LogContext) {
    this.defaultContext = defaultContext;
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    return new Logger({
      ...this.defaultContext,
      ...context,
    });
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    // Skip debug logs in production
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    log('debug', message, { ...this.defaultContext, ...context });
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    log('info', message, { ...this.defaultContext, ...context });
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext, error?: unknown): void {
    log('warn', message, { ...this.defaultContext, ...context }, error);
  }

  /**
   * Log error message
   */
  error(message: string, context?: LogContext, error?: unknown): void {
    log('error', message, { ...this.defaultContext, ...context }, error);
  }

  /**
   * Log HTTP request
   */
  httpRequest(context: LogContext): void {
    this.info('HTTP Request', context);
  }

  /**
   * Log HTTP response
   */
  httpResponse(context: LogContext): void {
    this.info('HTTP Response', context);
  }

  /**
   * Log security event (authentication, authorization, etc.)
   */
  security(message: string, context?: LogContext): void {
    this.warn(`SECURITY: ${message}`, context);
  }
}

/**
 * Create a logger instance
 * @param context - Optional default context for all logs from this logger
 */
export function createLogger(context?: LogContext): Logger {
  return new Logger(context);
}

/**
 * Default logger instance
 */
export const logger = createLogger();

/**
 * Create a logger with request context
 * Usage in API routes:
 * ```typescript
 * const logger = createRequestLogger(request);
 * logger.info('Processing request');
 * ```
 */
export function createRequestLogger(request: {
  method?: string;
  url?: string;
  headers?: Headers;
}): Logger {
  const requestId = generateRequestId();

  return createLogger({
    requestId,
    method: request.method,
    path: request.url ? new URL(request.url, 'http://localhost').pathname : undefined,
    userAgent: request.headers?.get('user-agent') || undefined,
  });
}

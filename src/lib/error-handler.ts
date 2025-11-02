import { NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Error handling utilities for API routes
 *
 * SECURITY: This implementation prevents information disclosure by:
 * - Sanitizing error messages sent to clients
 * - Removing stack traces from production responses
 * - Hiding internal implementation details
 * - Logging full errors server-side for debugging
 * - Using generic error messages for unexpected errors
 */

export type ErrorCode =
  | 'AUTHENTICATION_REQUIRED'
  | 'AUTHORIZATION_FAILED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR'
  | 'BAD_REQUEST'
  | 'CORS_VIOLATION'
  | 'STRIPE_ERROR'
  | 'DATABASE_ERROR';

export interface ApiError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Base API Error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>,
    isOperational = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Predefined error classes for common scenarios
 */

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super('AUTHENTICATION_REQUIRED', message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super('AUTHORIZATION_FAILED', message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super('RATE_LIMIT_EXCEEDED', message, 429);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super('SERVICE_UNAVAILABLE', message, 503);
  }
}

export class CorsViolationError extends AppError {
  constructor(message = 'CORS policy violation') {
    super('CORS_VIOLATION', message, 403);
  }
}

export class StripeError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('STRIPE_ERROR', message, 400, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super('DATABASE_ERROR', message, 500, undefined, false);
  }
}

/**
 * Sanitize error message for client response
 * SECURITY: Prevents leaking sensitive implementation details
 */
function sanitizeErrorMessage(error: unknown): string {
  const isProduction = process.env.NODE_ENV === 'production';

  // If it's an operational error (AppError), use its message
  if (error instanceof AppError && error.isOperational) {
    return error.message;
  }

  // In production, hide all non-operational error details
  if (isProduction) {
    return 'An unexpected error occurred. Please try again later.';
  }

  // In development, show the error message for debugging
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Get appropriate status code for error
 */
function getStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  // Default to 500 for unknown errors
  return 500;
}

/**
 * Format error response for API
 * SECURITY: Only includes safe data, no stack traces or internal details
 */
function formatErrorResponse(error: unknown): {
  error: string;
  code?: ErrorCode;
  details?: Record<string, unknown>;
} {
  const message = sanitizeErrorMessage(error);

  if (error instanceof AppError) {
    return {
      error: message,
      code: error.code,
      // Only include details if operational and not in production
      details:
        error.isOperational && process.env.NODE_ENV !== 'production'
          ? error.details
          : undefined,
    };
  }

  return { error: message };
}

/**
 * Handle API errors and return appropriate NextResponse
 *
 * Usage in API routes:
 * ```typescript
 * try {
 *   // Your API logic
 * } catch (error) {
 *   return handleApiError(error, { requestId, userId });
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  context?: {
    requestId?: string;
    userId?: string;
    method?: string;
    path?: string;
  }
): NextResponse {
  const statusCode = getStatusCode(error);
  const errorResponse = formatErrorResponse(error);

  // Log the full error server-side with context
  if (statusCode >= 500) {
    // Server errors - log as error
    logger.error('API Error', context, error);
  } else if (statusCode >= 400) {
    // Client errors - log as warning
    logger.warn('API Client Error', context, error);
  }

  // Return sanitized error to client
  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Wrap an async API handler with error handling
 *
 * Usage:
 * ```typescript
 * export const POST = withErrorHandler(async (request) => {
 *   // Your API logic
 *   // Throw AppError or any error
 *   throw new ValidationError('Invalid input');
 * });
 * ```
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
): (...args: T) => Promise<NextResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Assert condition or throw error
 * Useful for validation checks
 */
export function assert(
  condition: unknown,
  error: AppError | string
): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new ValidationError(error);
    }
    throw error;
  }
}

/**
 * Check if error is an operational error (safe to expose)
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Create a standardized error response
 * For non-API contexts (e.g., Server Actions)
 */
export function createErrorResponse(error: unknown): {
  success: false;
  error: string;
  code?: ErrorCode;
} {
  const errorResponse = formatErrorResponse(error);

  return {
    success: false,
    error: errorResponse.error,
    code: errorResponse.code,
  };
}

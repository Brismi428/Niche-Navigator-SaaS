import { NextRequest, NextResponse } from 'next/server';

/**
 * Request size limit utilities for API routes
 *
 * SECURITY: Prevents DoS attacks via large request payloads
 * - Limits request body size before processing
 * - Different limits for different route types
 * - Rejects oversized requests early
 * - Prevents memory exhaustion attacks
 */

// Default size limits (in bytes)
export const SIZE_LIMITS = {
  // Standard API routes (JSON payloads)
  API_ROUTE: 1 * 1024 * 1024, // 1MB

  // Webhook routes (can be larger for batch events)
  WEBHOOK: 2 * 1024 * 1024, // 2MB

  // File upload routes (if needed in future)
  FILE_UPLOAD: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Convert bytes to human-readable format
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Check if request body size exceeds limit
 *
 * @param request - Next.js request object
 * @param limitBytes - Maximum allowed size in bytes
 * @returns Object with allowed status and current size
 */
export function checkRequestSize(
  request: NextRequest,
  limitBytes: number
): { allowed: boolean; size: number; limit: number } {
  // Get Content-Length header
  const contentLength = request.headers.get('content-length');

  if (!contentLength) {
    // No Content-Length header - allow but log warning
    // Note: Some clients don't send Content-Length
    return { allowed: true, size: 0, limit: limitBytes };
  }

  const size = parseInt(contentLength, 10);

  if (isNaN(size)) {
    // Invalid Content-Length - reject for security
    return { allowed: false, size: 0, limit: limitBytes };
  }

  return {
    allowed: size <= limitBytes,
    size,
    limit: limitBytes,
  };
}

/**
 * Middleware to enforce request size limits
 *
 * Usage in API routes:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const sizeCheck = enforceRequestSizeLimit(request, SIZE_LIMITS.API_ROUTE);
 *   if (sizeCheck) return sizeCheck; // Returns error response if oversized
 *
 *   // Continue with normal processing
 * }
 * ```
 *
 * @param request - Next.js request object
 * @param limitBytes - Maximum allowed size in bytes
 * @returns NextResponse with 413 error if oversized, null if within limit
 */
export function enforceRequestSizeLimit(
  request: NextRequest,
  limitBytes: number
): NextResponse | null {
  const { allowed, size, limit } = checkRequestSize(request, limitBytes);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Request payload too large',
        details: {
          maxSize: formatBytes(limit),
          receivedSize: formatBytes(size),
        },
      },
      {
        status: 413, // Payload Too Large
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return null;
}

/**
 * Higher-order function to wrap API route handlers with size limit enforcement
 *
 * Usage:
 * ```typescript
 * export const POST = withRequestSizeLimit(
 *   async (request) => {
 *     // Your handler logic
 *     return NextResponse.json({ success: true });
 *   },
 *   SIZE_LIMITS.API_ROUTE
 * );
 * ```
 */
export function withRequestSizeLimit<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>,
  limitBytes: number = SIZE_LIMITS.API_ROUTE
): (...args: T) => Promise<NextResponse> {
  return async (...args: T) => {
    // First argument should be NextRequest for API routes
    const request = args[0] as unknown as NextRequest;

    // Check request size
    const sizeCheck = enforceRequestSizeLimit(request, limitBytes);
    if (sizeCheck) {
      return sizeCheck;
    }

    // Execute handler if size is within limit
    return handler(...args);
  };
}

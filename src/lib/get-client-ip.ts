import { NextRequest } from 'next/server';

/**
 * Securely extract client IP address from request
 *
 * SECURITY: This implementation prioritizes security over accepting all proxy configurations.
 * - For Vercel deployments: Uses verified x-vercel-forwarded-for header
 * - For Cloudflare deployments: Uses verified cf-connecting-ip header
 * - NEVER trusts user-controllable headers like x-forwarded-for or x-real-ip
 *
 * Note: In development or non-proxied environments, all requests will appear as 'unknown'
 *
 * @param request - Next.js request object
 * @returns Client IP address or 'unknown' if cannot be determined
 */
export function getClientIp(request: NextRequest): string {
  // Priority 1: Vercel's verified forwarded IP (most secure for Vercel deployments)
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    // Take the first IP in the comma-separated list (client IP)
    return vercelIp.split(',')[0].trim();
  }

  // Priority 2: Cloudflare's CF-Connecting-IP (if behind Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }

  // Fallback: Cannot determine IP securely
  // Using 'unknown' groups all unidentifiable requests together
  // This is more secure than trusting user-controllable headers
  // Note: In development or non-proxied environments, all requests may appear as 'unknown'
  return 'unknown';
}

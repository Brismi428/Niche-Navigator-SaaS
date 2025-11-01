import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number;
  uniqueTokenPerInterval: number;
};

/**
 * In-memory rate limiter using LRU cache
 *
 * SECURITY NOTE: This implementation has limitations:
 * 1. State is lost on server restarts/deployments
 * 2. In serverless environments (Vercel), each instance has independent state
 * 3. Not suitable for distributed systems or production at scale
 *
 * For production use, consider:
 * - Upstash Rate Limit (https://upstash.com/docs/oss/sdks/ts/ratelimit/overview)
 * - Vercel KV with rate limiting
 * - Redis-based rate limiting
 */
export function rateLimit(options: RateLimitOptions) {
  // Use integer counter instead of array to reduce race condition window
  const tokenCache = new LRUCache<string, number>({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval,
  });

  return {
    check: async (limit: number, token: string) => {
      // Get current count (defaults to 0 if not present)
      const current = tokenCache.get(token) ?? 0;

      // Check if limit exceeded
      if (current >= limit) {
        return { success: false, remaining: 0 };
      }

      // Increment counter (more atomic than array mutation)
      tokenCache.set(token, current + 1);

      return { success: true, remaining: limit - current - 1 };
    },
  };
}

// Rate limiters for different endpoints
export const authRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
});

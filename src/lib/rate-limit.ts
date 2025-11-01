import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval,
  });

  return {
    check: async (limit: number, token: string) => {
      const tokenCount = tokenCache.get(token) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1]);
      } else if (tokenCount[0] < limit) {
        tokenCount[0]++;
        tokenCache.set(token, tokenCount);
      } else {
        return { success: false, remaining: 0 };
      }
      return { success: true, remaining: limit - tokenCount[0] };
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

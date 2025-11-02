/**
 * Secure client storage utilities with whitelist-only access
 *
 * SECURITY: Prevents accidental storage of sensitive data in localStorage
 * - Whitelist-only approach for allowed keys
 * - Blocks storage of tokens, credentials, and PII
 * - Type-safe storage operations
 * - Automatic JSON serialization/deserialization
 * - Warning logging for unauthorized storage attempts
 */

/**
 * Allowed storage keys (whitelist)
 * SECURITY: Only these keys can be stored in localStorage
 *
 * IMPORTANT: NEVER add keys that might contain:
 * - Authentication tokens
 * - Session IDs
 * - Passwords or credentials
 * - Personal Identifiable Information (PII)
 * - API keys or secrets
 */
export const ALLOWED_STORAGE_KEYS = {
  // UI/UX preferences (safe to store)
  THEME: 'theme', // 'light' | 'dark' | 'system'
  SIDEBAR_COLLAPSED: 'sidebar_collapsed', // boolean
  LANGUAGE: 'language', // 'en' | 'es' | 'fr' etc.

  // Non-sensitive application state
  ONBOARDING_COMPLETED: 'onboarding_completed', // boolean
  LAST_VISITED_PAGE: 'last_visited_page', // string (path)

  // Analytics/tracking preferences (non-PII)
  ANALYTICS_CONSENT: 'analytics_consent', // boolean
  COOKIE_CONSENT: 'cookie_consent', // boolean
} as const;

// Type for allowed keys
export type AllowedStorageKey = (typeof ALLOWED_STORAGE_KEYS)[keyof typeof ALLOWED_STORAGE_KEYS];

/**
 * Forbidden patterns in storage keys
 * SECURITY: These patterns indicate sensitive data and should never be stored
 */
const FORBIDDEN_PATTERNS = [
  /token/i,
  /auth/i,
  /session/i,
  /password/i,
  /secret/i,
  /credential/i,
  /api[_-]?key/i,
  /access[_-]?key/i,
  /jwt/i,
  /bearer/i,
  /email/i,
  /phone/i,
  /ssn/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
  /cvv/i,
];

/**
 * Check if a key is allowed to be stored
 */
function isKeyAllowed(key: string): boolean {
  // Check if key is in whitelist
  const allowedKeys = Object.values(ALLOWED_STORAGE_KEYS);
  if (!allowedKeys.includes(key as AllowedStorageKey)) {
    return false;
  }

  // Additional security check: ensure key doesn't match forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(key)) {
      console.error(
        `SECURITY WARNING: Attempted to store key "${key}" which matches forbidden pattern ${pattern}. This is blocked.`
      );
      return false;
    }
  }

  return true;
}

/**
 * Secure localStorage wrapper with whitelist enforcement
 */
class SecureStorage {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Get item from localStorage
   * @param key - Whitelisted storage key
   * @returns Parsed value or null if not found
   */
  getItem<T = string>(key: AllowedStorageKey): T | null {
    if (!this.isClient) {
      return null;
    }

    if (!isKeyAllowed(key)) {
      console.error(`SECURITY: Storage key "${key}" is not whitelisted. Access denied.`);
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }

      // Try to parse as JSON, fall back to raw string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   * @param key - Whitelisted storage key
   * @param value - Value to store (will be JSON stringified)
   * @returns Success boolean
   */
  setItem(key: AllowedStorageKey, value: unknown): boolean {
    if (!this.isClient) {
      return false;
    }

    if (!isKeyAllowed(key)) {
      console.error(`SECURITY: Storage key "${key}" is not whitelisted. Storage denied.`);
      return false;
    }

    // SECURITY: Check if value contains sensitive data patterns
    const valueStr = JSON.stringify(value);
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(valueStr)) {
        console.error(
          `SECURITY WARNING: Attempted to store sensitive data for key "${key}". Storage blocked.`
        );
        return false;
      }
    }

    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param key - Whitelisted storage key
   * @returns Success boolean
   */
  removeItem(key: AllowedStorageKey): boolean {
    if (!this.isClient) {
      return false;
    }

    if (!isKeyAllowed(key)) {
      console.error(`SECURITY: Storage key "${key}" is not whitelisted. Removal denied.`);
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all whitelisted items from localStorage
   * SECURITY: Only clears whitelisted keys, leaves other data untouched
   */
  clear(): void {
    if (!this.isClient) {
      return;
    }

    const allowedKeys = Object.values(ALLOWED_STORAGE_KEYS);
    allowedKeys.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error clearing localStorage for key "${key}":`, error);
      }
    });
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    if (!this.isClient) {
      return false;
    }

    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Audit localStorage for potentially sensitive data
   * SECURITY: Scans all localStorage keys and warns about suspicious patterns
   * @returns List of suspicious keys found
   */
  auditStorage(): string[] {
    if (!this.isClient) {
      return [];
    }

    const suspiciousKeys: string[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Check if key matches forbidden patterns
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(key)) {
            suspiciousKeys.push(key);
            console.warn(
              `SECURITY AUDIT: Found suspicious localStorage key "${key}" matching pattern ${pattern}`
            );
            break;
          }
        }

        // Check if value contains sensitive patterns
        try {
          const value = localStorage.getItem(key);
          if (value) {
            for (const pattern of FORBIDDEN_PATTERNS) {
              if (pattern.test(value)) {
                if (!suspiciousKeys.includes(key)) {
                  suspiciousKeys.push(key);
                  console.warn(
                    `SECURITY AUDIT: Found suspicious data in localStorage key "${key}"`
                  );
                }
                break;
              }
            }
          }
        } catch {
          // Skip if we can't read the value
        }
      }
    } catch (error) {
      console.error('Error during storage audit:', error);
    }

    return suspiciousKeys;
  }
}

/**
 * Singleton instance of secure storage
 */
export const secureStorage = new SecureStorage();

/**
 * React hook for secure storage access
 * @param key - Whitelisted storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useSecureStorage<T = string>(
  key: AllowedStorageKey,
  defaultValue?: T
): [T | null, (value: T) => boolean, () => boolean] {
  // This is a basic implementation - in a real React app, you'd use useState and useEffect
  const getValue = (): T | null => {
    const stored = secureStorage.getItem<T>(key);
    return stored !== null ? stored : (defaultValue ?? null);
  };

  const setValue = (value: T): boolean => {
    return secureStorage.setItem(key, value);
  };

  const removeValue = (): boolean => {
    return secureStorage.removeItem(key);
  };

  return [getValue(), setValue, removeValue];
}

/**
 * Run storage audit on application startup
 * Call this in your app initialization to check for security issues
 */
export function runStorageAudit(): void {
  if (typeof window === 'undefined') {
    return;
  }

  console.log('Running security audit of localStorage...');
  const suspiciousKeys = secureStorage.auditStorage();

  if (suspiciousKeys.length > 0) {
    console.error(
      `SECURITY WARNING: Found ${suspiciousKeys.length} suspicious localStorage key(s):`,
      suspiciousKeys
    );
    console.error(
      'Consider removing sensitive data from localStorage and using secure HTTP-only cookies instead.'
    );
  } else {
    console.log('Storage audit complete: No suspicious keys found.');
  }
}

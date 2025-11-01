import { z } from 'zod';

/**
 * Authentication-related validation schemas using Zod
 *
 * SECURITY: These schemas prevent:
 * - Email injection attacks
 * - Weak passwords
 * - Invalid redirect URLs (open redirect vulnerabilities)
 * - Malformed user data
 */

/**
 * Email validation with strict requirements
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim()
  .describe('User email address');

/**
 * Password validation with security requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .describe('User password with security requirements');

/**
 * User ID validation (UUID format)
 */
export const userIdSchema = z
  .string()
  .uuid('Invalid user ID format')
  .describe('Supabase user UUID');

/**
 * Redirect URL validation to prevent open redirect attacks
 * Only allows relative paths or same-origin URLs
 */
export const redirectUrlSchema = z
  .string()
  .refine(
    (url) => {
      // Allow relative paths
      if (url.startsWith('/') && !url.startsWith('//')) {
        return true;
      }

      // Allow same-origin URLs
      try {
        const parsedUrl = new URL(url);
        const allowedOrigins = [
          process.env.NEXT_PUBLIC_APP_URL,
          'http://localhost:3000',
          'http://127.0.0.1:3000',
        ].filter(Boolean);

        return allowedOrigins.some(origin => parsedUrl.origin === origin);
      } catch {
        return false;
      }
    },
    'Invalid redirect URL - must be a relative path or same-origin URL'
  )
  .describe('Safe redirect URL');

/**
 * Login request validation
 */
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // Less strict for login
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

/**
 * Signup request validation
 */
export const signupRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema, // Strict requirements for signup
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .trim()
    .optional(),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

/**
 * Password reset request validation
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password update validation
 */
export const passwordUpdateSchema = z.object({
  newPassword: passwordSchema,
  token: z.string().min(1, 'Reset token is required'),
});

export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;

/**
 * OAuth callback query parameters validation
 */
export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export type OAuthCallback = z.infer<typeof oauthCallbackSchema>;

/**
 * Helper function to safely parse and validate auth data
 */
export function validateAuthData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage = 'Validation failed'
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw new Error(`${errorMessage}: ${errors}`);
  }

  return result.data;
}

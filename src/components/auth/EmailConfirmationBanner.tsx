'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Mail, X, RefreshCw } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

/**
 * EmailConfirmationBanner Component
 *
 * Displays a dismissible banner prompting users to confirm their email address.
 * Shows only if the user is logged in but has not confirmed their email.
 *
 * Features:
 * - Auto-detects unconfirmed email status
 * - Resend confirmation email functionality
 * - Dismissible (stores preference in localStorage)
 * - Loading states during email resend
 * - Success/error feedback
 *
 * Usage:
 * ```tsx
 * import EmailConfirmationBanner from '@/components/auth/EmailConfirmationBanner'
 *
 * // In your layout or dashboard page
 * <EmailConfirmationBanner />
 * ```
 *
 * @returns Banner component or null if email is confirmed or user is not logged in
 */
export default function EmailConfirmationBanner() {
  const { user } = useAuth()
  const [dismissed, setDismissed] = useState(() => {
    // Check if user previously dismissed the banner
    if (typeof window !== 'undefined') {
      return localStorage.getItem('emailBannerDismissed') === 'true'
    }
    return false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Don't show banner if:
  // 1. No user is logged in
  // 2. Email is already confirmed
  // 3. User dismissed the banner
  if (!user || user.emailConfirmed || dismissed) {
    return null
  }

  const handleResendEmail = async () => {
    if (!user?.email) return

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createBrowserSupabaseClient()

      // Resend confirmation email using Supabase Auth
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      setMessage({
        type: 'success',
        text: 'Confirmation email sent! Please check your inbox (and spam folder).',
      })
    } catch (error) {
      console.error('Error resending confirmation email:', error)
      setMessage({
        type: 'error',
        text: 'Failed to send confirmation email. Please try again later.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('emailBannerDismissed', 'true')
  }

  return (
    <div className="border-b border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20">
      <div className="container mx-auto px-4 py-3">
        <Alert className="border-0 bg-transparent p-0">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />

            {/* Content */}
            <div className="flex-1 space-y-2">
              <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong className="font-semibold">Please verify your email address</strong>
                <p className="mt-1">
                  We sent a confirmation email to <strong>{user.email}</strong>.
                  Click the link in the email to verify your account and unlock all features.
                </p>
              </AlertDescription>

              {/* Success/Error Message */}
              {message && (
                <div
                  className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                  className="border-yellow-300 bg-white text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Email
                    </>
                  )}
                </Button>

                <button
                  onClick={handleDismiss}
                  className="text-sm text-yellow-700 underline hover:text-yellow-800 dark:text-yellow-300 dark:hover:text-yellow-200"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 rounded p-1 text-yellow-600 hover:bg-yellow-100 dark:text-yellow-500 dark:hover:bg-yellow-900/50"
              aria-label="Dismiss notification"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </Alert>
      </div>
    </div>
  )
}

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { authRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/get-client-ip'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rate limit authentication attempts
  if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') {
    const ip = getClientIp(request)
    const result = await authRateLimit.check(10, ip) // 10 attempts per minute

    if (!result.success) {
      // Redirect to error page for better UX instead of returning JSON
      const errorUrl = new URL('/error/rate-limit', request.url)
      errorUrl.searchParams.set('retry', '60')
      errorUrl.searchParams.set('return', pathname)
      return NextResponse.redirect(errorUrl)
    }
  }

  // Protected routes
  const protectedRoutes = ['/dashboard', '/settings', '/profile']
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Auth routes
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.includes(pathname)

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
}
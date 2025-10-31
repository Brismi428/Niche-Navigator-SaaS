# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Niche Navigator** is a comprehensive Next.js 15+ SaaS accelerator built with modern web technologies. This foundation provides everything needed to quickly build and deploy SaaS applications with authentication, payments, analytics, and API management capabilities.

**Brand Identity:**
- **Name**: Niche Navigator
- **Logo**: "NN" on gradient background (primary to accent)
- **Domain**: nichenavigator.com (configured in constants)
- **Social**: @nichenavigator (GitHub, Twitter, LinkedIn, Discord)

## Technology Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Authentication**: Supabase Auth with JWT tokens
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Theming**: next-themes for dark/light mode support
- **Icons**: Lucide React
- **Package Manager**: npm

## Development Commands

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues automatically
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking

# Utilities
npm run clean           # Clean build artifacts
```

## Project Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication login page
│   ├── signup/            # User registration page
│   ├── forgot-password/   # Password reset request page
│   ├── reset-password/    # Password reset confirmation page
│   ├── dashboard/         # Protected dashboard page (requires auth)
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── auth/
│   │   └── callback/      # OAuth callback handler
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components (auto-generated)
│   ├── auth/              # Authentication components
│   │   ├── LoginForm.tsx          # Login form with validation
│   │   ├── SignupForm.tsx         # Registration form
│   │   ├── ForgotPasswordForm.tsx # Password reset request form
│   │   ├── ResetPasswordForm.tsx  # Password reset confirmation form
│   │   ├── UserMenu.tsx           # User dropdown menu in header
│   │   ├── LogoutButton.tsx       # Logout button component
│   │   ├── ProtectedRoute.tsx     # Server-side route protection
│   │   └── ClientProtectedRoute.tsx  # Client-side route protection
│   ├── layout/            # Layout components (Header, Footer, Navigation)
│   ├── features/          # Feature-specific components
│   │   └── landing/       # Landing page sections
│   └── common/            # Shared utility components
├── contexts/
│   ├── AuthContext.tsx       # Authentication context provider
│   └── NavigationContext.tsx # Navigation state management
├── lib/
│   ├── auth/
│   │   └── server.ts      # Server-side auth utilities
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   └── server.ts      # Server Supabase client
│   ├── utils.ts           # Utility functions (cn helper)
│   ├── constants.ts       # App configuration and constants
│   └── types.ts           # Shared TypeScript interfaces
├── styles/
│   └── globals.css        # Additional custom styles
├── types/
│   ├── auth.ts            # Authentication type definitions
│   ├── navigation.ts      # Navigation type definitions
│   └── subscription.ts    # Subscription/billing type definitions
└── middleware.ts          # Route protection middleware
```

### Component Architecture

- **Layout Components**: Responsive header with navigation, footer with links, mobile-friendly design
- **Authentication System**: Complete Supabase auth integration with login, signup, password reset, OAuth, user menu, and route protection
- **Landing Sections**: Hero section, features showcase, pricing preview with 3-tier structure
- **Content Pages**: Professional About and Contact pages with dummy content
- **Navigation System**: Hierarchical navigation with sidebar, breadcrumbs, and context management
- **UI Utilities**: Loading spinners, theme toggle, reusable components
- **Type System**: Comprehensive TypeScript definitions for auth, navigation, and subscriptions

### Styling System

- **Design Tokens**: Custom color palette with brand colors (blues/purples)
- **Dark Mode**: Automatic system detection with manual toggle
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Animation**: Custom animations for fade-in, slide-in effects
- **Component Variants**: shadcn/ui design system with consistent styling

## Configuration Files

- **tailwind.config.ts**: Extended with custom colors, animations, and brand tokens
- **prettier.config.js**: Code formatting with Tailwind class sorting
- **next.config.ts**: Production optimizations with security headers
- **components.json**: shadcn/ui configuration for consistent theming
- **middleware.ts**: Route protection and authentication middleware
- **.env.local.example**: Template for environment variables (includes Supabase config)

## Current Features

### Implemented
- Complete landing page with hero, features, and pricing sections
- Responsive navigation with mobile menu
- Dark/light mode theming
- About and Contact pages with professional content
- **Full Supabase authentication system**
  - JWT token handling with secure cookies
  - Login page with form validation and error handling
  - Signup page with user registration
  - Password reset flow (forgot password and reset password pages)
  - Google OAuth integration
  - Protected dashboard page
  - User menu with logout functionality
  - Route protection middleware
  - Server and client-side auth utilities
  - Real-time auth state synchronization
- TypeScript type definitions for auth and future features
- Component library setup with shadcn/ui
- Development workflow with linting and formatting

## Authentication System

### Architecture Overview
The authentication system uses Supabase Auth with JWT tokens and follows security best practices:

- **Client-side**: React Context (`AuthContext`) provides user state and auth methods
- **Server-side**: Utilities in `src/lib/auth/server.ts` for SSR and API routes
- **Route Protection**: Next.js middleware handles automatic redirects
- **Session Management**: Secure HTTP-only cookies with automatic refresh

### Important: Using Supabase Built-in Auth (Not Custom Tables)

**This application uses Supabase's built-in authentication system:**
- ✅ User data stored in Supabase's managed `auth.users` table (automatic)
- ✅ Authentication via `supabase.auth.*` API methods (not custom queries)
- ✅ JWT tokens managed by Supabase (automatic security)
- ✅ Password hashing, email verification, OAuth handled by Supabase
- ❌ NO custom user tables or manual user CRUD operations
- ❌ NO reinventing the wheel - leverage Supabase's managed service

**How it works:**
```typescript
// ✅ CORRECT - Using Supabase Auth API
await supabase.auth.getUser()        // Gets user from auth.users
await supabase.auth.signInWithPassword()
await supabase.auth.signUp()

// ❌ WRONG - Don't do this
await supabase.from('users').select()  // Don't create custom user tables
```

### Environment Variables Required
```bash
# Supabase Authentication (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-or-node-crypto

# Stripe (Optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Generate NEXTAUTH_SECRET:**
```bash
# Using Node.js (recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL
openssl rand -base64 32
```

### Page Protection Methods

This application provides 3 methods to protect pages requiring authentication. Choose the method that best fits your use case.

#### Method 1: Automatic Folder Protection (Recommended ⭐)

**When to use:** For any protected page (easiest and most efficient option)

**How it works:** Pages in specific folders are automatically protected by middleware before they even start loading.

**Currently protected folders:**
- `/dashboard` - All dashboard pages
- `/settings` - All settings pages
- `/profile` - All profile pages

**Configuration:** Edit `src/middleware.ts` line 47:
```typescript
const protectedRoutes = ['/dashboard', '/settings', '/profile']
```

**To add more protected folders:**
```typescript
// Example: Protect /admin and /billing folders
const protectedRoutes = ['/dashboard', '/settings', '/profile', '/admin', '/billing']
```

**Example usage:**
```
✅ Create: src/app/dashboard/analytics/page.tsx → Automatically protected
✅ Create: src/app/settings/billing/page.tsx → Automatically protected
❌ Create: src/app/about/page.tsx → Public (not in protected folders)
```

**Advantages:**
- No code needed in your page components
- Blocks access before page loads (most secure)
- Consistent protection across all pages in folder
- Easy to add/remove protected folders

---

#### Method 2: Server Component Protection

**When to use:** For pages outside protected folders that need authentication

**How it works:** Wraps page content with a server-side protection component that checks auth before rendering.

**File:** `src/components/auth/ProtectedRoute.tsx`

**Example:**
```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function MySpecialPage() {
  return (
    <ProtectedRoute>
      <h1>Protected Content</h1>
      <p>Only authenticated users see this</p>
    </ProtectedRoute>
  )
}
```

**What happens:**
- User not logged in → Redirects to `/login`
- User logged in → Renders page content

**Advantages:**
- Server-side check (fast and secure)
- Custom fallback loading state support
- Works with server components

---

#### Method 3: Client Component Protection

**When to use:** For interactive pages using React hooks (`useState`, `useEffect`, etc.)

**How it works:** Wraps page content with a client-side protection component that checks auth in the browser.

**File:** `src/components/auth/ClientProtectedRoute.tsx`

**Example:**
```typescript
'use client'

import { useState } from 'react'
import ClientProtectedRoute from '@/components/auth/ClientProtectedRoute'

export default function InteractivePage() {
  const [count, setCount] = useState(0)

  return (
    <ClientProtectedRoute>
      <h1>Interactive Protected Content</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </ClientProtectedRoute>
  )
}
```

**What happens:**
- Shows loading spinner while checking auth
- User not logged in → Redirects to `/login`
- User logged in → Renders interactive content

**Advantages:**
- Works with client components and React hooks
- Can show custom loading states
- Supports custom redirect URLs

---

#### Bonus: Mixed Public/Private Content (useAuth Hook)

**When to use:** When you want to show different content based on login status, but keep the page public.

**Note:** This is NOT a protection method - the page is still accessible to everyone, but displays different content based on auth status.

**Example:**
```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function MixedPage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome to our site!</h1>
      {user ? (
        <div>
          <p>Hello, {user.email}!</p>
          <a href="/dashboard">Go to Dashboard</a>
        </div>
      ) : (
        <a href="/login">Sign in to access your dashboard</a>
      )}
    </div>
  )
}
```

**Used in:** Header component to show different UI for logged in/out users

---

### Quick Decision Tree: Which Protection Method?

```
Need to protect a new page?
│
├─ Is it in /dashboard, /settings, or /profile folder?
│  └─ YES → Method 1: Do nothing! Already protected ✅
│
├─ Does the page use 'use client' or React hooks?
│  └─ YES → Method 3: Use <ClientProtectedRoute> ✅
│
└─ Is it a regular server component?
   └─ YES → Method 2: Use <ProtectedRoute> ✅
```

**Default recommendation:** Put protected pages in `/dashboard` folder (Method 1) whenever possible.

### Authentication Hooks and Utilities

**Client-side Hook:**
```typescript
import { useAuth } from '@/contexts/AuthContext'

const { user, loading, error, signIn, signOut } = useAuth()
```

**Server-side Utilities:**
```typescript
import { getUser, requireAuth } from '@/lib/auth/server'

// Get current user (returns null if not authenticated)
const user = await getUser()

// Require authentication (redirects to login if not authenticated)
const user = await requireAuth()
```

## Navigation System

### Overview
The project includes a comprehensive navigation system with hierarchical structure support, sidebar navigation, and breadcrumb trails. The navigation is designed to be flexible and configurable per page.

### Navigation Hierarchy Levels

The navigation system supports 4 levels of hierarchy:

1. **X Level (Header)**: Main navigation in the top header bar
2. **Y Level (Sidebar Primary)**: Main sections in the left sidebar (e.g., Analytics, Settings)  
3. **Z Level (Sidebar Secondary)**: Sub-sections nested under Y items (e.g., Reports, Users, Profile)
4. **W Level (Breadcrumb Only)**: Specific pages shown only in breadcrumbs

### Using the Navigation System

**Basic Page Setup:**
```typescript
'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { NavigationConfig } from '@/types/navigation';

const navigationConfig: NavigationConfig = {
  title: 'Page Title',
  sidebar: {
    enabled: true,
    section: 'SectionName',
    icon: 'Home', // Icon from Lucide React
  },
  breadcrumb: {
    path: ['Parent', 'Current Page'],
  },
};

export default function MyPage() {
  const pathname = usePathname();

  return (
    <MainLayout config={navigationConfig} pathname={pathname}>
      {/* Your page content */}
    </MainLayout>
  );
}
```

**Available Icons:**
- Home, BarChart3, Settings, Users, FileText, User

**Navigation Context:**
```typescript
import { useNavigation } from '@/contexts/NavigationContext';

const { 
  sidebarSections,     // Current sidebar structure
  sidebarOpen,         // Sidebar open/closed state
  toggleSidebar,       // Toggle sidebar function
  registerPage         // Register page in navigation
} = useNavigation();
```

### Components

**MainLayout**: Primary layout wrapper that includes sidebar and breadcrumbs
**Sidebar**: Collapsible left navigation with hierarchical menu support  
**Breadcrumbs**: Dynamic breadcrumb trail based on navigation config

### Layout Spacing

The navigation layout uses balanced spacing:
- **Left margin**: 48px total (24px + 24px padding) when sidebar is open
- **Right margin**: 48px padding for visual balance
- **Sidebar widths**: 256px (open) / 64px (collapsed)
- **Breadcrumb border**: Contained within content padding for consistency

## Development Guidelines

### Adding New Components
1. Follow shadcn/ui patterns for consistency
2. Use TypeScript interfaces from `src/types/auth.ts` for auth-related components
3. Implement responsive design with Tailwind classes
4. Add proper ARIA attributes for accessibility

### Styling Conventions
- Use custom CSS variables for brand colors
- Follow mobile-first responsive design
- Implement smooth transitions and animations
- Maintain consistent spacing with Tailwind utilities

### Type Safety
- All components must be properly typed
- Use existing type definitions from `src/types/`
- Extend types in `src/lib/types.ts` for shared interfaces
- Maintain strict TypeScript configuration

### Connecting to Services
1. Ensure all variables that are used to configure the app to external services use environment variables that can be set locally (`.env.local`) and also on Vercel
2. Follow the naming convention for environment variables:
   - Public variables (accessible in browser): `NEXT_PUBLIC_*`
   - Server-only variables: No prefix (e.g., `SUPABASE_SECRET_KEY`)
3. Always add new environment variables to `.env.local.example` with placeholder values
4. Document required environment variables in the relevant section of this file
5. Never commit actual credentials to the repository

## Future Extensions

The codebase structure supports adding these additional features:
- Stripe payment processing and subscription management

## Key Constants

Important configuration values are centralized in `src/lib/constants.ts`:
- App metadata and branding
- Subscription tier definitions
- Feature flags and permissions
- API configuration
- Validation rules and limits

This foundation provides a production-ready starting point for SaaS development with modern best practices and scalable architecture.

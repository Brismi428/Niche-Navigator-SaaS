# Niche Navigator

AI-powered content strategy and generation platform. Transform your audience insights into production-ready blog posts and YouTube scripts in minutes.

## 🎯 What is Niche Navigator?

Niche Navigator generates audience-targeted content strategies with production-ready output. Unlike generic AI tools that give you responses needing heavy editing, we deliver:

- **10 strategic content topics** tailored to your niche, demographics, and pain points
- **Complete 1,500-2,000 word blog posts** with HTML formatting, SEO optimization, and CTAs
- **Film-ready YouTube scripts** with timestamps, B-roll suggestions, and engagement hooks
- **Multi-platform content strategy** for blog, YouTube, LinkedIn, and Twitter/X

## ✨ Features

### Content Generation
- 🎯 **Audience-Targeted Strategy** - Niche-specific topics based on demographics and pain points
- 📝 **Production-Ready Blog Posts** - SEO-optimized, HTML-formatted, copy-and-publish content
- 🎬 **Film-Ready YouTube Scripts** - Complete scripts with timestamps and visual cues
- 💰 **Monetization Built-In** - Strategic CTAs, affiliate placements, and lead magnets
- 🌐 **Multi-Platform Strategy** - Platform-specific recommendations for maximum reach
- ✨ **Brand Voice Control** - Customize tone, complexity, and style

### Technical Stack
- 🚀 **Next.js 15+** with App Router and Turbopack
- 💎 **TypeScript** for type safety
- 🔐 **Supabase Auth** with JWT tokens and OAuth
- 🎨 **Tailwind CSS** with custom design system
- 🧩 **shadcn/ui** component library
- 🌙 **Dark/Light mode** with system detection
- 📱 **Responsive design** with mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Supabase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/niche-navigator.git
   cd niche-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.local.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.local.example .env.local
   ```

   Required environment variables:
   ```env
   # Supabase Authentication
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   SUPABASE_SECRET_KEY=your-secret-key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate-with-openssl-or-node-crypto
   ```

4. **Generate NEXTAUTH_SECRET**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting
npm run type-check      # TypeScript type checking

# Utilities
npm run clean           # Clean build artifacts
```

## 🏛️ Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── login/                 # Authentication login page
│   ├── signup/                # User registration page
│   ├── forgot-password/       # Password reset request
│   ├── reset-password/        # Password reset confirmation
│   ├── dashboard/             # Protected dashboard pages
│   ├── about/                 # About page
│   ├── contact/               # Contact page
│   ├── auth/callback/         # OAuth callback handler
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth/                  # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── UserMenu.tsx
│   ├── layout/                # Header, Footer, Navigation
│   ├── features/landing/      # Landing page sections
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── how-it-works-section.tsx
│   │   ├── pricing-preview.tsx
│   │   └── faq-section.tsx
│   └── common/                # Shared components
├── contexts/
│   ├── AuthContext.tsx        # Authentication context
│   └── NavigationContext.tsx  # Navigation state
├── lib/
│   ├── auth/server.ts         # Server-side auth utilities
│   ├── supabase/              # Supabase clients
│   ├── utils.ts               # Utility functions
│   ├── constants.ts           # App configuration
│   └── types.ts               # Shared TypeScript types
├── types/
│   ├── auth.ts                # Authentication types
│   └── navigation.ts          # Navigation types
└── middleware.ts              # Route protection middleware
```

## 🎨 Customization

### Branding
Update app configuration in `src/lib/constants.ts`:
```typescript
export const APP_CONFIG = {
  name: 'Niche Navigator - AI-Powered Content Strategy & Generation',
  description: 'Your custom description',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  email: 'hello@yourdomain.com',
  social: {
    github: 'https://github.com/yourorg',
    twitter: 'https://twitter.com/yourhandle',
    linkedin: 'https://linkedin.com/company/yourcompany',
  },
}
```

### Styling
- **Colors**: Modify `tailwind.config.ts` for custom brand colors
- **Components**: Extend shadcn/ui components in `src/components/ui/`
- **Global styles**: Add custom styles to `src/app/globals.css`

### Content
- **Landing page**: Edit components in `src/components/features/landing/`
- **Pricing tiers**: Update `src/components/features/landing/pricing-preview.tsx`
- **FAQ items**: Modify `src/components/features/landing/faq-section.tsx`
- **Navigation**: Update `src/components/layout/navigation.tsx`

## 🔐 Authentication

This application uses **Supabase's built-in authentication system**:
- User data stored in Supabase's managed `auth.users` table
- Authentication via `supabase.auth.*` API methods
- JWT tokens managed by Supabase automatically
- Password hashing, email verification, OAuth handled by Supabase

### Authentication Features
- ✅ Email/password login and registration
- ✅ Google OAuth integration
- ✅ Password reset flow
- ✅ Protected routes with middleware
- ✅ Server and client-side auth utilities
- ✅ Real-time auth state synchronization

### Route Protection

Three methods available:

1. **Automatic Folder Protection** (Recommended)
   - Pages in `/dashboard`, `/settings`, `/profile` are automatically protected
   - Configure in `src/middleware.ts`

2. **Server Component Protection**
   ```typescript
   import ProtectedRoute from '@/components/auth/ProtectedRoute'

   export default function MyPage() {
     return <ProtectedRoute>{/* content */}</ProtectedRoute>
   }
   ```

3. **Client Component Protection**
   ```typescript
   'use client'
   import ClientProtectedRoute from '@/components/auth/ClientProtectedRoute'

   export default function MyPage() {
     return <ClientProtectedRoute>{/* content */}</ClientProtectedRoute>
   }
   ```

## 🔧 Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Authentication**: Supabase Auth with JWT tokens
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Theming**: next-themes
- **Icons**: Lucide React
- **Development**: ESLint, Prettier, Turbopack

## 📦 Key Dependencies

```json
{
  "next": "15.5.6",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@supabase/supabase-js": "^2.x",
  "next-themes": "^0.4.6",
  "lucide-react": "^0.523.0"
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Add Environment Variables**
   In Vercel dashboard, add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
   - `NEXTAUTH_SECRET`

4. **Deploy**
   Vercel automatically deploys on every push to main

### Other Platforms
This project works with any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🗺️ Roadmap

### Phase 1: Core Platform ✅
- [x] Landing page with hero, features, pricing
- [x] Supabase authentication system
- [x] Protected routes and user management
- [x] Responsive design and dark mode
- [x] FAQ and "How It Works" sections

### Phase 2: Content Generation 🚧
- [ ] AI content strategy generator
- [ ] Blog post generation with SEO optimization
- [ ] YouTube script generator with timestamps
- [ ] Export to Google Docs and HTML
- [ ] Brand voice customization

### Phase 3: Advanced Features 📋
- [ ] Multi-platform content strategy
- [ ] Content calendar and scheduling
- [ ] Analytics and performance tracking
- [ ] Team collaboration and workspaces
- [ ] White-label branding

### Phase 4: Enterprise 💼
- [ ] Custom integrations
- [ ] Dedicated account management
- [ ] SLA guarantees
- [ ] Volume discounts
- [ ] API access

## 💡 Use Cases

- **Content Creators**: Generate blog posts and YouTube scripts tailored to your audience
- **Marketing Agencies**: Create content strategies for multiple clients with brand voice control
- **Solo Entrepreneurs**: Quickly produce SEO-optimized content without hiring writers
- **Course Creators**: Develop educational content with proper structure and engagement hooks
- **Affiliate Marketers**: Generate content with built-in monetization and CTAs

## 🛠️ Development

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Strict mode enabled

### Best Practices
- Server Components by default
- Client Components only when needed
- Type-safe API calls
- Error boundaries
- Loading states
- SEO optimization

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

- **Email**: hello@nichenavigator.ai
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/niche-navigator/issues)
- **Documentation**: Check CLAUDE.md for detailed development guidelines

---

Built with ❤️ using Next.js, TypeScript, Supabase, and Tailwind CSS

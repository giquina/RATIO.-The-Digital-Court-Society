# Architecture

Reference architecture for Ratio -- The Digital Court Society, a constitutional training ground for UK law students.

---

## System Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | Client-rendered SPA deployed to Vercel |
| Backend | Convex | 35+ tables, real-time queries, serverless mutations/actions |
| Styling | Tailwind CSS | Custom design system (navy/gold/burgundy palette) |
| Client State | Zustand | Auth, sidebar, follow, contribution, clerk stores |
| Animation | Framer Motion | Page transitions, micro-interactions |
| Auth | @convex-dev/auth | Password provider (no OAuth) |
| Payments | Stripe | Subscriptions, checkout, customer portal |
| Video | Daily.co | Live video sessions |
| Monitoring | Sentry | Error tracking (conditional on `SENTRY_AUTH_TOKEN`) |
| Analytics | GA4 | Usage analytics |

All app pages are `"use client"` -- Convex hooks require client components.

---

## Route Structure

### Auth Group -- `src/app/(auth)/`

Public/unauthenticated routes:

- `/login`
- `/register`
- `/onboarding`
- `/forgot-password`

### App Group -- `src/app/(app)/`

Authenticated routes (19+):

- `/home` -- Dashboard
- `/sessions` -- Practice sessions
- `/ai-practice` -- AI-powered moot practice
- `/community` -- Social feed
- `/profile` -- Advocate profile
- `/settings` -- Account settings
- `/rankings` -- Leaderboards
- `/chambers` -- Chamber (team) pages
- `/badges` -- Achievement system
- `/library` -- Resource library
- `/notifications` -- Activity notifications
- `/help` -- Help/support
- `/law-book` -- Legal reference (7 tables)
- `/parliament` -- Legislative simulation
- `/tribunal` -- Judicial simulation
- `/research` -- Legal research tools
- `/tools` -- Utility tools
- `/verify` -- Verification

### Public Pages

- `/` -- Landing page
- `/terms` -- Terms of service
- `/privacy` -- Privacy policy
- `/code-of-conduct` -- Code of conduct
- `/cookies` -- Cookie policy
- `/contact` -- Contact form

### API Routes -- `src/app/api/`

- `/api/og` -- Open Graph image generation
- `/api/legal/search` -- Legal research search proxy
- `/api/stripe/webhook` -- Stripe webhook handler
- `/api/stripe/checkout` -- Stripe checkout session creation
- `/api/stripe/portal` -- Stripe customer portal redirect

---

## Auth Flow

Authentication uses `@convex-dev/auth` with Password provider only.

```
User visits any (app) route
  --> (app)/layout-client.tsx checks useConvexAuth()
    --> Not authenticated? Redirect to /login
    --> Authenticated but no profile? Redirect to /onboarding
    --> Authenticated with profile? Render app shell

User visits any (auth) route
  --> (auth)/layout-client.tsx checks useConvexAuth()
    --> Already authenticated? Redirect to /home
      (exceptions: /onboarding, /register stay accessible)
    --> Not authenticated? Render auth page
```

The app shell renders `<Sidebar>` (desktop), `<BottomNav>` (mobile), and `<TheClerk>` (help overlay). Sidebar width is managed by `useSidebarStore`: collapsed = 72px, expanded = 240px.

---

## Demo Mode

When `NEXT_PUBLIC_CONVEX_URL` is unset, the app enters demo mode:

1. `ConvexProvider.tsx` wraps children in a plain `ConvexProvider` (no auth) with a dummy URL so `useQuery` returns `undefined` instead of crashing.
2. Layout clients skip auth checks and render the app shell directly.
3. `useDemoQuery` / `useDemoMutation` wrappers in `src/hooks/useDemoSafe.ts` pass `"skip"` to Convex hooks.
4. Pages fall back to hardcoded demo data or render `EmptyState` components.

---

## State Management

### Server State (Convex)

All persistent data lives in Convex: profiles, sessions, social graph (follows, activities, commendations), notifications, resources, badges, governance records, subscriptions, legal research results.

Convex schema (~35 tables) is organized into domains:

- **Users/Profiles** -- accounts, profiles, university affiliations
- **Social** -- follows, activities, commendations
- **Sessions** -- practice sessions, roles, participants, feedback
- **AI** -- AI session records, conversation history
- **Skills/Badges** -- skill tracking, badge definitions and awards
- **Resources** -- library content
- **Notifications** -- in-app notification queue
- **Law Book** -- 7 tables for legal reference content
- **Governance** -- legislative, executive, judicial simulation (12 tables)
- **Tournaments** -- competitive events
- **Video Sessions** -- Daily.co room management
- **Subscriptions** -- Stripe integration records
- **Legal Research** -- saved searches and results

### Client State (Zustand)

Stores in `src/stores/`:

| Store | Purpose |
|-------|---------|
| `authStore` | Current user auth state |
| `sidebarStore` | Sidebar collapsed/expanded state |
| `followStore` | Optimistic follow/unfollow UI |
| `contributionStore` | Contribution tracking |
| `clerkStore` | Help overlay visibility |

No Redux. No React Context for state management.

---

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-navy` | #0C1220 | Page background |
| `bg-navy-mid` | #131E30 | Section background |
| `bg-navy-card` | #182640 | Card background |
| `bg-navy-light` | #1E3050 | Elevated surfaces |
| `text-gold` / `bg-gold` | #C9A84C | Primary accent |
| `bg-gold-dim` | #C9A84C at 12% | Subtle gold highlights |
| `text-burgundy` / `bg-burgundy` | #6B2D3E | Secondary accent |
| `text-court-text` | #F2EDE6 | Primary text |
| `text-court-text-sec` | 60% opacity | Secondary text |
| `text-court-text-ter` | 30% opacity | Tertiary text |
| `border-court-border` | 6% white | Standard borders |
| `border-court-border-light` | 4% white | Subtle borders |

Chamber-specific colors: `chamber-grays`, `chamber-lincolns`, `chamber-inner`, `chamber-middle`.

### Typography

- **Headings**: Cormorant Garamond (`font-serif`), loaded via `next/font/google`
- **Body**: DM Sans (`font-sans`), loaded via `next/font/google`
- **Scale**: `text-court-xs` (10px) through `text-court-xl` (18px)

### Components

- Icons: Lucide React only (no emoji in UI)
- Border radius: `rounded-court` (14px) for cards, `rounded-xl` for buttons
- Tap targets: minimum 44px
- Shared UI components barrel-exported from `src/components/ui/index.tsx`

### Tone

Institutional, serious, calm. No exclamation marks. No hype. Premium equals restraint.

---

## Key Directories

```
convex/                        # Backend
  schema.ts                    #   Table definitions (35+ tables)
  auth.ts                      #   Auth configuration
  profiles.ts                  #   Profile queries/mutations
  sessions.ts                  #   Session management
  social.ts                    #   Follow, activity, commendation
  ai.ts                        #   LLM actions (Claude Sonnet, GPT-4o-mini fallback)
  aiSessions.ts                #   AI session records
  notifications.ts             #   Notification system
  seed.ts                      #   Badge and resource seeding
  research.ts                  #   Legal research
  videoSessions.ts             #   Daily.co integration
  daily.ts                     #   Daily.co room management
  subscriptions.ts             #   Stripe subscription records

src/app/                       # Next.js App Router
  (auth)/                      #   Public auth pages
  (app)/                       #   Authenticated app pages (19+ routes)
  api/                         #   API routes (OG images, Stripe, legal search)
  page.tsx                     #   Landing page
  layout.tsx                   #   Root layout (fonts, metadata, providers)

src/components/
  ui/                          #   Shared UI library (EmptyState, Skeleton, etc.)
    index.tsx                  #   Barrel export
  shared/                      #   Layout components
    Sidebar.tsx                #   Desktop navigation
    BottomNav.tsx              #   Mobile navigation
    ConvexProvider.tsx         #   Convex + auth wrapper (demo mode aware)
    SplashScreen.tsx           #   Per-session splash
    FirstVisitSplash.tsx       #   First-ever visit splash
    FeatureGate.tsx            #   Subscription feature gating
    Analytics.tsx              #   GA4 wrapper
    CookieConsent.tsx          #   Cookie banner
  landing/                     #   Landing page sections

src/stores/                    #   Zustand stores
  authStore.ts
  sidebarStore.ts
  followStore.ts
  contributionStore.ts
  clerkStore.ts

src/hooks/                     #   Custom React hooks
  useDemoSafe.ts               #   Demo mode query/mutation wrappers
  useSubscription.ts           #   Subscription status hook

src/lib/
  constants/app.ts             #   All app constants (chambers, ranks, universities, etc.)
  ai/system-prompts.ts         #   AI persona system prompts
  legal-api/                   #   Case law, legislation, parliament, OSCOLA APIs
  hooks/                       #   Additional custom hooks
  utils/toast.ts               #   Sonner toast helper

public/                        #   Static assets, icons, manifest
```

---

## Environment Variables

See `.env.example` for the full list.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes (demo mode without) | Convex deployment URL |
| AI API keys | No | Claude/OpenAI -- falls back to hardcoded responses |
| `NEXT_PUBLIC_GA4_ID` | No | Google Analytics 4 |
| `SENTRY_AUTH_TOKEN` | No | Sentry error tracking (build wrapping is conditional) |
| Stripe keys | No | Subscription billing |
| Daily.co key | No | Video session rooms |

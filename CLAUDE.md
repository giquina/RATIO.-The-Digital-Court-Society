# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Identity

Ratio is a constitutional training ground for UK law students. Built with Next.js 14 (App Router) + Convex + Tailwind CSS + Zustand + Framer Motion + Lucide React. Deployed to Vercel at ratiothedigitalcourtsociety.com.

## Commands

```bash
# Development — runs Next.js frontend + Convex backend in parallel
npm run dev

# Run frontend or backend individually
npm run dev:frontend    # next dev (port 3000)
npm run dev:backend     # convex dev (watches schema, deploys functions)

# Build & lint
npm run build           # next build — use to verify before pushing
npm run lint            # next lint

# Convex CLI
npx convex dev          # start backend dev server + sync schema
npx convex deploy       # deploy to production
npx convex run seed:run # seed badges + starter resources

# No test framework is configured yet
```

## Architecture

### Route Groups & Auth Flow

Two route groups under `src/app/`:
- `(auth)/` — login, register, onboarding. `layout-client.tsx` redirects already-authenticated users to `/home` (except `/onboarding` and `/register`).
- `(app)/` — all authenticated pages (19 routes). `layout-client.tsx` checks `useConvexAuth()` + `api.users.hasProfile`; redirects unauthenticated → `/login`, no profile → `/onboarding`.

The `(app)` shell renders `<Sidebar>` (desktop), `<BottomNav>` (mobile), and `<TheClerk>` (help overlay). Sidebar width is managed by `useSidebarStore` (Zustand): collapsed = 72px, expanded = 240px. Main content uses `md:ml-[72px]` / `lg:ml-[240px]`.

### Demo Mode

When `NEXT_PUBLIC_CONVEX_URL` is unset, the app enters demo mode:
- `ConvexProvider.tsx` wraps children in plain `ConvexProvider` (no auth) with a dummy URL so `useQuery` returns `undefined` instead of crashing.
- Layout clients skip auth checks and render the app shell directly.
- Pages should handle `undefined` query results gracefully (show EmptyState or hardcoded data).

### Convex Backend

Schema has ~35 tables in `convex/schema.ts`, organized into: Users/Profiles, Social (follows, activities, commendations), Sessions + Roles + Participants, Feedback, AI Sessions, Skills/Badges, Resources, Notifications, Law Book (7 tables), Governance (legislative, executive, judicial — 12 tables), Tournaments, Video Sessions (Daily.co), Subscriptions, Legal Research.

Auth uses `@convex-dev/auth` with Password provider only (`convex/auth.ts`). No OAuth yet.

Key backend files: `profiles.ts`, `social.ts`, `sessions.ts`, `aiSessions.ts`, `ai.ts` (LLM actions — Claude Sonnet with GPT-4o-mini fallback), `notifications.ts`, `seed.ts`, `users.ts`, `sidebar.ts`, `research.ts`, `videoSessions.ts`, `daily.ts`.

### Frontend Patterns

- All pages are `"use client"` — no server components for app pages (Convex hooks require client)
- Path alias: `@/*` → `./src/*`
- Shared UI components barrel-exported from `src/components/ui/index.tsx` — includes EmptyState, Skeleton variants, FollowButton, CommendButton
- Shared layout components in `src/components/shared/` — Sidebar, BottomNav, TheClerk, ConvexProvider, Analytics, CookieConsent, SplashScreen, FirstVisitSplash, FeatureGate
- Zustand stores in `src/stores/` — authStore, sidebarStore, followStore, contributionStore, clerkStore
- Constants in `src/lib/constants/app.ts` — chambers, ranks, session types, law modules, 142 UK universities, badge definitions, AI personas, feedback dimensions
- AI system prompts in `src/lib/ai/system-prompts.ts`
- Legal research APIs in `src/lib/legal-api/` — case law, legislation, parliament, OSCOLA formatting, unified search
- Custom hooks in `src/hooks/` and `src/lib/hooks/`
- Toast notifications via `sonner` (helper: `src/lib/utils/toast.ts`)

### Splash Screens

Two distinct splash mechanisms:
- `FirstVisitSplash` — localStorage-based, once ever, landing page only
- `SplashScreen` — sessionStorage-based, once per session, wraps the authenticated app shell

### Environment Variables

See `.env.example`. Required: `NEXT_PUBLIC_CONVEX_URL`. Optional: AI keys (app falls back to hardcoded responses), GA4 ID, Sentry DSN/token, Stripe keys, Daily.co key.

Sentry wrapping in `next.config.js` is conditional on `SENTRY_AUTH_TOKEN` being set — build won't fail without it.

## Design System

- **Navy palette**: `bg-navy` (#0C1220), `bg-navy-mid` (#131E30), `bg-navy-card` (#182640), `bg-navy-light` (#1E3050)
- **Gold**: `text-gold` / `bg-gold` (#C9A84C), `bg-gold-dim` (12% opacity)
- **Burgundy**: `text-burgundy` / `bg-burgundy` (#6B2D3E)
- **Chamber colors**: `chamber-grays`, `chamber-lincolns`, `chamber-inner`, `chamber-middle`
- **Court text**: `text-court-text` (#F2EDE6), `text-court-text-sec` (60%), `text-court-text-ter` (30%)
- **Court borders**: `border-court-border` (6% white), `border-court-border-light` (4% white)
- **Font sizes**: `text-court-xs` through `text-court-xl` (10px–18px) — prefer these over arbitrary values
- **Fonts**: `font-serif` (Cormorant Garamond for headings), `font-sans` (DM Sans for body). Loaded via `next/font/google` CSS variables.
- **Border radius**: `rounded-court` (14px) for cards, `rounded-xl` for buttons
- **Icons**: Lucide React only — never emoji in UI
- **Tone**: Institutional, serious, calm. No exclamation marks. No hype. Premium = restraint.

## Terminology

- Users are "Advocates" (not users, members, or subscribers)
- "Follow" (not subscribe, connect, or add)
- "Chamber" (not team, group, or house)
- "Session" (not match, game, or event)
- CTA language: "Join as an Advocate", "Start Practice", "Explore the Law Book"

## Simplification Rules

- One primary action per screen
- Max 3 interactive elements visible without scroll on mobile
- Minimum 44px tap targets
- No hover-only behaviors
- Every screen must breathe (visible padding, not wall-to-wall content)

## Tracking Files

- Always read PLAN.md, TASK.md, SUGGESTIONS.md, and LOGS.md at session start
- Update TASK.md after completing each task
- Update PLAN.md after completing a day/phase
- Add new ideas to SUGGESTIONS.md rather than losing them
- Append to LOGS.md at end of every session with: date, what was done, decisions, issues
- Keep TASK.md as the single source of truth for current work

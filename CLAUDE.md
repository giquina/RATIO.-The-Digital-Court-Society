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
- `(auth)/` — login, register, onboarding, verify, forgot-password, reset-password. `layout-client.tsx` redirects already-authenticated users to `/home` (except `/onboarding` and `/register`).
- `(app)/` — 19 authenticated routes: home, sessions, society, moot-court, library, law-book, profile, notifications, settings, rankings, chambers, badges, research, parliament, tribunal, portfolio, tools, about, help. `layout-client.tsx` checks `useConvexAuth()` + `anyApi.users.hasProfile`; redirects unauthenticated → `/login`, no profile → `/onboarding`.

The `(app)` shell renders `<Sidebar>` (desktop), `<MobileHeader>` + `<BottomNav>` (mobile, 4 tabs: Home, Sessions, Law Book, Community), and `<TheClerk>` (help overlay). Sidebar width is managed by `useSidebarStore` (Zustand): collapsed = 72px, expanded = 240px. Main content uses `md:ml-[72px]` / `lg:ml-[240px]`.

### Demo Mode

When `NEXT_PUBLIC_CONVEX_URL` is unset, the app enters demo mode:
- `ConvexProvider.tsx` wraps children in plain `ConvexProvider` (no auth) with a dummy URL so `useQuery` returns `undefined` instead of crashing.
- Layout clients skip auth checks and render the app shell directly.
- Pages should handle `undefined` query results gracefully (show EmptyState or hardcoded data).
- Demo credentials banner auto-shows on localhost and Vercel preview deployments. Production requires `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true`.

### Convex Backend

Schema in `convex/schema.ts` has ~40 tables organized into: Users/Profiles, Social (follows, activities, commendations), Sessions + Roles + Participants, Feedback, AI Sessions, Skills/Badges, Resources, Notifications, Law Book (7 tables), Governance (legislative, executive, judicial — 12 tables), Tournaments, Video Sessions (Daily.co), Subscriptions, Legal Research, Referrals (3 tables).

Auth uses `@convex-dev/auth` with Password provider only (`convex/auth.ts`). No OAuth yet.

Key backend files: `profiles.ts`, `social.ts`, `sessions.ts`, `aiSessions.ts`, `ai.ts` (LLM actions — Claude Sonnet with GPT-4o-mini fallback), `notifications.ts`, `seed.ts`, `users.ts`, `sidebar.ts`, `research.ts`, `videoSessions.ts`, `daily.ts`, `referrals.ts`, `subscriptions.ts`, `badges_queries.ts`, `resources_queries.ts`.

### Frontend Patterns

- All pages are `"use client"` — no server components for app pages (Convex hooks require client)
- Path alias: `@/*` → `./src/*`
- `cn()` utility in `src/lib/utils/helpers.ts` uses clsx + tailwind-merge — always use this for conditional class names
- `DynamicIcon` in `src/components/ui/index.tsx` maps string icon names (from constants/seed data) to Lucide components. When adding new icons referenced by name, add them to `ICON_MAP`.
- Shared UI components barrel-exported from `src/components/ui/index.tsx` — includes Avatar, DynamicIcon, EmptyState, Skeleton variants, FollowButton, CommendButton, Tooltip
- Shared layout components in `src/components/shared/` — Sidebar, BottomNav, MobileHeader, TheClerk, ConvexProvider, Analytics, CookieConsent, SplashScreen, FirstVisitSplash, FeatureGate, DemoCredentialsBanner
- Zustand stores in `src/stores/` — authStore, sidebarStore, followStore, contributionStore, clerkStore
- Constants in `src/lib/constants/app.ts` — chambers, ranks, session types, law modules, 142 UK universities, badge definitions, AI personas, feedback dimensions
- Custom hooks: `useDemoSafe` (safe Convex mutations in demo mode), `useSubscription`, `useSpeechRecognition`, `useNotifications` in `src/hooks/`; `useSidebarCounts` in `src/lib/hooks/`
- Toast notifications via `sonner` (helper: `src/lib/utils/toast.ts`)
- AI system prompts in `src/lib/ai/system-prompts.ts`
- Legal research APIs in `src/lib/legal-api/` — case law, legislation, parliament, OSCOLA formatting, unified search

### Cross-Module Queries

The `(app)` layout uses `anyApi` from `convex/server` to call `api.users.hasProfile` without a direct import. This is the pattern for querying Convex functions from layout files where direct `api` imports may cause circular issues.

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
- **Max widths**: `max-w-content-narrow` (672px), `max-w-content-medium` (1024px), `max-w-content-wide` (1280px)
- **Icons**: Lucide React only — never emoji in UI
- **Tone**: Institutional, serious, calm. No exclamation marks. No hype. Premium = restraint.

## Positioning & Copy

RATIO is a **legal institution**, not a startup. All copy, roles, features, and marketing must be law-focused by default unless explicitly told otherwise.

### Law-First Principle
- Lead with law, not tech. "Constitutional advocacy platform" not "student-built legal tech platform."
- Every feature should be described in terms of what it does for legal training — moot courts, case research, oral advocacy, courtroom simulation.
- Avoid startup language: "growth hacking", "funnels", "conversion", "engagement metrics." Use legal language: "advocacy", "moot preparation", "case law", "courtroom practice."
- When describing the platform: "AI judges, moot courts, national rankings, legal research" — that order.

### Careers & Roles
Job titles and descriptions must sound like legal work, not generic startup gigs. A law student reading a role should immediately see career relevance to pupillage, training contracts, or legal practice.

| Never use | Use instead |
|---|---|
| Head of Growth & University Partnerships | Law Society Outreach & Partnerships |
| Content & Moot Scenario Lead | Case Research & Moot Scenario Writer |
| Community & Social Media Manager | Advocacy Community Lead |
| Junior Full-Stack Developer | Legal Tech Developer |
| UX Researcher & Product Tester | Legal UX Researcher |
| Marketing & Design Apprentice | Legal Communications & Design |

Role descriptions should reference: case law research, moot problems, skeleton arguments, authorities bundles, courtroom sessions, advocacy techniques, law society partnerships, legal research tools. Not: social media, funnels, bug fixes, marketing materials.

### Marketing & Promo Copy
- WhatsApp/social copy should lead with "RATIO is hiring law students" or "constitutional advocacy platform" — not "we're a startup."
- Always mention the legal substance of the work: "case research, moot writing, legal tech" — not just "paid roles."
- "Not coffee runs" is the benchmark — every role must pass the test of being genuinely substantive legal work.

### Voice & Tone (Promo Videos)
- Narrator: **Charlie** voice (articulate, barrister-like). Never Daniel (sounds like a nature documentary).
- Judge: **George** voice (authoritative).
- Full video production details in `PROMO-VIDEO-PLAN.md`.

## Terminology

- Users are "Advocates" (not users, members, or subscribers)
- "Follow" (not subscribe, connect, or add)
- "Chamber" (not team, group, or house)
- "Session" (not match, game, or event)
- "Commend" (not like, upvote, or react)
- "Moot Court" (not AI Practice, AI Judge, or practice mode)
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

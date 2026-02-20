# RATIO — Task Tracker
Last updated: 2026-02-20

## Current Phase: Day 2 — Typography + Fonts + Spacing

### Completed (Day 1 — Critical Fixes)
- [x] Remove `max-w-lg` root constraint — `src/app/layout.tsx` — 2026-02-20
- [x] Fix landing hero SSR with Framer Motion — `src/app/page.tsx` — 2026-02-20
- [x] Make social links functional (span → a tags) — `src/app/page.tsx` — 2026-02-20
- [x] Replace hardcoded #C9A84C with text-gold — `src/app/(app)/home/page.tsx` — 2026-02-20
- [x] Wire "View all" buttons with router.push — `src/app/(app)/home/page.tsx` — 2026-02-20
- [x] Convert search bar divs to real inputs — `src/app/(app)/library/page.tsx` — 2026-02-20
- [x] Wire "Create Session" form handler — `src/app/(app)/sessions/create/page.tsx` — 2026-02-20
- [x] Fix notifications mark all read + clickable — `src/app/(app)/notifications/page.tsx` — 2026-02-20
- [x] Fix onboarding router.push — `src/app/(auth)/onboarding/page.tsx` — 2026-02-20
- [x] Add md:hidden to BottomNav — `src/components/shared/BottomNav.tsx` — 2026-02-20
- [x] Wire sessions tab routing + past sessions — `src/app/(app)/sessions/page.tsx` — 2026-02-20

### In Progress
- [ ] Wire login/register form handlers + validation — `src/app/(auth)/login/page.tsx`, `register/page.tsx`

### Pending (Day 2)
- [ ] Define 6 semantic font sizes in Tailwind config — `tailwind.config.ts`
- [ ] Replace @import font loading with next/font/google — `src/app/layout.tsx`, `globals.css`
- [ ] Standardize spacing across all pages
- [ ] Replace arbitrary text-[Xpx] with semantic sizes across 13 files

### Pending (Day 3)
- [ ] Replace 88 emoji instances with Lucide SVGs across 13 files
- [ ] Create centralized icon mapping — `src/lib/constants/icons.tsx`

### Pending (Day 4)
- [ ] Deploy EmptyState to 6 pages
- [ ] Create Skeleton components — `src/components/ui/Skeleton.tsx`
- [ ] Reduce CTAs per screen for mobile breathing room

### Pending (Day 5)
- [ ] Set up Convex Auth with Google OAuth + email/password
- [ ] Create route protection middleware — `src/middleware.ts`
- [ ] Wire login/register to Convex Auth

### Pending (Day 6)
- [ ] Connect home page to Convex queries
- [ ] Connect profile page to Convex queries
- [ ] Connect notifications page to Convex queries

### Pending (Day 7)
- [ ] Connect sessions CRUD to Convex
- [ ] Enhance AI Judge with prompt caching + streaming

### Pending (Day 8)
- [ ] Create followStore — `src/stores/followStore.ts`
- [ ] Create FollowButton component — `src/components/ui/FollowButton.tsx`
- [ ] Add community status bar to home page
- [ ] Add discovery section to community page

### Pending (Day 9)
- [ ] Add 7 Law Book tables to Convex schema
- [ ] Create Law Book module index page — `/law-book`
- [ ] Create Law Book topic reading view — `/law-book/[module]/[topic]`

### Pending (Day 10)
- [ ] Create Desktop Sidebar — `src/components/shared/Sidebar.tsx`
- [ ] Restructure app layout for sidebar + content
- [ ] Add responsive grids to all pages
- [ ] Add hover states for desktop

### Pending (Day 11)
- [ ] Create Settings page — `/settings`
- [ ] Create Rankings page — `/rankings`
- [ ] Create Chambers hub — `/chambers`
- [ ] Create AI Tools hub — `/tools`
- [ ] Create About page — `/about`

### Pending (Day 12)
- [ ] Create Case Brief Generator — `/tools/case-brief`
- [ ] Create Argument Builder — `/tools/argument-builder`
- [ ] Create AI router — `convex/ai/router.ts`

### Pending (Day 13)
- [ ] Refactor landing page into 12 section components
- [ ] Update brand copy (headline, subtext, CTAs)
- [ ] Create `src/components/landing/` directory

### Pending (Day 14)
- [ ] Create Governance schema (22 tables)
- [ ] Create Parliament MVP (motions + voting)
- [ ] Set up student verification (.ac.uk emails)
- [ ] Replace CI/CD placeholder with real pipeline
- [ ] Generate PWA icons
- [ ] Add per-page SEO metadata
- [ ] Final QA pass

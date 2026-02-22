# RATIO — Task Tracker
Last updated: 2026-02-22

## Current Phase: Day 5+ — Backend Wiring & Feature Build

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

### Completed (Day 2 — Typography + Fonts + Spacing)
- [x] Define 6 semantic font sizes in Tailwind config — `tailwind.config.ts` — 2026-02-20
- [x] Replace @import font loading with next/font/google — `src/app/layout.tsx` — 2026-02-20
- [x] Standardize spacing across all pages — 2026-02-20
- [x] Replace 74 arbitrary text-[Xpx] with semantic sizes across 13 files — 2026-02-22

### Completed (Day 3 — Emoji → Lucide Icons)
- [x] Replace ~50 emoji instances with Lucide SVGs across 5 UI files — 2026-02-22
  - MootRoom.tsx: 8 emoji → Mic, MicOff, Video, CameraOff, MonitorUp, MessageSquare, PhoneOff, X
  - AIFeedback.tsx: 3 emoji → ChevronUp
  - PreSessionLobby.tsx: 10 emoji → Scale, Clock, Calendar, Bell, Video, Mic, Globe, Check
  - PostSessionRating.tsx: 7 emoji → Scale, BookOpen, GraduationCap, Star, Bot, Check
  - tournaments/page.tsx: 7 emoji → Users, Trophy, Calendar, Scale

### Completed (Day 4 — Empty States + Skeletons + Mobile)
- [x] Deploy EmptyState to 7 pages — 2026-02-20
- [x] Create 6 Skeleton variants — `src/components/ui/index.tsx` — 2026-02-20
- [x] Mobile breathing room improvements across 16+ files — 2026-02-20

### Completed (Production Infrastructure — 2026-02-21)
- [x] Domain purchased and configured: ratiothedigitalcourtsociety.com
- [x] Vercel deployment live with auto-deploy from main
- [x] GoDaddy DNS: A record → 76.76.21.21, CNAME www → cname.vercel-dns.com
- [x] Full SEO metadata in root layout (OG, Twitter, robots, viewport)
- [x] Dynamic sitemap (14 routes) — `src/app/sitemap.ts`
- [x] robots.txt generation — `src/app/robots.ts`
- [x] Google Analytics 4 (G-NG49LD1FXR) with GDPR cookie consent gating
- [x] Sentry error tracking (client/server/edge configs)
- [x] Security headers (HSTS, X-Frame-Options, CSP, Permissions-Policy)
- [x] 404 page with institutional copy — `src/app/not-found.tsx`
- [x] Error boundary pages — `src/app/error.tsx`, `src/app/global-error.tsx`
- [x] Cookie consent banner (GDPR-compliant) — `src/components/shared/CookieConsent.tsx`
- [x] PWA manifest updated — `public/manifest.json`
- [x] Google Search Console verified, sitemap submitted

### Completed (Auth + Route Protection)
- [x] Convex Auth with @convex-dev/auth — already configured
- [x] Route protection via layout-client.tsx pattern with `force-dynamic`
- [x] Auth layout: redirect authenticated users to /home
- [x] App layout: redirect unauthenticated users to /login, no-profile to /onboarding

### Completed (Backend Wiring)
- [x] Home page connected to Convex (myProfile, activity feed)
- [x] Profile page connected to Convex (myProfile, updateProfile mutation)
- [x] Community page connected to Convex (leaderboard, following, toggleFollow)
- [x] Desktop Sidebar with Convex profile + notification counts
- [x] FollowButton component in `src/components/ui/`
- [x] CommendButton component in `src/components/ui/`

### Pending
- [ ] Connect sessions CRUD fully to Convex
- [ ] Enhance AI Judge with prompt caching + streaming
- [ ] Add 7 Law Book tables to Convex schema
- [ ] Create Law Book module index page — `/law-book`
- [ ] Create Law Book topic reading view — `/law-book/[module]/[topic]`
- [ ] Create Settings page — `/settings`
- [ ] Create Rankings page — `/rankings`
- [ ] Create Chambers hub — `/chambers`
- [ ] Create AI Tools hub — `/tools`
- [ ] Create Case Brief Generator — `/tools/case-brief`
- [ ] Create Argument Builder — `/tools/argument-builder`
- [ ] Create Governance schema
- [ ] Create Parliament MVP (motions + voting)
- [ ] Set up student verification (.ac.uk emails)
- [ ] Generate PWA icons / favicon set
- [ ] Create OG image (public/og-image.png)
- [ ] Add Sentry auth token to Vercel env vars

# RATIO — Session Logs

## Session 1 — 2026-02-20
**Phase**: Day 1 — Critical Fixes
**Duration**: ~2 hours

### What Was Done
- Removed `max-w-lg` root constraint from `src/app/layout.tsx` (was capping app at 512px)
- Added `md:hidden` to BottomNav for desktop responsiveness prep
- Fixed landing page SSR: replaced CSS `animate-slide-up` with Framer Motion for server-safe animations
- Replaced emoji Scale icon with Lucide `<Scale>` component on landing page
- Converted social link `<span>` elements to proper `<a>` tags with URLs
- Fixed onboarding: `window.location.href` → `router.push("/home")`
- Wired home page: replaced inline `style={{color:'#C9A84C'}}` with `text-gold`, wired "View all" button, converted spans to buttons
- Fixed library: replaced fake div search bar with real `<input>` + filtering logic
- Fixed notifications: added mark all read state, made notifications clickable with navigation
- Fixed sessions: added Create tab routing, past sessions display, role claiming state
- Fixed sessions/create: added form validation and submit handler with loading state

### Decisions Made
- Chose Framer Motion over CSS keyframes for SSR-safe animations
- Kept conic-gradient hardcoded #C9A84C (required for dynamic CSS, cannot use Tailwind class)
- Used local state for notification management (will replace with Convex mutations later)

### Issues Encountered
- All pages use hardcoded demo data — no Convex queries connected yet (deferred to Day 6-7)
- ConvexProvider falls back to "demo mode" without NEXT_PUBLIC_CONVEX_URL
- Login/register form handlers still need wiring (deferred to Day 5 with Convex Auth)

### Next Session Should
- Start with Day 2: Typography consolidation + Font loading + Spacing
- Login/register forms will be properly wired on Day 5 when Convex Auth is set up

---

## Session 2 — 2026-02-20
**Phase**: Planning — Sections 9-13 additions
**Duration**: ~1 hour

### What Was Done
- Created comprehensive plan for Simplification & Focus Philosophy (Section 9)
- Created AI API Integration Strategy (Section 10) — multi-provider architecture, 7 end-user features, 3 dev tools, public API, cost projections
- Created Official Law Book feature spec (Section 11) — 7 new Convex tables, IRAC content structure, editorial governance
- Created Additional Pages plan (Section 12) — 10 new pages, updated navigation
- Created Project Tracking Files plan (Section 13) — CLAUDE.md, PLAN.md, TASK.md, SUGGESTIONS.md, LOGS.md
- Updated execution roadmap to 14 revised days

### Decisions Made
- Chose CLAUDE.md instruction approach over shell hooks for tracking file auto-update (simpler, equally effective)
- Replaced Library tab with Law Book in bottom nav
- Prioritized simplification philosophy: one primary action per screen
- Multi-provider AI strategy: Claude for reasoning, Whisper for speech, Gemini for translation

### Issues Encountered
- None

### Next Session Should
- Create all tracking files (CLAUDE.md, PLAN.md, TASK.md, SUGGESTIONS.md, LOGS.md)
- Begin Day 2 implementation: Typography + Fonts + Spacing

---

## Session 3 — 2026-02-22
**Phase**: Commercial Readiness — Wave 1 (Phases 1.0-1.2)
**Duration**: ~1.5 hours

### What Was Done
- Created and approved comprehensive strategic launch plan (Wave 1 free launch + Wave 2 monetisation)
- **Phase 1.0 (Credibility Fixes):**
  - Fixed privacy policy: "Clerk" → "Convex Auth", "Vercel Analytics" → "Google Analytics 4"
  - Wired settings legal links (Terms, Privacy, Code of Conduct) with href + onClick navigation
  - Fixed 20 badge icons in seed.ts: emoji → Lucide icon names (Scale, Flame, Trophy, Crown, etc.)
  - Updated contact email from support@ratio.law to mgiqui01@student.bbk.ac.uk across 4 files (privacy, terms, code-of-conduct, help)
- **Phase 1.1 (Landing Conversion):**
  - Replaced waitlist email form with "Join as an Advocate" registration CTA + "Sign In" secondary CTA
  - Removed "Launching March 2026" text
  - Changed social proof pill: "on the waitlist" → "142 UK universities supported"
  - Wired pricing section CTAs to /register with plan query params
  - Cleaned up page.tsx: removed email/submitted/count state management
- **Phase 1.2 (Splash Screen):**
  - Created SplashScreen.tsx with Framer Motion: particle dust, glow, Scale icon, typewriter "RATIO." text, tagline fade
  - Session-scoped (sessionStorage), respects prefers-reduced-motion
  - Integrated into layout-client.tsx wrapping both demo and Convex modes
- **Phase 2.3 (Contact Page):**
  - Created /contact page with email, in-app help, and response time cards
  - Added FAQ quick links and university partnership section
  - Added Contact link to footer Legal section

### Decisions Made
- Two-wave launch strategy: Wave 1 = free launch (fix credibility + splash), Wave 2 = Stripe + gating
- Contact email set to mgiqui01@student.bbk.ac.uk (temporary until official domain email configured)
- Social media links kept as-is (accounts may need manual creation)
- Splash shows once per browser session (sessionStorage), not per visit (localStorage)

### Issues Encountered
- None — all changes pass TypeScript type check

### Next Session Should
- Create demo account seed function
- Begin Stripe payment infrastructure (Phase 2.0)
- Wire demo data pages to Convex (Rankings, Chambers, Badges, Library)
- Generate OG image and PWA icons

---

## Session 4 — 2026-02-22
**Phase**: GDPR Compliance + UX Polish
**Duration**: ~1 hour

### What Was Done
- **Track 1 (Cookie Consent Fix):**
  - Removed `window.location.reload()` from CookieConsent.tsx handleAccept
  - Replaced with `window.dispatchEvent(new Event("ratio-consent-granted"))` custom event
  - Rewrote Analytics.tsx to be state-driven: useState + useEffect with event listener
  - GA4 now loads dynamically on consent without any page refresh
- **Track 2 (First-Visit Splash):**
  - Created `FirstVisitSplash.tsx` — same animation design as SplashScreen (particles, glow, Scale icon, typewriter RATIO.)
  - Uses localStorage key `ratio_first_visit_seen` (persistent, once ever) vs sessionStorage for post-login splash
  - 2800ms duration, respects prefers-reduced-motion
  - Wrapped landing page content in `page.tsx` with `<FirstVisitSplash>`
- **Track 3 (Cookie Policy + Footer):**
  - Created `/cookies` page — 7 sections: What Are Cookies, How We Use, Cookie Categories (Strictly Necessary / Functional / Analytics), Third-Party Services, Managing Preferences, Changes, Contact
  - Added Cookie Policy link as 2nd item in footer Legal section
- **Verification:**
  - Production build passes cleanly (all routes compiled)
  - Preview verified: splash animation plays on first visit, cookie consent banner appears after 1.5s delay, Accept dismisses banner without page reload, /cookies page renders with correct styling, footer Cookie Policy link navigates correctly
  - No console errors

### Decisions Made
- Two splash mechanisms: FirstVisitSplash (localStorage, once ever, landing only) vs SplashScreen (sessionStorage, once per session, post-login)
- Custom event pattern for CookieConsent → Analytics cross-component communication (avoids React context overhead)
- Cookie Policy is a Server Component (no "use client") for static generation

### Issues Encountered
- Stale `.next` cache from previous session caused `MODULE_NOT_FOUND` errors — resolved by deleting `.next` and restarting dev server
- Dev server needed full restart after cache corruption (HMR insufficient)

### Next Session Should
- Address broader upgrade plan: admin dashboard, navigation decisions, PWA install, onboarding flow
- Create demo account seed function
- Begin Stripe payment infrastructure
- Wire remaining demo data pages to Convex

---

## Session 5 — 2026-02-24
**Phase**: Mobile UX Overhaul + Route Migration
**Duration**: ~3 hours

### What Was Done

**AI Practice Session Screen (complete overhaul):**
- Real photo judge avatar with gold ring pulse animation + expression-aware status dots
- Collapsible avatar (56px → 28px after first message, frees ~100px screen space)
- Bigger input area (2 lines default, auto-grows to 120px)
- Smart quick phrases (hidden while typing, collapsed to single row after 2+ messages)
- Session toolbar cleanup (merged exchange counter + timer into compact pill)
- Chat messages anchored to bottom (like iMessage) with spacer trick

**Fullscreen Session Mode:**
- Created zustand sessionStore (isSessionActive state)
- Layout hides MobileHeader during active sessions
- Full viewport height (100dvh) for session screen

**LIVE Indicator on Bottom Nav:**
- AI Practice tab turns red with pulsing dot during active session
- Label changes "AI Practice" → "LIVE"

**Session Dock (contextual bottom nav):**
- Replaces regular bottom nav during sessions with 5 tools:
  - Brief (case summary), Cases (authorities with tap-to-copy), Hints (AI coaching),
    Notes (scratchpad), Session (timer, TTS, transcript, end session)
- Bottom sheet slides up from dock, chat visible behind backdrop
- Mode-aware hints (different tips for Judge/Mentor/Examiner/Opponent sessions)

**Bug Fix — Chat Scroll:**
- `justify-end` on scroll container was breaking upward scrolling
- Replaced with flex-1 spacer div

**Community → Society Rename:**
- Renamed all UI labels from "Community" to "Society"
- Added subtitles to Sessions and Society pages

**Route Migration: `/community` → `/society`:**
- Renamed folder `src/app/(app)/community/` → `src/app/(app)/society/`
- Updated 11 files (links, tour IDs, aria labels, config, docs)
- Added 301 redirect in next.config.js for old bookmarks
- Created CHANGELOG.md for tracking breaking changes

### Decisions Made
- Route rename done now while user count is low (avoids breaking links later)
- Convex badge `category: "community"` left unchanged (internal data, no user impact)
- Natural English "community" in sentences left unchanged (correct usage)
- CHANGELOG.md created as a permanent record of breaking/structural changes

### Issues Encountered
- Chat scroll bug from justify-end CSS (fixed with flex spacer)
- Stale .next cache after folder rename (fixed by deleting .next)

### Next Session Should
- Wire demo data to Convex (Rankings, Chambers, Badges)
- Create demo account seed function
- Begin Stripe payment infrastructure (Phase 2.0)
- PWA install prompt and icons

---

## Session 7 — 2026-02-26
**Phase**: Promo Videos + Voice Switch + Recruitment + Feedback Feature + Nav Bug Fix

### What Was Done

**WS5 — AI Practice Navigation Bug Fix (completed):**
- Added AbortController + mountedRef to `ai-practice/page.tsx` to prevent state updates after unmount
- Stabilised Zustand function references in useEffect dependencies
- Added local error boundary for AI practice page
- Audited all navigation paths from post-session/feedback state

**WS3 — App Feedback Feature (completed):**
- Created `appFeedback` table in `convex/schema.ts`
- Created `convex/appFeedback.ts` with submit/generateUploadUrl/listForAdmin/updateStatus
- Created `src/components/shared/FeedbackButton.tsx` — floating button + modal with category pills, screenshot upload, auto-captured pageUrl/userAgent
- Integrated into `layout-client.tsx`

**WS1 — Voice Switch Daniel → Charlie (completed):**
- Backed up 30 Daniel clips to `public/audio/voiceover/backup-daniel/`
- Regenerated 30 narrator clips with Charlie voice (IKne3meq5aSn9XLyUdCD)
- Applied 150ms fade-out to all clips
- Retimed all 5 compositions: AIPracticeCinematic (75s→73s), AIPracticeShort (900→950 frames), FeatureShowcase (minor), LiveSessionSnippet (shifted), ConstitutionalLaw (retimed)
- Updated Root.tsx durations

**WS2 — Recruitment Promo Video (completed):**
- Generated 6 Charlie voice clips (`recruit-01` through `recruit-06`)
- Created `remotion/RecruitmentPromo.tsx` — 48s, 6 scenes, 1440 frames
- New components: RoleCard, UniversityPill, FeatureBadge, AnimatedCounter
- Birkbeck highlighted with gold border + glow
- Registered in Root.tsx, rendered to `promo/videos/recruitment-promo.mp4` (4.4 MB)
- Added 4 thumbnails: ThumbnailGeneral, ThumbnailAIPractice, ThumbnailConstitutionalLaw, ThumbnailLiveSession

**WS4 — Documentation (completed):**
- Updated `PROMO-VIDEO-PLAN.md` with Charlie voice settings, new video entry, audio assets, render commands, workflow improvements

**Law-First Positioning Overhaul:**
- Reframed all 6 role titles in recruitment video to be law-focused (e.g., "Community & Social Media Manager" → "Advocacy Community Lead")
- Updated entire careers page (`src/app/careers/page.tsx`): all 8 role titles, descriptions, responsibilities, fellowship tracks, Why RATIO cards, hero copy, category filters, apprenticeship labels, FAQ
- Added "Positioning & Copy" section to CLAUDE.md with law-first principle, careers role naming conventions, marketing guidelines, voice/tone rules

### Decisions Made
- **Charlie over Daniel**: Daniel sounded like a nature documentary narrator. Charlie is more articulate and barrister-like.
- **Law-first positioning**: All role titles, descriptions, and marketing copy must lead with legal substance. "Not coffee runs" is the benchmark.
- **Role naming convention**: Every role title should reference law/advocacy/legal — never generic startup language. Table of never-use/use-instead added to CLAUDE.md.
- **CLAUDE.md as persistent memory**: Added Positioning & Copy section so future sessions automatically know the law-first rule without re-explaining.

### Issues Encountered
- ElevenLabs em-dash encoding error on Windows/Git Bash (use ASCII hyphens in curl payloads)
- AIPracticeShort needed manual frame count (950) not FPS * duration due to Charlie timing differences

### Next Session Should
- Render the other 5 retimed videos with Charlie voice (optional — not yet requested)
- Update the actual /careers page content if it exists on the live site
- Consider 16:9 landscape video variants for LinkedIn/YouTube

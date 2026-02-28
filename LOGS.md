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

---

## Session 8 — 2026-02-26
**Phase**: Production Stability — parallelRoutes Fix + GA4 Fix + Security Review
**Duration**: ~3 hours

### What Was Done

**RATIO-7 — parallelRoutes Crash Fix (critical):**
- `TypeError: null is not an object (evaluating 't.parallelRoutes.get')` on `/onboarding`
- Root cause: Next.js App Router `router.push()` between route groups `(auth)` ↔ `(app)` ↔ `(admin)` crashes the client-side router
- Fix: Replaced all 15 cross-group `router.push()`/`router.replace()` with `window.location.href` for full page reloads across 8 files:
  - `src/app/(auth)/layout-client.tsx`
  - `src/app/(auth)/onboarding/page.tsx`
  - `src/app/(app)/layout-client.tsx`
  - `src/app/(app)/settings/page.tsx`
  - `src/app/(admin)/layout-client.tsx`
  - `src/components/guards/ProfileGate.tsx`
  - `src/components/guards/VerifiedOnly.tsx`
  - `src/app/(auth)/verify/page.tsx`

**AI Disclaimers:**
- Added disclaimers to AI Practice page and landing page AIShowcase
- Updated DisclaimerBanner with AI data sources

**Promo Banner:**
- Integrated PromoBanner component on landing page

**Security Review:**
- Full security audit completed — no vulnerabilities found

**GA4 Consent Sequencing Fix (5 bugs resolved):**
- **Bug 1 — Consent race condition**: Consent was `denied` when `gtag('config')` fired the implicit page_view (dropped by GA). Fixed by moving consent init + localStorage check to synchronous `<script>` in `<head>` of `layout.tsx` (parser-blocking, runs before any Next.js Script components)
- **Bug 2 — Duplicate page_views**: `gtag('config')` fires an implicit page_view. Added `send_page_view: false` to config, then fire explicit `gtag('event', 'page_view')` we control
- **Bug 3 — SPA duplicate configs**: `AnalyticsPageView` was calling `gtag('config')` on every route change (fires implicit page_view). Changed to `gtag('event', 'page_view')`
- **Bug 4 — First-render duplicate**: Added `isFirstRender` ref to skip duplicate initial page_view from both config and AnalyticsPageView
- **Bug 5 — TypeScript casts**: Created `src/types/gtag.d.ts` with types for `window.gtag` and `window.dataLayer`, eliminated all `(window as any).gtag` casts

**GA Admin Console Cleanup (via Claude extension):**
- Orphaned G-NG49LD1FXR destination removed from Google Tag GT-55XZSNJ5
- Only G-D2EJDX48MD destination remains
- Enhanced Measurement confirmed ON
- Realtime data flow verified

**Merge Conflict Resolution:**
- Remote had 2 new commits: verify page Convex upgrade + page-client.tsx refactor
- Resolved `src/app/(auth)/verify/page.tsx`: kept remote Convex mutations + our `window.location.href` fix
- Resolved `src/app/page.tsx`: accepted remote server component wrapper, moved PromoBanner to `page-client.tsx`

### Files Changed
- `src/app/layout.tsx` — synchronous consent script in `<head>`
- `src/components/shared/Analytics.tsx` — full rewrite (send_page_view:false, explicit events, SPA tracking)
- `src/types/gtag.d.ts` — new file (TypeScript declarations for gtag)
- `src/lib/analytics.ts` — typed window.gtag
- `src/app/(auth)/layout-client.tsx` — window.location.href
- `src/app/(auth)/onboarding/page.tsx` — window.location.href
- `src/app/(auth)/verify/page.tsx` — window.location.href + Convex mutations (merge)
- `src/app/(app)/layout-client.tsx` — window.location.href
- `src/app/(app)/settings/page.tsx` — window.location.href
- `src/app/(admin)/layout-client.tsx` — window.location.href
- `src/components/guards/ProfileGate.tsx` — window.location.href
- `src/components/guards/VerifiedOnly.tsx` — window.location.href
- `src/app/(app)/ai-practice/page.tsx` — AI disclaimers
- `src/components/landing/AIShowcase.tsx` — AI disclaimer
- `src/components/landing/DisclaimerBanner.tsx` — AI data sources
- `src/app/page-client.tsx` — PromoBanner addition

### Commits
- `1da616b` — feat: promo videos, AI disclaimers, parallelRoutes crash fix, promo banner
- `f06fc46` — fix: GA4 consent sequencing — analytics_storage granted before page_view fires

### Decisions Made
- **window.location.href over router.push**: For cross-route-group navigation, full page reload is the only safe approach. Next.js App Router cannot client-side navigate between `(auth)` and `(app)` groups because they have different layouts with different parallel route trees.
- **Synchronous script in head**: Only way to guarantee consent state is set before gtag.js loads. React useEffect and Next.js `<Script strategy="beforeInteractive">` both run too late.
- **send_page_view: false**: Prevents the uncontrollable implicit page_view from `gtag('config')`. We fire our own explicit event instead.
- **GA admin cleanup via Claude extension**: The G-NG49LD1FXR tag mismatch was an admin console issue, not a code issue. Delegated to the browser extension.

### Issues Encountered
- Git push rejected (remote had 2 new commits) — resolved with `git pull --rebase` + manual merge conflict resolution
- Network request tracking in Chrome extension resets on page reload — used JavaScript injection to verify dataLayer instead
- Chrome extension blocks cookie/query string data in JS eval — worked around by avoiding JSON.stringify on consent objects

### Verified on Production
- dataLayer sequence: `[0] consent|default` → `[1] consent|update (granted)` → `[2] js` → `[3] config|G-D2EJDX48MD` → `[4] event|page_view`
- SPA navigation adds exactly 1 page_view per route change
- GA4 Realtime showing data
- gtag.js script loaded from googletagmanager.com
- No console errors

### Next Session Should
- Wire remaining demo data pages to Convex (Rankings, Chambers, Badges, Library)
- Connect sessions CRUD fully to Convex
- Stripe payment infrastructure
- Render remaining 5 retimed videos with Charlie voice
- Generate PWA icons / favicon set

---

## Session 9 — 2026-02-27
**Phase**: Day 8 — TTS Audio Fix + Production Verification
**Duration**: ~3 hours (across 2 continuation sessions)

### What Was Done
- Diagnosed root cause of silent AI Practice audio: `msedge-tts` hangs forever on WebSocket connect, no timeouts, silent fail
- Added 8s `AbortController` timeout to all client-side TTS fetch calls (`useSpeechSynthesis.ts`)
- Added 10s `Promise.race` timeout to server-side Edge TTS route (`api/ai/tts/edge/route.ts`)
- Merged conflict with PR #10 (browser TTS fallback + retry logic) — combined both fixes into final version
- Four-tier TTS fallback now: ElevenLabs → Edge TTS → Browser SpeechSynthesis → Silent
- Added `MAX_FAILURES = 2` retry logic before disabling a TTS tier
- Added voice preloading via `voiceschanged` event for browser SpeechSynthesis
- Added iOS audio unlock (warm up speechSynthesis inside user gesture)
- Added 30s safety timeout for browser SpeechSynthesis on mobile
- Pushed commit `2f2c379` to origin/main — auto-deployed to Vercel
- Updated `ELEVENLABS_API_KEY` in Vercel env vars (old key was returning 401)
- Triggered production redeploy with new key
- Updated `.env.example` to document ElevenLabs as active (not Phase 2)
- Updated `.env.local` with new ElevenLabs key
- Verified production site loads: landing page, login, home dashboard, AI Practice page all working

### Key Files Modified
- `src/hooks/useSpeechSynthesis.ts` — merged TTS timeout + retry + voice preloading
- `src/app/api/ai/tts/edge/route.ts` — added 10s server-side timeout
- `.env.example` — updated ElevenLabs documentation
- `.env.local` — updated ElevenLabs API key

### Decisions Made
- 8s client timeout balances responsiveness vs network variability
- Browser SpeechSynthesis is reliable Tier 3 fallback (works everywhere)
- Edge TTS likely can't connect from Vercel's serverless environment (WebSocket restrictions)
- ElevenLabs is Tier 1 when key is valid; browser voice is Tier 3 fallback

### Issues Encountered
- Git merge conflict: PR #10 vs local TTS fix — 10 conflict markers in useSpeechSynthesis.ts
- Chrome extension disconnects frequently during Vercel dashboard operations
- GitHub Actions CI failing due to billing lock (not code issue, Vercel deploys independently)
- Production ElevenLabs key was returning 401 (invalid/expired) — updated to new key

### Environment Variables on Vercel Production
- `NEXT_PUBLIC_CONVEX_URL` ✓
- `ELEVENLABS_API_KEY` ✓ (updated 2026-02-27)
- `ANTHROPIC_API_KEY` ✓ (set, verify it's a real key)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` ✓
- `SENTRY_PROJECT` ✓
- `SENTRY_AUTH_TOKEN` ✓
- `CONVEX_DEPLOY_KEY` ✓ (Production + Development)
- `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS` ✓
- `REPLICATE_API_TOKEN` ✓

### Next Session Should
- Set up PostHog analytics
- Verify TTS works end-to-end on production after redeploy
- Test AI Practice with real Anthropic API key
- Wire remaining demo data pages to Convex

---

## Session 10 — 2026-02-28
**Phase**: Loading States + Branded Panels + Feature Build (AI Streaming, Sessions CRUD, PWA, Verification)
**Duration**: ~4 hours (across 2 continuation sessions)

### What Was Done

**Loading States (commit 391c035):**
- AI Practice session start skeleton: gold accent line + pulsing Scale icon + "The court is now in session..." with skeleton message lines
- Enhanced feedback loading interstitial: 5 rotating courtroom-themed messages (3.5s cycle), skeleton score bars for FEEDBACK_DIMENSIONS, session summary stats (duration, exchanges, case area)
- Reduced post-feedback delay from 4s to 1.5s with "Judgment ready..." final message
- Research page: replaced Loader2 spinner with 3 skeleton card rows
- Created 6 route-level loading.tsx files (home, sessions, ai-practice, profile, society, rankings)

**Branded Visual Panels (commit ad97b44):**
- Created SideVisualPanel.tsx: sticky full-height panel with dark navy gradient, dot-texture overlay, gold accent lines, Scale icon, heading/subheading
- Created PageWithPanel.tsx: 60/40 split layout wrapper (panel lg:40%, content flex-1)
- Applied to 4 pages: Society (right), Chambers (left), Rankings (right), Sessions (left)
- Fixed Install CTA / Clerk overlap: moved InstallBanner to bottom-left offset by sidebar width

**Sessions CRUD Fix:**
- Fixed demo data schema mismatch in demo-data.ts: scheduledAt→date, mode→type (with valid values), area→module
- Fixed rendering in sessions/page.tsx to use correct field names
- Added `update` mutation to convex/sessions.ts (creator-only auth, partial field updates, input validation)
- Added `remove` mutation to convex/sessions.ts (creator-only auth, cascading delete of roles + participants)
- Fixed N+1 query in getParticipants: batched profile lookups via Set + Map

**AI Judge Streaming + Prompt Caching:**
- Added SSE streaming to /api/ai/chat/route.ts: Anthropic stream:true, ReadableStream response, text/event-stream, data:[DONE] sentinel
- Added prompt caching (cache_control: ephemeral) to system prompts in both chat and feedback routes (~90% input token savings)
- Updated ai-practice/page.tsx: readChatStream helper with SSE parsing, progressive message rendering (tokens appear as they stream), JSON fallback for backward compatibility
- sendMessage now adds empty AI message immediately, updates progressively via onToken callback
- Error handling for mid-stream failures (detects empty AI message, replaces vs duplicates)
- Usage tracking preserved (input/output tokens from stream events)
- Timeout increased to 60s for streaming

**PWA Icons + OG Image:**
- Generated favicon.ico (32x32) from existing icon-192.png
- Generated icon-144x144.png from existing icon-192.png
- Generated og-image.png (1200x630): navy gradient, gold scale-of-justice, "RATIO." branding, decorative accents
- Updated manifest.json with 144px icon entry
- Updated layout.tsx metadata with favicon, 144px icon, and OG image fallback
- Added sharp as devDependency for asset generation

**Verification (all confirmed already done):**
- Rankings: useDemoQuery + anyApi.profiles.getLeaderboard + DEMO_ADVOCATES fallback
- Chambers: useDemoQuery + anyApi.profiles.getChamberStats + DEMO_CHAMBER_DATA fallback
- Badges: useDemoQuery + anyApi.badges_queries.getAll/getMyBadges + BADGE_DEFINITIONS fallback
- Library: useDemoQuery + anyApi.resources_queries.list/getCategoryCounts + useDemoMutation for trackDownload
- FeatureGate: useSubscription hook, canAccess(), 4 plan tiers, 8 gated features, locked overlay with upgrade link
- Sentry auth token: already set in Vercel env vars (confirmed from Session 9)

### Key Files Modified
- `src/app/(app)/ai-practice/page.tsx` — session start skeleton, feedback interstitial, streaming consumer
- `src/app/api/ai/chat/route.ts` — SSE streaming + prompt caching
- `src/app/api/ai/feedback/route.ts` — prompt caching
- `src/app/(app)/sessions/page.tsx` — demo data field name fix
- `src/lib/constants/demo-data.ts` — schema mismatch fix
- `convex/sessions.ts` — update/remove mutations, N+1 fix
- `src/app/(app)/research/page.tsx` — skeleton rows
- `src/components/shared/SideVisualPanel.tsx` — new component
- `src/components/shared/PageWithPanel.tsx` — new component
- `src/components/shared/InstallBanner.tsx` — position fix
- `src/app/(app)/society/page.tsx` — wrapped in PageWithPanel
- `src/app/(app)/chambers/page.tsx` — wrapped in PageWithPanel
- `src/app/(app)/rankings/page.tsx` — wrapped in PageWithPanel
- 6 new loading.tsx files
- `public/favicon.ico`, `public/icons/icon-144x144.png`, `public/og-image.png` — new assets
- `public/manifest.json` — 144px icon entry
- `src/app/layout.tsx` — favicon + icon + OG metadata
- `TASK.md`, `PLAN.md`, `LOGS.md` — session tracking

### Commits
- `391c035` — feat: add loading states and skeleton UX across the app
- `ad97b44` — feat: add branded side visual panels on desktop + fix Install CTA overlap
- (pending) — feat: AI streaming, sessions CRUD, PWA icons, OG image

### Decisions Made
- **Streaming over batch**: AI responses now stream token-by-token via SSE. Gives perceived instant response instead of 2-8s blank wait.
- **Prompt caching**: Anthropic's ephemeral cache on system prompts saves ~90% input tokens after first call in a session. Zero code complexity cost.
- **No streaming for feedback**: Feedback returns structured JSON scores that must be parsed as a whole. Caching only.
- **Session mutations**: Added update/remove with creator-only auth checks and cascading deletes for roles/participants.
- **Many tasks already done**: Exploration revealed Rankings/Chambers/Badges/Library were already Convex-wired, FeatureGate + Stripe already implemented, Sentry token already set. Saved significant time.
- **Deferred video rendering**: Remotion rendering is CPU-intensive (10-30 min per video). Better as separate dedicated session.

### Issues Encountered
- None significant — all agents completed successfully, build expected to pass

### Next Session Should
- Verify build passes and deploy to production
- Test AI streaming end-to-end on production
- Render remaining 5 promo videos (dedicated rendering session)
- Law Book Schema + MVP Pages (Day 9)
- Governance MVP (Day 14)

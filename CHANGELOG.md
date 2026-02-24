# RATIO — Changelog

> Breaking changes, route migrations, and significant structural updates.
> For detailed session-by-session work, see [LOGS.md](./LOGS.md).

---

## 2026-02-24 — Animated Scales Judge Avatar

### What Changed
Replaced the real human photo avatar with a fully animated SVG scales-of-justice icon.

### Visual Effects
- **Metallic gold gradient** — Colours shift over time, simulating light on polished brass
- **Scale pan tilt** — Pans tip based on judge expression (balanced = neutral, heavy tilt = stern)
- **3D perspective wobble** — Subtle Y-axis rotation when session is active
- **Glow ring** — Pulsing ring changes colour with expression (gold/red/green)
- **Sparkle particles** — 4 floating gold dots orbit the avatar during session
- **Status dot** — Expression-aware indicator (thinking/stern/approving)
- **Collapsible** — 56px full → 28px inline with simplified animation

### Expression States
- **Neutral** — Scales balanced, gold glow
- **Thinking** — Slight tilt (-3°), pulsing status dot
- **Stern** — Heavy tilt (-10°), red glow + red sparkles
- **Approving** — Barely tipped (+2°), green glow + green sparkles

### Files Changed
- `src/components/ai-practice/JudgeAvatar.tsx` — complete rewrite (photo → animated SVG)
- `public/images/judge-avatar.jpg` — no longer used (can be deleted)

---

## 2026-02-24 — Convex Badge Category: `community` → `society`

### What Changed
Badge category string renamed from `"community"` to `"society"` in schema, seed data,
constants, and badges page. "Community Builder" badge renamed to "Society Builder".

### Files Changed
- `convex/schema.ts` — category comment
- `convex/seed.ts` — 7 badge entries + badge name
- `src/lib/constants/app.ts` — 6 badge entries
- `src/app/(app)/badges/page.tsx` — CATEGORIES array + filter mapping

---

## 2026-02-24 — Route Migration: `/community` → `/society`

### What Changed
The `/community` route was renamed to `/society` to match the product's branding
(the bottom nav tab, sidebar, and page title already said "Society").

### Why
Consistency. The feature was renamed from "Community" to "Society" across the UI
but the URL path still said `/community`. Fixing it now while user count is low
avoids broken bookmarks later.

### Files Changed (11 files, 1 folder)

**Folder renamed:**
- `src/app/(app)/community/` → `src/app/(app)/society/`

**Internal links updated (href / route):**
- `src/components/shared/BottomNav.tsx` — `"/community"` → `"/society"`
- `src/components/shared/Sidebar.tsx` — `"/community"` → `"/society"` + tourId
- `src/components/shared/StarterKit.tsx` — `"/community"` → `"/society"` + label
- `src/app/(app)/home/page.tsx` — League Table link
- `src/lib/constants/clerk-guides.ts` — `route: "/community"` → `"/society"`
- `src/app/sitemap.ts` — sitemap path

**Tour / accessibility:**
- `src/lib/constants/tour-steps.ts` — `id`, `target`, description text
- `src/app/(app)/society/page.tsx` — aria-label, component function name

**Config:**
- `next.config.js` — added permanent 301 redirect `/community` → `/society`

**Documentation:**
- `ARCHITECTURE.md` — route listing
- `README.md` — folder structure
- `CLAUDE.md` — route list

**Comments only:**
- `src/stores/authStore.ts`

### What Was NOT Changed (intentionally)
- **Convex `category: "community"` in badges schema/seed** — This is internal database
  data, not a URL. Changing it would require a database migration for no user-visible
  benefit.
- **Natural English uses of "community"** — Sentences like "wider community",
  "community engagement", Code of Conduct text. These use the English word correctly
  and are not labels or paths.

### Redirect
`/community` → `/society` (HTTP 301 permanent) via `next.config.js`.
Any old bookmarks or shared links will auto-redirect.

---

## 2026-02-24 — UI: Community → Society Rename (labels only)

### What Changed
All user-facing labels renamed from "Community" to "Society" before the route
migration above. Subtitles added to Sessions and Society pages for consistency.

### Files Changed
- `src/app/(app)/community/page.tsx` — title + subtitle added
- `src/app/(app)/sessions/page.tsx` — subtitle added
- `src/components/shared/Sidebar.tsx` — label
- `src/components/landing/FooterSection.tsx` — section title + link
- `src/components/landing/GovernanceShowcase.tsx` — heading
- `src/lib/constants/clerk-guides.ts` — two titles
- `src/lib/constants/tour-steps.ts` — title

---

## 2026-02-24 — Fix: Chat Scroll in AI Practice

### What Changed
Chat messages in AI Practice sessions couldn't be scrolled upward. The `justify-end`
CSS on the flex container was pinning content to the bottom and blocking overflow scroll.

### Fix
Replaced `justify-end` with a `flex-1` spacer div that pushes messages down when few
but collapses when content overflows, allowing normal scroll behaviour.

### File Changed
- `src/app/(app)/ai-practice/page.tsx`

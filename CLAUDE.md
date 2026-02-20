# RATIO. — The Digital Court Society
## Claude Code Project Instructions

### Identity
Ratio is a constitutional training ground for UK law students. Built with Next.js 14 + Convex + Tailwind CSS + Zustand + Framer Motion + Lucide React. Deployed to Vercel.

### Design System
- **Navy palette**: #0C1220 (bg), #131E30 (card), #182640 (mid), #1E3050 (accent)
- **Gold**: #C9A84C (primary accent) — use `text-gold`, `bg-gold`, `bg-gold-dim`
- **Burgundy**: #6B2D3E (secondary accent)
- **Court text**: #F2EDE6 at 100%/60%/30% — use `text-court-text`, `text-court-text-sec`, `text-court-text-ter`
- **Fonts**: Cormorant Garamond (serif headings), DM Sans (body)
- **Border radius**: `rounded-court` for cards, `rounded-xl` for buttons
- **Icons**: Lucide React (never emoji)
- **Tone**: Institutional, serious, calm. No exclamation marks. No hype. Premium = restraint.

### Terminology
- Users are "Advocates" (not users, members, or subscribers)
- "Follow" (not subscribe, connect, or add)
- "Chamber" (not team, group, or house)
- "Session" (not match, game, or event)
- CTA language: "Join as an Advocate", "Start Practice", "Explore the Law Book"

### Tracking Files
- Always read PLAN.md, TASK.md, SUGGESTIONS.md, and LOGS.md at session start
- Update TASK.md after completing each task
- Update PLAN.md after completing a day/phase
- Add new ideas to SUGGESTIONS.md rather than losing them
- Append to LOGS.md at end of every session with: date, what was done, decisions, issues
- Keep TASK.md as the single source of truth for current work

### Code Conventions
- All pages are `"use client"` (Next.js App Router)
- Convex queries: `useQuery(api.module.function)`
- Convex mutations: `useMutation(api.module.function)`
- State management: Zustand stores in `src/stores/`
- Shared components: `src/components/ui/index.tsx` and `src/components/shared/`
- Constants: `src/lib/constants/app.ts`
- Helpers: `src/lib/utils/helpers.ts`

### Simplification Rules
- One primary action per screen
- Max 3 interactive elements visible without scroll on mobile
- Minimum 44px tap targets
- No hover-only behaviors
- Every screen must breathe (visible padding, not wall-to-wall content)

### Key Architecture
- Route groups: `(auth)` for login/register/onboarding, `(app)` for authenticated pages
- Convex backend: 15 existing tables (see `convex/schema.ts`)
- AI Judge: `convex/ai.ts` — Claude Sonnet → GPT-4o-mini fallback
- EmptyState component exists in `src/components/ui/index.tsx` — use it
- Skeleton component exists in `src/components/ui/index.tsx` — use it

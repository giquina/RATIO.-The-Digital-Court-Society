# RATIO. -- Universal Project Operating System (UPOS)

**Version**: 1.0.0
**Effective Date**: 2026-02-22
**Governing Authority**: RATIO Project Lead
**Repository**: github.com/giquina/RATIO.-The-Digital-Court-Society
**Deployment**: Vercel (Production)
**Classification**: Internal Governance Document -- Implementation-Ready

---

## Table of Contents

- [A. Executive Summary](#a-executive-summary)
- [B. Universal Architecture Blueprint](#b-universal-architecture-blueprint)
- [C. Mandatory File Constitution](#c-mandatory-file-constitution)
- [D. Design Governance System](#d-design-governance-system)
- [E. AI and Skills Framework](#e-ai-and-skills-framework)
- [F. Governance and Risk Model](#f-governance-and-risk-model)
- [G. Git and Deployment Protocol](#g-git-and-deployment-protocol)
- [H. Automation Layer](#h-automation-layer)
- [I. Onboarding System](#i-onboarding-system)
- [J. Project Health Index](#j-project-health-index)
- [K. Master Enforcement Checklist](#k-master-enforcement-checklist)

---

## A. Executive Summary

### A.1 Purpose

This Universal Project Operating System (UPOS) codifies the structural, procedural, and governance standards that govern the development and maintenance of RATIO -- The Digital Court Society. It serves as the constitutional foundation for all engineering, design, and operational decisions within the project.

RATIO is a constitutional training ground for UK law students. It is built with Next.js 14 (App Router), Convex (real-time backend), Tailwind CSS (utility-first styling), Zustand (client state), Framer Motion (animation), and Lucide React (iconography). It is deployed to Vercel.

This document is not advisory. It is binding. Every contributor, automated process, and AI agent operating within this repository shall comply with its provisions.

### A.2 Scope

This UPOS applies to:

- All source code within the `RATIO.-The-Digital-Court-Society` repository
- All Convex backend functions and schema definitions
- All design tokens, components, and visual assets
- All AI integrations and prompt engineering
- All deployment pipelines, CI/CD configurations, and environment management
- All documentation, tracking files, and governance records
- All contributors: human developers, AI coding agents, and automated systems

### A.3 Core Principles

| Principle | Application |
|-----------|-------------|
| **Institutional Restraint** | Premium quality through subtraction, not addition. No exclamation marks. No hype. |
| **Constitutional Rigour** | Every change is documented, reviewed, and traceable. |
| **Mobile-First Ruthlessness** | 44px minimum tap targets. One primary action per screen. Every screen breathes. |
| **Advocate-Centric Design** | Users are Advocates. Language, flows, and feedback serve their legal training. |
| **Single Source of Truth** | TASK.md for current work. PLAN.md for roadmap. This UPOS for governance. |

### A.4 Terminology

Throughout this document and the entire codebase:

| Standard Term | Required Term | Prohibited Alternatives |
|---------------|---------------|------------------------|
| User | **Advocate** | user, member, subscriber, player |
| Team / Group | **Chamber** | team, group, house, clan |
| Match / Game | **Session** | match, game, event, round |
| Subscribe / Connect | **Follow** | subscribe, connect, add, friend |
| Call-to-Action | See below | -- |

Required CTA phrasing:
- "Join as an Advocate" (not "Sign up" or "Get started")
- "Start Practice" (not "Play" or "Begin")
- "Explore the Law Book" (not "Browse resources")

---

## B. Universal Architecture Blueprint

### B.1 Mandatory Folder Structure

```
RATIO.-The-Digital-Court-Society/
|
|-- .claude/                    # Claude Code agent configuration
|   |-- worktrees/              # Agent worktree state
|
|-- .vercel/                    # Vercel project configuration (auto-generated)
|   |-- project.json            # Vercel project ID and org ID
|
|-- convex/                     # Convex backend (real-time database + serverless functions)
|   |-- _generated/             # Auto-generated Convex types (do not edit)
|   |-- ai/                     # AI-related backend functions
|   |-- governance/             # Governance-related backend functions
|   |-- schema.ts               # Single source of truth for all database tables
|   |-- ai.ts                   # AI Judge logic (Claude Sonnet -> GPT-4o-mini fallback)
|   |-- aiSessions.ts           # AI practice session CRUD
|   |-- daily.ts                # Daily.co video integration
|   |-- notifications.ts        # Notification system
|   |-- profiles.ts             # Advocate profile CRUD
|   |-- seed.ts                 # Database seeding
|   |-- sessions.ts             # Moot session CRUD
|   |-- social.ts               # Follow/commendation system
|   |-- videoSessions.ts        # Video moot session management
|
|-- public/                     # Static assets (favicon, PWA icons, OG images)
|
|-- src/
|   |-- app/                    # Next.js App Router pages
|   |   |-- (auth)/             # Authentication route group
|   |   |   |-- login/
|   |   |   |-- register/
|   |   |   |-- onboarding/
|   |   |-- (app)/              # Authenticated route group
|   |   |   |-- home/
|   |   |   |-- sessions/
|   |   |   |-- ai-practice/
|   |   |   |-- law-book/
|   |   |   |-- community/
|   |   |   |-- profile/
|   |   |   |-- chambers/
|   |   |   |-- parliament/
|   |   |   |-- tribunal/
|   |   |   |-- rankings/
|   |   |   |-- tools/
|   |   |   |-- settings/
|   |   |   |-- notifications/
|   |   |   |-- portfolio/
|   |   |   |-- badges/
|   |   |   |-- research/
|   |   |   |-- library/
|   |   |   |-- feedback/
|   |   |   |-- about/
|   |   |   |-- help/
|   |   |   |-- layout.tsx      # Authenticated layout (BottomNav, Sidebar)
|   |   |-- api/                # Next.js API routes
|   |   |-- layout.tsx          # Root layout (fonts, ConvexProvider, metadata)
|   |   |-- page.tsx            # Landing page
|   |   |-- globals.css         # Global styles and Tailwind directives
|   |
|   |-- components/
|   |   |-- ui/                 # Reusable UI primitives (EmptyState, Skeleton, etc.)
|   |   |   |-- index.tsx       # Barrel export for all UI components
|   |   |-- shared/             # Layout components (BottomNav, Sidebar, Header)
|   |   |-- guards/             # Auth guards and route protection
|   |   |-- landing/            # Landing page section components
|   |   |-- video/              # Video moot components (Daily.co integration)
|   |
|   |-- hooks/                  # Custom React hooks
|   |
|   |-- lib/
|   |   |-- ai/                 # Client-side AI utilities
|   |   |-- constants/          # Application constants
|   |   |   |-- app.ts          # App-wide constants (routes, labels, config)
|   |   |-- legal-api/          # Legal data API integrations
|   |   |-- utils/
|   |       |-- helpers.ts      # Shared utility functions
|   |
|   |-- stores/                 # Zustand state stores
|   |   |-- authStore.ts        # Authentication state
|   |   |-- contributionStore.ts# Law Book contribution tracking
|   |   |-- followStore.ts      # Social follow state
|   |
|   |-- middleware.ts           # Next.js middleware (route protection)
|
|-- CLAUDE.md                   # AI agent instructions (read at every session start)
|-- PLAN.md                     # High-level roadmap and phase tracker
|-- TASK.md                     # Current task tracker (single source of truth for work)
|-- SUGGESTIONS.md              # Deferred ideas and feature requests
|-- LOGS.md                     # Session-by-session development log
|-- UPOS.md                     # This document
|-- package.json                # Dependencies and scripts
|-- tailwind.config.ts          # Design tokens and Tailwind extensions
|-- tsconfig.json               # TypeScript configuration
|-- next.config.js              # Next.js configuration
|-- postcss.config.js           # PostCSS configuration
```

### B.2 Folder Purpose and Ownership

| Folder | Purpose | Owner | Update Frequency |
|--------|---------|-------|-----------------|
| `convex/` | All backend logic, schema, serverless functions | Backend Lead | Per feature |
| `convex/schema.ts` | Database schema (39 tables) | Backend Lead | Major features only |
| `convex/ai.ts` | AI Judge prompt engineering | AI Lead | Per AI iteration |
| `src/app/(auth)/` | Login, register, onboarding flows | Frontend Lead | Auth changes only |
| `src/app/(app)/` | All authenticated pages (42 routes) | Frontend Lead | Per feature |
| `src/components/ui/` | Shared UI primitives | Design Lead | Design system changes |
| `src/components/shared/` | Layout shells (nav, sidebar) | Frontend Lead | Layout changes |
| `src/stores/` | Zustand client state | Frontend Lead | Per state change |
| `src/lib/constants/` | App-wide configuration | Project Lead | Rarely |
| `tailwind.config.ts` | Design tokens | Design Lead | Design system changes |

### B.3 Required Files (Existence Enforced)

The following files must exist at all times. Their absence constitutes a build-blocking violation.

| File | Purpose | Created By |
|------|---------|-----------|
| `CLAUDE.md` | AI agent operating instructions | Project Lead |
| `PLAN.md` | Roadmap and phase tracker | Project Lead |
| `TASK.md` | Current work tracker | Project Lead |
| `SUGGESTIONS.md` | Deferred ideas buffer | Any contributor |
| `LOGS.md` | Session development log | AI Agent / Developer |
| `UPOS.md` | This governance document | Project Lead |
| `convex/schema.ts` | Database schema | Backend Lead |
| `tailwind.config.ts` | Design token source of truth | Design Lead |
| `src/app/layout.tsx` | Root layout | Frontend Lead |
| `src/app/globals.css` | Global styles | Design Lead |
| `package.json` | Dependency manifest | Project Lead |

### B.4 Update Protocol

| Trigger | Required Action |
|---------|----------------|
| New feature added | Update TASK.md, add entry to LOGS.md |
| Phase completed | Update PLAN.md status, archive TASK.md completed items |
| Idea deferred | Add to SUGGESTIONS.md with rationale |
| Design token changed | Update `tailwind.config.ts`, run Design Drift Detection |
| Schema modified | Update `convex/schema.ts`, document in LOGS.md |
| Session ended | Append session summary to LOGS.md |
| UPOS amended | Increment version, log change in Section F audit trail |

---

## C. Mandatory File Constitution

### C.1 CLAUDE.md -- AI Agent Instructions

**Purpose**: Operating instructions for Claude Code and any AI agents working on the project.
**Update Frequency**: When conventions change.
**Maximum Length**: 2,000 words.

Required sections:
1. **Identity** -- One-sentence project description and tech stack.
2. **Design System** -- Colour palette, fonts, border radius, icon library, tone.
3. **Terminology** -- Advocate, Chamber, Session, Follow. Required CTA language.
4. **Tracking Files** -- Which files to read at session start, how to update each.
5. **Code Conventions** -- `"use client"`, Convex query/mutation patterns, Zustand patterns, shared component locations, constants/helpers locations.
6. **Simplification Rules** -- One primary action per screen. 44px tap targets. No hover-only.
7. **Key Architecture** -- Route groups, Convex tables count, AI fallback chain, existing components.

### C.2 PLAN.md -- Roadmap and Phase Tracker

**Purpose**: High-level development roadmap with phase statuses.
**Update Frequency**: After each phase completion.
**Maximum Length**: 1,500 words.

Required sections:
1. **Status** -- Current day/phase and last updated date.
2. **Phase Summary Table** -- Day, Focus, Status (DONE / IN PROGRESS / Pending).
3. **Core Identity** -- One-sentence restatement of what RATIO is.
4. **Key Principles** -- Numbered list of governing design and development principles.
5. **Full Plan Reference** -- Link to detailed plan if it exists outside this file.

### C.3 TASK.md -- Current Work Tracker

**Purpose**: Single source of truth for all current and pending work items.
**Update Frequency**: After every completed task.
**Maximum Length**: 3,000 words.

Required sections:
1. **Current Phase** -- Name and description of active phase.
2. **Completed** -- Checked items with file paths and dates.
3. **In Progress** -- Unchecked items currently being worked.
4. **Pending (by Day/Phase)** -- Grouped future work items.

Format for completed items:
```
- [x] Description -- `file/path.tsx` -- YYYY-MM-DD
```

Format for pending items:
```
- [ ] Description -- `file/path.tsx`
```

### C.4 SUGGESTIONS.md -- Deferred Ideas Buffer

**Purpose**: Capture ideas without losing them. Prevent scope creep by parking features here.
**Update Frequency**: Whenever an idea surfaces that is not in scope.
**Maximum Length**: 2,000 words.

Required sections:
1. **Feature Ideas (Deferred)** -- Features explicitly deferred from current roadmap.
2. **UX Improvements** -- Visual and interaction improvements to revisit.
3. **Architecture Notes** -- Technical debt and structural improvements.
4. **Business and Strategy** -- Monetisation, partnerships, growth.
5. **User Feedback** -- Direct feedback from Advocates (when available).

### C.5 LOGS.md -- Session Development Log

**Purpose**: Chronological record of all development sessions.
**Update Frequency**: End of every session.
**Maximum Length**: Unlimited (append-only).

Required format per session:
```markdown
## Session N -- YYYY-MM-DD
**Phase**: Day X -- Phase Name
**Duration**: ~N hours

### What Was Done
- Bulleted list of changes with file paths

### Decisions Made
- Bulleted list of architectural or design decisions with rationale

### Issues Encountered
- Bulleted list of blockers, bugs, or concerns

### Next Session Should
- Bulleted list of recommended starting points
```

### C.6 UPOS.md -- This Document

**Purpose**: Constitutional governance for the entire project.
**Update Frequency**: When governance rules change.
**Version Control**: Semantic versioning (MAJOR.MINOR.PATCH).
**Amendment Process**: See Section F.5.

---

## D. Design Governance System

### D.1 Design Tokens -- Source of Truth

All design tokens are defined in `tailwind.config.ts`. No inline styles or arbitrary values are permitted unless technically required (e.g., CSS `conic-gradient` requiring raw hex).

#### D.1.1 Colour Palette

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Navy Background | `#0C1220` | `bg-navy` | Page backgrounds |
| Navy Card | `#182640` | `bg-navy-card` | Card surfaces |
| Navy Mid | `#131E30` | `bg-navy-mid` | Secondary surfaces |
| Navy Light | `#1E3050` | `bg-navy-light` | Elevated surfaces, accents |
| Gold | `#C9A84C` | `text-gold`, `bg-gold` | Primary accent, CTAs |
| Gold Dim | `rgba(201,168,76,0.12)` | `bg-gold-dim` | Subtle gold backgrounds |
| Burgundy | `#6B2D3E` | `text-burgundy`, `bg-burgundy` | Secondary accent |
| Court Text | `#F2EDE6` | `text-court-text` | Primary text (100%) |
| Court Text Secondary | `rgba(242,237,230,0.6)` | `text-court-text-sec` | Secondary text (60%) |
| Court Text Tertiary | `rgba(242,237,230,0.3)` | `text-court-text-ter` | Tertiary text (30%) |
| Court Border | `rgba(255,255,255,0.06)` | `border-court-border` | Card borders |
| Court Border Light | `rgba(255,255,255,0.04)` | `border-court-border-light` | Subtle dividers |

#### D.1.2 Chamber Colours

| Chamber | Hex | Tailwind Class |
|---------|-----|----------------|
| Gray's Inn | `#6B2D3E` | `bg-chamber-grays` |
| Lincoln's Inn | `#2E5090` | `bg-chamber-lincolns` |
| Inner Temple | `#3D6B45` | `bg-chamber-inner` |
| Middle Temple | `#8B6914` | `bg-chamber-middle` |

#### D.1.3 Typography

| Token | Size | Line Height | Letter Spacing | Tailwind Class |
|-------|------|-------------|----------------|----------------|
| Court XS | 10px | 14px | 0.02em | `text-court-xs` |
| Court SM | 11px | 16px | -- | `text-court-sm` |
| Court Base | 13px | 20px | -- | `text-court-base` |
| Court MD | 15px | 22px | -- | `text-court-md` |
| Court LG | 16px | 24px | -- | `text-court-lg` |
| Court XL | 18px | 26px | -- | `text-court-xl` |

Font families:
- **Headings**: `font-serif` -- Cormorant Garamond (loaded via `next/font/google` as `--font-cormorant`)
- **Body**: `font-sans` -- DM Sans (loaded via `next/font/google` as `--font-dm-sans`)

#### D.1.4 Spacing and Layout

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-court` | 14px | Card border radius |
| `rounded-xl` | -- | Button border radius |
| `max-w-content-narrow` | 672px | Single-column content |
| `max-w-content-medium` | 1024px | Two-column layouts |
| `max-w-content-wide` | 1280px | Full-width dashboard |

#### D.1.5 Animation Tokens

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| `animate-slide-up` | 0.3s | ease-out | Page enter transitions |
| `animate-slide-down` | 0.3s | ease-out | Dropdown reveals |
| `animate-fade-in` | 0.4s | ease-out | Content fade-in |
| `animate-scale-in` | 0.3s | ease-out | Modal/card appear |
| `animate-glow-breathe` | 2s | ease-in-out | Gold glow on active elements |
| `animate-pulse-ring` | 2.4s | ease-out | Live indicator pulse |
| `animate-spin-slow` | 8s | linear | Loading states |

### D.2 Mobile-First Rules

These rules are non-negotiable. Every page must satisfy all conditions before merge.

1. **One Primary Action Per Screen**: Each mobile viewport must have exactly one dominant CTA. Secondary actions are permitted but must be visually subordinate (smaller, dimmer, or below the fold).

2. **Maximum Three Interactive Elements Above the Fold**: On a 375px-wide viewport, no more than three tappable/clickable elements should be visible without scrolling.

3. **Minimum 44px Tap Targets**: All buttons, links, and interactive elements must have a minimum touch target of 44x44px. This applies to the interactive area, not merely the visible element.

4. **No Hover-Only Behaviours**: Every interaction triggered by `:hover` on desktop must have an equivalent tap-triggered path on mobile. Tooltips must be replaced with inline text or tap-to-reveal on mobile.

5. **Visible Breathing Room**: Every screen must have visible padding between content blocks. Wall-to-wall content is a violation. Minimum page horizontal padding: `px-4` (16px).

6. **Bottom Navigation**: The `BottomNav` component is visible only on mobile (`md:hidden`). Desktop uses the `Sidebar` component.

7. **Font Minimum**: No text smaller than `text-court-xs` (10px) on any viewport.

### D.3 Component Hierarchy

```
Level 1: Design Tokens (tailwind.config.ts)
  |
Level 2: UI Primitives (src/components/ui/index.tsx)
  |       EmptyState, Skeleton, Button, Card, Badge, Input
  |
Level 3: Shared Components (src/components/shared/)
  |       BottomNav, Sidebar, Header, PageShell
  |
Level 4: Feature Components (src/components/{feature}/)
  |       landing/, video/, guards/
  |
Level 5: Page Components (src/app/(app)/{route}/page.tsx)
```

**Rules**:
- Level 5 may import from Levels 1-4.
- Level 4 may import from Levels 1-3.
- Level 3 may import from Levels 1-2.
- Level 2 may import from Level 1 only.
- No lateral imports within the same level unless explicitly co-located.
- Circular imports are a build-blocking violation.

### D.4 Design Drift Detection Checklist

Run this checklist before every PR that touches visual elements. Mark each item PASS or FAIL.

```
DESIGN DRIFT DETECTION CHECKLIST
=================================
Date: ___________
PR: #___________
Reviewer: ___________

[ ] 1. All colours reference Tailwind tokens (no raw hex except where technically required)
[ ] 2. All font sizes use court-* tokens (no arbitrary text-[Npx])
[ ] 3. All border radii use rounded-court or rounded-xl (no arbitrary rounded-[Npx])
[ ] 4. All icons are Lucide React components (no emoji, no SVG files, no icon fonts)
[ ] 5. Heading text uses font-serif (Cormorant Garamond)
[ ] 6. Body text uses font-sans (DM Sans)
[ ] 7. Gold accent uses text-gold or bg-gold (not hardcoded #C9A84C)
[ ] 8. Mobile viewport has one primary CTA above fold
[ ] 9. All tap targets >= 44px
[ ] 10. No hover-only interactions
[ ] 11. Page has visible padding (not wall-to-wall)
[ ] 12. Empty states use the EmptyState component
[ ] 13. Loading states use the Skeleton component
[ ] 14. Tone is institutional (no exclamation marks, no hype language)
[ ] 15. Terminology uses Advocate/Chamber/Session/Follow

RESULT: ___ / 15 PASS
THRESHOLD: 15/15 required for merge
```

### D.5 UI Consistency Scorecard

This scorecard evaluates overall design system compliance across the application. Conduct monthly.

| Dimension | Weight | Criteria | Score (0-10) |
|-----------|--------|----------|-------------|
| Colour Compliance | 20% | All colours from token palette | |
| Typography Compliance | 15% | All text uses court-* sizes, correct font families | |
| Spacing Consistency | 15% | Consistent padding/margin patterns across pages | |
| Component Reuse | 15% | UI primitives used instead of custom implementations | |
| Icon Consistency | 10% | All icons from Lucide React, consistent sizing | |
| Animation Consistency | 10% | Animations use defined tokens, no arbitrary durations | |
| Terminology Compliance | 10% | All copy uses Advocate/Chamber/Session/Follow | |
| Mobile Compliance | 5% | All pages pass mobile-first rules | |

**Scoring**: Multiply each dimension score by its weight. Sum for total.
**Passing Threshold**: 8.0 / 10.0 weighted average.
**Failing Action**: File a design debt task in TASK.md for each dimension below 7.0.

---

## E. AI and Skills Framework

### E.1 AI Architecture Overview

RATIO employs AI across multiple surfaces. The AI Judge is the centrepiece -- a conversational opponent and evaluator that simulates judicial questioning for moot court practice.

**Provider Strategy**:
- **Primary**: Claude Sonnet (Anthropic) -- legal reasoning, judgment generation, argument evaluation
- **Fallback**: GPT-4o-mini (OpenAI) -- activated when Claude is unavailable or rate-limited
- **Speech**: Whisper (OpenAI) -- speech-to-text for oral advocacy practice
- **Translation** (Future): Gemini (Google) -- multilingual support for international Advocates

### E.2 Required AI Skills

| Skill | Location | Provider | Status |
|-------|----------|----------|--------|
| AI Judge | `convex/ai.ts` | Claude Sonnet / GPT-4o-mini | Active |
| AI Practice Sessions | `convex/aiSessions.ts` | Claude Sonnet | Active |
| Case Brief Generator | `src/app/(app)/tools/` | Claude Sonnet | Planned (Day 12) |
| Argument Builder | `src/app/(app)/tools/` | Claude Sonnet | Planned (Day 12) |
| Research Assistant | `src/app/(app)/research/` | Claude Sonnet | Planned |
| Session Transcript Summary | `convex/videoSessions.ts` | Claude Sonnet | Planned |
| Moderation Review | `convex/governance/` | Claude Sonnet | Planned |

### E.3 AI Folder Structure

```
convex/
|-- ai.ts                    # Core AI Judge logic
|-- aiSessions.ts            # AI practice session CRUD and scoring
|-- ai/
|   |-- router.ts            # Multi-provider routing and fallback logic
|   |-- prompts/
|   |   |-- judge.ts         # AI Judge system prompts
|   |   |-- mentor.ts        # AI Mentor system prompts
|   |   |-- examiner.ts      # AI Examiner system prompts
|   |   |-- brief.ts         # Case brief generation prompts
|   |   |-- argument.ts      # Argument builder prompts
|   |-- scoring.ts           # Rubric and scoring logic
|   |-- moderation.ts        # Content moderation AI

src/lib/ai/
|-- client.ts                # Client-side AI utilities
|-- types.ts                 # AI-related TypeScript interfaces
```

### E.4 Naming Conventions for AI Skills

| Element | Convention | Example |
|---------|-----------|---------|
| Prompt file | `{skillName}.ts` | `judge.ts`, `mentor.ts` |
| Prompt constant | `SYSTEM_PROMPT_{SKILL}_{MODE}` | `SYSTEM_PROMPT_JUDGE_CRIMINAL` |
| Backend function | `ai.{action}` | `ai.generateJudgment`, `ai.scoreArgument` |
| Frontend hook | `useAi{Skill}` | `useAiJudge`, `useAiBrief` |
| Store (if needed) | `ai{Skill}Store.ts` | `aiJudgeStore.ts` |

### E.5 Prompt Template Standard

Every AI prompt must follow this structure:

```typescript
// convex/ai/prompts/{skill}.ts

export const SYSTEM_PROMPT_JUDGE_DEFAULT = `
You are a senior member of the English judiciary presiding over a moot court.

CONTEXT:
- Area of law: {areaOfLaw}
- Case: {caseTitle}
- Advocate's position: {position}

INSTRUCTIONS:
1. ...
2. ...

SCORING RUBRIC:
- Argument Structure (0-100): ...
- Use of Authorities (0-100): ...
- Oral Delivery (0-100): ...
- Judicial Handling (0-100): ...
- Court Manner (0-100): ...
- Persuasiveness (0-100): ...
- Time Management (0-100): ...

OUTPUT FORMAT:
Return JSON matching the scores schema defined in convex/schema.ts aiSessions table.
`;
```

### E.6 Skill Governance Model

| Decision | Authority | Escalation |
|----------|-----------|-----------|
| New prompt wording | AI Lead | Project Lead if it changes scoring rubric |
| New AI skill addition | Project Lead | -- |
| Provider change | Project Lead | -- |
| Scoring rubric modification | Project Lead + AI Lead | Requires LOGS.md entry |
| Prompt injection mitigation | AI Lead | Immediate action permitted |
| Cost threshold exceeded | AI Lead | Project Lead within 24 hours |

**Cost Controls**:
- All AI calls must log token usage.
- Claude Sonnet is the primary provider. GPT-4o-mini is for fallback only.
- Maximum single-request token budget: 4,096 output tokens.
- Rate limiting: maximum 20 AI requests per Advocate per hour.

---

## F. Governance and Risk Model

### F.1 Decision Logging

Every significant decision must be recorded. The thresholds for "significant" are:

| Category | Threshold | Record In |
|----------|-----------|----------|
| Architecture change | Any new folder, file pattern, or dependency | LOGS.md + TASK.md |
| Schema change | Any table or field added/modified/removed | LOGS.md + convex/schema.ts comment |
| Design token change | Any colour, font, spacing, or animation token | LOGS.md + tailwind.config.ts |
| Dependency change | Any package added or major version bumped | LOGS.md + package.json |
| AI prompt change | Any system prompt modification | LOGS.md |
| Governance rule change | Any UPOS amendment | UPOS.md version increment + LOGS.md |
| Route addition | Any new page or API route | TASK.md + LOGS.md |

Decision log entry format:
```
Decision: [What was decided]
Rationale: [Why this option was chosen]
Alternatives Considered: [What else was evaluated]
Impact: [What this affects]
Reversibility: [Easy / Medium / Hard / Irreversible]
```

### F.2 Approval Hierarchy

| Action | Required Approval | Veto Authority |
|--------|------------------|---------------|
| Bug fix (no API change) | Self-approval | -- |
| UI component change | Design Lead | Project Lead |
| New page/route | Frontend Lead | Project Lead |
| Schema modification | Backend Lead | Project Lead |
| New dependency | Project Lead | -- |
| AI prompt change | AI Lead | Project Lead |
| UPOS amendment | Project Lead | -- |
| Production hotfix | Any lead | Project Lead (post-hoc review within 24h) |
| Dependency removal | Project Lead | -- |

### F.3 Version Discipline

**Application Versioning** (package.json):
- Format: `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes, schema migrations, auth system changes
- MINOR: New features, new pages, new AI skills
- PATCH: Bug fixes, copy changes, style adjustments

**UPOS Versioning**:
- Same MAJOR.MINOR.PATCH format
- MAJOR: Structural reorganisation of governance
- MINOR: New section or significant rule change
- PATCH: Clarification, typo fix, example addition

### F.4 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Convex schema migration breaks production | Medium | Critical | Always test schema changes against seed data before deploy |
| AI provider outage | Medium | High | Dual-provider fallback (Claude -> GPT-4o-mini) |
| Design drift across 42 routes | High | Medium | Monthly UI Consistency Scorecard, PR Design Drift Checklist |
| Scope creep from feature ideas | High | Medium | SUGGESTIONS.md as parking lot, strict phase gates |
| Environment variable leak | Low | Critical | .env.local in .gitignore, Vercel env management only |
| Tailwind class conflicts | Medium | Low | Strict token-only policy, tailwind-merge for conflicts |
| Bundle size growth | Medium | Medium | Evaluate with @next/bundle-analyzer after Day 14 |

### F.5 Change Management Protocol

**For any change to this UPOS**:

1. **Proposal**: Draft the amendment with rationale in a markdown file or PR description.
2. **Review**: Project Lead reviews within 48 hours.
3. **Approval**: Project Lead approves or requests changes.
4. **Implementation**: Update UPOS.md with new version number.
5. **Notification**: Log the change in LOGS.md with `[UPOS Amendment]` tag.
6. **Effective Date**: Changes take effect immediately upon merge to `main`.

---

## G. Git and Deployment Protocol

### G.1 Branch Naming Convention

```
{type}/{day-or-scope}/{description}

Types:
  feat/     New feature or page
  fix/      Bug fix
  style/    Design or styling change (no logic)
  refactor/ Code restructure (no behaviour change)
  docs/     Documentation only
  chore/    Build, config, dependency updates
  ai/       AI prompt or skill changes
  schema/   Convex schema changes

Examples:
  feat/day-9/law-book-module-index
  fix/sessions/role-claiming-state
  style/day-3/emoji-to-lucide-icons
  refactor/stores/migrate-auth-to-convex
  ai/judge/criminal-law-prompts
  schema/governance/tribunal-tables
```

### G.2 Commit Message Framework

```
{type}({scope}): {description}

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`, `ai`, `schema`

**Scope**: The affected area -- a route name, component name, or system name.

**Rules**:
- Subject line maximum 72 characters.
- Use imperative mood ("Add", not "Added" or "Adds").
- No period at the end of the subject line.
- Body wraps at 80 characters.
- Reference TASK.md items where applicable.

**Examples**:
```
feat(law-book): Add module index page with topic listing

Implements /law-book route with grid layout showing all modules.
Uses Convex query api.lawBookModules.list for real-time data.
Includes EmptyState for modules with no published topics.

Ref: TASK.md Day 9 - Law Book module index
```

```
fix(sessions): Resolve role claiming race condition

Multiple Advocates could claim the same role simultaneously.
Added optimistic locking via Convex mutation with version check.
```

```
style(global): Replace 88 emoji instances with Lucide icons

Systematic replacement across 13 files.
Created centralised icon mapping in src/lib/constants/icons.tsx.

Ref: TASK.md Day 3
```

### G.3 Pull Request Template

Every PR must use this structure:

```markdown
## Summary
<!-- One to three sentences describing what this PR does and why -->

## Type
<!-- Check one -->
- [ ] Feature (new functionality)
- [ ] Fix (bug correction)
- [ ] Style (visual change, no logic)
- [ ] Refactor (code change, no behaviour change)
- [ ] Docs (documentation only)
- [ ] Chore (build, config, dependencies)
- [ ] AI (prompt or skill change)
- [ ] Schema (database change)

## Changes
<!-- Bulleted list of specific changes -->

## Files Modified
<!-- List key files touched -->

## Testing
<!-- How was this tested? -->
- [ ] Manual testing on mobile viewport (375px)
- [ ] Manual testing on desktop viewport (1280px)
- [ ] Convex functions tested locally
- [ ] No TypeScript errors (`npm run build`)
- [ ] No lint errors (`npm run lint`)

## Design Drift Checklist
<!-- If this PR touches visual elements, complete Section D.4 checklist -->
- [ ] Design Drift Detection Checklist completed (15/15)
- [ ] N/A (no visual changes)

## Screenshots
<!-- Before/after screenshots if visual changes -->

## TASK.md Updated
- [ ] Yes -- items marked complete
- [ ] N/A
```

### G.4 Pre-Merge Enforcement Checklist

Before any PR is merged to `main`:

```
PRE-MERGE ENFORCEMENT CHECKLIST
=================================

BUILD
[ ] 1. `npm run build` completes without errors
[ ] 2. `npm run lint` completes without errors
[ ] 3. No TypeScript errors reported
[ ] 4. No console.log statements in committed code (except development utilities)

DESIGN
[ ] 5. Design Drift Detection Checklist passed (15/15) OR N/A
[ ] 6. Mobile viewport tested at 375px width
[ ] 7. Desktop viewport tested at 1280px width

DOCUMENTATION
[ ] 8. TASK.md updated with completed items
[ ] 9. LOGS.md entry added (if end of session)
[ ] 10. PLAN.md updated (if phase completed)

SCHEMA (if applicable)
[ ] 11. convex/schema.ts changes are backward-compatible OR migration plan documented
[ ] 12. Seed data updated in convex/seed.ts

AI (if applicable)
[ ] 13. Prompt changes tested with sample inputs
[ ] 14. Fallback provider tested

SECURITY
[ ] 15. No environment variables or secrets in committed code
[ ] 16. No API keys in source files
[ ] 17. .env.local is in .gitignore

RESULT: ALL items must PASS or N/A for merge approval
```

### G.5 Deployment Protocol

**Platform**: Vercel
**Production Branch**: `main`
**Preview Deployments**: Automatic on every PR

| Step | Action | Owner |
|------|--------|-------|
| 1 | PR created from feature branch | Developer |
| 2 | Vercel preview deployment auto-triggered | Vercel |
| 3 | Pre-Merge Checklist completed | Developer |
| 4 | Code review (if team > 1) | Reviewer |
| 5 | Merge to `main` | Developer / Reviewer |
| 6 | Vercel production deployment auto-triggered | Vercel |
| 7 | Post-deploy verification on production URL | Developer |
| 8 | LOGS.md updated | Developer |

**Rollback Protocol**:
- Vercel supports instant rollback to any previous deployment.
- If production is broken: revert the merge commit on `main` immediately.
- Document the incident in LOGS.md with `[INCIDENT]` tag.

**Environment Variables** (managed exclusively in Vercel dashboard):
- `NEXT_PUBLIC_CONVEX_URL` -- Convex deployment URL
- `CONVEX_DEPLOY_KEY` -- Convex deployment key (server-side only)
- `ANTHROPIC_API_KEY` -- Claude API key (server-side only)
- `OPENAI_API_KEY` -- OpenAI API key (server-side only)
- `DAILY_API_KEY` -- Daily.co video API key (server-side only)

---

## H. Automation Layer

### H.1 Lint Rules

The project uses Next.js built-in ESLint configuration (`npm run lint`).

**Required Rules** (enforce via `.eslintrc.json` or `next.config.js`):

| Rule | Setting | Rationale |
|------|---------|-----------|
| `no-console` | warn (error in CI) | No stray console.log in production |
| `@typescript-eslint/no-explicit-any` | warn | Prefer typed interfaces |
| `@typescript-eslint/no-unused-vars` | error | Dead code removal |
| `react-hooks/exhaustive-deps` | warn | Correct hook dependencies |
| `@next/next/no-img-element` | error | Use Next.js Image component |

### H.2 CI Checks

Configure in Vercel build settings and/or GitHub Actions:

```yaml
# .github/workflows/ci.yml (recommended)
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  required-files:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check required files exist
        run: |
          files=(
            "CLAUDE.md"
            "PLAN.md"
            "TASK.md"
            "SUGGESTIONS.md"
            "LOGS.md"
            "UPOS.md"
            "convex/schema.ts"
            "tailwind.config.ts"
            "src/app/layout.tsx"
            "src/app/globals.css"
            "package.json"
          )
          for file in "${files[@]}"; do
            if [ ! -f "$file" ]; then
              echo "MISSING REQUIRED FILE: $file"
              exit 1
            fi
          done
          echo "All required files present."

  terminology:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for prohibited terminology
        run: |
          # Check for common violations in tsx/ts files (case-insensitive, word boundary)
          violations=0
          # "subscriber" check (but not in node_modules or .next)
          if grep -rn --include="*.tsx" --include="*.ts" -w "subscriber" src/ 2>/dev/null; then
            echo "VIOLATION: Use 'Advocate' instead of 'subscriber'"
            violations=$((violations + 1))
          fi
          if grep -rn --include="*.tsx" --include="*.ts" '"Sign up"' src/ 2>/dev/null; then
            echo "VIOLATION: Use 'Join as an Advocate' instead of 'Sign up'"
            violations=$((violations + 1))
          fi
          if [ $violations -gt 0 ]; then
            echo "Found $violations terminology violations"
            exit 1
          fi
          echo "Terminology check passed."
```

### H.3 Required File Validation

The `required-files` CI job (above) enforces that all mandatory files from Section B.3 exist on every PR. If any file is missing, the PR cannot be merged.

### H.4 README Completeness (Informational)

While this UPOS does not mandate a README.md, if one exists it should contain:

1. Project name and one-line description
2. Tech stack summary
3. Local development setup instructions (`npm install`, `npm run dev`)
4. Environment variable list (names only, no values)
5. Deployment information

---

## I. Onboarding System

### I.1 New Contributor Launch Checklist

When a new developer or AI agent joins the project:

```
NEW CONTRIBUTOR LAUNCH CHECKLIST
=================================
Contributor: ___________
Date: ___________

READING (Complete before writing any code)
[ ] 1. Read CLAUDE.md (AI agent instructions and conventions)
[ ] 2. Read PLAN.md (current roadmap and phase status)
[ ] 3. Read TASK.md (current work items and pending tasks)
[ ] 4. Read UPOS.md Sections A-D (summary, architecture, files, design)
[ ] 5. Read convex/schema.ts (understand all 39 database tables)
[ ] 6. Read tailwind.config.ts (understand all design tokens)
[ ] 7. Read src/app/layout.tsx (understand root layout and providers)
[ ] 8. Read src/components/ui/index.tsx (understand available UI primitives)

ENVIRONMENT
[ ] 9. Node.js 20+ installed
[ ] 10. npm install completed without errors
[ ] 11. Convex CLI available (npx convex)
[ ] 12. Environment variables configured (.env.local)
[ ] 13. npm run dev starts both frontend and backend
[ ] 14. Application loads at localhost:3000

VERIFICATION
[ ] 15. Can navigate to /home, /sessions, /profile
[ ] 16. BottomNav visible on mobile viewport
[ ] 17. Sidebar visible on desktop viewport
[ ] 18. Understands the Advocate/Chamber/Session terminology
[ ] 19. Knows where to log decisions (LOGS.md)
[ ] 20. Knows where to park ideas (SUGGESTIONS.md)
```

### I.2 60-Minute Setup Template

For a developer starting from zero:

```
MINUTE 0-10: Environment
  - Clone the repository
  - Run: npm install
  - Create .env.local with required variables
  - Run: npm run dev
  - Verify localhost:3000 loads

MINUTE 10-25: Read Core Documents
  - CLAUDE.md (5 min) -- understand conventions
  - PLAN.md (3 min) -- understand current phase
  - TASK.md (5 min) -- understand pending work
  - UPOS.md Section A (2 min) -- understand governance

MINUTE 25-40: Explore the Codebase
  - Open src/app/(app)/ -- see all 42 routes
  - Open convex/schema.ts -- see all 39 tables
  - Open tailwind.config.ts -- see design tokens
  - Open src/components/ui/index.tsx -- see available components
  - Open src/stores/ -- see client state management

MINUTE 40-55: Run Through Key Flows
  - Landing page (src/app/page.tsx)
  - Home dashboard (src/app/(app)/home/page.tsx)
  - Session creation (src/app/(app)/sessions/create/page.tsx)
  - AI Practice (src/app/(app)/ai-practice/page.tsx)
  - Profile (src/app/(app)/profile/page.tsx)

MINUTE 55-60: Orientation Complete
  - Identify your first task from TASK.md
  - Confirm you understand the Design Drift Checklist
  - Confirm you know the commit message format
  - Begin work
```

### I.3 Repo Cloning Protocol

```bash
# 1. Clone the repository
git clone https://github.com/giquina/RATIO.-The-Digital-Court-Society.git
cd RATIO.-The-Digital-Court-Society

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local  # if .env.example exists
# Otherwise, create .env.local with:
#   NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
#   CONVEX_DEPLOY_KEY=<your-convex-deploy-key>
#   ANTHROPIC_API_KEY=<your-anthropic-api-key>
#   OPENAI_API_KEY=<your-openai-api-key>
#   DAILY_API_KEY=<your-daily-co-api-key>

# 4. Set up Convex (first time only)
npx convex dev --once  # Push schema and functions

# 5. Start development servers (frontend + backend in parallel)
npm run dev
# This runs: npm-run-all --parallel dev:frontend dev:backend
# Frontend: next dev (localhost:3000)
# Backend: convex dev (watches for changes)

# 6. Verify
# Open http://localhost:3000 in your browser
# You should see the RATIO landing page
```

### I.4 AI Agent Session Start Protocol

Every AI coding session must begin with:

```
1. Read CLAUDE.md -- load project conventions
2. Read PLAN.md -- understand current phase
3. Read TASK.md -- identify current and pending work
4. Read SUGGESTIONS.md -- be aware of deferred ideas
5. Read LOGS.md (last 2 sessions) -- understand recent context
6. Identify the first task to work on
7. Begin work
```

Every AI coding session must end with:

```
1. Update TASK.md -- mark completed items, add new items discovered
2. Update PLAN.md -- if a phase was completed, update status
3. Add new ideas to SUGGESTIONS.md -- if any surfaced during work
4. Append to LOGS.md -- date, what was done, decisions, issues, next steps
```

---

## J. Project Health Index

### J.1 Overview

The Project Health Index (PHI) is a composite score measuring the overall health of the RATIO project across six dimensions. It is calculated monthly and tracked over time.

**Scale**: 0-100 (higher is better)
**Passing Threshold**: 70/100
**Target**: 85/100

### J.2 Scoring Dimensions

#### J.2.1 Design Health (20 points)

| Criterion | Points | How to Assess |
|-----------|--------|--------------|
| All colours from token palette | 4 | Grep for raw hex in src/ (excluding tailwind.config.ts) |
| All fonts use court-* tokens | 4 | Grep for arbitrary text-[Npx] in src/ |
| All icons are Lucide React | 4 | Grep for emoji characters in src/ |
| All pages pass mobile-first rules | 4 | Manual check: 44px targets, one CTA, breathing room |
| UI Consistency Scorecard >= 8.0 | 4 | Run Section D.5 scorecard |

#### J.2.2 Documentation Health (15 points)

| Criterion | Points | How to Assess |
|-----------|--------|--------------|
| CLAUDE.md exists and is current | 3 | File exists, updated within 30 days |
| PLAN.md exists and is current | 3 | File exists, phase status matches reality |
| TASK.md exists and is current | 3 | File exists, no stale "In Progress" items > 7 days |
| LOGS.md has recent entries | 3 | Last entry within 7 days of last commit |
| UPOS.md exists and is versioned | 3 | File exists, version number present |

#### J.2.3 Deployment Health (20 points)

| Criterion | Points | How to Assess |
|-----------|--------|--------------|
| `npm run build` passes | 5 | Run build, zero errors |
| `npm run lint` passes | 5 | Run lint, zero errors |
| No TypeScript errors | 5 | Build output shows no type errors |
| Vercel production deploy is current | 5 | Production matches latest `main` commit |

#### J.2.4 Governance Health (15 points)

| Criterion | Points | How to Assess |
|-----------|--------|--------------|
| All recent commits follow message format | 3 | Check last 20 commits against Section G.2 |
| Branch naming follows convention | 3 | Check active branches against Section G.1 |
| Decision log entries exist for schema/design changes | 3 | Cross-reference LOGS.md with recent diffs |
| No secrets in committed code | 3 | Grep for API key patterns in source |
| UPOS version matches latest amendment | 3 | Verify version number is current |

#### J.2.5 AI Health (15 points)

| Criterion | Points | How to Assess |
|-----------|--------|--------------|
| AI Judge responds correctly | 5 | Manual test with sample legal argument |
| Fallback provider activates on primary failure | 5 | Simulate primary provider timeout |
| Prompt templates follow Section E.5 format | 5 | Review convex/ai/ files against template |

#### J.2.6 UX Health (15 points)

| Criterion | Points | How to Assess |
|-----------|--------|--------------|
| All pages have loading states (Skeleton) | 3 | Navigate each route with slow network |
| All empty collections show EmptyState | 3 | Check routes with no data |
| No dead buttons or non-functional links | 3 | Click every interactive element |
| Terminology is correct throughout | 3 | Search for prohibited terms |
| Tone is institutional (no exclamation marks in UI) | 3 | Search for "!" in user-facing strings |

### J.3 Project Health Index Calculation

```
PHI = Design + Documentation + Deployment + Governance + AI + UX
    = (D/20 * 20) + (Doc/15 * 15) + (Dep/20 * 20) + (Gov/15 * 15) + (AI/15 * 15) + (UX/15 * 15)
    = Sum of all earned points (max 100)
```

### J.4 Health Index Reporting Template

```markdown
## Project Health Index -- YYYY-MM-DD

| Dimension | Earned | Maximum | Percentage |
|-----------|--------|---------|-----------|
| Design | __/20 | 20 | __% |
| Documentation | __/15 | 15 | __% |
| Deployment | __/20 | 20 | __% |
| Governance | __/15 | 15 | __% |
| AI | __/15 | 15 | __% |
| UX | __/15 | 15 | __% |
| **TOTAL** | **__/100** | **100** | **__%** |

**Status**: PASS / FAIL (threshold: 70)
**Trend**: Improving / Stable / Declining (vs. previous month)

### Action Items
1. [Dimension]: [Specific improvement needed]
2. ...
```

---

## K. Master Enforcement Checklist

This checklist consolidates all enforcement points from the UPOS into a single reference. Use it for periodic audits or before major releases.

### K.1 Architecture Compliance

```
[ ] All folders match Section B.1 structure
[ ] All required files from Section B.3 exist
[ ] No files in prohibited locations (e.g., components in pages, stores in components)
[ ] Component hierarchy (Section D.3) is respected -- no upward imports
[ ] All pages use "use client" directive
[ ] Convex queries use useQuery(api.module.function) pattern
[ ] Convex mutations use useMutation(api.module.function) pattern
[ ] State management uses Zustand stores in src/stores/
[ ] Constants are in src/lib/constants/app.ts
[ ] Helpers are in src/lib/utils/helpers.ts
```

### K.2 Design Compliance

```
[ ] All colours reference Tailwind tokens from tailwind.config.ts
[ ] All font sizes use court-* semantic tokens
[ ] All border radii use rounded-court or rounded-xl
[ ] All icons are Lucide React components -- zero emoji in UI
[ ] Headings use font-serif (Cormorant Garamond)
[ ] Body text uses font-sans (DM Sans)
[ ] Gold accent uses text-gold / bg-gold (no hardcoded #C9A84C except CSS gradients)
[ ] Every mobile screen has one primary CTA
[ ] All tap targets are >= 44px
[ ] No hover-only interactions exist
[ ] Every page has visible breathing room (padding)
[ ] Empty states use the EmptyState component from src/components/ui/index.tsx
[ ] Loading states use the Skeleton component from src/components/ui/index.tsx
[ ] Tone is institutional -- no exclamation marks, no hype language
[ ] All copy uses Advocate / Chamber / Session / Follow terminology
```

### K.3 Documentation Compliance

```
[ ] CLAUDE.md exists with all 7 required sections (Section C.1)
[ ] PLAN.md exists with all 5 required sections (Section C.2)
[ ] TASK.md exists with all 4 required sections (Section C.3)
[ ] SUGGESTIONS.md exists with all 5 required sections (Section C.4)
[ ] LOGS.md exists and has entries for all recent sessions (Section C.5)
[ ] UPOS.md exists with current version number
[ ] TASK.md has no "In Progress" items older than 7 days without explanation
[ ] LOGS.md last entry is within 7 days of last commit
```

### K.4 Git and Deployment Compliance

```
[ ] All branches follow naming convention (Section G.1)
[ ] All commits follow message framework (Section G.2)
[ ] PRs use the required template (Section G.3)
[ ] Pre-Merge Checklist is completed for every PR (Section G.4)
[ ] npm run build passes without errors
[ ] npm run lint passes without errors
[ ] No TypeScript errors
[ ] No console.log statements in production code
[ ] No environment variables or secrets in committed code
[ ] .env.local is in .gitignore
[ ] Vercel production deployment matches latest main commit
```

### K.5 AI Compliance

```
[ ] AI Judge uses Claude Sonnet as primary provider
[ ] Fallback to GPT-4o-mini is configured and tested
[ ] All prompt templates follow Section E.5 format
[ ] Prompt file naming follows Section E.4 conventions
[ ] Token usage is logged for all AI calls
[ ] Rate limiting is enforced (20 requests/Advocate/hour)
[ ] No API keys in source code
```

### K.6 Governance Compliance

```
[ ] All schema changes are logged in LOGS.md
[ ] All design token changes are logged in LOGS.md
[ ] All dependency changes are logged in LOGS.md
[ ] Approval hierarchy (Section F.2) is followed
[ ] UPOS amendments follow the change management protocol (Section F.5)
[ ] Risk register (Section F.4) is reviewed monthly
```

### K.7 UX Compliance

```
[ ] All pages have loading states
[ ] All empty collections show EmptyState
[ ] No dead buttons or non-functional links
[ ] Forms have validation and error states
[ ] Navigation flows are logical (no dead ends)
[ ] BottomNav shows on mobile only (md:hidden)
[ ] Sidebar shows on desktop only
[ ] Page transitions use Framer Motion (SSR-safe)
```

---

## Appendix A: Quick Reference Card

```
RATIO. -- The Digital Court Society
Stack: Next.js 14 + Convex + Tailwind CSS + Zustand + Framer Motion + Lucide React
Deploy: Vercel
Repo: github.com/giquina/RATIO.-The-Digital-Court-Society

COLOURS
  Background:  #0C1220   (bg-navy)
  Card:        #182640   (bg-navy-card)
  Mid:         #131E30   (bg-navy-mid)
  Light:       #1E3050   (bg-navy-light)
  Gold:        #C9A84C   (text-gold / bg-gold)
  Burgundy:    #6B2D3E   (text-burgundy / bg-burgundy)
  Text:        #F2EDE6   (text-court-text)
  Text Sec:    60%       (text-court-text-sec)
  Text Ter:    30%       (text-court-text-ter)

FONTS
  Headings:    Cormorant Garamond (font-serif)
  Body:        DM Sans (font-sans)

SIZES
  XS: 10px  SM: 11px  Base: 13px  MD: 15px  LG: 16px  XL: 18px

TERMINOLOGY
  User -> Advocate
  Team -> Chamber
  Match -> Session
  Subscribe -> Follow

FILES TO READ EVERY SESSION
  1. CLAUDE.md    2. PLAN.md    3. TASK.md
  4. SUGGESTIONS.md    5. LOGS.md

COMMIT FORMAT
  type(scope): description
  Types: feat fix style refactor docs chore ai schema
```

---

## Appendix B: Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0.0 | 2026-02-22 | Project Lead | Initial UPOS ratification |

---

*This document governs the RATIO project in its entirety. Compliance is not optional. When in doubt, refer to the principle: Premium is restraint.*

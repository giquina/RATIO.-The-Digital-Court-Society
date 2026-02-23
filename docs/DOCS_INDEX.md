# Documentation Index

> **Project:** Ratio — The Digital Court Society
> **Audience:** Contributors, maintainers, and auditors
> **Last updated:** 2026-02-23

---

## Root-Level Documentation

| File | Purpose | Status |
|------|---------|--------|
| [README.md](../README.md) | Project overview, quick start, tech stack | Accurate |
| [CLAUDE.md](../CLAUDE.md) | AI coding agent guidance (commands, architecture, design system) | Accurate |
| [PLAN.md](../PLAN.md) | High-level development roadmap and phase tracking | Accurate |
| [TASK.md](../TASK.md) | Detailed task checklist with completion dates | Accurate |
| [LOGS.md](../LOGS.md) | Per-session development logs | Accurate |
| [SUGGESTIONS.md](../SUGGESTIONS.md) | Deferred feature ideas and backlog | Accurate |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | System architecture, route structure, design system | Accurate |
| [SECURITY.md](../SECURITY.md) | Security architecture and vulnerability reporting | Accurate |
| [SECURITY-ASSESSMENT.md](../SECURITY-ASSESSMENT.md) | Full security audit report (Feb 2026) | Accurate |
| [UPOS.md](../UPOS.md) | Universal Project Operating System — binding governance | Accurate |

## Documentation Directory (`docs/`)

| File | Purpose | Status |
|------|---------|--------|
| [DOCS_INDEX.md](./DOCS_INDEX.md) | This file — documentation map | Accurate |
| [PRODUCT.md](./PRODUCT.md) | What Ratio is, who it is for, key flows | Accurate |
| [FAQ.md](./FAQ.md) | Student-focused frequently asked questions | Accurate |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | Accessibility commitments and standards | Accurate |
| [AI_JUDGE_COST_GUARDRAILS_PLAN.md](./AI_JUDGE_COST_GUARDRAILS_PLAN.md) | AI Judge cost control and rate limiting plan | Accurate |
| [TODO_AI_JUDGE_SECURITY.md](./TODO_AI_JUDGE_SECURITY.md) | AI Judge security implementation checklist | Accurate |

## Legal & Policy Pages (rendered in-app)

| Route | Source | Purpose |
|-------|--------|---------|
| `/privacy` | `src/app/privacy/page.tsx` | Privacy policy (GDPR-aligned) |
| `/terms` | `src/app/terms/page.tsx` | Terms of service |
| `/cookies` | `src/app/cookies/page.tsx` | Cookie policy |
| `/code-of-conduct` | `src/app/code-of-conduct/page.tsx` | Community code of conduct |
| `/contact` | `src/app/contact/page.tsx` | Contact information |

## Configuration & Environment

| File | Purpose |
|------|---------|
| `.env.example` | Environment variable template (no secrets) |
| `package.json` | Dependencies and npm scripts |
| `next.config.js` | Next.js configuration (Sentry wrapping, security headers) |
| `tailwind.config.ts` | Design system tokens (colours, fonts, spacing) |
| `convex/schema.ts` | Database schema (~40 tables) |
| `convex/auth.ts` | Authentication configuration (Password provider) |
| `.claude/launch.json` | Dev server launch configurations |

## CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/blank.yml` | GitHub Actions: lint, type check, build on push/PR |

## AI Agent Skills (`.claude/skills/`)

| Skill | Purpose |
|-------|---------|
| `governance-simulator` | Constitutional governance flow design |
| `institutional-copy` | Institutional tone copy review |
| `law-book-editorial` | Law Book content model and editorial |
| `mobile-ux-audit` | Mobile UX quality audit |
| `release-commander` | Release management checklists |
| `social-graph` | Follow/community system design |
| `student-verification` | Student identity verification design |

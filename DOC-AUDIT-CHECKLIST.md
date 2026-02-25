# RATIO — Documentation Audit: Action Checklist

**Generated:** 2026-02-24
**Scope:** All 17 project markdown files analysed for gaps and contradictions

---

## Priority 1: Fix False Claims (Do First)

SECURITY.md currently describes security features as implemented when they are not. This is the most urgent fix because it's a public-facing document that misrepresents the state of the app.

- [ ] **Rewrite SECURITY.md to reflect reality** — Currently states "All Convex mutations verify the caller's identity" (false — Finding-01), "Customer IDs are resolved server-side" (false — Finding-02), "mutations validate input strings against length limits" (false — Finding-05, `convex/lib/validation.ts` doesn't exist), "Password reset tokens are only logged in development mode" (false — Finding-03), "Only public profiles are returned by public-facing queries" (false — Finding-06). Either rewrite to describe current state honestly, or add a "Planned" label to each aspiration.
- [ ] **Decide: is the app "live" or "preview"?** — Landing page shows registration CTAs and pricing tiers, FAQ says "Registration is currently open to all," but Rankings/Chambers/Badges/Library are hardcoded, Stripe isn't built, and no .ac.uk verification exists. Pick one framing and make all docs consistent.
- [ ] **Remove or label unbuilt pricing** — The pricing section shows £5.99/£7.99 plans that cannot be purchased. Either remove it or add "Coming Soon" labels.

---

## Priority 2: Resolve Contradictions Across Docs

These are places where different files say different things about the same topic.

- [ ] **Align AI provider across all docs** — UPOS says "Claude Sonnet," AI_JUDGE_COST_GUARDRAILS says "Claude Haiku 4.5," README says "Claude / GPT-4o-mini." Pick one source of truth (likely CLAUDE.md) and update all others to match. This also affects the cost model — Haiku and Sonnet have very different pricing.
- [ ] **Standardise table count** — ARCHITECTURE.md says "35+", UPOS says "39", CLAUDE.md says "~40", SECURITY-ASSESSMENT says "35 tables, ~50 mutations." Count them once in `convex/schema.ts` and use that exact number everywhere.
- [ ] **Align route count** — UPOS says "42 routes," ARCHITECTURE.md says "19+," CLAUDE.md says "19 authenticated routes." Count once, use everywhere.
- [ ] **Update LOGS.md** — Missing entries for 23 Feb session (Mobile UX overhaul, demo credentials, auth infrastructure, referral system). The UPOS requires a log entry for every session.

---

## Priority 3: Right-Size the Governance

The UPOS is a 1,300-line governance constitution written for a multi-person team, but this appears to be a solo project.

- [ ] **Simplify UPOS for solo development** — Remove multi-person approval hierarchy (Backend Lead, Frontend Lead, AI Lead, Design Lead, Project Lead). Replace with a simpler single-developer protocol. Keep the useful parts (design tokens, terminology, file structure) and remove the bureaucratic parts (48-hour review windows, veto authorities, monthly scorecards you won't run).
- [ ] **Remove or defer unrunnable processes** — Monthly UI Consistency Scorecard, monthly Project Health Index, Design Drift Detection Checklist on every PR — none of these have been run. Either automate them or remove them until you have a team.
- [ ] **Decide what "binding" means** — UPOS says "This document is not advisory. It is binding." and "Compliance is not optional." But LOGS.md is already out of compliance (missing session 5 entry), the PR template hasn't been used, and no checklist has been completed. Either enforce it or soften the language.

---

## Priority 4: Fill Real Gaps

Things that are missing or incomplete and actually matter.

- [ ] **Add Stripe env vars to `.env.example`** — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PLUS_PRICE_ID` are used in code but not documented (Finding-09).
- [ ] **Create the `convex/lib/validation.ts` file** — SECURITY.md references it as the input validation source of truth, but it doesn't exist yet.
- [ ] **Create the `convex/lib/auth.ts` helper** — The `requireProfile(ctx)` pattern recommended by the security assessment. This is the single highest-impact security fix.
- [ ] **Document demo mode limitations** — No doc clearly tells a new user "if you sign up right now, here's what works and what doesn't." Consider a STATUS.md or a banner in the app.
- [ ] **Add the missing LOGS.md session 5 entry** — Cover the 23 Feb work: Mobile UX overhaul, demo credentials banner, auth infrastructure, referral system, PR #3.

---

## Priority 5: Housekeeping

Small inconsistencies that erode trust in the documentation over time.

- [ ] **README says "~£0.05/session"** — but Cost Guardrails says "$0.01-0.03/session" (Haiku pricing). These should match and use the same currency.
- [ ] **README Quick Start is missing a step** — says `npx convex dev` but UPOS says `npx convex dev --once` for first-time setup. Align them.
- [ ] **ACCESSIBILITY.md lists planned improvements with no timeline** — Either add target dates or move items to TASK.md so they're tracked.
- [ ] **DOCS_INDEX.md says all files are "Accurate"** — After this audit, several are not. Update status column.
- [ ] **FAQ question 9 ("What is a Chamber?")** — says "Your chamber is selected during onboarding" but doesn't mention if this is actually implemented in the current onboarding flow.

---

*Total items: 20*
*Estimated effort: 4-6 hours for Priorities 1-2, which are the most impactful.*

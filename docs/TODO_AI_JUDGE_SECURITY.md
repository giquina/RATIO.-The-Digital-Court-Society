# AI Judge Security & Cost Control — Execution Checklist

> Last updated: 2026-02-23
> Branch: feat/ai-guardrails-cost-protection

---

## SECTION 1 — Infrastructure Tasks

- [ ] Create `src/lib/ai/rate-limiter.ts` — in-memory rate limiter with IP + user tracking
  - Owner: Agent A
  - Status: Pending

- [ ] Create `src/lib/ai/token-budget.ts` — token caps, session limits, transcript truncation
  - Owner: Agent B
  - Status: Pending

- [ ] Create `src/lib/ai/validation.ts` — Zod schemas for all API inputs
  - Owner: Agent C
  - Status: Pending

- [ ] Create `src/lib/ai/usage-tracker.ts` — structured logging and cost tracking
  - Owner: Agent D
  - Status: Pending

---

## SECTION 2 — API Route Creation

- [ ] Create `src/app/api/ai/chat/route.ts` — chat endpoint with all guardrails integrated
  - Owner: Agent A + B + C
  - Status: Pending
  - Requirements: rate limiting, token caps, Zod validation, structured errors, usage logging

- [ ] Create `src/app/api/ai/feedback/route.ts` — feedback endpoint with all guardrails
  - Owner: Agent A + B + C
  - Status: Pending
  - Requirements: rate limiting, score validation (1.0-5.0 range), transcript truncation, usage logging

---

## SECTION 3 — Token Budget Controls

- [ ] Implement per-request max_tokens: 1024 (chat), 2048 (feedback)
  - Owner: Agent B
  - Status: Pending

- [ ] Implement per-session exchange limit: 30 messages max
  - Owner: Agent B
  - Status: Pending

- [ ] Implement sliding window: only last 10 exchanges sent to API
  - Owner: Agent B
  - Status: Pending

- [ ] Implement user message character limit: 2000 chars
  - Owner: Agent B + C
  - Status: Pending

- [ ] Implement daily platform budget cap: $10/day
  - Owner: Agent B + D
  - Status: Pending

---

## SECTION 4 — UI Changes

- [ ] Add session limit reached state to Moot Court page
  - Owner: Agent E
  - Status: Pending

- [ ] Add rate limit hit UI feedback
  - Owner: Agent E
  - Status: Pending

- [ ] Add graceful error/retry states
  - Owner: Agent E
  - Status: Pending

- [ ] Add exchange count indicator in session header
  - Owner: Agent E
  - Status: Pending

---

## SECTION 5 — Testing Checklist

- [ ] Verify `npm run build` passes with zero errors
  - Owner: All
  - Status: Pending

- [ ] Verify rate limiter rejects after threshold
  - Owner: Agent A
  - Status: Pending

- [ ] Verify token budget cuts off oversized inputs
  - Owner: Agent B
  - Status: Pending

- [ ] Verify Zod rejects malformed payloads
  - Owner: Agent C
  - Status: Pending

- [ ] Verify no secrets in API responses or console logs
  - Owner: Agent C + D
  - Status: Pending

- [ ] Verify UI gracefully handles all error states
  - Owner: Agent E
  - Status: Pending

---

## SECTION 6 — Deployment Checklist

- [ ] All files committed to `feat/ai-guardrails-cost-protection`
  - Status: Pending

- [ ] Branch pushed to origin
  - Status: Pending

- [ ] Build passes on Vercel preview
  - Status: Pending

- [ ] Merge to main
  - Status: Pending

- [ ] Verify production deployment
  - Status: Pending

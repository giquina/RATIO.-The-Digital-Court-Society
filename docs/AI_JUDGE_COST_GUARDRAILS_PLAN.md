# AI Judge — Cost Control & Security Guardrails Plan

## Overview

This document defines the cost-control, rate-limiting, and security hardening plan for Ratio's AI Judge feature. The AI Judge uses Claude Haiku 4.5 via two Next.js API routes (`/api/ai/chat` and `/api/ai/feedback`). Without guardrails, the platform is exposed to abuse, surprise API bills, and prompt injection.

## Architecture

```
User → /api/ai/chat (per-message) → Anthropic Claude Haiku 4.5
User → /api/ai/feedback (per-session) → Anthropic Claude Haiku 4.5
```

## Cost Model

- Claude Haiku 4.5: ~$0.25/M input, ~$1.25/M output tokens
- Estimated cost per session: ~$0.01-0.03 (10-15 exchanges)
- Free tier: 3 sessions/month/user
- Premium: unlimited

## Guardrail Layers

### Layer 1: Rate Limiting (Agent A)
- **Per-IP**: 20 requests/minute to `/api/ai/chat`, 5 requests/minute to `/api/ai/feedback`
- **Per-user**: 3 sessions/month (free tier), unlimited (premium)
- **Global**: 1000 requests/hour across all users (circuit breaker)
- **Implementation**: In-memory Map with TTL cleanup (no Redis dependency for MVP)
- **Response**: HTTP 429 with court-themed message

### Layer 2: Token & Budget Controls (Agent B)
- **Per-request**: max_tokens capped at 1024 (chat), 2048 (feedback)
- **Per-session**: max 30 exchanges (user messages). AI auto-concludes after 25.
- **Transcript truncation**: Only last 10 exchanges sent to API (sliding window)
- **Daily platform budget**: Hard stop at $10/day API spend (tracked in-memory)
- **Input guard**: User messages capped at 2000 characters

### Layer 3: Validation & Security (Agent C)
- **Zod schemas** on all API inputs (mode, messages array, caseContext)
- **Payload size**: Max 50KB per request body
- **Prompt injection defense**: System prompt isolation, user content clearly delimited
- **Error responses**: Structured JSON, no stack traces, no internal details
- **Environment**: ANTHROPIC_API_KEY validated at startup, not in response payloads

### Layer 4: Observability (Agent D)
- **Structured logs**: Request count, token usage, latency, error rate (no PII)
- **Usage counters**: In-memory per-user session count, resettable monthly
- **Cost tracking**: Approximate cost per request logged (input + output tokens * rate)
- **Thresholds**: Console warnings at 50%, 80%, 100% of daily budget

### Layer 5: UI/UX Handling (Agent E)
- **Session limit reached**: Courtroom-themed card with upgrade path
- **Rate limited**: "The court requires a brief recess" message
- **API error**: Graceful fallback with retry option
- **Budget exhausted**: "Court is adjourned for the day" message

## Files to Create/Modify

| File | Action | Owner |
|------|--------|-------|
| `src/app/api/ai/chat/route.ts` | CREATE | Agent A + B + C |
| `src/app/api/ai/feedback/route.ts` | CREATE | Agent A + B + C |
| `src/lib/ai/rate-limiter.ts` | CREATE | Agent A |
| `src/lib/ai/token-budget.ts` | CREATE | Agent B |
| `src/lib/ai/validation.ts` | CREATE | Agent C |
| `src/lib/ai/usage-tracker.ts` | CREATE | Agent D |
| `src/app/(app)/ai-practice/page.tsx` | MODIFY | Agent E |

## Constraints

- Zero TypeScript errors
- Build must pass (`npm run build`)
- No secrets in responses or logs
- No breaking existing AI Judge flow
- No external dependencies (Redis, KV) — in-memory for MVP
- All limits clearly documented in this file

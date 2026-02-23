# Security Assessment Report

**Application:** Ratio -- The Digital Court Society
**Domain:** ratiothedigitalcourtsociety.com
**Assessment Date:** 23 February 2026
**Assessor:** Security Audit (Automated + Manual Review)
**Classification:** CONFIDENTIAL -- Internal Use Only

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope and Methodology](#2-scope-and-methodology)
3. [Threat Model](#3-threat-model)
4. [Findings Report](#4-findings-report)
5. [Positive Security Controls](#5-positive-security-controls)
6. [Dependency Analysis](#6-dependency-analysis)
7. [Prioritised Remediation Plan](#7-prioritised-remediation-plan)
8. [Security Gates](#8-security-gates)
9. [Top 10 Fixes Checklist](#9-top-10-fixes-checklist)

---

## 1. Executive Summary

Ratio is a Next.js 14 application serving UK law students with moot court sessions, AI-powered practice, governance simulation, legal research, and video conferencing. The backend uses Convex (serverless database with real-time sync), Stripe for billing, Daily.co for video, Sentry for error tracking, and GA4 for analytics. Authentication is handled by `@convex-dev/auth` with a Password provider, alongside a demo in-memory auth system.

### Overall Risk Rating: HIGH

The application has strong perimeter defences (HSTS, security headers, Stripe webhook verification) but suffers from a systemic failure to enforce authorization at the data layer. Nearly every Convex mutation accepts a client-supplied `profileId` without verifying that the calling user owns that profile. This single class of vulnerability -- missing authorization checks -- affects at least 25 mutations across 7 files, making it the dominant risk.

### Summary of Findings

| Severity | Count | Description |
|----------|-------|-------------|
| CRITICAL | 2 | Missing authorization on all Convex mutations; Stripe portal IDOR |
| HIGH | 3 | Password reset tokens logged in production; in-memory auth with plaintext passwords and forgeable tokens; no input size validation |
| MEDIUM | 3 | Profile privacy bypass; no rate limiting on login/legal search; missing CSRF protection |
| LOW | 2 | Conditional React hook calls; undocumented Stripe env vars |

**Estimated effort to reach acceptable risk posture:** 2--4 weeks of focused engineering, with the most critical items addressable within 24 hours.

---

## 2. Scope and Methodology

### In Scope

- Source code review of all files in the repository (static analysis)
- Convex backend functions: mutations, queries, actions
- Next.js API routes under `src/app/api/`
- Authentication and session management
- Stripe integration (billing portal, webhooks)
- Frontend auth flow and route guards
- Security headers and deployment configuration
- Dependency audit

### Out of Scope

- Penetration testing against the live production environment
- Infrastructure-level review (Vercel, Convex cloud)
- Third-party service configuration (Stripe Dashboard, Daily.co admin, Sentry project settings)
- Mobile device testing
- Social engineering assessment

### Methodology

This assessment follows OWASP Testing Guide v4.2 and maps findings to:
- **CWE** (Common Weakness Enumeration) for precise vulnerability classification
- **OWASP Top 10:2021** for industry-standard risk categorization
- **CVSS 3.1** base scores for severity ranking

---

## 3. Threat Model

### 3.1 Assets

| Asset | Sensitivity | Location |
|-------|------------|----------|
| User credentials (passwords) | Critical | In-memory Map (`src/app/api/auth/route.ts`), Convex users table |
| Student PII (names, universities, year of study) | High | Convex `profiles` table |
| Stripe customer IDs and billing data | Critical | Convex `subscriptions` table, Stripe API |
| Session transcripts (AI advocacy practice) | Medium | Convex `aiSessions` table |
| Legal research history | Medium | Convex `searchHistory`, `savedAuthorities` tables |
| Governance records (votes, motions, debates) | Medium | Convex governance tables |
| Password reset tokens | Critical | In-memory Map, server logs |
| Auth tokens (session cookies) | Critical | Browser cookies, server memory |

### 3.2 Threat Actors

| Actor | Capability | Motivation |
|-------|-----------|------------|
| **Malicious student** | Authenticated user, knows the platform | Grade manipulation, impersonation, competitive advantage |
| **External attacker** | Unauthenticated, standard tooling | Data harvesting (student PII), credential theft, platform disruption |
| **Automated bot** | Scripted requests, credential stuffing | Account takeover, resource exhaustion |
| **Disgruntled user** | Former user with knowledge of API patterns | Vandalism, data destruction via governance functions |

### 3.3 Attack Surfaces

```
                    Internet
                       |
                   [Vercel CDN]
                       |
              +--------+--------+
              |                 |
         [Next.js App]    [API Routes]
         (Client-side)    /api/auth
              |           /api/stripe/*
              |           /api/legal/*
              |           /api/og/*
              |
         [Convex SDK]
              |
      [Convex Backend]
      35 tables, ~50 mutations
      NO authorization middleware
```

### 3.4 Trust Boundaries

1. **Browser to Vercel** -- TLS-protected, security headers applied
2. **Vercel to Convex** -- SDK calls from client; mutations accept arbitrary `profileId` (BROKEN TRUST BOUNDARY)
3. **Vercel to Stripe** -- API key in env vars; webhook signature verified (INTACT)
4. **Vercel to Daily.co** -- API key in env vars (not reviewed in depth)
5. **In-memory auth API** -- Cookie-based session; tokens unsigned (BROKEN TRUST BOUNDARY)

---

## 4. Findings Report

### FINDING-01: Missing Authorization Checks on All Convex Mutations

| Field | Value |
|-------|-------|
| **Severity** | CRITICAL |
| **CVSS 3.1** | 9.1 (AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N) |
| **CWE** | CWE-862 (Missing Authorization) |
| **OWASP** | A01:2021 -- Broken Access Control |
| **Status** | Open |

**Description:**
Every Convex mutation outside of `convex/users.ts` accepts a `profileId` (or equivalent identity parameter) directly from the client without verifying that the authenticated user owns that profile. The Convex framework provides `auth.getUserId(ctx)` for server-side identity verification, but only `convex/users.ts` uses it. All other mutation files trust the client-supplied identity.

**Affected Files and Functions:**

| File | Mutations | Line Numbers |
|------|-----------|--------------|
| `convex/sessions.ts` | `create`, `claimRole`, `unclaimRole`, `updateStatus` | 80, 138, 174, 204 |
| `convex/aiSessions.ts` | `create`, `addMessage`, `complete`, `saveToPortfolio`, `submitFeedback` | 6, 32, 55, 108, 117 |
| `convex/videoSessions.ts` | `create`, `respondToInvite`, `joinSession`, `leaveSession`, `cancelSession`, `rateSession` | 7, 75, 114, 146, 198, 222 |
| `convex/research.ts` | `saveAuthority`, `removeAuthority`, `updateAuthorityNotes`, `recordSearch`, `clearSearchHistory` | 52, 84, 93, 127, 143 |
| `convex/governance/legislative.ts` | `proposeMotion`, `secondMotion`, `castVote`, `addDebateEntry`, `openVoting`, `closeVoting` | 49, 85, 109, 205, 168, 186 |
| `convex/profiles.ts` | `create`, `update`, `updateStreak`, `incrementMoots` | 99, 155, 173, 196 |

**Proof of Concept:**
An authenticated user with their own `profileId` of `abc123` can call any mutation with a victim's `profileId` of `xyz789`:

```typescript
// Attacker claims a moot court role as the victim
await convex.mutation(api.sessions.claimRole, {
  roleId: "role_id_here",
  profileId: "xyz789",     // victim's profile ID
  sessionId: "session_id",
});

// Attacker casts a governance vote as the victim
await convex.mutation(api.governance.legislative.castVote, {
  motionId: "motion_id",
  profileId: "xyz789",  // victim's profile ID
  vote: "aye",
});

// Attacker submits fake feedback as the victim
await convex.mutation(api.aiSessions.submitFeedback, {
  sessionId: "session_id",
  fromProfileId: "xyz789",  // impersonating victim
  toProfileId: "target_id",
  scores: { /* fabricated scores */ },
  overallScore: 1,
});
```

**Impact:**
- Full identity impersonation across the platform
- Fraudulent governance votes (undermining democratic simulation)
- Manipulation of rankings and leaderboards
- Creation of sessions and AI transcripts under another user's identity
- Deletion of another user's saved legal research

**Remediation:**
Add `auth.getUserId(ctx)` verification to every mutation. Resolve the authenticated user's ID to their profile, then verify the `profileId` argument matches. Create a shared helper function:

```typescript
// convex/lib/auth.ts
import { auth } from "../auth";
import { QueryCtx, MutationCtx } from "../_generated/server";

export async function requireProfile(ctx: MutationCtx | QueryCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  if (!profile) throw new Error("Profile not found");
  return profile;
}
```

Then in each mutation:

```typescript
export const claimRole = mutation({
  args: { roleId: v.id("sessionRoles"), sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    // Use profile._id instead of client-supplied profileId
    // ...
  },
});
```

---

### FINDING-02: Stripe Billing Portal Accepts Any Customer ID (IDOR)

| Field | Value |
|-------|-------|
| **Severity** | CRITICAL |
| **CVSS 3.1** | 8.6 (AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:L/A:N) |
| **CWE** | CWE-639 (Authorization Bypass Through User-Controlled Key) |
| **OWASP** | A01:2021 -- Broken Access Control |
| **Status** | Open |

**Description:**
The Stripe billing portal endpoint at `src/app/api/stripe/portal/route.ts` (line 12) accepts a `stripeCustomerId` directly from the request body without verifying that the authenticated user owns that Stripe customer record.

**Affected Code:**

```typescript
// src/app/api/stripe/portal/route.ts, lines 10-27
export async function POST(req: NextRequest) {
  try {
    const { stripeCustomerId } = await req.json();  // line 12: untrusted input
    const stripe = getStripe();

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer ID" }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,  // line 22: passed directly to Stripe
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  }
}
```

**Proof of Concept:**
```bash
curl -X POST https://ratiothedigitalcourtsociety.com/api/stripe/portal \
  -H "Content-Type: application/json" \
  -d '{"stripeCustomerId": "cus_VICTIM_ID_HERE"}'
```

This returns a valid Stripe billing portal URL for the victim's account, granting the attacker access to view invoices, change payment methods, and cancel subscriptions.

**Impact:**
- Access to any user's billing portal (payment history, invoices, payment methods)
- Ability to cancel or modify another user's subscription
- Potential exposure of partial payment card details (last 4 digits, expiry)

**Remediation:**
Authenticate the request, look up the user's own Stripe customer ID from the Convex database, and ignore the client-supplied value entirely:

```typescript
export async function POST(req: NextRequest) {
  // 1. Authenticate the request (verify session cookie)
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Look up their Stripe customer ID from the database
  const subscription = await convex.query(api.subscriptions.getByUserId, {
    userId: user.id,
  });
  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  // 3. Use the server-resolved customer ID
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
```

---

### FINDING-03: Password Reset Tokens Logged to Console in Production

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **CVSS 3.1** | 7.5 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) |
| **CWE** | CWE-532 (Information Exposure Through Log Files) |
| **OWASP** | A09:2021 -- Security Logging and Monitoring Failures |
| **Status** | Open |

**Description:**
Password reset tokens are logged via `console.log()` at `src/app/api/auth/route.ts`, lines 137--138. These log statements execute unconditionally -- there is no `NODE_ENV` guard. In production on Vercel, `console.log` output is captured in deployment logs, which are accessible to anyone with Vercel project access.

**Affected Code:**

```typescript
// src/app/api/auth/route.ts, lines 137-138
console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
console.log(`[DEV] Reset URL: /reset-password?token=${resetToken}`);
```

**Impact:**
- Any team member with Vercel log access can read password reset tokens
- If Vercel logs are forwarded to a third-party logging service (Datadog, Logtail, etc.), tokens are further exposed
- Enables account takeover if an attacker gains access to deployment logs

**Remediation:**
Gate the log statements behind a development environment check and remove email addresses from log output:

```typescript
if (process.env.NODE_ENV === "development") {
  console.log(`[DEV] Password reset token generated for testing`);
  console.log(`[DEV] Reset URL: /reset-password?token=${resetToken}`);
}
```

In production, send reset tokens via email (SendGrid, Resend, etc.) and never log them.

---

### FINDING-04: In-Memory Auth with Plaintext Passwords and Forgeable Tokens

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **CVSS 3.1** | 8.1 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N) |
| **CWE** | CWE-256 (Plaintext Storage of a Password), CWE-798 (Hardcoded Credentials), CWE-347 (Improper Verification of Cryptographic Signature) |
| **OWASP** | A07:2021 -- Identification and Authentication Failures |
| **Status** | Open |

**Description:**
The demo authentication system at `src/app/api/auth/route.ts` has multiple security issues:

1. **Plaintext password storage** (line 6): Passwords are stored in a `Map<string, { password: string }>` without hashing. Password comparison is plaintext equality (line 80): `user.password !== password`.

2. **Hardcoded demo credential** (lines 17--21): Email `demo@ratio.law` with password `ratio2026` is hardcoded in source and accessible to anyone who reads the repository.

3. **Unsigned auth tokens** (lines 23--25): Tokens are base64url-encoded JSON with no signature or MAC. Anyone can forge a valid token:

```typescript
// Forge a token for any user
const forgery = Buffer.from(JSON.stringify({
  email: "victim@example.com",
  name: "Victim Name",
  iat: Date.now()
})).toString("base64url");
// Set this as the convex-auth-token cookie to impersonate the victim
```

4. **Volatile storage** (line 6): The in-memory `Map` resets on every deployment or serverless function cold start, logging out all users and losing all registered accounts.

**Impact:**
- Complete authentication bypass via token forgery
- Credential exposure through hardcoded demo account
- Account loss on every deployment due to in-memory storage
- If this auth path is used in production, all passwords are recoverable from memory

**Remediation:**
If this demo auth is only intended for local development:
- Add an environment guard: `if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Not available" }, { status: 404 });`
- Document clearly that Convex Auth (`@convex-dev/auth`) is the production auth provider

If this auth path must remain available:
- Replace plaintext storage with bcrypt/scrypt hashing
- Sign tokens with HMAC-SHA256 using a server-side secret
- Remove hardcoded credentials
- Move user storage to a persistent database

---

### FINDING-05: No Input Size Validation on Mutations

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **CVSS 3.1** | 6.5 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:H) |
| **CWE** | CWE-20 (Improper Input Validation), CWE-770 (Allocation of Resources Without Limits) |
| **OWASP** | A03:2021 -- Injection |
| **Status** | Open |

**Description:**
String arguments across Convex mutations have no maximum length validation. An attacker can submit arbitrarily large strings to cause storage bloat, increased Convex billing, and potential denial of service.

**Affected Parameters (non-exhaustive):**

| File | Function | Parameter | Max Length |
|------|----------|-----------|------------|
| `convex/sessions.ts` | `create` | `title`, `description`, `issueSummary` | None |
| `convex/aiSessions.ts` | `addMessage` | `message` | None |
| `convex/profiles.ts` | `create`, `update` | `fullName`, `bio` | None |
| `convex/governance/legislative.ts` | `proposeMotion` | `title`, `issue`, `rule`, `application`, `conclusion` | None |
| `convex/governance/legislative.ts` | `addDebateEntry` | `content` | None |
| `convex/research.ts` | `saveAuthority` | `title`, `url`, `snippet`, `notes` | None |

**Proof of Concept:**
```typescript
// Send a 100MB string as a session description
const payload = "A".repeat(100 * 1024 * 1024);
await convex.mutation(api.sessions.create, {
  createdBy: myProfileId,
  title: payload,
  description: payload,
  // ...other required fields
});
```

**Impact:**
- Convex storage and bandwidth consumption leading to increased billing
- Potential database performance degradation
- Client-side rendering issues when fetching oversized records

**Remediation:**
Add validation helpers and apply them consistently:

```typescript
function validateString(value: string, field: string, maxLength: number): void {
  if (value.length > maxLength) {
    throw new Error(`${field} exceeds maximum length of ${maxLength} characters`);
  }
}

// In mutation handlers:
validateString(args.title, "Title", 200);
validateString(args.description ?? "", "Description", 5000);
validateString(args.message, "Message", 50000);
validateString(args.bio ?? "", "Bio", 1000);
```

---

### FINDING-06: Profile Queries Return Private Profiles

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **CVSS 3.1** | 5.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N) |
| **CWE** | CWE-200 (Exposure of Sensitive Information to an Unauthorized Actor) |
| **OWASP** | A01:2021 -- Broken Access Control |
| **Status** | Open |

**Description:**
Profile queries in `convex/profiles.ts` return all matching profiles regardless of the `isPublic` flag. The `getByUniversity` (line 23), `getByChamber` (line 33), `search` (line 55), `getLeaderboard` (line 43), and `getChamberStats` (line 72) queries do not filter out private profiles.

**Affected Code:**

```typescript
// convex/profiles.ts, lines 23-30
export const getByUniversity = query({
  args: { university: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("profiles")
      .withIndex("by_university", (q) => q.eq("university", args.university))
      .collect();
    // No filtering by isPublic
  },
});
```

**Impact:**
- Enumeration of all law students at any UK university
- Exposure of names, universities, year of study, chamber affiliations, and activity statistics for users who set their profile to private
- Potential GDPR implications for exposing student data without consent

**Remediation:**
Add `isPublic` filtering to all profile listing queries:

```typescript
export const getByUniversity = query({
  args: { university: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_university", (q) => q.eq("university", args.university))
      .collect();
    return profiles.filter((p) => p.isPublic !== false);
  },
});
```

---

### FINDING-07: No Rate Limiting on Login or Legal Search API

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **CVSS 3.1** | 5.3 (AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N) |
| **CWE** | CWE-307 (Improper Restriction of Excessive Authentication Attempts) |
| **OWASP** | A07:2021 -- Identification and Authentication Failures |
| **Status** | Open |

**Description:**
While the password reset action has a 1-minute rate limit (`src/app/api/auth/route.ts`, lines 120--124), the login action (line 74) has no rate limiting. An attacker can attempt unlimited login attempts for credential stuffing or brute-force attacks.

Additionally, the legal search API route (`src/app/api/legal/search/route.ts`) has no rate limiting. Since it proxies requests to external APIs (legislation.gov.uk, case law databases, Parliament API), an attacker could use this as an amplification vector or exhaust external API quotas.

**Impact:**
- Credential stuffing attacks against the login endpoint
- Brute-force password guessing (no account lockout mechanism)
- Abuse of legal search API to exhaust external API rate limits
- Potential cost implications if external APIs charge per request

**Remediation:**
Add rate limiting using Vercel's built-in capabilities or a library such as `@upstash/ratelimit`:

```typescript
// Login: 5 attempts per minute per IP
// Legal search: 30 requests per minute per IP
import { Ratelimit } from "@upstash/ratelimit";

const loginLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});
```

Alternatively, use Vercel Edge Middleware for IP-based rate limiting.

---

### FINDING-08: No CSRF Protection on POST Endpoints

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **CVSS 3.1** | 4.3 (AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N) |
| **CWE** | CWE-352 (Cross-Site Request Forgery) |
| **OWASP** | A01:2021 -- Broken Access Control |
| **Status** | Open |

**Description:**
The auth cookie uses `sameSite: "lax"` (line 68 of `src/app/api/auth/route.ts`) and `httpOnly: true`, which provides protection against most CSRF vectors. However, `sameSite: lax` only prevents cookies from being sent on cross-origin subrequests -- it does not fully protect POST endpoints.

A malicious page could use `fetch()` with `credentials: "include"` to trigger cross-origin POST requests. While modern browsers enforce CORS and `sameSite` cookies mitigate the most common scenarios, the `/api/auth` and `/api/stripe/portal` endpoints lack explicit CSRF token verification.

**Impact:**
- Limited CSRF risk due to `sameSite: lax` protection
- POST requests from malicious sites could theoretically trigger actions if combined with other browser vulnerabilities
- The Stripe portal IDOR (FINDING-02) combined with CSRF could allow an attacker to redirect a victim to a billing portal for a different customer

**Remediation:**
Upgrade `sameSite` to `"strict"` if cross-site usage is not required. Alternatively, implement CSRF tokens:

```typescript
// Generate CSRF token and set as cookie + include in responses
const csrfToken = crypto.randomUUID();
response.cookies.set("csrf-token", csrfToken, { httpOnly: false, sameSite: "strict" });

// Verify on POST requests
const headerToken = request.headers.get("x-csrf-token");
const cookieToken = request.cookies.get("csrf-token")?.value;
if (!headerToken || headerToken !== cookieToken) {
  return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
}
```

---

### FINDING-09: Stripe Environment Variables Undocumented

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **CVSS 3.1** | N/A (Operational risk) |
| **CWE** | CWE-1188 (Insecure Default Initialization of Resource) |
| **OWASP** | A05:2021 -- Security Misconfiguration |
| **Status** | Open |

**Description:**
The `.env.example` file does not document `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or `STRIPE_PREMIUM_PLUS_PRICE_ID`, which are used by `src/app/api/stripe/webhook/route.ts` and `src/app/api/stripe/portal/route.ts`. This increases the risk of misconfiguration during deployment.

**Impact:**
- New developers may deploy without Stripe webhook verification enabled
- Missing `STRIPE_WEBHOOK_SECRET` would cause the `stripe.webhooks.constructEvent()` call to fail with a non-null assertion error, potentially exposing error details

**Remediation:**
Add all required Stripe variables to `.env.example` with descriptive comments:

```env
# Stripe (required for billing features)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PLUS_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://ratiothedigitalcourtsociety.com
```

---

### FINDING-10: Conditional React Hook Calls

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **CVSS 3.1** | N/A (Code quality / reliability) |
| **CWE** | N/A |
| **OWASP** | N/A |
| **Status** | Open |

**Description:**
14 instances of `// eslint-disable-next-line react-hooks/rules-of-hooks` appear across the codebase, indicating conditional hook calls. While not directly a security vulnerability, this pattern can cause unpredictable component behaviour, potentially leading to auth state being incorrectly evaluated.

**Affected Files:**
- `src/components/shared/Sidebar.tsx`
- `src/lib/hooks/useSidebarCounts.ts`
- `src/app/(app)/badges/page.tsx`
- `src/app/(app)/chambers/page.tsx`
- `src/app/(app)/library/page.tsx`
- `src/app/(app)/rankings/page.tsx`
- `src/hooks/useSubscription.ts`

**Impact:**
- Potential for auth checks to be skipped due to hooks called in wrong order
- React rendering errors that could expose error boundaries or fallback states
- Unreliable demo mode detection

**Remediation:**
Refactor conditional hooks into unconditional calls with conditional return values, or use the Convex `useQuery` pattern with `skip` semantics where available.

---

## 5. Positive Security Controls

The following security controls are correctly implemented and should be maintained:

### 5.1 Transport Security
- **HSTS** with 2-year max-age, includeSubDomains, and preload directive (`next.config.js`, line 39--41)
- **X-Frame-Options: DENY** prevents clickjacking (`next.config.js`, line 19--21)
- **X-Content-Type-Options: nosniff** prevents MIME-type sniffing (`next.config.js`, line 23--25)
- **Referrer-Policy: strict-origin-when-cross-origin** limits referrer leakage (`next.config.js`, line 27--29)
- **Permissions-Policy** disables camera, geolocation, and FLoC (`next.config.js`, line 31--33)

### 5.2 Stripe Webhook Verification
- Webhook signature verification is correctly implemented (`src/app/api/stripe/webhook/route.ts`, lines 37--46)
- The raw request body is passed to `constructEvent()` (not parsed JSON), which is the correct approach

### 5.3 Secrets Management
- No API keys are hardcoded in source code (all loaded via environment variables)
- `.gitignore` correctly excludes `.env`, `.env.local`, `.vercel`
- Sentry build wrapping is conditional on `SENTRY_AUTH_TOKEN` being set, preventing build failures

### 5.4 Cookie Security
- `httpOnly: true` prevents JavaScript access to auth cookies
- `secure: true` in production enforces HTTPS-only transmission
- `sameSite: "lax"` provides baseline CSRF protection

### 5.5 Password Reset Design (Partial)
- Token expiry (30 minutes) limits the window of exploitation
- Single-use tokens (deleted after use) prevent replay attacks
- No account enumeration -- consistent response regardless of whether the email exists
- Rate limiting (1 minute cooldown) on the forgot-password action
- Cryptographically random tokens (32 bytes from `crypto.getRandomValues`)

### 5.6 Privacy and Compliance
- Cookie consent banner implemented (`src/components/shared/CookieConsent.tsx`)
- Privacy policy, terms of service, and cookie policy pages exist
- Sentry error tracking with noise filtering

### 5.7 Authenticated Route Guards
- `(app)/layout-client.tsx` checks `useConvexAuth()` and `api.users.hasProfile` before rendering authenticated pages
- `(auth)/layout-client.tsx` redirects authenticated users away from login/register pages

---

## 6. Dependency Analysis

**Total production dependencies:** 28

| Category | Key Dependencies | Risk Assessment |
|----------|-----------------|-----------------|
| Framework | `next@14`, `react@18`, `react-dom@18` | Low -- actively maintained |
| Backend | `convex`, `@convex-dev/auth` | Low -- first-party SDK |
| Auth | `@auth/core` | Medium -- may be unused (Convex Auth is primary) |
| Payments | `stripe` | Low -- official SDK |
| UI | `framer-motion`, `lucide-react`, `sonner` | Low -- no server-side execution |
| State | `zustand` | Low -- minimal surface area |
| Monitoring | `@sentry/nextjs` | Low -- official SDK |

**Recommendations:**
- Verify whether `@auth/core` is actually used. If not, remove it to reduce the attack surface.
- Run `npm audit` regularly and integrate it into CI.
- Consider adding `npm audit --production` as a CI gate.

---

## 7. Prioritised Remediation Plan

### Phase 1: Emergency (0--24 hours)

These items address active exploitability and should be deployed immediately.

| Priority | Finding | Action | Effort |
|----------|---------|--------|--------|
| P0-1 | FINDING-03 | Gate `console.log` of reset tokens behind `NODE_ENV === "development"` | 15 min |
| P0-2 | FINDING-04 | Add `NODE_ENV` guard to disable demo auth in production, OR remove the hardcoded credential | 30 min |
| P0-3 | FINDING-02 | Replace client-supplied `stripeCustomerId` with server-side lookup from authenticated session | 1--2 hr |
| P0-4 | FINDING-01 (partial) | Create `requireProfile(ctx)` helper in `convex/lib/auth.ts`. Apply it to the 3 highest-risk files first: `governance/legislative.ts` (vote manipulation), `sessions.ts` (impersonation), `videoSessions.ts` (session hijacking) | 3--4 hr |

### Phase 2: Short-term (1--7 days)

Complete the authorization rollout and address input validation.

| Priority | Finding | Action | Effort |
|----------|---------|--------|--------|
| P1-1 | FINDING-01 (complete) | Apply `requireProfile(ctx)` to all remaining mutations: `aiSessions.ts`, `research.ts`, `profiles.ts`, and remaining governance files | 4--6 hr |
| P1-2 | FINDING-01 | Remove `profileId` from mutation args where possible (derive from auth context). Update all frontend call sites. | 4--8 hr |
| P1-3 | FINDING-05 | Add input length validation to all string arguments across all mutations | 2--3 hr |
| P1-4 | FINDING-06 | Add `isPublic` filtering to `getByUniversity`, `getByChamber`, `search`, `getLeaderboard` queries | 1--2 hr |
| P1-5 | FINDING-07 | Add rate limiting to login endpoint (5 attempts/min/IP) | 2--3 hr |
| P1-6 | FINDING-09 | Document all Stripe env vars in `.env.example` | 15 min |

### Phase 3: Medium-term (2--4 weeks)

Harden the platform and add defence-in-depth.

| Priority | Finding | Action | Effort |
|----------|---------|--------|--------|
| P2-1 | FINDING-04 | If demo auth remains: replace plaintext passwords with bcrypt, sign tokens with HMAC-SHA256, move storage to database | 1--2 days |
| P2-2 | FINDING-07 | Add rate limiting to legal search API (30 req/min/IP) | 2--3 hr |
| P2-3 | FINDING-08 | Implement CSRF token verification on all POST API routes | 1 day |
| P2-4 | FINDING-10 | Refactor conditional React hook calls to follow Rules of Hooks | 1--2 days |
| P2-5 | General | Add `npm audit` step to CI pipeline | 1 hr |
| P2-6 | General | Set up automated dependency update scanning (Dependabot or Renovate) | 1 hr |
| P2-7 | General | Add Content Security Policy (CSP) header | 1 day |
| P2-8 | General | Implement structured logging (replace `console.log`/`console.error` with a logging library that redacts sensitive fields) | 1 day |
| P2-9 | General | Add integration tests for authorization checks | 2--3 days |
| P2-10 | General | Conduct a follow-up security review after remediation | 1 day |

---

## 8. Security Gates

The following gates should be implemented to prevent future regressions:

### 8.1 Pre-Commit Gates

| Gate | Tool | Threshold |
|------|------|-----------|
| No hardcoded secrets | `gitleaks` or `trufflehog` pre-commit hook | Zero findings |
| No `console.log` of sensitive data | Custom ESLint rule or grep pre-commit | Zero matches for patterns like `token`, `password`, `secret` in `console.log` |

### 8.2 CI Pipeline Gates

| Gate | Tool | Threshold |
|------|------|-----------|
| Dependency vulnerabilities | `npm audit --production` | Zero high/critical CVEs |
| TypeScript compilation | `npx tsc --noEmit` | Zero errors |
| Linting | `npm run lint` | Zero errors |
| Build verification | `npm run build` | Exit code 0 |
| Auth check coverage | Custom script: verify all `mutation()` calls import `requireProfile` or `auth.getUserId` | 100% coverage |

### 8.3 Pre-Deployment Gates

| Gate | Criteria |
|------|----------|
| No new mutations without auth | Every new Convex `mutation()` must call `requireProfile(ctx)` or `auth.getUserId(ctx)` -- enforced by code review checklist |
| No new API routes without rate limiting | Every new `POST` handler must include rate limiting |
| Environment variable validation | Startup check that all required env vars are set (fail fast rather than runtime crash) |
| Security review for Stripe changes | Any PR touching `src/app/api/stripe/` requires explicit security review |

### 8.4 Monitoring Gates

| Gate | Tool | Alert Threshold |
|------|------|-----------------|
| Failed login attempts | Sentry custom event or Vercel logs | More than 10 failures from single IP in 5 minutes |
| Unusual mutation patterns | Convex function logs | Single user calling mutations with different `profileId` values |
| Stripe portal access | Application logging | Access to billing portal for a customer ID not matching the authenticated user |
| Error rate spike | Sentry | More than 5x baseline error rate in 15 minutes |

---

## 9. Top 10 Fixes Checklist

This prioritised checklist summarises the ten most impactful actions, ordered by risk reduction.

- [ ] **1. Create `requireProfile(ctx)` auth helper and apply to all Convex mutations** -- Eliminates FINDING-01 (CRITICAL). Single highest-impact fix. Prevents impersonation, vote fraud, session hijacking, and data manipulation across the entire platform.

- [ ] **2. Fix Stripe portal IDOR: resolve customer ID server-side** -- Eliminates FINDING-02 (CRITICAL). Prevents unauthorized access to any user's billing portal and subscription management.

- [ ] **3. Gate password reset token logging behind `NODE_ENV`** -- Eliminates FINDING-03 (HIGH). Two-line change that removes token exposure from production logs immediately.

- [ ] **4. Disable or secure demo auth in production** -- Mitigates FINDING-04 (HIGH). Prevents token forgery and removes hardcoded credentials from the production attack surface.

- [ ] **5. Add input length validation to all mutation string arguments** -- Eliminates FINDING-05 (HIGH). Prevents storage abuse and potential denial of service from oversized payloads.

- [ ] **6. Filter private profiles from listing queries** -- Eliminates FINDING-06 (MEDIUM). Respects user privacy settings and reduces GDPR risk for student data exposure.

- [ ] **7. Add rate limiting to login endpoint** -- Eliminates FINDING-07 (MEDIUM). Prevents brute-force and credential stuffing attacks against the authentication system.

- [ ] **8. Add rate limiting to legal search API** -- Partially addresses FINDING-07 (MEDIUM). Prevents abuse of external API proxying and cost amplification.

- [ ] **9. Document Stripe environment variables in `.env.example`** -- Eliminates FINDING-09 (LOW). Reduces deployment misconfiguration risk.

- [ ] **10. Add `npm audit` and auth-check coverage to CI pipeline** -- Addresses long-term security posture. Prevents dependency vulnerabilities and authorization regressions from reaching production.

---

## Appendix A: File Reference

| File Path | Relevant Findings |
|-----------|--------------------|
| `convex/sessions.ts` | FINDING-01, FINDING-05 |
| `convex/aiSessions.ts` | FINDING-01, FINDING-05 |
| `convex/videoSessions.ts` | FINDING-01 |
| `convex/research.ts` | FINDING-01 |
| `convex/governance/legislative.ts` | FINDING-01, FINDING-05 |
| `convex/profiles.ts` | FINDING-01, FINDING-05, FINDING-06 |
| `convex/users.ts` | Positive control (proper auth) |
| `src/app/api/auth/route.ts` | FINDING-03, FINDING-04, FINDING-07, FINDING-08 |
| `src/app/api/stripe/portal/route.ts` | FINDING-02 |
| `src/app/api/stripe/webhook/route.ts` | Positive control (signature verification) |
| `src/app/api/legal/search/route.ts` | FINDING-07 |
| `next.config.js` | Positive control (security headers) |

## Appendix B: OWASP Top 10:2021 Coverage

| OWASP Category | Findings |
|----------------|----------|
| A01: Broken Access Control | FINDING-01, FINDING-02, FINDING-06, FINDING-08 |
| A03: Injection | FINDING-05 (input validation) |
| A05: Security Misconfiguration | FINDING-09 |
| A07: Identification and Authentication Failures | FINDING-04, FINDING-07 |
| A09: Security Logging and Monitoring Failures | FINDING-03 |

---

*End of report. This document should be treated as confidential and distributed only to the development and security teams. Schedule a follow-up assessment after Phase 2 remediation is complete.*

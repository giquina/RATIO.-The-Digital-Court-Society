# Security Policy

This document describes the security architecture, practices, and reporting procedures for Ratio -- The Digital Court Society, a constitutional training platform for UK law students.

## Security Architecture

### Authentication

Authentication is handled by `@convex-dev/auth` with a Password provider configured in `convex/auth.ts`. OAuth providers are not yet enabled. Sessions are managed server-side by Convex, and session tokens are issued as HTTP-only cookies.

### Route Protection

The application uses two route groups under `src/app/`:

- `(auth)/` routes (login, register, onboarding) redirect already-authenticated users to `/home` via `layout-client.tsx`.
- `(app)/` routes (all authenticated pages) are protected by `layout-client.tsx`, which checks `useConvexAuth()` for authentication status and queries `api.users.hasProfile` for profile completion. Unauthenticated requests redirect to `/login`; users without a profile redirect to `/onboarding`.

### API Security

All Convex mutations verify the caller's identity using `auth.getUserId(ctx)`. Mutations that modify user-owned data additionally verify profile ownership to prevent unauthorized access to other users' records.

### Stripe Integration

Stripe payment processing follows these security practices:

- Customer IDs are resolved server-side from the authenticated user's profile, preventing insecure direct object reference (IDOR) attacks.
- Webhook endpoints verify Stripe signature headers before processing events.
- No payment credentials are stored in the application database.

## Security Headers

The following HTTP security headers are configured in `next.config.js`:

| Header | Value |
|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | Restricts camera, microphone, geolocation, and other sensitive APIs |

## Input Validation

All Convex mutations validate input strings against length limits defined in `convex/lib/validation.ts`. Standard limits:

| Field | Max Length |
|---|---|
| Title | 200 characters |
| Name | 100 characters |
| Bio | 2,000 characters |
| Description | 5,000 characters |
| Content | 50,000 characters |

Inputs exceeding these limits are rejected before any database write occurs.

## Data Privacy

- **Profile visibility**: Each user profile includes an `isPublic` boolean field. Only public profiles are returned by public-facing queries. Private profiles are excluded from search results and public listings.
- **Cookie consent**: Google Analytics 4 (GA4) scripts are loaded only after the user provides explicit cookie consent via the `CookieConsent` component.
- **Logging**: No personally identifiable information (PII) is written to application logs. Password reset tokens are only logged in development mode and are suppressed in production builds.

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex backend endpoint |
| AI API keys | No | Claude Sonnet / GPT-4o-mini for AI sessions (falls back to hardcoded responses) |
| `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` | No | Error monitoring (Sentry wrapping is conditional) |
| Stripe keys | No | Subscription billing |
| Daily.co API key | No | Video session infrastructure |

Production secrets are managed through Vercel environment variables and Convex dashboard settings. No secrets are committed to the repository. The `.env.example` file documents the expected variable names without values.

## Reporting Vulnerabilities

If you discover a security vulnerability in Ratio, please report it responsibly.

- **Email**: mgiqui01@student.bbk.ac.uk (subject line: "Ratio Security Report")
- **Expected response time**: 72 hours

Please include the following in your report:

1. A description of the vulnerability and its potential impact.
2. Steps to reproduce the issue.
3. Any relevant screenshots or proof-of-concept code.

Do not disclose the vulnerability publicly until it has been addressed.

### Safe Harbour

We will not pursue legal action against security researchers who report vulnerabilities in good faith, follow responsible disclosure practices, and do not access or modify other users' data. We ask that you allow a reasonable period (90 days) for remediation before any public disclosure.

## Known Limitations

- **Demo auth route**: The `/api/auth` route used for local development authentication is disabled in production deployments.
- **Transitive dependency advisories**: `npm audit` reports high-severity findings in transitive dependencies (notably `minimatch` via Sentry SDK and internal Next.js 14 dependencies). These are not exploitable in the Vercel deployment context, as the affected code paths are not reachable in production. These will be resolved as upstream packages release patches.

# Ratio Admin MCP Tools

Model Context Protocol (MCP) tool definitions that give Claude Code read/write access to the Ratio admin API. These tools call Convex HTTP endpoints authenticated via `X-Admin-Key` header, allowing Claude Code to query business metrics, manage advocates, send emails, and record marketing data without switching between dashboards.

---

## Prerequisites

1. **Convex deployment** with the admin API endpoints defined in `convex/http.ts`
2. **Admin API key** set as a Convex environment variable
3. **Claude Code** configured to use the MCP tool definitions

---

## Setup

### Step 1: Generate an Admin API Key

Create a strong random key. This key authenticates all MCP tool requests.

```bash
# Generate a 64-character hex key
openssl rand -hex 32
```

Example output: `a3f8c1d4e7b2...` (64 characters)

### Step 2: Set the Key in Convex

Add the key as an environment variable in your Convex deployment:

```bash
# Via Convex CLI
npx convex env set ADMIN_API_KEY "your-generated-key-here"

# Verify it was set
npx convex env list
```

You can also set it via the Convex dashboard at https://dashboard.convex.dev:
1. Select your Ratio project
2. Go to Settings > Environment Variables
3. Add `ADMIN_API_KEY` with the generated value

### Step 3: Configure the HTTP Endpoints

The admin API endpoints must be registered in `convex/http.ts`. Each endpoint validates the `X-Admin-Key` header against the `ADMIN_API_KEY` environment variable before processing the request.

The endpoints follow this pattern:

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { api } from "./_generated/api";

const http = httpRouter();
auth.addHttpRoutes(http);

// Admin auth middleware
async function validateAdminKey(request: Request, ctx: any): Promise<boolean> {
  const key = request.headers.get("X-Admin-Key");
  const expected = process.env.ADMIN_API_KEY;
  if (!key || !expected || key !== expected) return false;
  return true;
}

// Example: KPIs endpoint
http.route({
  path: "/api/admin/kpis",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!(await validateAdminKey(request, ctx))) {
      return new Response("Unauthorized", { status: 401 });
    }
    const kpis = await ctx.runQuery(api.admin.getKPIs);
    return Response.json(kpis);
  }),
});

export default http;
```

Each of the 14 tools maps to one HTTP endpoint. The full list of routes to add:

| Method | Path | Convex Function |
|--------|------|-----------------|
| GET | `/api/admin/kpis` | `api.admin.getKPIs` |
| GET | `/api/admin/revenue` | `api.admin.getRevenueBreakdown` |
| GET | `/api/admin/cohorts` | `api.admin.getCohortRetention` |
| GET | `/api/admin/advocates` | `api.admin.getAdvocatesList` |
| GET | `/api/admin/advocate/:id` | `api.admin.getAdvocateDetail` |
| GET | `/api/admin/churn-risk` | `api.admin.getChurnRiskAdvocates` |
| GET | `/api/admin/ai-usage` | `api.admin.getAiUsageStats` |
| GET | `/api/admin/referral-stats` | `api.admin.getReferralStats` |
| GET | `/api/admin/snapshots` | `api.admin.getDailySnapshots` |
| GET | `/api/admin/search` | `api.admin.searchAdvocates` |
| POST | `/api/admin/email` | `api.admin.sendEmail` |
| PATCH | `/api/admin/advocate/:id` | `api.admin.updateAdvocate` |
| POST | `/api/admin/announcements` | `api.admin.createAnnouncement` |
| POST | `/api/admin/marketing-spend` | `api.admin.recordMarketingSpend` |

### Step 4: Configure Claude Code

Point Claude Code to the MCP tool definitions file. Add the following to your Claude Code project configuration or reference it when starting a session:

```bash
# The tool definitions live at:
.claude/mcp-tools/ratio-admin.json
```

When Claude Code loads this file, it registers 14 tools prefixed with `ratio_` that map to the Convex HTTP endpoints. The `baseUrl` uses the `NEXT_PUBLIC_CONVEX_URL` environment variable from your project.

---

## Tool Reference

### Read-Only Tools (10)

These tools fetch data and never modify state. They do not require confirmation.

#### ratio_get_kpis

Quick health check. Returns total advocates, MRR (formatted as GBP), paid user count, today's signups, recent AI sessions, and plan distribution breakdown.

```
# No parameters needed
ratio_get_kpis()
```

**Example response fields:**
- `totalAdvocates`: 1,247
- `mrrFormatted`: "47.93 GBP"
- `paidUsers`: 89
- `todaySignups`: 7
- `recentAiSessions`: 34
- `planBreakdown`: { "free": 1158, "premium": 52, "premium_plus": 24, ... }

---

#### ratio_get_revenue

Revenue deep-dive. Returns MRR/ARR totals and a per-plan breakdown with user counts and revenue contribution.

```
ratio_get_revenue()
```

**Example response fields:**
- `totalMrrFormatted`: "47.93 GBP"
- `arrFormatted`: "575.16 GBP"
- `totalPaidUsers`: 89
- `byPlan`: { "premium": { "count": 52, "mrrPence": 31148 }, ... }

---

#### ratio_get_cohorts

Retention analysis. Returns weekly signup cohorts with retention rates at weeks 1, 4, 8, and 12.

```
# Default: last 12 weeks
ratio_get_cohorts()

# Custom range
ratio_get_cohorts(weeks=24)
```

---

#### ratio_get_advocates

CRM-lite advocate browser. Supports pagination, search, and filtering by plan or rank.

```
# Browse first page
ratio_get_advocates()

# Search by name
ratio_get_advocates(search="Emily", limit=10)

# Filter by plan
ratio_get_advocates(plan="premium_plus", offset=20, limit=20)

# Filter by rank
ratio_get_advocates(rank="Senior Counsel")
```

**Response:** `{ "advocates": [...], "total": 342 }`

---

#### ratio_get_advocate_detail

Full profile for a single advocate. Includes subscription, activity metrics, engagement history, and referral data.

```
ratio_get_advocate_detail(id="jh76k2m3n4...")
```

---

#### ratio_get_churn_risk

Lists advocates who have an active paid subscription but no platform activity in the last 14+ days. Sorted by days since last activity (most at risk first).

```
ratio_get_churn_risk()
```

---

#### ratio_get_ai_usage

AI cost monitoring. Returns total sessions, mode breakdown (moot, cross-examination, judgment writing, etc.), token usage, estimated costs, and a 30-day daily cost trend for charting.

```
ratio_get_ai_usage()
```

**Key response fields:**
- `totalSessions`, `sessionsToday`, `completedSessions`
- `modeBreakdown`: { "moot_court": 412, "cross_examination": 198, ... }
- `totalTokens`, `totalCostCents`
- `dailyCostTrend`: [{ "date": "2026-02-20", "tokens": 48000, "costCents": 124, ... }]

---

#### ratio_get_referral_stats

Referral programme funnel. Shows invites sent, link clicks, signups from referrals, and activated (retained) referrals.

```
ratio_get_referral_stats()
```

---

#### ratio_get_snapshots

Historical daily metrics for trend analysis. Each snapshot includes signups, active users, sessions, AI usage, MRR, and churn.

```
# Last 30 days (default)
ratio_get_snapshots()

# Last 7 days
ratio_get_snapshots(days=7)

# Last 90 days (maximum)
ratio_get_snapshots(days=90)
```

---

#### ratio_search_advocates

Quick name/university search. Returns matching profiles with key metrics. Lighter than ratio_get_advocates for targeted lookups.

```
ratio_search_advocates(q="Oxford")
ratio_search_advocates(q="James Chen")
```

---

### Write Tools (4)

These tools modify data or trigger external actions. They all have `requiresConfirmation: true`, meaning Claude Code will ask for explicit confirmation before executing.

#### ratio_send_email

Sends an email via the Resend integration. Use for individual outreach, transactional messages, or targeted communications.

```
ratio_send_email(
  to="advocate@university.ac.uk",
  subject="Your Ratio Ambassador Application",
  html="<h1>Congratulations</h1><p>You have been accepted as a Ratio Ambassador...</p>"
)
```

**Important:** Only send to advocates who have `marketingConsent: true` for marketing emails. Transactional emails (account-related) are exempt from consent requirements under UK GDPR.

---

#### ratio_update_advocate

Admin-level profile edits. Use sparingly and with clear justification (e.g. correcting a rank after a competition result, granting ambassador status).

```
# Promote to ambassador
ratio_update_advocate(profileId="jh76k2m3n4...", isAmbassador=true)

# Change rank
ratio_update_advocate(profileId="jh76k2m3n4...", rank="Senior Counsel")

# Override subscription plan (e.g. scholarship grant)
ratio_update_advocate(profileId="jh76k2m3n4...", planOverride="professional")
```

All changes are logged to the audit log with the admin action, timestamp, and previous values.

---

#### ratio_create_announcement

Broadcasts an in-app notification to a segment of advocates. Notifications appear in each advocate's notification feed.

```
# Notify all advocates
ratio_create_announcement(
  title="New Feature: AI Cross-Examination Practice",
  body="Cross-examination mode is now available in AI Practice. Sharpen your advocacy skills with realistic witness interactions.",
  segment="all"
)

# Notify paid users only
ratio_create_announcement(
  title="Professional Webinar: Appellate Advocacy",
  body="Exclusive session for subscribers. Join us on Friday at 18:00 GMT.",
  segment="paid"
)
```

---

#### ratio_record_marketing_spend

Records monthly marketing expenditure for CAC (Customer Acquisition Cost) calculation. LTV/CAC metrics are computed from this data combined with subscription revenue.

```
# Record Google Ads spend for February 2026
ratio_record_marketing_spend(
  month="2026-02",
  amountPence=25000,
  channel="google_ads"
)

# Record university partnership costs
ratio_record_marketing_spend(
  month="2026-02",
  amountPence=15000,
  channel="university_partnerships"
)
```

**Note:** `amountPence` is in pence (GBP). 25000 = 250.00 GBP.

---

## Common Workflows

### Daily Health Check

```
1. ratio_get_kpis()                    -- headline numbers
2. ratio_get_churn_risk()              -- anyone about to leave?
3. ratio_get_ai_usage()                -- AI spend in check?
```

### Weekly Business Review

```
1. ratio_get_kpis()                    -- current state
2. ratio_get_revenue()                 -- revenue breakdown
3. ratio_get_snapshots(days=7)         -- week trend
4. ratio_get_cohorts(weeks=4)          -- recent retention
5. ratio_get_referral_stats()          -- referral health
```

### Investigating a Specific Advocate

```
1. ratio_search_advocates(q="Emily")  -- find by name
2. ratio_get_advocate_detail(id="...")  -- full profile
3. ratio_update_advocate(...)           -- if action needed
```

### Re-engagement Campaign

```
1. ratio_get_churn_risk()              -- identify at-risk advocates
2. ratio_get_advocate_detail(id="...")  -- review each profile
3. ratio_send_email(...)               -- personalised outreach
```

### Monthly Marketing Report

```
1. ratio_record_marketing_spend(month="2026-02", amountPence=40000, channel="google_ads")
2. ratio_get_snapshots(days=30)        -- new signups over the month
3. ratio_get_revenue()                 -- current MRR
4. ratio_get_cohorts(weeks=4)          -- are new users retaining?
```

---

## Security Notes

- The `ADMIN_API_KEY` is a shared secret. Rotate it periodically via `npx convex env set ADMIN_API_KEY "new-key"`.
- All write operations are logged to the `auditLog` table in Convex.
- The HTTP endpoints bypass Convex's session-based auth entirely. They rely solely on the API key. Do not expose the key in client-side code.
- Write tools (`requiresConfirmation: true`) prompt for explicit confirmation in Claude Code before executing.
- Email sends are rate-limited by the Resend free tier (3,000 emails/month). Plan upgrades available at resend.com.

---

## File Structure

```
.claude/mcp-tools/
  ratio-admin.json    -- MCP tool definitions (this is what Claude Code reads)
  README.md           -- this file
convex/
  http.ts             -- HTTP endpoint registrations (routes for each tool)
  admin.ts            -- Convex query/mutation handlers (business logic)
  analytics.ts        -- Daily snapshot computation
  auditLog.ts         -- Audit logging for admin actions
  email.ts            -- Resend email action (Phase 2)
```

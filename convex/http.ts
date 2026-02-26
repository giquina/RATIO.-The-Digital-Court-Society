import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
// @ts-expect-error — "Type instantiation excessively deep" with ~40+ table schema
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const http = httpRouter();
auth.addHttpRoutes(http);

// ════════════════════════════════════════════════════════════════
// ADMIN HTTP API — authenticated via X-Admin-Key header
// ════════════════════════════════════════════════════════════════

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "X-Admin-Key, Content-Type",
};

/** Validate the X-Admin-Key header against ADMIN_API_KEY env var. */
function validateAdminKey(request: Request): Response | true {
  const key = request.headers.get("X-Admin-Key");
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return new Response(
      JSON.stringify({ error: "ADMIN_API_KEY not configured on server" }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  if (!key || key !== expected) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: invalid or missing X-Admin-Key" }),
      { status: 401, headers: CORS_HEADERS }
    );
  }

  return true;
}

/** Helper to build a JSON success response. */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

/** Helper to build a JSON error response. */
function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: CORS_HEADERS,
  });
}

// ── CORS preflight for all /api/admin/* routes ──
http.route({
  path: "/api/admin/kpis",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/revenue",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/cohorts",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/advocates",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  pathPrefix: "/api/admin/advocate/",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/churn-risk",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/ai-usage",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/referral-stats",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/snapshots",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});
http.route({
  path: "/api/admin/search",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: CORS_HEADERS })),
});

// ────────────────────────────────────────────
// 1. GET /api/admin/kpis
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/kpis",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const data = await ctx.runQuery(internal.adminApi.getKPIsInternal);
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 2. GET /api/admin/revenue
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/revenue",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const data = await ctx.runQuery(internal.adminApi.getRevenueInternal);
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 3. GET /api/admin/cohorts?weeks=12
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/cohorts",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const url = new URL(request.url);
    const weeks = parseInt(url.searchParams.get("weeks") ?? "12", 10);

    const data = await ctx.runQuery(internal.adminApi.getCohortsInternal, {
      weeks: isNaN(weeks) ? 12 : weeks,
    });
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 4. GET /api/admin/advocates?limit=20&offset=0&search=&plan=&rank=
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/advocates",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
    const search = url.searchParams.get("search") || undefined;
    const plan = url.searchParams.get("plan") || undefined;
    const rank = url.searchParams.get("rank") || undefined;

    const data = await ctx.runQuery(internal.adminApi.getAdvocatesInternal, {
      limit: isNaN(limit) ? 20 : limit,
      offset: isNaN(offset) ? 0 : offset,
      search,
      plan,
      rank,
    });
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 5. GET /api/admin/advocate/:id
// ────────────────────────────────────────────
http.route({
  pathPrefix: "/api/admin/advocate/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const url = new URL(request.url);
    // Extract the ID from the path: /api/admin/advocate/{id}
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return errorResponse("Missing profile ID in URL path", 400);
    }

    try {
      const data = await ctx.runQuery(
        internal.adminApi.getAdvocateDetailInternal,
        { profileId: id as Id<"profiles"> }
      );

      if (!data) {
        return errorResponse("Advocate not found", 404);
      }
      return jsonResponse(data);
    } catch (e: any) {
      return errorResponse(`Invalid profile ID: ${e.message}`, 400);
    }
  }),
});

// ────────────────────────────────────────────
// 6. GET /api/admin/churn-risk
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/churn-risk",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const data = await ctx.runQuery(internal.adminApi.getChurnRiskInternal);
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 7. GET /api/admin/ai-usage
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/ai-usage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const data = await ctx.runQuery(internal.adminApi.getAiUsageInternal);
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 8. GET /api/admin/referral-stats
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/referral-stats",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const data = await ctx.runQuery(internal.adminApi.getReferralStatsInternal);
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 9. GET /api/admin/snapshots?days=30
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/snapshots",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") ?? "30", 10);

    const data = await ctx.runQuery(internal.adminApi.getSnapshotsInternal, {
      days: isNaN(days) ? 30 : days,
    });
    return jsonResponse(data);
  }),
});

// ────────────────────────────────────────────
// 10. GET /api/admin/search?q=term
// ────────────────────────────────────────────
http.route({
  path: "/api/admin/search",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authResult = validateAdminKey(request);
    if (authResult !== true) return authResult;

    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";

    if (q.length < 2) {
      return errorResponse("Search query must be at least 2 characters", 400);
    }

    const data = await ctx.runQuery(
      internal.adminApi.searchAdvocatesInternal,
      { q }
    );
    return jsonResponse(data);
  }),
});

export default http;

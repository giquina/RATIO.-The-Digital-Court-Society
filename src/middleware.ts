import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Convex Auth stores tokens in localStorage (client-side), not cookies.
// Auth protection is handled client-side by (app)/layout.tsx and (auth)/layout.tsx.
// This middleware handles rate limiting on public routes + static/API passthrough.

// ---------------------------------------------------------------------------
// In-memory rate limiting (Edge Runtime compatible, no external dependencies)
// ---------------------------------------------------------------------------

type RateBucket = { count: number; resetTime: number };

const rateBuckets: Map<string, RateBucket> = new Map();

// Self-cleaning: purge expired entries every 60s
const CLEANUP_INTERVAL_MS = 60_000;
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  rateBuckets.forEach((bucket, key) => {
    if (now >= bucket.resetTime) rateBuckets.delete(key);
  });
}, CLEANUP_INTERVAL_MS);
if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
  (cleanupTimer as { unref: () => void }).unref();
}

function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(identifier);

  if (!bucket || now >= bucket.resetTime) {
    rateBuckets.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  const resetIn = bucket.resetTime - now;
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetIn };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetIn };
}

// ---------------------------------------------------------------------------
// Rate limit configuration per route group
// ---------------------------------------------------------------------------

const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  auth: { limit: 10, windowMs: 60_000 },    // 10 req/min per IP
  ogImage: { limit: 30, windowMs: 60_000 },  // 30 req/min per IP (CPU-heavy)
};

const AUTH_PATHS = ["/register", "/login", "/forgot-password", "/reset-password"];

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.ip ||
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files through without processing
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const ip = getClientIp(request);

  // Rate limit auth routes: 10 requests per 60s per IP
  if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const { limit, windowMs } = RATE_LIMITS.auth;
    const result = checkRateLimit(`auth:${ip}`, limit, windowMs);

    if (!result.allowed) {
      return new NextResponse("Too many requests. Please try again later.", {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.resetIn / 1000)),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    return response;
  }

  // Rate limit OG image generation: 30 requests per 60s per IP
  if (pathname === "/api/og") {
    const { limit, windowMs } = RATE_LIMITS.ogImage;
    const result = checkRateLimit(`og:${ip}`, limit, windowMs);

    if (!result.allowed) {
      return new NextResponse("Too many requests.", {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.resetIn / 1000)),
        },
      });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Convex Auth stores tokens in localStorage (client-side), not cookies.
// Auth protection is handled client-side by (app)/layout.tsx and (auth)/layout.tsx.
// This middleware only handles static/API passthrough.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes through without processing
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)",
  ],
};

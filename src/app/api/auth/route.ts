import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// DEV/DEMO ONLY — In-memory auth store for local development.
// Production auth uses Convex Auth (convex/auth.ts).
// This route is disabled in production via the NODE_ENV check below.
const users = new Map<string, { name: string; email: string; password: string }>();

// Password reset tokens — token → { email, expiresAt }
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

// Rate limiting for password reset — email → last request timestamp
const resetRateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 60_000; // 1 minute between requests
const TOKEN_EXPIRY_MS = 30 * 60_000; // 30 minutes

// Pre-seed a demo account
users.set("demo@ratio.law", {
  name: "Ali Giquina",
  email: "demo@ratio.law",
  password: "ratio2026",
});

function createToken(email: string, name: string): string {
  const payload = JSON.stringify({ email, name, iat: Date.now() });
  return Buffer.from(payload).toString("base64url");
}

function parseToken(token: string): { email: string; name: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString());
    return { email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

function generateResetToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// POST /api/auth — handles login, register, logout, forgot-password, reset-password
// This route is for dev/demo only. Production uses Convex Auth.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is disabled in production. Use Convex Auth." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { action } = body;

  if (action === "register") {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (users.has(email)) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    users.set(email, { name, email, password });
    const token = createToken(email, name);
    const response = NextResponse.json({ success: true, user: { name, email } });
    response.cookies.set("convex-auth-token", token, {
      httpOnly: true,
      secure: false, // Dev-only route, never runs in production
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  if (action === "login") {
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const user = users.get(email);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const token = createToken(email, user.name);
    const response = NextResponse.json({ success: true, user: { name: user.name, email } });
    response.cookies.set("convex-auth-token", token, {
      httpOnly: true,
      secure: false, // Dev-only route, never runs in production
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  if (action === "logout") {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("convex-auth-token");
    return response;
  }

  if (action === "me") {
    const token = request.cookies.get("convex-auth-token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }
    const parsed = parseToken(token);
    if (!parsed) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: parsed });
  }

  if (action === "forgot-password") {
    const { email } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Rate limiting
    const lastRequest = resetRateLimit.get(email);
    if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MS) {
      // Always return success to prevent timing attacks / enumeration
      return NextResponse.json({ success: true });
    }
    resetRateLimit.set(email, Date.now());

    // Only generate token if user exists, but always return success (no account enumeration)
    const user = users.get(email);
    if (user) {
      const resetToken = generateResetToken();
      resetTokens.set(resetToken, {
        email,
        expiresAt: Date.now() + TOKEN_EXPIRY_MS,
      });
      // In production: send email with reset link via SendGrid/Resend/etc.
      // In dev: log the token so it can be tested
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
        console.log(`[DEV] Reset URL: /reset-password?token=${resetToken}`);
      }
    }

    return NextResponse.json({ success: true });
  }

  if (action === "reset-password") {
    const { token, password } = body;
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const resetData = resetTokens.get(token);
    if (!resetData) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }
    if (Date.now() > resetData.expiresAt) {
      resetTokens.delete(token);
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
    }

    const user = users.get(resetData.email);
    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Update password
    user.password = password;
    users.set(resetData.email, user);

    // Invalidate the token (single use)
    resetTokens.delete(token);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

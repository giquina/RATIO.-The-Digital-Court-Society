import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple auth store — in production, use a proper database + hashing
// This provides working auth for development and demo purposes
const users = new Map<string, { name: string; email: string; password: string }>();

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

// POST /api/auth — handles login, register, logout
export async function POST(request: NextRequest) {
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
      secure: process.env.NODE_ENV === "production",
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
      secure: process.env.NODE_ENV === "production",
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

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

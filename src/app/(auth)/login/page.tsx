"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { Scale, Loader2, ArrowLeft } from "lucide-react";
import { DemoCredentialsBanner } from "@/components/shared/DemoCredentialsBanner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/home";
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email: email.toLowerCase().trim(), password, flow: "signIn" });
      router.push(redirect);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3.5 py-3 text-court-base text-court-text outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-colors placeholder:text-court-text-sec";

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 md:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4"><Scale size={44} className="text-gold" /></div>
        <h1 className="font-serif text-2xl font-bold text-court-text">Return to the Bench</h1>
        <p className="text-xs text-court-text-sec mt-1.5">Sign in to continue your advocacy</p>
      </div>

      <DemoCredentialsBanner
        variant="login"
        onUseDemo={(demoEmail, demoPassword) => {
          setEmail(demoEmail);
          setPassword(demoPassword);
        }}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}
        className="flex flex-col gap-4 max-w-sm mx-auto w-full"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-court-border" />
          <span className="text-court-xs text-court-text-ter uppercase tracking-wider">sign in with email</span>
          <div className="flex-1 h-px bg-court-border" />
        </div>

        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputClass} aria-label="Email address" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputClass} aria-label="Password" required />

        <div className="text-right -mt-1">
          <Link href="/forgot-password" className="text-court-xs text-court-text-ter hover:text-gold transition-colors">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="text-court-xs text-red-400 text-center" role="alert">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          aria-busy={loading}
          className="w-full bg-gold text-navy font-bold rounded-xl py-3 text-sm tracking-wide hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-court-xs text-court-text-ter text-center mt-2">
          Open to all. Verify with .ac.uk for full access.
        </p>

        <p className="text-center text-xs text-court-text-ter mt-1">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold font-semibold">Join now</Link>
        </p>

        <Link href="/" className="flex items-center justify-center gap-1.5 text-court-text-ter text-court-xs hover:text-court-text-sec transition-colors mt-2">
          <ArrowLeft size={12} />
          Return to home
        </Link>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

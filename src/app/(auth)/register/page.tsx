"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = name && email && password.length >= 8 && password === confirmPassword;

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/onboarding");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-3 text-court-base text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter";

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 md:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3"><Scale size={36} className="text-gold" /></div>
        <h1 className="font-serif text-2xl font-bold text-court-text">Join Ratio</h1>
        <p className="text-xs text-court-text-sec mt-1">Start your advocacy journey</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
        className="flex flex-col gap-3.5 max-w-sm mx-auto w-full"
      >
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 bg-white text-[#1f1f1f] font-semibold rounded-xl py-3 text-sm opacity-40 cursor-not-allowed"
          disabled
          title="Google sign-up coming soon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-court-border" />
          <span className="text-court-xs text-court-text-ter uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-court-border" />
        </div>

        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputClass} aria-label="Full name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="University email" className={inputClass} aria-label="University email" required />
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" className={inputClass} aria-label="Create password" required />
          {password && password.length < 8 && (
            <p className="text-court-xs text-orange-400 mt-1">Password must be at least 8 characters</p>
          )}
        </div>
        <div>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className={inputClass} aria-label="Confirm password" required />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-court-xs text-red-400 mt-1">Passwords do not match</p>
          )}
        </div>

        {error && (
          <p className="text-court-xs text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full bg-gold text-navy font-bold rounded-xl py-3 text-sm tracking-wide hover:bg-gold/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-court-xs text-court-text-ter text-center mt-1">
          By joining, you agree to the Ratio Code of Conduct.
        </p>

        <p className="text-center text-xs text-court-text-ter mt-2">
          Already a member?{" "}
          <Link href="/login" className="text-gold font-semibold">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

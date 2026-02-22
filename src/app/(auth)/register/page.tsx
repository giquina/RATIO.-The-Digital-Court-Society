"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Scale, Loader2, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const updateName = useMutation(api.users.updateName);

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
      // Create account via Convex Auth
      await signIn("password", { email: email.toLowerCase().trim(), password, flow: "signUp" });
      // Store name for onboarding (updateName may fail due to auth propagation delay)
      try {
        await updateName({ name });
      } catch {
        // Name will be set during onboarding if this fails
        if (typeof window !== "undefined") {
          localStorage.setItem("ratio_pending_name", name);
        }
      }
      router.push("/onboarding");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("AccountAlreadyExists") || message.includes("already exists")) {
        setError("An account with this email already exists. Please sign in.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3.5 py-3 text-court-base text-court-text outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-colors placeholder:text-court-text-sec";

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 md:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4"><Scale size={44} className="text-gold" /></div>
        <h1 className="font-serif text-2xl font-bold text-court-text">Join the Bar</h1>
        <p className="text-xs text-court-text-sec mt-1.5">Begin your advocacy journey</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
        className="flex flex-col gap-4 max-w-sm mx-auto w-full"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-court-border" />
          <span className="text-court-xs text-court-text-ter uppercase tracking-wider">create your account</span>
          <div className="flex-1 h-px bg-court-border" />
        </div>

        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputClass} aria-label="Full name" required />
        <div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputClass} aria-label="Email address" required />
          <p className="text-court-xs text-court-text-ter mt-1.5">
            Use a .ac.uk address to unlock verified Advocate status
          </p>
        </div>
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
          <p className="text-court-xs text-red-400 text-center" role="alert">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          aria-busy={loading}
          className="w-full bg-gold text-navy font-bold rounded-xl py-3 text-sm tracking-wide hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-court-xs text-court-text-ter text-center mt-1">
          By joining, you agree to the Ratio Code of Conduct.
        </p>

        <p className="text-court-xs text-court-text-ter text-center">
          Open to all. Verify with .ac.uk for full access.
        </p>

        <p className="text-center text-xs text-court-text-ter mt-1">
          Already a member?{" "}
          <Link href="/login" className="text-gold font-semibold">Sign in</Link>
        </p>

        <Link href="/" className="flex items-center justify-center gap-1.5 text-court-text-ter text-court-xs hover:text-court-text-sec transition-colors mt-2">
          <ArrowLeft size={12} />
          Return to home
        </Link>
      </form>
    </div>
  );
}

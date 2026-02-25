"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot-password", email }),
      });
      const data = await res.json();
      // Always show success to prevent account enumeration
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-3 text-court-base text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter";

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-4 md:px-6 lg:px-8">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-court-text mb-2">
            Check Your Email
          </h1>
          <p className="text-court-base text-court-text-sec mb-6 leading-relaxed">
            If an account exists for <span className="text-court-text font-semibold">{email}</span>,
            we have sent a password reset link. The link expires in 30 minutes.
          </p>
          <p className="text-court-sm text-court-text-ter mb-8">
            Did not receive it? Check your spam folder, or try again in a few minutes.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="w-full py-3 text-court-base font-semibold text-court-text-sec border border-court-border rounded-xl hover:border-white/10 transition-colors"
            >
              Try a different email
            </button>
            <Link
              href="/login"
              className="w-full py-3 text-court-base font-bold bg-gold text-navy rounded-xl flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 md:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <Scale size={36} className="text-gold" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-court-text">
          Reset Password
        </h1>
        <p className="text-court-sm text-court-text-sec mt-1">
          Enter your email and we will send a reset link
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-3.5 max-w-sm mx-auto w-full"
      >
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-court-text-ter"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className={`${inputClass} pl-10`}
            aria-label="Email address"
            required
          />
        </div>

        {error && (
          <p className="text-court-xs text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-gold text-navy font-bold rounded-xl py-3 text-court-base tracking-wide hover:bg-gold/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-court-xs text-court-text-ter hover:text-court-text-sec transition-colors mt-2"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}

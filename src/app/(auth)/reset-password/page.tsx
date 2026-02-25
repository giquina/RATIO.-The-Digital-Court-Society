"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Scale, Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = password.length >= 8 && password === confirmPassword;

  const handleReset = async () => {
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-password", token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed. The link may have expired.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-3 text-court-base text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter";

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-4 md:px-6 lg:px-8">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-court-base text-court-text-sec mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="w-full inline-block py-3 text-court-base font-bold bg-gold text-navy rounded-xl hover:bg-gold/90 transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-4 md:px-6 lg:px-8">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-2">
            Password Reset
          </h1>
          <p className="text-court-base text-court-text-sec mb-6">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="w-full inline-block py-3 text-court-base font-bold bg-gold text-navy rounded-xl hover:bg-gold/90 transition-colors"
          >
            Sign In
          </Link>
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
          Create New Password
        </h1>
        <p className="text-court-sm text-court-text-sec mt-1">
          Choose a strong password for your account
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleReset();
        }}
        className="flex flex-col gap-3.5 max-w-sm mx-auto w-full"
      >
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className={inputClass}
            aria-label="New password"
            required
          />
          {password && password.length < 8 && (
            <p className="text-court-xs text-orange-400 mt-1">
              Password must be at least 8 characters
            </p>
          )}
        </div>
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={inputClass}
            aria-label="Confirm new password"
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-court-xs text-red-400 mt-1">
              Passwords do not match
            </p>
          )}
        </div>

        {error && (
          <p className="text-court-xs text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full bg-gold text-navy font-bold rounded-xl py-3 text-court-base tracking-wide hover:bg-gold/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

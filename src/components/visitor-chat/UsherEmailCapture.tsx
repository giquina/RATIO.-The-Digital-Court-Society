"use client";

import { useState } from "react";

interface UsherEmailCaptureProps {
  onSubmit: (email: string) => void;
}

export function UsherEmailCapture({ onSubmit }: UsherEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    onSubmit(trimmed);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] bg-gold/[0.06] border border-gold/10 rounded-court px-3.5 py-2.5">
          <p className="font-serif text-court-xs text-gold font-bold mb-1">The Usher</p>
          <p className="text-court-base text-court-text">
            Thank you. Our team will be in touch shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] bg-gold/[0.06] border border-gold/10 rounded-court px-3.5 py-3">
        <p className="font-serif text-court-xs text-gold font-bold mb-2">The Usher</p>
        <p className="text-court-base text-court-text mb-3">
          I&apos;m afraid that&apos;s beyond my brief. Leave your email and our team will follow up.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-navy border border-court-border rounded-lg px-3 py-1.5 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/40"
          />
          <button
            type="submit"
            className="bg-gold text-navy font-bold text-court-xs rounded-lg px-3 py-1.5 hover:bg-gold/90 transition-colors"
          >
            Send
          </button>
        </form>
        {error && (
          <p className="text-court-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

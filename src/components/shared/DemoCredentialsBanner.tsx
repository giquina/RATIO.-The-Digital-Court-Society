"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, FlaskConical } from "lucide-react";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@ratio.law";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "DemoAdvocate2026";

/**
 * Shows demo credentials on auth pages for testing.
 *
 * Visibility rules:
 * - NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true  → always visible
 * - NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=false → always hidden
 * - Not set → visible on localhost / Vercel preview, hidden on production
 */
function shouldShow(): boolean {
  const flag = process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS;
  if (flag === "true") return true;
  if (flag === "false") return false;
  // Auto-detect: show on localhost and Vercel preview deployments
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app") // Preview deployments
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for insecure context
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="ml-auto shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 transition-all"
    >
      {copied ? (
        <Check size={13} className="text-green-400" />
      ) : (
        <Copy size={13} className="text-court-text-sec" />
      )}
    </button>
  );
}

interface DemoCredentialsBannerProps {
  /** Callback to pre-fill the login form */
  onUseDemo?: (email: string, password: string) => void;
  /** Variant — "login" shows a fill button, "register" shows a "use demo instead" link */
  variant?: "login" | "register";
}

export function DemoCredentialsBanner({
  onUseDemo,
  variant = "login",
}: DemoCredentialsBannerProps) {
  // Defer visibility check to useEffect to avoid SSR/client hydration mismatch
  // (shouldShow() checks window.location which doesn't exist on the server)
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(shouldShow()); }, []);
  if (!visible) return null;

  return (
    <div className="w-full max-w-sm mx-auto mb-6">
      <div className="border border-gold/20 bg-gold/[0.04] rounded-xl px-4 py-3.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical size={14} className="text-gold shrink-0" />
          <span className="text-court-xs font-semibold text-gold tracking-wide uppercase">
            Demo Account
          </span>
          <span className="text-[10px] text-court-text-ter ml-auto">
            Testing only
          </span>
        </div>

        {/* Credentials */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-2">
            <span className="text-court-xs text-court-text-ter w-12 shrink-0">Email</span>
            <span className="text-court-xs text-court-text font-mono truncate">{DEMO_EMAIL}</span>
            <CopyButton value={DEMO_EMAIL} label="demo email" />
          </div>
          <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-2">
            <span className="text-court-xs text-court-text-ter w-12 shrink-0">Pass</span>
            <span className="text-court-xs text-court-text font-mono truncate">{DEMO_PASSWORD}</span>
            <CopyButton value={DEMO_PASSWORD} label="demo password" />
          </div>
        </div>

        {/* Action */}
        {variant === "login" && onUseDemo && (
          <button
            type="button"
            onClick={() => onUseDemo(DEMO_EMAIL, DEMO_PASSWORD)}
            className="w-full mt-3 py-2 rounded-lg bg-gold/10 text-gold text-court-xs font-semibold hover:bg-gold/20 active:scale-[0.98] transition-all"
          >
            Fill demo credentials
          </button>
        )}

        {variant === "register" && (
          <p className="text-[10px] text-court-text-ter text-center mt-2.5">
            Already have a demo account?{" "}
            <a href="/login" className="text-gold font-semibold">
              Sign in with demo
            </a>
          </p>
        )}

        {/* Disclaimer */}
        <p className="text-[10px] text-court-text-ter text-center mt-2 leading-relaxed">
          Limited sandbox access. No real data is affected.
        </p>
      </div>
    </div>
  );
}

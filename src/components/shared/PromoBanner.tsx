"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, GraduationCap, Scale } from "lucide-react";

const STORAGE_KEY = "ratio-promo-banner-dismissed";
const COOKIE_CONSENT_KEY = "ratio-cookie-consent";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SHOW_DELAY_MS = 5000;
const CONSENT_POLL_INTERVAL_MS = 500;
const CONSENT_POLL_TIMEOUT_MS = 30000;

// ── Gold particle animation (ambient floating dots) ──
function GoldParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: `${12 + i * 18}%`,
        delay: i * 0.6,
        duration: 4 + i * 0.8,
        size: 2 + (i % 2),
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: -4,
            width: p.size,
            height: p.size,
            backgroundColor: "rgba(201, 168, 76, 0.12)",
          }}
          animate={{
            y: [0, -320],
            opacity: [0, 0.15, 0.08, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function PromoBanner() {
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* localStorage unavailable */
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    // 1. Check cooldown
    try {
      const lastDismissed = localStorage.getItem(STORAGE_KEY);
      if (lastDismissed) {
        const elapsed = Date.now() - new Date(lastDismissed).getTime();
        if (elapsed < COOLDOWN_MS) return;
      }
    } catch {
      return;
    }

    // 2. Timer + cleanup refs
    let showTimer: ReturnType<typeof setTimeout>;
    let pollTimer: ReturnType<typeof setInterval>;
    let pollTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const startShowTimer = () => {
      if (cancelled) return;
      showTimer = setTimeout(() => {
        if (!cancelled) setVisible(true);
      }, SHOW_DELAY_MS);
    };

    // 3. Check if consent already resolved
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent) {
        startShowTimer();
        return () => {
          cancelled = true;
          clearTimeout(showTimer);
        };
      }
    } catch {
      /* continue to poll */
    }

    // 4. Wait for consent
    const onConsent = () => {
      clearInterval(pollTimer);
      clearTimeout(pollTimeout);
      window.removeEventListener("ratio-consent-granted", onConsent);
      startShowTimer();
    };

    window.addEventListener("ratio-consent-granted", onConsent);

    pollTimer = setInterval(() => {
      try {
        if (localStorage.getItem(COOKIE_CONSENT_KEY)) {
          onConsent();
        }
      } catch {
        /* ignore */
      }
    }, CONSENT_POLL_INTERVAL_MS);

    pollTimeout = setTimeout(() => {
      clearInterval(pollTimer);
      window.removeEventListener("ratio-consent-granted", onConsent);
    }, CONSENT_POLL_TIMEOUT_MS);

    return () => {
      cancelled = true;
      clearTimeout(showTimer);
      clearInterval(pollTimer);
      clearTimeout(pollTimeout);
      window.removeEventListener("ratio-consent-granted", onConsent);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="promo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[75]"
            onClick={dismiss}
          />

          {/* Modal — bottom sheet on mobile, centered on desktop */}
          <motion.div
            key="promo-modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[75] bottom-0 inset-x-0 md:bottom-auto md:inset-0 md:flex md:items-center md:justify-center pointer-events-none"
          >
            <div
              className="pointer-events-auto relative w-full md:w-[420px] md:max-w-[90vw] border border-court-border rounded-t-court md:rounded-court overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, #182640 50%, #0C1220 100%)",
                boxShadow:
                  "0 0 80px rgba(201,168,76,0.06), 0 25px 50px rgba(0,0,0,0.4)",
              }}
            >
              {/* Gold top accent bar */}
              <div
                className="h-[2px] w-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.7) 50%, rgba(201,168,76,0.15) 100%)",
                }}
              />

              {/* Floating gold particles */}
              <GoldParticles />

              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full text-court-text-ter hover:text-court-text hover:bg-white/[0.06] border border-transparent hover:border-court-border transition-all z-10"
                aria-label="Close announcement"
              >
                <X size={14} />
              </button>

              {/* ── Branding Header ── */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="relative flex flex-col items-center pt-5 pb-4"
              >
                {/* Glow behind icon */}
                <div
                  className="absolute top-2 w-20 h-20 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)",
                  }}
                />
                <Scale size={22} className="text-gold mb-2 relative" strokeWidth={1.5} />
                <h2 className="font-serif text-lg font-bold tracking-[0.15em] text-court-text relative">
                  RATIO<span className="text-gold">.</span>
                </h2>
                <p className="text-[10px] text-court-text-ter tracking-[0.2em] uppercase mt-0.5">
                  The Digital Court Society
                </p>
              </motion.div>

              {/* ── Section 1: Recruiting ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mx-5 px-4 py-3.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase size={16} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-court-xs font-bold text-gold tracking-[0.08em] uppercase">
                      Now Recruiting
                    </span>
                    <p className="text-court-sm text-court-text font-semibold leading-relaxed mt-1">
                      Substantive roles for law students
                    </p>
                    <p className="text-court-xs text-court-text-sec leading-relaxed mt-0.5">
                      Legal research, outreach, advocacy community, and legal tech.
                      Part-time, remote, built around your degree.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Section 2: Free for Students ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mx-5 mt-2.5 px-4 py-3.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap size={16} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-court-xs font-bold text-gold tracking-[0.08em] uppercase">
                      Free for Students
                    </span>
                    <p className="text-court-xs text-court-text-sec leading-relaxed mt-1">
                      AI moot court practice, legal research, national rankings,
                      and Parliament — all free. Unlimited AI sessions from £5.99/mo.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── CTA Buttons ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="px-5 pt-4 pb-5 flex flex-col sm:flex-row gap-2.5"
              >
                <Link
                  href="/careers"
                  onClick={dismiss}
                  className="flex-1 text-center bg-gold text-navy font-bold rounded-xl px-5 py-2.5 text-court-sm tracking-wide hover:bg-gold/90 transition-colors"
                  style={{
                    boxShadow: "0 0 20px rgba(201,168,76,0.15)",
                  }}
                >
                  View Open Roles
                </Link>
                <Link
                  href="/register"
                  onClick={dismiss}
                  className="flex-1 text-center border border-court-border text-court-text-sec font-semibold rounded-xl px-5 py-2.5 text-court-sm hover:border-gold/20 hover:text-court-text transition-colors"
                >
                  Join as an Advocate
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

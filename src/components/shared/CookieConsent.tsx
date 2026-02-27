"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const CONSENT_KEY = "ratio-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay so it doesn't flash on page load
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    // Signal Analytics component to load GA4 without page reload
    window.dispatchEvent(new Event("ratio-consent-granted"));
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
    // Signal analytics tools to respect decline
    window.dispatchEvent(new Event("ratio-consent-declined"));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6">
      <div className="max-w-sm sm:max-w-lg mx-auto bg-navy-card border border-court-border rounded-court p-4 sm:p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-dim flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield size={18} className="text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-court-text text-court-base font-semibold mb-1">
              Privacy Notice
            </p>
            <p className="text-court-text-sec text-court-sm leading-relaxed mb-4">
              Ratio. uses analytics cookies to understand how Advocates use the
              platform. No personal data is shared with third parties. You may
              decline without affecting your experience.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="bg-gold text-navy font-bold rounded-xl px-4 py-2 text-court-sm tracking-wide"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="border border-court-border text-court-text-sec font-semibold rounded-xl px-4 py-2 text-court-sm hover:border-white/10 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

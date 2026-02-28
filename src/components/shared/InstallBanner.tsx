"use client";

import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

/**
 * Smart install banner.
 * - Android/Desktop: shows native install prompt
 * - iOS: shows manual "Add to Home Screen" instructions
 * - Hidden if already installed or dismissed this session
 */
export default function InstallBanner() {
  const { canInstall, isIOS, promptInstall, isInstalled } = usePWA();
  const [dismissed, setDismissed] = useState(true); // Start hidden, show after delay
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled) return;

    // Don't show if user dismissed recently (24h cooldown)
    try {
      const lastDismissed = localStorage.getItem("ratio-install-dismissed");
      if (lastDismissed && Date.now() - parseInt(lastDismissed) < 86400000) return;
    } catch {
      return;
    }

    // Show after 5 seconds so it doesn't compete with page load
    const timer = setTimeout(() => setDismissed(false), 5000);
    return () => clearTimeout(timer);
  }, [isInstalled]);

  if (isInstalled || dismissed || (!canInstall && !isIOS)) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("ratio-install-dismissed", String(Date.now()));
  };

  const handleInstall = async () => {
    if (canInstall) {
      const accepted = await promptInstall();
      if (accepted) handleDismiss();
    } else if (isIOS) {
      setShowIOSTip(true);
    }
  };

  return (
    <div className="fixed top-[56px] left-3 right-3 z-[60] animate-in slide-in-from-top-4 duration-300 md:top-auto md:bottom-6 md:left-auto md:right-6 md:max-w-sm md:slide-in-from-bottom-4">
      <div className="bg-navy-card/95 backdrop-blur-xl border border-gold/20 rounded-2xl px-4 py-3 shadow-2xl shadow-black/40">
        {showIOSTip ? (
          /* iOS instructions */
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="text-court-base font-bold text-court-text">Add to Home Screen</p>
              <button onClick={handleDismiss} className="text-court-text-ter p-1">
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-court-base text-court-text-sec leading-relaxed">
              <div className="flex flex-col gap-1.5">
                <p>1. Tap <Share size={14} className="inline text-blue-400" /> at the bottom of Safari</p>
                <p>2. Scroll down and tap <span className="font-semibold text-court-text">Add to Home Screen</span></p>
                <p>3. Tap <span className="font-semibold text-court-text">Add</span></p>
              </div>
            </div>
          </div>
        ) : (
          /* Standard prompt */
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Download size={18} className="text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-court-base font-bold text-court-text">Install Ratio.</p>
              <p className="text-court-xs text-court-text-ter">Add to your home screen for the full experience</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDismiss}
                className="text-court-sm text-court-text-ter px-2 py-1.5"
              >
                Later
              </button>
              <button
                onClick={handleInstall}
                className="text-court-sm font-bold text-navy bg-gold rounded-lg px-3 py-1.5"
              >
                Install
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

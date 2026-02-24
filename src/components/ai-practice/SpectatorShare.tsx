"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check, Users, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SpectatorShareProps {
  spectatorCode: string | null;
  spectatorCount: number;
  isEnabled: boolean;
  onEnable: () => Promise<string>;
  onDisable: () => Promise<void>;
}

/**
 * Spectator Share Button — appears in the session toolbar.
 * Allows the advocate to enable spectator mode and share a link/code.
 */
export default function SpectatorShare({
  spectatorCode,
  spectatorCount,
  isEnabled,
  onEnable,
  onDisable,
}: SpectatorShareProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const spectateUrl = spectatorCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/spectate/${spectatorCode}`
    : "";

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isEnabled) {
        await onDisable();
      } else {
        await onEnable();
      }
    } catch (err) {
      console.error("Failed to toggle spectator mode:", err);
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!spectateUrl) return;
    try {
      await navigator.clipboard.writeText(spectateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = spectateUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!spectateUrl || typeof navigator.share !== "function") return;
    try {
      await navigator.share({
        title: "Watch my moot court session live!",
        text: "I'm practising on Ratio — watch my live moot session as a spectator:",
        url: spectateUrl,
      });
    } catch {
      // User cancelled or share failed — fall back to copy
      handleCopy();
    }
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-court-xs transition-colors ${
          isEnabled
            ? "bg-gold/10 border-gold/30 text-gold"
            : "bg-navy-card border-court-border text-court-text-ter hover:text-court-text"
        }`}
        title={isEnabled ? "Spectator mode active" : "Enable spectator mode"}
      >
        {isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
        <span className="hidden sm:inline">
          {isEnabled ? `Live` : "Spectate"}
        </span>
        {isEnabled && spectatorCount > 0 && (
          <span className="flex items-center gap-0.5 text-gold/80">
            <Users size={10} />
            {spectatorCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              className="fixed inset-0 z-30"
              onClick={() => setIsExpanded(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="absolute right-0 top-full mt-2 w-72 bg-navy-deep border border-court-border rounded-xl shadow-xl z-40 overflow-hidden"
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-court-sm font-bold text-court-text">Spectator Mode</h4>
                  <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      isEnabled ? "bg-gold" : "bg-court-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        isEnabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-court-xs text-court-text-ter mb-3">
                  {isEnabled
                    ? "Other students can watch your session live via the link below."
                    : "Let fellow students watch your moot in real time — like a live court gallery."}
                </p>

                {isEnabled && spectatorCode && (
                  <>
                    {/* Code display */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 px-3 py-2 rounded-lg bg-navy border border-court-border font-mono text-court-sm text-gold tracking-widest text-center">
                        {spectatorCode}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-navy-card border border-court-border text-court-xs text-court-text-sec hover:text-court-text transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copy Link
                          </>
                        )}
                      </button>
                      {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                        <button
                          onClick={handleNativeShare}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gold/10 border border-gold/30 text-court-xs text-gold hover:bg-gold/20 transition-colors"
                        >
                          <Share2 size={12} />
                          Share
                        </button>
                      )}
                    </div>

                    {spectatorCount > 0 && (
                      <p className="text-court-xs text-court-text-ter text-center mt-2">
                        {spectatorCount} {spectatorCount === 1 ? "person" : "people"} watching now
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

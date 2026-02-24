"use client";

import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Registers the service worker and captures the browser's install prompt.
 * Returns { canInstall, promptInstall, isInstalled }.
 */
export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // iOS Safari check — no beforeinstallprompt but supports Add to Home Screen
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !(navigator as any).standalone) {
      // iOS can't be prompted — we'll show manual instructions
    }

    // Capture the install prompt (Chrome, Edge, Samsung Internet)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect if installed after prompt
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome === "accepted";
  }, [deferredPrompt]);

  return {
    canInstall: !!deferredPrompt,
    isIOS: typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent),
    promptInstall,
    isInstalled,
  };
}

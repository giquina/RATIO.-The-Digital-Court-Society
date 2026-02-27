"use client";

import { useCallback, useRef, useState, useEffect } from "react";

interface UseSpeechSynthesisOptions {
  /** Called once when all TTS tiers have failed */
  onAllTiersFailed?: () => void;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  setEnabled: (enabled: boolean) => void;
  enabled: boolean;
  /** Call inside a user gesture (tap/click) to unlock audio on mobile */
  unlockAudio: () => void;
}

/**
 * Hybrid TTS hook — three-tier voice quality:
 *
 * 1. ElevenLabs (primary) — highest quality, British "Daniel" voice.
 *    Requires API key + has monthly character quota.
 *
 * 2. Edge TTS (fallback) — free, high-quality Microsoft neural voice.
 *    Uses en-GB-RyanNeural via /api/ai/tts/edge. No API key needed.
 *
 * 3. Browser SpeechSynthesis (last resort) — built-in browser voice.
 *    Lower quality but guarantees audible output. Prefers en-GB voice.
 *
 * Mobile fix: iOS/Android require the first audio play to happen
 * inside a user gesture (tap). We "unlock" by creating a silent Audio
 * element when the user toggles TTS on.
 */

// Max consecutive failures before a tier is skipped for the session
const MAX_FAILURES = 2;

// Timeout for API-based TTS fetch calls (prevents infinite hang)
const TTS_FETCH_TIMEOUT_MS = 12_000;

// Timeout for browser SpeechSynthesis — if nothing fires, give up
const BROWSER_TTS_TIMEOUT_MS = 8_000;

export function useSpeechSynthesis(
  options?: UseSpeechSynthesisOptions,
): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabledState] = useState(true); // On by default — judge should speak
  const unlockedRef = useRef(false);

  // Failure counters per tier — allow MAX_FAILURES consecutive failures before disabling
  const elevenLabsFailuresRef = useRef(0);
  const edgeTtsFailuresRef = useRef(0);
  const browserTtsFailuresRef = useRef(0);

  // One-shot notification when all tiers fail
  const ttsFailureNotifiedRef = useRef(false);
  const onAllTiersFailed = options?.onAllTiersFailed;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  // Track AudioContext buffer source for stop()
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Audio is always supported (we use HTML5 Audio, not SpeechSynthesis)
  const isSupported = typeof window !== "undefined";

  // Track AudioContext for TTS playback
  const audioContextRef = useRef<AudioContext | null>(null);

  // Pre-loaded voices for browser SpeechSynthesis
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Pre-load browser voices — Chrome loads them asynchronously via voiceschanged
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) voicesRef.current = v;
    };

    loadVoices(); // Try immediately (may return empty on Chrome)
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Unlock audio API — called from user gesture (tap) context
  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;

    // Unlock AudioContext for TTS playback
    //    Once resumed inside a user gesture, AudioContext stays unlocked
    //    for the entire page lifetime — so audio.play() works even after
    //    async calls (like waiting for the AI response).
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume().catch(() => {});
        audioContextRef.current = ctx;
      }
    } catch {
      // AudioContext not available
    }

    // Also "warm up" browser SpeechSynthesis by speaking empty text
    // This is a workaround for iOS/Chrome where the first speech call
    // after page load gets swallowed silently.
    try {
      if (window.speechSynthesis) {
        const warmup = new SpeechSynthesisUtterance("");
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
        // Cancel immediately — the point is just to unlock the audio pipeline
        setTimeout(() => window.speechSynthesis.cancel(), 100);
      }
    } catch {
      // Not critical
    }

    unlockedRef.current = true;
  }, []);

  // setEnabled wrapper — unlocks audio on user gesture when enabling
  const setEnabled = useCallback(
    (value: boolean) => {
      if (value && isSupported) {
        unlockAudio();
      }
      setEnabledState(value);
    },
    [isSupported, unlockAudio],
  );

  // ── Cleanup helper ──
  const cleanupAudio = useCallback(() => {
    if (bufferSourceRef.current) {
      try {
        bufferSourceRef.current.stop();
      } catch {
        /* already stopped */
      }
      bufferSourceRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  // ── Generic audio TTS — fetches from an endpoint, plays the result ──
  const speakViaEndpoint = useCallback(
    async (endpoint: string, text: string): Promise<boolean> => {
      // Add a timeout so TTS API calls don't hang indefinitely
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TTS_FETCH_TIMEOUT_MS);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          console.warn(`[TTS] ${endpoint} failed: HTTP ${res.status}`);
          return false;
        }

        // Read response body once (can only be consumed once)
        const arrayBuffer = await res.arrayBuffer();

        // Guard against empty/tiny responses that can't be valid audio
        if (arrayBuffer.byteLength < 100) {
          console.warn(
            `[TTS] ${endpoint} returned empty audio (${arrayBuffer.byteLength} bytes)`,
          );
          return false;
        }

        // Try AudioContext playback first (works after async calls because
        // the context was resumed during the user gesture in unlockAudio).
        // Falls back to Audio element if AudioContext isn't available.
        const ctx = audioContextRef.current;
        if (ctx && ctx.state !== "closed") {
          try {
            // Make sure context is running
            if (ctx.state === "suspended") await ctx.resume();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);

            return new Promise<boolean>((resolve) => {
              source.onended = () => {
                setIsSpeaking(false);
                bufferSourceRef.current = null;
                resolve(true);
              };
              setIsSpeaking(true);
              bufferSourceRef.current = source;
              source.start();
            });
          } catch (decodeErr) {
            console.warn(
              `[TTS] AudioContext decode/play failed for ${endpoint}:`,
              decodeErr,
            );
          }
        }

        // Fallback: Audio element (may fail on desktop if gesture expired)
        const audioBlob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(audioBlob);
        objectUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        return new Promise<boolean>((resolve) => {
          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            setIsSpeaking(false);
            cleanupAudio();
            resolve(true);
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            cleanupAudio();
            resolve(false);
          };
          audio.play().catch((playErr) => {
            console.warn(
              `[TTS] Audio element play failed for ${endpoint}:`,
              playErr,
            );
            cleanupAudio();
            resolve(false);
          });
        });
      } catch (fetchErr) {
        clearTimeout(timeout);
        // Distinguish timeout from other errors for debugging
        if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
          console.warn(`[TTS] ${endpoint} timed out after ${TTS_FETCH_TIMEOUT_MS}ms`);
        } else {
          console.warn(`[TTS] Fetch failed for ${endpoint}:`, fetchErr);
        }
        return false;
      }
    },
    [cleanupAudio],
  );

  // ── Browser SpeechSynthesis (Tier 3 — lower quality but functional) ──
  const speakViaBrowser = useCallback(
    (text: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
          console.warn("[TTS] Browser SpeechSynthesis not available");
          resolve(false);
          return;
        }

        // Safety timeout — if speechSynthesis never fires onstart/onend/onerror,
        // resolve false so we don't hang the fallback chain indefinitely.
        // This is a known issue on mobile Chrome and iOS Safari.
        let settled = false;
        const safetyTimeout = setTimeout(() => {
          if (!settled) {
            settled = true;
            console.warn("[TTS] Browser SpeechSynthesis timed out — no events fired");
            try { window.speechSynthesis.cancel(); } catch { /* */ }
            setIsSpeaking(false);
            resolve(false);
          }
        }, BROWSER_TTS_TIMEOUT_MS);

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-GB";
        utterance.rate = 0.95;
        utterance.pitch = 0.9;

        // Use pre-loaded voices (handles Chrome's async voice loading)
        const voices = voicesRef.current.length > 0
          ? voicesRef.current
          : window.speechSynthesis.getVoices();

        const britishVoice =
          voices.find(
            (v) =>
              v.lang === "en-GB" && v.name.toLowerCase().includes("male"),
          ) || voices.find((v) => v.lang === "en-GB")
            || voices.find((v) => v.lang.startsWith("en"));
        if (britishVoice) utterance.voice = britishVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          if (!settled) {
            settled = true;
            clearTimeout(safetyTimeout);
            setIsSpeaking(false);
            resolve(true);
          }
        };
        utterance.onerror = (e) => {
          if (!settled) {
            settled = true;
            clearTimeout(safetyTimeout);
            console.warn("[TTS] Browser SpeechSynthesis error:", e.error);
            setIsSpeaking(false);
            resolve(false);
          }
        };

        window.speechSynthesis.speak(utterance);

        // Chrome mobile workaround: speechSynthesis can pause itself after ~15s.
        // Poke it every 10s to keep it alive during long utterances.
        const keepAlive = setInterval(() => {
          if (settled) {
            clearInterval(keepAlive);
            return;
          }
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10_000);
      });
    },
    [],
  );

  // ── Main speak function — tries ElevenLabs → Edge TTS → Browser ──
  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;

      // Stop any ongoing audio
      cleanupAudio();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      // Strip any remaining emotes/asterisks
      const cleanText = text.replace(/\*[^*]+\*/g, "").trim();
      if (!cleanText) return;

      const trySpeak = async () => {
        // Tier 1: ElevenLabs (highest quality)
        if (elevenLabsFailuresRef.current < MAX_FAILURES) {
          const success = await speakViaEndpoint("/api/ai/tts", cleanText);
          if (success) {
            elevenLabsFailuresRef.current = 0;
            return;
          }
          elevenLabsFailuresRef.current++;
          console.warn(
            `[TTS] ElevenLabs failure ${elevenLabsFailuresRef.current}/${MAX_FAILURES}`,
          );
        }

        // Tier 2: Edge TTS (free, high quality)
        if (edgeTtsFailuresRef.current < MAX_FAILURES) {
          const success = await speakViaEndpoint("/api/ai/tts/edge", cleanText);
          if (success) {
            edgeTtsFailuresRef.current = 0;
            return;
          }
          edgeTtsFailuresRef.current++;
          console.warn(
            `[TTS] Edge TTS failure ${edgeTtsFailuresRef.current}/${MAX_FAILURES}`,
          );
        }

        // Tier 3: Browser SpeechSynthesis (last resort)
        if (browserTtsFailuresRef.current < MAX_FAILURES) {
          const success = await speakViaBrowser(cleanText);
          if (success) {
            browserTtsFailuresRef.current = 0;
            return;
          }
          browserTtsFailuresRef.current++;
          console.warn(
            `[TTS] Browser TTS failure ${browserTtsFailuresRef.current}/${MAX_FAILURES}`,
          );
        }

        // All tiers exhausted — notify once per session
        if (!ttsFailureNotifiedRef.current) {
          ttsFailureNotifiedRef.current = true;
          console.warn("[TTS] All tiers exhausted — judge is now silent");
          onAllTiersFailed?.();
        }
      };

      trySpeak();
    },
    [enabled, cleanupAudio, speakViaEndpoint, speakViaBrowser, onAllTiersFailed],
  );

  const stop = useCallback(() => {
    cleanupAudio();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [cleanupAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cleanupAudio]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: true, // Always supported — we use Audio API
    setEnabled,
    enabled,
    unlockAudio,
  };
}

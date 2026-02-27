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

/** Timeout for TTS API calls — fail fast so we can fall through tiers */
const TTS_FETCH_TIMEOUT_MS = 8_000;

/** Max consecutive failures before a tier is skipped for the session */
const MAX_FAILURES = 2;

/** Safety timeout for browser SpeechSynthesis (some mobile browsers never fire onend) */
const BROWSER_TTS_TIMEOUT_MS = 30_000;

/**
 * Hybrid TTS hook — four-tier voice quality:
 *
 * 1. ElevenLabs (primary) — highest quality, British "Daniel" voice.
 *    Requires API key + has monthly character quota.
 *
 * 2. Edge TTS (fallback) — free, high-quality Microsoft neural voice.
 *    Uses en-GB-RyanNeural via /api/ai/tts/edge. No API key needed.
 *
 * 3. Browser SpeechSynthesis (last resort) — built-in browser TTS.
 *    Quality varies by browser/OS. Prefers British English voice.
 *
 * 4. Silent — if all tiers fail, no audio plays.
 *
 * Mobile fix: iOS/Android require the first audio play to happen
 * inside a user gesture (tap). We "unlock" by creating a silent Audio
 * element when the user toggles TTS on.
 */
export function useSpeechSynthesis(
  options?: UseSpeechSynthesisOptions,
): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabledState] = useState(true); // On by default — judge should speak
  const unlockedRef = useRef(false);
  const allTiersFailedRef = useRef(false);

  // Failure counters — allow MAX_FAILURES consecutive failures before disabling
  const elevenLabsFailuresRef = useRef(0);
  const edgeTtsFailuresRef = useRef(0);
  const browserTtsAvailableRef = useRef(
    typeof window !== "undefined" && "speechSynthesis" in window,
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const browserTtsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio is always supported (we use HTML5 Audio, not SpeechSynthesis)
  const isSupported = typeof window !== "undefined";

  // Track AudioContext for playback
  const audioContextRef = useRef<AudioContext | null>(null);

  // Pre-load voices — Chrome loads them asynchronously
  const voicesLoadedRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => { voicesLoadedRef.current = true; };
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    // Also try immediately in case they're already loaded
    if (window.speechSynthesis.getVoices().length > 0) voicesLoadedRef.current = true;
    return () => { window.speechSynthesis.removeEventListener("voiceschanged", loadVoices); };
  }, []);

  // Unlock audio API — called from user gesture (tap) context
  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume();
        audioContextRef.current = ctx;
      }
    } catch {
      // AudioContext not available
    }

    // Also warm up browser speechSynthesis inside user gesture (iOS fix)
    if ("speechSynthesis" in window) {
      try {
        const warmup = new SpeechSynthesisUtterance("");
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
        window.speechSynthesis.cancel();
      } catch { /* ignore */ }
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
    // Clear browser TTS safety timer
    if (browserTtsTimerRef.current) {
      clearTimeout(browserTtsTimerRef.current);
      browserTtsTimerRef.current = null;
    }
    // Stop AudioContext buffer source
    if (bufferSourceRef.current) {
      try { bufferSourceRef.current.stop(); } catch { /* already stopped */ }
      bufferSourceRef.current = null;
    }
    // Stop HTML Audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    // Revoke blob URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    // Cancel browser speechSynthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // ── Fetch with timeout — prevents hanging when TTS service is unresponsive ──
  const fetchWithTimeout = useCallback(
    async (url: string, options: RequestInit): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TTS_FETCH_TIMEOUT_MS);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return res;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },
    [],
  );

  // ── Generic audio TTS — fetches from an endpoint, plays the result ──
  const speakViaEndpoint = useCallback(
    async (endpoint: string, text: string): Promise<boolean> => {
      try {
        const res = await fetchWithTimeout(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          console.warn(`[TTS] ${endpoint} returned ${res.status}`);
          return false;
        }

        const arrayBuffer = await res.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          console.warn(`[TTS] ${endpoint} returned empty audio`);
          return false;
        }

        // Try AudioContext playback first
        const ctx = audioContextRef.current;
        if (ctx && ctx.state !== "closed") {
          try {
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
          } catch {
            // AudioContext decode/play failed — fall through to Audio element
          }
        }

        // Fallback: Audio element
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
          audio.play().catch(() => {
            cleanupAudio();
            resolve(false);
          });
        });
      } catch (err) {
        const isTimeout = err instanceof DOMException && err.name === "AbortError";
        console.warn(`[TTS] ${endpoint} failed:`, isTimeout ? "timeout" : err);
        return false;
      }
    },
    [cleanupAudio, fetchWithTimeout],
  );

  // ── Browser SpeechSynthesis fallback ──
  const speakViaBrowser = useCallback(
    (text: string): boolean => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;

      try {
        const synth = window.speechSynthesis;
        // Cancel any queued speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        utterance.volume = 1;

        // Try to find a British English voice
        const voices = synth.getVoices();
        const britishVoice = voices.find(
          (v) => v.lang === "en-GB" && v.name.toLowerCase().includes("male"),
        ) ?? voices.find(
          (v) => v.lang === "en-GB",
        ) ?? voices.find(
          (v) => v.lang.startsWith("en"),
        );

        if (britishVoice) utterance.voice = britishVoice;
        utterance.lang = "en-GB";

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          if (browserTtsTimerRef.current) {
            clearTimeout(browserTtsTimerRef.current);
            browserTtsTimerRef.current = null;
          }
          setIsSpeaking(false);
        };
        utterance.onerror = () => {
          if (browserTtsTimerRef.current) {
            clearTimeout(browserTtsTimerRef.current);
            browserTtsTimerRef.current = null;
          }
          setIsSpeaking(false);
        };

        synth.speak(utterance);

        // Safety timeout — some mobile browsers never fire onend
        browserTtsTimerRef.current = setTimeout(() => {
          synth.cancel();
          setIsSpeaking(false);
          browserTtsTimerRef.current = null;
        }, BROWSER_TTS_TIMEOUT_MS);

        return true;
      } catch {
        console.warn("[TTS] Browser SpeechSynthesis failed");
        return false;
      }
    },
    [],
  );

  // ── Main speak function — tries ElevenLabs → Edge TTS → Browser → silent ──
  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;

      // Stop any ongoing audio
      cleanupAudio();

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
        }

        // Tier 2: Edge TTS (free, high quality)
        if (edgeTtsFailuresRef.current < MAX_FAILURES) {
          const success = await speakViaEndpoint("/api/ai/tts/edge", cleanText);
          if (success) {
            edgeTtsFailuresRef.current = 0;
            return;
          }
          edgeTtsFailuresRef.current++;
        }

        // Tier 3: Browser SpeechSynthesis (built-in, quality varies)
        if (browserTtsAvailableRef.current) {
          const success = speakViaBrowser(cleanText);
          if (success) return;
          browserTtsAvailableRef.current = false;
        }

        // Tier 4: Silent — all services unavailable
        if (!allTiersFailedRef.current) {
          allTiersFailedRef.current = true;
          console.warn("[TTS] All tiers exhausted — audio will be silent");
          options?.onAllTiersFailed?.();
        }
      };

      trySpeak();
    },
    [enabled, cleanupAudio, speakViaEndpoint, speakViaBrowser, options],
  );

  const stop = useCallback(() => {
    cleanupAudio();
    setIsSpeaking(false);
  }, [cleanupAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: true,
    setEnabled,
    enabled,
    unlockAudio,
  };
}

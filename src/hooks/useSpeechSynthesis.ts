"use client";

import { useCallback, useRef, useState, useEffect } from "react";

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
 *    Same voice as our promo video voiceovers.
 *
 * 3. Silent fallback — if both services fail, no audio plays.
 *    (We skip browser SpeechSynthesis entirely as it sounds too robotic.)
 *
 * Mobile fix: iOS/Android require the first audio play to happen
 * inside a user gesture (tap). We "unlock" by creating a silent Audio
 * element when the user toggles TTS on.
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabledState] = useState(true); // On by default — judge should speak
  const unlockedRef = useRef(false);

  // ElevenLabs state — starts true, set to false after first failure
  const elevenLabsAvailableRef = useRef(true);
  // Edge TTS state — starts true, set to false after first failure
  const edgeTtsAvailableRef = useRef(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  // Track AudioContext buffer source for stop()
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Audio is always supported (we use HTML5 Audio, not SpeechSynthesis)
  const isSupported = typeof window !== "undefined";

  // Track AudioContext for ElevenLabs playback
  const audioContextRef = useRef<AudioContext | null>(null);

  // Unlock audio API — called from user gesture (tap) context
  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;

    // Unlock AudioContext for ElevenLabs/Edge TTS playback
    //    Once resumed inside a user gesture, AudioContext stays unlocked
    //    for the entire page lifetime — so audio.play() works even after
    //    async calls (like waiting for the AI response).
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume();
        audioContextRef.current = ctx;
      }
    } catch {
      // AudioContext not available — ElevenLabs will still try
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
      try { bufferSourceRef.current.stop(); } catch { /* already stopped */ }
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
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) return false;

        // Read response body once (can only be consumed once)
        const arrayBuffer = await res.arrayBuffer();

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
          } catch {
            // AudioContext decode/play failed — fall through to Audio element
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
          audio.play().catch(() => {
            cleanupAudio();
            resolve(false);
          });
        });
      } catch {
        return false;
      }
    },
    [cleanupAudio],
  );

  // ── Main speak function — tries ElevenLabs → Edge TTS → silent ──
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
        if (elevenLabsAvailableRef.current) {
          const success = await speakViaEndpoint("/api/ai/tts", cleanText);
          if (success) return;
          // Disable for rest of session on failure
          elevenLabsAvailableRef.current = false;
        }

        // Tier 2: Edge TTS (free, high quality)
        if (edgeTtsAvailableRef.current) {
          const success = await speakViaEndpoint("/api/ai/tts/edge", cleanText);
          if (success) return;
          // Disable for rest of session on failure
          edgeTtsAvailableRef.current = false;
        }

        // Tier 3: Silent — both services unavailable
        // We intentionally skip browser SpeechSynthesis as it sounds robotic
      };

      trySpeak();
    },
    [enabled, cleanupAudio, speakViaEndpoint],
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
    isSupported: true, // Always supported — we use Audio API
    setEnabled,
    enabled,
    unlockAudio,
  };
}

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
 * Hybrid TTS hook — ElevenLabs primary, browser SpeechSynthesis fallback.
 *
 * 1. Tries ElevenLabs first via POST /api/ai/tts (high-quality British voice).
 * 2. If ElevenLabs fails (no API key, quota exceeded, network error),
 *    automatically disables it for the rest of the session and falls back
 *    to the free browser SpeechSynthesis API.
 *
 * Mobile fix: iOS/Android require the first speak() call to happen
 * inside a user gesture (tap). We "unlock" the API by speaking a
 * silent utterance when the user toggles TTS on.
 *
 * Also works around the iOS bug where speech pauses after ~15s
 * by running a resume interval while speaking.
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabledState] = useState(true); // On by default — judge should speak
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlockedRef = useRef(false);

  // ElevenLabs state — starts true, set to false after first failure
  const elevenLabsAvailableRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Track any active Audio object URL for cleanup
  const objectUrlRef = useRef<string | null>(null);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Find the best British English voice (for browser fallback)
  useEffect(() => {
    if (!isSupported) return;

    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Priority: British English male voices — best available on each platform
      const priorities = [
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && /google uk english male/i.test(v.name),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && v.name.toLowerCase().includes("male"),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && v.name.toLowerCase().includes("daniel"),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && v.name.toLowerCase().includes("james"),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && !/samantha/i.test(v.name),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB",
        (v: SpeechSynthesisVoice) => v.lang.startsWith("en") && !/samantha/i.test(v.name),
        (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
      ];

      for (const test of priorities) {
        const match = voices.find(test);
        if (match) {
          voiceRef.current = match;
          return;
        }
      }

      // Last resort: any voice
      if (voices.length > 0) {
        voiceRef.current = voices[0];
      }
    };

    findVoice();
    window.speechSynthesis.onvoiceschanged = findVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  // iOS resume workaround — speech pauses after ~15s
  const startResumeInterval = useCallback(() => {
    if (resumeIntervalRef.current) return;
    resumeIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }, []);

  const clearResumeInterval = useCallback(() => {
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }
  }, []);

  // Unlock speech API — called from user gesture (tap) context
  const unlockAudio = useCallback(() => {
    if (!isSupported || unlockedRef.current) return;
    // Speak a silent/empty utterance to "warm up" the API on mobile
    const silent = new SpeechSynthesisUtterance("");
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
    unlockedRef.current = true;
  }, [isSupported]);

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

  // ── Cleanup helper for ElevenLabs audio ──
  const cleanupAudio = useCallback(() => {
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

  // ── ElevenLabs TTS — returns true if audio is playing, false on failure ──
  const speakViaElevenLabs = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          // Disable ElevenLabs for the rest of the session on permanent errors
          const isTransient = res.status >= 500 && res.status !== 503;
          if (!isTransient) {
            elevenLabsAvailableRef.current = false;
          }
          return false;
        }

        const audioBlob = await res.blob();
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
            // Don't disable ElevenLabs on playback errors (might be device-specific)
            resolve(false);
          };
          audio.play().catch(() => {
            cleanupAudio();
            resolve(false);
          });
        });
      } catch {
        // Network error — disable ElevenLabs for this session
        elevenLabsAvailableRef.current = false;
        return false;
      }
    },
    [cleanupAudio],
  );

  // ── Browser SpeechSynthesis fallback ──
  const speakViaBrowser = useCallback(
    (text: string) => {
      if (!isSupported) return;

      window.speechSynthesis.cancel();
      clearResumeInterval();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.rate = 0.9; // Slightly slower — judicial gravitas
      utterance.pitch = 0.85; // Slightly deeper
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
        startResumeInterval(); // iOS fix
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        clearResumeInterval();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        clearResumeInterval();
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, startResumeInterval, clearResumeInterval],
  );

  // ── Main speak function — tries ElevenLabs first, then browser ──
  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;

      // Stop any ongoing speech
      cleanupAudio();
      if (isSupported) {
        window.speechSynthesis.cancel();
        clearResumeInterval();
      }

      // Strip any remaining emotes/asterisks
      const cleanText = text.replace(/\*[^*]+\*/g, "").trim();
      if (!cleanText) return;

      if (elevenLabsAvailableRef.current) {
        // Try ElevenLabs first — fall back to browser on failure
        speakViaElevenLabs(cleanText).then((success) => {
          if (!success && isSupported) {
            speakViaBrowser(cleanText);
          }
        });
      } else {
        // ElevenLabs disabled for this session — use browser directly
        speakViaBrowser(cleanText);
      }
    },
    [
      enabled,
      isSupported,
      cleanupAudio,
      clearResumeInterval,
      speakViaElevenLabs,
      speakViaBrowser,
    ],
  );

  const stop = useCallback(() => {
    cleanupAudio();
    if (isSupported) {
      window.speechSynthesis.cancel();
      clearResumeInterval();
    }
    setIsSpeaking(false);
  }, [isSupported, clearResumeInterval, cleanupAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (isSupported) window.speechSynthesis.cancel();
      clearResumeInterval();
    };
  }, [isSupported, clearResumeInterval, cleanupAudio]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: isSupported || elevenLabsAvailableRef.current,
    setEnabled,
    enabled,
    unlockAudio,
  };
}

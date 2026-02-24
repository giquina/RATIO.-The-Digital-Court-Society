"use client";

import { useCallback, useRef, useState, useEffect } from "react";

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  setEnabled: (enabled: boolean) => void;
  enabled: boolean;
}

/**
 * Text-to-speech hook using browser's built-in SpeechSynthesis API.
 * Selects a deep, formal British English voice when available.
 * Free — no API calls needed.
 *
 * Mobile fix: iOS/Android require the first speak() call to happen
 * inside a user gesture (tap). We "unlock" the API by speaking a
 * silent utterance when the user toggles TTS on. After that,
 * programmatic speak() calls work fine.
 *
 * Also works around the iOS bug where speech pauses after ~15s
 * by running a resume interval while speaking.
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabledState] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlockedRef = useRef(false);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Find the best British English voice
  useEffect(() => {
    if (!isSupported) return;

    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Priority: British English male voices
      const priorities = [
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && v.name.toLowerCase().includes("male"),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && v.name.toLowerCase().includes("daniel"),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB" && v.name.toLowerCase().includes("james"),
        (v: SpeechSynthesisVoice) => v.lang === "en-GB",
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
  // Keep poking it so it doesn't stop
  const startResumeInterval = useCallback(() => {
    if (resumeIntervalRef.current) return;
    resumeIntervalRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000); // every 10s
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
  const setEnabled = useCallback((value: boolean) => {
    if (value && isSupported) {
      unlockAudio();
    }
    setEnabledState(value);
  }, [isSupported, unlockAudio]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !enabled) return;

      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      clearResumeInterval();

      // Strip any remaining emotes/asterisks just in case
      const cleanText = text.replace(/\*[^*]+\*/g, "").trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
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
    [isSupported, enabled, startResumeInterval, clearResumeInterval],
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      clearResumeInterval();
      setIsSpeaking(false);
    }
  }, [isSupported, clearResumeInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
      clearResumeInterval();
    };
  }, [isSupported, clearResumeInterval]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    setEnabled,
    enabled,
  };
}

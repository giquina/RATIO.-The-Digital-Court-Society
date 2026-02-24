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
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

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

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !enabled) return;

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

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

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, enabled],
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    setEnabled,
    enabled,
  };
}

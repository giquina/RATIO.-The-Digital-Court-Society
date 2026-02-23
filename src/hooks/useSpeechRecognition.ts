"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const MAX_TRANSCRIPT_LENGTH = 50000;

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Initialize recognition instance once
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => {
          const next = prev + " " + finalTranscript;
          if (next.length > MAX_TRANSCRIPT_LENGTH) {
            return next.slice(-MAX_TRANSCRIPT_LENGTH);
          }
          return next;
        });
      }
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      if (event.error !== "aborted") {
        // eslint-disable-next-line no-console
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      // Use ref to avoid stale closure — auto-restart if still listening
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // Already started or destroyed
          setIsListening(false);
          isListeningRef.current = false;
        }
      }
    };

    recognitionRef.current = recognition;

    // Cleanup: abort recognition on unmount
    return () => {
      isListeningRef.current = false;
      try {
        recognition.abort();
      } catch {
        // Already stopped
      }
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognitionRef.current = null;
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListeningRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        isListeningRef.current = true;
      } catch {
        // Already started
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript: transcript.trim(),
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

// TypeScript declarations for Web Speech API
interface ISpeechRecognitionResult {
  isFinal: boolean;
  readonly length: number;
  [index: number]: { transcript: string; confidence: number };
}

interface ISpeechRecognitionResultList {
  readonly length: number;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: ISpeechRecognitionConstructor;
    webkitSpeechRecognition: ISpeechRecognitionConstructor;
  }
}

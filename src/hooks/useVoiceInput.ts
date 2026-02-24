"use client";

import { useState, useRef, useCallback } from "react";

interface UseVoiceInputReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscript: () => void;
  isSupported: boolean;
}

/**
 * Voice input hook — records audio via MediaRecorder, sends to Whisper API
 * for accurate transcription. If Whisper is unavailable (no API key),
 * the UI should fall back to the existing useSpeechRecognition hook.
 *
 * Think of it like a voice note: tap to record, release to transcribe.
 */
export function useVoiceInput(): UseVoiceInputReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia;

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError("Microphone not supported on this device.");
      return;
    }

    setError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;

      // Prefer webm/opus (most efficient for Whisper), fallback to others
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the mic
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (chunksRef.current.length === 0) {
          setError("No audio was captured. Please try again.");
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: mimeType });

        // Don't send tiny recordings (likely accidental taps)
        if (audioBlob.size < 1000) {
          setError("Recording was too short. Hold the button longer.");
          return;
        }

        // Send to Whisper API
        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const res = await fetch("/api/ai/transcribe", {
            method: "POST",
            body: formData,
          });

          if (res.status === 503) {
            // Whisper not configured — signal to use browser fallback
            setError("WHISPER_UNAVAILABLE");
            setIsTranscribing(false);
            return;
          }

          if (!res.ok) {
            throw new Error(`Transcription failed: ${res.status}`);
          }

          const data = await res.json();
          if (data.transcript) {
            setTranscript(data.transcript);
          } else {
            setError("No speech detected. Please try again.");
          }
        } catch {
          setError("Transcription failed. Please type your response instead.");
        }
        setIsTranscribing(false);
      };

      // Record in 1-second chunks for reliability
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Microphone access was denied. Please allow microphone access in your browser settings.");
      } else {
        setError("Could not access microphone. Please check your device settings.");
      }
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    isSupported,
  };
}

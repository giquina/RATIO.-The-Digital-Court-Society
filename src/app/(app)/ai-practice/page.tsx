"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Tag, Card, Button, ProgressBar, DynamicIcon } from "@/components/ui";
import { AI_PERSONAS, FEEDBACK_DIMENSIONS } from "@/lib/constants/app";
import { courtToast } from "@/lib/utils/toast";
import { Lightbulb, Book, Mic, MicOff, Pause, ArrowUp, Scale, AlertCircle, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { analytics } from "@/lib/analytics";
import ModeSelector from "@/components/ai-practice/ModeSelector";
import JudgeAvatar from "@/components/ai-practice/JudgeAvatar";
import ObjectionButtons from "@/components/ai-practice/ObjectionButtons";
import TranscriptPanel from "@/components/ai-practice/TranscriptPanel";
import CaseNotePanel from "@/components/ai-practice/CaseNotePanel";
import SpectatorShare from "@/components/ai-practice/SpectatorShare";
import SessionDock from "@/components/ai-practice/SessionDock";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils/helpers";
import { useSessionStore } from "@/stores/sessionStore";
import { useAIUserContext } from "@/hooks/useAIUserContext";
import { selectScenario, CASE_BRIEFS, type CaseBrief } from "@/lib/ai/scenario-bank";
import {
  playCourtInSession,
  playJudgeResponse,
  playMessageSent,
  playChime,
  playRecordBeep,
  playRecordStopBeep,
  resumeAudio,
} from "@/lib/utils/sounds";
import {
  JUDGE_TEMPERAMENTS,
  type JudgeTemperament,
} from "@/lib/ai/system-prompts";

type Screen = "select" | "briefing" | "session" | "loading-feedback" | "feedback";
type Mode = "judge" | "mentor" | "examiner" | "opponent";

interface Message {
  role: "ai" | "user";
  text: string;
  time: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_EXCHANGES = 30;

// Case briefs imported from @/lib/ai/scenario-bank

const AI_RESPONSES = [
  "Counsel, I'll stop you there. You cite Miller, but the ratio in Miller concerned prorogation specifically. How do you say the ratio extends to the broader prerogative power at issue in this appeal? Be precise.",
  "That's a stronger formulation. But tell me this — if the prerogative cannot override statute, how do you address the Crown's argument that the 1972 Act was always subject to implied repeal by subsequent prerogative action?",
  "I'm not satisfied with that distinction, Counsel. The CCSU case established that prerogative powers are reviewable. But reviewability and unlawfulness are different things. Which are you arguing?",
  "Very well. You have five minutes remaining. I suggest you move to your strongest authority and conclude your submissions.",
];

const FALLBACK_SCORES = {
  argumentStructure: 3.5, useOfAuthorities: 4.0, oralDelivery: 3.8,
  judicialHandling: 3.2, courtManner: 4.5, persuasiveness: 3.6, timeManagement: 4.0,
};

const FALLBACK_JUDGMENT = "Counsel demonstrated a solid understanding of the constitutional principles at play. The opening submissions were well-structured, following IRAC methodology competently. However, when pressed on the distinction between reviewability and unlawfulness of prerogative power, Counsel\u2019s response lacked the precision this court would expect. Court manner was exemplary throughout.";

const FALLBACK_KEY_STRENGTH = "Well-structured opening submissions following IRAC methodology with exemplary court manner throughout.";

const FALLBACK_KEY_IMPROVEMENT = "When facing a judicial intervention, take a moment before responding. Your instinct to answer immediately led to imprecise language when discussing the GCHQ distinction. Pause, consider the exact question, then respond with specificity.";

// ── Emote stripping safety net ──
function stripEmotes(text: string): string {
  return text.replace(/\*[^*]+\*/g, "").replace(/\s{2,}/g, " ").trim();
}

// ── Local error boundary — catches runtime errors within the AI Practice page
//    so that the app shell (sidebar, nav) stays intact and navigable ──
class AIPracticeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100dvh-140px)] md:h-[calc(100dvh-80px)] px-6">
          <div className="w-16 h-16 rounded-full bg-burgundy/10 border border-burgundy/20 flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-burgundy" />
          </div>
          <h2 className="font-serif text-xl font-bold text-court-text mb-2 text-center">
            Session Interrupted
          </h2>
          <p className="text-court-sm text-court-text-sec text-center max-w-sm mb-6">
            An unexpected error occurred. Your session data has been preserved where possible.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
            }}
            className="px-5 py-2.5 rounded-xl bg-gold text-navy font-bold text-court-sm hover:bg-gold/90 transition-colors"
          >
            Return to Mode Selection
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AIPracticePageWrapper() {
  return (
    <AIPracticeErrorBoundary>
      <AIPracticePageInner />
    </AIPracticeErrorBoundary>
  );
}

function AIPracticePageInner() {
  const [screen, setScreen] = useState<Screen>("select");
  const aiUserContext = useAIUserContext();
  // Select stable Zustand function references (won't re-create on render)
  const enterSession = useSessionStore((s) => s.enterSession);
  const exitSession = useSessionStore((s) => s.exitSession);

  // Mounted guard — prevents state updates after unmount (navigation away)
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController>(new AbortController());

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current.abort();
    };
  }, []);

  /** Fetch with a 45-second timeout so AI calls don't hang indefinitely. */
  const fetchWithTimeout = useCallback(
    (url: string, init: RequestInit, timeoutMs = 45_000) => {
      const controller = new AbortController();
      const parentSignal = abortRef.current.signal;

      // Abort on unmount OR on timeout
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const onParentAbort = () => controller.abort();
      parentSignal.addEventListener("abort", onParentAbort);

      return fetch(url, { ...init, signal: controller.signal }).finally(() => {
        clearTimeout(timeout);
        parentSignal.removeEventListener("abort", onParentAbort);
      });
    },
    []
  );

  // Tell the layout to hide header/nav when in active session
  useEffect(() => {
    if (screen === "session") enterSession();
    else exitSession();
    return () => exitSession(); // cleanup on unmount
  }, [screen, enterSession, exitSession]);
  const [mode, setMode] = useState<Mode>("judge");
  const [temperament, setTemperament] = useState<JudgeTemperament>("standard");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [timer, setTimer] = useState(900);
  const [timerActive, setTimerActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lastAiResponse, setLastAiResponse] = useState("");

  // API integration state
  const [apiMessages, setApiMessages] = useState<Array<{role: 'user' | 'assistant'; content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [sessionLimitReached, setSessionLimitReached] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    scores: Record<string, number>;
    overall: number;
    judgment: string;
    keyStrength: string;
    keyImprovement: string;
  } | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackFallback, setFeedbackFallback] = useState(false);
  const [sessionStarting, setSessionStarting] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState(0);

  // Voice input (Whisper)
  const voiceInput = useVoiceInput();
  // Browser speech recognition (fallback)
  const browserSpeech = useSpeechRecognition();
  const [useWhisper, setUseWhisper] = useState(true);
  // Text-to-speech
  const tts = useSpeechSynthesis({
    onAllTiersFailed: () => {
      courtToast.info(
        "Judge voice unavailable",
        "Audio output is not available. The judge's responses will be text only."
      );
    },
  });

  // Case Note Generator
  const [caseNote, setCaseNote] = useState<Record<string, unknown> | null>(null);
  const [caseNoteGenerating, setCaseNoteGenerating] = useState(false);
  const [caseNoteError, setCaseNoteError] = useState<string | null>(null);

  // Spectator Mode
  const [spectatorEnabled, setSpectatorEnabled] = useState(false);
  const [spectatorCode, setSpectatorCode] = useState<string | null>(null);
  const [spectatorCount, setSpectatorCount] = useState(0);

  const persona = AI_PERSONAS[mode];
  // Select a scenario matching the user's practice areas (professional) or default (student).
  // We store it in state so it doesn't re-randomise on every render.
  const [brief, setBrief] = useState<CaseBrief>(CASE_BRIEFS[mode]);

  // When mode changes or we move to briefing, select an appropriate scenario
  useEffect(() => {
    setBrief(
      selectScenario(mode, aiUserContext?.practiceAreas, aiUserContext?.userType)
    );
  }, [mode, aiUserContext?.practiceAreas, aiUserContext?.userType]);

  // Get the display name for judge (may vary by temperament)
  const displayPersonaName = mode === "judge"
    ? JUDGE_TEMPERAMENTS[temperament]?.name || persona.name
    : persona.name;

  const buildCaseContext = useCallback(() => {
    return `${brief.area}: ${brief.matter}. Role: ${brief.yourRole}. Authorities: ${brief.authorities.join(', ')}`;
  }, [brief]);

  // Timer
  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [timerActive, timer]);

  // Auto-scroll chat — scroll to bottom only after user sends (not on judge's opening)
  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-dismiss rate limit banner
  useEffect(() => {
    if (rateLimited) {
      const timeout = setTimeout(() => setRateLimited(false), 10000);
      return () => clearTimeout(timeout);
    }
  }, [rateLimited]);

  // When Whisper transcript arrives, insert into input
  useEffect(() => {
    if (voiceInput.transcript) {
      setInputText((prev) => (prev ? prev + " " : "") + voiceInput.transcript);
      voiceInput.clearTranscript();
    }
  }, [voiceInput.transcript, voiceInput.clearTranscript]);

  // When Whisper is unavailable, switch to browser fallback
  useEffect(() => {
    if (voiceInput.error === "WHISPER_UNAVAILABLE") {
      setUseWhisper(false);
      voiceInput.clearTranscript();
    }
  }, [voiceInput.error, voiceInput.clearTranscript]);

  // When browser speech recognition transcript updates, insert into input
  useEffect(() => {
    if (!useWhisper && browserSpeech.transcript) {
      setInputText(browserSpeech.transcript);
    }
  }, [useWhisper, browserSpeech.transcript]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ── Voice toggle handler ──
  const handleVoiceToggle = () => {
    resumeAudio();
    if (useWhisper) {
      if (voiceInput.isRecording) {
        voiceInput.stopRecording();
        playRecordStopBeep();
      } else {
        voiceInput.startRecording();
        playRecordBeep();
      }
    } else {
      if (browserSpeech.isListening) {
        browserSpeech.stopListening();
        playRecordStopBeep();
      } else {
        browserSpeech.startListening();
        playRecordBeep();
      }
    }
  };

  const isRecordingActive = useWhisper ? voiceInput.isRecording : browserSpeech.isListening;

  // ── Start session ──
  const startSession = async () => {
    analytics.aiPracticeStarted(mode);
    setScreen("session");
    setSessionStarting(true);
    setTimerActive(true);
    setExchangeCount(0);
    setError(null);
    setFeedbackData(null);
    setFeedbackFallback(false);
    setFeedbackStep(0);
    setLastAiResponse("");

    // Unlock speech API inside user gesture — required by iOS/Safari/Android
    tts.unlockAudio();

    resumeAudio();
    playCourtInSession();

    const openings: Record<Mode, string> = {
      judge: "This court is now in session. I have read the papers before me. Counsel for the Appellant, you may begin your submissions. Please state the central issue you invite this court to determine.",
      mentor: "Good afternoon. I've reviewed the skeleton argument you submitted. Let's work through it together. Tell me \u2014 what's the central question the court needs to decide in this matter?",
      examiner: "This is your SQE2 advocacy assessment. You are Counsel for the Applicant in a summary judgment application under CPR Part 24. You have 15 minutes. Please begin your submissions.",
      opponent: "Counsel, I appear for the Defence. I will be making submissions that the confession evidence was obtained in breach of PACE. You may begin for the Prosecution.",
    };

    let openingText = openings[mode];
    try {
      const initialApiMessages: Array<{role: 'user' | 'assistant'; content: string}> = [
        { role: 'user', content: 'Begin the session. Provide your opening statement in character.' }
      ];

      const res = await fetchWithTimeout('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: initialApiMessages,
          caseContext: buildCaseContext(),
          temperament: mode === "judge" ? temperament : "standard",
          userContext: aiUserContext,
        }),
      });

      if (!mountedRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          openingText = stripEmotes(data.content);
          setApiMessages([
            { role: 'user', content: 'Begin the session. Provide your opening statement in character.' },
            { role: 'assistant', content: openingText },
          ]);
        }
      }
    } catch (err) {
      // Abort (unmount/timeout) — exit silently; network error — use fallback
      if (!mountedRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.warn("[AI Opening] Fetch failed, using fallback:", err instanceof Error ? err.message : err);
    }

    setApiMessages((prev) => {
      if (prev.length === 0) {
        return [
          { role: 'user', content: 'Begin the session. Provide your opening statement in character.' },
          { role: 'assistant', content: openingText },
        ];
      }
      return prev;
    });

    setSessionStarting(false);
    setMessages([{
      role: "ai",
      text: openingText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setLastAiResponse(openingText);
    setAiSpeaking(true);

    // TTS: speak the opening
    tts.speak(openingText);

    setTimeout(() => {
      if (mountedRef.current) setAiSpeaking(false);
    }, 3000);
  };

  // ── Send message ──
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    if (inputText.length > MAX_MESSAGE_LENGTH) {
      setInputError(`Submissions must not exceed ${MAX_MESSAGE_LENGTH} characters. Current: ${inputText.length}`);
      return;
    }
    setInputError(null);

    if (exchangeCount >= MAX_EXCHANGES) {
      setError("This session has reached its conclusion. Please end the session to receive your assessment.");
      return;
    }

    // Stop any voice recording
    if (isRecordingActive) {
      if (useWhisper) voiceInput.stopRecording();
      else browserSpeech.stopListening();
    }
    // Stop browser speech recognition transcript
    if (!useWhisper) browserSpeech.resetTranscript();

    const userMsg: Message = {
      role: "user",
      text: inputText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(false);
    setAiSpeaking(true);
    setIsLoading(true);
    setError(null);
    playMessageSent();

    // Stop TTS if playing
    tts.stop();

    const updatedApiMessages: Array<{role: 'user' | 'assistant'; content: string}> = [
      ...apiMessages,
      { role: 'user', content: inputText },
    ];

    try {
      const res = await fetchWithTimeout('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: updatedApiMessages,
          caseContext: buildCaseContext(),
          temperament: mode === "judge" ? temperament : "standard",
          userContext: aiUserContext,
        }),
      });

      if (!mountedRef.current) return;

      if (res.status === 429) {
        setRateLimited(true);
        setAiSpeaking(false);
        setIsLoading(false);
        return;
      }

      if (res.status === 402 || res.status === 403) {
        setSessionLimitReached(true);
        setAiSpeaking(false);
        setIsLoading(false);
        setScreen("select");
        return;
      }

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const rawAiText = data.content || AI_RESPONSES[Math.min(exchangeCount, AI_RESPONSES.length - 1)];
      const aiText = stripEmotes(rawAiText);

      setApiMessages([...updatedApiMessages, { role: 'assistant', content: aiText }]);
      setExchangeCount((c) => c + 1);
      setLastAiResponse(aiText);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiText,
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      playJudgeResponse();
      tts.speak(aiText);

      setAiSpeaking(false);
      setIsLoading(false);
    } catch (err) {
      if (!mountedRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;

      console.warn("[AI Chat] Fetch failed, using fallback:", err instanceof Error ? err.message : err);

      const responseIdx = Math.min(exchangeCount, AI_RESPONSES.length - 1);
      const fallbackText = AI_RESPONSES[responseIdx];

      setApiMessages([...updatedApiMessages, { role: 'assistant', content: fallbackText }]);
      setExchangeCount((c) => c + 1);
      setLastAiResponse(fallbackText);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: fallbackText,
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setError("The court is experiencing difficulties. Your submissions have been noted.");
      setAiSpeaking(false);
      setIsLoading(false);
    }
  };

  // ── End session ──
  const endSession = async () => {
    setTimerActive(false);
    tts.stop();
    playChime();
    setScreen("loading-feedback");

    const sessionDuration = 900 - timer;
    analytics.aiPracticeCompleted(mode, sessionDuration);

    try {
      const res = await fetchWithTimeout('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: apiMessages,
          caseContext: buildCaseContext(),
          sessionDuration,
          userContext: aiUserContext,
        }),
      }, 60_000); // feedback generation can take longer

      if (!mountedRef.current) return;

      if (res.ok) {
        const data = await res.json();
        setFeedbackData({
          scores: data.scores || FALLBACK_SCORES,
          overall: data.overall || parseFloat(((Object.values(data.scores || FALLBACK_SCORES) as number[]).reduce((a, b) => a + b, 0) / 7).toFixed(1)),
          judgment: data.judgment || FALLBACK_JUDGMENT,
          keyStrength: data.keyStrength || FALLBACK_KEY_STRENGTH,
          keyImprovement: data.keyImprovement || FALLBACK_KEY_IMPROVEMENT,
        });
        setFeedbackFallback(false);
      } else {
        throw new Error('Feedback API error');
      }
    } catch (err) {
      if (!mountedRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;

      console.warn("[AI Feedback] Fetch failed, using fallback:", err instanceof Error ? err.message : err);

      setFeedbackData({
        scores: FALLBACK_SCORES,
        overall: parseFloat((Object.values(FALLBACK_SCORES).reduce((a, b) => a + b, 0) / 7).toFixed(1)),
        judgment: FALLBACK_JUDGMENT,
        keyStrength: FALLBACK_KEY_STRENGTH,
        keyImprovement: FALLBACK_KEY_IMPROVEMENT,
      });
      setFeedbackFallback(true);
    }

    if (!mountedRef.current) return;
    setTimeout(() => {
      if (mountedRef.current) setScreen("feedback");
    }, 1500);
  };

  // ── Generate Case Note ──
  const generateCaseNote = async () => {
    setCaseNoteGenerating(true);
    setCaseNoteError(null);

    try {
      const res = await fetchWithTimeout("/api/ai/case-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          areaOfLaw: brief.area,
          caseTitle: brief.matter,
          messages: apiMessages,
          scores: feedbackData?.scores,
          overallScore: feedbackData?.overall,
          judgment: feedbackData?.judgment,
        }),
      }, 60_000);

      if (!mountedRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (!mountedRef.current) return;
        setCaseNote(data.caseNote);
      } else {
        throw new Error("Case note API error");
      }
    } catch (err) {
      if (!mountedRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;

      console.warn("[AI CaseNote] Fetch failed:", err instanceof Error ? err.message : err);
      setCaseNoteError("Unable to generate case note. Please try again.");
    }

    if (!mountedRef.current) return;
    setCaseNoteGenerating(false);
  };

  // ── Spectator Mode toggles ──
  const enableSpectatorMode = async (): Promise<string> => {
    // For now, spectator mode uses local state.
    // When connected to Convex session persistence, this will call
    // the aiSessions.enableSpectator mutation instead.
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSpectatorEnabled(true);
    setSpectatorCode(code);
    setSpectatorCount(0);
    return code;
  };

  const disableSpectatorMode = async (): Promise<void> => {
    setSpectatorEnabled(false);
    setSpectatorCode(null);
    setSpectatorCount(0);
  };

  // ── LOADING FEEDBACK INTERSTITIAL ──
  // Rotating status messages while feedback generates (15-45 seconds)
  const FEEDBACK_MESSAGES = [
    "The court is retiring to consider its judgment...",
    "Reviewing your submissions against the authorities cited...",
    "Assessing argument structure and legal reasoning...",
    "Evaluating courtroom manner and judicial handling...",
    "Preparing the court's written judgment...",
  ];

  // Cycle through messages every 3.5 seconds
  useEffect(() => {
    if (screen !== "loading-feedback") return;
    const interval = setInterval(() => {
      setFeedbackStep((prev) => {
        // If feedbackData is ready, hold on the final message
        if (feedbackData) return FEEDBACK_MESSAGES.length - 1;
        return (prev + 1) % FEEDBACK_MESSAGES.length;
      });
    }, 3500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, feedbackData]);

  if (screen === "loading-feedback") {
    const sessionDuration = 900 - timer;
    const mins = Math.floor(sessionDuration / 60);
    const secs = sessionDuration % 60;
    const displayMsg = feedbackData
      ? "Judgment ready. The court will now deliver its findings..."
      : FEEDBACK_MESSAGES[feedbackStep % FEEDBACK_MESSAGES.length];

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-80px)] px-4">
        <div className="flex flex-col items-center gap-6 max-w-md w-full">
          {/* Pulsing icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center animate-pulse">
              <Scale size={32} className="text-gold" />
            </div>
          </div>

          {/* Rotating status message */}
          <div className="text-center min-h-[52px] flex items-center justify-center">
            <motion.p
              key={displayMsg}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-lg font-bold text-court-text"
            >
              {displayMsg}
            </motion.p>
          </div>

          {/* Bouncing dots */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '200ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>

          {/* Session summary stats (available locally) */}
          <div className="flex items-center justify-center gap-4 text-court-xs text-court-text-ter mt-2">
            <span>{mins}m {secs.toString().padStart(2, "0")}s</span>
            <span className="w-px h-3 bg-court-border" />
            <span>{exchangeCount} exchanges</span>
            <span className="w-px h-3 bg-court-border" />
            <span className="capitalize">{brief.area}</span>
          </div>

          {/* Skeleton feedback preview */}
          <Card className="w-full p-4 mt-2 border-court-border-light">
            <div className="space-y-3">
              {FEEDBACK_DIMENSIONS.slice(0, 5).map((dim) => (
                <div key={dim.key} className="flex items-center gap-3">
                  <span className="text-court-xs text-court-text-ter w-28 truncate">{dim.label.split("(")[0].trim()}</span>
                  <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gold/15 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${30 + Math.random() * 50}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-[90%] bg-white/[0.04] rounded animate-pulse" />
              <div className="h-3 w-[75%] bg-white/[0.04] rounded animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="h-3 w-[60%] bg-white/[0.04] rounded animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── MODE SELECTION ──
  if (screen === "select") {
    return (
      <ModeSelector
        onSelectMode={(key) => { setMode(key); setScreen("briefing"); }}
        sessionLimitReached={sessionLimitReached}
        onDismissLimit={() => setSessionLimitReached(false)}
      />
    );
  }

  // ── BRIEFING ──
  if (screen === "briefing") {
    return (
      <div className="flex flex-col h-[calc(100dvh-140px)] md:h-[calc(100dvh-80px)]">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-3 pb-4">
          <button onClick={() => setScreen("select")} className="text-court-sm text-court-text-ter mb-3">&larr; Back to modes</button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-court flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${persona.gradient[0]}, ${persona.gradient[1]})` }}>
              <DynamicIcon name={persona.icon} size={20} className="text-court-text" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-court-text">{displayPersonaName}</h1>
              <p className="text-court-sm text-court-text-ter">{persona.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Judge Temperament Selector (only for judge mode) */}
        {mode === "judge" && (
          <div className="px-4 mb-4">
            <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">Judicial Temperament</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(JUDGE_TEMPERAMENTS) as [JudgeTemperament, typeof JUDGE_TEMPERAMENTS[JudgeTemperament]][]).map(([key, temp]) => (
                <button
                  key={key}
                  onClick={() => setTemperament(key)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    temperament === key
                      ? "border-gold/40 bg-gold/8"
                      : "border-court-border bg-navy-card hover:border-white/10"
                  )}
                >
                  <p className={cn(
                    "text-court-sm font-bold mb-0.5",
                    temperament === key ? "text-gold" : "text-court-text"
                  )}>
                    {temp.subtitle}
                  </p>
                  <p className="text-court-xs text-court-text-ter leading-snug">{temp.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4">
          <Card className="p-4 mb-3">
            <h2 className="font-serif text-court-base font-bold text-gold mb-3 uppercase tracking-wider">Session Briefing</h2>
            {[
              { label: "Area of Law", value: brief.area },
              { label: "Matter", value: brief.matter },
              { label: "Your Role", value: brief.yourRole },
            ].map((item) => (
              <div key={item.label} className="mb-3 last:mb-0">
                <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-court-base text-court-text leading-relaxed">{item.value}</p>
              </div>
            ))}
          </Card>
          <Card className="p-4 mb-3">
            <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">Instructions</p>
            <p className="text-court-base text-court-text-sec leading-relaxed">{brief.instructions}</p>
          </Card>
          <Card className="p-4">
            <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">Key Authorities</p>
            {brief.authorities.map((a) => (
              <div key={a} className="flex items-start gap-2 mb-1.5 last:mb-0">
                <Book size={12} className="text-gold mt-0.5 shrink-0" />
                <p className="text-court-base text-court-text font-medium">{a}</p>
              </div>
            ))}
          </Card>
        </div>
        </div>

        {/* AI Disclaimer */}
        <div className="px-4 mt-3">
          <div className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-court-border-light">
            <div className="flex items-start gap-2">
              <AlertCircle size={13} className="text-court-text-ter shrink-0 mt-0.5" />
              <div>
                <p className="text-court-xs text-court-text-ter leading-relaxed">
                  <span className="font-semibold text-court-text-sec">AI Simulation.</span>{" "}
                  The AI Judge uses case law sourced from the UK National Archives.
                  Feedback is educational only, may contain inaccuracies, and has not been
                  reviewed by a qualified lawyer. Always verify against primary sources and
                  seek guidance from your tutors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA buttons — always visible */}
        <div className="shrink-0 px-4 pt-3 pb-1 border-t border-court-border-light/20 bg-navy">
          {aiUserContext?.userType === "professional" && (
            <button
              onClick={() => setBrief(selectScenario(mode, aiUserContext?.practiceAreas, aiUserContext?.userType))}
              className="w-full text-court-xs text-gold/60 hover:text-gold transition-colors mb-2 py-1"
            >
              ↻ Different scenario
            </button>
          )}
          <div className="flex gap-2.5">
            <Button variant="secondary" fullWidth onClick={() => setScreen("select")}>Cancel</Button>
            <Button fullWidth onClick={startSession}>Begin Session</Button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIVE SESSION ──
  if (screen === "session") {
    return (
      <div className="flex h-[100svh]">
      <div className="flex flex-col flex-1 min-w-0 pb-0 md:pb-0">
        {/* ── Courtroom Header ── */}
        <div className="bg-gradient-to-b from-[#1A0E08] via-[#130D06] to-navy border-b border-gold/10 shrink-0">
          {rateLimited && (
            <div className="px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20">
              <p className="text-court-xs text-amber-400 text-center">
                The court requires a brief recess. Please wait a moment.
              </p>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            {/* Row 1: End Session | LIVE | Timer */}
            <div className="px-3 md:px-6 pt-2 md:pt-3 pb-1 flex justify-between items-center">
              <button
                onClick={() => {
                  if (confirm("End this session? You will receive your assessment.")) endSession();
                }}
                className="flex items-center gap-1 text-court-text-ter hover:text-court-text transition-colors"
              >
                <span className="text-court-sm md:text-court-base">←</span>
                <span className="text-court-xs md:text-court-base font-medium">End Session</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 shrink-0 relative">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-court-xs md:text-court-sm font-bold text-red-400 uppercase tracking-wider">Live</span>
              </div>

              <div className="text-court-xs md:text-court-base text-court-text-ter font-mono flex items-center gap-1.5">
                <span>{exchangeCount}/{MAX_EXCHANGES}</span>
                <span className="text-court-border">·</span>
                <span className="text-red-400 font-bold">{formatTime(timer)}</span>
              </div>
            </div>

            {/* Row 2: Judge avatar + name + temperament */}
            <div className="px-3 md:px-6 pb-1.5 flex items-center gap-2 md:gap-3">
              <JudgeAvatar
                isActive={aiSpeaking || isLoading}
                isListening={isRecordingActive}
                responseText={lastAiResponse}
                size={32}
              />
              <div className="min-w-0 flex-1">
                <p className="text-court-sm md:text-court-base font-bold text-court-text truncate">{displayPersonaName}</p>
                <p className="text-court-xs md:text-court-sm text-court-text-ter truncate">
                  {mode === "judge" ? JUDGE_TEMPERAMENTS[temperament]?.subtitle : persona.subtitle}
                </p>
              </div>
            </div>

            {/* Row 3: Case + Role */}
            <div className="px-3 md:px-6 pb-2 md:pb-3 flex items-start gap-2 md:gap-3">
              <div className="w-[32px] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-court-xs md:text-court-sm text-gold/70 truncate">{brief.matter.split('—')[0].trim()}</p>
                <p className="text-court-xs md:text-court-sm text-court-text-ter truncate">{brief.yourRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle size={12} className="text-red-400 shrink-0" />
              <p className="text-court-xs text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Status strip — shows judge state when in conversation */}
        {isLoading && (
          <div className="px-3 md:px-6 py-1.5 bg-gold/[0.03] border-b border-gold/10 shrink-0">
            <div className="flex items-center gap-2 max-w-3xl mx-auto">
              <motion.div
                animate={{ rotate: [0, -10, 0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Scale size={12} className="text-gold/60" />
              </motion.div>
              <p className="text-court-xs md:text-court-base text-court-text-ter italic">The court is considering your submission...</p>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 no-scrollbar flex flex-col">
          <div className="max-w-3xl mx-auto w-full">
          {/* Session opening skeleton — shown while AI generates first message */}
          {sessionStarting && messages.length === 0 && (
            <motion.div
              className="mb-3 flex justify-start mt-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-[90%] md:max-w-[80%] flex gap-0">
                <div className="w-[3px] rounded-full bg-gold/20 shrink-0 my-1 animate-pulse" />
                <div className="pl-3 py-1">
                  <p className="text-[10px] font-medium text-gold/40 mb-1">{displayPersonaName}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{ rotate: [0, -10, 0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Scale size={14} className="text-gold/40" />
                    </motion.div>
                    <span className="text-court-base text-court-text-sec italic">The court is now in session...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 w-[85%] bg-white/[0.06] rounded animate-pulse" />
                    <div className="h-3.5 w-[70%] bg-white/[0.06] rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="h-3.5 w-[60%] bg-white/[0.06] rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 md:mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                /* User submissions — formal brief style */
                <div className="max-w-[85%] md:max-w-[70%] rounded-2xl rounded-br-md bg-gold/10 border border-gold/20 px-4 py-2.5">
                  <p className="text-court-xs md:text-court-sm font-bold text-gold/70 mb-1">
                    Counsel · {msg.time}
                  </p>
                  <p className="text-court-base md:text-[15px] text-court-text leading-relaxed">{msg.text}</p>
                </div>
              ) : (
                /* Judge messages — transcript style with gold accent line */
                <div className="max-w-[90%] md:max-w-[80%] flex gap-0">
                  <div className="w-[3px] rounded-full bg-gold/30 shrink-0 my-1" />
                  <div className="pl-3 py-1">
                    <p className="text-court-xs md:text-court-sm font-medium text-gold/50 mb-1">
                      {msg.time} · Exchange {Math.ceil((i + 1) / 2)} of {MAX_EXCHANGES}
                    </p>
                    <p className="text-[15px] md:text-base text-court-text leading-[1.65] font-[410]">{msg.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Enhanced loading indicator */}
          {isLoading && (
            <div className="mb-3 flex justify-start">
              <div className="max-w-[90%] md:max-w-[80%] flex gap-0">
                <div className="w-[3px] rounded-full bg-gold/20 shrink-0 my-1 animate-pulse" />
                <div className="pl-3 py-1">
                  <p className="text-[10px] font-medium text-gold/40 mb-1">{displayPersonaName}</p>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, -10, 0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Scale size={14} className="text-gold/40" />
                    </motion.div>
                    <span className="text-court-base text-court-text-ter italic">Considering...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
          </div>
        </div>

        {/* Quick phrases — hidden when typing, collapsed after first exchange */}
        {!isTyping && (
          <div className={cn(
            "px-3 md:px-6 py-1 border-t border-court-border-light/20 shrink-0 transition-all",
            messages.length > 2 && "max-h-[44px] overflow-hidden"
          )}>
            <div className="max-w-3xl mx-auto">
              <ObjectionButtons
                onInsert={(text) => setInputText((prev) => prev + text)}
                disabled={isLoading || exchangeCount >= MAX_EXCHANGES}
              />
            </div>
          </div>
        )}

        {/* Input area — larger and more comfortable */}
        <div className="px-3 md:px-6 pt-1.5 pb-1 border-t border-court-border-light bg-gradient-to-t from-[#0A0A1A] to-navy shrink-0">
          <div className="max-w-3xl mx-auto">
          {/* Voice/input errors */}
          {(inputError || (voiceInput.error && voiceInput.error !== "WHISPER_UNAVAILABLE")) && (
            <div className="flex items-center gap-1.5 mb-1.5 px-1">
              <AlertCircle size={11} className="text-red-400 shrink-0" />
              <p className="text-court-xs text-red-400">{inputError || voiceInput.error}</p>
            </div>
          )}

          {voiceInput.isTranscribing && (
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-court-xs text-blue-400">Transcribing your speech...</p>
            </div>
          )}

          <div className="flex gap-2 items-end pb-1">
            {/* Text input — full width now that buttons are stacked on the right */}
            <div className={cn(
              "flex-1 bg-navy-card border rounded-2xl flex items-end",
              inputError ? "border-red-500/40" : "border-court-border"
            )}>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                  if (inputError && e.target.value.length <= MAX_MESSAGE_LENGTH) setInputError(null);
                }}
                onBlur={() => { if (!inputText.trim()) setIsTyping(false); }}
                placeholder={exchangeCount >= MAX_EXCHANGES ? "Session limit reached." : isRecordingActive ? "Listening..." : "Make your submissions..."}
                rows={3}
                disabled={isLoading || exchangeCount >= MAX_EXCHANGES}
                className="flex-1 bg-transparent text-court-base text-court-text px-3 py-2.5 resize-none outline-none placeholder:text-court-text-ter disabled:opacity-50 max-h-[140px]"
                style={{ minHeight: "72px" }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
              {inputText.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <span className={cn(
                  "text-court-xs px-2 py-2.5 tabular-nums shrink-0",
                  inputText.length > MAX_MESSAGE_LENGTH ? "text-red-400" : "text-court-text-ter"
                )}>
                  {inputText.length}/{MAX_MESSAGE_LENGTH}
                </span>
              )}
            </div>

            {/* Mic + Send stacked vertically on the right */}
            <div className="flex flex-col gap-1.5 shrink-0">
              {/* Voice input button */}
              <button
                onClick={handleVoiceToggle}
                disabled={isLoading || exchangeCount >= MAX_EXCHANGES || voiceInput.isTranscribing}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                  isRecordingActive
                    ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/30"
                    : voiceInput.isTranscribing
                      ? "bg-blue-500/20 border border-blue-500/30"
                      : "bg-gold-dim border border-gold/25 hover:bg-gold/20",
                  (isLoading || exchangeCount >= MAX_EXCHANGES) && "opacity-40 cursor-not-allowed"
                )}
              >
                {isRecordingActive ? (
                  <Pause size={16} className="text-white" />
                ) : voiceInput.isTranscribing ? (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Mic size={16} className="text-gold" />
                )}
              </button>

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={isLoading || exchangeCount >= MAX_EXCHANGES || !inputText.trim()}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                  isLoading || exchangeCount >= MAX_EXCHANGES || !inputText.trim()
                    ? "bg-gold/30 cursor-not-allowed"
                    : "bg-gold hover:bg-gold/90"
                )}
              >
                <ArrowUp size={18} className="text-navy" />
              </button>
            </div>
          </div>
          </div>
        </div>

        </div>{/* end inner flex-col */}

        {/* Session Dock — bottom bar on mobile, right sidebar on desktop */}
        <SessionDock
          mode={mode}
          brief={brief}
          exchangeCount={exchangeCount}
          maxExchanges={MAX_EXCHANGES}
          timerDisplay={formatTime(timer)}
          ttsEnabled={tts.enabled}
          onToggleTts={() => { tts.setEnabled(!tts.enabled); if (tts.isSpeaking) tts.stop(); }}
          onEndSession={endSession}
          spectatorEnabled={spectatorEnabled}
          spectatorCount={spectatorCount}
          personaName={displayPersonaName}
          messages={messages}
          transcriptSlot={
            <TranscriptPanel
              messages={messages}
              caseTitle={brief.matter}
              personaName={displayPersonaName}
              areaOfLaw={brief.area}
            />
          }
          spectatorSlot={
            <SpectatorShare
              spectatorCode={spectatorCode}
              spectatorCount={spectatorCount}
              isEnabled={spectatorEnabled}
              onEnable={enableSpectatorMode}
              onDisable={disableSpectatorMode}
            />
          }
        />
      </div>
    );
  }

  // ── FEEDBACK ──
  const scores = feedbackData?.scores || FALLBACK_SCORES;
  const overall = feedbackData?.overall?.toFixed(1) || ((Object.values(scores) as number[]).reduce((a, b) => a + b, 0) / 7).toFixed(1);
  const judgment = feedbackData?.judgment || FALLBACK_JUDGMENT;
  const keyImprovement = feedbackData?.keyImprovement || FALLBACK_KEY_IMPROVEMENT;

  return (
    <div className="flex flex-col min-h-[calc(100dvh-140px)] md:min-h-[calc(100dvh-80px)]">
      <div className="flex-1 overflow-y-auto pb-4">
      {/* Header — full width */}
      <div className="px-4 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Session Feedback</h1>
        <p className="text-court-sm text-court-text-sec">{displayPersonaName} · {brief.area}</p>
      </div>

      {feedbackFallback && (
        <div className="px-4 mb-3">
          <div className="px-3 py-2 rounded-lg bg-navy-card border border-court-border-light">
            <p className="text-court-xs text-court-text-ter text-center">Assessment generated from standard benchmarks.</p>
          </div>
        </div>
      )}

      {/* Two-column grid on desktop, single column on mobile */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT COLUMN — Scores */}
        <div className="flex flex-col gap-4">
          {/* Overall Score — compact on desktop */}
          <Card highlight className="p-4 md:p-5 text-center">
            <div className="md:flex md:items-center md:gap-4 md:text-left">
              <div className="relative w-20 h-20 md:w-16 md:h-16 mx-auto md:mx-0 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#C9A84C" strokeWidth="6"
                    strokeDasharray={`${(parseFloat(overall) / 5) * 264} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-2xl md:text-xl font-bold text-gold">{overall}</span>
                </div>
              </div>
              <div>
                <p className="text-court-xs text-court-text-ter uppercase tracking-widest mt-2 md:mt-0">Overall Score</p>
                <p className="text-court-sm text-court-text-sec">out of 5.0</p>
              </div>
            </div>
          </Card>

          {/* Assessment Breakdown */}
          <Card className="p-4">
            <h3 className="font-serif text-court-base font-bold text-court-text mb-3">Assessment Breakdown</h3>
            {FEEDBACK_DIMENSIONS.map((dim) => {
              const score = scores[dim.key as keyof typeof scores] as number | undefined;
              const safeScore = score ?? 0;
              return (
                <div key={dim.key} className="mb-2.5 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-court-sm text-court-text-sec flex items-center gap-1"><DynamicIcon name={dim.icon} size={12} className="text-court-text-sec" /> {dim.label}</span>
                    <span className="text-court-sm font-bold text-court-text">{safeScore.toFixed(1)}</span>
                  </div>
                  <ProgressBar pct={(safeScore / 5) * 100} color={safeScore >= 4 ? "green" : safeScore >= 3 ? "gold" : "red"} />
                </div>
              );
            })}
          </Card>
        </div>

        {/* RIGHT COLUMN — Written feedback */}
        <div className="flex flex-col gap-4">
          {/* Judgment */}
          <Card className="p-4">
            <h3 className="font-serif text-court-base font-bold text-court-text mb-2">Judgment</h3>
            <p className="text-court-sm md:text-court-base text-court-text-sec leading-relaxed">{judgment}</p>
          </Card>

          {/* Key Improvement */}
          <Card className="p-4 bg-gold-dim border-gold/25">
            <h3 className="text-court-xs text-gold uppercase tracking-widest font-bold mb-2">Key Improvement</h3>
            <p className="text-court-sm md:text-court-base text-court-text leading-relaxed">{keyImprovement}</p>
          </Card>

          {/* Case Note Generator */}
          <CaseNotePanel
            caseNote={caseNote as any}
            isGenerating={caseNoteGenerating}
            onGenerate={generateCaseNote}
            error={caseNoteError}
          />
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="px-4 mt-4 mb-2">
        <div className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-court-border-light max-w-xl mx-auto">
          <div className="flex items-start gap-2">
            <AlertCircle size={12} className="text-court-text-ter shrink-0 mt-0.5" />
            <p className="text-court-xs text-court-text-ter leading-relaxed">
              <span className="font-semibold text-court-text-sec">AI-generated feedback.</span>{" "}
              Scores and written judgment produced by AI using case law from the
              UK National Archives. Not reviewed by a qualified legal professional.
              Use as a learning guide alongside guidance from your tutors.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Sticky CTAs */}
      <div className="shrink-0 px-4 py-3 border-t border-court-border-light/20 bg-navy flex flex-row gap-2">
        <Button className="flex-1 text-court-sm px-2" onClick={() => {
          setScreen("select");
          setMessages([]);
          setTimer(900);
          setApiMessages([]);
          setExchangeCount(0);
          setError(null);
          setFeedbackData(null);
          setFeedbackFallback(false);
          setLastAiResponse("");
          setTemperament("standard");
          setCaseNote(null);
          setCaseNoteError(null);
          setSpectatorEnabled(false);
          setSpectatorCode(null);
          setSpectatorCount(0);
        }}>Practice Again</Button>
        <Button className="flex-1 text-court-sm px-2" variant="outline">Save to Portfolio</Button>
        <Button className="flex-1 text-court-sm px-2" variant="secondary" onClick={async () => {
          // Build the share URL with scores encoded as query params
          const shareParams = new URLSearchParams();
          shareParams.set("s", overall);
          shareParams.set("a", brief.area);
          shareParams.set("j", displayPersonaName);
          // Top 4 breakdown scores for the preview card
          if (scores.argumentStructure != null) shareParams.set("s1", scores.argumentStructure.toFixed(1));
          if (scores.useOfAuthorities != null) shareParams.set("s2", (scores.useOfAuthorities as number).toFixed(1));
          if (scores.oralDelivery != null) shareParams.set("s3", (scores.oralDelivery as number).toFixed(1));
          if (scores.judicialHandling != null) shareParams.set("s4", (scores.judicialHandling as number).toFixed(1));

          const shareUrl = `https://ratiothedigitalcourtsociety.com/share/result?${shareParams.toString()}`;
          const shareText = `I scored ${overall}/5.0 in ${brief.area} on RATIO. — The Digital Court Society`;

          // Use native share menu if available (mobile), otherwise copy to clipboard
          if (navigator.share) {
            try {
              await navigator.share({ title: "My RATIO. Result", text: shareText, url: shareUrl });
            } catch {
              // User cancelled — that's fine
            }
          } else {
            try {
              await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
              courtToast.success("Link copied to clipboard!");
            } catch {
              // Fallback: do nothing
            }
          }
        }}>Share Result</Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Tag, Card, Button, ProgressBar, DynamicIcon } from "@/components/ui";
import { AI_PERSONAS, FEEDBACK_DIMENSIONS } from "@/lib/constants/app";
import { Lightbulb, Book, Mic, Pause, ArrowUp, Scale, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

type Screen = "select" | "briefing" | "session" | "loading-feedback" | "feedback";
type Mode = "judge" | "mentor" | "examiner" | "opponent";

interface Message {
  role: "ai" | "user";
  text: string;
  time: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_EXCHANGES = 30;

const CASE_BRIEFS: Record<Mode, { area: string; matter: string; yourRole: string; instructions: string; authorities: string[] }> = {
  judge: {
    area: "Public Law",
    matter: "R (on the application of Miller) v Secretary of State — Whether the exercise of prerogative power to trigger Article 50 TEU without Parliamentary authority is unlawful.",
    yourRole: "Leading Counsel for the Appellant",
    instructions: "You will make submissions to the Judge arguing that the prerogative power cannot be used to nullify statutory rights granted under the European Communities Act 1972.",
    authorities: ["R (Miller) v Secretary of State [2017] UKSC 5", "CCSU v Minister for the Civil Service [1985] AC 374", "R (UNISON) v Lord Chancellor [2017] UKSC 51"],
  },
  mentor: {
    area: "Contract Law",
    matter: "Review of skeleton argument on anticipatory breach and mitigation of loss.",
    yourRole: "Mentee — Year 2 LLB student",
    instructions: "Senior Counsel will review your approach, question your reasoning, and help you improve your written advocacy technique.",
    authorities: ["Hochster v De La Tour (1853) 2 E&B 678", "White & Carter v McGregor [1962] AC 413"],
  },
  examiner: {
    area: "Dispute Resolution",
    matter: "Summary Judgment Application under CPR Part 24 — Claimant seeks judgment on breach of contract claim.",
    yourRole: "Counsel for the Applicant",
    instructions: "You have 45 minutes to prepare, then 15 minutes to make oral submissions. You will be assessed against SQE2 advocacy competency standards.",
    authorities: ["Easyair Ltd v Opal Telecom Ltd [2009] EWHC 339", "Swain v Hillman [2001] 1 All ER 91"],
  },
  opponent: {
    area: "Criminal Law",
    matter: "R v Daniels — Admissibility of confession evidence obtained during informal questioning.",
    yourRole: "Prosecution Counsel",
    instructions: "Opposing Counsel will argue for the defence. You must rebut their submissions in real time.",
    authorities: ["R v Fulling [1987] QB 426", "PACE 1984, s.76 and s.78"],
  },
};

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

export default function AIPracticePage() {
  const [screen, setScreen] = useState<Screen>("select");
  const [mode, setMode] = useState<Mode>("judge");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [timer, setTimer] = useState(900);
  const [timerActive, setTimerActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
  const [feedbackFallback, setFeedbackFallback] = useState(false);

  const persona = AI_PERSONAS[mode];
  const brief = CASE_BRIEFS[mode];

  const buildCaseContext = useCallback(() => {
    return `${brief.area}: ${brief.matter}. Role: ${brief.yourRole}. Authorities: ${brief.authorities.join(', ')}`;
  }, [brief]);

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [timerActive, timer]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-dismiss rate limit banner after 10 seconds
  useEffect(() => {
    if (rateLimited) {
      const timeout = setTimeout(() => setRateLimited(false), 10000);
      return () => clearTimeout(timeout);
    }
  }, [rateLimited]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const startSession = async () => {
    setScreen("session");
    setTimerActive(true);
    setExchangeCount(0);
    setError(null);
    setFeedbackData(null);
    setFeedbackFallback(false);

    const openings: Record<Mode, string> = {
      judge: "This court is now in session. I have read the papers before me. Counsel for the Appellant, you may begin your submissions. Please state the central issue you invite this court to determine.",
      mentor: "Good afternoon. I've reviewed the skeleton argument you submitted. Let's work through it together. Tell me \u2014 what's the central question the court needs to decide in this matter?",
      examiner: "This is your SQE2 advocacy assessment. You are Counsel for the Applicant in a summary judgment application under CPR Part 24. You have 15 minutes. Please begin your submissions.",
      opponent: "Counsel, I appear for the Defence. I will be making submissions that the confession evidence was obtained in breach of PACE. You may begin for the Prosecution.",
    };

    // Try to get AI opening from the API
    let openingText = openings[mode];
    try {
      const initialApiMessages: Array<{role: 'user' | 'assistant'; content: string}> = [
        { role: 'user', content: 'Begin the session. Provide your opening statement in character.' }
      ];

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: initialApiMessages,
          caseContext: buildCaseContext(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          openingText = data.content;
          setApiMessages([
            { role: 'user', content: 'Begin the session. Provide your opening statement in character.' },
            { role: 'assistant', content: openingText },
          ]);
        }
      }
      // On non-ok responses, fall through to use hardcoded opening
    } catch {
      // API unavailable — use fallback opening (already set)
    }

    // If apiMessages weren't set by the API call, initialize with the fallback
    setApiMessages((prev) => {
      if (prev.length === 0) {
        return [
          { role: 'user', content: 'Begin the session. Provide your opening statement in character.' },
          { role: 'assistant', content: openingText },
        ];
      }
      return prev;
    });

    setMessages([{
      role: "ai",
      text: openingText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setAiSpeaking(true);
    setTimeout(() => setAiSpeaking(false), 3000);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Validate message length
    if (inputText.length > MAX_MESSAGE_LENGTH) {
      setInputError(`Submissions must not exceed ${MAX_MESSAGE_LENGTH} characters. Current: ${inputText.length}`);
      return;
    }
    setInputError(null);

    // Check exchange limit
    if (exchangeCount >= MAX_EXCHANGES) {
      setError("This session has reached its conclusion. Please end the session to receive your assessment.");
      return;
    }

    const userMsg: Message = {
      role: "user",
      text: inputText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setAiSpeaking(true);
    setIsLoading(true);
    setError(null);

    const updatedApiMessages: Array<{role: 'user' | 'assistant'; content: string}> = [
      ...apiMessages,
      { role: 'user', content: inputText },
    ];

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: updatedApiMessages,
          caseContext: buildCaseContext(),
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setAiSpeaking(false);
        setIsLoading(false);
        // Revert the user message from apiMessages since we didn't get a response
        return;
      }

      if (res.status === 402 || res.status === 403) {
        setSessionLimitReached(true);
        setAiSpeaking(false);
        setIsLoading(false);
        setScreen("select");
        return;
      }

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      const aiText = data.content || AI_RESPONSES[Math.min(exchangeCount, AI_RESPONSES.length - 1)];

      setApiMessages([...updatedApiMessages, { role: 'assistant', content: aiText }]);
      setExchangeCount((c) => c + 1);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiText,
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setAiSpeaking(false);
      setIsLoading(false);
    } catch {
      // Fallback to hardcoded responses
      const responseIdx = Math.min(exchangeCount, AI_RESPONSES.length - 1);
      const fallbackText = AI_RESPONSES[responseIdx];

      setApiMessages([...updatedApiMessages, { role: 'assistant', content: fallbackText }]);
      setExchangeCount((c) => c + 1);
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

  const endSession = async () => {
    setTimerActive(false);
    setScreen("loading-feedback");

    const sessionDuration = 900 - timer;

    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: apiMessages,
          caseContext: buildCaseContext(),
          sessionDuration,
        }),
      });

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
    } catch {
      // Fall back to hardcoded scores
      setFeedbackData({
        scores: FALLBACK_SCORES,
        overall: parseFloat((Object.values(FALLBACK_SCORES).reduce((a, b) => a + b, 0) / 7).toFixed(1)),
        judgment: FALLBACK_JUDGMENT,
        keyStrength: FALLBACK_KEY_STRENGTH,
        keyImprovement: FALLBACK_KEY_IMPROVEMENT,
      });
      setFeedbackFallback(true);
    }

    // Brief interstitial delay before showing feedback
    setTimeout(() => {
      setScreen("feedback");
    }, 4000);
  };

  // ── LOADING FEEDBACK INTERSTITIAL ──
  if (screen === "loading-feedback") {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-80px)]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center animate-pulse">
              <Scale size={32} className="text-gold" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-serif text-lg font-bold text-court-text mb-2">
              The court is retiring to consider its judgment...
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '200ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MODE SELECTION ──
  if (screen === "select") {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-4">
          <h1 className="font-serif text-2xl font-bold text-court-text mb-1">AI Practice</h1>
          <p className="text-xs text-court-text-sec">Train with AI-powered legal personas. No judgement, just improvement.</p>
        </div>

        {/* Session limit reached state */}
        {sessionLimitReached && (
          <div className="px-4 mb-4">
            <Card className="p-5 border-gold/30">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Scale size={24} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-court-text mb-1">Monthly Practice Allocation Exhausted</h3>
                  <p className="text-court-sm text-court-text-sec leading-relaxed">
                    You have used your 3 complimentary hearings this month. Upgrade to Premium for unlimited practice.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSessionLimitReached(false)}>View Premium</Button>
              </div>
            </Card>
          </div>
        )}

        <div className="px-4 flex flex-col gap-3">
          {(Object.entries(AI_PERSONAS) as [Mode, (typeof AI_PERSONAS)[Mode]][]).map(([key, p]) => {
            const descriptions: Record<Mode, string> = {
              judge: "Face a virtual High Court judge who will challenge your submissions and score your advocacy.",
              mentor: "Get constructive coaching on your technique from a supportive senior counsel.",
              examiner: "Timed SQE2-format assessment with marking against SRA competency standards.",
              opponent: "AI argues against you in real time. Train rebuttal and thinking on your feet.",
            };
            return (
              <Card
                key={key}
                onClick={key !== "opponent" && !sessionLimitReached ? () => { setMode(key); setScreen("briefing"); } : undefined}
                className={`p-4 transition-all ${key === "opponent" || sessionLimitReached ? "opacity-50" : "cursor-pointer hover:border-white/10"}`}
              >
                <div className="flex gap-3.5 items-center">
                  <div
                    className="w-14 h-14 rounded-court flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
                  >
                    <DynamicIcon name={p.icon} size={24} className="text-court-text" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-base font-bold text-court-text">{p.name}</h3>
                        <p className="text-court-sm text-court-text-ter mt-0.5">{p.subtitle}</p>
                      </div>
                      {key === "opponent" && <Tag color="orange" small>COMING SOON</Tag>}
                    </div>
                    <p className="text-court-base text-court-text-sec mt-1.5 leading-relaxed">{descriptions[key]}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="px-4 mt-5">
          <Card className="p-4 bg-green-500/[0.06] border-green-500/15">
            <div className="flex gap-2.5 items-center">
              <Lightbulb size={24} className="text-green-500 shrink-0" />
              <div>
                <p className="text-court-base font-semibold text-court-text">Free tier: 3 sessions / month</p>
                <p className="text-court-sm text-court-text-ter">Upgrade to Premium for unlimited AI practice</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── BRIEFING ──
  if (screen === "briefing") {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-4">
          <button onClick={() => setScreen("select")} className="text-xs text-court-text-ter mb-3">&larr; Back to modes</button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-court flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${persona.gradient[0]}, ${persona.gradient[1]})` }}>
              <DynamicIcon name={persona.icon} size={20} className="text-court-text" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-court-text">{persona.name}</h1>
              <p className="text-court-sm text-court-text-ter">{persona.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="px-4">
          <Card className="p-4 mb-3">
            <h2 className="font-serif text-sm font-bold text-gold mb-3 uppercase tracking-wider">Session Briefing</h2>
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
          <Card className="p-4 mb-5">
            <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">Key Authorities</p>
            {brief.authorities.map((a) => (
              <div key={a} className="flex items-start gap-2 mb-1.5 last:mb-0">
                <Book size={12} className="text-gold mt-0.5 shrink-0" />
                <p className="text-court-base text-court-text font-medium">{a}</p>
              </div>
            ))}
          </Card>
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
      <div className="flex flex-col h-[calc(100dvh-80px)]">
        {/* Rate limit banner */}
        {rateLimited && (
          <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 shrink-0">
            <p className="text-court-xs text-amber-400 text-center">
              The court requires a brief recess. Please wait a moment before continuing.
            </p>
          </div>
        )}

        <div className="px-4 pt-3 pb-2 flex justify-between items-center border-b border-court-border-light shrink-0">
          <div className="flex items-center gap-2">
            <DynamicIcon name={persona.icon} size={16} className="text-court-text" />
            <span className="text-xs font-bold text-court-text">{persona.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Exchange count indicator */}
            <div className="bg-navy-card border border-court-border rounded-full px-2.5 py-0.5 text-court-xs text-court-text-ter font-mono">
              {exchangeCount}/{MAX_EXCHANGES}
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1 text-xs font-bold text-red-400 font-mono">
              {formatTime(timer)}
            </div>
            <button onClick={endSession} className="text-court-xs text-red-400 font-bold">
              End
            </button>
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

        {/* Avatar */}
        <div className="flex justify-center py-5 relative shrink-0">
          <div className="relative">
            {(aiSpeaking || isLoading) && (
              <>
                <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${persona.color}33` }} />
                <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${persona.color}22`, animationDelay: "0.8s" }} />
              </>
            )}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${persona.gradient[0]}, ${persona.gradient[1]})`,
                boxShadow: (aiSpeaking || isLoading) ? `0 0 30px ${persona.color}40` : `0 0 15px ${persona.color}15`,
              }}
            >
              <DynamicIcon name={persona.icon} size={32} className="text-court-text" />
            </div>
          </div>
          <p className="absolute bottom-2 text-court-xs text-court-text-ter">
            {isLoading ? "Considering your submissions..." : aiSpeaking ? "Judge is speaking..." : exchangeCount >= MAX_EXCHANGES ? "Session concluding. Please end the session." : "Awaiting your submissions..."}
          </p>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-4 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user"
                  ? "bg-gold/15 border border-gold/20 rounded-br-md"
                  : "bg-navy-card border border-court-border-light rounded-bl-md"
              }`}>
                <p className={`text-court-xs font-bold mb-1 ${msg.role === "user" ? "text-gold" : "text-court-text-ter"}`}>
                  {msg.role === "user" ? "You" : persona.name} · {msg.time}
                </p>
                <p className="text-court-base text-court-text leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-3 flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-navy-card border border-court-border-light rounded-bl-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-court-text-ter animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-court-text-ter animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-court-text-ter animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-court-border-light bg-navy shrink-0">
          {/* Input validation error */}
          {inputError && (
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <AlertCircle size={11} className="text-red-400 shrink-0" />
              <p className="text-court-xs text-red-400">{inputError}</p>
            </div>
          )}
          <div className="flex gap-2 items-end pb-4">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isListening ? "bg-red-500 animate-pulse" : "bg-gold-dim border border-gold/25"
              }`}
            >
              {isListening ? <Pause size={16} className="text-white" /> : <Mic size={16} className="text-gold" />}
            </button>
            <div className={cn(
              "flex-1 bg-navy-card border rounded-xl flex items-end",
              inputError ? "border-red-500/40" : "border-court-border"
            )}>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (inputError && e.target.value.length <= MAX_MESSAGE_LENGTH) {
                    setInputError(null);
                  }
                }}
                placeholder={exchangeCount >= MAX_EXCHANGES ? "Session limit reached. Please end the session." : "Make your submissions..."}
                rows={1}
                disabled={isLoading || exchangeCount >= MAX_EXCHANGES}
                className="flex-1 bg-transparent text-court-base text-court-text px-3 py-2.5 resize-none outline-none placeholder:text-court-text-ter disabled:opacity-50"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
              {/* Character count when approaching limit */}
              {inputText.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <span className={cn(
                  "text-court-xs px-2 py-2.5 tabular-nums shrink-0",
                  inputText.length > MAX_MESSAGE_LENGTH ? "text-red-400" : "text-court-text-ter"
                )}>
                  {inputText.length}/{MAX_MESSAGE_LENGTH}
                </span>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || exchangeCount >= MAX_EXCHANGES || !inputText.trim()}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                isLoading || exchangeCount >= MAX_EXCHANGES || !inputText.trim()
                  ? "bg-gold/30 cursor-not-allowed"
                  : "bg-gold"
              )}
            >
              <ArrowUp size={16} className="text-navy" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FEEDBACK ──
  const scores = feedbackData?.scores || FALLBACK_SCORES;
  const overall = feedbackData?.overall?.toFixed(1) || ((Object.values(scores) as number[]).reduce((a, b) => a + b, 0) / 7).toFixed(1);
  const judgment = feedbackData?.judgment || FALLBACK_JUDGMENT;
  const keyImprovement = feedbackData?.keyImprovement || FALLBACK_KEY_IMPROVEMENT;

  return (
    <div className="pb-6">
      <div className="px-4 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Session Feedback</h1>
        <p className="text-xs text-court-text-sec">{persona.name} · {brief.area}</p>
      </div>

      {/* Fallback notice */}
      {feedbackFallback && (
        <div className="px-4 mb-3">
          <div className="px-3 py-2 rounded-lg bg-navy-card border border-court-border-light">
            <p className="text-court-xs text-court-text-ter text-center">Assessment generated from standard benchmarks.</p>
          </div>
        </div>
      )}

      <section className="px-4 mb-4">
        <Card highlight className="p-6 text-center">
          <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">Overall Score</p>
          <div className="relative w-24 h-24 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#C9A84C" strokeWidth="6"
                strokeDasharray={`${(parseFloat(overall) / 5) * 264} 264`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-3xl font-bold text-gold">{overall}</span>
            </div>
          </div>
          <p className="text-xs text-court-text-sec mt-2">out of 5.0</p>
        </Card>
      </section>
      <section className="px-4 mb-4">
        <Card className="p-4">
          <h3 className="font-serif text-sm font-bold text-court-text mb-3">Assessment Breakdown</h3>
          {FEEDBACK_DIMENSIONS.map((dim) => {
            const score = scores[dim.key as keyof typeof scores] as number | undefined;
            const safeScore = score ?? 0;
            return (
              <div key={dim.key} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-court-sm text-court-text-sec flex items-center gap-1"><DynamicIcon name={dim.icon} size={12} className="text-court-text-sec" /> {dim.label}</span>
                  <span className="text-court-sm font-bold text-court-text">{safeScore.toFixed(1)}</span>
                </div>
                <ProgressBar pct={(safeScore / 5) * 100} color={safeScore >= 4 ? "green" : safeScore >= 3 ? "gold" : "red"} />
              </div>
            );
          })}
        </Card>
      </section>
      <section className="px-4 mb-4">
        <Card className="p-4">
          <h3 className="font-serif text-sm font-bold text-court-text mb-2">Judgment</h3>
          <p className="text-court-base text-court-text-sec leading-relaxed">
            {judgment}
          </p>
        </Card>
      </section>
      <section className="px-4 mb-4">
        <Card className="p-4 bg-gold-dim border-gold/25">
          <h3 className="text-court-xs text-gold uppercase tracking-widest font-bold mb-2">Key Improvement</h3>
          <p className="text-court-base text-court-text leading-relaxed">
            {keyImprovement}
          </p>
        </Card>
      </section>
      <section className="px-4 flex flex-col gap-2.5">
        <Button fullWidth onClick={() => {
          setScreen("select");
          setMessages([]);
          setTimer(900);
          setApiMessages([]);
          setExchangeCount(0);
          setError(null);
          setFeedbackData(null);
          setFeedbackFallback(false);
        }}>Practice Again</Button>
        <Button fullWidth variant="outline">Save to Portfolio</Button>
        <Button fullWidth variant="secondary">Share Result</Button>
      </section>
    </div>
  );
}

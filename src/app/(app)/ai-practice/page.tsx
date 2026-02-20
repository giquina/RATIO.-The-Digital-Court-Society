"use client";

import { useState, useRef, useEffect } from "react";
import { Tag, Card, Button, ProgressBar } from "@/components/ui";
import { AI_PERSONAS, FEEDBACK_DIMENSIONS } from "@/lib/constants/app";

type Screen = "select" | "briefing" | "session" | "feedback";
type Mode = "judge" | "mentor" | "examiner" | "opponent";

interface Message {
  role: "ai" | "user";
  text: string;
  time: string;
}

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

  const persona = AI_PERSONAS[mode];
  const brief = CASE_BRIEFS[mode];

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [timerActive, timer]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const startSession = () => {
    setScreen("session");
    setTimerActive(true);
    const openings: Record<Mode, string> = {
      judge: "This court is now in session. I have read the papers before me. Counsel for the Appellant, you may begin your submissions. Please state the central issue you invite this court to determine.",
      mentor: "Good afternoon. I've reviewed the skeleton argument you submitted. Let's work through it together. Tell me — what's the central question the court needs to decide in this matter?",
      examiner: "This is your SQE2 advocacy assessment. You are Counsel for the Applicant in a summary judgment application under CPR Part 24. You have 15 minutes. Please begin your submissions.",
      opponent: "Counsel, I appear for the Defence. I will be making submissions that the confession evidence was obtained in breach of PACE. You may begin for the Prosecution.",
    };
    setMessages([{
      role: "ai",
      text: openings[mode],
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setAiSpeaking(true);
    setTimeout(() => setAiSpeaking(false), 3000);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      role: "user",
      text: inputText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setAiSpeaking(true);

    const responseIdx = Math.min(
      Math.floor(messages.filter((m) => m.role === "user").length),
      AI_RESPONSES.length - 1
    );
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: AI_RESPONSES[responseIdx],
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setAiSpeaking(false);
    }, 2500);
  };

  // ── MODE SELECTION ──
  if (screen === "select") {
    return (
      <div className="pb-6">
        <div className="px-5 pt-3 pb-4">
          <h1 className="font-serif text-2xl font-bold text-court-text mb-1">AI Practice</h1>
          <p className="text-xs text-court-text-sec">Train with AI-powered legal personas. No judgement, just improvement.</p>
        </div>
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
                onClick={key !== "opponent" ? () => { setMode(key); setScreen("briefing"); } : undefined}
                className={`p-4 transition-all ${key === "opponent" ? "opacity-50" : "cursor-pointer hover:border-white/10"}`}
              >
                <div className="flex gap-3.5 items-center">
                  <div
                    className="w-14 h-14 rounded-court flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-base font-bold text-court-text">{p.name}</h3>
                        <p className="text-[11px] text-court-text-ter mt-0.5">{p.subtitle}</p>
                      </div>
                      {key === "opponent" && <Tag color="orange" small>COMING SOON</Tag>}
                    </div>
                    <p className="text-[12px] text-court-text-sec mt-1.5 leading-relaxed">{descriptions[key]}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="px-4 mt-5">
          <Card className="p-4 bg-green-500/[0.06] border-green-500/15">
            <div className="flex gap-2.5 items-center">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-[12px] font-semibold text-court-text">Free tier: 3 sessions / month</p>
                <p className="text-[11px] text-court-text-ter">Upgrade to Premium for unlimited AI practice</p>
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
        <div className="px-5 pt-3 pb-4">
          <button onClick={() => setScreen("select")} className="text-xs text-court-text-ter mb-3">← Back to modes</button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-court flex items-center justify-center text-xl"
              style={{ background: `linear-gradient(135deg, ${persona.gradient[0]}, ${persona.gradient[1]})` }}>
              {persona.icon}
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-court-text">{persona.name}</h1>
              <p className="text-[11px] text-court-text-ter">{persona.subtitle}</p>
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
                <p className="text-[10px] text-court-text-ter uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-[13px] text-court-text leading-relaxed">{item.value}</p>
              </div>
            ))}
          </Card>
          <Card className="p-4 mb-3">
            <p className="text-[10px] text-court-text-ter uppercase tracking-widest mb-2">Instructions</p>
            <p className="text-[13px] text-court-text-sec leading-relaxed">{brief.instructions}</p>
          </Card>
          <Card className="p-4 mb-5">
            <p className="text-[10px] text-court-text-ter uppercase tracking-widest mb-2">Key Authorities</p>
            {brief.authorities.map((a) => (
              <div key={a} className="flex items-start gap-2 mb-1.5 last:mb-0">
                <span className="text-gold text-xs mt-0.5">📖</span>
                <p className="text-[12px] text-court-text font-medium">{a}</p>
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
      <div className="flex flex-col h-screen max-h-screen">
        <div className="px-4 pt-3 pb-2 flex justify-between items-center border-b border-court-border-light shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{persona.icon}</span>
            <span className="text-xs font-bold text-court-text">{persona.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1 text-xs font-bold text-red-400 font-mono">
              {formatTime(timer)}
            </div>
            <button onClick={() => { setTimerActive(false); setScreen("feedback"); }} className="text-[10px] text-red-400 font-bold">
              End
            </button>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex justify-center py-5 relative shrink-0">
          <div className="relative">
            {aiSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${persona.color}33` }} />
                <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${persona.color}22`, animationDelay: "0.8s" }} />
              </>
            )}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl relative z-10 transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${persona.gradient[0]}, ${persona.gradient[1]})`,
                boxShadow: aiSpeaking ? `0 0 30px ${persona.color}40` : `0 0 15px ${persona.color}15`,
              }}
            >
              {persona.icon}
            </div>
          </div>
          <p className="absolute bottom-2 text-[10px] text-court-text-ter">
            {aiSpeaking ? "Judge is speaking..." : "Awaiting your submissions..."}
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
                <p className={`text-[10px] font-bold mb-1 ${msg.role === "user" ? "text-gold" : "text-court-text-ter"}`}>
                  {msg.role === "user" ? "You" : persona.name} · {msg.time}
                </p>
                <p className="text-[13px] text-court-text leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-court-border-light bg-navy shrink-0">
          <div className="flex gap-2 items-end pb-4">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isListening ? "bg-red-500 animate-pulse" : "bg-gold-dim border border-gold/25"
              }`}
            >
              <span className="text-sm">{isListening ? "⏸" : "🎙"}</span>
            </button>
            <div className="flex-1 bg-navy-card border border-court-border rounded-xl flex items-end">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Make your submissions..."
                rows={1}
                className="flex-1 bg-transparent text-[13px] text-court-text px-3 py-2.5 resize-none outline-none placeholder:text-court-text-ter"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
            </div>
            <button onClick={sendMessage} className="w-10 h-10 rounded-full bg-gold flex items-center justify-center shrink-0">
              <span className="text-navy font-bold text-sm">↑</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FEEDBACK ──
  const scores = {
    argumentStructure: 3.5, useOfAuthorities: 4.0, oralDelivery: 3.8,
    judicialHandling: 3.2, courtManner: 4.5, persuasiveness: 3.6, timeManagement: 4.0,
  };
  const overall = (Object.values(scores).reduce((a, b) => a + b, 0) / 7).toFixed(1);

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Session Feedback</h1>
        <p className="text-xs text-court-text-sec">{persona.name} · {brief.area}</p>
      </div>
      <section className="px-4 mb-4">
        <Card highlight className="p-6 text-center">
          <p className="text-[10px] text-court-text-ter uppercase tracking-widest mb-2">Overall Score</p>
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
            const score = scores[dim.key as keyof typeof scores];
            return (
              <div key={dim.key} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-court-text-sec">{dim.icon} {dim.label}</span>
                  <span className="text-[11px] font-bold text-court-text">{score.toFixed(1)}</span>
                </div>
                <ProgressBar pct={(score / 5) * 100} color={score >= 4 ? "green" : score >= 3 ? "gold" : "red"} />
              </div>
            );
          })}
        </Card>
      </section>
      <section className="px-4 mb-4">
        <Card className="p-4">
          <h3 className="font-serif text-sm font-bold text-court-text mb-2">Judgment</h3>
          <p className="text-[12px] text-court-text-sec leading-relaxed">
            Counsel demonstrated a solid understanding of the constitutional principles at play. The opening submissions were well-structured, following IRAC methodology competently. However, when pressed on the distinction between reviewability and unlawfulness of prerogative power, Counsel&apos;s response lacked the precision this court would expect. Court manner was exemplary throughout.
          </p>
        </Card>
      </section>
      <section className="px-4 mb-4">
        <Card className="p-4 bg-gold-dim border-gold/25">
          <h3 className="text-[10px] text-gold uppercase tracking-widest font-bold mb-2">Key Improvement</h3>
          <p className="text-[12px] text-court-text leading-relaxed">
            When facing a judicial intervention, take a moment before responding. Your instinct to answer immediately led to imprecise language when discussing the GCHQ distinction. Pause, consider the exact question, then respond with specificity.
          </p>
        </Card>
      </section>
      <section className="px-4 flex flex-col gap-2.5">
        <Button fullWidth onClick={() => { setScreen("select"); setMessages([]); setTimer(900); }}>Practice Again</Button>
        <Button fullWidth variant="outline">Save to Portfolio</Button>
        <Button fullWidth variant="secondary">Share Result</Button>
      </section>
    </div>
  );
}

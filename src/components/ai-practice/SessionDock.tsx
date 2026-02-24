"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BookOpen,
  Lightbulb,
  StickyNote,
  Settings,
  X,
  Volume2,
  VolumeX,
  Timer,
  Eye,
  ScrollText,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";

// ── Types ──

interface SessionDockProps {
  /** Session mode — determines hint content */
  mode: "judge" | "mentor" | "examiner" | "opponent";
  /** Case brief data */
  brief: {
    area: string;
    matter: string;
    yourRole: string;
    instructions: string;
    authorities: string[];
  };
  /** Current exchange count */
  exchangeCount: number;
  maxExchanges: number;
  /** Formatted timer string */
  timerDisplay: string;
  /** TTS controls */
  ttsEnabled: boolean;
  onToggleTts: () => void;
  /** End session handler */
  onEndSession: () => void;
  /** Spectator controls */
  spectatorEnabled: boolean;
  spectatorCount: number;
  /** Persona name */
  personaName: string;
  /** Messages for generating hints */
  messages: Array<{ role: "ai" | "user"; text: string }>;
  /** Transcript panel component (already built) */
  transcriptSlot?: React.ReactNode;
  /** Spectator share component (already built) */
  spectatorSlot?: React.ReactNode;
}

type DockTab = "brief" | "authorities" | "hints" | "notes" | "session" | null;

const TABS: { id: DockTab & string; label: string; Icon: typeof FileText }[] = [
  { id: "brief", label: "Brief", Icon: FileText },
  { id: "authorities", label: "Cases", Icon: BookOpen },
  { id: "hints", label: "Hints", Icon: Lightbulb },
  { id: "notes", label: "Notes", Icon: StickyNote },
  { id: "session", label: "Session", Icon: Settings },
];

// ── Hint Generator ──
// Produces contextual coaching tips based on mode + conversation state

type Mode = "judge" | "mentor" | "examiner" | "opponent";

function generateHints(
  mode: Mode,
  messages: Array<{ role: "ai" | "user"; text: string }>
): string[] {
  const lastAi = [...messages].reverse().find((m) => m.role === "ai")?.text.toLowerCase() || "";
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.text.toLowerCase() || "";
  const exchangeCount = messages.filter((m) => m.role === "user").length;
  const hints: string[] = [];

  // ── SHARED: Contextual triggers that apply to any mode ──

  if (lastAi.includes("distinguish") || lastAi.includes("how does this differ")) {
    hints.push("You're being asked to distinguish a case. Focus on factual differences first, then explain why those differences change the legal principle.");
  }
  if (lastAi.includes("authority") || lastAi.includes("cite") || lastAi.includes("which case")) {
    hints.push("Cite precisely: case name, year, court, and the specific principle or paragraph. Use the Cases tab below to check your authorities.");
  }
  if (lastAi.includes("time") || lastAi.includes("remaining") || lastAi.includes("conclude")) {
    hints.push("Time is running short. Move to your strongest remaining point and deliver a clear conclusion.");
  }

  // ── MODE-SPECIFIC HINTS ──

  if (mode === "judge") {
    // Opening tips
    if (exchangeCount === 0) {
      hints.push("Start with: 'May it please the court, my name is [name], counsel for the [party].'");
      hints.push("State the relief you seek in your first 30 seconds, then give a roadmap of your 2-3 strongest points.");
      hints.push("Lead with your strongest argument — don't build up to it.");
    }
    // Sceptical judge
    if (lastAi.includes("not satisfied") || lastAi.includes("unconvinced") || lastAi.includes("troubled") || lastAi.includes("bold proposition")) {
      hints.push("The judge is sceptical. Don't retreat — reframe using different reasoning or a stronger authority.");
    }
    // Interrupted
    if (lastAi.includes("stop you") || lastAi.includes("interrupt") || lastAi.includes("i'll stop")) {
      hints.push("You've been interrupted. Answer the judge's concern fully before returning to your planned argument.");
    }
    // Direct question
    if (lastAi.includes("yes or no") || lastAi.includes("simple question") || lastAi.includes("directly")) {
      hints.push("Answer directly: 'Yes, My Lord' or 'No, My Lord' — then explain. Judges hate evasion.");
    }
    // Policy question
    if (lastAi.includes("policy") || lastAi.includes("practical") || lastAi.includes("consequences")) {
      hints.push("This is a policy question. Ground your answer in legal principle first, then address practical implications.");
    }
    // Approving
    if (lastAi.includes("helpful") || lastAi.includes("well put") || lastAi.includes("that is helpful")) {
      hints.push("The judge found that point persuasive. Build on it — connect it to your next argument while you have momentum.");
    }
    // General judge fallbacks
    if (hints.length === 0) {
      hints.push("Use IRAC structure: Issue → Rule → Application → Conclusion.");
      hints.push("Signpost transitions: 'Turning to my second submission, My Lord...'");
      hints.push("If unsure: 'I will take instructions on that point, My Lord' is better than guessing.");
    }
  }

  if (mode === "mentor") {
    if (exchangeCount === 0) {
      hints.push("Start by telling your mentor what you're working on or what specific area you'd like feedback on.");
      hints.push("Be open about what you find difficult — that's how mentoring works best.");
      hints.push("Have your skeleton argument or case analysis ready to discuss.");
    }
    // Mentor asking probing questions
    if (lastAi.includes("why") || lastAi.includes("what do you think") || lastAi.includes("how would you")) {
      hints.push("Your mentor is using the Socratic method. Think it through before answering — they want to see your reasoning process, not just the answer.");
    }
    // Structural feedback
    if (lastAi.includes("structure") || lastAi.includes("reorganise") || lastAi.includes("restructure") || lastAi.includes("opening paragraph")) {
      hints.push("They've flagged a structural issue. Try using the funnel structure: broad legal principle → narrow application → specific relief sought.");
    }
    // Praise
    if (lastAi.includes("good") || lastAi.includes("effective") || lastAi.includes("precise") || lastAi.includes("well")) {
      hints.push("Your mentor praised something specific — note it in your Notes tab so you can replicate that technique.");
    }
    // Writing advice
    if (lastAi.includes("skeleton") || lastAi.includes("writing") || lastAi.includes("draft")) {
      hints.push("For skeleton arguments: each paragraph should make ONE point, supported by ONE authority, applied to YOUR facts.");
    }
    if (hints.length === 0) {
      hints.push("Ask your mentor about specific techniques: 'How should I structure a rebuttal?' or 'How do I handle hostile questions?'");
      hints.push("Common frameworks to ask about: IRAC, CLEO, funnel structure, or the rule-of-three for persuasion.");
      hints.push("Don't just accept advice — ask follow-up questions to understand the reasoning behind it.");
    }
  }

  if (mode === "examiner") {
    if (exchangeCount === 0) {
      hints.push("This is a formal SQE2 assessment. Begin with: 'May it please the court...' and state your application clearly.");
      hints.push("You'll be assessed on 5 competencies: Advocacy, Case Analysis, Legal Research, Oral Communication, Professional Conduct.");
      hints.push("Time management is critical — prioritise your strongest points. Don't try to cover everything.");
    }
    // SQE2 competency reminders
    if (exchangeCount > 0 && exchangeCount <= 3) {
      hints.push("SQE2 tip: Structure matters. Examiners want to see a clear introduction → core submissions → conclusion.");
    }
    // Examiner asking for clarification
    if (lastAi.includes("clarify") || lastAi.includes("explain further") || lastAi.includes("what do you mean")) {
      hints.push("The examiner needs more precision. Restate your point with the specific legal test or statutory provision.");
    }
    // Procedure
    if (lastAi.includes("procedure") || lastAi.includes("CPR") || lastAi.includes("rule")) {
      hints.push("Know your procedural rules. For Part 24 summary judgment: 'no real prospect of success' and 'no other compelling reason for trial'.");
    }
    // Mid-session reminders
    if (exchangeCount >= 5) {
      hints.push("Check you've covered all competencies: Have you cited authority? Applied law to facts? Maintained court manner?");
    }
    if (hints.length === 0) {
      hints.push("The examiner won't coach you. If you're stuck, take a breath, state the legal test, and apply it to the facts.");
      hints.push("Professional conduct: always address the court correctly, don't interrupt, maintain composure.");
      hints.push("Pass requires ALL five competencies met. If you've missed one area, pivot to address it now.");
    }
  }

  if (mode === "opponent") {
    if (exchangeCount === 0) {
      hints.push("Listen carefully to opposing counsel's opening. Note their key authorities and the weaknesses in their argument.");
      hints.push("Prepare to distinguish their cases: same name, different facts, different outcome.");
      hints.push("Don't attack everything — pick the 2-3 weakest points and focus your fire there.");
    }
    // Opponent made a strong point
    if (lastAi.includes("concede") || lastAi.includes("accept") || lastAi.includes("strong point")) {
      hints.push("They've made a concession or acknowledged your point. Press the advantage — build on it immediately.");
    }
    // Opponent challenging your authority
    if (lastAi.includes("distinguish") || lastAi.includes("does not apply") || lastAi.includes("different facts")) {
      hints.push("They're trying to distinguish your authority. Defend it: explain why the principle still applies despite factual differences.");
    }
    // Opponent raising counterargument
    if (lastAi.includes("however") || lastAi.includes("on the contrary") || lastAi.includes("with respect")) {
      hints.push("They're pivoting to a counterargument. Don't get drawn into their framework — restate YOUR principle and show why it prevails.");
    }
    // Opponent citing new authority
    if (lastAi.includes("[") && lastAi.includes("]")) {
      hints.push("Opposing counsel cited a case. If you don't know it, don't bluff — say 'That authority is not before me, but the principle in [your case] is directly on point.'");
    }
    if (hints.length === 0) {
      hints.push("Rebuttal tip: acknowledge the opponent's point briefly, then pivot: 'While my learned friend raises [X], this overlooks [Y].'");
      hints.push("Concede small points gracefully to maintain credibility: 'I accept that, but the critical issue remains...'");
      hints.push("Use the opponent's own logic against them: 'If my learned friend's argument is correct, then it follows that...' and show the absurd conclusion.");
    }
  }

  return hints;
}

// ── Component ──

export default function SessionDock(props: SessionDockProps) {
  const [activeTab, setActiveTab] = useState<DockTab>(null);

  // Default to Session tab on desktop
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches && !activeTab) {
      setActiveTab("session");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [notes, setNotes] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close sheet when tapping outside
  const handleBackdropClick = useCallback(() => setActiveTab(null), []);

  // Toggle tab — tap same tab to close
  const toggleTab = (tab: DockTab & string) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const hints = generateHints(props.mode, props.messages);

  // ── Shared panel content — used by both mobile sheet and desktop sidebar ──
  const renderPanelContent = () => {
    if (!activeTab) return null;
    return (
      <div className="space-y-3">
        {/* BRIEF */}
        {activeTab === "brief" && (
          <>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Area of Law</p>
              <p className="text-sm text-court-text font-medium">{props.brief.area}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Matter</p>
              <p className="text-sm text-court-text leading-relaxed">{props.brief.matter}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Your Role</p>
              <p className="text-sm text-gold font-semibold">{props.brief.yourRole}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Instructions</p>
              <p className="text-sm text-court-text-sec leading-relaxed">{props.brief.instructions}</p>
            </div>
          </>
        )}

        {/* AUTHORITIES */}
        {activeTab === "authorities" && (
          <>
            <p className="text-xs text-court-text-ter">
              Tap an authority to copy it for your submissions.
            </p>
            {props.brief.authorities.map((auth, i) => (
              <button
                key={i}
                onClick={() => { navigator.clipboard?.writeText(auth); }}
                className="w-full text-left bg-navy-card border border-court-border rounded-xl px-3 py-2.5 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-gold font-bold text-xs mt-0.5">{i + 1}</span>
                  <p className="text-sm text-court-text leading-relaxed group-hover:text-gold transition-colors">
                    {auth}
                  </p>
                </div>
              </button>
            ))}
            <p className="text-[10px] text-court-text-ter text-center pt-1">
              These are your key authorities for this case
            </p>
          </>
        )}

        {/* HINTS */}
        {activeTab === "hints" && (
          <>
            <p className="text-xs text-court-text-ter">
              {props.mode === "judge" && "Advocacy coaching based on the judge's responses:"}
              {props.mode === "mentor" && "Tips for getting the most from your mentoring session:"}
              {props.mode === "examiner" && "SQE2 competency reminders and exam technique:"}
              {props.mode === "opponent" && "Rebuttal tactics and debating strategy:"}
            </p>
            {hints.map((hint, i) => (
              <div
                key={i}
                className="bg-gold/5 border border-gold/15 rounded-xl px-3 py-2.5 flex items-start gap-2"
              >
                <Lightbulb size={14} className="text-gold shrink-0 mt-0.5" />
                <p className="text-sm text-court-text leading-relaxed">{hint}</p>
              </div>
            ))}
          </>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <>
            <p className="text-xs text-court-text-ter">
              Jot down points to address or arguments to remember:
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={"e.g. Judge asked about CCSU distinction — address in closing\n\nRemember to cite para 43 of Miller..."}
              className="w-full h-40 bg-navy-card border border-court-border rounded-xl px-3 py-2.5 text-sm text-court-text resize-none outline-none focus:border-gold/30 placeholder:text-court-text-ter"
            />
            <p className="text-[10px] text-court-text-ter text-right">
              {notes.length > 0 ? `${notes.length} chars` : "Notes are saved for this session"}
            </p>
          </>
        )}

        {/* SESSION */}
        {activeTab === "session" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-navy-card border border-court-border rounded-xl px-3 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Exchanges</p>
                <p className="text-lg font-bold text-court-text font-mono">
                  {props.exchangeCount}<span className="text-court-text-ter text-sm">/{props.maxExchanges}</span>
                </p>
              </div>
              <div className="bg-navy-card border border-court-border rounded-xl px-3 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Time</p>
                <p className="text-lg font-bold text-red-400 font-mono">{props.timerDisplay}</p>
              </div>
            </div>
            <div className="bg-navy-card border border-court-border rounded-xl px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Presiding</p>
              <p className="text-sm font-bold text-gold">{props.personaName}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={props.onToggleTts}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors",
                  props.ttsEnabled
                    ? "bg-gold/10 border-gold/20 text-gold"
                    : "bg-navy-card border-court-border text-court-text-sec"
                )}
              >
                {props.ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="text-sm font-medium">
                  Judge voice {props.ttsEnabled ? "on" : "off"}
                </span>
              </button>
              {props.transcriptSlot}
              {props.spectatorSlot}
            </div>
            <button
              onClick={props.onEndSession}
              className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-colors"
            >
              End Session
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ═══ MOBILE: Backdrop + Bottom Sheet + Bottom Bar ═══ */}

      {/* Backdrop overlay (mobile only) */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      {/* Bottom sheet panel (mobile only) */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            ref={sheetRef}
            className="fixed bottom-[60px] left-0 right-0 z-50 bg-navy border-t border-gold/15 rounded-t-2xl shadow-2xl max-h-[55vh] flex flex-col md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-court-border-light/20 shrink-0">
              <h3 className="text-sm font-bold text-gold">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h3>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1.5 rounded-full bg-navy-card text-court-text-ter hover:text-court-text"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Sheet content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {renderPanelContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom tab bar (mobile only) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-navy-mid/95 backdrop-blur-xl border-t border-gold/15 md:hidden"
        role="navigation"
        aria-label="Session tools"
      >
        <div className="mx-auto flex px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),4px)]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => toggleTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-0.5 relative min-h-[48px] py-1.5 justify-center active:scale-[0.97] transition-transform"
              >
                {isActive && (
                  <motion.div
                    layoutId="sessionDockIndicator"
                    className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <tab.Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    "transition-all duration-200 shrink-0",
                    isActive ? "text-gold" : "text-court-text-sec"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] leading-tight font-semibold tracking-wide transition-colors duration-200",
                    isActive ? "text-gold" : "text-court-text-sec"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* End Session — always visible, red, unmissable */}
          <button
            onClick={() => {
              if (confirm("End this session? You will receive your assessment.")) {
                props.onEndSession();
              }
            }}
            className="flex-1 flex flex-col items-center gap-0.5 min-h-[48px] py-1.5 justify-center active:scale-[0.97] transition-transform"
          >
            <LogOut
              size={20}
              strokeWidth={2}
              className="text-red-400 shrink-0"
            />
            <span className="text-[10px] leading-tight font-bold tracking-wide text-red-400">
              End
            </span>
          </button>
        </div>
      </nav>

      {/* ═══ DESKTOP: Right Sidebar ═══ */}
      <aside className="hidden md:flex flex-col w-[320px] shrink-0 border-l border-gold/10 bg-navy/50 h-full">
        {/* Vertical tab buttons */}
        <div className="flex border-b border-court-border-light/20 shrink-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => toggleTab(tab.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative",
                  isActive
                    ? "text-gold"
                    : "text-court-text-sec hover:text-court-text"
                )}
              >
                <tab.Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="desktopDockIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}

          {/* End Session — desktop sidebar */}
          <button
            onClick={() => {
              if (confirm("End this session? You will receive your assessment.")) {
                props.onEndSession();
              }
            }}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors text-red-400 hover:text-red-300"
          >
            <LogOut size={16} strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-wide">End</span>
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activeTab ? (
            renderPanelContent()
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <FileText size={24} className="text-court-text-ter mb-2" />
              <p className="text-xs text-court-text-ter">Select a tool above</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

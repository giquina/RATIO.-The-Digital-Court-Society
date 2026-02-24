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
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";

// ── Types ──

interface SessionDockProps {
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
// Analyses the last AI message to give contextual coaching tips

function generateHints(messages: Array<{ role: "ai" | "user"; text: string }>): string[] {
  const lastAi = [...messages].reverse().find((m) => m.role === "ai")?.text.toLowerCase() || "";
  const hints: string[] = [];

  // Always-relevant tips
  if (messages.length <= 2) {
    hints.push("Start strong: 'May it please the court, my name is [name], counsel for the [party].'");
    hints.push("State the relief you seek clearly in your opening 30 seconds.");
    hints.push("Provide a roadmap: outline your 2-3 strongest points upfront.");
  }

  // Contextual tips based on judge's last response
  if (lastAi.includes("distinguish") || lastAi.includes("how does this differ")) {
    hints.push("The judge wants you to distinguish a case. Focus on factual differences, then explain why those differences matter to the legal principle.");
  }
  if (lastAi.includes("authority") || lastAi.includes("cite") || lastAi.includes("which case")) {
    hints.push("Cite your authority precisely: case name, year, and the specific principle or paragraph number.");
  }
  if (lastAi.includes("not satisfied") || lastAi.includes("unconvinced") || lastAi.includes("troubled")) {
    hints.push("The judge is sceptical. Don't retreat — reframe your argument using different reasoning or a stronger authority.");
  }
  if (lastAi.includes("time") || lastAi.includes("remaining") || lastAi.includes("conclude")) {
    hints.push("Time is running short. Move to your strongest point and deliver a clear, memorable conclusion.");
  }
  if (lastAi.includes("policy") || lastAi.includes("practical")) {
    hints.push("This is a policy question. Ground your answer in principle first, then explain practical implications.");
  }
  if (lastAi.includes("yes or no") || lastAi.includes("simple question")) {
    hints.push("Answer directly — 'Yes, My Lord' or 'No, My Lord' — then explain. Don't dodge.");
  }
  if (lastAi.includes("stop you") || lastAi.includes("interrupt")) {
    hints.push("The judge interrupted you. Answer their concern fully before returning to your planned argument. Don't rush.");
  }

  // General coaching if nothing specific triggered
  if (hints.length === 0) {
    hints.push("Remember IRAC: Issue → Rule → Application → Conclusion.");
    hints.push("Use signposting: 'Turning to my second submission, My Lord...'");
    hints.push("If unsure of an answer, say: 'I will take instructions on that point' rather than guessing.");
  }

  return hints;
}

// ── Component ──

export default function SessionDock(props: SessionDockProps) {
  const [activeTab, setActiveTab] = useState<DockTab>(null);
  const [notes, setNotes] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close sheet when tapping outside
  const handleBackdropClick = useCallback(() => setActiveTab(null), []);

  // Toggle tab — tap same tab to close
  const toggleTab = (tab: DockTab & string) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const hints = generateHints(props.messages);

  return (
    <>
      {/* Backdrop overlay when a panel is open */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      {/* Bottom sheet panel */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            ref={sheetRef}
            className="fixed bottom-[60px] left-0 right-0 z-50 bg-navy border-t border-gold/15 rounded-t-2xl shadow-2xl max-h-[55vh] flex flex-col"
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
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {/* ── BRIEF PANEL ── */}
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

              {/* ── AUTHORITIES PANEL ── */}
              {activeTab === "authorities" && (
                <>
                  <p className="text-xs text-court-text-ter">
                    Tap an authority to copy it for your submissions.
                  </p>
                  {props.brief.authorities.map((auth, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigator.clipboard?.writeText(auth);
                      }}
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

              {/* ── HINTS PANEL ── */}
              {activeTab === "hints" && (
                <>
                  <p className="text-xs text-court-text-ter">
                    Coaching tips based on where you are in the session:
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

              {/* ── NOTES PANEL ── */}
              {activeTab === "notes" && (
                <>
                  <p className="text-xs text-court-text-ter">
                    Jot down points to address or arguments to remember:
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Judge asked about CCSU distinction — address in closing&#10;&#10;Remember to cite para 43 of Miller..."
                    className="w-full h-40 bg-navy-card border border-court-border rounded-xl px-3 py-2.5 text-sm text-court-text resize-none outline-none focus:border-gold/30 placeholder:text-court-text-ter"
                  />
                  <p className="text-[10px] text-court-text-ter text-right">
                    {notes.length > 0 ? `${notes.length} chars` : "Notes are saved for this session"}
                  </p>
                </>
              )}

              {/* ── SESSION PANEL ── */}
              {activeTab === "session" && (
                <>
                  {/* Status cards */}
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

                  {/* Persona */}
                  <div className="bg-navy-card border border-court-border rounded-xl px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider text-court-text-ter mb-0.5">Presiding</p>
                    <p className="text-sm font-bold text-gold">{props.personaName}</p>
                  </div>

                  {/* Controls */}
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

                    {/* Transcript and Spectator slots (existing components) */}
                    {props.transcriptSlot}
                    {props.spectatorSlot}
                  </div>

                  {/* End session */}
                  <button
                    onClick={props.onEndSession}
                    className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-colors"
                  >
                    End Session
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── The dock bar itself ── */}
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
        </div>
      </nav>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, ProgressBar, Tag } from "@/components/ui";

interface AIFeedbackProps {
  sessionTitle: string;
  module: string;
  duration: string;
  onClose: () => void;
}

interface FeedbackSection {
  category: string;
  score: number;
  maxScore: number;
  analysis: string;
  improvement: string;
}

const DEMO_FEEDBACK: FeedbackSection[] = [
  {
    category: "Argument Structure (IRAC)",
    score: 78,
    maxScore: 100,
    analysis: "Strong identification of the legal issue and clear rule statement. Your application could be strengthened by more explicitly connecting the facts of Miller to the broader constitutional principle.",
    improvement: "Practice leading with a roadmap: 'My Lord, I submit three points in support...' — this gives the court a clear framework to follow your argument.",
  },
  {
    category: "Use of Authorities",
    score: 72,
    maxScore: 100,
    analysis: "Good use of Miller [2017] as the primary authority. However, reliance on a single case leaves the argument vulnerable. The court would expect reference to Entick v Carrington and the Bill of Rights 1689.",
    improvement: "Prepare at least 3 authorities per submission point. Use a hierarchy: one Supreme Court, one Court of Appeal, one academic source.",
  },
  {
    category: "Oral Delivery & Clarity",
    score: 85,
    maxScore: 100,
    analysis: "Confident pace and good projection. Your pauses after key points were effective. Slight tendency to speed up during complex statutory interpretation — the court needs time to process these passages.",
    improvement: "Mark breathing points in your skeleton argument. When citing statute, slow down by 20% and enunciate clearly.",
  },
  {
    category: "Response to Judicial Questions",
    score: 65,
    maxScore: 100,
    analysis: "Showed composure when challenged but occasionally deflected rather than directly engaging with the question. The bench wants to see you wrestle with difficult points, not avoid them.",
    improvement: "Practice the 'Yes, My Lord, and...' technique — acknowledge the question, then redirect. Never say 'I'll come to that later' unless you genuinely will.",
  },
  {
    category: "Court Manner & Etiquette",
    score: 90,
    maxScore: 100,
    analysis: "Excellent formal address and proper use of 'My Lord/Lady'. Good posture and eye contact. Your bow on entering and leaving was noted positively.",
    improvement: "Minor point: when opposing counsel is making submissions, avoid any visible reaction — judicial manners require stoicism.",
  },
  {
    category: "Time Management",
    score: 70,
    maxScore: 100,
    analysis: "Spent approximately 60% of allotted time on the first submission point, leaving insufficient time for your second and third arguments. The third point was noticeably rushed.",
    improvement: "Allocate time before you begin: Point 1 (5 min), Point 2 (5 min), Point 3 (3 min), Summary (2 min). Use a timer visible only to you.",
  },
];

const SQE2_COMPETENCIES = [
  { name: "Client Interviewing", score: 72 },
  { name: "Advocacy", score: 78 },
  { name: "Case Analysis", score: 81 },
  { name: "Legal Research", score: 68 },
  { name: "Legal Writing", score: 74 },
  { name: "Negotiation", score: 65 },
];

export function AIFeedback({ sessionTitle, module, duration, onClose }: AIFeedbackProps) {
  const [loading, setLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [showSQE2, setShowSQE2] = useState(false);

  const overallScore = Math.round(
    DEMO_FEEDBACK.reduce((sum, f) => sum + f.score, 0) / DEMO_FEEDBACK.length
  );

  // Simulate AI processing pipeline
  useEffect(() => {
    const t1 = setTimeout(() => setLoadingPhase(1), 600);   // "Transcribing audio..."
    const t2 = setTimeout(() => setLoadingPhase(2), 1800);  // "Analysing arguments..."
    const t3 = setTimeout(() => setLoadingPhase(3), 3000);  // "Generating feedback..."
    const t4 = setTimeout(() => setLoading(false), 4000);   // Done

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-navy flex items-center justify-center">
        <div className="text-center px-8">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-gold/30 border-t-gold flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingPhase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-serif text-base font-bold text-court-text mb-1">
                {loadingPhase === 0 && "Preparing analysis..."}
                {loadingPhase === 1 && "Transcribing audio..."}
                {loadingPhase === 2 && "Analysing arguments..."}
                {loadingPhase === 3 && "Generating feedback..."}
              </p>
              <p className="text-[11px] text-court-text-ter">
                {loadingPhase === 0 && "Connecting to AI Judge"}
                {loadingPhase === 1 && "Whisper API processing session recording"}
                {loadingPhase === 2 && "Evaluating structure, authorities, and delivery"}
                {loadingPhase === 3 && "Preparing personalised recommendations"}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 w-48 mx-auto">
            <ProgressBar pct={loadingPhase * 25 + 10} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-navy overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6 pb-12">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Tag color="gold">AI JUDGE</Tag>
            <Tag color="blue">{module.toUpperCase()}</Tag>
          </div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-1">Session Analysis</h1>
          <p className="text-xs text-court-text-sec">{sessionTitle} &middot; {duration}</p>
        </motion.div>

        {/* Overall score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 mb-4 text-center" highlight>
            <p className="text-[10px] text-court-text-ter uppercase tracking-widest mb-2">Overall Performance</p>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="#C9A84C" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallScore * 2.64} ${264 - overallScore * 2.64}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-gold">{overallScore}</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-court-text">
              {overallScore >= 80 ? "Strong Performance" : overallScore >= 70 ? "Competent Showing" : "Room for Growth"}
            </p>
            <p className="text-[10px] text-court-text-ter mt-1">
              Top {Math.max(5, 100 - overallScore + Math.floor(Math.random() * 10))}% of sessions this week
            </p>
          </Card>
        </motion.div>

        {/* Dimension breakdown */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-court-text tracking-wider uppercase mb-3 px-1">
            Detailed Breakdown
          </h3>
          <div className="flex flex-col gap-2">
            {DEMO_FEEDBACK.map((f, i) => (
              <motion.div
                key={f.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Card
                  className="overflow-hidden"
                  onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                >
                  <div className="p-3.5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-court-text">{f.category}</span>
                      <span className={`text-sm font-bold font-mono ${
                        f.score >= 80 ? "text-green-500" : f.score >= 70 ? "text-gold" : "text-orange-400"
                      }`}>
                        {f.score}
                      </span>
                    </div>
                    <ProgressBar
                      pct={f.score}
                      color={f.score >= 80 ? "green" : f.score >= 70 ? "gold" : "orange"}
                      height={3}
                    />
                  </div>

                  <AnimatePresence>
                    {expandedSection === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3.5 pb-3.5 border-t border-court-border-light pt-3">
                          <div className="mb-3">
                            <p className="text-[10px] text-gold font-bold uppercase tracking-wider mb-1">Analysis</p>
                            <p className="text-[11px] text-court-text-sec leading-relaxed">{f.analysis}</p>
                          </div>
                          <div className="bg-gold/5 rounded-xl p-3">
                            <p className="text-[10px] text-gold font-bold uppercase tracking-wider mb-1">Improvement</p>
                            <p className="text-[11px] text-court-text leading-relaxed">{f.improvement}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SQE2 Readiness */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 mb-4">
            <button
              onClick={() => setShowSQE2(!showSQE2)}
              className="w-full flex justify-between items-center"
            >
              <div>
                <p className="text-xs font-bold text-court-text">SQE2 Readiness Impact</p>
                <p className="text-[10px] text-court-text-ter mt-0.5">How this session affects your exam preparedness</p>
              </div>
              <span className="text-court-text-ter text-sm">{showSQE2 ? "−" : "+"}</span>
            </button>

            <AnimatePresence>
              {showSQE2 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-court-border-light flex flex-col gap-2.5">
                    {SQE2_COMPETENCIES.map((c) => (
                      <div key={c.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-court-text-sec">{c.name}</span>
                          <span className="text-[11px] text-court-text font-mono">{c.score}%</span>
                        </div>
                        <ProgressBar pct={c.score} height={2} color={c.score >= 75 ? "green" : c.score >= 60 ? "gold" : "orange"} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Key takeaways */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-4 mb-4" highlight>
            <p className="text-xs font-bold text-gold tracking-wider uppercase mb-2">Judge&apos;s Summary</p>
            <p className="text-[12px] text-court-text leading-relaxed mb-3">
              Counsel demonstrated a solid grasp of constitutional principles and conducted themselves with proper decorum throughout.
              The primary area for development is time management and depth of authorities — a broader case base would significantly
              strengthen future submissions. The court was particularly impressed by the oral delivery and formal manner.
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-xs mt-0.5">&#9650;</span>
                <p className="text-[11px] text-court-text-sec">Study: <strong className="text-court-text">Entick v Carrington</strong> and <strong className="text-court-text">CCSU v Minister</strong></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-xs mt-0.5">&#9650;</span>
                <p className="text-[11px] text-court-text-sec">Practice: Timed submissions (use a stopwatch during prep)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 text-xs mt-0.5">&#9650;</span>
                <p className="text-[11px] text-court-text-sec">Challenge: <strong className="text-court-text">Priya Sharma</strong> to a rematch (she scored 81)</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button fullWidth onClick={onClose}>Save to Portfolio</Button>
          <Button fullWidth variant="secondary" onClick={onClose}>Share Feedback</Button>
          <Button fullWidth variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────
 *  DisclaimerBanner — landing page trust & transparency panel
 *
 *  Designed to build user confidence while maintaining clear legal
 *  boundaries. Tone: authoritative, reassuring, academically rigorous —
 *  like a reputable Inn of Court, not a medicine-bottle warning.
 * ────────────────────────────────────────────────────────────────────── */

const DATA_SOURCES = [
  { label: "Case Law", detail: "Find Case Law — UK National Archives" },
  { label: "Legislation", detail: "legislation.gov.uk (The National Archives)" },
  { label: "Parliamentary Data", detail: "UK Parliament Open Data API" },
];

const VERIFICATION_SKILLS = [
  "Cross-reference analysis with primary legislation on legislation.gov.uk",
  "Confirm case citations against official law reports (ICLR, BAILII)",
  "Check that statutory provisions remain current and in force",
  "Apply OSCOLA citation format in all academic and professional work",
];

export function DisclaimerBanner() {
  const [expanded, setExpanded] = useState(false);

  // Auto-expand for first-time visitors so they see the full
  // transparency panel on their initial visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("ratio_disclaimer_seen");
    if (!seen) {
      setExpanded(true);
      localStorage.setItem("ratio_disclaimer_seen", "1");
    }
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 group cursor-pointer"
        aria-expanded={expanded}
        aria-controls="disclaimer-content"
      >
        <ShieldCheck size={14} className="text-gold/60 group-hover:text-gold transition-colors" />
        <span className="text-court-xs text-court-text-sec group-hover:text-court-text transition-colors">
          Trusted training platform · England &amp; Wales · How we protect you
        </span>
        <ChevronDown
          size={12}
          className={`text-court-text-ter group-hover:text-court-text-sec transition-all ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            id="disclaimer-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-5 pb-2 max-w-xl mx-auto space-y-5">

              {/* ── Educational Purpose & Scope ── */}
              <div>
                <p className="text-court-xs text-gold/80 font-semibold uppercase tracking-widest mb-1.5">
                  Educational Purpose &amp; Scope
                </p>
                <p className="text-court-xs text-court-text-sec leading-relaxed">
                  RATIO is a professional-standard training environment built
                  primarily for law students in England &amp; Wales, and open to
                  anyone developing their legal skills. Every AI-powered session is
                  designed to develop your advocacy, analysis, and research skills
                  using recognised legal frameworks. As with any training tool,
                  RATIO supports your legal education — it does not replace
                  qualified legal advice.
                </p>
              </div>

              {/* ── Data Sources & Methodology ── */}
              <div>
                <p className="text-court-xs text-gold/80 font-semibold uppercase tracking-widest mb-1.5">
                  Sources &amp; Methodology
                </p>
                <p className="text-court-xs text-court-text-sec leading-relaxed mb-2">
                  Our AI draws exclusively from authoritative UK legal databases
                  to ensure your practice is grounded in real law:
                </p>
                <div className="space-y-1.5">
                  {DATA_SOURCES.map((source) => (
                    <p key={source.label} className="text-court-xs text-court-text-ter leading-relaxed flex items-start gap-2">
                      <span className="text-gold mt-px shrink-0">·</span>
                      <span><span className="text-court-text-sec font-medium">{source.label}:</span> {source.detail}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* ── Academic Integrity & Verification ── */}
              <div>
                <p className="text-court-xs text-gold/80 font-semibold uppercase tracking-widest mb-1.5">
                  Academic Integrity &amp; Verification
                </p>
                <p className="text-court-xs text-court-text-sec leading-relaxed mb-2">
                  Rigorous verification is a hallmark of good legal practice.
                  RATIO encourages you to develop these professional habits:
                </p>
                <div className="space-y-1.5">
                  {VERIFICATION_SKILLS.map((skill) => (
                    <p key={skill} className="text-court-xs text-court-text-ter leading-relaxed flex items-start gap-2">
                      <span className="text-gold mt-px shrink-0">·</span>
                      {skill}
                    </p>
                  ))}
                </div>
              </div>

              {/* ── Privacy & Confidentiality ── */}
              <div>
                <p className="text-court-xs text-gold/80 font-semibold uppercase tracking-widest mb-1.5">
                  Privacy &amp; Confidentiality
                </p>
                <p className="text-court-xs text-court-text-sec leading-relaxed">
                  Your practice sessions are private by default. We do not share
                  your data with employers, universities, or any third party.
                  What you practise on RATIO stays on RATIO.
                </p>
              </div>

              {/* ── Trust Statement ── */}
              <div className="border-t border-court-border pt-4">
                <p className="text-court-xs text-court-text leading-relaxed text-center font-medium italic">
                  Built on authoritative UK legal sources. Designed to rigorous
                  academic standards. Your data stays private, your practice
                  stays yours.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default DisclaimerBanner;

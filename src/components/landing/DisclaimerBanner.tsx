"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown } from "lucide-react";

const VERIFICATION_POINTS = [
  "Cross-reference AI analysis with primary legislation on legislation.gov.uk",
  "Verify case citations against official law reports (ICLR, BAILII)",
  "Check statutory provisions are current and not repealed",
  "Use OSCOLA citation format for all academic and professional work",
];

const AI_DATA_SOURCES = [
  { label: "Case Law", detail: "Find Case Law — UK National Archives" },
  { label: "Legislation", detail: "legislation.gov.uk (The National Archives)" },
  { label: "Parliamentary Data", detail: "UK Parliament Open Data API" },
];

export function DisclaimerBanner() {
  const [expanded, setExpanded] = useState(false);

  // Auto-expand for first-time visitors
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
        <ShieldCheck size={14} className="text-court-text-ter group-hover:text-court-text-sec transition-colors" />
        <span className="text-court-xs text-court-text-ter group-hover:text-court-text-sec transition-colors">
          Educational training tool · Not legal advice · England &amp; Wales
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
            <div className="pt-4 pb-2 max-w-xl mx-auto">
              <p className="text-court-xs text-court-text-ter leading-relaxed text-center mb-3">
                Ratio is an educational training tool for UK law students. It does
                not constitute legal advice. AI-generated analysis should always be
                verified against primary legislation and official law reports.
              </p>
              <p className="text-court-xs text-court-text-sec leading-relaxed text-center mb-4 font-medium">
                Your practice sessions are private by default. We never share your
                data with employers or universities.
              </p>

              {/* AI Data Sources */}
              <p className="text-court-xs text-court-text-sec font-semibold uppercase tracking-widest mb-2">
                Where the AI gets its data
              </p>
              <div className="space-y-1.5 mb-4">
                {AI_DATA_SOURCES.map((source) => (
                  <p key={source.label} className="text-court-xs text-court-text-ter leading-relaxed flex items-start gap-2">
                    <span className="text-gold mt-px shrink-0">·</span>
                    <span><span className="text-court-text-sec font-medium">{source.label}:</span> {source.detail}</span>
                  </p>
                ))}
              </div>

              {/* Verification Points */}
              <p className="text-court-xs text-court-text-sec font-semibold uppercase tracking-widest mb-2">
                Always verify
              </p>
              <div className="space-y-1.5">
                {VERIFICATION_POINTS.map((point) => (
                  <p key={point} className="text-court-xs text-court-text-ter leading-relaxed flex items-start gap-2">
                    <span className="text-court-text-ter mt-px shrink-0">·</span>
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default DisclaimerBanner;

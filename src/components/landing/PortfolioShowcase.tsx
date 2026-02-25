"use client";

import { motion } from "framer-motion";
import { FileText, Download, BarChart3 } from "lucide-react";
import { SkillsRadar } from "@/components/shared/SkillsRadar";

/*
 * PortfolioShowcase — landing page section previewing the PDF portfolio export.
 *
 * Think of this like a movie poster for your legal career — it shows what
 * the exported portfolio looks like so students think "I want to hand
 * that to a recruiter."
 *
 * The PDF mockup card uses a light background (unusual for RATIO's dark
 * theme) which makes it pop as a "printed document" preview.
 * The 3D tilt is done with CSS perspective transform.
 */

const MOCK_SESSIONS = [
  { date: "18 Feb", case: "Judicial Review of Executive Power", score: 78 },
  { date: "14 Feb", case: "Contract Formation — Offer & Acceptance", score: 72 },
  { date: "10 Feb", case: "R v Hughes — Self-Defence", score: 65 },
  { date: "6 Feb", case: "Duty of Care Analysis", score: 81 },
];

export function PortfolioShowcase({ id }: { id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      {/* Section heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-gold" />
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
            CAREER-READY
          </span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
          Build Your Advocacy Portfolio
        </h2>
        <p className="text-court-base text-court-text-sec max-w-lg mx-auto">
          Every session, every score, every certificate — compiled into a
          professional PDF you can share with chambers, law firms, and recruiters.
        </p>
      </div>

      {/* PDF mockup with 3D tilt */}
      <div className="flex justify-center">
        <motion.div
          initial={{ rotateY: -8, opacity: 0 }}
          whileInView={{ rotateY: -4, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ perspective: "800px" }}
          className="w-full max-w-md"
        >
          {/* The "paper" — light background to look like a printed document */}
          <div className="bg-[#F8F6F2] rounded-xl p-5 md:p-6 shadow-2xl shadow-black/40 border border-white/10 relative">
            {/* PDF header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E0DCD6]">
              <div>
                <p className="text-[10px] tracking-[0.15em] text-[#8A8580] font-bold">
                  RATIO ADVOCACY PORTFOLIO
                </p>
                <p className="text-[#2A2520] font-serif text-sm font-bold mt-0.5">
                  Marcus Thompson
                </p>
                <p className="text-[10px] text-[#8A8580]">
                  King&apos;s College London · Lincoln&apos;s Inn
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-[#E8E4DE] flex items-center justify-center">
                <FileText size={14} className="text-[#8A8580]" />
              </div>
            </div>

            {/* Mini radar chart */}
            <div className="flex justify-center mb-3">
              <SkillsRadar
                scores={[72, 80, 68, 75, 85, 62, 70]}
                size={140}
                animate={false}
              />
            </div>

            {/* Session history table */}
            <p className="text-[9px] font-bold text-[#8A8580] tracking-[0.12em] mb-2">
              SESSION HISTORY
            </p>
            <div className="space-y-1.5 mb-4">
              {MOCK_SESSIONS.map((s) => (
                <div
                  key={s.date}
                  className="flex items-center justify-between text-[10px] py-1 border-b border-[#EBE8E3]"
                >
                  <span className="text-[#8A8580] w-12 shrink-0">{s.date}</span>
                  <span className="text-[#2A2520] flex-1 truncate px-2">{s.case}</span>
                  <span
                    className="font-bold shrink-0"
                    style={{ color: s.score >= 70 ? "#3D6B45" : "#8B6914" }}
                  >
                    {s.score}/100
                  </span>
                </div>
              ))}
            </div>

            {/* Certificates earned */}
            <p className="text-[9px] font-bold text-[#8A8580] tracking-[0.12em] mb-1.5">
              CERTIFICATES
            </p>
            <div className="flex gap-2 mb-3">
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#CD7F32]/15 text-[#CD7F32] font-bold">
                Foundation ✓
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#C0C0C0]/15 text-[#8A8580] font-bold">
                Intermediate ✓
              </span>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#E0DCD6] flex justify-between items-center">
              <p className="text-[8px] text-[#B0ACA6]">
                Generated 25 Feb 2026 · ratiothedigitalcourtsociety.com
              </p>
            </div>

            {/* Decorative "PDF" badge */}
            <div className="absolute top-3 right-3 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
              PDF
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export CTA note */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 text-court-sm text-court-text-ter">
          <Download size={14} />
          <span>Export to PDF anytime — share with employers in one click</span>
        </div>
      </div>
    </motion.section>
  );
}

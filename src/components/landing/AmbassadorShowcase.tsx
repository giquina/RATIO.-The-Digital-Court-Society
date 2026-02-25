"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Megaphone,
  Gift,
  Award,
  FileText,
  Star,
  Zap,
  Trophy,
  ArrowRight,
} from "lucide-react";

/*
 * AmbassadorShowcase — landing page section promoting the Ambassador Programme.
 *
 * Think of it as a recruitment poster: "Join the team, here's what you get."
 * It sits just before Testimonials so the trust funnel flows:
 *   Ambassadors → "Real students use this" → Testimonials → Pricing
 *
 * The benefits data is hardcoded here (not imported from the ambassadors page)
 * to keep the landing page bundle separate. We only show the 6 benefit titles
 * as compact icon cards — the full descriptions live on /ambassadors.
 */

const BENEFITS = [
  { icon: Gift, title: "Free Premium+ Access" },
  { icon: Award, title: "All Certificates Included" },
  { icon: FileText, title: "Letter of Recommendation" },
  { icon: Star, title: "Featured on RATIO" },
  { icon: Zap, title: "Early Feature Access" },
  { icon: Trophy, title: "Exclusive Events" },
];

// Placeholder ambassadors (these would be replaced with real data once ambassadors join)
const AMBASSADORS = [
  { initials: "SK", university: "UCL", color: "#6B2D3E" },
  { initials: "JM", university: "Oxford", color: "#2E5090" },
  { initials: "AN", university: "KCL", color: "#3D6B45" },
  { initials: "RL", university: "Edinburgh", color: "#8B6914" },
  { initials: "DP", university: "Bristol", color: "#6B2D3E" },
  { initials: "HT", university: "Manchester", color: "#2E5090" },
];

export function AmbassadorShowcase({ id }: { id?: string }) {
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
          <Megaphone size={20} className="text-gold" />
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
            GET INVOLVED
          </span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
          Join the Ambassador Programme
        </h2>
        <p className="text-court-base text-court-text-sec max-w-lg mx-auto">
          Represent RATIO at your university. Get free Premium+ access, all
          certificates included, and a letter of recommendation from the Founder.
        </p>
      </div>

      {/* Ambassador avatar row */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {/* Overlapping avatars */}
          <div className="flex -space-x-2">
            {AMBASSADORS.map((a, i) => (
              <motion.div
                key={a.initials}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-court-sm font-bold text-white/80 border-2 border-navy shrink-0"
                style={{ background: a.color, zIndex: AMBASSADORS.length - i }}
              >
                {a.initials}
              </motion.div>
            ))}
          </div>
          {/* "You?" circle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="w-10 h-10 rounded-full border-2 border-dashed border-gold/40 flex items-center justify-center text-court-xs text-gold font-bold -ml-2"
            style={{ zIndex: 0 }}
          >
            You?
          </motion.div>
        </div>
      </div>

      {/* University names strip */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {AMBASSADORS.map((a) => (
          <span
            key={a.university}
            className="text-court-xs text-court-text-ter bg-white/[0.03] border border-court-border-light rounded-full px-3 py-1"
          >
            {a.university}
          </span>
        ))}
        <span className="text-court-xs text-gold bg-gold-dim border border-gold/20 rounded-full px-3 py-1 font-semibold">
          + your university
        </span>
      </div>

      {/* Benefits strip — compact 2×3 grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="bg-navy-card border border-court-border-light rounded-court px-3 py-2.5 flex items-center gap-2.5 hover:border-white/10 transition-all"
          >
            <b.icon size={16} className="text-gold shrink-0" />
            <span className="text-court-xs font-semibold text-court-text">
              {b.title}
            </span>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div className="text-center">
        <Link
          href="/ambassadors"
          className="inline-flex items-center gap-2 bg-gold text-navy font-bold rounded-xl px-8 py-3 text-court-base tracking-wide hover:bg-gold/90 transition-colors"
        >
          Apply to Be an Ambassador
          <ArrowRight size={16} />
        </Link>
        <p className="text-court-xs text-court-text-ter mt-3">
          Currently accepting ambassadors from UK universities
        </p>
      </div>
    </motion.section>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Scale,
  Target,
  BarChart3,
  Trophy,
  Users,
  Search,
  Video,
  Swords,
  Landmark,
  Gavel,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FEATURES: {
  Icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
}[] = [
  {
    Icon: Bot,
    title: "AI Judge",
    desc: "Face a virtual High Court judge who interrupts your submissions with real judicial interventions. Scored across 7 advocacy dimensions.",
    tag: "FIRST OF ITS KIND",
  },
  {
    Icon: Video,
    title: "Live Video Mooting",
    desc: "Argue your case face-to-face in virtual courtrooms with timed speaking slots, role allocation, and a formal courtroom entrance.",
    tag: "LIVE VIDEO",
  },
  {
    Icon: Scale,
    title: "Moot Organisation",
    desc: "Create sessions, claim courtroom roles, invite your cohort. Real-time role claiming so no one double-books.",
    tag: "REAL-TIME",
  },
  {
    Icon: Swords,
    title: "Tournaments",
    desc: "Single elimination or round-robin brackets for your mooting society. Track results through live brackets and advance through rounds.",
    tag: "COMPETITIVE",
  },
  {
    Icon: Search,
    title: "Legal Research Engine",
    desc: "Search every UK statute and court judgment in one place. OSCOLA citations, filter by court, year, or judge. Direct links to official sources.",
    tag: "OFFICIAL SOURCES",
  },
  {
    Icon: Wrench,
    title: "AI Tools Suite",
    desc: "Case brief generator, argument builder, and personalised learning paths. AI tools purpose-built for legal advocacy preparation.",
    tag: "AI-POWERED",
  },
  {
    Icon: Target,
    title: "SQE2 Preparation",
    desc: "Timed advocacy assessments scored against SRA competency standards. Premium access vs traditional prep courses.",
    tag: "SRA-ALIGNED",
  },
  {
    Icon: BarChart3,
    title: "Advocacy Portfolio",
    desc: "Every session auto-generates scored evidence. Export a branded PDF for training contract and pupillage applications.",
    tag: "AUTO-GENERATED",
  },
  {
    Icon: Trophy,
    title: "National League",
    desc: "Join a Chamber. Compete in national rankings. Rise from Pupil to King's Counsel. Your university vs everyone.",
    tag: "130+ UNIVERSITIES",
  },
  {
    Icon: Landmark,
    title: "Parliament",
    desc: "Propose and debate motions that shape platform policy. Every verified Advocate has a vote. Standing orders ensure fair procedure.",
    tag: "DEMOCRATIC",
  },
  {
    Icon: Gavel,
    title: "Tribunal",
    desc: "Resolve disputes through structured judicial procedure. File cases, exchange submissions, and receive binding judgments.",
    tag: "GOVERNANCE",
  },
  {
    Icon: Users,
    title: "Advocate Network",
    desc: "Follow rising stars, commend performances, discover advocates from every UK law school. Your professional network starts here.",
    tag: "SOCIAL",
  },
];

export function FeaturesGrid() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      {/* Section heading */}
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-3">
        Everything You Need
      </h2>
      <p className="text-court-base text-court-text-sec text-center max-w-lg mx-auto mb-10">
        Advocacy training, legal research, moot organisation,
        competitive tournaments, and democratic governance. All in one
        platform, built for UK law students.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-navy-card border border-court-border-light rounded-court p-3 md:p-4 hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <f.Icon size={24} className="text-gold" />
              <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
                {f.tag}
              </span>
            </div>
            <h3 className="font-serif text-base font-bold text-court-text mb-1.5">
              {f.title}
            </h3>
            <p className="text-court-base text-court-text-sec leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

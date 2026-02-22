"use client";

import { motion } from "framer-motion";
import { Bot, Scale, Target, BarChart3, Trophy, Users, Search } from "lucide-react";
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
    Icon: Scale,
    title: "Moot Organisation",
    desc: "Create sessions, claim courtroom roles, invite your cohort. Real-time role claiming so no one double-books.",
    tag: "REAL-TIME",
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
    Icon: Users,
    title: "Advocate Network",
    desc: "Follow rising stars, commend performances, discover advocates from every UK law school. Your professional network starts here.",
    tag: "SOCIAL",
  },
  {
    Icon: Search,
    title: "Legal Research",
    desc: "Search every UK statute and court judgment in one place. OSCOLA citations, direct links to legislation.gov.uk and Find Case Law.",
    tag: "OFFICIAL SOURCES",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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

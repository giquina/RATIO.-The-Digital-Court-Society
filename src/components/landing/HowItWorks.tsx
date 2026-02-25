"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Mic, Video, Search, FolderOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEPS: {
  step: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
}[] = [
  {
    step: "01",
    title: "Verify your identity",
    desc: "Create your account in seconds. Students select their university, professionals choose their role. Everyone joins a Chamber.",
    Icon: ShieldCheck,
  },
  {
    step: "02",
    title: "Join your Chamber",
    desc: "Select your university, year, modules, and Chamber. Your Chamber is your team for national rankings, tournaments, and inter-university competition.",
    Icon: Users,
  },
  {
    step: "03",
    title: "Research and prepare",
    desc: "Search UK statutes and case law through the Research Engine. Use the Case Brief Generator and Argument Builder to prepare your submissions.",
    Icon: Search,
  },
  {
    step: "04",
    title: "Moot live or with AI",
    desc: "Join a live video session with real participants, or face an AI High Court judge solo. Both modes score your performance across 7 advocacy dimensions.",
    Icon: Video,
  },
  {
    step: "05",
    title: "Compete and govern",
    desc: "Enter tournaments, climb the national league, propose motions in Parliament, and resolve disputes through the Tribunal. This is your society to shape.",
    Icon: Mic,
  },
  {
    step: "06",
    title: "Build your portfolio",
    desc: "Every session auto-generates scored evidence. Export a branded advocacy portfolio for training contract and pupillage applications.",
    Icon: FolderOpen,
  },
];

export function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-2xl mx-auto"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-10">
        How Ratio Works
      </h2>
      <div className="flex flex-col gap-6">
        {STEPS.map((s) => (
          <div key={s.step} className="flex gap-5 items-start">
            <div className="w-10 h-10 rounded-court bg-gold-dim border border-gold/25 flex items-center justify-center shrink-0">
              <span className="font-serif text-court-base font-bold text-gold">
                {s.step}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <s.Icon size={16} className="text-gold" />
                <h3 className="text-court-md font-bold text-court-text">
                  {s.title}
                </h3>
              </div>
              <p className="text-court-base text-court-text-sec leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

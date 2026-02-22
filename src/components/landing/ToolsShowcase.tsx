"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wrench,
  FileText,
  Scale,
  Target,
  Search,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

const TOOLS = [
  {
    Icon: FileText,
    title: "Case Brief Generator",
    desc: "Paste a case and generate a structured brief with facts, issues, ratio decidendi, and application notes. OSCOLA-formatted output ready for moot preparation.",
    accentColor: "#4A8FE7",
  },
  {
    Icon: Scale,
    title: "Argument Builder",
    desc: "Input your skeleton argument and let AI identify logical weaknesses, missing authorities, and suggest counter-arguments to strengthen your case.",
    accentColor: "#4CAF50",
  },
  {
    Icon: Search,
    title: "Legal Research Engine",
    desc: "Search every UK statute and court judgment in one place. Filter by court, year, judge, or party. OSCOLA citations and direct links to official sources.",
    accentColor: "#C9A84C",
  },
  {
    Icon: Target,
    title: "Learning Path",
    desc: "Personalised study recommendations based on your advocacy data. Focus on your weakest dimensions with tailored exercises and targeted practice.",
    accentColor: "#E97451",
  },
];

export function ToolsShowcase({ id }: { id?: string }) {
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
          <Wrench size={20} className="text-gold" />
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
            AI-POWERED SUITE
          </span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
          Advocacy Tools
        </h2>
        <p className="text-court-base text-court-text-sec max-w-lg mx-auto">
          A suite of AI tools purpose-built for legal practice. Generate
          case briefs, stress-test your arguments, research authorities,
          and track your development as an Advocate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {TOOLS.map((tool) => (
          <div
            key={tool.title}
            className="bg-navy-card border border-court-border-light rounded-court p-4 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${tool.accentColor}15` }}
              >
                <tool.Icon size={18} style={{ color: tool.accentColor }} />
              </div>
              <h3 className="font-serif text-base font-bold text-court-text">
                {tool.title}
              </h3>
            </div>
            <p className="text-court-sm text-court-text-sec leading-relaxed">
              {tool.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Research engine preview */}
      <div className="mt-4 bg-navy-card border border-court-border-light rounded-court p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search size={16} className="text-gold" />
          <span className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter">
            RESEARCH ENGINE PREVIEW
          </span>
        </div>

        {/* Mock search bar */}
        <div className="bg-navy border border-court-border rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          <Search size={16} className="text-court-text-ter" />
          <span className="text-court-sm text-court-text-sec">
            Donoghue v Stevenson
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-court-xs text-court-text-ter bg-white/[0.03] border border-court-border-light rounded px-2 py-0.5">
              Case Law
            </span>
            <span className="text-court-xs text-court-text-ter bg-white/[0.03] border border-court-border-light rounded px-2 py-0.5">
              Legislation
            </span>
          </div>
        </div>

        {/* Mock results */}
        <div className="space-y-2">
          {[
            {
              title: "Donoghue v Stevenson [1932] AC 562",
              court: "House of Lords",
              citation: "[1932] AC 562",
              source: "Find Case Law",
            },
            {
              title: "Consumer Rights Act 2015",
              court: "UK Parliament",
              citation: "c.15",
              source: "legislation.gov.uk",
            },
          ].map((r) => (
            <div
              key={r.title}
              className="bg-navy border border-court-border rounded-lg px-3 py-2.5 flex items-start justify-between gap-3"
            >
              <div>
                <p className="text-court-sm font-bold text-court-text">
                  {r.title}
                </p>
                <p className="text-court-xs text-court-text-ter">
                  {r.court} &middot; {r.source}
                </p>
              </div>
              <span className="text-court-xs text-gold bg-gold-dim rounded px-1.5 py-0.5 shrink-0">
                OSCOLA
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

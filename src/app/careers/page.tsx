"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase, GraduationCap, Code2, Palette, Users, Megaphone,
  Scale, ArrowRight, Building2, Landmark, Clock, MapPin,
  CheckCircle2, ChevronDown, Mail, Sparkles, BookOpen,
  TrendingUp, Rocket, Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Tag } from "@/components/ui";
import { CareerApplicationForm } from "./CareerApplicationForm";

// ── Position data ──

type RoleType = "part-time" | "apprenticeship" | "fellowship" | "advisory" | "equity";

interface Position {
  title: string;
  type: RoleType;
  category: "growth" | "content" | "engineering" | "design" | "strategic";
  status: "open" | "coming-soon" | "expressions";
  hours?: string;
  compensation: string;
  description: string;
  responsibilities: string[];
}

const TYPE_LABELS: Record<RoleType, { label: string; color: "gold" | "green" | "blue" | "burgundy" | "orange" }> = {
  "part-time": { label: "Part-time", color: "gold" },
  apprenticeship: { label: "Apprenticeship", color: "green" },
  fellowship: { label: "Fellowship", color: "blue" },
  advisory: { label: "Advisory Board", color: "burgundy" },
  equity: { label: "Co-founder (Equity)", color: "orange" },
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  "coming-soon": "Coming Soon",
  expressions: "Expressions of Interest",
};

const POSITIONS: Position[] = [
  {
    title: "Law Society Outreach & Partnerships",
    type: "part-time",
    category: "growth",
    status: "open",
    hours: "10-15 hrs/week",
    compensation: "\u00A312-15/hr + free Premium+",
    description: "Build relationships with moot societies, law faculties, and student bar associations across UK universities. Coordinate advocacy events and bring RATIO into the places where law students already gather.",
    responsibilities: [
      "Build relationships with moot societies and law faculties at UK universities",
      "Coordinate advocacy events, moot demonstrations, and law society partnerships",
      "Manage the Ambassador Programme — recruit, support, and track law student advocates",
      "Represent RATIO at law fairs, mooting competitions, and student bar events",
    ],
  },
  {
    title: "Case Research & Moot Scenario Writer",
    type: "part-time",
    category: "content",
    status: "open",
    hours: "10-15 hrs/week",
    compensation: "\u00A312-15/hr + free Premium+",
    description: "Research and draft moot problems grounded in real case law. Curate case summaries for the Law Book, write model skeleton arguments, and ensure AI Judge responses are legally accurate.",
    responsibilities: [
      "Research case law and draft moot problems across constitutional, criminal, and commercial law",
      "Write case summaries and legal commentary for the Law Book encyclopedia",
      "Draft model skeleton arguments and authorities bundles for practice scenarios",
      "Review AI Judge responses for legal accuracy and pedagogical quality",
    ],
  },
  {
    title: "Advocacy Community Lead",
    type: "apprenticeship",
    category: "growth",
    status: "open",
    hours: "Full-time (L3 Content Creator)",
    compensation: "\u00A311-13k/yr \u2014 training costs: \u00A30 (government-funded)",
    description: "Lead RATIO\u2019s advocate community — coordinate mooting discussions, share legal content, highlight standout performances, and help law students get the most from the platform.",
    responsibilities: [
      "Manage the advocate community across social channels and the in-app feed",
      "Create content around mooting tips, case law highlights, and advocacy techniques",
      "Coordinate with law society ambassadors on outreach and engagement",
      "Surface standout advocate performances and foster competitive mooting culture",
    ],
  },
  {
    title: "Legal Tech Developer",
    type: "part-time",
    category: "engineering",
    status: "open",
    hours: "Placement year or L4 Apprenticeship",
    compensation: "\u00A318-22k/yr (placement) or \u00A312-15k/yr (apprenticeship)",
    description: "Build and maintain the technology behind RATIO\u2019s AI courtroom, moot scoring, case law search engine, and legal research tools. Legal tech experience that stands out on any training contract or pupillage application.",
    responsibilities: [
      "Implement features for AI practice sessions, moot scoring, and legal research tools",
      "Build and improve the case law search engine and Law Book interface",
      "Write tests for critical advocacy and courtroom session flows",
      "Work on the legal research API integrations (case law, legislation, parliament)",
    ],
  },
  {
    title: "Legal UX Researcher",
    type: "part-time",
    category: "design",
    status: "coming-soon",
    hours: "8-12 hrs/week",
    compensation: "\u00A312-15/hr + free Premium+",
    description: "Test how law students interact with AI courtroom sessions, moot preparation tools, and legal research features. Identify where the advocacy experience breaks down and recommend improvements.",
    responsibilities: [
      "Run user testing sessions with law students during AI practice and moot preparation",
      "Map the advocate journey from case brief to oral submission to written feedback",
      "Analyse session data to identify where advocacy preparation breaks down",
      "Write UX reports with recommendations grounded in how law students actually work",
    ],
  },
  {
    title: "Legal Communications & Design",
    type: "apprenticeship",
    category: "design",
    status: "coming-soon",
    hours: "Full-time (L3 Multi-Channel Marketer)",
    compensation: "\u00A311-13k/yr \u2014 training costs: \u00A30 (government-funded)",
    description: "Design materials that communicate RATIO\u2019s legal mission — moot event graphics, case law visual summaries, law society pitch decks, and ambassador resources. Maintain the institutional tone across all touchpoints.",
    responsibilities: [
      "Design moot event graphics, case law visual summaries, and advocacy guides",
      "Create law society pitch decks and partnership materials",
      "Maintain RATIO\u2019s institutional brand across all legal communications",
      "Produce visual content for mooting tips, legal explainers, and advocate spotlights",
    ],
  },
  {
    title: "Legal Education Advisor",
    type: "advisory",
    category: "strategic",
    status: "expressions",
    compensation: "Equity option (0.5-1%) + named on website",
    description: "Review moot scenarios for pedagogical quality. Advise on SQE2 alignment and Bar course compatibility. Provide endorsement for university outreach.",
    responsibilities: [
      "Review moot scenarios for pedagogical quality and legal accuracy",
      "Advise on SQE2 alignment and Bar course compatibility",
      "Provide testimonial/endorsement for university and chambers outreach",
      "Attend 1-2 advisory board meetings per term",
    ],
  },
  {
    title: "Head of Product",
    type: "equity",
    category: "strategic",
    status: "expressions",
    compensation: "5-15% equity (vesting 3-4 years)",
    description: "Own the product roadmap for a legal education platform used across 142 UK universities. Prioritise features that improve advocacy training, moot preparation, and legal research.",
    responsibilities: [
      "Own the product roadmap and feature prioritisation for advocacy tools",
      "Run sprint planning and coordinate across legal content, engineering, and design",
      "Manage advocate feedback into a prioritised backlog of improvements",
      "Represent RATIO at legal tech events, demo days, and accelerator programmes",
    ],
  },
];

// ── Fellowship tracks ──

interface FellowshipTrack {
  title: string;
  Icon: LucideIcon;
  audience: string;
  description: string;
}

const FELLOWSHIP_TRACKS: FellowshipTrack[] = [
  {
    title: "Case Research & Legal Writing",
    Icon: BookOpen,
    audience: "Law students",
    description: "Draft moot problems, research case law, write legal commentary for the Law Book.",
  },
  {
    title: "Law Society Outreach",
    Icon: TrendingUp,
    audience: "Law / Business students",
    description: "Build partnerships with moot societies, coordinate advocacy events, run law fair demos.",
  },
  {
    title: "Legal Tech Engineering",
    Icon: Code2,
    audience: "CS / Engineering students",
    description: "Build courtroom simulation features, legal research tools, and moot scoring systems.",
  },
  {
    title: "Legal UX & Design",
    Icon: Palette,
    audience: "Design / HCI students",
    description: "Research how law students prepare for advocacy and design better legal tools.",
  },
  {
    title: "Advocacy Community",
    Icon: Megaphone,
    audience: "Law / Media students",
    description: "Lead the advocate community, share mooting content, spotlight standout performers.",
  },
];

// ── Why RATIO cards ──

const WHY_RATIO = [
  {
    Icon: Scale,
    title: "Real Legal Work",
    description: "Draft moot problems, research case law, build courtroom tools. Work that matters on a pupillage or training contract application.",
  },
  {
    Icon: GraduationCap,
    title: "Built Around Your Degree",
    description: "Part-time, flexible, remote. Designed for law students with lectures, moots, and exams to manage.",
  },
  {
    Icon: Landmark,
    title: "Legal Tech on Your CV",
    description: "Experience building advocacy tools used across 142 UK universities. Stands out at every interview.",
  },
  {
    Icon: Rocket,
    title: "Substantive From Day One",
    description: "No coffee runs. No filing. You work on case scenarios, legal research tools, and courtroom simulations.",
  },
];

// ── FAQ ──

const FAQ = [
  {
    q: "Do I need to be a law student?",
    a: "For most roles, yes. Case research, moot writing, law society outreach, and advocacy community roles require legal knowledge. Legal tech and legal UX roles are open to students from other disciplines, but an interest in law is expected.",
  },
  {
    q: "Are the apprenticeships really free to train?",
    a: "Yes. Under current UK government rules, SMEs hiring apprentices under 25 have 100% of training costs covered. RATIO only pays the salary. The training provider handles all qualification delivery.",
  },
  {
    q: "What is the RATIO Legal Tech Fellowship?",
    a: "A structured 3-6 month programme where university students contribute 8-12 hours per week to a specific area of RATIO. Fellows get real startup experience, a reference letter, and named credit on the website.",
  },
  {
    q: "Can I work remotely?",
    a: "All roles are remote-first (UK-based). Some positions may involve occasional in-person events at universities, but day-to-day work is fully remote.",
  },
  {
    q: "How formal is the interview process?",
    a: "Not very. We do a casual video call to understand your interests and what you would bring. No whiteboard interviews, no trick questions. Show up, be yourself, and tell us what excites you.",
  },
];

// ── Category filter ──

const CATEGORIES = [
  { key: "all", label: "All Roles" },
  { key: "growth", label: "Outreach" },
  { key: "content", label: "Legal Content" },
  { key: "engineering", label: "Legal Tech" },
  { key: "design", label: "Legal UX & Design" },
  { key: "strategic", label: "Strategic" },
];

// ── Page ──

export default function CareersPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [applyingFor, setApplyingFor] = useState<Position | null>(null);

  const filtered = activeCategory === "all"
    ? POSITIONS
    : POSITIONS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0B1120] overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.06),transparent_60%)]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(107,45,62,0.06),transparent_60%)]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-4 md:px-6 lg:px-8 pt-3 pb-4 max-w-4xl mx-auto">
        <Link href="/" className="font-serif text-lg font-bold tracking-[0.12em] text-white">
          RATIO<span className="text-[#C9A84C]">.</span>
        </Link>
        <Link
          href="/login"
          className="text-sm text-gray-400 font-semibold px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all"
        >
          Sign In
        </Link>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        {/* ── 1. Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 md:py-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full px-4 py-1.5 mb-6">
            <Briefcase size={14} className="text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-bold tracking-[0.1em] uppercase">Careers at RATIO</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Work on the Future of<br />Advocacy Training
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            RATIO is a constitutional advocacy platform used across 142 UK universities —
            AI judges, moot courts, national rankings, and a legal research engine.
            We are hiring law students for roles where the work is substantive and legal.
          </p>
          <p className="text-[#C9A84C] text-sm font-semibold mt-4">
            13 opportunities across 8 roles and 5 fellowship tracks
          </p>
        </motion.section>

        {/* ── 2. Why RATIO ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-5 text-center">Why RATIO</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WHY_RATIO.map((item) => (
              <div key={item.title} className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-3">
                  <item.Icon size={22} className="text-[#C9A84C]" />
                </div>
                <h3 className="text-white font-bold text-court-base mb-1">{item.title}</h3>
                <p className="text-gray-400 text-court-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 3. Open Positions ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
          id="positions"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-2 text-center">Open Positions</h2>
          <p className="text-gray-400 text-court-sm text-center mb-6">
            All roles are remote (UK-based). Click a role to learn more.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg text-court-sm font-semibold transition-all ${
                  activeCategory === cat.key
                    ? "bg-[#C9A84C] text-[#0B1120]"
                    : "bg-white/[0.06] text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Position cards */}
          <div className="space-y-3">
            {filtered.map((pos) => {
              const typeInfo = TYPE_LABELS[pos.type];
              const isExpanded = expandedRole === pos.title;
              return (
                <div
                  key={pos.title}
                  className={`rounded-xl overflow-hidden transition-all ${
                    pos.status === "coming-soon"
                      ? "bg-white/[0.02] border border-white/[0.06] opacity-75"
                      : "bg-white/[0.04] border border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setExpandedRole(isExpanded ? null : pos.title)}
                    className="w-full text-left p-5 flex items-start gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-white font-bold text-court-base">{pos.title}</h3>
                        <Tag color={typeInfo.color} small>{typeInfo.label}</Tag>
                        {pos.status === "coming-soon" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-court-xs font-semibold">
                            <Clock size={10} /> Coming Soon
                          </span>
                        )}
                        {pos.status === "expressions" && (
                          <span className="text-court-xs text-gray-500 italic">{STATUS_LABELS[pos.status]}</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-court-sm leading-relaxed line-clamp-2">{pos.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-court-xs text-gray-500">
                        {pos.hours && (
                          <span className="flex items-center gap-1"><Clock size={12} /> {pos.hours}</span>
                        )}
                        <span className="flex items-center gap-1"><MapPin size={12} /> Remote (UK)</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-gray-500 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <p className="text-court-xs text-gray-500 uppercase font-bold tracking-wider mb-2">What you will do</p>
                      <div className="space-y-2 mb-4">
                        {pos.responsibilities.map((r, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 size={14} className="text-[#C9A84C] shrink-0 mt-0.5" />
                            <p className="text-gray-300 text-court-sm leading-relaxed">{r}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-court-sm">
                        <span className="text-gray-400">
                          <span className="text-gray-500 font-bold">Compensation:</span> {pos.compensation}
                        </span>
                      </div>
                      {pos.status === "coming-soon" ? (
                        <button
                          disabled
                          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white/[0.06] text-gray-500 font-bold rounded-xl cursor-not-allowed text-court-sm"
                        >
                          <Clock size={14} /> Applications Opening Soon
                        </button>
                      ) : (
                        <button
                          onClick={() => setApplyingFor(pos)}
                          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl hover:bg-[#C9A84C]/90 transition-colors text-court-sm"
                        >
                          <Mail size={14} /> Apply Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 4. RATIO Legal Tech Fellowship ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
          id="fellowship"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full px-4 py-1.5 mb-4">
              <GraduationCap size={14} className="text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-bold tracking-[0.1em] uppercase">Fellowship Programme</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-white mb-2">RATIO Legal Tech Fellowship</h2>
            <p className="text-gray-400 text-court-sm max-w-lg mx-auto leading-relaxed">
              A structured 3-6 month programme for university students who want hands-on experience
              building a legal tech startup. 8-12 hours per week alongside your studies.
            </p>
          </div>

          {/* Track cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {FELLOWSHIP_TRACKS.map((track) => (
              <div key={track.title} className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-3">
                  <track.Icon size={20} className="text-[#C9A84C]" />
                </div>
                <h3 className="text-white font-bold text-court-base mb-0.5">{track.title}</h3>
                <p className="text-[#C9A84C] text-court-xs font-semibold mb-1.5">{track.audience}</p>
                <p className="text-gray-400 text-court-sm leading-relaxed">{track.description}</p>
              </div>
            ))}
          </div>

          {/* What fellows get */}
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
            <h3 className="text-white font-bold text-court-base mb-3">What Fellows Receive</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Real startup experience for your CV",
                "Reference letter from the Founder",
                "Free Premium+ access throughout",
                "Named credit on the RATIO website",
                "Certificate of Participation in Legal Innovation",
                "Priority for paid roles as RATIO grows",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#C9A84C] shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-court-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── 5. Apprenticeships ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
          id="apprenticeships"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-2 text-center">UK Apprenticeships at RATIO</h2>
          <p className="text-gray-400 text-court-sm text-center mb-6 max-w-lg mx-auto leading-relaxed">
            Under current UK government rules, SMEs hiring apprentices under 25 have 100% of
            training costs covered. RATIO pays only the salary — the government funds the rest.
          </p>
          <div className="bg-white/[0.04] border border-[#C9A84C]/20 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-court-base">Government-Funded Training</h3>
                <p className="text-gray-400 text-court-sm leading-relaxed mt-1">
                  Apprentices earn a recognised qualification while working on real features used by
                  thousands of law students. Training is delivered by an approved provider — at no cost
                  to you or RATIO.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { standard: "L3 Content Creator", duration: "12-18 months", role: "Advocacy Community Lead" },
                { standard: "L3 Multi-Channel Marketer", duration: "15-18 months", role: "Legal Communications & Design" },
                { standard: "L4 Software Developer", duration: "24 months", role: "Legal Tech Developer" },
              ].map((item) => (
                <div key={item.standard} className="bg-white/[0.04] border border-white/10 rounded-lg p-3.5 text-center">
                  <p className="text-[#C9A84C] text-court-xs font-bold mb-0.5">{item.standard}</p>
                  <p className="text-white text-court-sm font-semibold">{item.role}</p>
                  <p className="text-gray-500 text-court-xs mt-1">{item.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── 6. Application Process ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-5 text-center">How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { step: "1", Icon: Mail, title: "Apply", desc: "Click Apply Now on any role, fill in the form, and upload your CV." },
              { step: "2", Icon: Users, title: "Chat", desc: "A casual video call — no formal interview pressure. Tell us what excites you." },
              { step: "3", Icon: Rocket, title: "Start", desc: "Begin contributing within a week. Real work from day one." },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.04] border border-white/10 rounded-xl p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-3">
                  <item.Icon size={18} className="text-[#C9A84C]" />
                </div>
                <div className="text-[#C9A84C] text-court-xs font-bold mb-1">Step {item.step}</div>
                <h3 className="text-white font-bold text-court-base mb-1">{item.title}</h3>
                <p className="text-gray-400 text-court-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-court-sm mt-5 italic">
            We do not care about your degree classification. We care about your enthusiasm,
            your ideas, and whether you show up.
          </p>
        </motion.section>

        {/* ── 7. FAQ ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-5 text-center">Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
                <p className="text-white font-semibold text-court-base mb-1.5">{item.q}</p>
                <p className="text-gray-400 text-court-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gray-400 text-court-sm mb-4">
            Do not see a role that fits? Tell us what you would bring.
          </p>
          <button
            onClick={() => setApplyingFor({
              title: "General Application",
              type: "part-time",
              category: "growth",
              status: "open",
              compensation: "",
              description: "",
              responsibilities: [],
            } as any)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl hover:bg-[#C9A84C]/90 transition-colors text-court-sm"
          >
            <Mail size={16} /> Send a General Application
          </button>
        </motion.section>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-6">
          <p className="text-xs text-gray-500">
            &copy; 2026 RATIO — The Digital Court Society &middot;{" "}
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link> &middot;{" "}
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link> &middot;{" "}
            <Link href="/ambassadors" className="hover:text-gray-400 transition-colors">Ambassadors</Link>
          </p>
        </div>
      </div>

      {/* Application Modal */}
      {applyingFor && (
        <CareerApplicationForm
          position={applyingFor}
          onClose={() => setApplyingFor(null)}
        />
      )}
    </div>
  );
}

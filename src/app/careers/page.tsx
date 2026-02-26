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
    title: "Head of Growth & University Partnerships",
    type: "part-time",
    category: "growth",
    status: "open",
    hours: "10-15 hrs/week",
    compensation: "\u00A312-15/hr + free Premium+",
    description: "Build relationships with moot societies and law faculties across UK universities. Own the ambassador programme, coordinate launch events, and track sign-up funnels.",
    responsibilities: [
      "Build relationships with moot societies and law faculties at UK universities",
      "Coordinate the Ambassador Programme — onboard, support, and track activity",
      "Organise launch events, demo sessions, and moot society partnerships",
      "Track sign-up funnels and conversion metrics",
    ],
  },
  {
    title: "Content & Moot Scenario Lead",
    type: "part-time",
    category: "content",
    status: "open",
    hours: "10-15 hrs/week",
    compensation: "\u00A312-15/hr + free Premium+",
    description: "Write moot problems, curate case summaries for the Law Book, and draft model skeleton arguments. Work with the AI system to ensure legally accurate judge responses.",
    responsibilities: [
      "Write moot problems across all major law modules",
      "Create and curate case summaries for the Law Book encyclopedia",
      "Draft skeleton arguments and model answers for practice materials",
      "Ensure AI Judge responses are legally accurate and pedagogically useful",
    ],
  },
  {
    title: "Community & Social Media Manager",
    type: "apprenticeship",
    category: "growth",
    status: "open",
    hours: "Full-time (L3 Content Creator)",
    compensation: "\u00A311-13k/yr \u2014 training costs: \u00A30 (government-funded)",
    description: "Manage RATIO\u2019s social presence across Instagram, TikTok, LinkedIn, and X. Create short-form content, engage with the in-app social feed, and coordinate ambassadors.",
    responsibilities: [
      "Manage social media accounts — Instagram, TikTok, LinkedIn, X",
      "Create short-form content: moot tips, legal humour, behind-the-scenes",
      "Monitor and engage with the in-app social feed",
      "Coordinate with ambassadors on content creation and sharing",
    ],
  },
  {
    title: "Junior Full-Stack Developer",
    type: "part-time",
    category: "engineering",
    status: "open",
    hours: "Placement year or L4 Apprenticeship",
    compensation: "\u00A318-22k/yr (placement) or \u00A312-15k/yr (apprenticeship)",
    description: "Fix bugs, implement features, and write tests for RATIO\u2019s Next.js + Convex codebase. Eventually take ownership of specific features like tournaments or the research engine.",
    responsibilities: [
      "Fix bugs and implement features from the feedback queue",
      "Write and maintain tests for critical flows",
      "Help with Vercel deployments and monitoring",
      "Build out mobile responsiveness improvements",
    ],
  },
  {
    title: "UX Researcher & Product Tester",
    type: "part-time",
    category: "design",
    status: "coming-soon",
    hours: "8-12 hrs/week",
    compensation: "\u00A312-15/hr + free Premium+",
    description: "Run user testing sessions with law students. Create journey maps, analyse session data, and write monthly UX reports with prioritised improvement recommendations.",
    responsibilities: [
      "Run user testing sessions with law students (screen + audio)",
      "Create user journey maps for key flows",
      "Analyse session data to spot drop-off points",
      "Write monthly UX reports with prioritised recommendations",
    ],
  },
  {
    title: "Marketing & Design Apprentice",
    type: "apprenticeship",
    category: "design",
    status: "coming-soon",
    hours: "Full-time (L3 Multi-Channel Marketer)",
    compensation: "\u00A311-13k/yr \u2014 training costs: \u00A30 (government-funded)",
    description: "Create marketing materials, social media graphics, email templates, event posters, and ambassador welcome packs. Maintain brand consistency across all touchpoints.",
    responsibilities: [
      "Create marketing materials and social media graphics",
      "Help design pitch decks for university partnerships",
      "Maintain brand consistency across all touchpoints",
      "Support the Community Manager with visual content",
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
      "Provide testimonial/endorsement for university outreach",
      "Attend 1-2 advisory board meetings per term",
    ],
  },
  {
    title: "Head of Product",
    type: "equity",
    category: "strategic",
    status: "expressions",
    compensation: "5-15% equity (vesting 3-4 years)",
    description: "Own the product roadmap and feature prioritisation. Run sprint planning, manage the feedback pipeline, and represent RATIO at startup events and demo days.",
    responsibilities: [
      "Own the product roadmap and feature prioritisation",
      "Run sprint planning and coordinate across team members",
      "Manage the feedback pipeline into a prioritised backlog",
      "Handle investor/accelerator applications and pitch preparation",
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
    title: "Advocacy Content",
    Icon: BookOpen,
    audience: "Law students",
    description: "Write moot problems, case summaries, and educational materials.",
  },
  {
    title: "Growth & Outreach",
    Icon: TrendingUp,
    audience: "Business / Marketing students",
    description: "University partnerships, ambassador coordination, event planning.",
  },
  {
    title: "Product & Engineering",
    Icon: Code2,
    audience: "CS / Engineering students",
    description: "Bug fixes, feature development, testing on a real production codebase.",
  },
  {
    title: "Design & UX",
    Icon: Palette,
    audience: "Design / HCI students",
    description: "User research, interface improvements, marketing design.",
  },
  {
    title: "Community & Media",
    Icon: Megaphone,
    audience: "Media / Marketing students",
    description: "Social media, content creation, community management.",
  },
];

// ── Why RATIO cards ──

const WHY_RATIO = [
  {
    Icon: Rocket,
    title: "Real Impact",
    description: "Your work ships to thousands of law students across 142 UK universities. No hypothetical projects.",
  },
  {
    Icon: GraduationCap,
    title: "Student-Friendly",
    description: "Part-time, flexible, built around your studies. No 9-to-5 commitment required.",
  },
  {
    Icon: Scale,
    title: "Legal Tech Experience",
    description: "Gold dust for pupillage, training contracts, and graduate scheme applications.",
  },
  {
    Icon: Sparkles,
    title: "Startup Energy",
    description: "No bureaucracy, no pointless meetings. Just building something that matters.",
  },
];

// ── FAQ ──

const FAQ = [
  {
    q: "Do I need to be a law student?",
    a: "Not for every role. Engineering, design, marketing, and community roles are open to students from any discipline. Content and advisory roles benefit from legal knowledge.",
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
  { key: "growth", label: "Growth" },
  { key: "content", label: "Content" },
  { key: "engineering", label: "Engineering" },
  { key: "design", label: "Design" },
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
            Build the Future of<br />Legal Education
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            RATIO is a student-built legal tech platform used across 142 UK universities.
            We are looking for ambitious people to help us grow. No corporate speak,
            no impossible requirements — just real work on a real product.
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
                  className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedRole(isExpanded ? null : pos.title)}
                    className="w-full text-left p-5 flex items-start gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-white font-bold text-court-base">{pos.title}</h3>
                        <Tag color={typeInfo.color} small>{typeInfo.label}</Tag>
                        {pos.status !== "open" && (
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
                      <button
                        onClick={() => setApplyingFor(pos)}
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl hover:bg-[#C9A84C]/90 transition-colors text-court-sm"
                      >
                        <Mail size={14} /> Apply Now
                      </button>
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
                { standard: "L3 Content Creator", duration: "12-18 months", role: "Community & Social" },
                { standard: "L3 Multi-Channel Marketer", duration: "15-18 months", role: "Marketing & Design" },
                { standard: "L4 Software Developer", duration: "24 months", role: "Junior Developer" },
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

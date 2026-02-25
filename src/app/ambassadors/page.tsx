"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Scale, Users, Award, Star, Megaphone, MessageSquare,
  Gift, FileText, Zap, CheckCircle2, Send, ArrowRight,
  GraduationCap, Globe, Trophy, Heart,
} from "lucide-react";
import { QuerySafeBoundary } from "@/components/shared/QuerySafeBoundary";

const BENEFITS = [
  {
    icon: <Gift size={22} className="text-[#C9A84C]" />,
    title: "Free Premium+ Access",
    description: "Full platform access including all AI personas, analytics, and tools — worth £95/year.",
  },
  {
    icon: <Award size={22} className="text-[#C9A84C]" />,
    title: "All Certificates Included",
    description: "Foundation, Intermediate, and Advanced certificates at no cost — worth £129+.",
  },
  {
    icon: <FileText size={22} className="text-[#C9A84C]" />,
    title: "Letter of Recommendation",
    description: "A personalised reference from the Founder for pupillage, training contracts, and job applications.",
  },
  {
    icon: <Star size={22} className="text-[#C9A84C]" />,
    title: "Featured on RATIO",
    description: "Your name, university, and photo featured on the official RATIO Ambassadors page.",
  },
  {
    icon: <Zap size={22} className="text-[#C9A84C]" />,
    title: "Early Access",
    description: "Be the first to test new features and shape the platform's direction with direct feedback.",
  },
  {
    icon: <Trophy size={22} className="text-[#C9A84C]" />,
    title: "Exclusive Events",
    description: "Invitation to the annual RATIO Inter-University Moot and ambassador networking events.",
  },
];

const WHAT_YOU_DO = [
  "Promote RATIO within your moot society and law community",
  "Organise moot sessions or tournaments using the platform",
  "Share your RATIO experience on social media",
  "Provide feedback to help shape new features",
  "Welcome new members and help them get started",
];

const FAQ = [
  {
    q: "Do I need to be part of a moot society?",
    a: "No — any law student who is passionate about advocacy and wants to help fellow students improve can apply. Being part of a society is a bonus, not a requirement.",
  },
  {
    q: "Is this a paid role?",
    a: "It's not paid in cash, but you receive free Premium+ access (worth £95/year), all certificates included, a letter of recommendation, and career-boosting visibility.",
  },
  {
    q: "How much time does it take?",
    a: "As much or as little as you want. Some ambassadors share one post a month; others organise weekly sessions. There's no minimum commitment.",
  },
  {
    q: "How are ambassadors selected?",
    a: "Applications are reviewed personally by our Founder. We look for enthusiasm, campus involvement, and genuine passion for advocacy development.",
  },
];

function ApplicationForm() {
  const [form, setForm] = useState({
    fullName: "", email: "", university: "",
    societyRole: "", country: "", motivation: "", socialLinks: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const submitApplication = useMutation(anyApi.certificates.submitAmbassadorApplication);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.email || !form.university || !form.motivation) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      await submitApplication({
        fullName: form.fullName,
        email: form.email,
        university: form.university,
        societyRole: form.societyRole || undefined,
        country: form.country || undefined,
        motivation: form.motivation,
        socialLinks: form.socialLinks || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/[0.04] border border-[#C9A84C]/30 rounded-2xl p-8 text-center">
        <CheckCircle2 size={40} className="text-green-400 mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
          Thank you for your interest in becoming a RATIO Ambassador. We review every application personally
          and will get back to you within 7 days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Full Name *</label>
          <input
            type="text" value={form.fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, fullName: e.target.value })}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Email *</label>
          <input
            type="email" value={form.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
            placeholder="your@university.ac.uk"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">University *</label>
          <input
            type="text" value={form.university} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, university: e.target.value })}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
            placeholder="e.g. University of Manchester"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">Society / Role</label>
          <input
            type="text" value={form.societyRole} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, societyRole: e.target.value })}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
            placeholder="e.g. Moot Society President"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">Why do you want to be a RATIO Ambassador? *</label>
        <textarea
          value={form.motivation} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, motivation: e.target.value })}
          rows={4}
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C]/50 focus:outline-none transition-colors resize-none"
          placeholder="Tell us about your passion for advocacy, your involvement in your university's legal community, and how you'd promote RATIO…"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">Social Media Links (optional)</label>
        <input
          type="text" value={form.socialLinks} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, socialLinks: e.target.value })}
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
          placeholder="Instagram, LinkedIn, etc."
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl hover:bg-[#C9A84C]/90 transition-colors text-sm"
      >
        <Send size={16} /> Submit Application
      </button>
    </form>
  );
}

/**
 * Safely loads ambassador count from Convex.
 * Wrapped in QuerySafeBoundary so the hero still renders
 * even if the Convex function isn't deployed yet.
 */
function AmbassadorCount() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ambassadors: any[] | undefined = useQuery(anyApi.certificates.getAmbassadors);
  const ambassadorCount = ambassadors?.length ?? 0;

  if (ambassadorCount === 0) return null;
  return (
    <p className="text-[#C9A84C] text-sm font-semibold mt-4">
      {ambassadorCount} ambassador{ambassadorCount !== 1 ? "s" : ""} and counting
    </p>
  );
}

/**
 * Safely loads and displays the current ambassadors grid.
 * Wrapped in QuerySafeBoundary — renders nothing if backend unavailable.
 */
function AmbassadorGrid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ambassadors: any[] | undefined = useQuery(anyApi.certificates.getAmbassadors);

  if (!ambassadors || ambassadors.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <h2 className="font-serif text-xl font-bold text-white mb-5 text-center">Current Ambassadors</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ambassadors.map((a, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-[#C9A84C] font-serif font-bold text-sm">
                {a.fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
              </span>
            </div>
            <p className="text-white font-semibold text-sm truncate">{a.fullName}</p>
            <p className="text-gray-400 text-xs truncate">{a.university}</p>
            {a.ambassadorTier === "society_partner" && (
              <span className="inline-block text-[#C9A84C] text-xs font-bold mt-1">Society Partner</span>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export default function AmbassadorsPage() {
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
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 md:py-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full px-4 py-1.5 mb-6">
            <Megaphone size={14} className="text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-bold tracking-[0.1em] uppercase">Ambassador Programme</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Represent RATIO at<br />Your University
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Join moot society leaders, law society presidents, and advocacy champions at universities
            across the UK who are shaping the future of legal education.
          </p>
          <QuerySafeBoundary fallback={null}>
            <AmbassadorCount />
          </QuerySafeBoundary>
        </motion.section>

        {/* What ambassadors do */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-5 text-center">What Ambassadors Do</h2>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div className="space-y-3">
              {WHAT_YOU_DO.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-5 text-center">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-3">
                  {b.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{b.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Current ambassadors — safe if Convex functions not deployed */}
        <QuerySafeBoundary fallback={null}>
          <AmbassadorGrid />
        </QuerySafeBoundary>

        {/* Application form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="apply"
          className="mb-12"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-2 text-center">Apply to Become an Ambassador</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Applications are reviewed personally by our Founder. We&apos;ll respond within 7 days.
          </p>
          <QuerySafeBoundary fallback={
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-400 text-sm">Application form is temporarily unavailable. Please try again later or email mgiqui01@student.bbk.ac.uk</p>
            </div>
          }>
            <ApplicationForm />
          </QuerySafeBoundary>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-serif text-xl font-bold text-white mb-5 text-center">Questions?</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
                <p className="text-white font-semibold text-sm mb-1.5">{item.q}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-6">
          <p className="text-xs text-gray-500">
            &copy; 2026 RATIO — The Digital Court Society &middot;{" "}
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link> &middot;{" "}
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

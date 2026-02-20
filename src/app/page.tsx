"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(247); // social proof seed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    // In production: call Convex mutation to store email
    setSubmitted(true);
    setCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.06),transparent_60%)]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(107,45,62,0.06),transparent_60%)]" />
        <div className="absolute top-[40%] right-[-150px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(46,80,144,0.04),transparent_60%)]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-6 pt-5 pb-4 max-w-4xl mx-auto">
        <div className="font-serif text-lg font-bold tracking-[0.12em]">
          RATIO<span className="text-gold">.</span>
        </div>
        <Link href="/login" className="text-xs text-court-text-sec font-semibold px-4 py-2 rounded-lg border border-court-border hover:border-white/10 transition-all">
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-16 pb-12 max-w-2xl mx-auto animate-slide-up">
        {/* Social proof pill */}
        <div className="inline-flex items-center gap-2 bg-gold-dim border border-gold/20 rounded-full px-4 py-1.5 mb-8">
          <div className="flex -space-x-1.5">
            {["#6B2D3E", "#2E5090", "#3D6B45", "#8B6914"].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-navy text-[7px] font-bold flex items-center justify-center font-serif text-white/80"
                style={{ background: c, zIndex: 4 - i }}>
                {["PS", "JO", "FA", "MW"][i]}
              </div>
            ))}
          </div>
          <span className="text-[11px] text-gold font-semibold">{count} advocates on the waitlist</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-court-text leading-[1.1] mb-5">
          The reason<br />you&apos;re <span className="text-gold">ready</span><span className="text-gold">.</span>
        </h1>

        <p className="text-[16px] text-court-text-sec leading-relaxed max-w-md mx-auto mb-10">
          Practice advocacy with an AI High Court judge. Organise moots. Track your skills. Build a portfolio that proves you&apos;re ready for the Bar.
        </p>

        {/* Email Capture */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your university email"
                required
                className="flex-1 bg-navy-card border border-court-border rounded-xl px-4 py-3.5 text-sm text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter"
              />
              <button type="submit" className="bg-gold text-navy font-bold rounded-xl px-6 py-3.5 text-sm tracking-wide shrink-0 hover:bg-gold/90 transition-colors">
                Join
              </button>
            </div>
            <p className="text-[10px] text-court-text-ter mt-3">Free forever. Built for UK law students. Launching March 2026.</p>
          </form>
        ) : (
          <div className="max-w-sm mx-auto animate-slide-up">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-5 text-center">
              <span className="text-2xl">⚖️</span>
              <p className="text-sm font-bold text-green-500 mt-2">You&apos;re on the list.</p>
              <p className="text-xs text-court-text-sec mt-1">Advocate #{count}. We&apos;ll notify you at launch.</p>
            </div>
          </div>
        )}
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 px-6 pb-16 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: "🤖", title: "AI Judge",
              desc: "Face a virtual High Court judge who interrupts your submissions with real judicial interventions. Scored across 7 advocacy dimensions.",
              tag: "FIRST OF ITS KIND",
            },
            {
              icon: "⚖️", title: "Moot Organisation",
              desc: "Create sessions, claim courtroom roles, invite your cohort. Real-time role claiming so no one double-books.",
              tag: "REAL-TIME",
            },
            {
              icon: "🎯", title: "SQE2 Preparation",
              desc: "Timed advocacy assessments scored against SRA competency standards. £7.99/mo vs £3,000 prep courses.",
              tag: "SRA-ALIGNED",
            },
            {
              icon: "📊", title: "Advocacy Portfolio",
              desc: "Every session auto-generates scored evidence. Export a branded PDF for training contract and pupillage applications.",
              tag: "AUTO-GENERATED",
            },
            {
              icon: "🏆", title: "National League",
              desc: "Join a Chamber. Compete in national rankings. Rise from Pupil to King's Counsel. Your university vs everyone.",
              tag: "130+ UNIVERSITIES",
            },
            {
              icon: "👥", title: "Advocate Network",
              desc: "Follow rising stars, commend performances, discover advocates from every UK law school. Your professional network starts here.",
              tag: "SOCIAL",
            },
          ].map((f) => (
            <div key={f.title} className="bg-navy-card border border-court-border-light rounded-court p-5 hover:border-white/10 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-[8px] font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-court-text mb-1.5">{f.title}</h3>
              <p className="text-[12px] text-court-text-sec leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 pb-16 max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-court-text text-center mb-10">
          How Ratio works
        </h2>
        <div className="flex flex-col gap-6">
          {[
            { step: "01", title: "Join your university", desc: "Select your law school, year, modules, and Chamber. Takes 30 seconds." },
            { step: "02", title: "Organise or join moots", desc: "Create sessions with structured roles. Claim Leading Counsel, Judge, or Clerk. Real-time updates." },
            { step: "03", title: "Practice with AI", desc: "Face an AI High Court judge who challenges your submissions and scores your advocacy across 7 dimensions." },
            { step: "04", title: "Build your portfolio", desc: "Every session, score, and distinction is tracked. Export a branded advocacy portfolio for applications." },
          ].map((s) => (
            <div key={s.step} className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-court bg-gold-dim border border-gold/25 flex items-center justify-center shrink-0">
                <span className="font-serif text-sm font-bold text-gold">{s.step}</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-court-text mb-1">{s.title}</h3>
                <p className="text-[13px] text-court-text-sec leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Universities */}
      <section className="relative z-10 px-6 pb-16 max-w-2xl mx-auto text-center">
        <p className="text-[10px] text-court-text-ter uppercase tracking-[0.2em] mb-5">Launching at</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {["UCL", "KCL", "LSE", "Oxford", "Cambridge", "Bristol", "Manchester", "Edinburgh", "Birmingham", "Durham"].map((u) => (
            <span key={u} className="font-serif text-sm font-bold text-court-text-sec">{u}</span>
          ))}
        </div>
        <p className="text-xs text-court-text-ter mt-4">+ 120 more UK law schools</p>
      </section>

      {/* Pricing Preview */}
      <section className="relative z-10 px-6 pb-16 max-w-2xl mx-auto">
        <div className="bg-navy-card border border-court-border-light rounded-court p-6 text-center">
          <h2 className="font-serif text-xl font-bold text-court-text mb-2">Free. Forever.</h2>
          <p className="text-[13px] text-court-text-sec leading-relaxed max-w-sm mx-auto mb-5">
            Core mooting, role claiming, feedback, social features, and 3 AI Judge sessions per month. No credit card. No trial period. Just build your advocacy.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <div className="bg-white/[0.03] rounded-lg px-4 py-2 border border-court-border-light">
              <p className="font-serif text-lg font-bold text-court-text">£0</p>
              <p className="text-[9px] text-court-text-ter uppercase">Free</p>
            </div>
            <div className="bg-gold-dim rounded-lg px-4 py-2 border border-gold/20">
              <p className="font-serif text-lg font-bold text-gold">£5.99</p>
              <p className="text-[9px] text-gold/70 uppercase">Premium</p>
            </div>
            <div className="bg-burgundy/10 rounded-lg px-4 py-2 border border-burgundy/20">
              <p className="font-serif text-lg font-bold text-court-text">£7.99</p>
              <p className="text-[9px] text-court-text-ter uppercase">Premium+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 pb-20 max-w-md mx-auto text-center">
        <h2 className="font-serif text-2xl font-bold text-court-text mb-3">
          Ready to prove it?
        </h2>
        <p className="text-[13px] text-court-text-sec mb-6">
          Join {count} law students already on the waitlist.
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 bg-navy-card border border-court-border rounded-xl px-4 py-3 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
            />
            <button type="submit" className="bg-gold text-navy font-bold rounded-xl px-6 py-3 text-sm shrink-0">
              Join
            </button>
          </form>
        ) : (
          <p className="text-sm text-green-500 font-semibold">✓ You&apos;re already on the list.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-court-border px-6 py-8 text-center">
        <div className="font-serif text-lg font-bold tracking-[0.12em]">
          RATIO<span className="text-gold">.</span>
        </div>
        <p className="text-gold text-[10px] tracking-[0.18em] uppercase mt-1.5">The Digital Court Society</p>
        <p className="text-[10px] text-court-text-ter mt-4">© 2026 Ratio. Built for the Bar.</p>
        <div className="flex justify-center gap-6 mt-4">
          {["Instagram", "TikTok", "LinkedIn", "X"].map((s) => (
            <span key={s} className="text-[10px] text-court-text-ter hover:text-gold cursor-pointer transition-colors">{s}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { AIShowcase } from "@/components/landing/AIShowcase";
import { VideoMootingShowcase } from "@/components/landing/VideoMootingShowcase";
import { TournamentShowcase } from "@/components/landing/TournamentShowcase";
import { ToolsShowcase } from "@/components/landing/ToolsShowcase";
import { LawBookPreview } from "@/components/landing/LawBookPreview";
import { GovernanceShowcase } from "@/components/landing/GovernanceShowcase";
import { ChambersPreview } from "@/components/landing/ChambersPreview";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(247);

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
      <nav className="relative z-10 flex justify-between items-center px-4 md:px-6 lg:px-8 pt-3 pb-4 max-w-4xl mx-auto">
        <div className="font-serif text-lg font-bold tracking-[0.12em]">
          RATIO<span className="text-gold">.</span>
        </div>
        <Link
          href="/login"
          className="text-xs text-court-text-sec font-semibold px-4 py-2 rounded-lg border border-court-border hover:border-white/10 transition-all"
        >
          Sign In
        </Link>
      </nav>

      {/* Sections */}
      <HeroSection
        email={email}
        setEmail={setEmail}
        submitted={submitted}
        count={count}
        onSubmit={handleSubmit}
      />
      <TrustBar />
      <FeaturesGrid id="features" />
      <HowItWorks />
      <AIShowcase id="ai-showcase" />
      <VideoMootingShowcase id="video-mooting" />
      <TournamentShowcase id="tournaments" />
      <ToolsShowcase id="tools" />
      <LawBookPreview id="law-book" />
      <GovernanceShowcase id="governance" />
      <ChambersPreview id="chambers" />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <CTASection
        email={email}
        setEmail={setEmail}
        submitted={submitted}
        count={count}
        onSubmit={handleSubmit}
      />
      <FooterSection />
    </div>
  );
}

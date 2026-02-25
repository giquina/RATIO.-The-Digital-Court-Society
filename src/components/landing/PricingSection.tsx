"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, GraduationCap, Scale } from "lucide-react";

// ── Student tiers (unchanged) ──
const STUDENT_TIERS = [
  {
    name: "Free",
    planKey: "free",
    monthly: "£0",
    annual: "£0",
    period: "forever",
    annualPeriod: "forever",
    description: "Everything you need to start practising advocacy.",
    recommended: "Getting started with advocacy",
    features: [
      "3 AI Judge sessions per month",
      "Unlimited moot organisation",
      "Live video mooting rooms",
      "Role claiming and scheduling",
      "Legal Research Engine access",
      "Basic advocacy portfolio",
      "Chamber membership and rankings",
      "Parliament voting rights",
      "Social features and community feed",
    ],
    highlight: false,
    accent: "border-court-border-light",
    priceColor: "text-court-text",
    bgAccent: "bg-white/[0.03]",
    checkColor: "text-court-text-ter",
    ctaVariant: "secondary" as const,
    ctaLabel: "Get Started",
  },
  {
    name: "Premium",
    planKey: "premium",
    monthly: "£5.99",
    annual: "£4.79",
    period: "/mo",
    annualPeriod: "/mo",
    description: "For serious advocates preparing for the Bar.",
    recommended: "Serious advocates preparing for the Bar",
    features: [
      "Unlimited AI Judge sessions",
      "AI Case Brief Generator",
      "AI Argument Builder",
      "Advanced scoring analytics",
      "Exportable branded PDF portfolio",
      "Tournament creation and management",
      "Access to all AI personas",
      "Detailed performance trends",
      "All advocacy certificates included",
    ],
    highlight: true,
    accent: "border-gold/30",
    priceColor: "text-gold",
    bgAccent: "bg-gold-dim",
    checkColor: "text-gold",
    ctaVariant: "primary" as const,
    ctaLabel: "Start Free Trial",
  },
  {
    name: "Premium+",
    planKey: "premium_plus",
    monthly: "£7.99",
    annual: "£6.39",
    period: "/mo",
    annualPeriod: "/mo",
    description: "SQE2 preparation and competitive advantage.",
    recommended: "SQE2 candidates seeking competitive edge",
    features: [
      "Everything in Premium",
      "Timed SQE2 advocacy assessments",
      "SRA competency scoring",
      "Mock oral examination mode",
      "Personalised learning paths",
      "All advocacy certificates included",
      "Priority support",
    ],
    highlight: false,
    accent: "border-burgundy/20",
    priceColor: "text-court-text",
    bgAccent: "bg-burgundy/10",
    checkColor: "text-[#C9A84C]/60",
    ctaVariant: "primary" as const,
    ctaLabel: "Start Free Trial",
  },
];

// ── Professional tiers (new) ──
const PROFESSIONAL_TIERS = [
  {
    name: "Professional",
    planKey: "professional",
    monthly: "£14.99",
    annual: "£11.99",
    period: "/mo",
    annualPeriod: "/mo",
    description: "Unlimited advocacy training for practising professionals.",
    recommended: "Junior barristers, solicitor advocates, pupillage applicants",
    features: [
      "Unlimited AI Judge sessions",
      "AI Case Brief Generator",
      "AI Argument Builder",
      "Advanced scoring analytics",
      "Professional-branded PDF portfolio",
      "Tournament creation and management",
      "Access to all AI personas",
      "Detailed performance trends",
      "No university affiliation required",
      "All advocacy certificates included",
    ],
    highlight: true,
    accent: "border-gold/30",
    priceColor: "text-gold",
    bgAccent: "bg-gold-dim",
    checkColor: "text-gold",
    ctaVariant: "primary" as const,
    ctaLabel: "Start Free Trial",
  },
  {
    name: "Professional+",
    planKey: "professional_plus",
    monthly: "£24.99",
    annual: "£19.99",
    period: "/mo",
    annualPeriod: "/mo",
    description: "Full platform access with CPD tracking and compliance tools.",
    recommended: "Barristers and solicitors needing CPD compliance",
    features: [
      "Everything in Professional",
      "Timed SQE2 advocacy assessments",
      "SRA competency scoring",
      "Mock oral examination mode",
      "CPD tracking dashboard",
      "Exportable CPD compliance reports",
      "All advocacy certificates included",
      "Priority support",
    ],
    highlight: false,
    accent: "border-burgundy/20",
    priceColor: "text-court-text",
    bgAccent: "bg-burgundy/10",
    checkColor: "text-[#C9A84C]/60",
    ctaVariant: "primary" as const,
    ctaLabel: "Start Free Trial",
  },
];

type Audience = "student" | "professional";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [audience, setAudience] = useState<Audience>("student");

  const tiers = audience === "student" ? STUDENT_TIERS : PROFESSIONAL_TIERS;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-3">
        {audience === "student" ? "Free. Forever." : "Professional Pricing"}
      </h2>
      <p className="text-court-base text-court-text-sec text-center max-w-md mx-auto mb-8">
        {audience === "student"
          ? "Live video mooting, legal research, Parliament, social features, and 3 AI Judge sessions per month. No credit card required."
          : "The same powerful platform, built for working professionals. A fraction of the cost of traditional advocacy training."}
      </p>

      {/* ── Audience toggle (Student / Professional) ── */}
      <div className="flex items-center justify-center gap-1 mb-6">
        <button
          onClick={() => setAudience("student")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-court-sm font-semibold transition-all ${
            audience === "student"
              ? "bg-gold-dim border border-gold/30 text-gold"
              : "border border-court-border text-court-text-ter hover:text-court-text-sec"
          }`}
        >
          <GraduationCap size={14} />
          Students
        </button>
        <button
          onClick={() => setAudience("professional")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-court-sm font-semibold transition-all ${
            audience === "professional"
              ? "bg-gold-dim border border-gold/30 text-gold"
              : "border border-court-border text-court-text-ter hover:text-court-text-sec"
          }`}
        >
          <Scale size={14} />
          Professionals
        </button>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-court-sm font-semibold transition-colors ${!annual ? "text-court-text" : "text-court-text-ter"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${annual ? "bg-gold" : "bg-court-border"}`}
          aria-label="Toggle annual billing"
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-navy transition-transform duration-300 ${annual ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
        <span className={`text-court-sm font-semibold transition-colors ${annual ? "text-court-text" : "text-court-text-ter"}`}>
          Annual
        </span>
        {annual && (
          <span className="text-court-xs text-gold font-bold ml-1">Save 20%</span>
        )}
      </div>

      {/* ── Tier cards ── */}
      <div className={`grid grid-cols-1 gap-3 md:gap-4 pt-4 ${
        tiers.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-2xl mx-auto"
      }`}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-navy-card border ${tier.accent} rounded-court p-4 flex flex-col relative overflow-visible ${
              tier.highlight ? "shadow-[0_0_20px_rgba(201,168,76,0.06)]" : ""
            }`}
          >
            {/* Most Popular / Recommended badge */}
            {tier.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-gold text-navy text-court-xs font-bold tracking-[0.15em] uppercase px-4 py-1 rounded-full whitespace-nowrap shadow-lg">
                  {audience === "student" ? "Most Popular" : "Recommended"}
                </span>
              </div>
            )}

            <div
              className={`${tier.bgAccent} rounded-lg px-4 py-3 mb-4 text-center ${tier.highlight ? "mt-2" : ""}`}
            >
              <p className={`font-serif text-2xl font-bold ${tier.priceColor}`}>
                {annual ? tier.annual : tier.monthly}
              </p>
              <p className="text-court-xs text-court-text-ter uppercase font-bold">
                {tier.name}{" "}
                <span className="font-normal">{annual ? tier.annualPeriod : tier.period}</span>
              </p>
            </div>

            <p className="text-court-sm text-court-text-sec leading-relaxed mb-1">
              {tier.description}
            </p>
            <p className="text-court-xs text-court-text-ter mb-4">
              Recommended for: {tier.recommended}
            </p>

            <ul className="space-y-2 flex-1">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-court-xs text-court-text-sec"
                >
                  <Check
                    size={12}
                    className={`shrink-0 mt-0.5 ${tier.checkColor}`}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href={tier.planKey === "free" ? "/register" : `/register?plan=${tier.planKey}`}
              className={`w-full mt-5 py-2.5 rounded-xl text-court-base font-bold tracking-wide transition-all duration-200 text-center block ${
                tier.ctaVariant === "primary"
                  ? "bg-gold text-navy hover:bg-gold/90"
                  : "bg-white/5 text-court-text-sec border border-court-border hover:bg-white/10"
              }`}
            >
              {tier.ctaLabel}
            </Link>
          </div>
        ))}
      </div>

      {/* ── Cross-sell nudge ── */}
      <p className="text-center text-court-xs text-court-text-ter mt-6">
        {audience === "student"
          ? "Are you a practising legal professional? "
          : "Are you a law student? "}
        <button
          onClick={() => setAudience(audience === "student" ? "professional" : "student")}
          className="text-gold hover:underline font-semibold"
        >
          {audience === "student" ? "View professional plans →" : "View student plans →"}
        </button>
      </p>
    </motion.section>
  );
}

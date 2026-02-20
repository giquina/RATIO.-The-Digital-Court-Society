"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Everything you need to start practising advocacy.",
    features: [
      "3 AI Judge sessions per month",
      "Unlimited moot organisation",
      "Role claiming and scheduling",
      "Basic advocacy portfolio",
      "Chamber membership",
      "Social features and feed",
    ],
    highlight: false,
    accent: "border-court-border-light",
    priceColor: "text-court-text",
    bgAccent: "bg-white/[0.03]",
  },
  {
    name: "Premium",
    price: "£5.99",
    period: "/mo",
    description: "For serious advocates preparing for the Bar.",
    features: [
      "Unlimited AI Judge sessions",
      "Advanced scoring analytics",
      "Exportable branded PDF portfolio",
      "Priority session scheduling",
      "Access to all AI personas",
      "Detailed performance trends",
    ],
    highlight: true,
    accent: "border-gold/25",
    priceColor: "text-gold",
    bgAccent: "bg-gold-dim",
  },
  {
    name: "Premium+",
    price: "£7.99",
    period: "/mo",
    description: "SQE2 preparation and competitive advantage.",
    features: [
      "Everything in Premium",
      "Timed SQE2 advocacy assessments",
      "SRA competency scoring",
      "Mock oral examination mode",
      "Personalised improvement plans",
      "Priority support",
    ],
    highlight: false,
    accent: "border-burgundy/20",
    priceColor: "text-court-text",
    bgAccent: "bg-burgundy/10",
  },
];

export function PricingSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-3">
        Free. Forever.
      </h2>
      <p className="text-court-base text-court-text-sec text-center max-w-md mx-auto mb-10">
        Core mooting, role claiming, feedback, social features, and 3 AI Judge
        sessions per month. No credit card. No trial period. Just build your
        advocacy.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`bg-navy-card border ${tier.accent} rounded-court p-4 flex flex-col`}
          >
            <div
              className={`${tier.bgAccent} rounded-lg px-4 py-3 mb-4 text-center`}
            >
              <p className={`font-serif text-2xl font-bold ${tier.priceColor}`}>
                {tier.price}
              </p>
              <p className="text-court-xs text-court-text-ter uppercase font-bold">
                {tier.name}{" "}
                <span className="font-normal">{tier.period}</span>
              </p>
            </div>
            <p className="text-court-sm text-court-text-sec leading-relaxed mb-4">
              {tier.description}
            </p>
            <ul className="space-y-2 flex-1">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-court-xs text-court-text-sec"
                >
                  <Check
                    size={12}
                    className={`shrink-0 mt-0.5 ${tier.highlight ? "text-gold" : "text-court-text-ter"}`}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

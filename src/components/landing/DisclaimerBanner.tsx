"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-2xl mx-auto"
    >
      <div className="bg-navy-mid border border-court-border-light rounded-court border-l-4 border-l-gold p-5 md:p-6">
        <div className="flex gap-4 items-start">
          <div className="shrink-0 mt-0.5">
            <ShieldCheck size={22} className="text-gold" />
          </div>
          <div>
            <p className="text-court-base text-court-text leading-relaxed">
              Ratio is an educational training tool for UK law students. It does
              not constitute legal advice. AI-generated analysis should always be
              verified against primary legislation and official law reports.
            </p>
            <p className="text-court-xs text-court-text-ter mt-3 uppercase tracking-[0.15em]">
              Jurisdiction: England &amp; Wales
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default DisclaimerBanner;

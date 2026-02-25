"use client";

import { motion } from "framer-motion";

const UNIVERSITIES = [
  "UCL",
  "KCL",
  "LSE",
  "Oxford",
  "Cambridge",
  "Birkbeck",
  "Bristol",
  "Manchester",
  "Edinburgh",
  "Birmingham",
];

export function TrustBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-2xl mx-auto text-center"
    >
      <p className="text-court-xs text-court-text-ter uppercase tracking-[0.2em] mb-5">
        Trusted by advocates at
      </p>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
        {UNIVERSITIES.map((u) => (
          <span
            key={u}
            className="font-serif text-court-base font-bold text-court-text-sec"
          >
            {u}
          </span>
        ))}
      </div>
      <p className="text-court-sm text-court-text-ter mt-4">
        + 132 more UK law schools
      </p>
    </motion.section>
  );
}

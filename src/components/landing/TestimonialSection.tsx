"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Ratio changed how I prepare for moots. The AI judge picked apart my argument on privity of contract in a way that was genuinely more rigorous than most practice rounds I have had with peers.",
    name: "Priya Sharma",
    university: "UCL",
    year: "Year 2 LLB",
    chamberColor: "#6B2D3E",
  },
  {
    quote:
      "The video mooting rooms replicate a real courtroom. Timed submissions, a formal entrance, and post-session AI feedback. I used my advocacy portfolio in my pupillage application and it set me apart from every other candidate.",
    name: "James Okonkwo",
    university: "Oxford",
    year: "Year 3 LLB",
    chamberColor: "#2E5090",
  },
  {
    quote:
      "We ran our entire Michaelmas tournament through Ratio. Brackets, scheduling, video rooms, and rankings all in one place. The Research Engine also saved me hours on my dissertation footnotes.",
    name: "Fatima Al-Rashid",
    university: "KCL",
    year: "GDL",
    chamberColor: "#3D6B45",
  },
  {
    quote:
      "Parliament is the feature I did not expect to care about. Proposing a motion, debating it with Advocates across the country, and watching the vote come in felt like genuine civic participation.",
    name: "Marcus Williams",
    university: "Manchester",
    year: "Year 3 LLB",
    chamberColor: "#8B6914",
  },
];

export function TestimonialSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-10">
        What Advocates Say
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-navy-card border border-court-border-light rounded-court p-4 flex flex-col"
          >
            <div className="mb-3">
              <Quote size={20} className="text-gold/40" />
            </div>
            <p className="text-court-sm text-court-text-sec leading-relaxed flex-1 mb-4">
              {t.quote}
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-court-border-light">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-serif text-court-sm font-bold text-white/80 shrink-0"
                style={{ background: t.chamberColor }}
              >
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-court-sm font-bold text-court-text">
                  {t.name}
                </p>
                <p className="text-court-xs text-court-text-ter">
                  {t.university} &middot; {t.year}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

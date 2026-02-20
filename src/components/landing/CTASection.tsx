"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

interface CTASectionProps {
  email: string;
  setEmail: (email: string) => void;
  submitted: boolean;
  count: number;
  onSubmit: (e: React.FormEvent) => void;
}

export function CTASection({
  email,
  setEmail,
  submitted,
  count,
  onSubmit,
}: CTASectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-20 max-w-md mx-auto text-center"
    >
      <Scale size={32} className="text-gold mx-auto mb-4" />
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
        Ready to prove it?
      </h2>
      <p className="text-court-base text-court-text-sec mb-6">
        Join {count} law students already on the waitlist.
      </p>
      {!submitted ? (
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 bg-navy-card border border-court-border rounded-xl px-4 py-3 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
          />
          <button
            type="submit"
            className="bg-gold text-navy font-bold rounded-xl px-6 py-3 text-sm shrink-0 hover:bg-gold/90 transition-colors"
          >
            Join
          </button>
        </form>
      ) : (
        <p className="text-sm text-green-500 font-semibold flex items-center justify-center gap-2">
          <Scale size={16} className="text-green-500" />
          You&apos;re already on the list.
        </p>
      )}
    </motion.section>
  );
}

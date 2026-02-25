"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, ArrowRight } from "lucide-react";

export function CTASection() {
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
        Join advocates from across the UK legal community already practising.
      </p>
      <Link
        href="/register"
        className="bg-gold text-navy font-bold rounded-xl px-8 py-3.5 text-court-base tracking-wide hover:bg-gold/90 transition-colors inline-flex items-center justify-center gap-2"
      >
        Join as an Advocate
        <ArrowRight size={16} />
      </Link>
    </motion.section>
  );
}

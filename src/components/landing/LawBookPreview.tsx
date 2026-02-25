"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, FileText, CheckCircle } from "lucide-react";

export function LawBookPreview({ id }: { id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      <div className="bg-navy-card border border-court-border-light rounded-court p-5 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Description */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-gold" />
              <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
                PEER-REVIEWED
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-4">
              The Official Law Book
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              A student-built, peer-reviewed legal knowledge base with OSCOLA
              citations and editorial governance. Every entry is written by
              Advocates and verified by senior contributors before publication.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "OSCOLA-compliant citations",
                "Peer-reviewed by senior Advocates",
                "Covers all core LLB modules",
                "Editorial governance structure",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-court-sm text-court-text-sec"
                >
                  <CheckCircle size={14} className="text-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/law-book"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold rounded-xl px-6 py-3 text-court-base tracking-wide hover:bg-gold/90 transition-colors"
            >
              Explore the Law Book
            </Link>
          </div>

          {/* Right: Mock preview card */}
          <div className="flex-1">
            <div className="bg-navy border border-court-border rounded-court p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-gold" />
                <span className="text-court-xs font-bold tracking-[0.15em] text-gold">
                  CONTRACT LAW
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-court-text mb-2">
                Offer &amp; Acceptance
              </h3>
              <p className="text-court-sm text-court-text-sec leading-relaxed mb-3">
                An offer is an expression of willingness to contract on
                specified terms, made with the intention that it shall become
                binding as soon as it is accepted by the person to whom it is
                addressed.
              </p>
              <div className="border-t border-court-border-light pt-3 mt-3">
                <p className="text-court-xs text-court-text-ter italic mb-2">
                  Key authorities:
                </p>
                <div className="space-y-1.5">
                  {[
                    "Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256",
                    "Gibson v Manchester City Council [1979] 1 WLR 294",
                    "Harvey v Facey [1893] AC 552",
                  ].map((cite) => (
                    <p
                      key={cite}
                      className="text-court-xs text-court-text-ter font-serif"
                    >
                      {cite}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-court-border-light">
                <span className="text-court-xs text-court-text-ter">
                  Written by 3 Advocates
                </span>
                <span className="text-court-xs text-green-500 font-semibold">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

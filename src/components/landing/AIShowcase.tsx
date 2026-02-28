"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, MessageCircle, Scale } from "lucide-react";

export function AIShowcase({ id }: { id?: string }) {
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
              <Mic size={20} className="text-gold" />
              <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
                AI-POWERED
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-4">
              AI-Powered Advocacy Training
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Our AI moot court judge listens to your submissions in real time,
              identifies weaknesses in your argument structure, and intervenes
              with the kind of probing questions modelled on real courtroom
              practice. Each session is scored across 7 dimensions of advocacy
              competence.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-6">
              Whether you are preparing for a moot, pupillage interview, or
              SQE2 oral assessment, the AI Judge adapts its difficulty to your
              skill level and provides detailed written feedback after every
              session.
            </p>
            <Link
              href="/moot-court"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold rounded-xl px-6 py-3 text-court-base tracking-wide hover:bg-gold/90 transition-colors"
            >
              Start Practice
            </Link>
          </div>

          {/* Right: Mock chat UI */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="bg-navy border border-court-border rounded-court p-4 space-y-4">
              {/* Judge message */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gold-dim border border-gold/25 flex items-center justify-center shrink-0">
                  <Scale size={14} className="text-gold" />
                </div>
                <div className="bg-white/[0.03] border border-court-border-light rounded-lg rounded-tl-none px-3 py-2.5 max-w-[85%]">
                  <p className="text-court-xs text-gold font-semibold mb-1">
                    The Hon. Justice Blake
                  </p>
                  <p className="text-court-sm text-court-text-sec leading-relaxed">
                    Counsel, you rely on Carlill v Carbolic Smoke Ball Co for
                    the proposition that an advertisement can constitute a
                    unilateral offer. But how do you distinguish this from a
                    mere invitation to treat, as in Partridge v Crittenden?
                  </p>
                </div>
              </div>

              {/* Advocate message */}
              <div className="flex gap-3 items-start justify-end">
                <div className="bg-gold-dim border border-gold/20 rounded-lg rounded-tr-none px-3 py-2.5 max-w-[85%]">
                  <p className="text-court-xs text-court-text-ter font-semibold mb-1">
                    You (Advocate)
                  </p>
                  <p className="text-court-sm text-court-text-sec leading-relaxed">
                    My Lord, the distinction turns on the specificity of the
                    terms. In Carlill, the company prescribed a precise course
                    of conduct and deposited funds demonstrating sincerity of
                    intention...
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-chamber-grays flex items-center justify-center shrink-0">
                  <MessageCircle size={14} className="text-white/80" />
                </div>
              </div>

              {/* Judge follow-up */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gold-dim border border-gold/25 flex items-center justify-center shrink-0">
                  <Scale size={14} className="text-gold" />
                </div>
                <div className="bg-white/[0.03] border border-court-border-light rounded-lg rounded-tl-none px-3 py-2.5 max-w-[85%]">
                  <p className="text-court-sm text-court-text-sec leading-relaxed">
                    Very well. But does that not conflate the question of
                    intention with the question of consideration? Move on to
                    your second ground.
                  </p>
                </div>
              </div>
            </div>

            {/* Score indicators */}
            <div className="flex gap-2 flex-wrap">
              {[
                "Argument Structure",
                "Use of Authority",
                "Judicial Handling",
              ].map((dim) => (
                <span
                  key={dim}
                  className="text-court-xs text-court-text-ter bg-white/[0.03] border border-court-border-light rounded px-2 py-1"
                >
                  {dim}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Disclaimer */}
        <p className="text-[10px] text-court-text-ter leading-relaxed mt-4 pt-3 border-t border-court-border-light">
          Simulated moot court powered by AI. Case law sourced from the UK
          National Archives. Educational tool only — not legal advice. Your
          practice sessions are private and never shared with third parties.
        </p>
      </div>
    </motion.section>
  );
}

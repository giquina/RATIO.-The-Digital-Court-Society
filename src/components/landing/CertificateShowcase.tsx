"use client";

import { motion } from "framer-motion";
import { Award, QrCode, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SkillsRadar } from "@/components/shared/SkillsRadar";

/*
 * CertificateShowcase — landing page section showing RATIO's
 * verified advocacy certificates.
 *
 * This is the "shop window" — students see the certificate and
 * think "I want that on my CV." It has three visual parts:
 *
 * 1. An animated radar chart (7 advocacy dimensions)
 * 2. A certificate mockup that looks like the real thing
 * 3. A strip of 3 level badges (Foundation → Advanced)
 *
 * All static/decorative — no API calls, no auth required.
 */

const LEVELS = [
  {
    name: "Foundation",
    color: "#CD7F32",
    label: "Bronze",
    desc: "5 moots · avg score 50+",
  },
  {
    name: "Intermediate",
    color: "#C0C0C0",
    label: "Silver",
    desc: "15 moots · avg score 65+",
  },
  {
    name: "Advanced",
    color: "#C9A84C",
    label: "Gold",
    desc: "30 moots · avg score 75+",
  },
];

export function CertificateShowcase({ id }: { id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      {/* Section heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <Award size={20} className="text-gold" />
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
            VERIFIED CREDENTIALS
          </span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
          Earn Verified Advocacy Credentials
        </h2>
        <p className="text-court-base text-court-text-sec max-w-lg mx-auto">
          Complete structured requirements. Get assessed across 7 dimensions.
          Earn a certificate signed by the Founder with a unique QR code that
          anyone can scan to verify.
        </p>
      </div>

      {/* Main visual: Radar chart + Certificate mockup side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Radar chart */}
        <div className="bg-navy-card border border-court-border-light rounded-court p-5 flex flex-col items-center justify-center">
          <p className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-4">
            7-DIMENSION ASSESSMENT
          </p>
          <SkillsRadar scores={[78, 65, 82, 70, 88, 60, 74]} size={220} />
          <p className="text-court-xs text-court-text-ter mt-3">
            Overall: <span className="text-gold font-bold">74/100</span>
          </p>
        </div>

        {/* Certificate mockup — designed to look like a real credential */}
        <div className="bg-navy-card border border-gold/20 rounded-court p-5 flex flex-col relative overflow-hidden">
          {/* Decorative gold corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/30 rounded-tl-court" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/30 rounded-br-court" />

          <div className="text-center flex-1 flex flex-col justify-center py-2">
            {/* Header */}
            <p className="text-court-xs tracking-[0.2em] text-gold/60 mb-1">
              RATIO — THE DIGITAL COURT SOCIETY
            </p>
            <div className="w-16 h-px bg-gold/20 mx-auto mb-3" />

            {/* Title */}
            <h3 className="font-serif text-lg font-bold text-court-text mb-1">
              Certificate of Advocacy
            </h3>
            <p className="text-court-xs text-gold font-semibold mb-4">
              FOUNDATION LEVEL
            </p>

            {/* Recipient */}
            <p className="text-court-xs text-court-text-ter mb-0.5">
              This certifies that
            </p>
            <p className="font-serif text-base font-bold text-court-text mb-0.5">
              Alexandra Chen
            </p>
            <p className="text-court-xs text-court-text-ter mb-3">
              University of Bristol
            </p>

            {/* Achievement line */}
            <p className="text-court-xs text-court-text-sec leading-relaxed max-w-[240px] mx-auto mb-4">
              has demonstrated competence across 7 dimensions of legal advocacy
              through structured moot court practice and AI-assessed performance.
            </p>

            {/* Bottom row: QR + signature */}
            <div className="flex items-end justify-between px-2">
              {/* QR placeholder */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 border border-court-border rounded flex items-center justify-center">
                  <QrCode size={20} className="text-court-text-ter" />
                </div>
                <span className="text-court-xs text-court-text-ter" style={{ fontSize: "8px" }}>
                  Scan to verify
                </span>
              </div>

              {/* Signature */}
              <div className="text-right">
                <p className="text-court-xs text-court-text-sec italic font-serif">
                  G. Quina
                </p>
                <div className="w-20 h-px bg-court-border mb-0.5" />
                <p className="text-court-xs text-court-text-ter" style={{ fontSize: "8px" }}>
                  Founder, RATIO
                </p>
              </div>
            </div>
          </div>

          {/* Issued date */}
          <p className="text-center text-court-text-ter mt-2" style={{ fontSize: "8px" }}>
            Issued 18 February 2026 · Verification Code: RATIO-FND-2026-AC4817
          </p>
        </div>
      </div>

      {/* Level badges strip */}
      <div className="grid grid-cols-3 gap-3">
        {LEVELS.map((level) => (
          <div
            key={level.name}
            className="bg-navy-card border border-court-border-light rounded-court p-3 text-center group hover:border-white/10 transition-all"
          >
            <div
              className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ background: `${level.color}20` }}
            >
              <ShieldCheck size={16} style={{ color: level.color }} />
            </div>
            <p className="text-court-sm font-bold text-court-text mb-0.5">
              {level.name}
            </p>
            <p className="text-court-xs text-court-text-ter">{level.desc}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-court-text-ter mt-4" style={{ fontSize: "10px" }}>
        RATIO certificates are professional development credentials, not academic qualifications
        or regulatory accreditation.
      </p>
    </motion.section>
  );
}

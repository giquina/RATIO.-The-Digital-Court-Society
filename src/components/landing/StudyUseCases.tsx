"use client";

import { motion } from "framer-motion";
import {
  FileQuestion,
  BookOpen,
  Scale,
  Target,
  FolderOpen,
  CheckCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const USE_CASES: {
  Icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    Icon: FileQuestion,
    title: "Problem Questions",
    desc: "Structure IRAC answers with AI guidance. Practice applying legal principles to hypothetical scenarios.",
  },
  {
    Icon: BookOpen,
    title: "Case Analysis",
    desc: "Research UK case law and extract ratio decidendi. Build authority lists for your arguments.",
  },
  {
    Icon: Scale,
    title: "Oral Advocacy",
    desc: "Practise submissions with the AI Judge or join live video moots. Get scored across 7 advocacy dimensions.",
  },
  {
    Icon: Target,
    title: "SQE2 Preparation",
    desc: "Timed advocacy assessments scored against SRA competency standards. Track your readiness score.",
  },
  {
    Icon: FolderOpen,
    title: "Portfolio Building",
    desc: "Every practice session generates scored evidence. Export a branded PDF for training contract applications.",
  },
];

const VERIFICATION_POINTS = [
  "Cross-reference AI analysis with primary legislation on legislation.gov.uk",
  "Verify case citations against official law reports (ICLR, BAILII)",
  "Check statutory provisions are current and not repealed",
  "Use OSCOLA citation format for all academic and professional work",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function StudyUseCases() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      {/* Section heading */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
          Built for Your Studies
        </h2>
        <p className="text-court-base text-court-text-sec max-w-lg mx-auto">
          Practical tools for every stage of your legal education.
        </p>
      </motion.div>

      {/* Use-case cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
        {USE_CASES.map((uc) => (
          <motion.div
            key={uc.title}
            variants={itemVariants}
            className="bg-navy-card border border-court-border-light rounded-court p-4 md:p-5 hover:border-white/10 transition-all"
          >
            <div className="mb-3">
              <uc.Icon size={24} className="text-gold" />
            </div>
            <h3 className="font-serif text-base font-bold text-court-text mb-1.5">
              {uc.title}
            </h3>
            <p className="text-court-base text-court-text-sec leading-relaxed">
              {uc.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Verification Guidance box */}
      <motion.div
        variants={itemVariants}
        className="bg-navy-card border border-court-border-light rounded-court border-l-4 border-l-gold p-5 md:p-6"
      >
        <h3 className="font-serif text-lg font-bold text-court-text mb-4">
          Always Verify
        </h3>
        <ul className="space-y-3">
          {VERIFICATION_POINTS.map((point) => (
            <li key={point} className="flex gap-3 items-start">
              <CheckCircle
                size={16}
                className="text-gold shrink-0 mt-0.5"
              />
              <span className="text-court-base text-court-text-sec leading-relaxed">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.section>
  );
}

export default StudyUseCases;

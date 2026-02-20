"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is Ratio?",
    answer:
      "Ratio is a digital court society built for UK law students. It combines AI-powered advocacy training, moot organisation tools, a peer-reviewed law book, and a national inter-university league. Think of it as the infrastructure your mooting society has always needed, combined with technology that lets you practise advocacy on your own terms.",
  },
  {
    question: "Is Ratio free to use?",
    answer:
      "Yes. The core platform is free forever. This includes unlimited moot organisation, role claiming, social features, Chamber membership, and 3 AI Judge sessions per month. Premium tiers at £5.99 and £7.99 per month unlock unlimited AI sessions, advanced analytics, exportable portfolios, and SQE2 preparation tools.",
  },
  {
    question: "Who can join Ratio?",
    answer:
      "Ratio is open to all UK law students. During the initial launch, we verify identity through .ac.uk university email addresses. This includes LLB, GDL, LPC, BPC, and LLM students at any UK university with a law programme. We plan to expand to international law students in future.",
  },
  {
    question: "How does the AI Judge work?",
    answer:
      "The AI Judge simulates a High Court judge hearing oral submissions. You present your argument, and the AI intervenes with questions, challenges your reasoning, and tests your knowledge of authorities. After each session, you receive a detailed scorecard across 7 dimensions: argument structure, use of authorities, oral delivery, judicial handling, court manner, persuasiveness, and time management.",
  },
  {
    question: "What is a Chamber?",
    answer:
      "Chambers are the four houses of Ratio, modelled on the historic Inns of Court: Gray's, Lincoln's, Inner, and Middle. When you join, you select a Chamber. Your Chamber is your team for national rankings and inter-university competition. Every moot you complete and every score you earn contributes to your Chamber's standing.",
  },
  {
    question: "How is my data handled?",
    answer:
      "Your data is yours. We store only what is necessary to operate the platform: your profile information, session records, and scores. We do not sell personal data to third parties. AI Judge sessions are processed securely and are not used to train external models. You can export or delete your data at any time. Full details are in our Privacy Policy.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-2xl mx-auto"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-10">
        Frequently Asked Questions
      </h2>

      <div className="space-y-2">
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={index}
            className="bg-navy-card border border-court-border-light rounded-court overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
            >
              <span className="font-serif text-base font-bold text-court-text pr-4">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-court-text-ter shrink-0 transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 pb-4" : "max-h-0"
              }`}
            >
              <p className="text-court-sm text-court-text-sec leading-relaxed px-4">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

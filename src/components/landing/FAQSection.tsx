"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is Ratio?",
    answer:
      "Ratio is a digital court society built for UK law students. It combines AI-powered advocacy training, live video mooting, legal research, moot organisation, competitive tournaments, a peer-reviewed law book, democratic governance through Parliament and Tribunal, and a national inter-university league. It is the complete infrastructure for UK law student advocacy.",
  },
  {
    question: "Is Ratio free to use?",
    answer:
      "Yes. The core platform is free forever. This includes live video mooting, unlimited moot organisation, the Legal Research Engine, Parliament voting rights, role claiming, social features, Chamber membership, and 3 AI Judge sessions per month. Premium tiers unlock unlimited AI sessions, the Case Brief Generator, Argument Builder, tournament creation, advanced analytics, exportable portfolios, and SQE2 preparation tools.",
  },
  {
    question: "Who can join Ratio?",
    answer:
      "Ratio is open to all UK law students. During the initial launch, we verify identity through .ac.uk university email addresses. This includes LLB, GDL, LPC, BPC, and LLM students at any UK university with a law programme. We plan to expand to international law students in future.",
  },
  {
    question: "How does live video mooting work?",
    answer:
      "Sessions take place in virtual courtrooms with live video and audio. You join a pre-session lobby, enter through a formal courtroom entrance, and then present your submissions with timed speaking slots. Judges preside, leading and junior counsel take turns, and clerks manage procedure. After the session, you rate your opponent and receive AI-generated feedback on your performance.",
  },
  {
    question: "How does the AI Judge work?",
    answer:
      "The AI Judge simulates a High Court judge hearing oral submissions. You present your argument, and the AI intervenes with questions, challenges your reasoning, and tests your knowledge of authorities. After each session, you receive a detailed scorecard across 7 dimensions: argument structure, use of authorities, oral delivery, judicial handling, court manner, persuasiveness, and time management.",
  },
  {
    question: "What is the Legal Research Engine?",
    answer:
      "The Research Engine lets you search every UK statute and court judgment in one place. It draws from official sources including legislation.gov.uk and the National Archives Find Case Law service. Results include OSCOLA-formatted citations, and you can filter by court hierarchy, year range, judge, or party name.",
  },
  {
    question: "What are Parliament and Tribunal?",
    answer:
      "Parliament is the democratic governance system of Ratio. Any verified Advocate can propose motions, debate policy changes, and vote. Standing orders ensure fair procedure. The Tribunal handles disputes through a structured judicial process modelled on real court procedure: file a case, serve notice, exchange submissions, attend a hearing, and receive a binding judgment from elected judicial Advocates.",
  },
  {
    question: "What is a Chamber?",
    answer:
      "Chambers are the four houses of Ratio, modelled on the historic Inns of Court: Gray's, Lincoln's, Inner, and Middle. When you join, you select a Chamber. Your Chamber is your team for national rankings, inter-university competition, and tournaments. Every moot you complete and every score you earn contributes to your Chamber's standing.",
  },
  {
    question: "How do tournaments work?",
    answer:
      "Mooting societies and Advocates can create structured tournaments with single elimination or round-robin formats. Participants are matched, results are tracked through live brackets, and winners advance through rounds. Inter-university tournaments let Chambers compete against law schools across the country, with all results feeding into the national league table.",
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

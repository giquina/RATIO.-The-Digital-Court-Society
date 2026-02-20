"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import {
  ArrowLeft,
  Shield,
  Target,
  BookOpen,
  Quote,
  GitBranch,
  Users,
  Copyright,
  Scale,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Policy sections ──
interface PolicySection {
  number: number;
  title: string;
  icon: LucideIcon;
  content: string[];
}

const SECTIONS: PolicySection[] = [
  {
    number: 1,
    title: "Purpose & Scope",
    icon: Target,
    content: [
      "The RATIO Law Book is a student-built, peer-reviewed legal knowledge base designed to support law students in their academic studies and professional development. It serves as a collaborative reference work, drawing on the collective knowledge and analysis of law students from universities across the United Kingdom.",
      "The Law Book covers the core areas of English and Welsh law as taught at undergraduate level, including but not limited to: Contract Law, Criminal Law, Tort Law, Public Law, Equity and Trusts, EU and International Law, Property Law, and Constitutional Law.",
      "The Law Book is not a substitute for authoritative legal texts, primary sources, or professional legal advice. It is a supplementary resource intended to aid understanding and provide a structured framework for legal analysis.",
    ],
  },
  {
    number: 2,
    title: "Content Standards",
    icon: BookOpen,
    content: [
      "All topic entries must follow the IRAC (Issue, Rule, Application, Conclusion) analytical framework. This structure ensures consistency, rigour, and clarity across all contributions.",
      "Issue: A clear statement of the legal question or problem being addressed. This should identify the area of law, the specific legal point at issue, and its practical significance.",
      "Rule: An accurate statement of the relevant legal rules, including statute law, case law, and any applicable secondary legislation or regulatory frameworks. All rules must be properly attributed to their source.",
      "Application: A detailed analysis of how the rules have been applied in key cases, demonstrating critical engagement with the law. Contributors should discuss multiple perspectives and highlight any areas of judicial disagreement or academic debate.",
      "Conclusion: A balanced summary of the current state of the law, noting any areas of uncertainty, recent developments, or pending reform proposals.",
      "Content must be written in formal legal English, free from personal opinion, colloquialisms, or speculative assertions. All factual claims must be supported by authoritative sources.",
    ],
  },
  {
    number: 3,
    title: "Citation Requirements",
    icon: Quote,
    content: [
      "All contributions must adhere to the Oxford University Standard for the Citation of Legal Authorities (OSCOLA) format. OSCOLA is the most widely used citation standard in UK legal scholarship and practice.",
      "A minimum of two primary sources (cases or statutes) is required for each topic entry. Contributors are encouraged to include a greater number of sources where the subject matter warrants it.",
      "Case citations should include the full case name, year, volume, law report abbreviation, and page number. Neutral citations should be used where available. Example: Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256 (CA).",
      "Statute citations should include the short title and year of the Act, followed by the relevant section number. Example: Sale of Goods Act 1979, s 57(2).",
      "Secondary sources (textbooks, journal articles, Law Commission reports) are encouraged and should follow OSCOLA formatting conventions. Contributors should prioritise the most recent editions of textbooks.",
      "All sources must be verifiable. Contributors should not cite sources they have not personally consulted.",
    ],
  },
  {
    number: 4,
    title: "Review Process",
    icon: Scale,
    content: [
      "All contributions to the Law Book undergo a structured peer review process before publication. The process consists of four stages:",
      "Stage 1 - Draft Submission: The contributor submits their topic entry through the Contribute page. The system validates that all required fields are complete and the minimum citation threshold is met.",
      "Stage 2 - Peer Review: Two independent peer reviewers are assigned to evaluate the submission. Reviewers assess accuracy, completeness, citation quality, analytical rigour, and adherence to the IRAC structure. Reviewers may approve the submission, request changes, or recommend rejection.",
      "Stage 3 - Editor Approval: Once both peer reviews are complete and favourable, a member of the Editorial Board reviews the submission for final approval. The editor may make minor editorial corrections or request further revisions.",
      "Stage 4 - Publication: Upon approval, the topic entry is published to the Law Book and becomes visible to all users. The contributor receives credit for their work.",
      "The typical review cycle takes 3 to 5 working days. Contributors may track the status of their submissions through the Review Queue.",
    ],
  },
  {
    number: 5,
    title: "Version Control",
    icon: GitBranch,
    content: [
      "The Law Book operates a comprehensive version control system. Every edit to a published topic creates a new version, preserving the complete history of changes.",
      "Each version is timestamped and attributed to the contributing author. This ensures transparency and accountability, and allows users to trace the evolution of legal analysis over time.",
      "Previous versions remain accessible through the Changelog. In the event that an error is introduced, the Editorial Board may revert to a previous version.",
      "Major revisions (substantial changes to legal analysis or the addition of new case law) increment the major version number. Minor revisions (typographical corrections, formatting changes, citation updates) are recorded but do not increment the major version number.",
    ],
  },
  {
    number: 6,
    title: "Copyright & Licensing",
    icon: Copyright,
    content: [
      "Crown copyright applies to all primary legislation and statutory instruments cited within the Law Book. These materials are reproduced under the Open Government Licence (OGL) v3.0.",
      "Case law is cited for the purposes of legal analysis and education. Case names, citations, and judicial quotations are used in accordance with established academic practice and are not subject to copyright restrictions when used for commentary and criticism.",
      "Original analytical content contributed by students is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) licence. Contributors retain the moral right to be identified as authors of their work.",
      "Verbatim reproduction of textbook content is strictly prohibited. Contributors must express legal principles in their own words, supported by proper citation to the original source. Failure to comply with this requirement constitutes plagiarism and will result in removal of the contribution and potential disciplinary action.",
    ],
  },
  {
    number: 7,
    title: "Community Guidelines",
    icon: Users,
    content: [
      "The Law Book is a collaborative academic resource. All participants - contributors, reviewers, and editors - are expected to maintain the highest standards of academic integrity, professional courtesy, and mutual respect.",
      "Constructive feedback is essential to the peer review process. Reviewers should provide specific, actionable comments that help contributors improve their work. Personal criticism is not acceptable.",
      "Contributors who receive a 'Changes Requested' review should address all feedback thoroughly and resubmit within 14 days. Submissions that are not revised within this period may be archived.",
      "Plagiarism, fabrication of sources, or deliberate inclusion of inaccurate information will result in immediate removal of the contribution and may lead to suspension from the platform. All contributors are expected to uphold the same standards of academic honesty required by their universities.",
      "Disputes regarding editorial decisions should be raised with the Editorial Board through the appropriate channels. The Editorial Board's decisions are final.",
    ],
  },
  {
    number: 8,
    title: "Editorial Board",
    icon: Shield,
    content: [
      "The Editorial Board is responsible for the overall quality and integrity of the Law Book. The Board comprises senior student editors, faculty advisors, and the platform's academic governance committee.",
      "Senior Student Editors: Final-year law students with demonstrated academic excellence, appointed for a one-year term. Responsible for final review of submissions and editorial policy implementation.",
      "Module Editors: Students with subject-specific expertise who oversee content within their designated area of law. Module Editors coordinate peer reviewers and monitor quality standards.",
      "Faculty Advisors: Academic staff members who provide oversight and guidance on complex legal questions. Faculty Advisors do not participate in routine reviews but may be consulted on disputed points of law.",
      "The Editorial Board meets monthly to review content quality metrics, address editorial policy questions, and consider amendments to the Editorial Policy. All policy changes are communicated to contributors in advance of implementation.",
    ],
  },
];

export default function EditorialPolicyPage() {
  return (
    <div className="pb-8">
      {/* ── Back link ── */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <div className="max-w-content-narrow mx-auto">
          <Link
            href="/law-book"
            className="inline-flex items-center gap-1.5 text-xs text-court-text-ter hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Law Book
          </Link>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="px-4 md:px-6 lg:px-8 mb-8">
        <div className="max-w-content-narrow mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} className="text-gold" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-court-text">
              Editorial Policy
            </h1>
          </div>
          <p className="text-sm text-court-text-sec">
            Standards and procedures governing contributions to the RATIO Law
            Book
          </p>
          <p className="text-court-xs text-court-text-ter mt-2">
            Last revised: 1 February 2026 &middot; Version 3.1
          </p>
        </div>
      </header>

      {/* ── Policy sections ── */}
      <div className="px-4 md:px-6 lg:px-8">
        <div className="max-w-content-narrow mx-auto space-y-5">
          {SECTIONS.map((section) => {
            const SectionIcon = section.icon;
            return (
              <Card key={section.number} className="p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gold-dim flex items-center justify-center shrink-0">
                    <span className="text-sm font-serif font-bold text-gold">
                      {section.number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SectionIcon size={18} className="text-gold" />
                    <h2 className="font-serif text-lg font-bold text-court-text">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="space-y-3 pl-0 md:pl-12">
                  {section.content.map((paragraph, i) => {
                    // Check if paragraph starts with "Stage" or a role name for special formatting
                    const isSubheading =
                      /^(Stage \d|Senior Student Editors|Module Editors|Faculty Advisors|Issue:|Rule:|Application:|Conclusion:)/.test(
                        paragraph
                      );
                    if (isSubheading) {
                      const colonIdx = paragraph.indexOf(":");
                      const heading = paragraph.slice(
                        0,
                        colonIdx >= 0 ? colonIdx + 1 : undefined
                      );
                      const rest =
                        colonIdx >= 0
                          ? paragraph.slice(colonIdx + 1).trim()
                          : "";
                      return (
                        <p
                          key={i}
                          className="text-sm text-court-text-sec leading-relaxed"
                        >
                          <span className="font-bold text-court-text">
                            {heading}
                          </span>{" "}
                          {rest}
                        </p>
                      );
                    }
                    return (
                      <p
                        key={i}
                        className="text-sm text-court-text-sec leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </Card>
            );
          })}

          {/* ── Footer note ── */}
          <div className="text-center pt-4 pb-2">
            <p className="text-court-xs text-court-text-ter leading-relaxed max-w-md mx-auto">
              This Editorial Policy is maintained by the RATIO Editorial Board.
              Questions or suggestions may be directed to the Board through the
              platform&apos;s feedback channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

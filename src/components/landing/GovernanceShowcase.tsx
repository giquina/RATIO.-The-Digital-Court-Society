"use client";

import { motion } from "framer-motion";
import {
  Landmark,
  Vote,
  FileText,
  Gavel,
  Scale,
  Shield,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const MOTIONS_DEMO = [
  {
    title: "Motion to Establish a Mentorship Programme",
    proposer: "Sarah K.",
    status: "voting",
    statusColor: "text-gold",
    statusBg: "bg-gold-dim",
    votesAye: 24,
    votesNo: 8,
  },
  {
    title: "Amendment to Standing Order 7 \u2014 Debate Time Limits",
    proposer: "James M.",
    status: "debating",
    statusColor: "text-blue-400",
    statusBg: "bg-blue-500/10",
    votesAye: 0,
    votesNo: 0,
  },
  {
    title: "Resolution on Cross-University Moot Partnerships",
    proposer: "Amara O.",
    status: "passed",
    statusColor: "text-green-500",
    statusBg: "bg-green-500/10",
    votesAye: 42,
    votesNo: 11,
  },
];

export function GovernanceShowcase() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      {/* Section heading */}
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text text-center mb-3">
        Govern Your Community
      </h2>
      <p className="text-court-base text-court-text-sec text-center max-w-lg mx-auto mb-10">
        Ratio is not just a platform you use. It is a society you run.
        Propose motions in Parliament, vote on policy, and resolve
        disputes through the Tribunal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Parliament Card */}
        <div className="bg-navy-card border border-court-border-light rounded-court p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Landmark size={20} className="text-gold" />
            <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
              PARLIAMENT
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-court-text mb-3">
            Democratic Governance
          </h3>
          <p className="text-court-sm text-court-text-sec leading-relaxed mb-4">
            Propose and debate motions that shape how Ratio operates.
            Every verified Advocate has a vote. Standing orders ensure
            fair procedure. Policy changes require a formal motion, a
            debate period, and a community vote.
          </p>

          {/* Mock motions list */}
          <div className="space-y-2">
            {MOTIONS_DEMO.map((m) => (
              <div
                key={m.title}
                className="bg-navy border border-court-border rounded-lg px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-court-xs font-bold text-court-text line-clamp-1">
                    {m.title}
                  </p>
                  <span
                    className={`text-court-xs font-bold ${m.statusColor} ${m.statusBg} rounded px-1.5 py-0.5 shrink-0 capitalize`}
                  >
                    {m.status}
                  </span>
                </div>
                {m.votesAye > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-navy-mid rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${(m.votesAye / (m.votesAye + m.votesNo)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-court-xs text-court-text-ter">
                      {m.votesAye} Aye / {m.votesNo} No
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tribunal Card */}
        <div className="bg-navy-card border border-court-border-light rounded-court p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gavel size={20} className="text-gold" />
            <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
              TRIBUNAL
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-court-text mb-3">
            Dispute Resolution
          </h3>
          <p className="text-court-sm text-court-text-sec leading-relaxed mb-4">
            When conflicts arise, the Tribunal provides a structured
            process modelled on real judicial procedure. File a case,
            serve notice, exchange submissions, attend a hearing, and
            receive a binding judgment from elected judicial Advocates.
          </p>

          {/* Tribunal process steps */}
          <div className="space-y-3">
            {[
              {
                Icon: FileText,
                label: "File a Case",
                desc: "Submit your application with grounds and evidence",
              },
              {
                Icon: Shield,
                label: "Serve Notice",
                desc: "The respondent is formally notified and given time to respond",
              },
              {
                Icon: BookOpen,
                label: "Exchange Submissions",
                desc: "Both parties submit written arguments and authorities",
              },
              {
                Icon: Scale,
                label: "Hearing & Judgment",
                desc: "Elected judicial Advocates hear the case and deliver judgment",
              },
            ].map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gold-dim border border-gold/25 flex items-center justify-center shrink-0">
                  <span className="font-serif text-court-xs font-bold text-gold">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="text-court-xs font-bold text-court-text flex items-center gap-1.5">
                    <step.Icon size={12} className="text-gold" />
                    {step.label}
                  </p>
                  <p className="text-court-xs text-court-text-ter leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="text-center mt-6">
        <span className="inline-flex items-center gap-2 bg-gold-dim border border-gold/20 rounded-full px-4 py-2 text-court-sm text-gold font-semibold">
          <Vote size={14} />
          Every verified Advocate has a vote
        </span>
      </div>
    </motion.section>
  );
}

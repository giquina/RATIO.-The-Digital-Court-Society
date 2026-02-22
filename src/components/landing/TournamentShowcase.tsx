"use client";

import { motion } from "framer-motion";
import { Swords, Trophy, ArrowRight, Crown } from "lucide-react";

const BRACKET = [
  {
    round: "QF 1",
    p1: { name: "Ali G.", initials: "AG", color: "#6B2D3E", result: "W" },
    p2: { name: "Tom B.", initials: "TB", color: "#2E5090", result: "L" },
  },
  {
    round: "QF 2",
    p1: { name: "Priya S.", initials: "PS", color: "#2E5090", result: "W" },
    p2: { name: "Kate R.", initials: "KR", color: "#3D6B45", result: "L" },
  },
  {
    round: "QF 3",
    p1: { name: "James O.", initials: "JO", color: "#3D6B45", result: null },
    p2: { name: "Sophie C.", initials: "SC", color: "#8B6914", result: null },
  },
  {
    round: "QF 4",
    p1: { name: "Marcus W.", initials: "MW", color: "#8B6914", result: null },
    p2: { name: "Fatima A.", initials: "FA", color: "#6B2D3E", result: null },
  },
];

export function TournamentShowcase() {
  return (
    <motion.section
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
              <Swords size={20} className="text-gold" />
              <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
                COMPETITIVE
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-4">
              Moot Tournaments
            </h2>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              Compete in structured tournaments with single elimination
              or round-robin formats. Track your progress through live
              brackets, advance through rounds, and climb the national
              rankings.
            </p>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-6">
              University mooting societies can create official tournaments,
              and inter-university competitions let your Chamber compete
              against law schools across the country. Every result feeds
              into the national league table.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "16+", label: "Participants" },
                { value: "4", label: "Rounds" },
                { value: "1", label: "Champion" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-navy border border-court-border rounded-lg px-3 py-2 text-center"
                >
                  <p className="font-serif text-lg font-bold text-gold">
                    {stat.value}
                  </p>
                  <p className="text-court-xs text-court-text-ter">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock bracket */}
          <div className="flex-1">
            <div className="bg-navy border border-court-border rounded-court p-4">
              {/* Tournament header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-court-xs font-bold text-court-text">
                    UCL Michaelmas Moot 2026
                  </p>
                  <p className="text-court-xs text-court-text-ter">
                    Public Law &middot; Quarter-Finals
                  </p>
                </div>
                <Trophy size={18} className="text-gold" />
              </div>

              {/* Bracket matches */}
              <div className="space-y-2">
                {BRACKET.map((match) => (
                  <div
                    key={match.round}
                    className="bg-navy-mid border border-court-border-light rounded-lg overflow-hidden"
                  >
                    <div className="px-2 py-1 bg-white/[0.02]">
                      <span className="text-court-xs text-court-text-ter font-bold">
                        {match.round}
                      </span>
                    </div>
                    {/* Player 1 */}
                    <div
                      className={`flex items-center gap-2 px-2.5 py-1.5 ${
                        match.p1.result === "W"
                          ? "bg-green-500/5"
                          : ""
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-court-xs font-bold text-white/80 font-serif shrink-0"
                        style={{ background: match.p1.color }}
                      >
                        {match.p1.initials}
                      </div>
                      <span
                        className={`text-court-xs flex-1 ${
                          match.p1.result === "W"
                            ? "text-court-text font-bold"
                            : "text-court-text-sec"
                        }`}
                      >
                        {match.p1.name}
                      </span>
                      {match.p1.result === "W" && (
                        <Crown size={10} className="text-gold" />
                      )}
                      {match.p1.result === null && (
                        <span className="text-court-xs text-court-text-ter">
                          --
                        </span>
                      )}
                    </div>
                    {/* Divider */}
                    <div className="h-px bg-court-border-light" />
                    {/* Player 2 */}
                    <div
                      className={`flex items-center gap-2 px-2.5 py-1.5 ${
                        match.p2.result === "W"
                          ? "bg-green-500/5"
                          : ""
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-court-xs font-bold text-white/80 font-serif shrink-0"
                        style={{ background: match.p2.color }}
                      >
                        {match.p2.initials}
                      </div>
                      <span
                        className={`text-court-xs flex-1 ${
                          match.p2.result === "W"
                            ? "text-court-text font-bold"
                            : "text-court-text-sec"
                        }`}
                      >
                        {match.p2.name}
                      </span>
                      {match.p2.result === "W" && (
                        <Crown size={10} className="text-gold" />
                      )}
                      {match.p2.result === null && (
                        <span className="text-court-xs text-court-text-ter">
                          --
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-navy rounded-full overflow-hidden">
                  <div className="h-full w-[37%] bg-gold rounded-full" />
                </div>
                <span className="text-court-xs text-court-text-ter">
                  3/8 matches
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

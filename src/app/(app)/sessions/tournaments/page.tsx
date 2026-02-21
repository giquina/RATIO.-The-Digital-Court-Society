"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, Button, Avatar, Tag, ProgressBar } from "@/components/ui";

const TOURNAMENTS = [
  {
    id: "t1",
    name: "UCL Michaelmas Moot 2026",
    module: "Public Law",
    status: "active",
    format: "Single Elimination",
    participants: 16,
    currentRound: "Quarter-Finals",
    startDate: "17 Feb",
    endDate: "15 Mar",
    yourStatus: "Advancing",
    nextMatch: {
      opponent: { name: "Priya Sharma", initials: "PS", chamber: "Lincoln's" },
      date: "Tue 25 Feb",
      time: "14:00",
    },
    bracket: [
      { round: "Round of 16", matches: 8, completed: 8 },
      { round: "Quarter-Finals", matches: 4, completed: 1 },
      { round: "Semi-Finals", matches: 2, completed: 0 },
      { round: "Final", matches: 1, completed: 0 },
    ],
  },
  {
    id: "t2",
    name: "Cross-University Contract Law Cup",
    module: "Contract Law",
    status: "upcoming",
    format: "Round Robin + Knockout",
    participants: 32,
    currentRound: "Registration",
    startDate: "10 Mar",
    endDate: "20 Apr",
    yourStatus: "Registered",
    nextMatch: null,
    bracket: [],
  },
];

const BRACKET_DEMO = [
  { round: "QF 1", p1: { name: "Ali G.", result: "W", initials: "AG" }, p2: { name: "Tom B.", result: "L", initials: "TB" } },
  { round: "QF 2", p1: { name: "Priya S.", result: "W", initials: "PS" }, p2: { name: "Kate R.", result: "L", initials: "KR" } },
  { round: "QF 3", p1: { name: "James O.", result: null, initials: "JO" }, p2: { name: "Sophie C.", result: null, initials: "SC" } },
  { round: "QF 4", p1: { name: "Marcus W.", result: null, initials: "MW" }, p2: { name: "Fatima A.", result: null, initials: "FA" } },
];

export default function TournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const tournament = TOURNAMENTS.find((t) => t.id === selectedTournament);

  if (tournament) {
    return (
      <div className="pb-6">
        <div className="px-5 pt-3 pb-2">
          <button onClick={() => setSelectedTournament(null)} className="text-xs text-court-text-ter">
            &larr; Tournaments
          </button>
        </div>

        {/* Tournament header */}
        <section className="px-4 mb-4">
          <Card className="overflow-hidden" highlight>
            <div className="bg-gold/10 px-4 py-2.5 flex justify-between items-center">
              <Tag color="gold">{tournament.module.toUpperCase()}</Tag>
              <Tag color={tournament.status === "active" ? "green" : "blue"}>
                {tournament.status === "active" ? "LIVE" : "UPCOMING"}
              </Tag>
            </div>
            <div className="p-4">
              <h1 className="font-serif text-lg font-bold text-court-text mb-2">{tournament.name}</h1>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-court-text-sec">
                <div>&#128101; {tournament.participants} participants</div>
                <div>&#127942; {tournament.format}</div>
                <div>&#128197; {tournament.startDate} &ndash; {tournament.endDate}</div>
                <div>&#9878;&#65039; {tournament.currentRound}</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Your status */}
        <section className="px-4 mb-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-court-text tracking-wider uppercase">Your Status</h3>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2.5 py-0.5 rounded-full">
                {tournament.yourStatus}
              </span>
            </div>
            {tournament.nextMatch && (
              <div className="bg-white/[0.02] rounded-xl p-3">
                <p className="text-[10px] text-court-text-ter uppercase tracking-wider mb-2">Next Match</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar initials={tournament.nextMatch.opponent.initials} chamber={tournament.nextMatch.opponent.chamber} size="sm" />
                    <div>
                      <p className="text-xs font-semibold text-court-text">vs {tournament.nextMatch.opponent.name}</p>
                      <p className="text-[10px] text-court-text-ter">{tournament.nextMatch.date} &middot; {tournament.nextMatch.time}</p>
                    </div>
                  </div>
                  <Link href="/sessions/1">
                    <Button size="sm" variant="outline">Prepare</Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Bracket progress */}
        {tournament.bracket.length > 0 && (
          <section className="px-4 mb-4">
            <h3 className="text-xs font-bold text-court-text tracking-wider uppercase mb-3">Tournament Progress</h3>
            <div className="flex flex-col gap-2">
              {tournament.bracket.map((round, i) => (
                <Card key={i} className="px-3.5 py-2.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-court-text">{round.round}</span>
                    <span className="text-[10px] text-court-text-sec">{round.completed}/{round.matches}</span>
                  </div>
                  <ProgressBar pct={(round.completed / round.matches) * 100} height={2} />
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Live bracket */}
        <section className="px-4 mb-4">
          <h3 className="text-xs font-bold text-court-text tracking-wider uppercase mb-3">Quarter-Final Bracket</h3>
          <div className="flex flex-col gap-2">
            {BRACKET_DEMO.map((match, i) => (
              <Card key={i} className="p-3">
                <p className="text-[10px] text-court-text-ter uppercase tracking-wider mb-2">{match.round}</p>
                <div className="flex flex-col gap-1.5">
                  <div className={"flex items-center justify-between py-1.5 rounded-lg px-2 " + (match.p1.result === "W" ? "bg-green-500/5" : "")}>
                    <div className="flex items-center gap-2">
                      <Avatar initials={match.p1.initials} chamber="Gray's" size="xs" />
                      <span className={"text-xs " + (match.p1.result === "W" ? "font-bold text-court-text" : "text-court-text-sec")}>{match.p1.name}</span>
                    </div>
                    {match.p1.result && (
                      <span className={"text-[10px] font-bold " + (match.p1.result === "W" ? "text-green-500" : "text-red-400")}>{match.p1.result}</span>
                    )}
                  </div>
                  <div className="text-center text-[9px] text-court-text-ter">vs</div>
                  <div className={"flex items-center justify-between py-1.5 rounded-lg px-2 " + (match.p2.result === "W" ? "bg-green-500/5" : "")}>
                    <div className="flex items-center gap-2">
                      <Avatar initials={match.p2.initials} chamber="Lincoln's" size="xs" />
                      <span className={"text-xs " + (match.p2.result === "W" ? "font-bold text-court-text" : "text-court-text-sec")}>{match.p2.name}</span>
                    </div>
                    {match.p2.result && (
                      <span className={"text-[10px] font-bold " + (match.p2.result === "W" ? "text-green-500" : "text-red-400")}>{match.p2.result}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Tournaments</h1>
            <p className="text-xs text-court-text-sec">Competitive mooting brackets</p>
          </div>
          <Link href="/sessions">
            <Button size="sm" variant="ghost">&larr; Sessions</Button>
          </Link>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {TOURNAMENTS.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden" onClick={() => setSelectedTournament(t.id)}>
              <div className="px-4 py-2.5 flex justify-between items-center border-b border-court-border-light">
                <div className="flex gap-2 items-center">
                  <Tag color="gold">{t.module.toUpperCase()}</Tag>
                  <Tag color={t.status === "active" ? "green" : "blue"}>
                    {t.status === "active" ? "LIVE" : "UPCOMING"}
                  </Tag>
                </div>
                <span className="text-[10px] text-court-text-ter">{t.participants} entrants</span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-court-text mb-2">{t.name}</h3>
                <div className="flex gap-4 text-[11px] text-court-text-sec mb-3">
                  <span>&#127942; {t.format}</span>
                  <span>&#128197; {t.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-court-text-sec">
                    &#9878;&#65039; {t.currentRound}
                  </span>
                  <span className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full " +
                    (t.yourStatus === "Advancing" ? "text-green-500 bg-green-500/10" : "text-blue-400 bg-blue-400/10")
                  }>
                    {t.yourStatus}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

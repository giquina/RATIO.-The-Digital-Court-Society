"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Tag } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import { ArrowLeft, BookOpen, Search } from "lucide-react";

// Pre-seeded standing orders — TODO: Replace with useQuery(api.governance.executive.getStandingOrders)
const STANDING_ORDERS = [
  {
    number: 1,
    title: "General Provisions",
    category: "procedure",
    content:
      "These Standing Orders govern the proceedings of the Ratio General Assembly and its subsidiary bodies. They may be amended only by a motion passed with a two-thirds majority of voting members present.",
    status: "active",
  },
  {
    number: 2,
    title: "Membership and Tiers",
    category: "membership",
    content:
      "All verified UK law students are eligible for membership. Governance tiers are calculated automatically based on contribution points, moot participation, and average performance scores. Tier progression is: Member → Accredited → Voting → Constitutional → Judicial.",
    status: "active",
  },
  {
    number: 3,
    title: "Motions and Proposals",
    category: "procedure",
    content:
      "Any member with Voting tier or above may table a motion. All motions must be structured using IRAC format (Issue, Rule, Application, Conclusion). A motion must be seconded by another Voting member before it proceeds to debate. The proposer may not second their own motion.",
    status: "active",
  },
  {
    number: 4,
    title: "Debate Procedure",
    category: "procedure",
    content:
      "Debate on a motion shall be conducted in an orderly manner. The Speaker shall recognise speakers alternating between those speaking for and against the motion. Each contribution shall be limited to 500 words. Points of order may be raised at any time and shall be dealt with immediately by the Speaker.",
    status: "active",
  },
  {
    number: 5,
    title: "Voting",
    category: "procedure",
    content:
      "Voting shall be open for 72 hours from the close of debate. Members with Voting tier or above may cast one vote: Aye, No, or Abstain. A simple majority of those voting (excluding abstentions) is required for passage, except where otherwise specified. Quorum is 20% of eligible voters.",
    status: "active",
  },
  {
    number: 6,
    title: "Constitutional Amendments",
    category: "governance",
    content:
      "Motions categorised as 'constitutional' require a two-thirds supermajority for passage. Only members with Constitutional tier or above may propose constitutional amendments. The voting period for constitutional motions is extended to 7 days.",
    status: "active",
  },
  {
    number: 7,
    title: "Code of Conduct",
    category: "conduct",
    content:
      "All members shall conduct themselves with the decorum expected of the legal profession. Defamatory, harassing, or vexatious behaviour is prohibited. The Conduct Code (published separately) provides detailed guidance. Breaches are handled through the moderation process and, where appropriate, the Digital Review Tribunal.",
    status: "active",
  },
  {
    number: 8,
    title: "Digital Review Tribunal",
    category: "governance",
    content:
      "The Digital Review Tribunal is the judicial body of Ratio. Cases may be filed by any Accredited member or above. The Tribunal shall comprise a presiding judge (Judicial tier) and, for appeals, a panel of three. Judgments are published and form binding precedent within the Society.",
    status: "active",
  },
  {
    number: 9,
    title: "Moderation and Sanctions",
    category: "conduct",
    content:
      "Moderation actions follow the principle of proportionality. The escalation path is: Warning → Content Removal → Temporary Restriction → Referral to Tribunal. Every sanction requires a written proportionality assessment. Respondents have 48 hours to submit a statement before action is taken.",
    status: "active",
  },
  {
    number: 10,
    title: "Data Protection and Privacy",
    category: "governance",
    content:
      "All governance proceedings are conducted in compliance with UK GDPR. Votes are pseudonymised during the voting period and made public upon close. Members may request erasure of their contributions; published judgments will be anonymised rather than deleted. Student ID data is encrypted and used solely for verification.",
    status: "active",
  },
];

const CATEGORIES = ["all", "procedure", "membership", "governance", "conduct"];

export default function StandingOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = STANDING_ORDERS.filter((so) => {
    const matchesCategory = filter === "all" || so.category === filter;
    const matchesSearch =
      !search ||
      so.title.toLowerCase().includes(search.toLowerCase()) ||
      so.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <VerifiedOnly>
      <div className="pb-6 md:max-w-content-narrow mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <Link
            href="/parliament"
            className="flex items-center gap-1.5 text-court-text-sec text-xs mb-3 hover:text-court-text transition-colors"
          >
            <ArrowLeft size={14} />
            Parliament
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-gold" />
            <h1 className="font-serif text-2xl font-bold text-court-text">
              Standing Orders
            </h1>
          </div>
          <p className="text-xs text-court-text-sec mt-1">
            The procedural rules governing the Ratio General Assembly
          </p>
        </div>

        {/* Search */}
        <section className="px-4 md:px-6 lg:px-8 mb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-court-text-ter" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search standing orders..."
              className="w-full bg-navy-card border border-court-border rounded-xl pl-9 pr-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
            />
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-4 md:px-6 lg:px-8 mb-4">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-court-xs font-bold capitalize whitespace-nowrap transition-all ${
                  filter === c
                    ? "bg-gold-dim text-gold border border-gold/20"
                    : "text-court-text-sec hover:bg-white/[0.04]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Orders List */}
        <section className="px-4 md:px-6 lg:px-8 space-y-2">
          {filtered.map((so) => (
            <Card key={so.number} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-court-xs font-bold text-gold bg-gold-dim px-2 py-0.5 rounded">
                    SO {so.number}
                  </span>
                  <h3 className="text-court-base font-bold text-court-text">{so.title}</h3>
                </div>
                <Tag color="green" small>Active</Tag>
              </div>
              <p className="text-court-sm text-court-text-sec leading-relaxed">
                {so.content}
              </p>
              <p className="text-court-xs text-court-text-ter mt-2 capitalize">
                Category: {so.category}
              </p>
            </Card>
          ))}
        </section>
      </div>
    </VerifiedOnly>
  );
}

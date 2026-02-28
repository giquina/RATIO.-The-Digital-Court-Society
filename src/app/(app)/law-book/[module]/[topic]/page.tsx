"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Tag, Button } from "@/components/ui";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Quote,
  GitBranch,
  Edit,
  Copy,
  Check,
  AlertTriangle,
  ScrollText,
  Gavel,
  Landmark,
  Scale,
  Globe,
  Building2,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { analytics } from "@/lib/analytics";

// ── Module icons ──
const MODULE_ICONS: Record<string, LucideIcon> = {
  contract: ScrollText,
  criminal: Gavel,
  tort: AlertTriangle,
  public: Landmark,
  "equity-trusts": Scale,
  "eu-international": Globe,
  property: Building2,
  constitutional: Shield,
};

const MODULE_TITLES: Record<string, string> = {
  contract: "Contract Law",
  criminal: "Criminal Law",
  tort: "Tort Law",
  public: "Public Law",
  "equity-trusts": "Equity & Trusts",
  "eu-international": "EU / International",
  property: "Property Law",
  constitutional: "Constitutional Law",
};

// ── Full demo topic: Offer and Acceptance ──
const DEMO_TOPIC = {
  slug: "offer-and-acceptance",
  module: "contract",
  title: "Offer and Acceptance",
  status: "Published" as const,
  lastUpdated: "14 February 2026",
  citations: 24,
  version: 7,
  contributors: [
    { name: "Ali Giquina", initials: "AG" },
    { name: "Priya Sharma", initials: "PS" },
    { name: "James Okafor", initials: "JO" },
    { name: "Sophie Chen", initials: "SC" },
  ],
  issue: {
    content: `The central legal question is: what constitutes a valid offer and a valid acceptance under English contract law, and at what point does a binding agreement come into existence?

This topic addresses the fundamental building blocks of contractual formation. A contract cannot exist without a clear offer by one party and an unqualified acceptance of that offer by another. The distinction between an offer and an invitation to treat is crucial, as is the question of when and how acceptance must be communicated.

The rules surrounding offer and acceptance have been developed through centuries of case law and remain one of the most examined areas in contract law assessments.`,
  },
  rule: {
    content: `An offer is an expression of willingness to contract on specified terms, made with the intention that it will become binding as soon as it is accepted by the person to whom it is addressed.`,
    statute: `There is no single statute governing offer and acceptance in English law. The rules are primarily derived from common law. However, the following statutory provisions are relevant:`,
    statutes: [
      "Sale of Goods Act 1979, s.57(2) — auctions",
      "Consumer Rights Act 2015 — consumer contracts",
      "Electronic Commerce (EC Directive) Regulations 2002 — electronic contracts",
    ],
    caseLaw: [
      {
        name: "Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256",
        principle:
          "A unilateral offer can be made to the world at large. The advertisement constituted an offer, not an invitation to treat, because of the deposit of \u00a31,000 showing sincerity.",
      },
      {
        name: "Fisher v Bell [1961] 1 QB 394",
        principle:
          "Display of goods in a shop window is an invitation to treat, not an offer. The shopkeeper is inviting customers to make offers.",
      },
      {
        name: "Pharmaceutical Society of Great Britain v Boots Cash Chemists [1953] 1 QB 401",
        principle:
          "Display of goods on a self-service shelf is an invitation to treat. The offer is made by the customer at the cash desk.",
      },
      {
        name: "Entores Ltd v Miles Far East Corporation [1955] 2 QB 327",
        principle:
          "For instantaneous communications, acceptance takes effect when and where it is received by the offeror.",
      },
      {
        name: "Adams v Lindsell (1818) 1 B & Ald 681",
        principle:
          "The postal rule: acceptance by post takes effect when the letter is posted, not when it is received.",
      },
      {
        name: "Hyde v Wrench (1840) 3 Beav 334",
        principle:
          "A counter-offer destroys the original offer. The original offer cannot subsequently be accepted.",
      },
    ],
  },
  application: {
    content: `The distinction between offers and invitations to treat has been consistently applied across different commercial contexts:`,
    cases: [
      {
        scenario: "Advertisements",
        analysis:
          "Generally, advertisements are invitations to treat (Partridge v Crittenden [1968]). However, where the advertisement is sufficiently specific and indicates an intention to be bound, it may constitute a unilateral offer (Carlill v Carbolic Smoke Ball Co [1893]). The key distinguishing factor is whether the advertiser has shown an intention to be bound without further negotiation.",
      },
      {
        scenario: "Shop displays",
        analysis:
          "Following Pharmaceutical Society v Boots [1953] and Fisher v Bell [1961], goods displayed in shops and shop windows are invitations to treat. This protects the shopkeeper from being bound by inadvertent pricing errors and preserves their freedom to choose with whom to contract. The customer makes the offer at the checkout, which the shopkeeper is free to accept or reject.",
      },
      {
        scenario: "Auctions",
        analysis:
          "At an auction, each bid is an offer which the auctioneer may accept or reject by the fall of the hammer (Sale of Goods Act 1979, s.57(2)). An advertisement that goods will be sold by auction is not an offer to hold the auction (Harris v Nickerson (1873)). However, an auction advertised as 'without reserve' creates a collateral contract that the highest bidder will be successful (Barry v Davies [2000]).",
      },
      {
        scenario: "Communication of acceptance",
        analysis:
          "The general rule is that acceptance must be communicated to the offeror (Entores v Miles Far East [1955]). The postal rule (Adams v Lindsell (1818)) provides an exception where acceptance by post takes effect upon posting. For electronic communications, the position follows Entores: acceptance is effective upon receipt (Brinkibon v Stahag Stahl [1983]). The offeror may prescribe or waive the mode of acceptance.",
      },
    ],
  },
  conclusion: {
    content: `The law of offer and acceptance remains well-settled in its core principles but continues to evolve in response to modern commercial practices. The fundamental requirements are clear:

1. A valid offer must be distinguished from an invitation to treat, a statement of intention, or a supply of information.

2. An offer may be terminated by revocation (before acceptance), rejection, counter-offer, lapse of time, failure of a condition, or death of the offeror.

3. Acceptance must be unqualified, communicated to the offeror, and made in response to the offer. The 'mirror image' rule requires that acceptance must correspond exactly with the terms of the offer.

4. The postal rule provides a significant exception to the requirement of communication, but its scope is narrow and it does not apply to instantaneous forms of communication.

The primary area of ongoing development relates to electronic contracts and the application of traditional rules to digital communications. The Electronic Commerce Regulations 2002 provide some guidance, but many questions remain to be resolved by the courts.

For examination purposes, students should be prepared to apply the distinction between offers and invitations to treat across various factual scenarios, and to analyse the rules on communication of acceptance, particularly the postal rule and its exceptions.`,
  },
  oscola: [
    {
      type: "Case",
      ref: "Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256 (CA)",
    },
    {
      type: "Case",
      ref: "Fisher v Bell [1961] 1 QB 394 (DC)",
    },
    {
      type: "Case",
      ref: "Pharmaceutical Society of Great Britain v Boots Cash Chemists (Southern) Ltd [1953] 1 QB 401 (CA)",
    },
    {
      type: "Case",
      ref: "Entores Ltd v Miles Far East Corporation [1955] 2 QB 327 (CA)",
    },
    {
      type: "Case",
      ref: "Adams v Lindsell (1818) 1 B & Ald 681",
    },
    {
      type: "Case",
      ref: "Hyde v Wrench (1840) 3 Beav 334",
    },
    {
      type: "Case",
      ref: "Partridge v Crittenden [1968] 1 WLR 1204 (DC)",
    },
    {
      type: "Case",
      ref: "Barry v Davies [2000] 1 WLR 1962 (CA)",
    },
    {
      type: "Case",
      ref: "Brinkibon v Stahag Stahl und Stahlwarenhandelsgesellschaft mbH [1983] 2 AC 34 (HL)",
    },
    {
      type: "Case",
      ref: "Harris v Nickerson (1873) LR 8 QB 286",
    },
    {
      type: "Statute",
      ref: "Sale of Goods Act 1979, s 57(2)",
    },
    {
      type: "Statute",
      ref: "Consumer Rights Act 2015",
    },
    {
      type: "Statute",
      ref: "Electronic Commerce (EC Directive) Regulations 2002, SI 2002/2013",
    },
    {
      type: "Textbook",
      ref: "Ewan McKendrick, Contract Law: Text, Cases, and Materials (10th edn, OUP 2024)",
    },
    {
      type: "Textbook",
      ref: "Jill Poole, Textbook on Contract Law (16th edn, OUP 2024)",
    },
    {
      type: "Article",
      ref: 'Simon Gardner, "Trashing with Trolley: A Critique of the Boots Decision" (1993) 12 OJLS 145',
    },
  ],
};

// Fallback for other topics
function generateFallbackTopic(module: string, topic: string) {
  const title = topic
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title,
    module,
    status: "Published" as const,
    lastUpdated: "8 February 2026",
    citations: 12,
    version: 3,
  };
}

export default function TopicReadingPage() {
  const params = useParams();
  const moduleSlug = params.module as string;
  const topicSlug = params.topic as string;
  const [citeCopied, setCiteCopied] = useState(false);

  useEffect(() => {
    analytics.lawBookViewed(moduleSlug, topicSlug);
  }, [moduleSlug, topicSlug]);

  const isDemo =
    moduleSlug === "contract" && topicSlug === "offer-and-acceptance";
  const moduleName = MODULE_TITLES[moduleSlug] ?? moduleSlug;
  const ModuleIcon = MODULE_ICONS[moduleSlug] ?? BookOpen;

  const fallback = !isDemo ? generateFallbackTopic(moduleSlug, topicSlug) : null;

  const handleCite = () => {
    const citation = isDemo
      ? `'Offer and Acceptance' in RATIO Law Book (Contract Law, v7, 14 February 2026)`
      : `'${fallback?.title ?? "Unknown"}' in RATIO Law Book (${moduleName}, v${fallback?.version ?? 1}, ${fallback?.lastUpdated ?? "Unknown"})`;
    navigator.clipboard.writeText(citation).then(() => {
      setCiteCopied(true);
      setTimeout(() => setCiteCopied(false), 2000);
    });
  };

  if (!isDemo) {
    // Simplified view for non-demo topics
    return (
      <div className="pb-6">
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
          <div className="max-w-content-narrow mx-auto">
            <Link
              href={`/law-book/${moduleSlug}`}
              className="inline-flex items-center gap-1.5 text-court-sm text-court-text-ter hover:text-gold transition-colors"
            >
              <ArrowLeft size={14} /> Back to {moduleName}
            </Link>
          </div>
        </div>
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-content-narrow mx-auto text-center py-16">
            <BookOpen
              size={40}
              className="text-court-text-ter mx-auto mb-4"
            />
            <h1 className="font-serif text-xl font-bold text-court-text mb-2">
              {fallback?.title}
            </h1>
            <p className="text-court-base text-court-text-sec mb-4">
              Full content for this topic is being developed by contributors.
            </p>
            <div className="flex items-center justify-center gap-3 text-court-xs text-court-text-ter mb-6">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {fallback?.lastUpdated}
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1">
                <Quote size={12} /> {fallback?.citations} citations
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1">
                <GitBranch size={12} /> Version {fallback?.version}
              </span>
            </div>
            <Link href="/law-book/contribute">
              <Button variant="outline" size="sm">
                Contribute to this topic
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Full demo topic rendering ──
  return (
    <div className="pb-8">
      {/* ── Back link ── */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <div className="max-w-content-narrow mx-auto">
          <Link
            href={`/law-book/${moduleSlug}`}
            className="inline-flex items-center gap-1.5 text-court-sm text-court-text-ter hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to {moduleName}
          </Link>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="max-w-content-narrow mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Tag color="gold">{moduleName.toUpperCase()}</Tag>
            <span className="text-court-xs font-bold tracking-wider border rounded px-1.5 py-0.5 text-green-500 bg-green-500/10 border-green-500/20">
              PUBLISHED
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
            {DEMO_TOPIC.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-court-xs text-court-text-ter">
            <span className="flex items-center gap-1">
              <Clock size={12} /> Last updated {DEMO_TOPIC.lastUpdated}
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Quote size={12} /> {DEMO_TOPIC.citations} citations
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <GitBranch size={12} /> Version {DEMO_TOPIC.version}
            </span>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2.5 mt-4">
            <Link href="/law-book/contribute">
              <Button size="sm" variant="secondary">
                <span className="flex items-center gap-1.5">
                  <Edit size={14} /> Edit
                </span>
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={handleCite}>
              <span className="flex items-center gap-1.5">
                {citeCopied ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
                {citeCopied ? "Copied" : "Cite This"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── IRAC Content ── */}
      <div className="px-4 md:px-6 lg:px-8 space-y-5">
        <div className="max-w-content-narrow mx-auto space-y-5">
          {/* Issue */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <AlertTriangle size={16} className="text-blue-400" />
              </div>
              <h2 className="font-serif text-lg font-bold text-court-text">
                Issue
              </h2>
            </div>
            {DEMO_TOPIC.issue.content.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-court-base text-court-text-sec leading-relaxed mb-3 last:mb-0"
              >
                {para}
              </p>
            ))}
          </Card>

          {/* Rule */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-dim flex items-center justify-center">
                <BookOpen size={16} className="text-gold" />
              </div>
              <h2 className="font-serif text-lg font-bold text-court-text">
                Rule
              </h2>
            </div>

            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              {DEMO_TOPIC.rule.content}
            </p>

            {/* Statutory provisions */}
            <h3 className="font-serif text-base font-bold text-court-text mb-2">
              Statutory Provisions
            </h3>
            <p className="text-court-base text-court-text-sec leading-relaxed mb-3">
              {DEMO_TOPIC.rule.statute}
            </p>
            <ul className="space-y-1.5 mb-5">
              {DEMO_TOPIC.rule.statutes.map((s, i) => (
                <li
                  key={i}
                  className="text-court-base text-court-text-sec flex items-start gap-2"
                >
                  <span className="text-gold mt-0.5">&bull;</span>
                  {s}
                </li>
              ))}
            </ul>

            {/* Key cases */}
            <h3 className="font-serif text-base font-bold text-court-text mb-3">
              Key Authorities
            </h3>
            <div className="space-y-3">
              {DEMO_TOPIC.rule.caseLaw.map((c, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] rounded-lg p-3.5 border-l-[3px] border-gold/40"
                >
                  <p className="text-court-base font-bold text-court-text mb-1.5">
                    {c.name}
                  </p>
                  <p className="text-court-sm text-court-text-sec leading-relaxed">
                    {c.principle}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Application */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Scale size={16} className="text-green-500" />
              </div>
              <h2 className="font-serif text-lg font-bold text-court-text">
                Application
              </h2>
            </div>

            <p className="text-court-base text-court-text-sec leading-relaxed mb-4">
              {DEMO_TOPIC.application.content}
            </p>

            <div className="space-y-4">
              {DEMO_TOPIC.application.cases.map((c, i) => (
                <div key={i}>
                  <h3 className="font-serif text-base font-bold text-court-text mb-2">
                    {c.scenario}
                  </h3>
                  <p className="text-court-base text-court-text-sec leading-relaxed">
                    {c.analysis}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Conclusion */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center">
                <Gavel size={16} className="text-purple-400" />
              </div>
              <h2 className="font-serif text-lg font-bold text-court-text">
                Conclusion
              </h2>
            </div>
            {DEMO_TOPIC.conclusion.content.split("\n\n").map((para, i) => {
              // Check if this paragraph starts with a number — render as list item
              if (/^\d+\./.test(para)) {
                return (
                  <p
                    key={i}
                    className="text-court-base text-court-text-sec leading-relaxed mb-2 pl-4"
                  >
                    {para}
                  </p>
                );
              }
              return (
                <p
                  key={i}
                  className="text-court-base text-court-text-sec leading-relaxed mb-3 last:mb-0"
                >
                  {para}
                </p>
              );
            })}
          </Card>

          {/* Citations */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                <Quote size={16} className="text-orange-400" />
              </div>
              <h2 className="font-serif text-lg font-bold text-court-text">
                References
              </h2>
              <span className="text-court-xs text-court-text-ter ml-auto">
                OSCOLA format
              </span>
            </div>

            {/* Group by type */}
            {(["Case", "Statute", "Textbook", "Article"] as const).map(
              (type) => {
                const refs = DEMO_TOPIC.oscola.filter((r) => r.type === type);
                if (refs.length === 0) return null;
                return (
                  <div key={type} className="mb-4 last:mb-0">
                    <h3 className="text-court-xs text-court-text-ter uppercase tracking-widest font-bold mb-2">
                      {type === "Case"
                        ? "Table of Cases"
                        : type === "Statute"
                          ? "Table of Legislation"
                          : type === "Textbook"
                            ? "Secondary Sources"
                            : "Journal Articles"}
                    </h3>
                    <ul className="space-y-1.5">
                      {refs.map((r, i) => (
                        <li
                          key={i}
                          className="text-court-sm text-court-text-sec leading-relaxed"
                        >
                          {r.type === "Case" ? (
                            <span className="italic">{r.ref}</span>
                          ) : (
                            r.ref
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
            )}
          </Card>

          {/* Contributors */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-court-xs text-court-text-ter">
                  Contributors:
                </span>
                <div className="flex -space-x-2">
                  {DEMO_TOPIC.contributors.map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-navy-light border-2 border-navy-card flex items-center justify-center text-court-xs font-bold text-court-text"
                      title={c.name}
                    >
                      {c.initials}
                    </div>
                  ))}
                </div>
                <span className="text-court-xs text-court-text-ter">
                  +{DEMO_TOPIC.contributors.length} others
                </span>
              </div>
              <Link
                href="/law-book/changelog"
                className="text-court-xs text-gold font-semibold hover:underline"
              >
                View history
              </Link>
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="bg-orange-400/[0.06] border border-orange-400/15 rounded-court p-4 flex gap-3">
            <AlertTriangle
              size={18}
              className="text-orange-400 shrink-0 mt-0.5"
            />
            <div>
              <p className="text-court-sm text-orange-400 font-bold mb-1">
                Disclaimer
              </p>
              <p className="text-court-xs text-court-text-sec leading-relaxed">
                Student-generated analysis. Not legal advice. Always verify
                against primary sources. This content has been peer-reviewed
                but may contain errors or omissions. Consult authoritative
                legal texts and practitioners for definitive guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

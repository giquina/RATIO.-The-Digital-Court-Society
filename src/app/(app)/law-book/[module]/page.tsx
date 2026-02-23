"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Hash,
  Users,
  Quote,
  Eye,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { Card, Tag, Button, DynamicIcon, EmptyState } from "@/components/ui";
import { getModuleBySlug } from "@/lib/constants/modules";
import {
  getSuggestionsForModule,
  getPromptsForModule,
  getCaseSpotlight,
  type TopicSuggestion,
  type DiscussionPrompt as DiscussionPromptType,
} from "@/lib/ai/topic-engine";
import LivePulse from "@/components/modules/LivePulse";
import AISuggestions from "@/components/modules/AISuggestions";
import DiscussionPrompts from "@/components/modules/DiscussionPrompts";
import CaseSpotlight from "@/components/modules/CaseSpotlight";
import TrendingDebates from "@/components/modules/TrendingDebates";

// ── Types ──
interface Topic {
  slug: string;
  title: string;
  summary: string;
  status: "Published" | "Under Review" | "Draft";
  contributors: number;
  citations: number;
  views: number;
}

// ── Demo topics by module slug ──
const TOPICS_MAP: Record<string, Topic[]> = {
  contract: [
    {
      slug: "offer-and-acceptance",
      title: "Offer and Acceptance",
      summary:
        "The rules governing how a valid offer is made, communicated, and accepted to form a binding agreement under English law.",
      status: "Published",
      contributors: 8,
      citations: 24,
      views: 1842,
    },
    {
      slug: "consideration",
      title: "Consideration",
      summary:
        "The doctrine of consideration as a requirement for a legally binding contract, including sufficiency, past consideration, and promissory estoppel.",
      status: "Published",
      contributors: 6,
      citations: 19,
      views: 1523,
    },
    {
      slug: "terms",
      title: "Terms of a Contract",
      summary:
        "Classification of contractual terms as conditions, warranties, and innominate terms, and the distinction between express and implied terms.",
      status: "Published",
      contributors: 5,
      citations: 16,
      views: 1287,
    },
    {
      slug: "misrepresentation",
      title: "Misrepresentation",
      summary:
        "Types of misrepresentation (fraudulent, negligent, innocent) and the remedies available under common law and the Misrepresentation Act 1967.",
      status: "Under Review",
      contributors: 3,
      citations: 15,
      views: 756,
    },
    {
      slug: "frustration",
      title: "Frustration of Contract",
      summary:
        "When a contract is discharged by frustration due to a supervening event that renders performance impossible, illegal, or radically different.",
      status: "Under Review",
      contributors: 2,
      citations: 8,
      views: 412,
    },
    {
      slug: "remedies",
      title: "Remedies for Breach",
      summary:
        "Damages, specific performance, injunctions, and restitutionary remedies available for breach of contract under English law.",
      status: "Draft",
      contributors: 1,
      citations: 11,
      views: 389,
    },
  ],
  criminal: [
    {
      slug: "mens-rea",
      title: "Mens Rea",
      summary:
        "The mental element required for criminal liability: intention, recklessness, negligence, and the distinction between direct and oblique intent.",
      status: "Published",
      contributors: 7,
      citations: 22,
      views: 2103,
    },
    {
      slug: "actus-reus",
      title: "Actus Reus",
      summary:
        "The physical element of a crime including voluntary acts, omissions, causation, and the state of affairs doctrine.",
      status: "Published",
      contributors: 6,
      citations: 18,
      views: 1876,
    },
    {
      slug: "homicide",
      title: "Homicide",
      summary:
        "Murder, voluntary manslaughter (loss of control, diminished responsibility), involuntary manslaughter (unlawful act, gross negligence).",
      status: "Published",
      contributors: 8,
      citations: 26,
      views: 1954,
    },
    {
      slug: "defences",
      title: "General Defences",
      summary:
        "Self-defence, duress, necessity, automatism, intoxication, and insanity as defences to criminal charges.",
      status: "Under Review",
      contributors: 4,
      citations: 14,
      views: 1245,
    },
    {
      slug: "theft",
      title: "Theft and Property Offences",
      summary:
        "The offence under s.1 Theft Act 1968: dishonest appropriation of property belonging to another with intention to permanently deprive.",
      status: "Published",
      contributors: 5,
      citations: 16,
      views: 1098,
    },
    {
      slug: "sexual-offences",
      title: "Sexual Offences",
      summary:
        "The Sexual Offences Act 2003, consent, the reasonable belief test, and the statutory framework for sexual offences.",
      status: "Draft",
      contributors: 2,
      citations: 10,
      views: 654,
    },
  ],
  tort: [
    {
      slug: "negligence",
      title: "Negligence",
      summary:
        "The foundational tort requiring proof of duty, breach, causation, and damage, as established in Donoghue v Stevenson.",
      status: "Published",
      contributors: 9,
      citations: 28,
      views: 2015,
    },
    {
      slug: "duty-of-care",
      title: "Duty of Care",
      summary:
        "Establishing a duty of care through the Caparo three-stage test: foreseeability, proximity, and fair, just and reasonable.",
      status: "Published",
      contributors: 7,
      citations: 21,
      views: 1876,
    },
    {
      slug: "causation",
      title: "Causation and Remoteness",
      summary:
        "Factual causation (but for test), legal causation, novus actus interveniens, and remoteness of damage (The Wagon Mound).",
      status: "Published",
      contributors: 6,
      citations: 19,
      views: 1678,
    },
    {
      slug: "occupiers-liability",
      title: "Occupiers' Liability",
      summary:
        "Duties owed by occupiers to visitors (OLA 1957) and trespassers (OLA 1984), including the scope of 'occupier' and 'premises'.",
      status: "Under Review",
      contributors: 3,
      citations: 12,
      views: 945,
    },
    {
      slug: "nuisance",
      title: "Private Nuisance",
      summary:
        "Unreasonable interference with a person's use or enjoyment of land, including locality, duration, and sensitivity factors.",
      status: "Under Review",
      contributors: 2,
      citations: 9,
      views: 567,
    },
    {
      slug: "defamation",
      title: "Defamation",
      summary:
        "The Defamation Act 2013, the serious harm threshold, defences of truth, honest opinion, and public interest.",
      status: "Draft",
      contributors: 1,
      citations: 7,
      views: 432,
    },
  ],
  public: [
    {
      slug: "judicial-review",
      title: "Judicial Review",
      summary:
        "The process by which courts supervise the exercise of public power, including grounds of illegality, irrationality, and procedural impropriety.",
      status: "Published",
      contributors: 8,
      citations: 26,
      views: 2340,
    },
    {
      slug: "separation-of-powers",
      title: "Separation of Powers",
      summary:
        "The constitutional doctrine dividing governmental authority into legislative, executive, and judicial branches in the UK.",
      status: "Published",
      contributors: 5,
      citations: 14,
      views: 1234,
    },
    {
      slug: "rule-of-law",
      title: "The Rule of Law",
      summary:
        "Dicey's formulation, modern interpretations by Lord Bingham, and the constitutional significance of the rule of law.",
      status: "Published",
      contributors: 6,
      citations: 18,
      views: 1543,
    },
    {
      slug: "parliamentary-sovereignty",
      title: "Parliamentary Sovereignty",
      summary:
        "The doctrine that Parliament is the supreme legal authority, its relationship with EU law, and challenges to orthodoxy.",
      status: "Under Review",
      contributors: 4,
      citations: 20,
      views: 1098,
    },
    {
      slug: "human-rights-act",
      title: "Human Rights Act 1998",
      summary:
        "The incorporation of the ECHR into domestic law, sections 3, 4, and 6 HRA, and the relationship between courts and Parliament.",
      status: "Published",
      contributors: 7,
      citations: 22,
      views: 1876,
    },
    {
      slug: "prerogative-powers",
      title: "Prerogative Powers",
      summary:
        "The residual powers of the Crown, their exercise by ministers, judicial reviewability, and the GCHQ and Miller decisions.",
      status: "Draft",
      contributors: 2,
      citations: 12,
      views: 654,
    },
  ],
  "equity-trusts": [
    {
      slug: "express-trusts",
      title: "Express Trusts",
      summary:
        "The three certainties (intention, subject matter, objects), constitution of trusts, and the rule in Milroy v Lord.",
      status: "Published",
      contributors: 6,
      citations: 18,
      views: 1456,
    },
    {
      slug: "resulting-trusts",
      title: "Resulting Trusts",
      summary:
        "Automatic and presumed resulting trusts, voluntary transfers, and contributions to purchase price.",
      status: "Published",
      contributors: 5,
      citations: 16,
      views: 1345,
    },
    {
      slug: "constructive-trusts",
      title: "Constructive Trusts",
      summary:
        "Trusts arising by operation of law, common intention constructive trusts, proprietary estoppel, and the family home.",
      status: "Under Review",
      contributors: 3,
      citations: 12,
      views: 987,
    },
    {
      slug: "breach-of-trust",
      title: "Breach of Trust",
      summary:
        "Liability of trustees for breach, personal and proprietary remedies, equitable compensation, and the relief under s.61 TA 1925.",
      status: "Under Review",
      contributors: 4,
      citations: 14,
      views: 876,
    },
    {
      slug: "tracing",
      title: "Tracing",
      summary:
        "Common law and equitable tracing rules, following assets through substitutions, and claims against mixed funds.",
      status: "Draft",
      contributors: 2,
      citations: 10,
      views: 654,
    },
  ],
  eu: [
    {
      slug: "direct-effect",
      title: "Direct Effect of EU Law",
      summary:
        "The principle that EU law can create rights enforceable by individuals in national courts (Van Gend en Loos).",
      status: "Published",
      contributors: 5,
      citations: 16,
      views: 1234,
    },
    {
      slug: "supremacy",
      title: "Supremacy of EU Law",
      summary:
        "The doctrine established in Costa v ENEL that EU law takes precedence over conflicting national law, and post-Brexit implications.",
      status: "Published",
      contributors: 4,
      citations: 14,
      views: 1098,
    },
    {
      slug: "free-movement",
      title: "Free Movement",
      summary:
        "Articles 28-36 TFEU on goods, free movement of persons and services, the Dassonville formula, and Cassis de Dijon.",
      status: "Under Review",
      contributors: 3,
      citations: 12,
      views: 876,
    },
    {
      slug: "state-aid",
      title: "State Aid",
      summary:
        "The prohibition on state aid under Article 107 TFEU, the de minimis rule, and the role of the European Commission.",
      status: "Under Review",
      contributors: 2,
      citations: 8,
      views: 543,
    },
    {
      slug: "competition",
      title: "EU Competition Law",
      summary:
        "Articles 101 and 102 TFEU, anti-competitive agreements, abuse of dominant position, and the merger regulation.",
      status: "Draft",
      contributors: 1,
      citations: 6,
      views: 398,
    },
  ],
  land: [
    {
      slug: "estates",
      title: "Estates in Land",
      summary:
        "The freehold and leasehold estates, the fee simple absolute in possession, and the doctrine of estates under the LPA 1925.",
      status: "Published",
      contributors: 6,
      citations: 18,
      views: 1567,
    },
    {
      slug: "registration",
      title: "Land Registration",
      summary:
        "The system of land registration under the Land Registration Act 2002, registered and unregistered land, and overriding interests.",
      status: "Published",
      contributors: 7,
      citations: 20,
      views: 1432,
    },
    {
      slug: "co-ownership",
      title: "Co-ownership",
      summary:
        "Joint tenancy and tenancy in common, severance of the joint tenancy, and trusts of land under TLATA 1996.",
      status: "Published",
      contributors: 5,
      citations: 15,
      views: 1345,
    },
    {
      slug: "leases",
      title: "Leases and Licences",
      summary:
        "The distinction between a lease and a licence (Street v Mountford), requirements for a valid lease, and landlord obligations.",
      status: "Under Review",
      contributors: 3,
      citations: 11,
      views: 876,
    },
    {
      slug: "mortgages",
      title: "Mortgages",
      summary:
        "The creation and protection of mortgages, the equity of redemption, clogs on the equity, and the mortgagee's remedies.",
      status: "Draft",
      contributors: 2,
      citations: 9,
      views: 654,
    },
  ],
  constitutional: [
    {
      slug: "sovereignty",
      title: "Parliamentary Sovereignty",
      summary:
        "Dicey's orthodox theory, enrolled act rule, manner and form debate, and challenges from EU law and devolution.",
      status: "Published",
      contributors: 7,
      citations: 22,
      views: 1876,
    },
    {
      slug: "rule-of-law",
      title: "The Rule of Law",
      summary:
        "Dicey's three conceptions, Lord Bingham's eight principles, and contemporary significance in the UK constitution.",
      status: "Published",
      contributors: 5,
      citations: 18,
      views: 1543,
    },
    {
      slug: "separation-of-powers",
      title: "Separation of Powers",
      summary:
        "The constitutional doctrine dividing governmental authority into three branches, the Constitutional Reform Act 2005, and practical operation.",
      status: "Published",
      contributors: 4,
      citations: 14,
      views: 1123,
    },
    {
      slug: "conventions",
      title: "Constitutional Conventions",
      summary:
        "Non-legal rules of constitutional practice, their binding nature, and relationship with law (AG v Jonathan Cape).",
      status: "Under Review",
      contributors: 3,
      citations: 12,
      views: 876,
    },
    {
      slug: "devolution",
      title: "Devolution",
      summary:
        "The Scotland Act 1998, Government of Wales Act 2006, Northern Ireland Act 1998, and the Sewel Convention.",
      status: "Under Review",
      contributors: 3,
      citations: 10,
      views: 765,
    },
    {
      slug: "prerogative",
      title: "The Royal Prerogative",
      summary:
        "The residual powers of the Crown, the relationship with statute, and judicial review of prerogative powers (GCHQ, Miller).",
      status: "Draft",
      contributors: 2,
      citations: 8,
      views: 567,
    },
  ],
};

// ── Status tag colors ──
const STATUS_COLOR: Record<string, "green" | "gold" | "blue"> = {
  Published: "green",
  "Under Review": "gold",
  Draft: "blue",
};

// ── Animation variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

// ── Tab type ──
type TabKey = "hub" | "topics";

export default function ModuleHubPage() {
  const router = useRouter();
  const params = useParams();
  const moduleSlug = params.module as string;
  const mod = getModuleBySlug(moduleSlug);

  const [activeTab, setActiveTab] = useState<TabKey>("hub");
  const [suggestions, setSuggestions] = useState(() =>
    getSuggestionsForModule(moduleSlug)
  );

  const prompts = useMemo(
    () => getPromptsForModule(moduleSlug),
    [moduleSlug]
  );
  const spotlight = useMemo(
    () => getCaseSpotlight(moduleSlug),
    [moduleSlug]
  );
  const topics = TOPICS_MAP[moduleSlug] ?? [];

  // ── Handlers ──
  const handleCreateDebate = useCallback(
    (suggestion: TopicSuggestion) => {
      if (!mod) return;
      router.push(
        `/sessions/create?type=debate&module=${encodeURIComponent(mod.title)}&motion=${encodeURIComponent(suggestion.title)}`
      );
    },
    [mod, router]
  );

  const handleRefresh = useCallback(() => {
    setSuggestions((prev) => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const handleEngage = useCallback(
    (_prompt: DiscussionPromptType) => {
      if (!mod) return;
      router.push(
        `/sessions/create?type=debate&module=${encodeURIComponent(mod.title)}`
      );
    },
    [mod, router]
  );

  const handleViewBreakdown = useCallback(() => {
    setActiveTab("topics");
  }, []);

  // ── Module not found ──
  if (!mod) {
    return (
      <div className="pb-6 px-4 md:px-6 lg:px-8 pt-6">
        <div className="md:max-w-content-medium mx-auto">
          <EmptyState
            icon={<BookOpen size={32} />}
            title="Module Not Found"
            description={`The module "${moduleSlug}" does not exist in the Law Book.`}
            action={
              <Link
                href="/law-book"
                className="text-court-sm text-gold font-semibold hover:underline"
              >
                Back to Law Book
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* ── Back link ── */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <div className="md:max-w-content-medium mx-auto">
          <Link
            href="/law-book"
            className="inline-flex items-center gap-1.5 text-court-xs text-court-text-ter hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Law Book
          </Link>
        </div>
      </div>

      {/* ── Module header card ── */}
      <header className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="md:max-w-content-medium mx-auto">
          <Card className="overflow-hidden">
            {/* Gradient banner */}
            <div
              className="h-20 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${mod.gradient[0]}, ${mod.gradient[1]})`,
              }}
            >
              <DynamicIcon
                name={mod.icon}
                size={32}
                className="text-white/80"
              />
            </div>

            {/* Content */}
            <div className="p-4 md:p-5">
              <h1 className="font-serif text-xl md:text-2xl font-bold text-court-text mb-2">
                {mod.title}
              </h1>
              <p className="text-court-sm text-court-text-sec leading-relaxed mb-3">
                {mod.description}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Tag color={mod.color} small>
                  {mod.category === "core"
                    ? "Core"
                    : mod.category === "professional"
                      ? "Professional"
                      : mod.category === "specialist"
                        ? "Specialist"
                        : "Academic"}
                </Tag>
                <span className="flex items-center gap-1 text-court-xs text-court-text-ter">
                  <Hash size={11} />
                  {mod.topicCount} topics
                </span>
              </div>
            </div>
          </Card>
        </div>
      </header>

      {/* ── Tab navigation ── */}
      <div className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="md:max-w-content-medium mx-auto">
          <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1">
            {(["hub", "topics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-court-sm font-semibold transition-all duration-200 capitalize",
                  activeTab === tab
                    ? "bg-navy-card text-court-text shadow-sm"
                    : "text-court-text-ter hover:text-court-text"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="md:max-w-content-medium mx-auto">
          {activeTab === "hub" ? (
            <div className="space-y-6">
              <LivePulse moduleSlug={mod.slug} moduleTitle={mod.title} />

              {suggestions.length > 0 && (
                <AISuggestions
                  suggestions={suggestions}
                  onCreateDebate={handleCreateDebate}
                  onRefresh={handleRefresh}
                />
              )}

              {prompts.length > 0 && (
                <DiscussionPrompts
                  prompts={prompts}
                  onEngage={handleEngage}
                />
              )}

              {spotlight && (
                <CaseSpotlight
                  spotlight={spotlight}
                  onViewBreakdown={handleViewBreakdown}
                />
              )}

              <TrendingDebates
                moduleSlug={mod.slug}
                moduleTitle={mod.title}
              />
            </div>
          ) : (
            <div>
              {/* Topics tab header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-lg font-bold text-court-text">
                  Topics
                </h2>
                <Link href="/law-book/contribute">
                  <Button size="sm" variant="outline">
                    <span className="flex items-center gap-1.5">
                      <Plus size={14} /> Add Topic
                    </span>
                  </Button>
                </Link>
              </div>

              {topics.length === 0 ? (
                <EmptyState
                  icon={<BookOpen size={28} />}
                  title="No Topics Yet"
                  description="This module does not have published topics. Contribute to get it started."
                  action={
                    <Link href="/law-book/contribute">
                      <Button size="sm" variant="outline">
                        Contribute
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2.5"
                >
                  {topics.map((topic) => (
                    <motion.div key={topic.slug} variants={itemVariants}>
                      <Card
                        onClick={() =>
                          router.push(
                            `/law-book/${mod.slug}/${topic.slug}`
                          )
                        }
                        className="p-4 group"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-serif text-court-base font-bold text-court-text group-hover:text-gold transition-colors">
                            {topic.title}
                          </h3>
                          <Tag
                            color={STATUS_COLOR[topic.status] ?? "gold"}
                            small
                          >
                            {topic.status}
                          </Tag>
                        </div>
                        <p className="text-court-sm text-court-text-sec leading-relaxed mb-3 line-clamp-2">
                          {topic.summary}
                        </p>
                        <div className="flex items-center gap-4 text-court-xs text-court-text-ter">
                          <span className="flex items-center gap-1">
                            <Users size={11} /> {topic.contributors}
                          </span>
                          <span className="flex items-center gap-1">
                            <Quote size={11} /> {topic.citations}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={11} />{" "}
                            {topic.views.toLocaleString()}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card, Tag, Button } from "@/components/ui";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Eye,
  Users,
  Quote,
  ScrollText,
  Gavel,
  AlertTriangle,
  Landmark,
  Scale,
  Globe,
  Building2,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Module metadata ──
interface ModuleMeta {
  title: string;
  icon: LucideIcon;
  description: string;
}

const MODULE_MAP: Record<string, ModuleMeta> = {
  contract: {
    title: "Contract Law",
    icon: ScrollText,
    description:
      "Principles governing the formation, performance, and enforcement of legally binding agreements. Covers offer and acceptance, consideration, intention to create legal relations, terms, vitiating factors, discharge, and remedies.",
  },
  criminal: {
    title: "Criminal Law",
    icon: Gavel,
    description:
      "The body of law that relates to crime, prescribing conduct perceived as threatening, harmful, or otherwise endangering to the property, health, safety, and welfare of people. Covers offences against the person, property offences, and defences.",
  },
  tort: {
    title: "Tort Law",
    icon: AlertTriangle,
    description:
      "Civil wrongs that cause a claimant to suffer loss or harm, resulting in legal liability for the person who commits the tortious act. Covers negligence, occupiers' liability, nuisance, and vicarious liability.",
  },
  public: {
    title: "Public Law",
    icon: Landmark,
    description:
      "The branch of law governing the relationship between individuals and the state. Encompasses constitutional law, administrative law, judicial review, and human rights.",
  },
  "equity-trusts": {
    title: "Equity & Trusts",
    icon: Scale,
    description:
      "Equitable principles and the law of trusts, including express trusts, resulting and constructive trusts, charitable trusts, breach of trust, and equitable remedies.",
  },
  "eu-international": {
    title: "EU / International Law",
    icon: Globe,
    description:
      "European Union law, the relationship between EU and domestic law, free movement principles, international treaties, and public international law.",
  },
  property: {
    title: "Property Law",
    icon: Building2,
    description:
      "The area of law governing various forms of ownership and tenancy in real property and personal property. Covers land registration, estates and interests, co-ownership, leases, and mortgages.",
  },
  constitutional: {
    title: "Constitutional Law",
    icon: Shield,
    description:
      "The body of law which defines the relationship of different entities within a state. Covers parliamentary sovereignty, separation of powers, the rule of law, and devolution.",
  },
};

// ── Demo topics by module ──
interface Topic {
  slug: string;
  title: string;
  summary: string;
  status: "Published" | "Under Review" | "Draft";
  contributors: number;
  citations: number;
  views: number;
}

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
      slug: "intention-to-create-legal-relations",
      title: "Intention to Create Legal Relations",
      summary:
        "The presumptions that apply in domestic/social and commercial agreements regarding the parties' intention to be legally bound.",
      status: "Published",
      contributors: 4,
      citations: 12,
      views: 987,
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
      slug: "duress-and-undue-influence",
      title: "Duress and Undue Influence",
      summary:
        "Vitiating factors relating to coercion and improper pressure, including economic duress and presumed/actual undue influence.",
      status: "Under Review",
      contributors: 2,
      citations: 11,
      views: 634,
    },
    {
      slug: "frustration",
      title: "Frustration of Contract",
      summary:
        "When a contract is discharged by frustration due to a supervening event that renders performance impossible, illegal, or radically different.",
      status: "Draft",
      contributors: 1,
      citations: 8,
      views: 412,
    },
  ],
  criminal: [
    {
      slug: "murder",
      title: "Murder",
      summary:
        "The unlawful killing of a reasonable person in being under the King's peace with malice aforethought, express or implied.",
      status: "Published",
      contributors: 7,
      citations: 22,
      views: 2103,
    },
    {
      slug: "voluntary-manslaughter",
      title: "Voluntary Manslaughter",
      summary:
        "Partial defences to murder: loss of control under s.54 Coroners and Justice Act 2009 and diminished responsibility under s.52.",
      status: "Published",
      contributors: 5,
      citations: 18,
      views: 1654,
    },
    {
      slug: "non-fatal-offences",
      title: "Non-Fatal Offences Against the Person",
      summary:
        "Assault, battery, ABH (s.47 OAPA 1861), GBH (s.20 and s.18 OAPA 1861), and the hierarchy of non-fatal offences.",
      status: "Published",
      contributors: 6,
      citations: 20,
      views: 1890,
    },
    {
      slug: "theft",
      title: "Theft",
      summary:
        "The offence under s.1 Theft Act 1968: dishonest appropriation of property belonging to another with intention to permanently deprive.",
      status: "Published",
      contributors: 4,
      citations: 14,
      views: 1245,
    },
    {
      slug: "self-defence",
      title: "Self-Defence",
      summary:
        "The general defence of self-defence under common law and s.76 Criminal Justice and Immigration Act 2008.",
      status: "Under Review",
      contributors: 3,
      citations: 10,
      views: 876,
    },
  ],
  tort: [
    {
      slug: "duty-of-care",
      title: "Duty of Care in Negligence",
      summary:
        "Establishing a duty of care through the Caparo three-stage test: foreseeability, proximity, and fair, just and reasonable.",
      status: "Published",
      contributors: 7,
      citations: 21,
      views: 2015,
    },
    {
      slug: "breach-of-duty",
      title: "Breach of Duty",
      summary:
        "The standard of care expected of the reasonable person and factors considered in determining breach (Blyth v Birmingham Waterworks).",
      status: "Published",
      contributors: 5,
      citations: 16,
      views: 1432,
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
      slug: "private-nuisance",
      title: "Private Nuisance",
      summary:
        "Unreasonable interference with a person's use or enjoyment of land, including locality, duration, and sensitivity factors.",
      status: "Draft",
      contributors: 2,
      citations: 9,
      views: 567,
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
      slug: "human-rights-act",
      title: "Human Rights Act 1998",
      summary:
        "The incorporation of the ECHR into domestic law, sections 3, 4, and 6 HRA, and the relationship between courts and Parliament.",
      status: "Published",
      contributors: 6,
      citations: 22,
      views: 1876,
    },
    {
      slug: "rule-of-law",
      title: "The Rule of Law",
      summary:
        "Dicey's formulation, modern interpretations by Lord Bingham, and the constitutional significance of the rule of law.",
      status: "Published",
      contributors: 5,
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
      views: 1234,
    },
    {
      slug: "separation-of-powers",
      title: "Separation of Powers",
      summary:
        "The constitutional doctrine dividing governmental authority into three branches and the practical operation in the UK constitution.",
      status: "Draft",
      contributors: 2,
      citations: 14,
      views: 789,
    },
  ],
  "equity-trusts": [
    {
      slug: "three-certainties",
      title: "The Three Certainties",
      summary:
        "Certainty of intention, subject matter, and objects as requirements for a valid express trust (Knight v Knight).",
      status: "Published",
      contributors: 6,
      citations: 18,
      views: 1456,
    },
    {
      slug: "constitution-of-trusts",
      title: "Constitution of Trusts",
      summary:
        "Methods of constituting a trust: transfer to trustees, self-declaration, and the rule in Milroy v Lord.",
      status: "Published",
      contributors: 4,
      citations: 14,
      views: 1123,
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
      slug: "charitable-trusts",
      title: "Charitable Trusts",
      summary:
        "The requirements for charitable status under the Charities Act 2011, charitable purposes, and the public benefit test.",
      status: "Draft",
      contributors: 2,
      citations: 10,
      views: 654,
    },
  ],
  "eu-international": [
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
        "The doctrine established in Costa v ENEL that EU law takes precedence over conflicting national law.",
      status: "Published",
      contributors: 4,
      citations: 14,
      views: 1098,
    },
    {
      slug: "free-movement-goods",
      title: "Free Movement of Goods",
      summary:
        "Articles 28-36 TFEU, the Dassonville formula, Cassis de Dijon, and permissible restrictions on trade.",
      status: "Under Review",
      contributors: 3,
      citations: 12,
      views: 876,
    },
    {
      slug: "state-responsibility",
      title: "State Responsibility",
      summary:
        "The rules of international law governing when and how a state is held responsible for breaches of international obligations.",
      status: "Under Review",
      contributors: 2,
      citations: 10,
      views: 654,
    },
    {
      slug: "sources-international-law",
      title: "Sources of International Law",
      summary:
        "Article 38 ICJ Statute: treaties, custom, general principles, and subsidiary sources of international law.",
      status: "Draft",
      contributors: 1,
      citations: 8,
      views: 432,
    },
  ],
  property: [
    {
      slug: "land-registration",
      title: "Land Registration",
      summary:
        "The system of land registration under the Land Registration Act 2002, registered and unregistered land, and overriding interests.",
      status: "Published",
      contributors: 6,
      citations: 18,
      views: 1567,
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
      slug: "easements",
      title: "Easements",
      summary:
        "The requirements for an easement (Re Ellenborough Park), methods of creation, and the distinction from licences.",
      status: "Published",
      contributors: 4,
      citations: 14,
      views: 1123,
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
      slug: "parliamentary-sovereignty",
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
      slug: "royal-prerogative",
      title: "The Royal Prerogative",
      summary:
        "The residual powers of the Crown, the relationship with statute, and judicial review of prerogative powers (GCHQ, Miller).",
      status: "Published",
      contributors: 4,
      citations: 16,
      views: 1234,
    },
    {
      slug: "devolution",
      title: "Devolution",
      summary:
        "The Scotland Act 1998, Government of Wales Act 2006, Northern Ireland Act 1998, and the Sewel Convention.",
      status: "Under Review",
      contributors: 3,
      citations: 12,
      views: 876,
    },
    {
      slug: "conventions",
      title: "Constitutional Conventions",
      summary:
        "Non-legal rules of constitutional practice, their binding nature, and relationship with law (AG v Jonathan Cape).",
      status: "Draft",
      contributors: 2,
      citations: 10,
      views: 567,
    },
  ],
};

const STATUS_STYLES: Record<string, string> = {
  Published: "text-green-500 bg-green-500/10 border-green-500/20",
  "Under Review": "text-gold bg-gold-dim border-gold/20",
  Draft: "text-court-text-ter bg-white/[0.04] border-white/[0.06]",
};

export default function ModuleTopicsPage() {
  const router = useRouter();
  const params = useParams();
  const moduleSlug = params.module as string;
  const meta = MODULE_MAP[moduleSlug];

  // Fallback for unknown module
  if (!meta) {
    return (
      <div className="pb-6 px-4 md:px-6 lg:px-8 pt-6">
        <div className="max-w-content-narrow mx-auto text-center py-16">
          <BookOpen size={40} className="text-court-text-ter mx-auto mb-4" />
          <h1 className="font-serif text-xl font-bold text-court-text mb-2">
            Module Not Found
          </h1>
          <p className="text-sm text-court-text-sec mb-6">
            The module &quot;{moduleSlug}&quot; does not exist in the Law Book.
          </p>
          <Link
            href="/law-book"
            className="text-sm text-gold font-semibold hover:underline"
          >
            Back to Law Book
          </Link>
        </div>
      </div>
    );
  }

  const topics = TOPICS_MAP[moduleSlug] ?? [];
  const ModuleIcon = meta.icon;

  return (
    <div className="pb-6">
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

      {/* ── Module header ── */}
      <header className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="max-w-content-narrow mx-auto">
          <Card className="p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-dim flex items-center justify-center shrink-0">
                <ModuleIcon size={24} className="text-gold" />
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-xl md:text-2xl font-bold text-court-text mb-2">
                  {meta.title}
                </h1>
                <p className="text-sm text-court-text-sec leading-relaxed">
                  {meta.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-court-xs text-court-text-ter">
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} /> {topics.length} topics
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />{" "}
                    {topics.reduce((s, t) => s + t.contributors, 0)} contributors
                  </span>
                  <span className="flex items-center gap-1">
                    <Quote size={12} />{" "}
                    {topics.reduce((s, t) => s + t.citations, 0)} citations
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </header>

      {/* ── Topics list ── */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="max-w-content-narrow mx-auto">
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

          <div className="flex flex-col gap-2.5">
            {topics.map((topic) => (
              <Card
                key={topic.slug}
                onClick={() =>
                  router.push(`/law-book/${moduleSlug}/${topic.slug}`)
                }
                className="p-4 hover:border-gold/20 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-base font-bold text-court-text group-hover:text-gold transition-colors">
                    {topic.title}
                  </h3>
                  <span
                    className={`text-court-xs font-bold tracking-wider border rounded px-1.5 py-0.5 whitespace-nowrap ml-3 ${STATUS_STYLES[topic.status]}`}
                  >
                    {topic.status.toUpperCase()}
                  </span>
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
                    <Eye size={11} /> {topic.views.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

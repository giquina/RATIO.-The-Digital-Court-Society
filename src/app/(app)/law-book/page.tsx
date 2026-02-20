"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Tag } from "@/components/ui";
import {
  BookOpen,
  Search,
  Plus,
  Scale,
  Shield,
  AlertTriangle,
  Globe,
  Landmark,
  Building2,
  Gavel,
  ScrollText,
  Users,
  FileText,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Module data ──
interface LawModule {
  slug: string;
  title: string;
  icon: LucideIcon;
  topicCount: number;
  description: string;
}

const MODULES: LawModule[] = [
  {
    slug: "contract",
    title: "Contract Law",
    icon: ScrollText,
    topicCount: 24,
    description: "Formation, terms, vitiating factors, discharge, and remedies for breach of contract.",
  },
  {
    slug: "criminal",
    title: "Criminal Law",
    icon: Gavel,
    topicCount: 31,
    description: "Offences against the person, property offences, inchoate offences, and general defences.",
  },
  {
    slug: "tort",
    title: "Tort Law",
    icon: AlertTriangle,
    topicCount: 18,
    description: "Negligence, occupiers' liability, nuisance, defamation, and vicarious liability.",
  },
  {
    slug: "public",
    title: "Public Law",
    icon: Landmark,
    topicCount: 22,
    description: "Constitutional principles, judicial review, human rights, and administrative law.",
  },
  {
    slug: "equity-trusts",
    title: "Equity & Trusts",
    icon: Scale,
    topicCount: 19,
    description: "Express trusts, resulting and constructive trusts, charitable trusts, and equitable remedies.",
  },
  {
    slug: "eu-international",
    title: "EU / International",
    icon: Globe,
    topicCount: 15,
    description: "EU institutions, free movement, international treaties, and public international law.",
  },
  {
    slug: "property",
    title: "Property Law",
    icon: Building2,
    topicCount: 20,
    description: "Land registration, estates and interests, co-ownership, leases, and mortgages.",
  },
  {
    slug: "constitutional",
    title: "Constitutional Law",
    icon: Shield,
    topicCount: 17,
    description: "Parliamentary sovereignty, separation of powers, rule of law, and devolution.",
  },
];

const TOTAL_TOPICS = MODULES.reduce((sum, m) => sum + m.topicCount, 0);
const TOTAL_CONTRIBUTORS = 142;

export default function LawBookIndexPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = MODULES.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pb-6">
      {/* ── Header ── */}
      <header className="px-4 md:px-6 lg:px-8 pt-6 pb-2">
        <div className="max-w-content-medium mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={28} className="text-gold" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-court-text">
              The Official Law Book
            </h1>
          </div>
          <p className="text-sm text-court-text-sec">
            A student-built, peer-reviewed legal knowledge base
          </p>
        </div>
      </header>

      {/* ── Search ── */}
      <div className="px-4 md:px-6 lg:px-8 mt-5 mb-4">
        <div className="max-w-content-medium mx-auto">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-court-text-ter"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules and topics..."
              className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 pl-10 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
              aria-label="Search law book"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-court-text-ter hover:text-court-text transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="max-w-content-medium mx-auto">
          <div className="flex items-center gap-2 text-court-text-ter text-xs">
            <FileText size={14} />
            <span>
              {TOTAL_TOPICS} topics across {MODULES.length} modules
            </span>
            <span className="mx-1">&middot;</span>
            <Users size={14} />
            <span>{TOTAL_CONTRIBUTORS} contributors</span>
          </div>
        </div>
      </div>

      {/* ── Module grid ── */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="max-w-content-medium mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search size={32} className="text-court-text-ter mx-auto mb-3" />
              <p className="text-court-text-ter text-sm">
                No modules match &quot;{search}&quot;
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-xs text-gold font-semibold mt-2"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((mod) => (
                <Card
                  key={mod.slug}
                  onClick={() => router.push(`/law-book/${mod.slug}`)}
                  className="p-4 md:p-5 hover:border-gold/20 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-dim flex items-center justify-center">
                      <mod.icon size={20} className="text-gold" />
                    </div>
                    <Tag color="gold" small>
                      {mod.topicCount}
                    </Tag>
                  </div>
                  <h3 className="font-serif text-base font-bold text-court-text mb-1 group-hover:text-gold transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-court-xs text-court-text-sec leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="px-4 md:px-6 lg:px-8 mt-8">
        <div className="max-w-content-medium mx-auto flex flex-wrap gap-3">
          <Link
            href="/law-book/review-queue"
            className="flex items-center gap-2 text-xs text-court-text-sec hover:text-gold transition-colors"
          >
            <FileText size={14} /> Review Queue
          </Link>
          <Link
            href="/law-book/changelog"
            className="flex items-center gap-2 text-xs text-court-text-sec hover:text-gold transition-colors"
          >
            <ScrollText size={14} /> Recent Changes
          </Link>
          <Link
            href="/law-book/editorial-policy"
            className="flex items-center gap-2 text-xs text-court-text-sec hover:text-gold transition-colors"
          >
            <Shield size={14} /> Editorial Policy
          </Link>
        </div>
      </section>

      {/* ── Floating Contribute button ── */}
      <Link
        href="/law-book/contribute"
        className="fixed bottom-24 md:bottom-8 right-5 z-40 bg-gold text-navy font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gold/90 transition-all duration-200"
        aria-label="Contribute to the Law Book"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}

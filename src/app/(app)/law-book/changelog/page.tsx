"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Tag, Avatar } from "@/components/ui";
import {
  ArrowLeft,
  Clock,
  Edit,
  Plus,
  CheckCircle,
  GitBranch,
} from "lucide-react";

// ── Changelog entry types ──
type ActionType = "edited" | "created" | "reviewed";

interface ChangelogEntry {
  id: string;
  contributor: {
    name: string;
    initials: string;
    chamber: string;
  };
  action: ActionType;
  topicTitle: string;
  topicSlug: string;
  module: string;
  moduleSlug: string;
  date: string;
  version: number;
}

const ACTION_CONFIG: Record<
  ActionType,
  { label: string; color: string; icon: typeof Edit }
> = {
  edited: { label: "edited", color: "text-blue-400", icon: Edit },
  created: { label: "created", color: "text-green-500", icon: Plus },
  reviewed: { label: "reviewed", color: "text-gold", icon: CheckCircle },
};

const CHANGELOG: ChangelogEntry[] = [
  {
    id: "cl-1",
    contributor: { name: "Ali Giquina", initials: "AG", chamber: "Gray's" },
    action: "edited",
    topicTitle: "Offer and Acceptance",
    topicSlug: "offer-and-acceptance",
    module: "Contract Law",
    moduleSlug: "contract",
    date: "14 Feb 2026",
    version: 7,
  },
  {
    id: "cl-2",
    contributor: { name: "Priya Sharma", initials: "PS", chamber: "Lincoln's" },
    action: "created",
    topicTitle: "Promissory Estoppel",
    topicSlug: "promissory-estoppel",
    module: "Contract Law",
    moduleSlug: "contract",
    date: "13 Feb 2026",
    version: 1,
  },
  {
    id: "cl-3",
    contributor: { name: "James Okafor", initials: "JO", chamber: "Inner" },
    action: "reviewed",
    topicTitle: "Duty of Care in Negligence",
    topicSlug: "duty-of-care",
    module: "Tort Law",
    moduleSlug: "tort",
    date: "12 Feb 2026",
    version: 5,
  },
  {
    id: "cl-4",
    contributor: { name: "Sophie Chen", initials: "SC", chamber: "Gray's" },
    action: "edited",
    topicTitle: "Judicial Review",
    topicSlug: "judicial-review",
    module: "Public Law",
    moduleSlug: "public",
    date: "11 Feb 2026",
    version: 8,
  },
  {
    id: "cl-5",
    contributor: {
      name: "Marcus Williams",
      initials: "MW",
      chamber: "Middle",
    },
    action: "created",
    topicTitle: "Involuntary Manslaughter",
    topicSlug: "involuntary-manslaughter",
    module: "Criminal Law",
    moduleSlug: "criminal",
    date: "10 Feb 2026",
    version: 1,
  },
  {
    id: "cl-6",
    contributor: { name: "Priya Sharma", initials: "PS", chamber: "Lincoln's" },
    action: "reviewed",
    topicTitle: "Three Certainties",
    topicSlug: "three-certainties",
    module: "Equity & Trusts",
    moduleSlug: "equity-trusts",
    date: "9 Feb 2026",
    version: 4,
  },
  {
    id: "cl-7",
    contributor: { name: "Ali Giquina", initials: "AG", chamber: "Gray's" },
    action: "edited",
    topicTitle: "Parliamentary Sovereignty",
    topicSlug: "parliamentary-sovereignty",
    module: "Constitutional Law",
    moduleSlug: "constitutional",
    date: "8 Feb 2026",
    version: 6,
  },
  {
    id: "cl-8",
    contributor: { name: "James Okafor", initials: "JO", chamber: "Inner" },
    action: "created",
    topicTitle: "Free Movement of Goods",
    topicSlug: "free-movement-goods",
    module: "EU / International",
    moduleSlug: "eu-international",
    date: "7 Feb 2026",
    version: 1,
  },
  {
    id: "cl-9",
    contributor: { name: "Sophie Chen", initials: "SC", chamber: "Gray's" },
    action: "reviewed",
    topicTitle: "Co-ownership",
    topicSlug: "co-ownership",
    module: "Property Law",
    moduleSlug: "property",
    date: "6 Feb 2026",
    version: 3,
  },
  {
    id: "cl-10",
    contributor: {
      name: "Marcus Williams",
      initials: "MW",
      chamber: "Middle",
    },
    action: "edited",
    topicTitle: "Non-Fatal Offences Against the Person",
    topicSlug: "non-fatal-offences",
    module: "Criminal Law",
    moduleSlug: "criminal",
    date: "5 Feb 2026",
    version: 9,
  },
];

const MODULE_FILTERS = [
  { value: "", label: "All Modules" },
  { value: "contract", label: "Contract Law" },
  { value: "criminal", label: "Criminal Law" },
  { value: "tort", label: "Tort Law" },
  { value: "public", label: "Public Law" },
  { value: "equity-trusts", label: "Equity & Trusts" },
  { value: "eu-international", label: "EU / International" },
  { value: "property", label: "Property Law" },
  { value: "constitutional", label: "Constitutional Law" },
];

export default function ChangelogPage() {
  const [moduleFilter, setModuleFilter] = useState("");

  const filtered = CHANGELOG.filter((entry) => {
    if (!moduleFilter) return true;
    return entry.moduleSlug === moduleFilter;
  });

  return (
    <div className="pb-6">
      {/* ── Back link ── */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <div className="max-w-content-medium mx-auto">
          <Link
            href="/law-book"
            className="inline-flex items-center gap-1.5 text-xs text-court-text-ter hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Law Book
          </Link>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="max-w-content-medium mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} className="text-gold" />
            <h1 className="font-serif text-xl md:text-2xl font-bold text-court-text">
              Recent Changes
            </h1>
          </div>
          <p className="text-sm text-court-text-sec">
            Version history and recent edits to the Law Book
          </p>
        </div>
      </header>

      {/* ── Module filter ── */}
      <div className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="max-w-content-medium mx-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2 text-sm text-court-text outline-none focus:border-gold/40"
          >
            {MODULE_FILTERS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Timeline ── */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="max-w-content-medium mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={32} className="text-court-text-ter mx-auto mb-3" />
              <p className="text-sm text-court-text-ter">
                No changes found for this module.
              </p>
              <button
                onClick={() => setModuleFilter("")}
                className="text-xs text-gold font-semibold mt-2"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-6 bottom-6 w-px bg-court-border-light hidden md:block" />

              <div className="space-y-3">
                {filtered.map((entry) => {
                  const config = ACTION_CONFIG[entry.action];
                  const ActionIcon = config.icon;
                  return (
                    <Card key={entry.id} className="p-4 md:p-5">
                      <div className="flex items-start gap-3">
                        <Avatar
                          initials={entry.contributor.initials}
                          chamber={entry.contributor.chamber}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-court-base">
                            <span className="font-bold text-court-text">
                              {entry.contributor.name}
                            </span>
                            <span
                              className={`flex items-center gap-1 font-semibold ${config.color}`}
                            >
                              <ActionIcon size={12} />
                              {config.label}
                            </span>
                            <Link
                              href={`/law-book/${entry.moduleSlug}/${entry.topicSlug}`}
                              className="font-bold text-court-text hover:text-gold transition-colors"
                            >
                              {entry.topicTitle}
                            </Link>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <Tag color="gold" small>
                              {entry.module.toUpperCase()}
                            </Tag>
                            <span className="flex items-center gap-1 text-court-xs text-court-text-ter">
                              <GitBranch size={11} /> v{entry.version}
                            </span>
                            <span className="text-court-xs text-court-text-ter">
                              {entry.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

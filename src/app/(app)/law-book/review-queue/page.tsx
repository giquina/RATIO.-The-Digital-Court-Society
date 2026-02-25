"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Tag, Button, Avatar, EmptyState } from "@/components/ui";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Inbox,
} from "lucide-react";

// ── Review statuses ──
type ReviewStatus = "Pending" | "Changes Requested";

interface PendingReview {
  id: string;
  title: string;
  module: string;
  moduleSlug: string;
  author: {
    name: string;
    initials: string;
    chamber: string;
  };
  submittedDate: string;
  submittedAgo: string;
  status: ReviewStatus;
  wordCount: number;
  citationCount: number;
}

const PENDING_REVIEWS: PendingReview[] = [
  {
    id: "rev-1",
    title: "Promissory Estoppel",
    module: "Contract Law",
    moduleSlug: "contract",
    author: { name: "Priya Sharma", initials: "PS", chamber: "Lincoln's" },
    submittedDate: "17 February 2026",
    submittedAgo: "3 days ago",
    status: "Pending",
    wordCount: 2840,
    citationCount: 8,
  },
  {
    id: "rev-2",
    title: "Involuntary Manslaughter",
    module: "Criminal Law",
    moduleSlug: "criminal",
    author: { name: "James Okafor", initials: "JO", chamber: "Inner" },
    submittedDate: "15 February 2026",
    submittedAgo: "5 days ago",
    status: "Pending",
    wordCount: 3210,
    citationCount: 12,
  },
  {
    id: "rev-3",
    title: "Vicarious Liability",
    module: "Tort Law",
    moduleSlug: "tort",
    author: { name: "Sophie Chen", initials: "SC", chamber: "Gray's" },
    submittedDate: "12 February 2026",
    submittedAgo: "8 days ago",
    status: "Changes Requested",
    wordCount: 2560,
    citationCount: 6,
  },
  {
    id: "rev-4",
    title: "Proportionality in Judicial Review",
    module: "Public Law",
    moduleSlug: "public",
    author: { name: "Marcus Williams", initials: "MW", chamber: "Middle" },
    submittedDate: "10 February 2026",
    submittedAgo: "10 days ago",
    status: "Changes Requested",
    wordCount: 3450,
    citationCount: 14,
  },
];

type FilterTab = "All" | "Pending" | "Changes Requested";

export default function ReviewQueuePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const filtered = PENDING_REVIEWS.filter((r) => {
    if (activeTab === "All") return true;
    return r.status === activeTab;
  });

  const tabs: FilterTab[] = ["All", "Pending", "Changes Requested"];

  return (
    <div className="pb-6">
      {/* ── Back link ── */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <div className="max-w-content-medium mx-auto">
          <Link
            href="/law-book"
            className="inline-flex items-center gap-1.5 text-court-sm text-court-text-ter hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Law Book
          </Link>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="max-w-content-medium mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} className="text-gold" />
            <h1 className="font-serif text-xl md:text-2xl font-bold text-court-text">
              Review Queue
            </h1>
          </div>
          <p className="text-court-base text-court-text-sec">
            Pending contributions awaiting peer review
          </p>
        </div>
      </header>

      {/* ── Filter tabs ── */}
      <div className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="max-w-content-medium mx-auto">
          <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 w-fit">
            {tabs.map((tab) => {
              const count =
                tab === "All"
                  ? PENDING_REVIEWS.length
                  : PENDING_REVIEWS.filter((r) => r.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-court-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-navy-card text-court-text border border-court-border-light"
                      : "text-court-text-ter hover:text-court-text"
                  }`}
                >
                  {tab}{" "}
                  <span
                    className={
                      activeTab === tab
                        ? "text-gold ml-1"
                        : "text-court-text-ter ml-1"
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Review cards ── */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="max-w-content-medium mx-auto">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Inbox size={32} />}
              title="All caught up!"
              description="There are no pending reviews matching your filter. Check back later for new submissions."
              action={
                <Link href="/law-book">
                  <Button variant="outline" size="sm">
                    Back to Law Book
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((review) => (
                <Card key={review.id} className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <Avatar
                      initials={review.author.initials}
                      chamber={review.author.chamber}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div>
                          <h3 className="font-serif text-base font-bold text-court-text">
                            {review.title}
                          </h3>
                          <p className="text-court-xs text-court-text-ter mt-0.5">
                            by {review.author.name} &middot;{" "}
                            {review.submittedAgo}
                          </p>
                        </div>
                        <Tag color="gold" small>
                          {review.module.toUpperCase()}
                        </Tag>
                      </div>

                      {/* Status + stats */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span
                          className={`flex items-center gap-1 text-court-xs font-bold ${
                            review.status === "Pending"
                              ? "text-gold"
                              : "text-orange-400"
                          }`}
                        >
                          {review.status === "Pending" ? (
                            <Clock size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                          {review.status}
                        </span>
                        <span className="text-court-xs text-court-text-ter">
                          {review.wordCount.toLocaleString()} words
                        </span>
                        <span className="text-court-xs text-court-text-ter">
                          {review.citationCount} citations
                        </span>
                        <span className="text-court-xs text-court-text-ter">
                          Submitted {review.submittedDate}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3.5">
                        <Button size="sm" variant="primary">
                          <span className="flex items-center gap-1.5">
                            <Eye size={14} /> Review
                          </span>
                        </Button>
                        {review.status === "Changes Requested" && (
                          <Button size="sm" variant="secondary">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle size={14} /> Approve Revisions
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

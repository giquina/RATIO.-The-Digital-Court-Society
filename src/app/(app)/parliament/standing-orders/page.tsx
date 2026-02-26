"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Tag } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import { ArrowLeft, BookOpen, Search, Loader2 } from "lucide-react";

const CATEGORIES = ["all", "procedure", "membership", "governance", "conduct"];

export default function StandingOrdersPage() {
  const standingOrders: any[] | undefined = useQuery(anyApi.governance.legislative.listStandingOrders, {});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = standingOrders?.filter((so: any) => {
    const matchesCategory = filter === "all" || so.category === filter;
    const matchesSearch =
      !search ||
      so.title?.toLowerCase().includes(search.toLowerCase()) ||
      so.content?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <VerifiedOnly>
      <div className="pb-6 md:max-w-content-narrow mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <Link
            href="/parliament"
            className="flex items-center gap-1.5 text-court-text-sec text-court-sm mb-3 hover:text-court-text transition-colors"
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
          <p className="text-court-sm text-court-text-sec mt-1">
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
          {filtered === undefined ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-court-text-ter" />
            </div>
          ) : filtered.map((so: any) => (
            <Card key={so._id || so.orderNumber} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-court-xs font-bold text-gold bg-gold-dim px-2 py-0.5 rounded">
                    SO {so.orderNumber}
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

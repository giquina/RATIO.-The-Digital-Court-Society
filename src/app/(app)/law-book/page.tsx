"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Search, X, FileText, Hash } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { analytics } from "@/lib/analytics";
import { Card, Tag, DynamicIcon } from "@/components/ui";
import {
  MODULE_REGISTRY,
  MODULE_CATEGORIES,
  getModulesByCategory,
  type LawModule,
} from "@/lib/constants/modules";

// ── Animation variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── Category filter type ──
type CategoryFilter = "all" | LawModule["category"];

const CATEGORY_TABS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  ...MODULE_CATEGORIES.map((c) => ({ key: c.key as CategoryFilter, label: c.label.split(" ")[0] })),
];

// ── Computed totals ──
const TOTAL_MODULES = MODULE_REGISTRY.length;
const TOTAL_TOPICS = MODULE_REGISTRY.reduce((sum, m) => sum + m.topicCount, 0);

export default function LawBookIndexPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    let modules = category === "all" ? MODULE_REGISTRY : getModulesByCategory(category);

    if (search.trim()) {
      const q = search.toLowerCase();
      modules = modules.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    return modules;
  }, [search, category]);

  // Track law book searches (debounced — fires 800ms after user stops typing)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!search.trim()) return;
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      analytics.lawBookSearched(search.trim(), filtered.length);
    }, 800);
    return () => clearTimeout(searchTimerRef.current);
  }, [search, filtered.length]);

  return (
    <div className="pb-6">
      {/* ── Header ── */}
      <header className="px-4 md:px-6 lg:px-8 pt-6 pb-2">
        <div className="md:max-w-content-medium mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={28} className="text-gold" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-court-text">
              Law Book
            </h1>
          </div>
          <p className="text-court-sm text-court-text-sec">
            Explore legal modules, cases, and academic resources
          </p>
        </div>
      </header>

      {/* ── Category filter tabs ── */}
      <div className="px-4 md:px-6 lg:px-8 mt-4 mb-3">
        <div className="md:max-w-content-medium mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-xl text-court-xs font-semibold transition-all duration-200 whitespace-nowrap",
                  category === tab.key
                    ? "bg-gold text-navy"
                    : "bg-white/[0.05] text-court-text-sec hover:text-court-text hover:bg-white/[0.08] border border-court-border-light"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="md:max-w-content-medium mx-auto">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-court-text-ter"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules by title..."
              className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 pl-10 text-court-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter transition-colors"
              aria-label="Search law book modules"
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

      {/* ── Module grid ── */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="md:max-w-content-medium mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search size={32} className="text-court-text-ter mx-auto mb-3" />
              <p className="text-court-text-ter text-court-sm">
                No modules match your search
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="text-court-xs text-gold font-semibold mt-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`${category}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {filtered.map((mod) => (
                <motion.div key={mod.id} variants={itemVariants}>
                  <Card
                    onClick={() => router.push(`/law-book/${mod.slug}`)}
                    className="overflow-hidden hover:border-white/10 group"
                  >
                    {/* Gradient header strip */}
                    <div
                      className="h-12 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${mod.gradient[0]}, ${mod.gradient[1]})`,
                      }}
                    >
                      <DynamicIcon
                        name={mod.icon}
                        size={22}
                        className="text-white/80"
                      />
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <h3 className="font-serif text-court-lg font-bold text-court-text mb-1 group-hover:text-gold transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-court-sm text-court-text-sec leading-relaxed line-clamp-2 mb-3">
                        {mod.description}
                      </p>

                      {/* Bottom row: category + topic count */}
                      <div className="flex items-center justify-between">
                        <Tag color={mod.color} small>
                          {mod.category === "core"
                            ? "Core"
                            : mod.category === "professional"
                              ? "Professional"
                              : mod.category === "specialist"
                                ? "Specialist"
                                : "Academic"}
                        </Tag>
                        <span className="flex items-center gap-1 text-court-sm text-court-text-ter">
                          <Hash size={11} />
                          {mod.topicCount} topics
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="px-4 md:px-6 lg:px-8 mt-6">
        <div className="md:max-w-content-medium mx-auto">
          <div className="flex items-center gap-2 text-court-text-ter text-court-xs">
            <FileText size={13} />
            <span>
              {TOTAL_MODULES} modules &middot; {TOTAL_TOPICS} topics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

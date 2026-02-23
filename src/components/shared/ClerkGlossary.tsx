"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useClerkStore } from "@/stores/clerkStore";
import { GLOSSARY_TERMS } from "@/lib/constants/clerk-glossary";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "legal", label: "Legal" },
  { id: "platform", label: "Platform" },
  { id: "governance", label: "Governance" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  legal: "text-blue-400 bg-blue-400/10",
  platform: "text-gold bg-gold/10",
  governance: "text-emerald-400 bg-emerald-400/10",
};

export function ClerkGlossary() {
  const { searchQuery, setSearch } = useClerkStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return GLOSSARY_TERMS.filter((term) => {
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2">
          <Search size={14} className="text-court-text-ter shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="flex-1 bg-transparent text-court-sm text-court-text outline-none placeholder:text-court-text-ter"
          />
          {searchQuery && (
            <button onClick={() => setSearch("")} className="text-court-text-ter text-[10px] hover:text-court-text-sec">Clear</button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 mt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
              className={`text-[10px] px-2.5 min-h-[34px] py-1.5 rounded-full border transition-colors ${
                selectedCategory === cat.id
                  ? "bg-gold/10 text-gold border-gold/20"
                  : "bg-white/[0.04] text-court-text-ter border-white/[0.06] hover:text-court-text-sec"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terms list */}
      <div className="divide-y divide-white/[0.04]">
        {filtered.map((term) => {
          const isExpanded = expandedTerm === term.term;
          return (
            <div key={term.term}>
              <button
                onClick={() => setExpandedTerm(isExpanded ? null : term.term)}
                aria-expanded={isExpanded}
                className="w-full flex items-center gap-2 px-4 min-h-[44px] py-2.5 hover:bg-white/[0.02] transition-colors text-left"
              >
                <span className="flex-1 text-court-sm font-semibold text-court-text">{term.term}</span>
                {isExpanded ? <ChevronUp size={12} className="text-court-text-ter" /> : <ChevronDown size={12} className="text-court-text-ter" />}
              </button>
              {isExpanded && (
                <div className="px-4 pb-3">
                  <p className="text-court-xs text-court-text-sec leading-relaxed mb-2">{term.definition}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${CATEGORY_COLORS[term.category] || ""}`}>
                      {term.category}
                    </span>
                    {term.relatedTerms?.map((rt) => (
                      <button
                        key={rt}
                        onClick={() => { setSearch(rt); setExpandedTerm(null); }}
                        className="text-[10px] text-gold/70 hover:text-gold transition-colors"
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <Search size={24} className="text-court-text-ter mx-auto mb-2" />
          <p className="text-court-xs text-court-text-ter">No terms found</p>
        </div>
      )}
    </div>
  );
}

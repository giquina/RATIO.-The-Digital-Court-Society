"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Mic, Brain, BarChart3, Landmark, Library, Shield } from "lucide-react";
import { useClerkStore } from "@/stores/clerkStore";
import { HELP_SECTIONS } from "@/lib/constants/clerk-help";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, Mic, Brain, BarChart3, Landmark, Library, Shield,
};

export function ClerkQuickHelp() {
  const { searchQuery, setSearch } = useClerkStore();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["getting-started"]));
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filtered = HELP_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !searchQuery ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

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
            placeholder="Search questions..."
            className="flex-1 bg-transparent text-court-sm text-court-text outline-none placeholder:text-court-text-ter"
          />
          {searchQuery && (
            <button onClick={() => setSearch("")} className="text-court-text-ter text-[10px] hover:text-court-text-sec">Clear</button>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-white/[0.04]">
        {filtered.map((section) => {
          const Icon = ICON_MAP[section.icon];
          const isOpen = openSections.has(section.id);
          return (
            <div key={section.id}>
              <button onClick={() => toggleSection(section.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                {Icon && <Icon size={14} className="text-gold shrink-0" />}
                <span className="flex-1 text-left text-court-sm font-semibold text-court-text">{section.title}</span>
                <span className="text-[10px] text-court-text-ter mr-1">{section.items.length}</span>
                {isOpen ? <ChevronUp size={12} className="text-court-text-ter" /> : <ChevronDown size={12} className="text-court-text-ter" />}
              </button>
              {isOpen && (
                <div className="border-t border-white/[0.04]">
                  {section.items.map((item, idx) => {
                    const key = `${section.id}-${idx}`;
                    const isItemOpen = openItems.has(key);
                    return (
                      <div key={key} className="border-b border-white/[0.04] last:border-b-0">
                        <button onClick={() => toggleItem(key)} className="w-full flex items-start gap-2 px-4 py-2 hover:bg-white/[0.02] transition-colors text-left">
                          <span className="text-gold font-bold text-court-xs mt-0.5 shrink-0">Q</span>
                          <span className="flex-1 text-court-xs text-court-text leading-relaxed">{item.q}</span>
                          {isItemOpen ? <ChevronUp size={10} className="text-court-text-ter shrink-0 mt-1" /> : <ChevronDown size={10} className="text-court-text-ter shrink-0 mt-1" />}
                        </button>
                        {isItemOpen && (
                          <div className="px-4 pb-2.5 pl-9">
                            <p className="text-court-xs text-court-text-sec leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <HelpCircle size={24} className="text-court-text-ter mx-auto mb-2" />
          <p className="text-court-xs text-court-text-ter">No results for &ldquo;{searchQuery}&rdquo;</p>
        </div>
      )}

      {/* Footer link */}
      <div className="p-3 border-t border-white/[0.04]">
        <Link href="/help" className="block text-center text-court-xs text-gold hover:text-gold/80 transition-colors">
          View full Help Centre
        </Link>
      </div>
    </div>
  );
}

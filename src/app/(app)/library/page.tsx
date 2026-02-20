"use client";

import { useState } from "react";
import { Tag, Card, Button, SectionHeader } from "@/components/ui";

const CATEGORIES = [
  { key: "moot_template", label: "Moot Templates", icon: "📋", count: 12, color: "gold" },
  { key: "irac_guide", label: "IRAC / CLEO Guides", icon: "📐", count: 8, color: "blue" },
  { key: "sqe2_prep", label: "SQE2 Preparation", icon: "🎯", count: 24, color: "green" },
  { key: "case_bank", label: "Case Bank", icon: "📖", count: 156, color: "burgundy" },
  { key: "judgment_writing", label: "Judgment Writing", icon: "✍️", count: 6, color: "orange" },
  { key: "exam_skills", label: "Exam Skills", icon: "🧠", count: 15, color: "red" },
];

const POPULAR = [
  { title: "IRAC Structure Template", cat: "IRAC Guide", type: "PDF", downloads: 342, isPremium: false },
  { title: "Skeleton Argument — Standard Format", cat: "Moot Template", type: "DOCX", downloads: 287, isPremium: false },
  { title: "SQE2 Advocacy Marking Criteria", cat: "SQE2 Prep", type: "PDF", downloads: 524, isPremium: false },
  { title: "Cross-Examination Technique Guide", cat: "Exam Skills", type: "PDF", downloads: 198, isPremium: true },
  { title: "Bundle of Authorities — Template", cat: "Moot Template", type: "DOCX", downloads: 156, isPremium: false },
];

export default function LibraryPage() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Library</h1>
        <p className="text-xs text-court-text-sec">Templates, guides, and preparation materials</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-5">
        <div className="bg-white/[0.05] rounded-xl px-3.5 py-2.5 flex items-center gap-2">
          <span className="opacity-30">🔍</span>
          <span className="text-xs text-court-text-ter">Search resources...</span>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="px-4 mb-6">
        <SectionHeader title="Categories" />
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((c) => (
            <Card
              key={c.key}
              onClick={() => setSelectedCat(selectedCat === c.key ? null : c.key)}
              className={`p-3.5 cursor-pointer transition-all ${selectedCat === c.key ? "border-gold/30" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl">{c.icon}</span>
                <Tag color={c.color} small>{c.count}</Tag>
              </div>
              <p className="text-[13px] font-bold text-court-text mt-2">{c.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Resources */}
      <section className="px-4">
        <SectionHeader title="Most Downloaded" action="View all" />
        <div className="flex flex-col gap-2">
          {POPULAR.map((r, i) => (
            <Card key={i} className="px-3.5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center text-xs font-bold text-court-text-sec shrink-0">
                {r.type}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-court-text truncate">{r.title}</p>
                <p className="text-[10px] text-court-text-ter mt-0.5">{r.cat} · {r.downloads} downloads</p>
              </div>
              <div className="shrink-0">
                {r.isPremium ? (
                  <Tag color="gold" small>PREMIUM</Tag>
                ) : (
                  <button className="text-[10px] text-gold font-bold">↓</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Upload CTA */}
      <section className="px-4 mt-5">
        <Card className="p-4 text-center">
          <span className="text-2xl">📤</span>
          <p className="text-[13px] font-bold text-court-text mt-2">Contribute to the Library</p>
          <p className="text-[11px] text-court-text-ter mt-1 mb-3">Share templates, notes, or guides with fellow advocates</p>
          <Button size="sm">Upload Resource</Button>
        </Card>
      </section>
    </div>
  );
}

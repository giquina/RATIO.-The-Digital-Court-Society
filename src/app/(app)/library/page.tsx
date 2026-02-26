"use client";

import { useState } from "react";
import { Tag, Card, Button, SectionHeader, DynamicIcon, Skeleton } from "@/components/ui";
import { Search, Download, Upload } from "lucide-react";
import { anyApi } from "convex/server";
import { useDemoQuery, useDemoMutation } from "@/hooks/useDemoSafe";
import { courtToast } from "@/lib/utils/toast";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// ── Demo data (used when no backend) ──
const DEMO_CATEGORIES = [
  { key: "moot_template", label: "Moot Templates", icon: "FileText", count: 12, color: "gold" },
  { key: "irac_guide", label: "IRAC / CLEO Guides", icon: "BookOpen", count: 8, color: "blue" },
  { key: "sqe2_prep", label: "SQE2 Preparation", icon: "Target", count: 24, color: "green" },
  { key: "case_bank", label: "Case Bank", icon: "Book", count: 156, color: "burgundy" },
  { key: "judgment_writing", label: "Judgment Writing", icon: "PenLine", count: 6, color: "orange" },
  { key: "exam_skills", label: "Exam Skills", icon: "GraduationCap", count: 15, color: "red" },
];

const DEMO_RESOURCES = [
  { title: "IRAC Structure Template", cat: "IRAC Guide", catKey: "irac_guide", type: "PDF", downloads: 342, isPremium: false },
  { title: "Skeleton Argument \u2014 Standard Format", cat: "Moot Template", catKey: "moot_template", type: "DOCX", downloads: 287, isPremium: false },
  { title: "SQE2 Advocacy Marking Criteria", cat: "SQE2 Prep", catKey: "sqe2_prep", type: "PDF", downloads: 524, isPremium: false },
  { title: "Cross-Examination Technique Guide", cat: "Exam Skills", catKey: "exam_skills", type: "PDF", downloads: 198, isPremium: true },
  { title: "Bundle of Authorities \u2014 Template", cat: "Moot Template", catKey: "moot_template", type: "DOCX", downloads: 156, isPremium: false },
  { title: "Case Analysis: Donoghue v Stevenson", cat: "Case Bank", catKey: "case_bank", type: "PDF", downloads: 89, isPremium: false },
  { title: "Judgment Writing Template", cat: "Judgment Writing", catKey: "judgment_writing", type: "DOCX", downloads: 45, isPremium: true },
  { title: "SQE2 Mock Advocacy Scripts", cat: "SQE2 Prep", catKey: "sqe2_prep", type: "PDF", downloads: 312, isPremium: false },
];

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  moot_template: { label: "Moot Templates", icon: "FileText", color: "gold" },
  irac_guide: { label: "IRAC / CLEO Guides", icon: "BookOpen", color: "blue" },
  sqe2_prep: { label: "SQE2 Preparation", icon: "Target", color: "green" },
  case_bank: { label: "Case Bank", icon: "Book", color: "burgundy" },
  judgment_writing: { label: "Judgment Writing", icon: "PenLine", color: "orange" },
  exam_skills: { label: "Exam Skills", icon: "GraduationCap", color: "red" },
};

export default function LibraryPage() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);

  // Convex queries (skip in demo mode via useDemoQuery)
  const convexResources = useDemoQuery(anyApi.resources_queries.list, selectedCat ? { category: selectedCat } : {});
  const convexCounts = useDemoQuery(anyApi.resources_queries.getCategoryCounts);
  const trackDownload = useDemoMutation(anyApi.resources_queries.trackDownload);

  const isLoading = CONVEX_URL && (convexResources === undefined || convexCounts === undefined);

  // Build categories from Convex or demo
  const categories = (() => {
    if (!CONVEX_URL || !convexCounts) return DEMO_CATEGORIES;
    return Object.entries(convexCounts).map(([key, count]) => ({
      key,
      label: CATEGORY_META[key]?.label ?? key,
      icon: CATEGORY_META[key]?.icon ?? "FileText",
      count: count as number,
      color: CATEGORY_META[key]?.color ?? "blue",
    }));
  })();

  // Build resources from Convex or demo
  type ResourceItem = {
    _id?: string;
    title: string;
    cat: string;
    catKey: string;
    type: string;
    downloads: number;
    isPremium: boolean;
  };

  const allResources: ResourceItem[] = (() => {
    if (!CONVEX_URL || !convexResources) return DEMO_RESOURCES;
    return convexResources.map((r: { _id: string; title: string; category: string; fileType?: string; downloadCount: number; isPremium?: boolean }) => ({
      _id: r._id,
      title: r.title,
      cat: CATEGORY_META[r.category]?.label ?? r.category,
      catKey: r.category,
      type: (r.fileType ?? "PDF").toUpperCase(),
      downloads: r.downloadCount,
      isPremium: r.isPremium ?? false,
    }));
  })();

  const filteredCategories = categories.filter((c) => {
    if (!searchTerm) return true;
    return c.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredResources = allResources.filter((r) => {
    const matchesCat = !selectedCat || r.catKey === selectedCat;
    const matchesSearch =
      !searchTerm ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = async (index: number, title: string, id?: string) => {
    setDownloadingIdx(index);
    if (trackDownload && id) {
      try {
        await trackDownload({ resourceId: id as never });
      } catch {
        // Non-critical
      }
    }
    setTimeout(() => {
      setDownloadingIdx(null);
      courtToast.success("Downloaded", title);
    }, 800);
  };

  const handleUpload = () => {
    courtToast.info("Coming soon", "Upload will allow you to contribute templates, notes, or guides.");
  };

  if (isLoading) {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-4">
          <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Library</h1>
          <p className="text-court-sm text-court-text-sec">Templates, guides, and preparation materials</p>
        </div>
        <div className="px-4 grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-court" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-4 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Library</h1>
        <p className="text-court-sm text-court-text-sec">Templates, guides, and preparation materials</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-5">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2"><Search size={14} className="text-court-text-ter opacity-50" /></span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 pl-9 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
            aria-label="Search library"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-court-text-ter text-court-sm hover:text-court-text transition-colors"
            >
              &#x2715;
            </button>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      <section className="px-4 mb-6">
        <SectionHeader
          title="Categories"
          action={selectedCat ? "Clear filter" : undefined}
          onAction={() => setSelectedCat(null)}
        />
        {filteredCategories.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-court-text-ter text-court-base">No categories match &quot;{searchTerm}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredCategories.map((c) => (
              <Card
                key={c.key}
                onClick={() => setSelectedCat(selectedCat === c.key ? null : c.key)}
                className={`p-3.5 cursor-pointer transition-all ${selectedCat === c.key ? "border-gold/30" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <DynamicIcon name={c.icon} size={24} className="text-gold" />
                  <Tag color={c.color} small>{c.count}</Tag>
                </div>
                <p className="text-court-base font-bold text-court-text mt-2">{c.label}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Resources */}
      <section className="px-4">
        <SectionHeader
          title={selectedCat ? (CATEGORY_META[selectedCat]?.label ?? "Resources") : "Most Downloaded"}
          action={selectedCat ? "Clear filter" : filteredResources.length > 4 ? "View all" : undefined}
          onAction={() => {
            if (selectedCat) {
              setSelectedCat(null);
            } else {
              setSearchTerm("");
              setSelectedCat(null);
            }
          }}
        />
        <div className="flex flex-col gap-2">
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-court-text-ter text-court-base">No resources found</p>
              {(searchTerm || selectedCat) && (
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCat(null); }}
                  className="text-court-sm text-gold font-semibold mt-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : null}
          {filteredResources.map((r, i) => (
            <Card key={r.title + i} className="px-3.5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center text-court-sm font-bold text-court-text-sec shrink-0">
                {r.type}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-court-base font-bold text-court-text truncate">{r.title}</p>
                <p className="text-court-xs text-court-text-ter mt-0.5">{r.cat} · {r.downloads} downloads</p>
              </div>
              <div className="shrink-0">
                {r.isPremium ? (
                  <Tag color="gold" small>PREMIUM</Tag>
                ) : (
                  <button
                    onClick={() => handleDownload(i, r.title, r._id)}
                    disabled={downloadingIdx === i}
                    className="text-court-xs text-gold font-bold hover:text-gold/80 transition-colors disabled:opacity-50"
                    title={`Download ${r.title}`}
                  >
                    {downloadingIdx === i ? "..." : <Download size={14} className="text-gold" />}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Upload CTA */}
      <section className="px-4 mt-5">
        <Card className="p-4 text-center">
          <Upload size={24} className="text-gold mx-auto" />
          <p className="text-court-base font-bold text-court-text mt-2">Contribute to the Library</p>
          <p className="text-court-sm text-court-text-ter mt-1 mb-3">Share templates, notes, or guides with fellow advocates</p>
          <Button size="sm" onClick={handleUpload}>Upload Resource</Button>
        </Card>
      </section>
    </div>
  );
}

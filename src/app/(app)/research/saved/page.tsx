"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Scale,
  BookOpen,
  Landmark,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Pencil,
  X,
  Tag,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils/helpers"
import { useAuthStore } from "@/stores/authStore"
import { EmptyState, Button } from "@/components/ui"

// ═══════════════════════════════════════════
// Convex Integration (commented out — no auth yet)
// ═══════════════════════════════════════════
// import { useQuery, useMutation } from "convex/react"
// import { api } from "../../../../../convex/_generated/api"
//
// When auth is wired up, replace DEMO_AUTHORITIES with:
//   const authorities = useQuery(api.research.getSavedAuthorities, {
//     profileId: profile._id,
//     type: activeTab !== "all" ? activeTab : undefined,
//     folder: activeFolder || undefined,
//   })
//   const removeAuthority = useMutation(api.research.removeAuthority)
//   const updateNotes = useMutation(api.research.updateAuthorityNotes)

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════

type AuthorityType = "case-law" | "legislation" | "parliament-debate" | "parliament-bill"

interface SavedAuthority {
  _id: string
  profileId: string
  type: AuthorityType
  title: string
  citation?: string
  url: string
  subtitle?: string
  date?: string
  snippet?: string
  notes?: string
  tags?: string[]
  folder?: string
  savedAt: string
}

// ═══════════════════════════════════════════
// Demo Data
// ═══════════════════════════════════════════

const DEMO_AUTHORITIES: SavedAuthority[] = [
  {
    _id: "sa_001",
    profileId: "demo_profile",
    type: "case-law",
    title: "Donoghue v Stevenson",
    citation: "[1932] UKHL 100",
    url: "https://caselaw.nationalarchives.gov.uk/ukhl/1932/100",
    subtitle: "House of Lords",
    date: "1932-05-26",
    snippet:
      "The rule that you are to love your neighbour becomes in law, you must not injure your neighbour.",
    notes: "Key authority for duty of care. Use in negligence moot skeleton argument.",
    tags: ["tort", "duty-of-care", "moot-prep"],
    folder: "Tort Law Moot 2026",
    savedAt: "2026-02-18T14:30:00Z",
  },
  {
    _id: "sa_002",
    profileId: "demo_profile",
    type: "legislation",
    title: "Consumer Rights Act 2015",
    citation: "Consumer Rights Act 2015, c 15",
    url: "https://www.legislation.gov.uk/ukpga/2015/15/contents",
    subtitle: "UK Public General Acts",
    date: "2015-03-26",
    snippet: "An Act to amend the law relating to the rights of consumers and protection of their interests.",
    notes: "Sections 9-11 on satisfactory quality, fitness for purpose, and as described.",
    tags: ["consumer", "contract", "statutory-rights"],
    folder: "Contract Law Moot 2026",
    savedAt: "2026-02-17T10:15:00Z",
  },
  {
    _id: "sa_003",
    profileId: "demo_profile",
    type: "case-law",
    title: "R v Woollin",
    citation: "[1999] 1 AC 82",
    url: "https://caselaw.nationalarchives.gov.uk/ukhl/1998/28",
    subtitle: "House of Lords",
    date: "1998-07-22",
    snippet:
      "The jury should be directed that they are not entitled to find the necessary intention unless they feel sure that death or serious bodily harm was a virtual certainty.",
    notes: "Oblique intent direction. Compare with R v Nedrick for evolution of the test.",
    tags: ["criminal", "mens-rea", "intent"],
    folder: "Criminal Law Revision",
    savedAt: "2026-02-15T09:45:00Z",
  },
  {
    _id: "sa_004",
    profileId: "demo_profile",
    type: "parliament-debate",
    title: "Higher Education (Freedom of Speech) Act 2023 — Second Reading Debate",
    url: "https://hansard.parliament.uk/commons/2023-02-13/debates/example",
    subtitle: "House of Commons Debate",
    date: "2023-02-13",
    snippet:
      "Debate on the principles of freedom of speech within higher education institutions and the duties placed upon providers.",
    tags: ["public-law", "free-speech", "higher-ed"],
    savedAt: "2026-02-12T16:00:00Z",
  },
  {
    _id: "sa_005",
    profileId: "demo_profile",
    type: "legislation",
    title: "Human Rights Act 1998",
    citation: "Human Rights Act 1998, c 42",
    url: "https://www.legislation.gov.uk/ukpga/1998/42/contents",
    subtitle: "UK Public General Acts",
    date: "1998-11-09",
    snippet: "An Act to give further effect to rights and freedoms guaranteed under the European Convention.",
    notes: "Section 3 interpretive obligation, s6 public authority duty. Central to public law module.",
    tags: ["public-law", "human-rights", "echr"],
    folder: "Public Law Revision",
    savedAt: "2026-02-10T11:20:00Z",
  },
]

// ═══════════════════════════════════════════
// Filter Tabs
// ═══════════════════════════════════════════

const FILTER_TABS: { value: string; label: string; Icon: React.ElementType }[] = [
  { value: "all", label: "All", Icon: Scale },
  { value: "case-law", label: "Case Law", Icon: BookOpen },
  { value: "legislation", label: "Legislation", Icon: BookOpen },
  { value: "parliament", label: "Parliament", Icon: Landmark },
]

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  if (/^\d{4}$/.test(dateStr)) return dateStr
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function typeDotColor(type: AuthorityType): string {
  if (type === "case-law") return "bg-blue-400/60"
  if (type === "legislation") return "bg-gold/60"
  return "bg-emerald-400/60"
}

// ═══════════════════════════════════════════
// Page Component
// ═══════════════════════════════════════════

export default function SavedAuthoritiesPage() {
  const { profile } = useAuthStore()

  // Local state — replaces Convex queries while in demo mode
  const [authorities, setAuthorities] = useState<SavedAuthority[]>(DEMO_AUTHORITIES)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState("")
  const [editTags, setEditTags] = useState("")
  const [editFolder, setEditFolder] = useState("")
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Derived: unique folders for reference
  const allFolders = useMemo(() => {
    const folders = new Set<string>()
    authorities.forEach((a) => {
      if (a.folder) folders.add(a.folder)
    })
    return Array.from(folders).sort()
  }, [authorities])

  // Filtered list
  const filteredAuthorities = useMemo(() => {
    let list = authorities

    // Tab filter
    if (activeTab === "case-law") {
      list = list.filter((a) => a.type === "case-law")
    } else if (activeTab === "legislation") {
      list = list.filter((a) => a.type === "legislation")
    } else if (activeTab === "parliament") {
      list = list.filter(
        (a) => a.type === "parliament-debate" || a.type === "parliament-bill"
      )
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.citation?.toLowerCase().includes(q) ||
          a.notes?.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q)) ||
          a.folder?.toLowerCase().includes(q) ||
          a.subtitle?.toLowerCase().includes(q)
      )
    }

    return list
  }, [authorities, activeTab, searchQuery])

  // ── Actions ──

  const handleCopyCitation = (authority: SavedAuthority) => {
    const text = authority.citation || authority.title
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(authority._id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const handleRemove = (authorityId: string) => {
    // In production: await removeAuthority({ authorityId })
    setAuthorities((prev) => prev.filter((a) => a._id !== authorityId))
    setRemovingId(null)
  }

  const handleStartEdit = (authority: SavedAuthority) => {
    setEditingId(authority._id)
    setEditNotes(authority.notes || "")
    setEditTags(authority.tags?.join(", ") || "")
    setEditFolder(authority.folder || "")
  }

  const handleSaveEdit = (authorityId: string) => {
    // In production: await updateNotes({ authorityId, notes: editNotes, tags: parsedTags, folder: editFolder || undefined })
    const parsedTags = editTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    setAuthorities((prev) =>
      prev.map((a) =>
        a._id === authorityId
          ? {
              ...a,
              notes: editNotes || undefined,
              tags: parsedTags.length > 0 ? parsedTags : undefined,
              folder: editFolder || undefined,
            }
          : a
      )
    )
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditNotes("")
    setEditTags("")
    setEditFolder("")
  }

  // ── Empty state for no profile ──
  if (!profile) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        <EmptyState
          icon={<Scale size={32} />}
          title="No Profile Found"
          description="Sign in or complete onboarding to view your saved authorities."
          action={
            <Link href="/research">
              <Button variant="outline" size="sm">
                Back to Research
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/research"
            className="p-1.5 rounded-lg text-court-text-ter hover:text-court-text hover:bg-navy-mid transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-court-text tracking-tight">
            Saved Authorities
          </h1>
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-2 py-0.5">
            {filteredAuthorities.length}
          </span>
        </div>
        <p className="text-court-base text-court-text-sec ml-10">
          Your personal collection of cases, statutes, and parliamentary materials.
        </p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 mb-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-court-xs font-bold tracking-wider transition-all flex items-center gap-1.5",
              activeTab === tab.value
                ? "bg-gold-dim text-gold border border-gold/20"
                : "text-court-text-ter hover:text-court-text-sec border border-transparent"
            )}
          >
            <tab.Icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative mb-6">
        <div className="relative bg-navy-card border border-court-border-light rounded-court overflow-hidden focus-within:border-gold/30 transition-colors">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search size={18} className="text-court-text-ter" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, citation, tag, or folder..."
            className="w-full bg-transparent text-court-text placeholder:text-court-text-ter pl-11 pr-4 py-3 text-court-sm focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-court-text-ter hover:text-court-text transition"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Folders (if any exist) ── */}
      {allFolders.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter flex items-center gap-1.5 mr-1">
            <FolderOpen size={12} />
            FOLDERS
          </span>
          {allFolders.map((folder) => (
            <button
              key={folder}
              onClick={() =>
                setSearchQuery((prev) => (prev === folder ? "" : folder))
              }
              className={cn(
                "px-2.5 py-1 rounded-lg text-court-xs font-bold transition-all border",
                searchQuery === folder
                  ? "bg-gold-dim text-gold border-gold/20"
                  : "text-court-text-ter border-court-border hover:text-court-text-sec hover:bg-navy-mid"
              )}
            >
              {folder}
            </button>
          ))}
        </div>
      )}

      {/* ── Authority Cards ── */}
      {filteredAuthorities.length > 0 ? (
        <div className="space-y-2">
          {filteredAuthorities.map((authority) => (
            <div
              key={authority._id}
              className="bg-navy-card border border-court-border-light rounded-court px-4 sm:px-5 py-4 transition-all duration-200 hover:border-white/10"
            >
              <div className="flex items-start gap-3">
                {/* Type Dot */}
                <div
                  className={cn(
                    "mt-1.5 w-2 h-2 rounded-full flex-shrink-0",
                    typeDotColor(authority.type)
                  )}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3
                    className={cn(
                      "text-court-base font-semibold text-court-text leading-snug",
                      authority.type === "case-law" && "italic"
                    )}
                  >
                    {authority.title}
                  </h3>

                  {/* Citation + Subtitle + Date */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                    {authority.citation && (
                      <span className="text-court-xs text-gold font-mono">
                        {authority.citation}
                      </span>
                    )}
                    {authority.subtitle && (
                      <span className="text-court-xs text-court-text-ter tracking-wider uppercase">
                        {authority.subtitle}
                      </span>
                    )}
                    {authority.date && (
                      <>
                        <span className="text-court-border">|</span>
                        <span className="text-court-xs text-court-text-ter">
                          {formatDate(authority.date)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Snippet */}
                  {authority.snippet && (
                    <p className="text-court-sm text-court-text-ter mt-2 line-clamp-2 leading-relaxed">
                      {authority.snippet}
                    </p>
                  )}

                  {/* Notes (view mode) */}
                  {editingId !== authority._id && authority.notes && (
                    <div className="mt-3 px-3 py-2 bg-navy-mid/50 border border-court-border rounded-lg">
                      <p className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1">
                        NOTES
                      </p>
                      <p className="text-court-sm text-court-text-sec leading-relaxed">
                        {authority.notes}
                      </p>
                    </div>
                  )}

                  {/* Notes (edit mode) */}
                  {editingId === authority._id && (
                    <div className="mt-3 space-y-3 p-3 bg-navy-mid/50 border border-gold/20 rounded-lg">
                      <div>
                        <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1 block">
                          NOTES
                        </label>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-navy border border-court-border rounded-xl px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30 resize-none"
                          placeholder="Add your notes on this authority..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1 block">
                            TAGS
                          </label>
                          <input
                            type="text"
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            className="w-full bg-navy border border-court-border rounded-xl px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30"
                            placeholder="tort, duty-of-care, moot-prep"
                          />
                        </div>
                        <div>
                          <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1 block">
                            FOLDER
                          </label>
                          <input
                            type="text"
                            value={editFolder}
                            onChange={(e) => setEditFolder(e.target.value)}
                            className="w-full bg-navy border border-court-border rounded-xl px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30"
                            placeholder="e.g. Tort Law Moot 2026"
                            list="folder-suggestions"
                          />
                          <datalist id="folder-suggestions">
                            {allFolders.map((f) => (
                              <option key={f} value={f} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleSaveEdit(authority._id)}
                          className="px-3 py-1.5 rounded-xl text-court-xs font-bold bg-gold text-navy hover:bg-gold/90 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-xl text-court-xs font-bold text-court-text-ter hover:text-court-text transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {editingId !== authority._id &&
                    authority.tags &&
                    authority.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {authority.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-court-xs font-bold tracking-wider text-court-text-ter bg-white/[0.04] border border-court-border"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Folder badge */}
                  {editingId !== authority._id && authority.folder && (
                    <div className="flex items-center gap-1.5 mt-2 text-court-xs text-court-text-ter">
                      <FolderOpen size={11} />
                      <span>{authority.folder}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0 mt-0.5">
                  {/* Copy citation */}
                  <button
                    onClick={() => handleCopyCitation(authority)}
                    title={
                      copiedId === authority._id
                        ? "Copied"
                        : "Copy citation"
                    }
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      copiedId === authority._id
                        ? "text-gold bg-gold-dim"
                        : "text-court-text-ter hover:text-court-text-sec hover:bg-navy-mid"
                    )}
                  >
                    {copiedId === authority._id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>

                  {/* External link */}
                  <a
                    href={authority.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open source"
                    className="p-1.5 rounded-lg text-court-text-ter hover:text-court-text-sec hover:bg-navy-mid transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>

                  {/* Edit notes */}
                  {editingId !== authority._id && (
                    <button
                      onClick={() => handleStartEdit(authority)}
                      title="Edit notes"
                      className="p-1.5 rounded-lg text-court-text-ter hover:text-court-text-sec hover:bg-navy-mid transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                  )}

                  {/* Remove */}
                  <button
                    onClick={() => setRemovingId(authority._id)}
                    title="Remove authority"
                    className="p-1.5 rounded-lg text-court-text-ter hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* ── Remove Confirmation ── */}
              {removingId === authority._id && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/15 rounded-lg">
                  <p className="text-court-sm text-red-400 flex-1">
                    Remove this authority from your saved collection?
                  </p>
                  <button
                    onClick={() => handleRemove(authority._id)}
                    className="px-3 py-1.5 rounded-xl text-court-xs font-bold bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setRemovingId(null)}
                    className="px-3 py-1.5 rounded-xl text-court-xs font-bold text-court-text-ter hover:text-court-text transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ── Empty State ── */
        <EmptyState
          icon={<Scale size={32} />}
          title="No Saved Authorities"
          description={
            searchQuery || activeTab !== "all"
              ? "No authorities match your current filters. Try adjusting your search or tab selection."
              : "Begin your legal research and save cases, statutes, and parliamentary materials for quick reference."
          }
          action={
            searchQuery || activeTab !== "all" ? (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveTab("all")
                }}
                className="text-court-sm text-gold font-semibold hover:underline transition"
              >
                Clear filters
              </button>
            ) : (
              <Link href="/research">
                <Button variant="outline" size="sm">
                  Start Research
                </Button>
              </Link>
            )
          }
        />
      )}

      {/* ── Source Legend ── */}
      {filteredAuthorities.length > 0 && (
        <div className="mt-8 pt-5 border-t border-court-border flex flex-wrap items-center gap-4 text-court-xs text-court-text-ter">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
            Case Law
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            Legislation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
            Parliament
          </span>
        </div>
      )}
    </div>
  )
}

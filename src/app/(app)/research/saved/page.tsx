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
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils/helpers"
import { useAuthStore } from "@/stores/authStore"
import { EmptyState, Button } from "@/components/ui"
import { useQuery, useMutation } from "convex/react"
import { anyApi } from "convex/server"

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

  // Convex queries & mutations
  const authorities: any[] | undefined = useQuery(
    anyApi.research.getSavedAuthorities,
    profile?._id ? { profileId: profile._id } : "skip"
  )
  const removeAuthorityMutation = useMutation(anyApi.research.removeAuthority)
  const updateNotesMutation = useMutation(anyApi.research.updateAuthorityNotes)

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
    ;(authorities ?? []).forEach((a: any) => {
      if (a.folder) folders.add(a.folder)
    })
    return Array.from(folders).sort()
  }, [authorities])

  // Filtered list
  const filteredAuthorities = useMemo(() => {
    let list = authorities ?? []

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
          a.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
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

  const handleRemove = async (authorityId: string) => {
    try {
      await removeAuthorityMutation({ authorityId: authorityId as any })
    } catch (e) {
      // handle error
    }
    setRemovingId(null)
  }

  const handleStartEdit = (authority: SavedAuthority) => {
    setEditingId(authority._id)
    setEditNotes(authority.notes || "")
    setEditTags(authority.tags?.join(", ") || "")
    setEditFolder(authority.folder || "")
  }

  const handleSaveEdit = async (authorityId: string) => {
    const parsedTags = editTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    try {
      await updateNotesMutation({
        authorityId: authorityId as any,
        notes: editNotes || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        folder: editFolder || undefined,
      })
    } catch (e) {
      // handle error
    }
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

  // ── Loading state while Convex query is in flight ──
  if (authorities === undefined) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold" />
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
                        {authority.tags.map((tag: string) => (
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

"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Scale,
  BookOpen,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Bookmark,
  Landmark,
  Clock,
} from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils/helpers"
import type {
  UnifiedSearchResponse,
  UnifiedSearchResult,
  LegalSourceType,
  CourtCode,
} from "@/lib/legal-api/types"
import { COURTS } from "@/lib/legal-api/types"
import { isNeutralCitation, isLegislationReference } from "@/lib/legal-api/oscola"
import { useAuthStore } from "@/stores/authStore"
import { analytics } from "@/lib/analytics"
import { useQuery, useMutation } from "convex/react"
import { anyApi } from "convex/server"

const SOURCE_TABS: { value: LegalSourceType; label: string; Icon: React.ElementType }[] = [
  { value: "all", label: "All Sources", Icon: Scale },
  { value: "case-law", label: "Case Law", Icon: BookOpen },
  { value: "legislation", label: "Legislation", Icon: BookOpen },
  { value: "parliament", label: "Parliament", Icon: Landmark },
]

const POPULAR_SEARCHES = [
  "Carlill v Carbolic Smoke Ball",
  "Donoghue v Stevenson",
  "Human Rights Act 1998",
  "Consumer Rights Act 2015",
  "R v Woollin",
  "Salomon v Salomon",
]

const COURT_GROUPS = [
  { label: "Supreme Court & Privy Council", courts: COURTS.filter((c) => c.hierarchy === 1) },
  { label: "Court of Appeal", courts: COURTS.filter((c) => c.hierarchy === 2) },
  { label: "High Court", courts: COURTS.filter((c) => c.hierarchy === 3) },
  { label: "Upper Tribunals", courts: COURTS.filter((c) => c.hierarchy === 4) },
  { label: "First-tier Tribunals", courts: COURTS.filter((c) => c.hierarchy === 5) },
]

export default function ResearchPage() {
  const { profile } = useAuthStore()

  // Convex: real search history
  const searchHistory: any[] | undefined = useQuery(
    anyApi.research.getSearchHistory,
    profile?._id ? { profileId: profile._id as any, limit: 10 } : "skip"
  )
  const recordSearchMutation = useMutation(anyApi.research.recordSearch)

  const [query, setQuery] = useState("")
  const [source, setSource] = useState<LegalSourceType>("all")
  const [results, setResults] = useState<UnifiedSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCourts, setSelectedCourts] = useState<CourtCode[]>([])
  const [yearFrom, setYearFrom] = useState("")
  const [yearTo, setYearTo] = useState("")
  const [judgeFilter, setJudgeFilter] = useState("")
  const [partyFilter, setPartyFilter] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const performSearch = useCallback(
    async (searchQuery?: string, searchPage?: number) => {
      const q = searchQuery ?? query
      if (!q.trim()) return
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set("q", q)
        params.set("source", source)
        params.set("page", (searchPage || page).toString())
        params.set("perPage", "20")
        if (selectedCourts.length > 0)
          selectedCourts.forEach((c) => params.append("court", c))
        if (yearFrom) params.set("yearFrom", yearFrom)
        if (yearTo) params.set("yearTo", yearTo)
        if (judgeFilter) params.set("judge", judgeFilter)
        if (partyFilter) params.set("party", partyFilter)

        const response = await fetch(`/api/legal/search?${params.toString()}`)
        if (!response.ok) throw new Error("Search failed")
        const data: UnifiedSearchResponse = await response.json()
        setResults(data)
        analytics.searchPerformed(q, source, data.totalResults)
        if (resultsRef.current)
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })

        // Record search in Convex history
        if (profile?._id) {
          recordSearchMutation({
            profileId: profile._id as any,
            query: q,
            source,
            resultCount: data.totalResults,
            queryTime: data.queryTime,
          }).catch(() => {
            // Silent fail — search history recording is non-critical
          })
        }
      } catch {
        setError("Search failed. Please check your connection and try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [query, source, page, selectedCourts, yearFrom, yearTo, judgeFilter, partyFilter, profile?._id, recordSearchMutation]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    performSearch(undefined, 1)
  }

  const handleQuickSearch = (term: string) => {
    setQuery(term)
    if (isNeutralCitation(term)) setSource("case-law")
    else if (isLegislationReference(term)) setSource("legislation")
    performSearch(term, 1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    performSearch(undefined, newPage)
  }

  const toggleCourt = (code: CourtCode) =>
    setSelectedCourts((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )

  const clearFilters = () => {
    setSelectedCourts([])
    setYearFrom("")
    setYearTo("")
    setJudgeFilter("")
    setPartyFilter("")
  }

  const hasActiveFilters =
    selectedCourts.length > 0 || yearFrom || yearTo || judgeFilter || partyFilter

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-court-text tracking-tight leading-tight">
            Legal Research
          </h1>
          <Link
            href="/research/saved"
            className="flex-shrink-0 flex items-center gap-1.5 text-court-xs font-bold tracking-wider text-court-text-ter hover:text-gold transition-colors min-h-[44px]"
          >
            <Bookmark size={14} />
            Saved
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-2 py-1">
            OFFICIAL SOURCES
          </span>
        </div>
        <p className="text-court-sm sm:text-court-base text-court-text-sec leading-relaxed">
          Search every UK statute and court judgment. Powered by legislation.gov.uk & Find Case Law.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative group">
          <div className="relative bg-navy-card border border-court-border-light rounded-court overflow-hidden group-focus-within:border-gold/30 transition-colors">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {isLoading ? (
                <Loader2 size={20} className="text-court-text-ter animate-spin" />
              ) : (
                <Search
                  size={20}
                  className="text-court-text-ter group-focus-within:text-gold/60 transition-colors"
                />
              )}
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cases, statutes, or paste a citation..."
              className="w-full bg-transparent text-court-text placeholder:text-court-text-ter/60 pl-12 pr-4 py-3.5 sm:py-4 text-court-sm sm:text-base focus:outline-none"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Source Tabs + Filter Toggle */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSource(tab.value)}
              className={cn(
                "flex-shrink-0 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl text-court-xs font-bold tracking-wider transition-all flex items-center gap-1.5 active:scale-95",
                source === tab.value
                  ? "bg-gold-dim text-gold border border-gold/20"
                  : "text-court-text-ter hover:text-court-text-sec border border-transparent"
              )}
            >
              <tab.Icon size={14} />
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex-shrink-0 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl text-court-xs font-bold tracking-wider transition-all flex items-center gap-1.5 active:scale-95",
              showFilters || hasActiveFilters
                ? "bg-gold-dim text-gold border border-gold/20"
                : "text-court-text-ter hover:text-court-text-sec border border-transparent"
            )}
          >
            <Filter size={14} />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            )}
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 bg-navy-card border border-court-border-light rounded-court p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter">
              FILTERS
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-court-xs text-gold/70 hover:text-gold transition flex items-center gap-1 min-h-[44px] active:scale-95"
              >
                <X size={12} />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1 block">
                YEAR FROM
              </label>
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="e.g. 2000"
                min="1200"
                max="2026"
                className="w-full bg-navy-mid border border-court-border rounded-xl px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30"
              />
            </div>
            <div>
              <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1 block">
                YEAR TO
              </label>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="e.g. 2026"
                min="1200"
                max="2026"
                className="w-full bg-navy-mid border border-court-border rounded-xl px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30"
              />
            </div>
          </div>

          {(source === "all" || source === "case-law") && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1 block">
                  PARTY NAME
                </label>
                <input
                  type="text"
                  value={partyFilter}
                  onChange={(e) => setPartyFilter(e.target.value)}
                  placeholder="e.g. Donoghue"
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30"
                />
              </div>
              <div>
                <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-1 block">
                  JUDGE
                </label>
                <input
                  type="text"
                  value={judgeFilter}
                  onChange={(e) => setJudgeFilter(e.target.value)}
                  placeholder="e.g. Lord Denning"
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30"
                />
              </div>
            </div>
          )}

          {(source === "all" || source === "case-law") && (
            <div>
              <label className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-2 block">
                COURTS
              </label>
              <div className="space-y-3">
                {COURT_GROUPS.map((group) => (
                  <div key={group.label}>
                    <span className="text-court-xs text-court-text-ter tracking-wider">
                      {group.label}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {group.courts.map((court) => (
                        <button
                          key={court.code}
                          type="button"
                          onClick={() => toggleCourt(court.code)}
                          className={cn(
                            "px-3 py-2 rounded text-court-xs font-bold transition-all active:scale-95",
                            selectedCourts.includes(court.code)
                              ? "bg-gold-dim text-gold border border-gold/30"
                              : "bg-navy-mid text-court-text-ter hover:text-court-text-sec border border-court-border"
                          )}
                        >
                          {court.shortName}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popular Searches */}
      {!results && !isLoading && (
        <div className="mb-6">
          <p className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-3">
            POPULAR SEARCHES
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="px-3 sm:px-4 py-2.5 min-h-[44px] bg-navy-card border border-court-border-light rounded-xl text-court-sm text-court-text-sec hover:text-court-text hover:bg-navy-mid hover:border-court-border transition-all active:scale-95 text-left truncate"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!results && !isLoading && profile?._id && (
        <div className="mb-6">
          <p className="text-court-xs font-bold tracking-[0.15em] text-court-text-ter mb-3 flex items-center gap-2">
            <Clock size={12} />
            RECENT SEARCHES
          </p>
          {searchHistory === undefined ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3 bg-navy-card border border-court-border-light rounded-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-3.5 w-[60%] bg-white/[0.06] rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    <div className="h-3 w-20 bg-white/[0.04] rounded animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.map((item: any) => (
                <button
                  key={item._id}
                  onClick={() => handleQuickSearch(item.query)}
                  className="group/recent w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] bg-navy-card border border-court-border-light rounded-xl hover:bg-navy-mid hover:border-court-border transition-all active:scale-95"
                >
                  <span className="text-court-sm text-court-text-sec group-hover/recent:text-court-text transition-colors truncate text-left">
                    {item.query}
                  </span>
                  <span className="flex-shrink-0 text-court-xs text-court-text-ter group-hover/recent:text-court-text-sec transition-colors whitespace-nowrap">
                    {item.resultCount} result{item.resultCount !== 1 ? "s" : ""} · {formatRelativeTime(item.searchedAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-court-sm text-court-text-ter py-3">
              No recent searches yet. Try searching for a case, statute, or citation above.
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-court px-4 py-3 text-court-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div ref={resultsRef}>
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-court-sm text-court-text-sec">
                {results.totalResults.toLocaleString()} result
                {results.totalResults !== 1 ? "s" : ""}
              </span>
              <span className="text-court-border">|</span>
              <span className="text-court-xs text-court-text-ter">
                {results.queryTime}ms
              </span>
            </div>
            <div className="flex items-center gap-3 text-court-xs text-court-text-ter">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                {results.sources.caseLaw} cases
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                {results.sources.legislation} statutes
              </span>
              {(results.sources.parliamentDebates > 0 || results.sources.parliamentBills > 0) && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                  {results.sources.parliamentDebates + results.sources.parliamentBills} parliament
                </span>
              )}
            </div>
          </div>

          {/* Result Cards */}
          {results.results.length > 0 ? (
            <div className="space-y-2">
              {results.results.map((result, i) => (
                <ResultCard key={`${result.id}-${i}`} result={result} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Scale size={48} className="text-court-text-ter mx-auto mb-4" />
              <p className="text-court-text-sec text-court-sm">
                No results found. Try broadening your search terms.
              </p>
            </div>
          )}

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-court-xs font-bold text-court-text-sec hover:text-court-text disabled:opacity-20 disabled:cursor-not-allowed transition flex items-center gap-1 active:scale-95"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <span className="text-court-xs text-court-text-ter px-3">
                Page {results.currentPage} of {results.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= results.totalPages}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-court-xs font-bold text-court-text-sec hover:text-court-text disabled:opacity-20 disabled:cursor-not-allowed transition flex items-center gap-1 active:scale-95"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Attribution */}
          <div className="mt-12 pt-6 border-t border-court-border text-center">
            <p className="text-court-xs text-court-text-ter leading-relaxed">
              Case law data licensed under the{" "}
              <a
                href="https://caselaw.nationalarchives.gov.uk/re-use-find-case-law-records"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-court-text-sec transition"
              >
                Open Justice Licence
              </a>
              . Legislation data from{" "}
              <a
                href="https://www.legislation.gov.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-court-text-sec transition"
              >
                legislation.gov.uk
              </a>{" "}
              under the{" "}
              <a
                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-court-text-sec transition"
              >
                Open Government Licence
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({ result }: { result: UnifiedSearchResult }) {
  const isCaseLaw = result.type === "case-law"
  const isParliament = result.type === "parliament-debate" || result.type === "parliament-bill"
  const [copied, setCopied] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const text = result.citation || result.title
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarked(!bookmarked)
    // Bookmark state persists visually — Convex integration requires auth context
  }

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group bg-navy-card hover:bg-navy-mid border border-court-border-light hover:border-white/10 rounded-court px-4 sm:px-5 py-4 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-1 w-2 h-2 rounded-full flex-shrink-0",
            isCaseLaw ? "bg-blue-400/60" : isParliament ? "bg-emerald-400/60" : "bg-gold/60"
          )}
        />
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-court-base font-semibold text-court-text group-hover:text-white transition leading-snug",
              isCaseLaw && "italic"
            )}
          >
            {result.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
            {result.citation && (
              <span className="text-court-xs text-gold font-mono">
                {result.citation}
              </span>
            )}
            <span className="text-court-xs text-court-text-ter tracking-wider uppercase">
              {result.subtitle}
            </span>
            {result.date && (
              <>
                <span className="text-court-border">|</span>
                <span className="text-court-xs text-court-text-ter">
                  {formatDate(result.date)}
                </span>
              </>
            )}
          </div>
          {result.snippet && (
            <p className="text-court-sm text-court-text-ter mt-2 line-clamp-2 leading-relaxed">
              {result.snippet}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0 mt-0.5">
          <button
            onClick={handleCopy}
            title={copied ? "Copied" : "Copy OSCOLA citation"}
            className={cn(
              "p-2.5 rounded-lg transition-all active:scale-95",
              copied
                ? "text-gold bg-gold-dim"
                : "text-court-text-ter hover:text-court-text-sec hover:bg-navy-mid"
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button
            onClick={handleBookmark}
            title={bookmarked ? "Saved" : "Save authority"}
            className={cn(
              "p-2.5 rounded-lg transition-all active:scale-95",
              bookmarked
                ? "text-gold bg-gold-dim"
                : "text-court-text-ter hover:text-court-text-sec hover:bg-navy-mid"
            )}
          >
            <Bookmark size={14} className={bookmarked ? "fill-gold" : ""} />
          </button>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg text-court-text-ter hover:text-court-text-sec hover:bg-navy-mid transition-all active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </a>
  )
}

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

// ============================================================================
// RATIO — Unified Legal Search Service
// Combines legislation.gov.uk + Find Case Law into a single search API
// ============================================================================

import { searchLegislation } from "./legislation"
import { searchCaseLaw } from "./case-law"
import { generateCaseCitation, generateLegislationCitation } from "./oscola"
import type { UnifiedSearchParams, UnifiedSearchResult, UnifiedSearchResponse } from "./types"

export async function unifiedSearch(params: UnifiedSearchParams): Promise<UnifiedSearchResponse> {
  const startTime = Date.now()
  const results: UnifiedSearchResult[] = []
  let legislationCount = 0
  let caseLawCount = 0
  const promises: Promise<void>[] = []

  if (params.source === "all" || params.source === "legislation") {
    promises.push(
      searchLegislation({
        title: params.query, type: params.filters?.legislationType, year: params.filters?.yearFrom,
        page: params.page, resultsCount: params.perPage || 10,
      }).then((res) => {
        legislationCount = res.totalResults
        for (const item of res.items) {
          const citation = generateLegislationCitation(item)
          results.push({
            type: "legislation", id: item.id, title: item.title,
            subtitle: formatLegislationType(item.type), date: item.year?.toString() || "",
            citation: citation.formatted, url: item.url,
          })
        }
      }).catch((err) => { console.error("Legislation search error:", err) })
    )
  }

  if (params.source === "all" || params.source === "case-law") {
    promises.push(
      searchCaseLaw({
        query: params.query, court: params.filters?.court, judge: params.filters?.judge,
        party: params.filters?.party,
        dateFrom: params.filters?.yearFrom ? `${params.filters.yearFrom}-01-01` : undefined,
        dateTo: params.filters?.yearTo ? `${params.filters.yearTo}-12-31` : undefined,
        page: params.page, perPage: params.perPage || 10, order: "relevance",
      }).then((res) => {
        caseLawCount = res.totalResults
        for (const item of res.items) {
          const citation = generateCaseCitation(item)
          results.push({
            type: "case-law", id: item.uri, title: item.caseName, subtitle: item.court,
            date: item.dateHanded, citation: citation.formatted, url: item.url, snippet: item.summary,
          })
        }
      }).catch((err) => { console.error("Case law search error:", err) })
    )
  }

  await Promise.all(promises)

  results.sort((a, b) => {
    if (a.type !== b.type) return a.type === "case-law" ? -1 : 1
    return b.date.localeCompare(a.date)
  })

  const totalResults = legislationCount + caseLawCount
  const perPage = params.perPage || 20

  return {
    results, totalResults, currentPage: params.page || 1,
    totalPages: Math.ceil(totalResults / perPage), queryTime: Date.now() - startTime,
    sources: { legislation: legislationCount, caseLaw: caseLawCount },
  }
}

function formatLegislationType(type: string): string {
  const map: Record<string, string> = {
    ukpga: "UK Public General Act", ukla: "UK Local Act", uksi: "UK Statutory Instrument",
    ukdsi: "UK Draft Statutory Instrument", asp: "Act of the Scottish Parliament",
    ssi: "Scottish Statutory Instrument", anaw: "Act of the National Assembly for Wales",
    asc: "Act of Senedd Cymru", wsi: "Wales Statutory Instrument",
    nia: "Northern Ireland Act", nisr: "Northern Ireland Statutory Rules",
    eur: "EU Retained Legislation", ukppa: "UK Private and Personal Act", ukcm: "UK Church Measure",
  }
  return map[type] || type.toUpperCase()
}

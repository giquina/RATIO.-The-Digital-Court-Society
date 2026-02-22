// ============================================================================
// RATIO — Unified Legal Search Service
// Combines legislation.gov.uk + Find Case Law + UK Parliament into a single search API
// ============================================================================

import { searchLegislation } from "./legislation"
import { searchCaseLaw } from "./case-law"
import { searchDebates, searchBills } from "./parliament"
import { generateCaseCitation, generateLegislationCitation } from "./oscola"
import type { UnifiedSearchParams, UnifiedSearchResult, UnifiedSearchResponse } from "./types"

export async function unifiedSearch(params: UnifiedSearchParams): Promise<UnifiedSearchResponse> {
  const startTime = Date.now()
  const results: UnifiedSearchResult[] = []
  let legislationCount = 0
  let caseLawCount = 0
  let parliamentDebatesCount = 0
  let parliamentBillsCount = 0
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

  if (params.source === "all" || params.source === "parliament") {
    // Search Hansard debates
    promises.push(
      searchDebates({
        searchTerm: params.query,
        house: params.filters?.house,
        startDate: params.filters?.yearFrom ? `${params.filters.yearFrom}-01-01` : undefined,
        endDate: params.filters?.yearTo ? `${params.filters.yearTo}-12-31` : undefined,
        take: params.perPage || 10,
        skip: params.page ? (params.page - 1) * (params.perPage || 10) : 0,
        orderBy: "SittingDateDesc",
      }).then((res) => {
        parliamentDebatesCount = res.totalResults
        for (const item of res.items) {
          results.push({
            type: "parliament-debate",
            id: item.debateSectionExtId,
            title: item.title,
            subtitle: `${item.house} - ${item.debateSection}`,
            date: item.sittingDate,
            citation: `HC Deb ${item.sittingDate}`,
            url: item.url,
            relevanceScore: item.rank,
          })
        }
      }).catch((err) => { console.error("Hansard debate search error:", err) })
    )

    // Search Bills
    promises.push(
      searchBills({
        searchTerm: params.query,
        currentHouse: params.filters?.house,
        take: params.perPage || 10,
        skip: params.page ? (params.page - 1) * (params.perPage || 10) : 0,
        sortOrder: "DateUpdatedDescending",
      }).then((res) => {
        parliamentBillsCount = res.totalResults
        for (const item of res.items) {
          const stageDesc = item.currentStage
            ? `${item.currentStage.description} (${item.currentStage.house})`
            : item.isAct ? "Royal Assent" : ""
          results.push({
            type: "parliament-bill",
            id: item.billId.toString(),
            title: item.shortTitle,
            subtitle: stageDesc || `${item.originatingHouse} Bill`,
            date: item.lastUpdate,
            citation: item.shortTitle,
            url: item.url,
            snippet: item.isAct ? "Act of Parliament" : item.isDefeated ? "Defeated" : "In progress",
          })
        }
      }).catch((err) => { console.error("Bills search error:", err) })
    )
  }

  await Promise.all(promises)

  // Sort: case-law first, then parliament debates, then parliament bills, then legislation
  // Within each type, sort by date descending
  const typePriority: Record<string, number> = {
    "case-law": 0,
    "parliament-debate": 1,
    "parliament-bill": 2,
    "legislation": 3,
  }

  results.sort((a, b) => {
    const priorityDiff = (typePriority[a.type] ?? 4) - (typePriority[b.type] ?? 4)
    if (priorityDiff !== 0) return priorityDiff
    return b.date.localeCompare(a.date)
  })

  const totalResults = legislationCount + caseLawCount + parliamentDebatesCount + parliamentBillsCount
  const perPage = params.perPage || 20

  return {
    results, totalResults, currentPage: params.page || 1,
    totalPages: Math.ceil(totalResults / perPage), queryTime: Date.now() - startTime,
    sources: {
      legislation: legislationCount,
      caseLaw: caseLawCount,
      parliamentDebates: parliamentDebatesCount,
      parliamentBills: parliamentBillsCount,
    },
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

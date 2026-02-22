// ============================================================================
// RATIO — Find Case Law API Service (National Archives)
// Free, open API under Open Justice Licence
// Docs: https://nationalarchives.github.io/ds-find-caselaw-docs/public
// ============================================================================

import type {
  CaseLawItem,
  CaseLawSearchParams,
  CaseLawSearchResult,
  CourtCode,
} from "./types"

const BASE_URL = "https://caselaw.nationalarchives.gov.uk"

function buildSearchUrl(params: CaseLawSearchParams): string {
  const queryParams = new URLSearchParams()

  if (params.query) queryParams.set("query", params.query)
  if (params.party) queryParams.set("party", params.party)
  if (params.judge) queryParams.set("judge", params.judge)
  if (params.dateFrom) queryParams.set("from_date_0", params.dateFrom.split("-")[2] || "")
  if (params.dateFrom) queryParams.set("from_date_1", params.dateFrom.split("-")[1] || "")
  if (params.dateFrom) queryParams.set("from_date_2", params.dateFrom.split("-")[0] || "")
  if (params.dateTo) queryParams.set("to_date_0", params.dateTo.split("-")[2] || "")
  if (params.dateTo) queryParams.set("to_date_1", params.dateTo.split("-")[1] || "")
  if (params.dateTo) queryParams.set("to_date_2", params.dateTo.split("-")[0] || "")

  if (params.court) {
    const courts = Array.isArray(params.court) ? params.court : [params.court]
    courts.forEach((c) => queryParams.append("court", c))
  }

  if (params.order && params.order !== "relevance") queryParams.set("order", params.order)
  if (params.page && params.page > 1) queryParams.set("page", params.page.toString())
  if (params.perPage) queryParams.set("per_page", params.perPage.toString())

  return `${BASE_URL}/atom.xml?${queryParams.toString()}`
}

function parseAtomFeed(xml: string): CaseLawSearchResult {
  const items: CaseLawItem[] = []

  // Try opensearch elements first, then fall back to link-based pagination
  const totalMatch = xml.match(/<opensearch:totalResults>(\d+)<\/opensearch:totalResults>/)
  let totalResults = totalMatch ? parseInt(totalMatch[1], 10) : 0

  // If no opensearch, estimate from last page link: rel="last" href="...&page=N"
  if (!totalResults) {
    const lastPageMatch = xml.match(/<link[^>]*rel="last"[^>]*href="[^"]*page=(\d+)"/)
    if (lastPageMatch) {
      const perPageMatch = xml.match(/per_page=(\d+)/)
      const perPage = perPageMatch ? parseInt(perPageMatch[1], 10) : 20
      totalResults = parseInt(lastPageMatch[1], 10) * perPage
    }
  }

  const pageMatch = xml.match(/<opensearch:startIndex>(\d+)<\/opensearch:startIndex>/)
  const startIndex = pageMatch ? parseInt(pageMatch[1], 10) : 1
  const perPageMatch = xml.match(/<opensearch:itemsPerPage>(\d+)<\/opensearch:itemsPerPage>/)
  const perPage = perPageMatch ? parseInt(perPageMatch[1], 10) : 20
  const currentPage = pageMatch ? Math.ceil(startIndex / perPage) : 1

  const nextMatch = xml.match(/<link[^>]*rel="next"[^>]*href="([^"]*)"/)
  const nextPageUrl = nextMatch ? decodeXmlEntities(nextMatch[1]) : undefined

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1]
    const idMatch = entry.match(/<id>([^<]*)<\/id>/)
    const titleMatch = entry.match(/<title[^>]*>([^<]*)<\/title>/)
    const publishedMatch = entry.match(/<published>([^<]*)<\/published>/)
    const updatedMatch = entry.match(/<updated>([^<]*)<\/updated>/)
    const summaryMatch = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)
    // Match first alternate link that's an HTML page (not XML or PDF)
    const altLinkMatch = entry.match(/<link[^>]*href="([^"]*)"[^>]*rel="alternate"[^/>]*\/>/) ||
                         entry.match(/<link[^>]*rel="alternate"[^>]*href="([^"]*)"/)
    // tna:identifier with type="ukncn" holds neutral citation
    const citationMatch = entry.match(/<tna:identifier[^>]*type="ukncn"[^>]*>([^<]*)<\/tna:identifier>/)
    // Court name is in <author><name>
    const courtMatch = entry.match(/<author>\s*<name>([^<]*)<\/name>/)

    if (idMatch && titleMatch) {
      const caseName = decodeXmlEntities(titleMatch[1])

      // Extract URI from the alternate link or tna:identifier slug
      const slugMatch = entry.match(/<tna:identifier[^>]*slug="([^"]*)"[^>]*type="ukncn"/)
      const altUrl = altLinkMatch ? decodeXmlEntities(altLinkMatch[1]) : ""
      const uri = slugMatch ? slugMatch[1] : altUrl.replace(BASE_URL + "/", "").replace(/^\//, "")

      let neutralCitation = ""
      if (citationMatch) {
        neutralCitation = decodeXmlEntities(citationMatch[1])
      } else {
        const ncMatch = caseName.match(/(\[\d{4}\]\s+[A-Z]+(?:\s+[A-Z]+)*\s+\d+)/)
        if (ncMatch) neutralCitation = ncMatch[1]
      }

      const courtCode = inferCourtFromUri(uri)
      const courtName = courtMatch ? decodeXmlEntities(courtMatch[1]) : courtCodeToName(courtCode)

      const dateStr = publishedMatch?.[1] || updatedMatch?.[1] || ""

      items.push({
        uri,
        neutralCitation,
        caseName: cleanCaseName(caseName),
        court: courtName,
        courtCode,
        dateHanded: dateStr.split("T")[0] || "",
        url: altUrl || `${BASE_URL}/${uri}`,
        xmlUrl: `${BASE_URL}/${uri}/data.xml`,
        summary: summaryMatch ? decodeXmlEntities(summaryMatch[1]).trim() || undefined : undefined,
      })
    }
  }

  // If we couldn't get totalResults from pagination, at least count what we have
  if (!totalResults && items.length > 0) {
    totalResults = items.length
  }

  return { items, totalResults, currentPage, nextPageUrl }
}

function inferCourtFromUri(uri: string): CourtCode {
  const parts = uri.toLowerCase().split("/")
  const courtMappings: [string[], CourtCode][] = [
    [["uksc"], "uksc"], [["ukpc"], "ukpc"],
    [["ewca", "civ"], "ewca/civ"], [["ewca", "crim"], "ewca/crim"],
    [["ewhc", "admin"], "ewhc/admin"], [["ewhc", "ch"], "ewhc/ch"],
    [["ewhc", "comm"], "ewhc/comm"], [["ewhc", "fam"], "ewhc/fam"],
    [["ewhc", "kb"], "ewhc/kb"], [["ewhc", "tcc"], "ewhc/tcc"],
    [["ewhc", "pat"], "ewhc/pat"], [["ewhc", "ipec"], "ewhc/ipec"],
    [["ewhc", "scco"], "ewhc/scco"],
    [["ukut", "iac"], "ukut/iac"], [["ukut", "lc"], "ukut/lc"],
    [["ukut", "tcc"], "ukut/tcc"], [["ukut", "aac"], "ukut/aac"],
    [["ukeat"], "ukeat"],
    [["ukftt", "tc"], "ukftt/tc"], [["ukftt", "grc"], "ukftt/grc"],
  ]

  for (const [segments, code] of courtMappings) {
    if (segments.every((seg) => parts.includes(seg))) return code
  }
  return "ewhc/kb"
}

function courtCodeToName(code: CourtCode): string {
  const names: Record<string, string> = {
    uksc: "UK Supreme Court", ukpc: "Privy Council",
    "ewca/civ": "Court of Appeal (Civil)", "ewca/crim": "Court of Appeal (Criminal)",
    "ewhc/admin": "High Court (Admin)", "ewhc/ch": "High Court (Chancery)",
    "ewhc/comm": "High Court (Commercial)", "ewhc/fam": "High Court (Family)",
    "ewhc/kb": "High Court (King's Bench)", "ewhc/tcc": "High Court (TCC)",
    "ewhc/pat": "High Court (Patents)", "ewhc/ipec": "IPEC", "ewhc/scco": "SCCO",
    "ukut/iac": "Upper Tribunal (IAC)", "ukut/lc": "Upper Tribunal (Lands)",
    "ukut/tcc": "Upper Tribunal (Tax)", "ukut/aac": "Upper Tribunal (AAC)",
    ukeat: "Employment Appeal Tribunal",
    "ukftt/tc": "First-tier Tribunal (Tax)", "ukftt/grc": "First-tier Tribunal (GRC)",
  }
  return names[code] || code
}

function cleanCaseName(name: string): string {
  return name.replace(/\s*\[\d{4}\]\s+[A-Z]+(?:\s+[A-Z]+)*\s+\d+\s*/g, " ").replace(/\s+/g, " ").trim()
}

function decodeXmlEntities(text: string): string {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
}

export async function searchCaseLaw(params: CaseLawSearchParams): Promise<CaseLawSearchResult> {
  const url = buildSearchUrl(params)
  const response = await fetch(url, { headers: { Accept: "application/atom+xml" }, next: { revalidate: 1800 } })
  if (!response.ok) throw new Error(`Find Case Law API error: ${response.status} ${response.statusText}`)
  const xml = await response.text()
  return parseAtomFeed(xml)
}

export async function getCaseByUri(uri: string): Promise<CaseLawItem | null> {
  const cleanUri = uri.replace(/^\//, "")
  const url = `${BASE_URL}/${cleanUri}`
  const response = await fetch(url, { headers: { Accept: "text/html" }, next: { revalidate: 86400 }, redirect: "follow" })
  if (!response.ok) { if (response.status === 404) return null; throw new Error(`Find Case Law API error: ${response.status}`) }
  const html = await response.text()
  const titleMatch = html.match(/<title>([^<]*)<\/title>/)
  const caseName = titleMatch ? decodeXmlEntities(titleMatch[1]).replace(" - Find Case Law", "") : cleanUri
  const courtCode = inferCourtFromUri(cleanUri)
  return { uri: cleanUri, neutralCitation: "", caseName, court: courtCodeToName(courtCode), courtCode, dateHanded: "", url, xmlUrl: `${url}/data.xml` }
}

export async function getCaseXml(uri: string): Promise<string> {
  const cleanUri = uri.replace(/^\//, "")
  const response = await fetch(`${BASE_URL}/${cleanUri}/data.xml`, { headers: { Accept: "application/xml" }, next: { revalidate: 86400 } })
  if (!response.ok) throw new Error(`Find Case Law API error: ${response.status}`)
  return response.text()
}

export async function searchByNeutralCitation(citation: string): Promise<CaseLawItem | null> {
  const results = await searchCaseLaw({ query: `"${citation}"`, perPage: 1 })
  return results.items[0] || null
}

export async function getRecentCases(court: CourtCode, limit: number = 10): Promise<CaseLawItem[]> {
  const results = await searchCaseLaw({ court, order: "-date", perPage: Math.min(limit, 50) })
  return results.items
}

export function buildCaseLawUrl(uri: string): string {
  return `${BASE_URL}/${uri.replace(/^\//, "")}`
}

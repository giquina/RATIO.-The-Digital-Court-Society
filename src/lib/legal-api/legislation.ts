// ============================================================================
// RATIO — Legislation.gov.uk API Service
// Free, open API — no auth required
// Docs: https://legislation.github.io/data-documentation/api/overview.html
// ============================================================================

import type {
  LegislationItem,
  LegislationSection,
  LegislationSearchParams,
  LegislationSearchResult,
  LegislationType,
} from "./types"

const BASE_URL = "https://www.legislation.gov.uk"

function buildSearchUrl(params: LegislationSearchParams): string {
  const segments: string[] = [BASE_URL]

  if (params.type) {
    const types = Array.isArray(params.type) ? params.type : [params.type]
    if (types.length === 1) {
      segments.push(types[0])
    } else {
      segments.push("all")
    }
  } else {
    segments.push("all")
  }

  if (params.year) {
    segments.push(params.year.toString())
  }

  const queryParams = new URLSearchParams()
  if (params.title) queryParams.set("title", params.title)
  if (params.number) queryParams.set("number", params.number.toString())
  if (params.resultsCount) queryParams.set("results-count", Math.min(params.resultsCount, 100).toString())
  if (params.page && params.page > 1) queryParams.set("page", params.page.toString())

  const url = segments.join("/") + "/data.feed"
  const qs = queryParams.toString()
  return qs ? `${url}?${qs}` : url
}

function parseAtomFeed(xml: string): LegislationSearchResult {
  const items: LegislationItem[] = []

  const totalMatch = xml.match(/<openSearch:totalResults>(\d+)<\/openSearch:totalResults>/)
  const totalResults = totalMatch ? parseInt(totalMatch[1], 10) : 0

  const pageMatch = xml.match(/<openSearch:startIndex>(\d+)<\/openSearch:startIndex>/)
  const startIndex = pageMatch ? parseInt(pageMatch[1], 10) : 1
  const itemsPerPageMatch = xml.match(/<openSearch:itemsPerPage>(\d+)<\/openSearch:itemsPerPage>/)
  const itemsPerPage = itemsPerPageMatch ? parseInt(itemsPerPageMatch[1], 10) : 20
  const currentPage = Math.ceil(startIndex / itemsPerPage)
  const totalPages = Math.ceil(totalResults / itemsPerPage)

  const nextMatch = xml.match(/<link[^>]*rel="next"[^>]*href="([^"]*)"/)
  const nextPageUrl = nextMatch ? nextMatch[1] : undefined

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1]
    const idMatch = entry.match(/<id>([^<]*)<\/id>/)
    const titleMatch = entry.match(/<title[^>]*>([^<]*)<\/title>/)
    const updatedMatch = entry.match(/<updated>([^<]*)<\/updated>/)
    const typeMatch = entry.match(/<ukm:DocumentMainType[^>]*Value="([^"]*)"/)
    const yearMatch = entry.match(/<ukm:Year[^>]*Value="(\d+)"/)
    const numberMatch = entry.match(/<ukm:Number[^>]*Value="(\d+)"/)

    if (idMatch && titleMatch) {
      const id = idMatch[1]
      const legType = inferLegislationType(id, typeMatch?.[1])

      items.push({
        id,
        title: decodeXmlEntities(titleMatch[1]),
        type: legType,
        year: yearMatch ? parseInt(yearMatch[1], 10) : 0,
        number: numberMatch ? parseInt(numberMatch[1], 10) : 0,
        url: id.replace("/id/", "/"),
        dataUrl: id.replace("/id/", "/") + "/data.xml",
        updated: updatedMatch?.[1],
      })
    }
  }

  return { items, totalResults, currentPage, totalPages, nextPageUrl }
}

function inferLegislationType(uri: string, documentType?: string): LegislationType {
  const typeMap: Record<string, LegislationType> = {
    ukpga: "ukpga", ukla: "ukla", uksi: "uksi", ukdsi: "ukdsi",
    asp: "asp", ssi: "ssi", anaw: "anaw", asc: "asc", wsi: "wsi",
    nia: "nia", nisr: "nisr", eur: "eur", ukppa: "ukppa", ukcm: "ukcm",
  }

  for (const [key, value] of Object.entries(typeMap)) {
    if (uri.includes(`/${key}/`)) return value
  }

  if (documentType) {
    const docTypeMap: Record<string, LegislationType> = {
      UnitedKingdomPublicGeneralAct: "ukpga",
      UnitedKingdomStatutoryInstrument: "uksi",
      ScottishAct: "asp",
      ScottishStatutoryInstrument: "ssi",
      WelshStatutoryInstrument: "wsi",
      NorthernIrelandAct: "nia",
      EuropeanUnionRegulation: "eur",
      EuropeanUnionDecision: "eur",
      EuropeanUnionDirective: "eur",
    }
    if (docTypeMap[documentType]) return docTypeMap[documentType]
  }

  return "ukpga"
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

export async function searchLegislation(
  params: LegislationSearchParams
): Promise<LegislationSearchResult> {
  const url = buildSearchUrl(params)
  const response = await fetch(url, {
    headers: { Accept: "application/atom+xml" },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Legislation API error: ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  return parseAtomFeed(xml)
}

export async function getLegislation(
  type: LegislationType, year: number, number: number
): Promise<LegislationItem | null> {
  const url = `${BASE_URL}/${type}/${year}/${number}`
  const response = await fetch(`${url}/data.xml`, {
    headers: { Accept: "application/xml" },
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Legislation API error: ${response.status}`)
  }

  const xml = await response.text()
  const titleMatch = xml.match(/<dc:title>([^<]*)<\/dc:title>/)
  const title = titleMatch ? decodeXmlEntities(titleMatch[1]) : `${type.toUpperCase()} ${year} c.${number}`

  return { id: `${BASE_URL}/id/${type}/${year}/${number}`, title, type, year, number, url, dataUrl: `${url}/data.xml` }
}

export async function getLegislationContents(
  type: LegislationType, year: number, number: number
): Promise<LegislationSection[]> {
  const url = `${BASE_URL}/${type}/${year}/${number}/contents`
  const response = await fetch(url, {
    headers: { Accept: "application/xhtml+xml,text/html" },
    next: { revalidate: 86400 },
  })

  if (!response.ok) throw new Error(`Legislation API error: ${response.status}`)

  const html = await response.text()
  const sections: LegislationSection[] = []
  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g
  let linkMatch

  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const href = linkMatch[1]
    const text = decodeXmlEntities(linkMatch[2])
    if (href.includes("/section/") || href.includes("/part/") || href.includes("/schedule/")) {
      const numberMatch = href.match(/\/(section|part|schedule)\/(.+?)$/)
      sections.push({ id: href, title: text, number: numberMatch ? numberMatch[2] : "", content: "", url: `${BASE_URL}${href}` })
    }
  }

  return sections
}

export async function getLegislationSection(
  type: LegislationType, year: number, number: number, sectionPath: string
): Promise<string> {
  const url = `${BASE_URL}/${type}/${year}/${number}/${sectionPath}`
  const response = await fetch(url, {
    headers: { Accept: "application/xhtml+xml,text/html" },
    next: { revalidate: 86400 },
  })
  if (!response.ok) throw new Error(`Legislation API error: ${response.status}`)
  return response.text()
}

export function buildLegislationUrl(
  type: LegislationType, year: number, number: number, section?: string
): string {
  const base = `${BASE_URL}/${type}/${year}/${number}`
  return section ? `${base}/${section}` : base
}

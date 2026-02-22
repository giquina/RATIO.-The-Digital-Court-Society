// ============================================================================
// RATIO — Legal API Types
// Shared types for legislation.gov.uk, Find Case Law, and internal models
// ============================================================================

// --- Legislation.gov.uk Types ---

export type LegislationType =
  | "ukpga"    // UK Public General Acts
  | "ukla"     // UK Local Acts
  | "uksi"     // UK Statutory Instruments
  | "ukdsi"    // UK Draft Statutory Instruments
  | "asp"      // Acts of the Scottish Parliament
  | "ssi"      // Scottish Statutory Instruments
  | "anaw"     // Acts of the National Assembly for Wales
  | "asc"      // Acts of Senedd Cymru
  | "wsi"      // Wales Statutory Instruments
  | "nia"      // Northern Ireland Acts
  | "nisr"     // Northern Ireland Statutory Rules
  | "eur"      // EU Retained Legislation
  | "ukppa"    // UK Private and Personal Acts
  | "ukcm"     // UK Church Measures

export interface LegislationItem {
  id: string
  title: string
  type: LegislationType
  year: number
  number: number
  url: string
  dataUrl: string
  enacted?: string
  updated?: string
  status?: "in-force" | "repealed" | "not-yet-in-force" | "partially-in-force"
}

export interface LegislationSection {
  id: string
  title: string
  number: string
  content: string
  parentId?: string
  url: string
}

export interface LegislationSearchParams {
  title?: string
  year?: number
  type?: LegislationType | LegislationType[]
  number?: number
  page?: number
  resultsCount?: number
}

export interface LegislationSearchResult {
  items: LegislationItem[]
  totalResults: number
  currentPage: number
  totalPages: number
  nextPageUrl?: string
}

// --- Find Case Law (National Archives) Types ---

export type CourtCode =
  | "uksc" | "ukpc"
  | "ewca/civ" | "ewca/crim"
  | "ewhc/admin" | "ewhc/ch" | "ewhc/comm" | "ewhc/fam" | "ewhc/ipec" | "ewhc/kb" | "ewhc/pat" | "ewhc/scco" | "ewhc/tcc"
  | "ukut/iac" | "ukut/lc" | "ukut/tcc" | "ukut/aac"
  | "ukeat"
  | "ukftt/tc" | "ukftt/grc"

export interface CaseLawItem {
  uri: string
  neutralCitation: string
  caseName: string
  court: string
  courtCode: CourtCode
  dateHanded: string
  judges?: string[]
  parties?: string[]
  url: string
  xmlUrl: string
  summary?: string
}

export interface CaseLawSearchParams {
  query?: string
  party?: string
  judge?: string
  neutralCitation?: string
  court?: CourtCode | CourtCode[]
  dateFrom?: string
  dateTo?: string
  page?: number
  perPage?: number
  order?: "relevance" | "-date" | "date" | "-transformation"
}

export interface CaseLawSearchResult {
  items: CaseLawItem[]
  totalResults: number
  currentPage: number
  nextPageUrl?: string
}

// --- OSCOLA Citation Types ---

export interface OSCOLACitation {
  caseName?: string
  year?: string
  volume?: string
  reportSeries?: string
  firstPage?: string
  court?: string
  neutralCitation?: string
  pinpoint?: string
  formatted: string
}

// --- Unified Search Types ---

export type LegalSourceType = "legislation" | "case-law" | "all"

export interface UnifiedSearchParams {
  query: string
  source: LegalSourceType
  filters?: {
    court?: CourtCode[]
    legislationType?: LegislationType[]
    yearFrom?: number
    yearTo?: number
    judge?: string
    party?: string
  }
  page?: number
  perPage?: number
}

export interface UnifiedSearchResult {
  type: "legislation" | "case-law"
  id: string
  title: string
  subtitle: string
  date: string
  citation: string
  url: string
  snippet?: string
  relevanceScore?: number
}

export interface UnifiedSearchResponse {
  results: UnifiedSearchResult[]
  totalResults: number
  currentPage: number
  totalPages: number
  queryTime: number
  sources: {
    legislation: number
    caseLaw: number
  }
}

// --- Court metadata for UI ---

export interface CourtInfo {
  code: CourtCode
  name: string
  shortName: string
  hierarchy: number
  division?: string
}

export const COURTS: CourtInfo[] = [
  { code: "uksc", name: "United Kingdom Supreme Court", shortName: "UKSC", hierarchy: 1 },
  { code: "ukpc", name: "Judicial Committee of the Privy Council", shortName: "UKPC", hierarchy: 1 },
  { code: "ewca/civ", name: "Court of Appeal (Civil Division)", shortName: "EWCA Civ", hierarchy: 2, division: "Civil" },
  { code: "ewca/crim", name: "Court of Appeal (Criminal Division)", shortName: "EWCA Crim", hierarchy: 2, division: "Criminal" },
  { code: "ewhc/admin", name: "High Court (Administrative Court)", shortName: "EWHC Admin", hierarchy: 3, division: "Administrative" },
  { code: "ewhc/ch", name: "High Court (Chancery Division)", shortName: "EWHC Ch", hierarchy: 3, division: "Chancery" },
  { code: "ewhc/comm", name: "High Court (Commercial Court)", shortName: "EWHC Comm", hierarchy: 3, division: "Commercial" },
  { code: "ewhc/fam", name: "High Court (Family Division)", shortName: "EWHC Fam", hierarchy: 3, division: "Family" },
  { code: "ewhc/kb", name: "High Court (King's Bench Division)", shortName: "EWHC KB", hierarchy: 3, division: "King's Bench" },
  { code: "ewhc/tcc", name: "High Court (Technology and Construction Court)", shortName: "EWHC TCC", hierarchy: 3, division: "Technology" },
  { code: "ewhc/pat", name: "High Court (Patents Court)", shortName: "EWHC Pat", hierarchy: 3, division: "Patents" },
  { code: "ewhc/ipec", name: "Intellectual Property Enterprise Court", shortName: "IPEC", hierarchy: 3, division: "IP" },
  { code: "ewhc/scco", name: "Senior Courts Costs Office", shortName: "EWHC SCCO", hierarchy: 3, division: "Costs" },
  { code: "ukut/iac", name: "Upper Tribunal (Immigration and Asylum Chamber)", shortName: "UKUT IAC", hierarchy: 4, division: "Immigration" },
  { code: "ukut/lc", name: "Upper Tribunal (Lands Chamber)", shortName: "UKUT LC", hierarchy: 4, division: "Lands" },
  { code: "ukut/tcc", name: "Upper Tribunal (Tax and Chancery Chamber)", shortName: "UKUT TCC", hierarchy: 4, division: "Tax" },
  { code: "ukut/aac", name: "Upper Tribunal (Administrative Appeals Chamber)", shortName: "UKUT AAC", hierarchy: 4, division: "Admin Appeals" },
  { code: "ukeat", name: "Employment Appeal Tribunal", shortName: "EAT", hierarchy: 4 },
  { code: "ukftt/tc", name: "First-tier Tribunal (Tax Chamber)", shortName: "FTT Tax", hierarchy: 5, division: "Tax" },
  { code: "ukftt/grc", name: "First-tier Tribunal (General Regulatory Chamber)", shortName: "FTT GRC", hierarchy: 5, division: "General" },
]

// --- Legislation type metadata for UI ---

export interface LegislationTypeInfo {
  type: LegislationType
  name: string
  shortName: string
  jurisdiction: "UK" | "Scotland" | "Wales" | "Northern Ireland" | "EU Retained"
}

export const LEGISLATION_TYPES: LegislationTypeInfo[] = [
  { type: "ukpga", name: "UK Public General Acts", shortName: "Act", jurisdiction: "UK" },
  { type: "ukla", name: "UK Local Acts", shortName: "Local Act", jurisdiction: "UK" },
  { type: "uksi", name: "UK Statutory Instruments", shortName: "SI", jurisdiction: "UK" },
  { type: "ukdsi", name: "UK Draft Statutory Instruments", shortName: "Draft SI", jurisdiction: "UK" },
  { type: "asp", name: "Acts of the Scottish Parliament", shortName: "ASP", jurisdiction: "Scotland" },
  { type: "ssi", name: "Scottish Statutory Instruments", shortName: "SSI", jurisdiction: "Scotland" },
  { type: "anaw", name: "Acts of the National Assembly for Wales", shortName: "ANAW", jurisdiction: "Wales" },
  { type: "asc", name: "Acts of Senedd Cymru", shortName: "ASC", jurisdiction: "Wales" },
  { type: "wsi", name: "Wales Statutory Instruments", shortName: "WSI", jurisdiction: "Wales" },
  { type: "nia", name: "Northern Ireland Acts", shortName: "NIA", jurisdiction: "Northern Ireland" },
  { type: "nisr", name: "Northern Ireland Statutory Rules", shortName: "NISR", jurisdiction: "Northern Ireland" },
  { type: "eur", name: "EU Retained Legislation", shortName: "EUR", jurisdiction: "EU Retained" },
  { type: "ukppa", name: "UK Private and Personal Acts", shortName: "PPA", jurisdiction: "UK" },
  { type: "ukcm", name: "UK Church Measures", shortName: "CM", jurisdiction: "UK" },
]

// ============================================================================
// RATIO — OSCOLA Citation Formatter
// Oxford Standard for the Citation of Legal Authorities (4th edition)
// ============================================================================

import type { OSCOLACitation, CaseLawItem, LegislationItem } from "./types"

export function formatCaseName(name: string): string {
  return name.replace(/\s+versus\s+/gi, " v ").replace(/\s+vs\.?\s+/gi, " v ").replace(/\s+v\s+/g, " v ").trim()
}

export function generateCaseCitation(item: CaseLawItem): OSCOLACitation {
  const caseName = formatCaseName(item.caseName)
  const nc = item.neutralCitation
  if (nc) return { caseName, neutralCitation: nc, court: item.court, formatted: `${caseName} ${nc}` }
  return { caseName, court: item.court, formatted: caseName }
}

export function formatOSCOLACase(
  caseName: string, year: string, reportOrCourt: string, pageOrNumber: string, volume?: string, pinpoint?: string
): string {
  const parts = [formatCaseName(caseName)]
  if (year) parts.push(year)
  if (volume) parts.push(volume)
  parts.push(reportOrCourt)
  parts.push(pageOrNumber)
  if (pinpoint) parts.push(`[${pinpoint}]`)
  return parts.join(" ")
}

export function generateLegislationCitation(item: LegislationItem): OSCOLACitation {
  const isStatutoryInstrument = ["uksi", "ssi", "wsi", "nisr", "ukdsi"].includes(item.type)
  let formatted = item.title
  if (isStatutoryInstrument && item.year && item.number) {
    if (!formatted.includes(`SI ${item.year}`)) {
      formatted = `${formatted}, SI ${item.year}/${item.number}`
    }
  }
  return { year: item.year?.toString(), formatted }
}

export function formatSectionRef(section: string, toSection?: string): string {
  if (toSection) return `ss ${section}-${toSection}`
  return `s ${section}`
}

export function formatScheduleRef(schedule: string, paragraph?: string): string {
  const base = `sch ${schedule}`
  if (paragraph) return `${base}, para ${paragraph}`
  return base
}

export function formatOSCOLALegislation(title: string, section?: string, toSection?: string): string {
  if (!section) return title
  return `${title}, ${formatSectionRef(section, toSection)}`
}

export function parseNeutralCitation(citation: string): { year: string; court: string; number: string } | null {
  const match = citation.match(/\[(\d{4})\]\s+([A-Z]+(?:\s+[A-Z][a-z]+)?(?:\s+\([A-Z]+\))?)\s+(\d+)/)
  if (!match) return null
  return { year: match[1], court: match[2], number: match[3] }
}

export function isNeutralCitation(text: string): boolean {
  return /\[\d{4}\]\s+[A-Z]+/.test(text.trim())
}

export function isLegislationReference(text: string): boolean {
  return /\b(Act|Order|Regulations?|Rules?|Measure)\s+\d{4}\b/i.test(text)
}

export function classifyCitation(text: string): { type: "case" | "legislation" | "unknown"; formatted: string } {
  if (isNeutralCitation(text)) return { type: "case", formatted: text.trim() }
  if (isLegislationReference(text)) return { type: "legislation", formatted: text.trim() }
  if (/\[\d{4}\]\s+\d*\s*[A-Z]/.test(text) || /\(\d{4}\)\s+\d+\s+[A-Z]/.test(text)) return { type: "case", formatted: text.trim() }
  return { type: "unknown", formatted: text.trim() }
}

export function buildBAILIIUrl(neutralCitation: string): string | null {
  const parsed = parseNeutralCitation(neutralCitation)
  if (!parsed) return null
  const courtMap: Record<string, string> = {
    UKSC: "uk/cases/UKSC", UKPC: "uk/cases/JCPC",
    "EWCA Civ": "ew/cases/EWCA/Civ", "EWCA Crim": "ew/cases/EWCA/Crim",
    EWHC: "ew/cases/EWHC", UKUT: "uk/cases/UKUT", UKEAT: "uk/cases/UKEAT",
  }
  const path = courtMap[parsed.court]
  if (!path) return null
  return `https://www.bailii.org/${path}/${parsed.year}/${parsed.number}.html`
}

export function buildFindCaseLawUrl(neutralCitation: string): string | null {
  const parsed = parseNeutralCitation(neutralCitation)
  if (!parsed) return null
  const courtMap: Record<string, string> = {
    UKSC: "uksc", UKPC: "ukpc", "EWCA Civ": "ewca/civ", "EWCA Crim": "ewca/crim", UKUT: "ukut", UKEAT: "ukeat",
  }
  const path = courtMap[parsed.court]
  if (!path) return null
  return `https://caselaw.nationalarchives.gov.uk/${path}/${parsed.year}/${parsed.number}`
}

export function buildLegislationSearchUrl(title: string): string {
  return `https://www.legislation.gov.uk/all?title=${encodeURIComponent(title)}`
}

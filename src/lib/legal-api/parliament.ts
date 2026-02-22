// ============================================================================
// RATIO — UK Parliament API Service
// Integrates Hansard (debates), Bills, and Members APIs
// Free, open APIs — no auth required
// Docs: https://developer.parliament.uk/
// ============================================================================

import type {
  HansardDebateItem,
  HansardDebateDetail,
  HansardContribution,
  HansardSearchParams,
  HansardSearchResult,
  BillItem,
  BillSearchParams,
  BillSearchResult,
  BillStage,
  BillStagesResult,
  BillSponsor,
  ParliamentMember,
  MemberSearchParams,
  MemberSearchResult,
  ParliamentHouse,
} from "./types"

// ============================================================================
// API Base URLs
// ============================================================================

const HANSARD_BASE = "https://hansard-api.parliament.uk"
const BILLS_BASE = "https://bills-api.parliament.uk"
const MEMBERS_BASE = "https://members-api.parliament.uk"
const PARLIAMENT_URL = "https://hansard.parliament.uk"
const BILLS_URL = "https://bills.parliament.uk"
const MEMBERS_URL = "https://members.parliament.uk"

// ============================================================================
// Hansard (Debates) API
// ============================================================================

/**
 * Search parliamentary debates in Hansard.
 * Returns debate sections matching the search criteria.
 */
export async function searchDebates(
  params: HansardSearchParams
): Promise<HansardSearchResult> {
  const queryParams = new URLSearchParams()

  if (params.searchTerm) queryParams.set("queryParameters.searchTerm", params.searchTerm)
  if (params.house) queryParams.set("queryParameters.house", params.house)
  if (params.startDate) queryParams.set("queryParameters.startDate", params.startDate)
  if (params.endDate) queryParams.set("queryParameters.endDate", params.endDate)
  if (params.skip !== undefined) queryParams.set("queryParameters.skip", params.skip.toString())
  if (params.take !== undefined) queryParams.set("queryParameters.take", Math.min(params.take, 50).toString())
  if (params.orderBy) queryParams.set("queryParameters.orderBy", params.orderBy)

  const url = `${HANSARD_BASE}/search/debates.json?${queryParams.toString()}`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 },
  })

  if (!response.ok) {
    throw new Error(`Hansard API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const items: HansardDebateItem[] = (data.Results || []).map((r: HansardApiDebateResult) => ({
    debateSectionExtId: r.DebateSectionExtId || "",
    title: r.Title || "Untitled Debate",
    debateSection: r.DebateSection || "",
    house: normaliseHouse(r.House),
    sittingDate: r.SittingDate ? r.SittingDate.split("T")[0] : "",
    rank: r.Rank,
    url: buildHansardDebateUrl(r.DebateSectionExtId || ""),
  }))

  return {
    items,
    totalResults: data.TotalResultCount || items.length,
  }
}

/**
 * Get full debate details including contributions (speeches).
 */
export async function getDebate(
  debateSectionExtId: string
): Promise<HansardDebateDetail | null> {
  const url = `${HANSARD_BASE}/debates/debate/${debateSectionExtId}.json`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Hansard API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const contributions: HansardContribution[] = extractContributions(data)

  return {
    debateSectionExtId,
    title: data.Title || data.DebateSection?.Title || "Untitled Debate",
    house: normaliseHouse(data.House || data.DebateSection?.House),
    sittingDate: data.SittingDate ? data.SittingDate.split("T")[0] : "",
    debateSection: data.DebateSection?.Title || data.Location || "",
    contributions,
    url: buildHansardDebateUrl(debateSectionExtId),
  }
}

/**
 * Search spoken contributions in Hansard.
 */
export async function searchContributions(params: {
  searchTerm?: string
  memberId?: number
  house?: ParliamentHouse
  startDate?: string
  endDate?: string
  skip?: number
  take?: number
}): Promise<{ items: HansardContribution[]; totalResults: number }> {
  const queryParams = new URLSearchParams()

  if (params.searchTerm) queryParams.set("queryParameters.searchTerm", params.searchTerm)
  if (params.memberId) queryParams.set("queryParameters.memberId", params.memberId.toString())
  if (params.house) queryParams.set("queryParameters.house", params.house)
  if (params.startDate) queryParams.set("queryParameters.startDate", params.startDate)
  if (params.endDate) queryParams.set("queryParameters.endDate", params.endDate)
  if (params.skip !== undefined) queryParams.set("queryParameters.skip", params.skip.toString())
  if (params.take !== undefined) queryParams.set("queryParameters.take", Math.min(params.take, 50).toString())

  const url = `${HANSARD_BASE}/search/contributions/Spoken.json?${queryParams.toString()}`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 },
  })

  if (!response.ok) {
    throw new Error(`Hansard API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const items: HansardContribution[] = (data.Results || []).map((r: HansardApiContributionResult) => ({
    memberName: r.MemberName || r.AttributedTo || "Unknown",
    memberId: r.MemberId || undefined,
    house: normaliseHouse(r.House),
    contributionText: stripHtmlTags(r.ContributionText || r.Text || ""),
    time: r.Timecode || undefined,
  }))

  return {
    items,
    totalResults: data.TotalResultCount || items.length,
  }
}

// ============================================================================
// Bills API
// ============================================================================

/**
 * Search parliamentary bills.
 */
export async function searchBills(
  params: BillSearchParams
): Promise<BillSearchResult> {
  const queryParams = new URLSearchParams()

  if (params.searchTerm) queryParams.set("SearchTerm", params.searchTerm)
  if (params.currentHouse) queryParams.set("CurrentHouse", params.currentHouse)
  if (params.originatingHouse) queryParams.set("OriginatingHouse", params.originatingHouse)
  if (params.memberId) queryParams.set("MemberId", params.memberId.toString())
  if (params.isDefeated !== undefined) queryParams.set("IsDefeated", params.isDefeated.toString())
  if (params.isAct !== undefined) queryParams.set("IsAct", params.isAct.toString())
  if (params.billStage) {
    for (const stage of params.billStage) {
      queryParams.append("BillStage", stage.toString())
    }
  }
  if (params.billType) {
    for (const type of params.billType) {
      queryParams.append("BillType", type.toString())
    }
  }
  if (params.sortOrder) queryParams.set("SortOrder", params.sortOrder)
  if (params.skip !== undefined) queryParams.set("Skip", params.skip.toString())
  if (params.take !== undefined) queryParams.set("Take", Math.min(params.take, 50).toString())

  const url = `${BILLS_BASE}/api/v1/Bills?${queryParams.toString()}`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Bills API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const items: BillItem[] = (data.items || []).map((b: BillsApiBillSummary) => ({
    billId: b.billId,
    shortTitle: b.shortTitle || "Untitled Bill",
    currentHouse: b.currentHouse || "",
    originatingHouse: b.originatingHouse || "",
    lastUpdate: b.lastUpdate ? b.lastUpdate.split("T")[0] : "",
    isDefeated: b.isDefeated || false,
    isAct: b.isAct || false,
    billTypeId: b.billTypeId || 0,
    currentStage: b.currentStage ? mapBillStage(b.currentStage) : undefined,
    url: buildBillUrl(b.billId),
  }))

  return {
    items,
    totalResults: data.totalResults || items.length,
    itemsPerPage: data.itemsPerPage || 20,
  }
}

/**
 * Get detailed information about a specific bill, including sponsors and long title.
 */
export async function getBill(billId: number): Promise<BillItem | null> {
  const url = `${BILLS_BASE}/api/v1/Bills/${billId}`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Bills API error: ${response.status} ${response.statusText}`)
  }

  const b = await response.json()

  const sponsors: BillSponsor[] = (b.sponsors || []).map((s: BillsApiSponsor) => ({
    memberId: s.member?.memberId || 0,
    name: s.member?.name || "Unknown",
    party: s.member?.party || "",
    house: s.member?.house || "",
    memberFrom: s.member?.memberFrom || "",
    memberPhoto: s.member?.memberPhoto || undefined,
    memberPage: s.member?.memberPage || undefined,
  }))

  return {
    billId: b.billId,
    shortTitle: b.shortTitle || "Untitled Bill",
    longTitle: b.longTitle || undefined,
    summary: b.summary || undefined,
    currentHouse: b.currentHouse || "",
    originatingHouse: b.originatingHouse || "",
    lastUpdate: b.lastUpdate ? b.lastUpdate.split("T")[0] : "",
    isDefeated: b.isDefeated || false,
    isAct: b.isAct || false,
    billTypeId: b.billTypeId || 0,
    currentStage: b.currentStage ? mapBillStage(b.currentStage) : undefined,
    sponsors,
    url: buildBillUrl(b.billId),
  }
}

/**
 * Get all stages for a bill, showing its progression through Parliament.
 */
export async function getBillStages(
  billId: number
): Promise<BillStagesResult> {
  const url = `${BILLS_BASE}/api/v1/Bills/${billId}/Stages`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Bills API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const stages: BillStage[] = (data.items || []).map(mapBillStage)

  return {
    stages,
    totalResults: data.totalResults || stages.length,
  }
}

// ============================================================================
// Members API
// ============================================================================

/**
 * Search for MPs and Lords.
 */
export async function searchMembers(
  params: MemberSearchParams
): Promise<MemberSearchResult> {
  const queryParams = new URLSearchParams()

  if (params.name) queryParams.set("Name", params.name)
  if (params.house) queryParams.set("House", params.house.toString())
  if (params.partyId) queryParams.set("PartyId", params.partyId.toString())
  if (params.isCurrentMember !== undefined) queryParams.set("IsCurrentMember", params.isCurrentMember.toString())
  if (params.skip !== undefined) queryParams.set("skip", params.skip.toString())
  if (params.take !== undefined) queryParams.set("take", Math.min(params.take, 20).toString())

  const url = `${MEMBERS_BASE}/api/Members/Search?${queryParams.toString()}`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Members API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const items: ParliamentMember[] = (data.items || []).map((item: MembersApiItem) => {
    const v = item.value
    return {
      id: v.id,
      nameListAs: v.nameListAs || "",
      nameDisplayAs: v.nameDisplayAs || "",
      nameFullTitle: v.nameFullTitle || "",
      gender: v.gender || "",
      latestParty: {
        id: v.latestParty?.id || 0,
        name: v.latestParty?.name || "",
        abbreviation: v.latestParty?.abbreviation || "",
        backgroundColour: v.latestParty?.backgroundColour || undefined,
        foregroundColour: v.latestParty?.foregroundColour || undefined,
        isLordsMainParty: v.latestParty?.isLordsMainParty || undefined,
        isLordsSpiritualParty: v.latestParty?.isLordsSpiritualParty || undefined,
        isIndependentParty: v.latestParty?.isIndependentParty || undefined,
      },
      latestHouseMembership: {
        membershipFrom: v.latestHouseMembership?.membershipFrom || "",
        membershipFromId: v.latestHouseMembership?.membershipFromId || 0,
        house: v.latestHouseMembership?.house || 0,
        membershipStartDate: v.latestHouseMembership?.membershipStartDate || "",
        membershipEndDate: v.latestHouseMembership?.membershipEndDate || undefined,
        membershipEndReason: v.latestHouseMembership?.membershipEndReason || undefined,
        membershipStatus: v.latestHouseMembership?.membershipStatus
          ? {
              statusIsActive: v.latestHouseMembership.membershipStatus.statusIsActive || false,
              statusDescription: v.latestHouseMembership.membershipStatus.statusDescription || "",
            }
          : undefined,
      },
      thumbnailUrl: v.thumbnailUrl || undefined,
      url: buildMemberUrl(v.id),
    }
  })

  return {
    items,
    totalResults: data.totalResults || items.length,
  }
}

/**
 * Get a specific member by their ID.
 */
export async function getMember(memberId: number): Promise<ParliamentMember | null> {
  const url = `${MEMBERS_BASE}/api/Members/${memberId}`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Members API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const v = data.value

  return {
    id: v.id,
    nameListAs: v.nameListAs || "",
    nameDisplayAs: v.nameDisplayAs || "",
    nameFullTitle: v.nameFullTitle || "",
    gender: v.gender || "",
    latestParty: {
      id: v.latestParty?.id || 0,
      name: v.latestParty?.name || "",
      abbreviation: v.latestParty?.abbreviation || "",
      backgroundColour: v.latestParty?.backgroundColour || undefined,
      foregroundColour: v.latestParty?.foregroundColour || undefined,
    },
    latestHouseMembership: {
      membershipFrom: v.latestHouseMembership?.membershipFrom || "",
      membershipFromId: v.latestHouseMembership?.membershipFromId || 0,
      house: v.latestHouseMembership?.house || 0,
      membershipStartDate: v.latestHouseMembership?.membershipStartDate || "",
      membershipEndDate: v.latestHouseMembership?.membershipEndDate || undefined,
      membershipEndReason: v.latestHouseMembership?.membershipEndReason || undefined,
      membershipStatus: v.latestHouseMembership?.membershipStatus
        ? {
            statusIsActive: v.latestHouseMembership.membershipStatus.statusIsActive || false,
            statusDescription: v.latestHouseMembership.membershipStatus.statusDescription || "",
          }
        : undefined,
    },
    thumbnailUrl: v.thumbnailUrl || undefined,
    url: buildMemberUrl(v.id),
  }
}

/**
 * Get a member's synopsis/biography text.
 */
export async function getMemberSynopsis(memberId: number): Promise<string | null> {
  const url = `${MEMBERS_BASE}/api/Members/${memberId}/Synopsis`

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Members API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.value ? stripHtmlTags(data.value) : null
}

// ============================================================================
// URL Builders
// ============================================================================

export function buildHansardDebateUrl(debateSectionExtId: string): string {
  return `${PARLIAMENT_URL}/debates/${debateSectionExtId}`
}

export function buildBillUrl(billId: number): string {
  return `${BILLS_URL}/bills/${billId}`
}

export function buildMemberUrl(memberId: number): string {
  return `${MEMBERS_URL}/member/${memberId}/contact`
}

// ============================================================================
// Internal Helpers — API Response Shapes
// ============================================================================

// These interfaces represent the raw API responses from Parliament APIs.
// They are intentionally loose to handle varied responses gracefully.

interface HansardApiDebateResult {
  DebateSectionExtId?: string
  Title?: string
  DebateSection?: string
  House?: string
  SittingDate?: string
  Rank?: number
}

interface HansardApiContributionResult {
  MemberName?: string
  AttributedTo?: string
  MemberId?: number
  House?: string
  ContributionText?: string
  Text?: string
  Timecode?: string
}

interface BillsApiBillSummary {
  billId: number
  shortTitle?: string
  currentHouse?: string
  originatingHouse?: string
  lastUpdate?: string
  isDefeated?: boolean
  isAct?: boolean
  billTypeId?: number
  currentStage?: BillsApiStage
}

interface BillsApiStage {
  id?: number
  stageId?: number
  sessionId?: number
  description?: string
  abbreviation?: string
  house?: string
  stageSittings?: BillsApiStageSitting[]
  sortOrder?: number
}

interface BillsApiStageSitting {
  id?: number
  stageId?: number
  billStageId?: number
  billId?: number
  date?: string
}

interface BillsApiSponsor {
  member?: {
    memberId?: number
    name?: string
    party?: string
    house?: string
    memberFrom?: string
    memberPhoto?: string
    memberPage?: string
  }
  sortOrder?: number
}

interface MembersApiItem {
  value: {
    id: number
    nameListAs?: string
    nameDisplayAs?: string
    nameFullTitle?: string
    gender?: string
    latestParty?: {
      id?: number
      name?: string
      abbreviation?: string
      backgroundColour?: string
      foregroundColour?: string
      isLordsMainParty?: boolean
      isLordsSpiritualParty?: boolean
      isIndependentParty?: boolean
    }
    latestHouseMembership?: {
      membershipFrom?: string
      membershipFromId?: number
      house?: number
      membershipStartDate?: string
      membershipEndDate?: string
      membershipEndReason?: string
      membershipStatus?: {
        statusIsActive?: boolean
        statusDescription?: string
      }
    }
    thumbnailUrl?: string
  }
}

// ============================================================================
// Internal Helpers — Data Transformation
// ============================================================================

function normaliseHouse(house?: string): ParliamentHouse {
  if (!house) return "Commons"
  const lower = house.toLowerCase()
  if (lower.includes("lord")) return "Lords"
  return "Commons"
}

function mapBillStage(s: BillsApiStage): BillStage {
  return {
    id: s.id || 0,
    stageId: s.stageId || 0,
    sessionId: s.sessionId || 0,
    description: s.description || "",
    abbreviation: s.abbreviation || "",
    house: s.house || "",
    stageSittings: (s.stageSittings || []).map((sitting) => ({
      id: sitting.id || 0,
      stageId: sitting.stageId || 0,
      billStageId: sitting.billStageId || 0,
      billId: sitting.billId || 0,
      date: sitting.date ? sitting.date.split("T")[0] : "",
    })),
    sortOrder: s.sortOrder || 0,
  }
}

/**
 * Extract contributions from a Hansard debate detail response.
 * The Hansard API returns a nested structure of items with child items.
 */
function extractContributions(data: Record<string, unknown>): HansardContribution[] {
  const contributions: HansardContribution[] = []

  // The debate detail API can return contributions in multiple places
  // depending on the debate type. We check common locations.
  const items = (data.Items || data.ChildDebates || []) as Record<string, unknown>[]

  for (const item of items) {
    // Direct contributions at top level
    if (item.MemberName || item.AttributedTo) {
      contributions.push({
        memberName: (item.MemberName || item.AttributedTo || "Unknown") as string,
        memberId: item.MemberId as number | undefined,
        house: normaliseHouse(item.House as string | undefined),
        contributionText: stripHtmlTags((item.Value || item.ContributionText || "") as string),
        time: item.Timecode as string | undefined,
      })
    }

    // Nested items within child debates
    const childItems = (item.Items || item.ChildDebates || []) as Record<string, unknown>[]
    for (const child of childItems) {
      if (child.MemberName || child.AttributedTo) {
        contributions.push({
          memberName: (child.MemberName || child.AttributedTo || "Unknown") as string,
          memberId: child.MemberId as number | undefined,
          house: normaliseHouse(child.House as string | undefined),
          contributionText: stripHtmlTags((child.Value || child.ContributionText || "") as string),
          time: child.Timecode as string | undefined,
        })
      }

      // Third level nesting for deeply structured debates
      const grandchildItems = (child.Items || []) as Record<string, unknown>[]
      for (const grandchild of grandchildItems) {
        if (grandchild.MemberName || grandchild.AttributedTo) {
          contributions.push({
            memberName: (grandchild.MemberName || grandchild.AttributedTo || "Unknown") as string,
            memberId: grandchild.MemberId as number | undefined,
            house: normaliseHouse(grandchild.House as string | undefined),
            contributionText: stripHtmlTags((grandchild.Value || grandchild.ContributionText || "") as string),
            time: grandchild.Timecode as string | undefined,
          })
        }
      }
    }
  }

  return contributions
}

/**
 * Strip HTML tags from text, preserving readable content.
 */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

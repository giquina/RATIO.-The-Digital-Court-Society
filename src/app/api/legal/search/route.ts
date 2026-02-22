// ============================================================================
// RATIO — Legal Search API Route
// GET /api/legal/search?q=negligence&source=all&page=1
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { unifiedSearch } from "@/lib/legal-api"
import type { LegalSourceType, CourtCode, LegislationType } from "@/lib/legal-api"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get("q") || ""
  const source = (searchParams.get("source") || "all") as LegalSourceType
  const page = parseInt(searchParams.get("page") || "1", 10)
  const perPage = parseInt(searchParams.get("perPage") || "20", 10)

  const court = searchParams.getAll("court") as CourtCode[]
  const legislationType = searchParams.getAll("type") as LegislationType[]
  const yearFrom = searchParams.get("yearFrom") ? parseInt(searchParams.get("yearFrom")!, 10) : undefined
  const yearTo = searchParams.get("yearTo") ? parseInt(searchParams.get("yearTo")!, 10) : undefined
  const judge = searchParams.get("judge") || undefined
  const party = searchParams.get("party") || undefined

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  try {
    const results = await unifiedSearch({
      query, source, page, perPage: Math.min(perPage, 50),
      filters: {
        court: court.length > 0 ? court : undefined,
        legislationType: legislationType.length > 0 ? legislationType : undefined,
        yearFrom, yearTo, judge, party,
      },
    })

    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    })
  } catch (error) {
    console.error("Legal search error:", error)
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getAdsForPage } from "@/lib/database-new"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    const limitVal = limit ? Number.parseInt(limit) : 10

    // Get ads for giveaways page
    const giveawayAds = await getAdsForPage('giveaways', limitVal)

    return NextResponse.json({ ads: giveawayAds })
  } catch (error: any) {
    console.error("Error fetching giveaway ads:", error)
    return NextResponse.json({ error: "Failed to fetch giveaway ads" }, { status: 500 })
  }
}

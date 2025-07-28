import { type NextRequest, NextResponse } from "next/server"
import { createGiveaway, createGiveawayRequirement, createGiveawayPrize, getGiveaways } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { giveaway, requirements, prizes } = data

    // Validate required fields
    if (!giveaway.title || !giveaway.description || !giveaway.total_value || !giveaway.end_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create giveaway
    const giveawayId = await createGiveaway(giveaway)

    // Create requirements
    if (requirements && requirements.length > 0) {
      for (const requirement of requirements) {
        await createGiveawayRequirement({
          ...requirement,
          giveaway_id: giveawayId,
        })
      }
    }

    // Create prizes
    if (prizes && prizes.length > 0) {
      for (const prize of prizes) {
        await createGiveawayPrize({
          ...prize,
          giveaway_id: giveawayId,
        })
      }
    }

    return NextResponse.json({ success: true, id: giveawayId }, { status: 201 })
  } catch (error) {
    console.error("Error creating giveaway:", error)
    return NextResponse.json({ error: "Failed to create giveaway" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "active"
    const featured = searchParams.get("featured") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const filters = {
      status,
      featured: featured || undefined,
      limit,
      offset,
    }

    const giveaways = await getGiveaways(filters)

    return NextResponse.json(giveaways)
  } catch (error) {
    console.error("Error fetching giveaways:", error)
    return NextResponse.json({ error: "Failed to fetch giveaways" }, { status: 500 })
  }
}

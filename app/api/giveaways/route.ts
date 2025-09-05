import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { createGiveaway, createGiveawayRequirement, createGiveawayPrize, getGiveaways } from "@/lib/database-new"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { giveaway, requirements, prizes } = data
    const session = await getServerSession(authOptions)

    // Validate required fields
    if (!giveaway.title || !giveaway.description || !giveaway.total_value || !giveaway.end_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create giveaway
    const giveawayId = await createGiveaway({
      ...giveaway,
      creator_id: session ? String((session.user as any)?.id || "") : null,
    })

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
    const status = searchParams.get("status") || "all"
    const featured = searchParams.get("featured") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const filters = {
      status: status === "all" ? undefined : status,
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

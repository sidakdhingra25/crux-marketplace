import { type NextRequest, NextResponse } from "next/server"
import { getGiveawayById } from "@/lib/database-new"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid giveaway ID" }, { status: 400 })
    }

    const giveaway = await getGiveawayById(id)
    
    if (!giveaway) {
      return NextResponse.json({ error: "Giveaway not found" }, { status: 404 })
    }

    return NextResponse.json(giveaway)
  } catch (error) {
    console.error("Error fetching giveaway:", error)
    return NextResponse.json({ error: "Failed to fetch giveaway" }, { status: 500 })
  }
}

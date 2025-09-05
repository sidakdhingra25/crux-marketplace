import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { createAd, getAds } from "@/lib/database-new"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate required fields
    const requiredFields = ["title", "description", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create the ad in the database
    const adId = await createAd({
      title: body.title,
      description: body.description,
      image_url: body.image_url || null,
      link_url: body.link_url || null,
      category: body.category,
      status: body.status || "active",
      priority: body.priority || 1,
      start_date: body.start_date || new Date().toISOString(),
      end_date: body.end_date || null,
      created_by: String((session.user as any)?.id || ""),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Ad created successfully!",
        adId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating ad:", error)
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")

    const filters = {
      status: status || undefined,
      category: category || undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
    }

    const ads = await getAds(filters)
    return NextResponse.json({ ads })
  } catch (error: any) {
    console.error("Error fetching ads:", error)
    
    // Handle specific database connection errors
    if (error.message?.includes('XATA_CONCURRENCY_LIMIT') || error.cause?.code === 'XATA_CONCURRENCY_LIMIT') {
      return NextResponse.json({ 
        error: "Database is temporarily overloaded. Please try again in a few seconds." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 })
  }
}


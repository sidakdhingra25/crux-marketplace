import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { createScript, getScripts } from "@/lib/database-new"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const session = await getServerSession(authOptions)

    // Validate required fields
    const requiredFields = ["title", "description", "price", "category", "framework", "seller_name", "seller_email"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create the script in the database
    const scriptId = await createScript({
      title: body.title,
      description: body.description,
      price: body.price,
      originalPrice: body.original_price || null,
      category: body.category,
      framework: body.framework,
      seller_name: body.seller_name,
      seller_email: body.seller_email,
      tags: body.tags || [],
      features: body.features || [],
      requirements: body.requirements || [],
      images: body.images || [],
      videos: body.videos || [],
      screenshots: body.screenshots || [],
      coverImage: body.cover_image || null,
      demoUrl: body.demo_url || null,
      documentationUrl: body.documentation_url || null,
      supportUrl: body.support_url || null,
      version: body.version || "1.0.0",
      status: "pending",
      featured: body.featured || false,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Script submitted successfully!",
        scriptId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating script:", error)
    return NextResponse.json({ error: "Failed to submit script" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const framework = searchParams.get("framework")
    const status = searchParams.get("status") || "all"
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    console.log("Scripts API - Request params:", { category, framework, status, featured, limit, offset })

    const filters = {
      category: category || undefined,
      framework: framework || undefined,
      status: status === "all" ? "approved" : status, // Default to approved for public access
      featured: featured ? featured === "true" : undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
      offset: offset ? Number.parseInt(offset) : undefined,
    }

    console.log("Scripts API - Filters:", filters)

    const scripts = await getScripts(filters)
    console.log("Scripts API - Found scripts:", scripts.length)
    console.log("Scripts API - Script statuses:", scripts.map(s => ({ id: s.id, title: s.title, status: s.status })))

    return NextResponse.json({ scripts })
  } catch (error: any) {
    console.error("Error fetching scripts:", error)
    
    // Handle specific database connection errors
    if (error.message?.includes('XATA_CONCURRENCY_LIMIT') || error.cause?.code === 'XATA_CONCURRENCY_LIMIT') {
      return NextResponse.json({ 
        error: "Database is temporarily overloaded. Please try again in a few seconds." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 })
  }
}

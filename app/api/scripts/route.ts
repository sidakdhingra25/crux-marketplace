import { type NextRequest, NextResponse } from "next/server"
import { createScript, getScripts } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
      original_price: body.original_price || null,
      category: body.category,
      framework: body.framework,
      seller_name: body.seller_name,
      seller_email: body.seller_email,
      tags: body.tags || [],
      features: body.features || [],
      requirements: body.requirements || [],
      images: body.images || [],
      videos: body.videos || [],
      demo_url: body.demo_url || null,
      documentation_url: body.documentation_url || null,
      support_url: body.support_url || null,
      version: body.version || "1.0.0",
      last_updated: new Date().toISOString(),
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
    const status = searchParams.get("status") || "approved"
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    const filters = {
      category: category || undefined,
      framework: framework || undefined,
      status,
      featured: featured ? featured === "true" : undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
      offset: offset ? Number.parseInt(offset) : undefined,
    }

    const scripts = await getScripts(filters)

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error("Error fetching scripts:", error)
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { 
  createScriptReview, 
  getScriptReviews, 
  getUserScriptReview 
} from "@/lib/database-new"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const scriptId = parseInt(idParam)
    
    if (isNaN(scriptId)) {
      return NextResponse.json({ error: "Invalid script ID" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const data = await request.json()
    const { rating, title, comment } = data

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if user has already reviewed this script
    const existingReview = await getUserScriptReview(scriptId, session.user.email as string)
    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this script" }, { status: 400 })
    }

    // Create review
    const reviewData = {
      script_id: scriptId,
      reviewer_name: session.user.name || "Anonymous",
      reviewer_email: session.user.email as string,
      rating,
      title: title || null,
      comment: comment || null,
      verified_purchase: false // TODO: Check if user actually purchased the script
    }

    const reviewId = await createScriptReview(reviewData)

    return NextResponse.json({ 
      success: true, 
      reviewId,
      message: "Review submitted successfully" 
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating script review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const scriptId = parseInt(idParam)
    
    if (isNaN(scriptId)) {
      return NextResponse.json({ error: "Invalid script ID" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userOnly = searchParams.get("userOnly") === "true"

    if (userOnly) {
      if (!session?.user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      
      // Get user's specific review for this script
      const userReview = await getUserScriptReview(scriptId, session.user.email as string)
      return NextResponse.json({ review: userReview })
    } else {
      // Get all reviews for this script
      const reviews = await getScriptReviews(scriptId)
      return NextResponse.json({ reviews })
    }

  } catch (error) {
    console.error("Error fetching script reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}


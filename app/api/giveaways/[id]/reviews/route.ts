import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { 
  createGiveawayReview, 
  getGiveawayReviews, 
  getUserGiveawayReview,
  getUserGiveawayEntry 
} from "@/lib/database-new"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const giveawayId = parseInt(idParam)
    
    if (isNaN(giveawayId)) {
      return NextResponse.json({ error: "Invalid giveaway ID" }, { status: 400 })
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

    // Check if user has already reviewed this giveaway
    const existingReview = await getUserGiveawayReview(giveawayId, session.user.email as string)
    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this giveaway" }, { status: 400 })
    }

    // Check if user participated in this giveaway (optional verification)
    const userEntry = await getUserGiveawayEntry(giveawayId, session.user.id as string)
    const verifiedParticipant = !!userEntry

    // Create review
    const reviewData = {
      giveaway_id: giveawayId,
      reviewer_name: session.user.name || "Anonymous",
      reviewer_email: session.user.email as string,
      reviewer_id: session.user.id as string,
      rating,
      title: title || null,
      comment: comment || null,
      verified_participant: verifiedParticipant
    }

    const reviewId = await createGiveawayReview(reviewData)

    return NextResponse.json({ 
      success: true, 
      reviewId,
      message: "Review submitted successfully" 
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating giveaway review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const giveawayId = parseInt(idParam)
    
    if (isNaN(giveawayId)) {
      return NextResponse.json({ error: "Invalid giveaway ID" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userOnly = searchParams.get("userOnly") === "true"

    if (userOnly) {
      if (!session?.user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      
      // Get user's specific review for this giveaway
      const userReview = await getUserGiveawayReview(giveawayId, session.user.email as string)
      return NextResponse.json({ review: userReview })
    } else {
      // Get all reviews for this giveaway
      const reviews = await getGiveawayReviews(giveawayId)
      return NextResponse.json({ reviews })
    }

  } catch (error) {
    console.error("Error fetching giveaway reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}


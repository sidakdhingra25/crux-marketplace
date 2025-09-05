import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { getAdById, updateAd, deleteAd } from "@/lib/database-new"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const adId = parseInt(id)
    const ad = await getAdById(adId)
    
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    return NextResponse.json(ad)
  } catch (error) {
    console.error("Error fetching ad:", error)
    return NextResponse.json({ error: "Failed to fetch ad" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const adId = parseInt(id)
    const ad = await getAdById(adId)
    
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    const body = await request.json()
    
    // Update the ad
    const updatedAd = await updateAd(adId, {
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      link_url: body.link_url,
      category: body.category,
      status: body.status,
      priority: body.priority,
      start_date: body.start_date,
      end_date: body.end_date,
    })

    if (!updatedAd) {
      return NextResponse.json({ error: "Failed to update ad" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Ad updated successfully",
      ad: updatedAd
    })
  } catch (error) {
    console.error("Error updating ad:", error)
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const adId = parseInt(id)
    const ad = await getAdById(adId)
    
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    // Delete the ad
    const deleted = await deleteAd(adId)
    
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Ad deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting ad:", error)
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 })
  }
}


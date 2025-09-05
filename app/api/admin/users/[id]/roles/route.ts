import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { updateUserRole } from "@/lib/database-new"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    const user = session.user as any
    if (!user.roles || !user.roles.includes('admin')) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { roles } = body

    if (!Array.isArray(roles)) {
      return NextResponse.json({ error: "Roles must be an array" }, { status: 400 })
    }

    
    const result = await updateUserRole(id, roles)

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "User roles updated successfully",
      user: result
    })
  } catch (error) {
    console.error("Error updating user roles:", error)
    return NextResponse.json({ error: "Failed to update user roles" }, { status: 500 })
  }
}


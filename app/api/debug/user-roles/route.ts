import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { getUserById } from "@/lib/database-new"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = (session.user as any).id
    console.log("Debug - Checking user roles for ID:", userId)
    
    // Get user from database
    const dbUser = await getUserById(userId)
    
    if (!dbUser) {
      return NextResponse.json({ 
        error: "User not found in database",
        userId,
        sessionUser: session.user
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      userId,
      sessionRoles: (session.user as any).roles,
      dbRoles: dbUser.roles,
      username: dbUser.username,
      sessionUsername: (session.user as any).username,
      match: (session.user as any).roles?.join(',') === dbUser.roles?.join(',')
    })
  } catch (error) {
    console.error("Debug user roles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


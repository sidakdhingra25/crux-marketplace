import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { getAllUsers } from "@/lib/database-new"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin users API called")
    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "exists" : "none")
    
    if (!session) {
      console.log("No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = session.user as any
    console.log("User roles:", user.roles)
    
    if (!user.roles || !user.roles.includes('admin')) {
      console.log("User is not admin")
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    console.log("User is admin, fetching users...")
    // Get all users using the database function
    const users = await getAllUsers()
    console.log("Found users:", users.length)
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from "next/server"
import { updateUserRole } from "@/lib/database-new"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    console.log(`Setting user ${userId} as founder...`)
    
    const result = await updateUserRole(userId, ['founder'])
    
    if (result) {
      console.log('✅ User set as founder successfully!')
      return NextResponse.json({ 
        success: true,
        message: "User set as founder successfully",
        user: {
          id: result.id,
          username: result.username,
          roles: result.roles
        }
      })
    } else {
      console.log('❌ User not found')
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
  } catch (error) {
    console.error('❌ Error setting user as founder:', error)
    return NextResponse.json({ error: "Failed to set user as founder" }, { status: 500 })
  }
}

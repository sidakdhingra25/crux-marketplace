import { NextResponse } from "next/server"
import { upsertUser } from "@/lib/database-new"

export async function POST() {
  try {
    // Add a test user
    await upsertUser({
      id: "test-user-123",
      name: "Test User",
      email: "test@example.com",
      image: "https://via.placeholder.com/150",
      username: "testuser",
    })

    return NextResponse.json({ 
      success: true, 
      message: "Test user added successfully" 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to add test user", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}


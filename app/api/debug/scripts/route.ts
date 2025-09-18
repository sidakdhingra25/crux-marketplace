import { NextRequest, NextResponse } from "next/server"
// File deleted: was connected to Neon

// ...existing code...

export async function GET(request: NextRequest) {
  try {
    const scripts = await sql`SELECT id, title, cover_image, images, videos, screenshots FROM scripts ORDER BY created_at DESC LIMIT 10`
    
    return NextResponse.json({ 
      success: true, 
      scripts: scripts,
      count: scripts.length
    })
  } catch (error) {
    console.error("Error fetching scripts:", error)
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 })
  }
}


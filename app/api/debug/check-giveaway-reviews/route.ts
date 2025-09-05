import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if giveaway_reviews table exists and get its structure
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'giveaway_reviews'
      )
    `
    
    let tableStructure = null
    if (tableExists[0]?.exists) {
      tableStructure = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'giveaway_reviews'
        ORDER BY ordinal_position
      `
    }
    
    return NextResponse.json({ 
      giveaway_reviews_exists: tableExists[0]?.exists,
      table_structure: tableStructure
    })
  } catch (error) {
    console.error("Error checking giveaway_reviews:", error)
    return NextResponse.json({ 
      error: "Failed to check giveaway_reviews",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}


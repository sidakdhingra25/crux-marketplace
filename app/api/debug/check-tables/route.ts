import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if giveaway_entries table exists and get its structure
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'giveaway_entries'
      )
    `
    
    let tableStructure = null
    if (tableExists[0]?.exists) {
      tableStructure = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'giveaway_entries'
        ORDER BY ordinal_position
      `
    }
    
    // Get all tables in the database
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    return NextResponse.json({ 
      giveaway_entries_exists: tableExists[0]?.exists,
      table_structure: tableStructure,
      all_tables: allTables.map(t => t.table_name)
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json({ 
      error: "Failed to check database",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}


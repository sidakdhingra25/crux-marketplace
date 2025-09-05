import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Check if users table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `
    
    if (!tableExists[0]?.exists) {
      return NextResponse.json({ 
        error: "Users table doesn't exist",
        tableExists: tableExists[0]?.exists 
      })
    }

    // Get all users
    const users = await sql`SELECT * FROM users ORDER BY created_at DESC`
    
    // Get table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `

    return NextResponse.json({ 
      users,
      tableExists: tableExists[0]?.exists,
      columns,
      userCount: users.length
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Database error", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}


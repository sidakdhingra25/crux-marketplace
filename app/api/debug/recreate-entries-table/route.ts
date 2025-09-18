// File deleted: was connected to Neon
import { type NextRequest, NextResponse } from "next/server"
// File deleted: was connected to Neon

// ...existing code...

export async function POST(request: NextRequest) {
  try {
    // Drop the existing table if it exists
    await sql`DROP TABLE IF EXISTS giveaway_entries CASCADE`
    
    // Create the table with the correct structure
    await sql`
      CREATE TABLE giveaway_entries (
        id SERIAL PRIMARY KEY,
        giveaway_id integer NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
        user_id text NOT NULL,
        user_name text,
        user_email text,
        entry_date timestamptz DEFAULT now(),
        status text DEFAULT 'active',
        points_earned integer DEFAULT 0,
        requirements_completed text[] DEFAULT '{}',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        UNIQUE(giveaway_id, user_id)
      )
    `
    
    return NextResponse.json({ 
      success: true, 
      message: "Giveaway entries table recreated successfully" 
    })
  } catch (error) {
    console.error("Error recreating table:", error)
    return NextResponse.json({ 
      error: "Failed to recreate table",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
import { type NextRequest, NextResponse } from "next/server"
// ...existing code...

// ...existing code...

export async function POST(request: NextRequest) {
  try {
    // Drop the existing table if it exists
    await sql`DROP TABLE IF EXISTS giveaway_entries CASCADE`
    
    // Create the table with the correct structure
    await sql`
      CREATE TABLE giveaway_entries (
        id SERIAL PRIMARY KEY,
        giveaway_id integer NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
        user_id text NOT NULL,
        user_name text,
        user_email text,
        entry_date timestamptz DEFAULT now(),
        status text DEFAULT 'active',
        points_earned integer DEFAULT 0,
        requirements_completed text[] DEFAULT '{}',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        UNIQUE(giveaway_id, user_id)
      )
    `
    
    return NextResponse.json({ 
      success: true, 
      message: "Giveaway entries table recreated successfully" 
    })
  } catch (error) {
    console.error("Error recreating table:", error)
    return NextResponse.json({ 
      error: "Failed to recreate table",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}


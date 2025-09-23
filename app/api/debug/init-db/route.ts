// File deleted: was connected to Neon
// This file contained the API route for initializing the database.
// It has been removed as it is no longer needed.
import { type NextRequest, NextResponse } from "next/server"
// File deleted: was connected to Neon

// ...existing code...

export async function POST(request: NextRequest) {
  try {
    // Create all tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY,
        name text,
        email text,
        image text,
        username text,
        -- default to a minimal role set; new roles are lowercase identifiers
        roles text[] DEFAULT '{founder,verified_creator,crew,admin,moderator}',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS scripts (
        id SERIAL PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL,
        price numeric NOT NULL,
        original_price numeric,
        category text NOT NULL,
        framework text,
        seller_name text NOT NULL,
        seller_email text NOT NULL,
        seller_id text,
        tags text[] DEFAULT '{}',
        features text[] DEFAULT '{}',
        requirements text[] DEFAULT '{}',
        images text[] DEFAULT '{}',
        videos text[] DEFAULT '{}',
        screenshots text[] DEFAULT '{}',
        cover_image text,
        demo_url text,
        documentation_url text,
        support_url text,
        version text DEFAULT '1.0.0',
        last_updated timestamptz DEFAULT now(),
        status text DEFAULT 'pending',
        featured boolean DEFAULT false,
        downloads integer DEFAULT 0,
        rating numeric DEFAULT 0,
        review_count integer DEFAULT 0,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS giveaways (
        id SERIAL PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL,
        total_value text NOT NULL,
        category text NOT NULL,
        end_date text NOT NULL,
        max_entries integer,
        difficulty text NOT NULL,
        featured boolean DEFAULT false,
        auto_announce boolean DEFAULT false,
        creator_name text NOT NULL,
        creator_email text NOT NULL,
        creator_id text,
        images text[] DEFAULT '{}',
        videos text[] DEFAULT '{}',
        cover_image text,
        tags text[] DEFAULT '{}',
        rules text[] DEFAULT '{}',
        status text DEFAULT 'active',
        entries_count integer DEFAULT 0,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS giveaway_entries (
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

    await sql`
      CREATE TABLE IF NOT EXISTS giveaway_reviews (
        id SERIAL PRIMARY KEY,
        giveaway_id integer NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
        reviewer_name text NOT NULL,
        reviewer_email text NOT NULL,
        reviewer_id text,
        rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title text,
        comment text,
        verified_participant boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL,
        image_url text,
        link_url text,
        category text NOT NULL,
        status text DEFAULT 'active',
        priority integer DEFAULT 1,
        start_date timestamptz DEFAULT now(),
        end_date timestamptz,
        created_by text NOT NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `

    return NextResponse.json({ 
      success: true, 
      message: "All database tables initialized successfully" 
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ 
      error: "Failed to initialize database",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

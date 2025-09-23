-- Migration: Create separate giveaway tables for approval system
-- This migration creates separate tables for pending, approved, and rejected giveaways
-- Similar to the script approval system

-- Create pending_giveaways table (new submissions)
CREATE TABLE IF NOT EXISTS "pending_giveaways" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "total_value" text NOT NULL,
  "category" text NOT NULL,
  "end_date" text NOT NULL,
  "max_entries" integer,
  "difficulty" text NOT NULL,
  "featured" boolean DEFAULT false,
  "auto_announce" boolean DEFAULT false,
  "creator_name" text NOT NULL,
  "creator_email" text NOT NULL,
  "creator_id" text,
  "images" text[] DEFAULT '{}',
  "videos" text[] DEFAULT '{}',
  "cover_image" text,
  "tags" text[] DEFAULT '{}',
  "rules" text[] DEFAULT '{}',
  "status" text DEFAULT 'active',
  "entries_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "submitted_at" timestamp DEFAULT now(),
  "admin_notes" text
);

-- Create approved_giveaways table (live giveaways)
CREATE TABLE IF NOT EXISTS "approved_giveaways" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "total_value" text NOT NULL,
  "category" text NOT NULL,
  "end_date" text NOT NULL,
  "max_entries" integer,
  "difficulty" text NOT NULL,
  "featured" boolean DEFAULT false,
  "auto_announce" boolean DEFAULT false,
  "creator_name" text NOT NULL,
  "creator_email" text NOT NULL,
  "creator_id" text,
  "images" text[] DEFAULT '{}',
  "videos" text[] DEFAULT '{}',
  "cover_image" text,
  "tags" text[] DEFAULT '{}',
  "rules" text[] DEFAULT '{}',
  "status" text DEFAULT 'active',
  "entries_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "approved_at" timestamp DEFAULT now(),
  "approved_by" text,
  "admin_notes" text
);

-- Create rejected_giveaways table
CREATE TABLE IF NOT EXISTS "rejected_giveaways" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "total_value" text NOT NULL,
  "category" text NOT NULL,
  "end_date" text NOT NULL,
  "max_entries" integer,
  "difficulty" text NOT NULL,
  "featured" boolean DEFAULT false,
  "auto_announce" boolean DEFAULT false,
  "creator_name" text NOT NULL,
  "creator_email" text NOT NULL,
  "creator_id" text,
  "images" text[] DEFAULT '{}',
  "videos" text[] DEFAULT '{}',
  "cover_image" text,
  "tags" text[] DEFAULT '{}',
  "rules" text[] DEFAULT '{}',
  "status" text DEFAULT 'active',
  "entries_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "rejected_at" timestamp DEFAULT now(),
  "rejected_by" text,
  "rejection_reason" text NOT NULL,
  "admin_notes" text
);

-- Migrate existing giveaways data
-- Move giveaways with status 'active' to approved_giveaways
INSERT INTO "approved_giveaways" (
  "id", "title", "description", "total_value", "category", "end_date", "max_entries", 
  "difficulty", "featured", "auto_announce", "creator_name", "creator_email", "creator_id", 
  "images", "videos", "cover_image", "tags", "rules", "status", "entries_count", 
  "created_at", "updated_at"
)
SELECT 
  "id", "title", "description", "total_value", "category", "end_date", "max_entries", 
  "difficulty", "featured", "auto_announce", "creator_name", "creator_email", "creator_id", 
  "images", "videos", "cover_image", "tags", "rules", "status", "entries_count", 
  "created_at", "updated_at"
FROM "giveaways" 
WHERE "status" = 'active';

-- Move giveaways with status 'ended' or 'cancelled' to approved_giveaways (they were previously approved)
INSERT INTO "approved_giveaways" (
  "id", "title", "description", "total_value", "category", "end_date", "max_entries", 
  "difficulty", "featured", "auto_announce", "creator_name", "creator_email", "creator_id", 
  "images", "videos", "cover_image", "tags", "rules", "status", "entries_count", 
  "created_at", "updated_at"
)
SELECT 
  "id", "title", "description", "total_value", "category", "end_date", "max_entries", 
  "difficulty", "featured", "auto_announce", "creator_name", "creator_email", "creator_id", 
  "images", "videos", "cover_image", "tags", "rules", "status", "entries_count", 
  "created_at", "updated_at"
FROM "giveaways" 
WHERE "status" IN ('ended', 'cancelled');




















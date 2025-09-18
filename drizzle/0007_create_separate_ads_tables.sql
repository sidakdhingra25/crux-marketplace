-- Migration: Create separate ads tables for approval system
-- This migration creates separate tables for pending, approved, and rejected ads
-- Similar to the script/giveaway approval system

-- Create pending_ads table (new submissions)
CREATE TABLE IF NOT EXISTS "pending_ads" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "image_url" text,
  "link_url" text,
  "category" text NOT NULL,
  "priority" integer DEFAULT 1,
  "start_date" timestamp DEFAULT now(),
  "end_date" timestamp,
  "created_by" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "submitted_at" timestamp DEFAULT now(),
  "admin_notes" text
);

-- Create approved_ads table (live ads)
CREATE TABLE IF NOT EXISTS "approved_ads" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "image_url" text,
  "link_url" text,
  "category" text NOT NULL,
  "status" "public"."ad_status" DEFAULT 'active',
  "priority" integer DEFAULT 1,
  "start_date" timestamp DEFAULT now(),
  "end_date" timestamp,
  "created_by" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "approved_at" timestamp DEFAULT now(),
  "approved_by" text,
  "admin_notes" text
);

-- Create rejected_ads table
CREATE TABLE IF NOT EXISTS "rejected_ads" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "image_url" text,
  "link_url" text,
  "category" text NOT NULL,
  "priority" integer DEFAULT 1,
  "start_date" timestamp DEFAULT now(),
  "end_date" timestamp,
  "created_by" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "rejected_at" timestamp DEFAULT now(),
  "rejected_by" text,
  "rejection_reason" text NOT NULL,
  "admin_notes" text
);



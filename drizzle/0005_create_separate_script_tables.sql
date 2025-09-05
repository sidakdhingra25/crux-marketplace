-- Create separate script tables for better organization and performance

-- Create pending_scripts table
CREATE TABLE IF NOT EXISTS "pending_scripts" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "price" numeric NOT NULL,
  "original_price" numeric,
  "category" text NOT NULL,
  "framework" text,
  "seller_name" text NOT NULL,
  "seller_email" text NOT NULL,
  "tags" text[] DEFAULT '{}',
  "features" text[] DEFAULT '{}',
  "requirements" text[] DEFAULT '{}',
  "images" text[] DEFAULT '{}',
  "videos" text[] DEFAULT '{}',
  "screenshots" text[] DEFAULT '{}',
  "cover_image" text,
  "demo_url" text,
  "documentation_url" text,
  "support_url" text,
  "version" text DEFAULT '1.0.0',
  "featured" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "submitted_at" timestamp DEFAULT now(),
  "admin_notes" text
);

-- Create approved_scripts table
CREATE TABLE IF NOT EXISTS "approved_scripts" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "price" numeric NOT NULL,
  "original_price" numeric,
  "category" text NOT NULL,
  "framework" text,
  "seller_name" text NOT NULL,
  "seller_email" text NOT NULL,
  "tags" text[] DEFAULT '{}',
  "features" text[] DEFAULT '{}',
  "requirements" text[] DEFAULT '{}',
  "images" text[] DEFAULT '{}',
  "videos" text[] DEFAULT '{}',
  "screenshots" text[] DEFAULT '{}',
  "cover_image" text,
  "demo_url" text,
  "documentation_url" text,
  "support_url" text,
  "version" text DEFAULT '1.0.0',
  "featured" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "approved_at" timestamp DEFAULT now(),
  "approved_by" text,
  "admin_notes" text
);

-- Create rejected_scripts table
CREATE TABLE IF NOT EXISTS "rejected_scripts" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "price" numeric NOT NULL,
  "original_price" numeric,
  "category" text NOT NULL,
  "framework" text,
  "seller_name" text NOT NULL,
  "seller_email" text NOT NULL,
  "tags" text[] DEFAULT '{}',
  "features" text[] DEFAULT '{}',
  "requirements" text[] DEFAULT '{}',
  "images" text[] DEFAULT '{}',
  "videos" text[] DEFAULT '{}',
  "screenshots" text[] DEFAULT '{}',
  "cover_image" text,
  "demo_url" text,
  "documentation_url" text,
  "support_url" text,
  "version" text DEFAULT '1.0.0',
  "featured" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "rejected_at" timestamp DEFAULT now(),
  "rejected_by" text,
  "rejection_reason" text NOT NULL,
  "admin_notes" text
);

-- Migrate existing data
-- Move pending scripts to pending_scripts table
INSERT INTO "pending_scripts" (
  "id", "title", "description", "price", "original_price", "category", "framework", 
  "seller_name", "seller_email", "tags", "features", "requirements", "images", 
  "videos", "screenshots", "cover_image", "demo_url", "documentation_url", 
  "support_url", "version", "featured", "created_at", "updated_at"
)
SELECT 
  "id", "title", "description", "price", "original_price", "category", "framework", 
  "seller_name", "seller_email", "tags", "features", "requirements", "images", 
  "videos", "screenshots", "cover_image", "demo_url", "documentation_url", 
  "support_url", "version", "featured", "created_at", "updated_at"
FROM "scripts" 
WHERE "status" = 'pending';

-- Move approved scripts to approved_scripts table
INSERT INTO "approved_scripts" (
  "id", "title", "description", "price", "original_price", "category", "framework", 
  "seller_name", "seller_email", "tags", "features", "requirements", "images", 
  "videos", "screenshots", "cover_image", "demo_url", "documentation_url", 
  "support_url", "version", "featured", "created_at", "updated_at"
)
SELECT 
  "id", "title", "description", "price", "original_price", "category", "framework", 
  "seller_name", "seller_email", "tags", "features", "requirements", "images", 
  "videos", "screenshots", "cover_image", "demo_url", "documentation_url", 
  "support_url", "version", "featured", "created_at", "updated_at"
FROM "scripts" 
WHERE "status" = 'approved';


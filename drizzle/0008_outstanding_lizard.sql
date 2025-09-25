CREATE TABLE "approved_ads" (
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
	"status" text DEFAULT 'active',
	"approved_at" timestamp DEFAULT now(),
	"approved_by" text,
	"admin_notes" text
);
--> statement-breakpoint
CREATE TABLE "approved_giveaways" (
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
--> statement-breakpoint
CREATE TABLE "approved_scripts" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"original_price" numeric,
	"category" text NOT NULL,
"framework" text[] DEFAULT '{}',
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
--> statement-breakpoint
CREATE TABLE "pending_ads" (
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
--> statement-breakpoint
CREATE TABLE "pending_giveaways" (
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
--> statement-breakpoint
CREATE TABLE "pending_scripts" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"original_price" numeric,
	"category" text NOT NULL,
"framework" text[] DEFAULT '{}',
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
--> statement-breakpoint
CREATE TABLE "rejected_ads" (
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
--> statement-breakpoint
CREATE TABLE "rejected_giveaways" (
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
--> statement-breakpoint
CREATE TABLE "rejected_scripts" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"original_price" numeric,
	"category" text NOT NULL,
"framework" text[] DEFAULT '{}',
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
--> statement-breakpoint
ALTER TABLE "ads" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ads" CASCADE;--> statement-breakpoint
ALTER TABLE "giveaway_entries" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "giveaway_entries" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "giveaways" ALTER COLUMN "difficulty" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "giveaways" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "giveaways" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "scripts" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "scripts" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
DROP TYPE "public"."ad_status";--> statement-breakpoint
DROP TYPE "public"."entry_status";--> statement-breakpoint
DROP TYPE "public"."giveaway_difficulty";--> statement-breakpoint
DROP TYPE "public"."giveaway_status";--> statement-breakpoint
DROP TYPE "public"."script_status";--> statement-breakpoint
DROP TYPE "public"."user_role";
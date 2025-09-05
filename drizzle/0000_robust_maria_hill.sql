CREATE TYPE "public"."ad_status" AS ENUM('active', 'inactive', 'expired');--> statement-breakpoint
CREATE TYPE "public"."entry_status" AS ENUM('active', 'disqualified', 'winner');--> statement-breakpoint
CREATE TYPE "public"."giveaway_difficulty" AS ENUM('Easy', 'Medium', 'Hard');--> statement-breakpoint
CREATE TYPE "public"."giveaway_status" AS ENUM('active', 'ended', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."script_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'moderator', 'admin', 'seller', 'ads');--> statement-breakpoint
CREATE TABLE "ads" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"link_url" text,
	"category" text NOT NULL,
	"status" "ad_status" DEFAULT 'active',
	"priority" integer DEFAULT 1,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "giveaway_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"giveaway_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text,
	"user_email" text,
	"entry_date" timestamp DEFAULT now(),
	"status" "entry_status" DEFAULT 'active',
	"points_earned" integer DEFAULT 0,
	"requirements_completed" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "giveaway_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"giveaway_id" integer NOT NULL,
	"reviewer_name" text NOT NULL,
	"reviewer_email" text NOT NULL,
	"reviewer_id" text,
	"rating" integer NOT NULL,
	"title" text,
	"comment" text,
	"verified_participant" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "giveaways" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"total_value" text NOT NULL,
	"category" text NOT NULL,
	"end_date" text NOT NULL,
	"max_entries" integer,
	"difficulty" "giveaway_difficulty" NOT NULL,
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
	"status" "giveaway_status" DEFAULT 'active',
	"entries_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "script_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"script_id" integer NOT NULL,
	"reviewer_name" text NOT NULL,
	"reviewer_email" text NOT NULL,
	"rating" integer NOT NULL,
	"title" text,
	"comment" text,
	"verified_purchase" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"original_price" numeric,
	"category" text NOT NULL,
	"framework" text,
	"seller_name" text NOT NULL,
	"seller_email" text NOT NULL,
	"seller_id" text,
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
	"last_updated" timestamp DEFAULT now(),
	"status" "script_status" DEFAULT 'pending',
	"featured" boolean DEFAULT false,
	"downloads" integer DEFAULT 0,
	"rating" numeric DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"image" text,
	"username" text,
	"roles" text[] DEFAULT '{"user"}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "giveaway_entries" ADD CONSTRAINT "giveaway_entries_giveaway_id_giveaways_id_fk" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giveaway_reviews" ADD CONSTRAINT "giveaway_reviews_giveaway_id_giveaways_id_fk" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "script_reviews" ADD CONSTRAINT "script_reviews_script_id_scripts_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE no action;
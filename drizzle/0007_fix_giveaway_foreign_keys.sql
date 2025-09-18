-- Migration: Remove foreign key constraints for giveaway requirements and prizes
-- This migration removes the foreign key constraints that reference the old giveaways table
-- Since we now have separate tables for pending/approved/rejected giveaways, we can't use simple foreign keys

-- Drop existing foreign key constraints
ALTER TABLE "giveaway_requirements" DROP CONSTRAINT IF EXISTS "giveaway_requirements_giveaway_id_giveaways_id_fk";
ALTER TABLE "giveaway_prizes" DROP CONSTRAINT IF EXISTS "giveaway_prizes_giveaway_id_giveaways_id_fk";
ALTER TABLE "giveaway_entries" DROP CONSTRAINT IF EXISTS "giveaway_entries_giveaway_id_giveaways_id_fk";
ALTER TABLE "giveaway_reviews" DROP CONSTRAINT IF EXISTS "giveaway_reviews_giveaway_id_giveaways_id_fk";

-- Note: We're not adding new constraints because PostgreSQL doesn't support
-- complex foreign key relationships across multiple tables in a simple way.
-- The application logic will handle ensuring data integrity.









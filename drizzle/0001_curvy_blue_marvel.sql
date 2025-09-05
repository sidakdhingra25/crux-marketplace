CREATE TABLE "giveaway_prizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"giveaway_id" integer NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"value" text NOT NULL,
	"winner_name" text,
	"winner_email" text,
	"claimed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "giveaway_requirements" (
	"id" serial PRIMARY KEY NOT NULL,
	"giveaway_id" integer NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"points" integer NOT NULL,
	"required" boolean DEFAULT true,
	"link" text
);
--> statement-breakpoint
ALTER TABLE "scripts" ALTER COLUMN "rating" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "giveaway_prizes" ADD CONSTRAINT "giveaway_prizes_giveaway_id_giveaways_id_fk" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giveaway_requirements" ADD CONSTRAINT "giveaway_requirements_giveaway_id_giveaways_id_fk" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON DELETE cascade ON UPDATE no action;
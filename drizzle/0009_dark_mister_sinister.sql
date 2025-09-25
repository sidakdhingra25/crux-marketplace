-- Alter scripts-related tables to store multiple frameworks in a single column named "framework" as text[]

-- scripts (legacy/back-compat)
ALTER TABLE "scripts" 
  ALTER COLUMN "framework" TYPE text[] USING 
    CASE 
      WHEN "framework" IS NULL THEN ARRAY[]::text[]
      WHEN pg_typeof("framework") = 'text[]'::regtype THEN "framework"
      ELSE ARRAY["framework"]::text[]
    END,
  ALTER COLUMN "framework" SET DEFAULT '{}';

-- pending_scripts
ALTER TABLE "pending_scripts" 
  ALTER COLUMN "framework" TYPE text[] USING 
    CASE 
      WHEN "framework" IS NULL THEN ARRAY[]::text[]
      WHEN pg_typeof("framework") = 'text[]'::regtype THEN "framework"
      ELSE ARRAY["framework"]::text[]
    END,
  ALTER COLUMN "framework" SET DEFAULT '{}';

-- approved_scripts
ALTER TABLE "approved_scripts" 
  ALTER COLUMN "framework" TYPE text[] USING 
    CASE 
      WHEN "framework" IS NULL THEN ARRAY[]::text[]
      WHEN pg_typeof("framework") = 'text[]'::regtype THEN "framework"
      ELSE ARRAY["framework"]::text[]
    END,
  ALTER COLUMN "framework" SET DEFAULT '{}';

-- rejected_scripts
ALTER TABLE "rejected_scripts" 
  ALTER COLUMN "framework" TYPE text[] USING 
    CASE 
      WHEN "framework" IS NULL THEN ARRAY[]::text[]
      WHEN pg_typeof("framework") = 'text[]'::regtype THEN "framework"
      ELSE ARRAY["framework"]::text[]
    END,
  ALTER COLUMN "framework" SET DEFAULT '{}';



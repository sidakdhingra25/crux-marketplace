-- Add 'user' role to the user_role enum
ALTER TYPE user_role ADD VALUE 'user';

-- Update existing users with default 'moderator' role to 'user' role
UPDATE users 
SET roles = ARRAY['user'] 
WHERE roles = ARRAY['moderator'] OR roles IS NULL;

-- Fix the users_role_check constraint to allow 'general' instead of 'client'
-- This fixes the signup error: "new row for relation 'users' violates check constraint 'users_role_check'"

-- First, find and drop the existing constraint
-- The constraint name might be 'users_role_check' or something similar
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the constraint name
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'users'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%role%';
    
    -- Drop the constraint if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE users DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END IF;
END $$;

-- Alternative: If the above doesn't work, try dropping by the exact constraint name
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Now add the correct constraint that allows 'general' instead of 'client'
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'employee', 'general'));

-- Verify the constraint was created correctly
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass
AND contype = 'c'
AND conname LIKE '%role%';

-- Also update any existing 'client' users to 'general' (if any exist)
UPDATE users 
SET role = 'general' 
WHERE role = 'client';

-- Show current users and their roles for verification
SELECT 
    email,
    role,
    subscription_tier,
    is_active,
    created_at
FROM users
ORDER BY created_at DESC;


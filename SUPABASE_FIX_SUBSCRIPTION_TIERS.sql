-- Fix subscription tier setup (handles existing constraints)
-- Run this in your Supabase SQL Editor

-- Add subscription_tier column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'free';
  END IF;
END $$;

-- Drop existing constraint if it exists (to recreate it)
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS valid_subscription_tier;

-- Add constraint with correct values
ALTER TABLE users
ADD CONSTRAINT valid_subscription_tier 
CHECK (subscription_tier IN ('free', 'pro', 'enterprise', 'none'));

-- Set default tier for existing client users
UPDATE users 
SET subscription_tier = 'free'
WHERE role = 'client' AND (subscription_tier IS NULL OR subscription_tier = '');

-- Set tier for admins/employees (they don't need subscriptions)
UPDATE users 
SET subscription_tier = 'none'
WHERE role IN ('admin', 'employee') AND (subscription_tier IS NULL OR subscription_tier = '');

-- Add index for faster queries (only if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Display current users with their tiers
SELECT 
  email,
  role,
  subscription_tier,
  is_active,
  last_login,
  created_at
FROM users
ORDER BY created_at DESC;


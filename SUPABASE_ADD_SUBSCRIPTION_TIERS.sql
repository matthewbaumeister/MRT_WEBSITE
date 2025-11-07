-- Add subscription tier support to users table
-- Run this in your Supabase SQL Editor

-- Add subscription_tier column with default 'free'
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free';

-- Add check constraint to ensure valid subscription tiers
ALTER TABLE users
ADD CONSTRAINT valid_subscription_tier 
CHECK (subscription_tier IN ('free', 'pro', 'enterprise', 'none'));

-- Set default tier for existing client users
UPDATE users 
SET subscription_tier = 'free'
WHERE role = 'client' AND subscription_tier IS NULL;

-- Admin and employee roles don't need subscription tiers (they have full access)
UPDATE users 
SET subscription_tier = 'none'
WHERE role IN ('admin', 'employee') AND subscription_tier IS NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Display current users with their tiers
SELECT 
  email,
  role,
  subscription_tier,
  is_active,
  created_at
FROM users
ORDER BY created_at DESC;


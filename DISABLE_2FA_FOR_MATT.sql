-- Disable 2FA for Matt's account so you can login
-- Run this in Supabase SQL Editor

UPDATE users
SET two_factor_enabled = false
WHERE email = 'matt@make-ready-consulting.com';

-- Verify the update
SELECT 
  email,
  role,
  two_factor_enabled,
  is_active,
  subscription_tier
FROM users
WHERE email = 'matt@make-ready-consulting.com';

-- After running this, you should be able to login with just email + password
-- You can re-enable 2FA later from the admin panel if needed


-- Fix admin and employee subscription tiers
-- They should be 'none' since they have full access by role

UPDATE users 
SET subscription_tier = 'none'
WHERE role IN ('admin', 'employee');

-- Verify the fix
SELECT 
  email,
  role,
  subscription_tier,
  is_active
FROM users
ORDER BY role, created_at;


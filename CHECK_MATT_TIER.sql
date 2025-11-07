-- Check Matt's current subscription tier
SELECT 
  email, 
  first_name, 
  last_name, 
  role, 
  subscription_tier,
  is_active
FROM users
WHERE email = 'matt@make-ready-consulting.com';


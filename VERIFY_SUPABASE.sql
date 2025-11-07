-- Check if users table has all required columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check existing users
SELECT 
  id,
  email,
  role,
  is_active,
  first_name,
  last_name,
  two_factor_enabled,
  created_at
FROM users;

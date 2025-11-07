-- Check if password was properly saved for Matt's account
SELECT 
  email,
  role,
  subscription_tier,
  is_active,
  LENGTH(password_hash) as password_hash_length,
  SUBSTRING(password_hash, 1, 10) as password_hash_start,
  updated_at,
  created_at
FROM users
WHERE email = 'matt@make-ready-consulting.com';

-- Expected results:
-- password_hash_length should be ~60 (bcrypt hash)
-- password_hash_start should look like: $2a$10$... or $2b$10$...
-- updated_at should be recent (after password reset)

-- If password_hash_length is NULL or 0, password wasn't saved!


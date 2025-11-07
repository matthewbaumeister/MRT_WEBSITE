-- Manual password reset for Matt's account
-- Use this if password reset isn't working

-- Step 1: Generate a bcrypt hash for a temporary password
-- Go to: https://bcrypt-generator.com/
-- Enter password: TempPass123!
-- Rounds: 10
-- Click "Generate"
-- Copy the hash (should look like: $2a$10$...)

-- Step 2: Update the password in database
-- Replace the hash below with the one you generated
UPDATE users
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'matt@make-ready-consulting.com';

-- Step 3: Verify the update
SELECT 
  email,
  LENGTH(password_hash) as hash_length,
  SUBSTRING(password_hash, 1, 10) as hash_start,
  updated_at
FROM users
WHERE email = 'matt@make-ready-consulting.com';

-- Step 4: Try logging in with: TempPass123!
-- Then immediately reset your password via the forgot password feature


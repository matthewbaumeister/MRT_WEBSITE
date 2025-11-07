-- Fix RLS policies to allow admin users to see all users
-- Run this in Supabase SQL Editor

-- First, let's check current policies
-- You can run this to see what policies exist:
-- SELECT * FROM pg_policies WHERE tablename = 'users';

-- Drop the existing admin read policy if it exists
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Create new policy that allows admins to read all users
-- This checks if the logged-in user (from JWT) has admin role
CREATE POLICY "Admins can read all users"
ON users FOR SELECT
USING (
  -- Allow if the requesting user is an admin
  EXISTS (
    SELECT 1 FROM users
    WHERE email = auth.jwt() ->> 'email'
    AND role = 'admin'
  )
  -- OR allow users to read their own data
  OR email = auth.jwt() ->> 'email'
);

-- Also ensure admins can update users (for role changes, 2FA toggles, etc.)
DROP POLICY IF EXISTS "Admins can update all users" ON users;

CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = auth.jwt() ->> 'email'
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE email = auth.jwt() ->> 'email'
    AND role = 'admin'
  )
);

-- List all current users (for verification)
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  is_active,
  two_factor_enabled,
  created_at,
  last_login
FROM users
ORDER BY created_at DESC;


-- ============================================
-- PROPER RLS POLICIES FOR USERS TABLE
-- This keeps security while allowing signups
-- ============================================

-- First, make sure RLS is ENABLED
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to start fresh)
DROP POLICY IF EXISTS "Allow public signup" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Service role has full access" ON users;

-- ============================================
-- POLICY 1: Allow anonymous users to INSERT (for signup)
-- ============================================
CREATE POLICY "Allow public signup"
ON users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- POLICY 2: Users can read their own data
-- ============================================
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text OR role = 'admin');

-- ============================================
-- POLICY 3: Users can update their own data
-- ============================================
CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- ============================================
-- POLICY 4: Admins can read all users
-- ============================================
CREATE POLICY "Admins can read all users"
ON users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = auth.uid()::text
    AND users.role = 'admin'
  )
);

-- ============================================
-- POLICY 5: Admins can update all users
-- ============================================
CREATE POLICY "Admins can update all users"
ON users
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = auth.uid()::text
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = auth.uid()::text
    AND users.role = 'admin'
  )
);

-- ============================================
-- POLICY 6: Service role (backend) has full access
-- ============================================
CREATE POLICY "Service role has full access"
ON users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- Verify policies are created
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- Test: This should show RLS is enabled
-- ============================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';


-- Fix RLS permissions for MATRIX tables
-- Run this in Supabase SQL Editor

-- First, check if RLS is enabled (it should be)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'matrix%';

-- Disable RLS temporarily to test (DO NOT LEAVE THIS WAY!)
-- ALTER TABLE public.matrix_conversations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.matrix_messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.matrix_projects DISABLE ROW LEVEL SECURITY;

-- Better solution: Add a policy that allows service role to do everything
-- This is safe because service role key should be secret

-- For matrix_conversations
DROP POLICY IF EXISTS "Service role can do anything conversations" ON public.matrix_conversations;
CREATE POLICY "Service role can do anything conversations"
  ON public.matrix_conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For matrix_messages  
DROP POLICY IF EXISTS "Service role can do anything messages" ON public.matrix_messages;
CREATE POLICY "Service role can do anything messages"
  ON public.matrix_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- For matrix_projects
DROP POLICY IF EXISTS "Service role can do anything projects" ON public.matrix_projects;
CREATE POLICY "Service role can do anything projects"
  ON public.matrix_projects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename LIKE 'matrix%'
ORDER BY tablename, policyname;

-- Test query (should return empty array, not error)
SELECT * FROM matrix_conversations LIMIT 1;
SELECT * FROM matrix_projects LIMIT 1;
SELECT * FROM matrix_messages LIMIT 1;


-- Quick fix for RLS permissions
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN

-- Add service role policies for all MATRIX tables
DROP POLICY IF EXISTS "Service role can do anything conversations" ON public.matrix_conversations;
CREATE POLICY "Service role can do anything conversations"
  ON public.matrix_conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can do anything messages" ON public.matrix_messages;
CREATE POLICY "Service role can do anything messages"
  ON public.matrix_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can do anything projects" ON public.matrix_projects;
CREATE POLICY "Service role can do anything projects"
  ON public.matrix_projects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify
SELECT 'SUCCESS: Policies created for service_role' as status;

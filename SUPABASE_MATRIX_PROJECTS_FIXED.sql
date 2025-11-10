-- ========================================
-- MATRIX Projects Table Setup - Safe to Re-run
-- ========================================
-- This script can be run multiple times without errors
-- IMPORTANT: Run SUPABASE_MATRIX_TABLES_FIXED.sql FIRST

-- Create Projects table for MATRIX
CREATE TABLE IF NOT EXISTS public.matrix_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#2F2F72', -- Brand purple default
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add project_id to conversations (safe to re-run)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'matrix_conversations' 
        AND column_name = 'project_id'
    ) THEN
        ALTER TABLE public.matrix_conversations 
        ADD COLUMN project_id UUID REFERENCES public.matrix_projects(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_matrix_projects_user_id 
ON public.matrix_projects(user_id);

CREATE INDEX IF NOT EXISTS idx_matrix_conversations_project_id 
ON public.matrix_conversations(project_id);

-- Enable RLS
ALTER TABLE public.matrix_projects ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Drop existing policies (safe if they don't exist)
-- ========================================
DROP POLICY IF EXISTS "Users can view own projects" ON public.matrix_projects;
DROP POLICY IF EXISTS "Users can create own projects" ON public.matrix_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.matrix_projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.matrix_projects;

-- ========================================
-- RLS Policies for matrix_projects
-- ========================================

CREATE POLICY "Users can view own projects" ON public.matrix_projects
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.matrix_projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.matrix_projects
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.matrix_projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- ========================================
-- Triggers and Functions
-- ========================================

-- Create function to update project timestamp
CREATE OR REPLACE FUNCTION update_matrix_project_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.project_id IS NOT NULL THEN
        UPDATE public.matrix_projects
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_project_timestamp_on_conversation ON public.matrix_conversations;

-- Create trigger to update project timestamp when conversation is updated
CREATE TRIGGER update_project_timestamp_on_conversation
    AFTER INSERT OR UPDATE ON public.matrix_conversations
    FOR EACH ROW
    WHEN (NEW.project_id IS NOT NULL)
    EXECUTE FUNCTION update_matrix_project_timestamp();

-- ========================================
-- Permissions
-- ========================================
GRANT ALL ON public.matrix_projects TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'MATRIX projects table and policies created successfully!';
END $$;


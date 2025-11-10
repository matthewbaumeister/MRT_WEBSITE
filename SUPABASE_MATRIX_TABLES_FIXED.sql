-- ========================================
-- MATRIX Tables Setup - Safe to Re-run
-- ========================================
-- This script can be run multiple times without errors

-- Create Matrix Conversations Table
CREATE TABLE IF NOT EXISTS public.matrix_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create Matrix Messages Table
CREATE TABLE IF NOT EXISTS public.matrix_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.matrix_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    files JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_matrix_conversations_user_id 
ON public.matrix_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_matrix_conversations_updated_at 
ON public.matrix_conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_matrix_messages_conversation_id 
ON public.matrix_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_matrix_messages_created_at 
ON public.matrix_messages(created_at ASC);

-- Enable Row Level Security
ALTER TABLE public.matrix_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matrix_messages ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Drop existing policies (safe if they don't exist)
-- ========================================
DROP POLICY IF EXISTS "Users can view own conversations" ON public.matrix_conversations;
DROP POLICY IF EXISTS "Users can create own conversations" ON public.matrix_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.matrix_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.matrix_conversations;

DROP POLICY IF EXISTS "Users can view own messages" ON public.matrix_messages;
DROP POLICY IF EXISTS "Users can create own messages" ON public.matrix_messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.matrix_messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.matrix_messages;

-- ========================================
-- RLS Policies for matrix_conversations
-- ========================================

-- Users can only view their own conversations
CREATE POLICY "Users can view own conversations" ON public.matrix_conversations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own conversations
CREATE POLICY "Users can create own conversations" ON public.matrix_conversations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations" ON public.matrix_conversations
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations" ON public.matrix_conversations
    FOR DELETE
    USING (auth.uid() = user_id);

-- ========================================
-- RLS Policies for matrix_messages
-- ========================================

-- Users can view messages from their own conversations
CREATE POLICY "Users can view own messages" ON public.matrix_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.matrix_conversations
            WHERE id = conversation_id
            AND user_id = auth.uid()
        )
    );

-- Users can insert messages to their own conversations
CREATE POLICY "Users can create own messages" ON public.matrix_messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.matrix_conversations
            WHERE id = conversation_id
            AND user_id = auth.uid()
        )
    );

-- Users can update messages in their own conversations
CREATE POLICY "Users can update own messages" ON public.matrix_messages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.matrix_conversations
            WHERE id = conversation_id
            AND user_id = auth.uid()
        )
    );

-- Users can delete messages from their own conversations
CREATE POLICY "Users can delete own messages" ON public.matrix_messages
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.matrix_conversations
            WHERE id = conversation_id
            AND user_id = auth.uid()
        )
    );

-- ========================================
-- Triggers and Functions
-- ========================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_matrix_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.matrix_conversations
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS update_conversation_timestamp ON public.matrix_messages;

-- Create trigger to update conversation timestamp when new message is added
CREATE TRIGGER update_conversation_timestamp
    AFTER INSERT ON public.matrix_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_matrix_conversation_timestamp();

-- ========================================
-- Permissions
-- ========================================
GRANT ALL ON public.matrix_conversations TO authenticated;
GRANT ALL ON public.matrix_messages TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'MATRIX tables and policies created successfully!';
END $$;


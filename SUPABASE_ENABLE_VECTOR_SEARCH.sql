-- ============================================
-- ENABLE AI SEMANTIC SEARCH WITH pgvector
-- ============================================
-- This enables storing and searching AI embeddings
-- for intelligent semantic search

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table to store vector representations
CREATE TABLE IF NOT EXISTS document_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table text NOT NULL,
  source_id text NOT NULL,
  content_type text NOT NULL, -- 'title', 'description', 'full_text'
  content_text text NOT NULL,
  embedding vector(1536) NOT NULL, -- OpenAI ada-002 creates 1536-dimension vectors
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Composite unique constraint to prevent duplicates
  UNIQUE(source_table, source_id, content_type)
);

-- Create index for vector similarity search (HNSW for speed)
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx 
ON document_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Create index for fast filtering by source
CREATE INDEX IF NOT EXISTS document_embeddings_source_idx 
ON document_embeddings(source_table, source_id);

-- Create index for metadata queries
CREATE INDEX IF NOT EXISTS document_embeddings_metadata_idx 
ON document_embeddings USING gin(metadata);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON document_embeddings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON document_embeddings TO service_role;

-- Create function to search by semantic similarity
CREATE OR REPLACE FUNCTION search_documents_semantic(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_tables text[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  source_table text,
  source_id text,
  content_text text,
  similarity float,
  metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    document_embeddings.id,
    document_embeddings.source_table,
    document_embeddings.source_id,
    document_embeddings.content_text,
    1 - (document_embeddings.embedding <=> query_embedding) as similarity,
    document_embeddings.metadata
  FROM document_embeddings
  WHERE 
    (filter_tables IS NULL OR document_embeddings.source_table = ANY(filter_tables))
    AND (1 - (document_embeddings.embedding <=> query_embedding)) > match_threshold
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_documents_semantic(vector(1536), float, int, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION search_documents_semantic(vector(1536), float, int, text[]) TO service_role;

-- ============================================
-- HOW IT WORKS
-- ============================================
-- 1. pgvector stores AI embeddings as vectors
-- 2. Embeddings are 1536-dimensional (OpenAI ada-002)
-- 3. Cosine similarity finds semantically similar content
-- 4. HNSW index makes search fast (milliseconds)
--
-- SEMANTIC SEARCH EXAMPLES:
-- "cyber defense" will match "information security"
-- "ai machine learning" will match "artificial intelligence"
-- "body armor" will match "ballistic protection"
--
-- This is WAY smarter than keyword search!

-- ============================================
-- NEXT STEPS AFTER RUNNING THIS
-- ============================================
-- 1. Generate embeddings for your existing data
-- 2. Store embeddings in document_embeddings table
-- 3. Use search_documents_semantic() to find results
-- 4. Combine with keyword search for best results


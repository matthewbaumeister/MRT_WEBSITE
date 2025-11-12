-- Table to store shareable Knowledge Base views
CREATE TABLE IF NOT EXISTS public.knowledge_base_shares (
  id SERIAL PRIMARY KEY,
  share_id TEXT UNIQUE NOT NULL,
  table_name TEXT NOT NULL,
  search_query TEXT,
  search_mode TEXT DEFAULT 'keyword',
  sort_column TEXT,
  sort_direction TEXT,
  page_size INTEGER DEFAULT 50,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0
);

-- Create index on share_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_kb_shares_share_id ON public.knowledge_base_shares(share_id);

-- Create index on created_by for user's shares
CREATE INDEX IF NOT EXISTS idx_kb_shares_created_by ON public.knowledge_base_shares(created_by);

-- Enable RLS (Row Level Security)
ALTER TABLE public.knowledge_base_shares ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read shared views (public access)
CREATE POLICY "Public read access for shared views"
  ON public.knowledge_base_shares
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can create shares
CREATE POLICY "Authenticated users can create shares"
  ON public.knowledge_base_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Users can update their own shares
CREATE POLICY "Users can update their own shares"
  ON public.knowledge_base_shares
  FOR UPDATE
  TO authenticated
  USING (created_by = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Users can delete their own shares
CREATE POLICY "Users can delete their own shares"
  ON public.knowledge_base_shares
  FOR DELETE
  TO authenticated
  USING (created_by = current_setting('request.jwt.claims', true)::json->>'email');

-- Grant permissions
GRANT SELECT ON public.knowledge_base_shares TO anon;
GRANT ALL ON public.knowledge_base_shares TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE knowledge_base_shares_id_seq TO authenticated;

-- Function to update last accessed timestamp
CREATE OR REPLACE FUNCTION update_share_access()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed = NOW();
  NEW.access_count = COALESCE(NEW.access_count, 0) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track access (optional - can be used for analytics)
-- Commented out as it would update on every read, which might not be desired
-- CREATE TRIGGER track_share_access
--   BEFORE SELECT ON public.knowledge_base_shares
--   FOR EACH ROW
--   EXECUTE FUNCTION update_share_access();

COMMENT ON TABLE public.knowledge_base_shares IS 'Stores shareable Knowledge Base view configurations for public access';


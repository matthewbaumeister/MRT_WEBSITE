-- ============================================
-- GET COLUMN TYPES FOR KNOWLEDGE BASE
-- ============================================
-- This function returns the data type of each column
-- so we can filter out non-searchable types like dates, tsvector, etc.

CREATE OR REPLACE FUNCTION get_column_types(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text
  FROM information_schema.columns c
  WHERE c.table_name = get_column_types.table_name
    AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_column_types(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_column_types(text) TO service_role;

-- ============================================
-- HOW TO USE
-- ============================================
-- SELECT * FROM get_column_types('dod_contract_news');
--
-- Returns:
-- column_name              | data_type
-- ------------------------ | ------------------
-- article_id               | bigint
-- article_url              | text
-- article_title            | text
-- published_date           | date
-- scraped_at               | timestamp with time zone
-- search_vector            | tsvector
-- vendor_name              | text
--
-- This helps the Knowledge Base know which columns
-- can be searched with ILIKE (only text/varchar columns)



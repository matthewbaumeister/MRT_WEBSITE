-- ============================================
-- GET TABLE COLUMNS FUNCTION
-- ============================================
-- This function gets column names from the schema
-- Works even if the table is empty!

CREATE OR REPLACE FUNCTION get_table_columns(table_name_param text)
RETURNS TABLE (
  column_name text,
  data_type text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = table_name_param
    AND c.data_type IN ('text', 'character varying', 'varchar')
  ORDER BY c.ordinal_position;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO service_role;

-- ============================================
-- TEST IT
-- ============================================
-- SELECT * FROM get_table_columns('army_innovation_documents');
-- Should return: document_title, document_description, document_text, etc.

-- ============================================
-- HOW IT WORKS
-- ============================================
-- 1. Takes table name as parameter
-- 2. Queries information_schema.columns
-- 3. Returns all text columns
-- 4. Works even if table is empty!
--
-- RESULT: MATRIX can find columns even in empty tables


-- Optional: Create a helper function for column discovery
-- This is OPTIONAL - the system works without it using fallback method

-- Drop function if exists
DROP FUNCTION IF EXISTS get_table_columns(text);

-- Create function to get column information for a table
CREATE OR REPLACE FUNCTION get_table_columns(table_name_param text)
RETURNS TABLE (
  column_name text,
  data_type text,
  character_maximum_length integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.character_maximum_length
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = table_name_param
  ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO anon;

-- Test the function
SELECT * FROM get_table_columns('dod_contract_news') LIMIT 10;

-- You should see output like:
-- column_name          | data_type | character_maximum_length
-- ---------------------|-----------|------------------------
-- id                   | bigint    | null
-- title                | text      | null
-- description          | text      | null
-- contractor_name      | text      | null
-- content              | text      | null
-- ...


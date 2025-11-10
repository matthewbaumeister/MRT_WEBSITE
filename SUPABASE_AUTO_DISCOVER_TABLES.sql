-- ============================================
-- SMART AUTO-DISCOVERY FUNCTION
-- ============================================
-- This function allows MATRIX to automatically find
-- all tables with data, so it scales as you add more tables!

-- Create function to get tables with data
CREATE OR REPLACE FUNCTION get_tables_with_data()
RETURNS TABLE (
  tablename text,
  row_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    relname::text as tablename,
    n_live_tup as row_count
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
    AND n_live_tup > 0  -- Only tables with data
  ORDER BY n_live_tup DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_tables_with_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_tables_with_data() TO service_role;

-- ============================================
-- HOW IT WORKS
-- ============================================
-- 1. Function queries pg_stat_user_tables
-- 2. Finds all tables in 'public' schema
-- 3. Only returns tables that have data (n_live_tup > 0)
-- 4. Sorts by most data first
-- 
-- RESULT: MATRIX automatically finds:
-- - gsa_labor_categories (196,714 rows)
-- - dod_contract_news (44,113 rows)
-- - sbir_final (32,131 rows)
-- - ... all your tables!
--
-- ADD NEW TABLES? They're automatically discovered!
-- NO CODE CHANGES NEEDED!


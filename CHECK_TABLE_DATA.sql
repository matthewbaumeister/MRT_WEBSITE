-- ============================================
-- FIRST: CHECK WHICH TABLES ACTUALLY EXIST
-- ============================================
-- This shows all your tables with row counts
-- Run this FIRST to see what you have

SELECT 
  schemaname,
  tablename,
  n_live_tup as estimated_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- ============================================
-- SECOND: FIND TEXT COLUMNS IN YOUR TABLES
-- ============================================
-- This shows which columns can be searched for each table
-- Replace 'YOUR_TABLE_NAME' with an actual table from the list above

SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND data_type IN ('text', 'character varying', 'varchar')
  AND table_name IN (
    SELECT tablename 
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
  )
ORDER BY table_name, column_name;

-- ============================================
-- THIRD: CHECK A SPECIFIC TABLE
-- ============================================
-- Uncomment and replace 'mantech_projects' with your table name:

-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'mantech_projects'
--   AND data_type IN ('text', 'character varying');

-- See sample data:
-- SELECT * FROM mantech_projects LIMIT 5;

-- ============================================
-- FOURTH: SEARCH FOR A TERM (EXAMPLE)
-- ============================================
-- This searches for "body armor" in a specific table
-- Uncomment and modify for your tables:

/*
SELECT COUNT(*) as matches
FROM mantech_projects
WHERE 
  LOWER(project_title) LIKE '%body%armor%' OR
  LOWER(description) LIKE '%body%armor%';
*/

-- ============================================
-- DIAGNOSTIC: WHY ARE SEARCHES RETURNING 0?
-- ============================================
-- Run these to diagnose the issue:

-- 1. Do you have ANY data at all?
SELECT COUNT(*) as total_tables_with_data
FROM pg_stat_user_tables
WHERE schemaname = 'public' AND n_live_tup > 0;

-- 2. Which tables have the most data?
SELECT tablename, n_live_tup as rows
FROM pg_stat_user_tables
WHERE schemaname = 'public' AND n_live_tup > 0
ORDER BY n_live_tup DESC
LIMIT 10;


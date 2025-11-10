-- Run this in your Supabase SQL Editor to see ALL your tables
-- This will show you every table with row counts

SELECT 
  schemaname,
  relname as tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND relname NOT LIKE '%_old%'  -- Exclude backup tables
  AND relname NOT LIKE '%_backup%'
  AND relname NOT LIKE '%scraper_log%'  -- Exclude log tables if you want
ORDER BY n_live_tup DESC;

-- To see JUST the table names grouped by category:
-- Run these separately to see what you have

-- xTech / Army Innovation Tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE '%army%' OR tablename LIKE '%xtech%'
ORDER BY tablename;

-- MANTECH Tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE '%mantech%'
ORDER BY tablename;

-- DOD Contract Tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND (tablename LIKE '%dod%' OR tablename LIKE '%military%' OR tablename LIKE '%defense%')
ORDER BY tablename;

-- GSA Tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE '%gsa%'
ORDER BY tablename;

-- Financial / Stock Tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND (tablename LIKE '%stock%' OR tablename LIKE '%congressional%')
ORDER BY tablename;

-- ALL Public Tables (complete list)
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;


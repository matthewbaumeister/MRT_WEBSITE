-- ============================================
-- CHECK IF SUPABASE TABLES HAVE DATA
-- ============================================
-- Run this in Supabase SQL Editor to see if your tables are empty or have data

-- Check xTech tables
SELECT 'army_innovation_programs' as table_name, COUNT(*) as row_count FROM army_innovation_programs
UNION ALL
SELECT 'army_innovation_winners_with_details', COUNT(*) FROM army_innovation_winners_with_details
UNION ALL  
SELECT 'xtech_db', COUNT(*) FROM xtech_db

-- Check MANTECH tables
UNION ALL
SELECT 'mantech_competitive_awards', COUNT(*) FROM mantech_competitive_awards
UNION ALL
SELECT 'mantech_projects', COUNT(*) FROM mantech_projects
UNION ALL
SELECT 'mantech_sbir_transitions', COUNT(*) FROM mantech_sbir_transitions
UNION ALL
SELECT 'mantech_top_companies', COUNT(*) FROM mantech_top_companies

-- Check DOD Contract News
UNION ALL
SELECT 'dod_contract_news', COUNT(*) FROM dod_contract_news

-- Check SBIR
UNION ALL
SELECT 'sbir_final', COUNT(*) FROM sbir_final

-- Check DSIP
UNION ALL
SELECT 'dsip', COUNT(*) FROM dsip

-- Check GSA
UNION ALL
SELECT 'gsa_schedule_holders', COUNT(*) FROM gsa_schedule_holders

ORDER BY row_count DESC;

-- ============================================
-- CHECK IF TABLES HAVE SEARCHABLE TEXT COLUMNS
-- ============================================

-- Check what columns exist in mantech_projects (example table)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'mantech_projects'
  AND data_type IN ('text', 'character varying');

-- Check what columns exist in army_innovation_winners_with_details
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'army_innovation_winners_with_details'
  AND data_type IN ('text', 'character varying');

-- ============================================
-- SAMPLE DATA FROM MANTECH (to see what's actually in there)
-- ============================================
SELECT *
FROM mantech_projects
LIMIT 5;

-- ============================================
-- CHECK IF "BODY ARMOR" EXISTS IN ANY TABLE
-- ============================================
SELECT 'mantech_projects' as table_name, COUNT(*) as matches
FROM mantech_projects
WHERE to_tsvector('english', COALESCE(project_title, '') || ' ' || COALESCE(description, '')) 
      @@ to_tsquery('english', 'body | armor')
UNION ALL
SELECT 'army_innovation_winners_with_details', COUNT(*)
FROM army_innovation_winners_with_details
WHERE to_tsvector('english', COALESCE(solution_title, '') || ' ' || COALESCE(problem_being_solved, '')) 
      @@ to_tsquery('english', 'body | armor')
UNION ALL
SELECT 'sbir_final', COUNT(*)
FROM sbir_final
WHERE to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(abstract, '')) 
      @@ to_tsquery('english', 'body | armor');


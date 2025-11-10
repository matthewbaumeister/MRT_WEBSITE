-- Run this to see ALL columns in ALL your tables
-- This shows you the structure of each table

SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'army_innovation_documents',
    'army_innovation_opportunities',
    'army_innovation_programs',
    'army_innovation_submissions',
    'congressional_stock_trades',
    'defense_contractors_tickers',
    'dod_contract_news',
    'dvids_military_news',
    'gsa_labor_categories',
    'gsa_price_lists',
    'gsa_schedule_holders',
    'gsa_sin_catalog',
    'mantech_company_mentions',
    'mantech_projects',
    'sbir_final'
  )
ORDER BY table_name, ordinal_position;

-- Or just see columns for ONE table at a time:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'dod_contract_news';


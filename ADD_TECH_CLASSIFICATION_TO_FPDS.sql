-- ============================================
-- Add Tech Classification Columns to FPDS
-- ============================================
-- Run this AFTER creating the base fpds_contracts table
-- Adds DOD tech classification fields without breaking existing structure

-- Add tech classification columns (compatible with existing fpds_contracts)
ALTER TABLE fpds_contracts
  ADD COLUMN IF NOT EXISTS is_tech_contract BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tech_confidence VARCHAR(10) DEFAULT NULL, -- 'high', 'medium', 'low'
  ADD COLUMN IF NOT EXISTS tech_categories TEXT DEFAULT NULL, -- Comma-separated: 'software_it, ai_data, cybersecurity'
  ADD COLUMN IF NOT EXISTS tech_classification_reasons TEXT DEFAULT NULL; -- Why it was classified as tech

-- Add comments
COMMENT ON COLUMN fpds_contracts.is_tech_contract IS 'Automatically classified as technology contract';
COMMENT ON COLUMN fpds_contracts.tech_confidence IS 'Classification confidence level: high, medium, low';
COMMENT ON COLUMN fpds_contracts.tech_categories IS 'Tech categories: software_it, ai_data, cybersecurity, cloud, etc.';
COMMENT ON COLUMN fpds_contracts.tech_classification_reasons IS 'Explanation of tech classification';

-- Add indexes for tech filtering
CREATE INDEX IF NOT EXISTS idx_fpds_is_tech ON fpds_contracts(is_tech_contract) WHERE is_tech_contract = TRUE;
CREATE INDEX IF NOT EXISTS idx_fpds_tech_confidence ON fpds_contracts(tech_confidence);
CREATE INDEX IF NOT EXISTS idx_fpds_tech_categories ON fpds_contracts(tech_categories);

-- Add SAM.gov opportunity link column (useful for tech contracts)
ALTER TABLE fpds_contracts
  ADD COLUMN IF NOT EXISTS sam_gov_opportunity_url TEXT DEFAULT NULL;

COMMENT ON COLUMN fpds_contracts.sam_gov_opportunity_url IS 'Link to SAM.gov opportunity (based on solicitation_id)';

CREATE INDEX IF NOT EXISTS idx_fpds_sam_url ON fpds_contracts(sam_gov_opportunity_url) WHERE sam_gov_opportunity_url IS NOT NULL;

-- ============================================
-- Views for Tech Contracts
-- ============================================

-- View: DOD Tech Contracts Only
CREATE OR REPLACE VIEW fpds_dod_tech_contracts AS
SELECT *
FROM fpds_contracts
WHERE is_tech_contract = TRUE
  AND (
    contracting_agency_name ILIKE '%Department of Defense%' OR
    contracting_agency_name ILIKE '%Army%' OR
    contracting_agency_name ILIKE '%Navy%' OR
    contracting_agency_name ILIKE '%Air Force%' OR
    contracting_agency_name ILIKE '%Marine%' OR
    contracting_agency_name ILIKE '%DARPA%' OR
    contracting_agency_name ILIKE '%Defense%'
  );

-- View: High-confidence Tech Contracts
CREATE OR REPLACE VIEW fpds_high_confidence_tech AS
SELECT *
FROM fpds_contracts
WHERE is_tech_contract = TRUE
  AND tech_confidence = 'high';

-- View: Tech Contracts by Category
CREATE OR REPLACE VIEW fpds_tech_by_category AS
SELECT 
  UNNEST(string_to_array(tech_categories, ', ')) as tech_category,
  COUNT(*) as contract_count,
  SUM(current_total_value_of_award) as total_value,
  COUNT(DISTINCT vendor_name) as unique_vendors,
  AVG(current_total_value_of_award) as avg_value
FROM fpds_contracts
WHERE is_tech_contract = TRUE
  AND tech_categories IS NOT NULL
GROUP BY tech_category
ORDER BY total_value DESC;

-- View: DOD Tech Vendors Summary
CREATE OR REPLACE VIEW fpds_dod_tech_vendors AS
SELECT 
  vendor_name,
  parent_company_name,
  COUNT(*) as contract_count,
  SUM(current_total_value_of_award) as total_value,
  AVG(current_total_value_of_award) as avg_value,
  array_agg(DISTINCT tech_categories) as tech_areas,
  array_agg(DISTINCT contracting_agency_name) as dod_agencies,
  MAX(date_signed) as latest_contract,
  small_business
FROM fpds_contracts
WHERE is_tech_contract = TRUE
  AND (
    contracting_agency_name ILIKE '%Department of Defense%' OR
    contracting_agency_name ILIKE '%Army%' OR
    contracting_agency_name ILIKE '%Navy%' OR
    contracting_agency_name ILIKE '%Air Force%' OR
    contracting_agency_name ILIKE '%DARPA%'
  )
GROUP BY vendor_name, parent_company_name, small_business
HAVING SUM(current_total_value_of_award) >= 100000 -- $100K+ total
ORDER BY total_value DESC;

-- Grant access to views
GRANT SELECT ON fpds_dod_tech_contracts TO authenticated;
GRANT SELECT ON fpds_high_confidence_tech TO authenticated;
GRANT SELECT ON fpds_tech_by_category TO authenticated;
GRANT SELECT ON fpds_dod_tech_vendors TO authenticated;

-- ============================================
-- Success Message
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Tech Classification Columns Added!';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'New Columns:';
  RAISE NOTICE '  - is_tech_contract (BOOLEAN)';
  RAISE NOTICE '  - tech_confidence (VARCHAR)';
  RAISE NOTICE '  - tech_categories (TEXT)';
  RAISE NOTICE '  - tech_classification_reasons (TEXT)';
  RAISE NOTICE '  - sam_gov_opportunity_url (TEXT)';
  RAISE NOTICE '';
  RAISE NOTICE 'New Views:';
  RAISE NOTICE '  - fpds_dod_tech_contracts';
  RAISE NOTICE '  - fpds_high_confidence_tech';
  RAISE NOTICE '  - fpds_tech_by_category';
  RAISE NOTICE '  - fpds_dod_tech_vendors';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready for DOD tech scraper!';
  RAISE NOTICE '============================================';
END $$;


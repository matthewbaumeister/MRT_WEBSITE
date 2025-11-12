-- ============================================
-- DOD Tech Contracts Database Schema
-- ============================================
-- Stores Department of Defense technology contracts
-- Pre-filtered for tech companies and substantial contracts

-- ============================================
-- Main Contracts Table
-- ============================================

CREATE TABLE IF NOT EXISTS dod_tech_contracts (
  id BIGSERIAL PRIMARY KEY,
  
  -- Contract Identification
  piid TEXT,
  transaction_number TEXT UNIQUE NOT NULL,
  referenced_idv_piid TEXT,
  
  -- Dates
  date_signed DATE,
  effective_date DATE,
  current_completion_date DATE,
  ultimate_completion_date DATE,
  period_of_performance_start DATE,
  period_of_performance_end DATE,
  
  -- Financial
  base_and_exercised_options_value NUMERIC(20, 2),
  base_and_all_options_value NUMERIC(20, 2),
  dollars_obligated NUMERIC(20, 2),
  current_total_value_of_award NUMERIC(20, 2),
  
  -- Vendor/Recipient Information
  vendor_name TEXT NOT NULL,
  vendor_duns TEXT,
  vendor_uei TEXT,
  vendor_cage_code TEXT,
  vendor_address TEXT,
  vendor_city TEXT,
  vendor_state VARCHAR(2),
  vendor_zip TEXT,
  vendor_country TEXT DEFAULT 'USA',
  parent_company_name TEXT,
  parent_duns TEXT,
  parent_uei TEXT,
  
  -- Socioeconomic Status
  small_business BOOLEAN DEFAULT FALSE,
  woman_owned_small_business BOOLEAN DEFAULT FALSE,
  veteran_owned_small_business BOOLEAN DEFAULT FALSE,
  service_disabled_veteran_owned BOOLEAN DEFAULT FALSE,
  hubzone_small_business BOOLEAN DEFAULT FALSE,
  eight_a_program_participant BOOLEAN DEFAULT FALSE,
  historically_black_college BOOLEAN DEFAULT FALSE,
  
  -- Classification
  naics_code TEXT,
  naics_description TEXT,
  psc_code TEXT,
  psc_description TEXT,
  contract_type TEXT,
  type_of_contract_pricing TEXT,
  
  -- DOD Agency Information
  contracting_agency_name TEXT,
  contracting_agency_id TEXT,
  funding_agency_name TEXT,
  funding_agency_id TEXT,
  contracting_office_name TEXT,
  contracting_office_id TEXT,
  
  -- Competition Information
  extent_competed TEXT,
  number_of_offers_received INTEGER,
  solicitation_id TEXT,
  type_of_set_aside TEXT,
  fair_opportunity_limited_sources TEXT,
  
  -- Work Details
  description_of_requirement TEXT,
  place_of_performance_city TEXT,
  place_of_performance_state VARCHAR(2),
  place_of_performance_country TEXT,
  place_of_performance_zip TEXT,
  place_of_performance_congressional_district TEXT,
  
  -- Tech Classification (NEW FIELDS)
  is_tech_contract BOOLEAN DEFAULT TRUE,
  tech_confidence VARCHAR(10), -- 'high', 'medium', 'low'
  tech_categories TEXT, -- Comma-separated list
  tech_classification_reasons TEXT,
  
  -- R&D Information
  is_research BOOLEAN DEFAULT FALSE,
  research_type TEXT,
  
  -- Metadata
  data_source TEXT DEFAULT 'usaspending.gov-dod-tech',
  fiscal_year INTEGER,
  calendar_year INTEGER,
  last_modified_date TIMESTAMP,
  sam_gov_opportunity_url TEXT,
  
  -- Timestamps
  last_scraped TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_vendor_name ON dod_tech_contracts(vendor_name);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_parent_company ON dod_tech_contracts(parent_company_name);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_naics ON dod_tech_contracts(naics_code);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_psc ON dod_tech_contracts(psc_code);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_agency ON dod_tech_contracts(contracting_agency_name);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_date_signed ON dod_tech_contracts(date_signed);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_fiscal_year ON dod_tech_contracts(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_award_value ON dod_tech_contracts(current_total_value_of_award);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_tech_categories ON dod_tech_contracts(tech_categories);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_vendor_state ON dod_tech_contracts(vendor_state);
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_small_business ON dod_tech_contracts(small_business);

-- Full-text search on descriptions
CREATE INDEX IF NOT EXISTS idx_dod_tech_contracts_description ON dod_tech_contracts USING gin(to_tsvector('english', description_of_requirement));

-- ============================================
-- Scraper Progress Tracking
-- ============================================

CREATE TABLE IF NOT EXISTS dod_tech_scraper_log (
  id SERIAL PRIMARY KEY,
  scrape_type TEXT NOT NULL, -- 'dod_tech_daily', 'dod_tech_historical', etc.
  date_range TEXT NOT NULL, -- e.g., '2025-01-01_to_2025-01-31'
  records_found INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_errors INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'failed'
  started_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dod_tech_scraper_log_type_range ON dod_tech_scraper_log(scrape_type, date_range);
CREATE INDEX IF NOT EXISTS idx_dod_tech_scraper_log_status ON dod_tech_scraper_log(status);

-- ============================================
-- Page-Level Progress Tracking
-- ============================================

CREATE TABLE IF NOT EXISTS dod_tech_page_progress (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  page_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  contracts_found INTEGER DEFAULT 0,
  contracts_inserted INTEGER DEFAULT 0,
  contracts_failed INTEGER DEFAULT 0,
  error_message TEXT,
  completed_at TIMESTAMP,
  UNIQUE(date, page_number)
);

CREATE INDEX IF NOT EXISTS idx_dod_tech_page_progress_date ON dod_tech_page_progress(date);
CREATE INDEX IF NOT EXISTS idx_dod_tech_page_progress_status ON dod_tech_page_progress(status);

-- ============================================
-- Failed Contracts Logging (for Retry)
-- ============================================

CREATE TABLE IF NOT EXISTS dod_tech_failed_contracts (
  id SERIAL PRIMARY KEY,
  contract_id TEXT NOT NULL,
  error_message TEXT,
  error_type TEXT, -- 'details_fetch_failed', 'enrichment_error', etc.
  date_range TEXT,
  page_number INTEGER,
  attempt_count INTEGER DEFAULT 1,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dod_tech_failed_contracts_contract_id ON dod_tech_failed_contracts(contract_id);
CREATE INDEX IF NOT EXISTS idx_dod_tech_failed_contracts_resolved ON dod_tech_failed_contracts(resolved);
CREATE INDEX IF NOT EXISTS idx_dod_tech_failed_contracts_date_range ON dod_tech_failed_contracts(date_range);

-- ============================================
-- Auto-update timestamp trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_dod_tech_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dod_tech_contracts_updated_at
  BEFORE UPDATE ON dod_tech_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_dod_tech_contracts_updated_at();

-- ============================================
-- Views for Common Queries
-- ============================================

-- High-value tech contracts
CREATE OR REPLACE VIEW dod_tech_high_value_contracts AS
SELECT 
  id,
  piid,
  vendor_name,
  parent_company_name,
  current_total_value_of_award,
  date_signed,
  contracting_agency_name,
  naics_description,
  tech_categories,
  description_of_requirement
FROM dod_tech_contracts
WHERE current_total_value_of_award >= 1000000 -- $1M+
ORDER BY current_total_value_of_award DESC;

-- Small business tech contracts
CREATE OR REPLACE VIEW dod_tech_small_business_contracts AS
SELECT 
  id,
  piid,
  vendor_name,
  current_total_value_of_award,
  date_signed,
  contracting_agency_name,
  tech_categories,
  small_business,
  woman_owned_small_business,
  veteran_owned_small_business,
  eight_a_program_participant
FROM dod_tech_contracts
WHERE small_business = TRUE
ORDER BY date_signed DESC;

-- R&D contracts
CREATE OR REPLACE VIEW dod_tech_rd_contracts AS
SELECT 
  id,
  piid,
  vendor_name,
  parent_company_name,
  current_total_value_of_award,
  date_signed,
  contracting_agency_name,
  research_type,
  naics_description,
  description_of_requirement
FROM dod_tech_contracts
WHERE is_research = TRUE
ORDER BY date_signed DESC;

-- Contracts by fiscal year
CREATE OR REPLACE VIEW dod_tech_contracts_by_fiscal_year AS
SELECT 
  fiscal_year,
  COUNT(*) as contract_count,
  SUM(current_total_value_of_award) as total_value,
  AVG(current_total_value_of_award) as avg_value,
  COUNT(DISTINCT vendor_name) as unique_vendors
FROM dod_tech_contracts
WHERE fiscal_year IS NOT NULL
GROUP BY fiscal_year
ORDER BY fiscal_year DESC;

-- Top vendors
CREATE OR REPLACE VIEW dod_tech_top_vendors AS
SELECT 
  vendor_name,
  parent_company_name,
  COUNT(*) as contract_count,
  SUM(current_total_value_of_award) as total_value,
  AVG(current_total_value_of_award) as avg_value,
  array_agg(DISTINCT tech_categories) as tech_areas,
  MAX(date_signed) as latest_contract
FROM dod_tech_contracts
GROUP BY vendor_name, parent_company_name
HAVING SUM(current_total_value_of_award) >= 1000000 -- $1M+ total
ORDER BY total_value DESC;

-- ============================================
-- RLS (Row Level Security) - Optional
-- ============================================

-- Enable RLS if needed for multi-tenant access
-- ALTER TABLE dod_tech_contracts ENABLE ROW LEVEL SECURITY;

-- Example policy for authenticated users
-- CREATE POLICY "Allow read access to authenticated users" ON dod_tech_contracts
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- ============================================
-- Grant Permissions
-- ============================================

-- Grant access to service role (for scraper)
GRANT ALL ON dod_tech_contracts TO service_role;
GRANT ALL ON dod_tech_scraper_log TO service_role;
GRANT ALL ON dod_tech_page_progress TO service_role;
GRANT ALL ON dod_tech_failed_contracts TO service_role;

-- Grant read access to authenticated users (for web app)
GRANT SELECT ON dod_tech_contracts TO authenticated;
GRANT SELECT ON dod_tech_high_value_contracts TO authenticated;
GRANT SELECT ON dod_tech_small_business_contracts TO authenticated;
GRANT SELECT ON dod_tech_rd_contracts TO authenticated;
GRANT SELECT ON dod_tech_contracts_by_fiscal_year TO authenticated;
GRANT SELECT ON dod_tech_top_vendors TO authenticated;

-- ============================================
-- Helpful Queries
-- ============================================

-- Total contracts and value by tech category
-- SELECT 
--   UNNEST(string_to_array(tech_categories, ', ')) as category,
--   COUNT(*) as contract_count,
--   SUM(current_total_value_of_award) as total_value
-- FROM dod_tech_contracts
-- WHERE tech_categories IS NOT NULL
-- GROUP BY category
-- ORDER BY total_value DESC;

-- Recent high-confidence tech contracts
-- SELECT *
-- FROM dod_tech_contracts
-- WHERE tech_confidence = 'high'
--   AND date_signed >= CURRENT_DATE - INTERVAL '30 days'
-- ORDER BY current_total_value_of_award DESC
-- LIMIT 100;

-- Failed contracts that need retry
-- SELECT *
-- FROM dod_tech_failed_contracts
-- WHERE resolved = FALSE
--   AND attempt_count < 5
-- ORDER BY created_at DESC;


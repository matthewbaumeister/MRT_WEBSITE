// ============================================
// DOD Tech Contract Scraper
// ============================================
// Specialized scraper for Department of Defense technology contracts
// Pre-filtered for tech companies using NAICS codes and keywords

import { createClient } from '@supabase/supabase-js';
import { validateContractBatch } from './fpds-data-cleaner';
import { ALL_TECH_NAICS_CODES, classifyTechContract } from './tech-naics-classifier';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const USA_SPENDING_API = 'https://api.usaspending.gov/api/v2';
const CONTRACT_TYPES = ['A', 'B', 'C', 'D']; // All contract types

// Rate limiting - be conservative
const SEARCH_DELAY_MS = 500; // 2 searches/second
const DETAILS_DELAY_MS = 600; // ~1.7 details/second

// ============================================
// DOD Agency Codes
// ============================================

const DOD_AGENCY_CODES = ['97']; // Department of Defense top-tier code

// ============================================
// API Search Functions with DOD + Tech Filtering
// ============================================

export async function searchDODTechContracts(options: {
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
  minAmount?: number;
}) {
  const { startDate, endDate, page = 1, limit = 100, minAmount = 100000 } = options;

  const body = {
    filters: {
      // 1. Time period
      time_period: [{
        start_date: startDate,
        end_date: endDate
      }],
      
      // 2. Contract types
      award_type_codes: CONTRACT_TYPES,
      
      // 3. DOD agencies only
      agencies: [{
        type: 'awarding',
        tier: 'toptier',
        name: 'Department of Defense'
      }],
      
      // 4. Tech NAICS codes (pre-filter at API level)
      naics_codes: ALL_TECH_NAICS_CODES,
      
      // 5. Minimum award amount
      award_amounts: [{
        lower_bound: minAmount
      }]
    },
    fields: [
      'Award ID',
      'Recipient Name',
      'Start Date',
      'End Date',
      'Award Amount',
      'generated_internal_id',
      'Awarding Agency',
      'Awarding Sub Agency',
      'NAICS Code',
      'NAICS Description',
      'PSC Code',
      'Description'
    ],
    limit,
    page
  };

  console.log(`[DOD Tech] Searching contracts: ${startDate} to ${endDate}, page ${page}`);

  const response = await fetch(`${USA_SPENDING_API}/search/spending_by_award/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    results: data.results || [],
    hasMore: data.page_metadata?.hasNext || false,
    total: data.page_metadata?.total || 0,
    count: data.results?.length || 0
  };
}

// ============================================
// Get Full Contract Details
// ============================================

export async function getDODContractFullDetails(generatedId: string): Promise<any | null> {
  try {
    const response = await fetch(`${USA_SPENDING_API}/awards/${generatedId}/`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[DOD Tech] Contract ${generatedId} not found (404)`);
        return null;
      }
      throw new Error(`Details API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[DOD Tech] Error fetching details for ${generatedId}:`, error);
    return null;
  }
}

// ============================================
// Normalize DOD Contract Data
// ============================================

export function normalizeDODContract(fullData: any): any {
  // Helper to safely extract nested data
  const get = (obj: any, path: string, defaultVal: any = null) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultVal;
  };

  // Parse business types
  const businessTypes = get(fullData, 'recipient.business_types_description', '') || '';
  
  // Classify as tech contract
  const techClassification = classifyTechContract({
    naics_code: get(fullData, 'latest_transaction_contract_data.naics'),
    psc_code: get(fullData, 'latest_transaction_contract_data.product_or_service_code'),
    description_of_requirement: fullData.description || get(fullData, 'latest_transaction_contract_data.award_description'),
    vendor_name: get(fullData, 'recipient.recipient_name'),
    contracting_agency_name: get(fullData, 'awarding_agency.toptier_agency.name'),
    funding_agency_name: get(fullData, 'funding_agency.toptier_agency.name')
  });
  
  return {
    // Contract Identification
    piid: fullData.piid || null,
    transaction_number: fullData.generated_unique_award_id || `${fullData.piid}-${Date.now()}`,
    referenced_idv_piid: get(fullData, 'latest_transaction_contract_data.referenced_idv_agency_iden'),
    
    // Dates
    date_signed: fullData.date_signed || null,
    effective_date: get(fullData, 'period_of_performance.start_date'),
    current_completion_date: get(fullData, 'period_of_performance.end_date'),
    ultimate_completion_date: get(fullData, 'period_of_performance.potential_end_date'),
    period_of_performance_start: get(fullData, 'period_of_performance.start_date'),
    period_of_performance_end: get(fullData, 'period_of_performance.end_date'),
    
    // Financial
    base_and_exercised_options_value: fullData.base_and_exercised_options_value || null,
    base_and_all_options_value: fullData.base_and_all_options_value || null,
    dollars_obligated: fullData.total_obligation || null,
    current_total_value_of_award: fullData.total_obligation || fullData.base_and_exercised_options_value || null,
    
    // Vendor (Recipient)
    vendor_name: get(fullData, 'recipient.recipient_name') || 'Unknown',
    vendor_duns: get(fullData, 'recipient.recipient_duns'),
    vendor_uei: get(fullData, 'recipient.recipient_uei'),
    vendor_cage_code: get(fullData, 'latest_transaction_contract_data.cage_code'),
    vendor_address: get(fullData, 'recipient.location.address_line1'),
    vendor_city: get(fullData, 'recipient.location.city_name'),
    vendor_state: get(fullData, 'recipient.location.state_code'),
    vendor_zip: get(fullData, 'recipient.location.zip5'),
    vendor_country: get(fullData, 'recipient.location.country_name', 'USA'),
    parent_company_name: get(fullData, 'recipient.parent_recipient_name'),
    parent_duns: get(fullData, 'recipient.parent_duns'),
    parent_uei: get(fullData, 'recipient.parent_uei'),
    
    // Socioeconomic Flags
    small_business: businessTypes.toLowerCase().includes('small business'),
    woman_owned_small_business: businessTypes.toLowerCase().includes('woman'),
    veteran_owned_small_business: businessTypes.toLowerCase().includes('veteran'),
    service_disabled_veteran_owned: businessTypes.toLowerCase().includes('service-disabled veteran'),
    hubzone_small_business: businessTypes.toLowerCase().includes('hubzone'),
    eight_a_program_participant: businessTypes.toLowerCase().includes('8(a)'),
    historically_black_college: businessTypes.toLowerCase().includes('historically black'),
    
    // Classification
    naics_code: get(fullData, 'latest_transaction_contract_data.naics'),
    naics_description: get(fullData, 'latest_transaction_contract_data.naics_description'),
    psc_code: get(fullData, 'latest_transaction_contract_data.product_or_service_code'),
    psc_description: get(fullData, 'latest_transaction_contract_data.product_or_service_code_description'),
    contract_type: get(fullData, 'latest_transaction_contract_data.contract_award_type'),
    type_of_contract_pricing: get(fullData, 'latest_transaction_contract_data.type_of_contract_pricing'),
    
    // Agency (DOD specific)
    contracting_agency_name: get(fullData, 'awarding_agency.toptier_agency.name'),
    contracting_agency_id: get(fullData, 'awarding_agency.toptier_agency.abbreviation'),
    funding_agency_name: get(fullData, 'funding_agency.toptier_agency.name'),
    funding_agency_id: get(fullData, 'funding_agency.toptier_agency.abbreviation'),
    contracting_office_name: get(fullData, 'awarding_agency.subtier_agency.name'),
    contracting_office_id: get(fullData, 'awarding_agency.subtier_agency.abbreviation'),
    
    // Competition
    extent_competed: get(fullData, 'latest_transaction_contract_data.extent_competed'),
    number_of_offers_received: get(fullData, 'latest_transaction_contract_data.number_of_offers_received'),
    solicitation_id: get(fullData, 'latest_transaction_contract_data.solicitation_identifier'),
    type_of_set_aside: get(fullData, 'latest_transaction_contract_data.type_of_set_aside'),
    fair_opportunity_limited_sources: get(fullData, 'latest_transaction_contract_data.fair_opportunity_limited_sources'),
    
    // Work Details
    description_of_requirement: fullData.description || get(fullData, 'latest_transaction_contract_data.award_description'),
    place_of_performance_city: get(fullData, 'place_of_performance.city_name'),
    place_of_performance_state: get(fullData, 'place_of_performance.state_code'),
    place_of_performance_country: get(fullData, 'place_of_performance.country_name'),
    place_of_performance_zip: get(fullData, 'place_of_performance.zip5'),
    place_of_performance_congressional_district: get(fullData, 'place_of_performance.congressional_code'),
    
    // Tech Classification (NEW)
    is_tech_contract: techClassification.isTech,
    tech_confidence: techClassification.confidence,
    tech_categories: techClassification.categories.join(', ') || null,
    tech_classification_reasons: techClassification.reasons.join('; ') || null,
    
    // R&D Specific
    is_research: get(fullData, 'latest_transaction_contract_data.research') === 'RES' || 
                 get(fullData, 'latest_transaction_contract_data.research') === 'R&D',
    research_type: get(fullData, 'latest_transaction_contract_data.research'),
    
    // Metadata
    data_source: 'usaspending.gov-dod-tech',
    fiscal_year: (() => {
      const dateSigned = fullData.date_signed || get(fullData, 'period_of_performance.start_date');
      if (!dateSigned) return null;
      const date = new Date(dateSigned);
      const year = date.getFullYear();
      const month = date.getMonth();
      return month >= 9 ? year + 1 : year;
    })(),
    calendar_year: (() => {
      const startDate = fullData.date_signed || get(fullData, 'period_of_performance.start_date');
      return startDate ? new Date(startDate).getFullYear() : null;
    })(),
    last_modified_date: get(fullData, 'period_of_performance.last_modified_date'),
    
    // SAM.gov link
    sam_gov_opportunity_url: (() => {
      const solicitationId = get(fullData, 'latest_transaction_contract_data.solicitation_identifier');
      return solicitationId ? `https://sam.gov/search/?index=opp&q=${solicitationId}` : null;
    })(),
    
    last_scraped: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// ============================================
// Database Operations
// ============================================

export async function batchInsertDODContracts(contracts: any[], batchSize: number = 250) {
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < contracts.length; i += batchSize) {
    const batch = contracts.slice(i, i + batchSize);
    
    try {
      // Check which contracts already exist
      const transactionNumbers = batch.map((c: any) => c.transaction_number);
      const { data: existing, error: checkError } = await supabase
        .from('fpds_contracts')
        .select('transaction_number')
        .in('transaction_number', transactionNumbers);
      
      const existingIds = new Set(existing?.map((e: any) => e.transaction_number) || []);
      const newCount = batch.filter((c: any) => !existingIds.has(c.transaction_number)).length;
      const updateCount = batch.length - newCount;

      // Upsert
      const { data, error } = await supabase
        .from('fpds_contracts')
        .upsert(batch, {
          onConflict: 'transaction_number',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error(`[DOD Tech] Batch error:`, error.message);
        errors += batch.length;
      } else {
        inserted += newCount;
        updated += updateCount;
      }
    } catch (error) {
      console.error(`[DOD Tech] Batch exception:`, error);
      errors += batch.length;
    }
  }

  return { inserted, updated, errors };
}

// ============================================
// Progress Tracking
// ============================================

async function getLastCompletedPage(startDate: string, endDate: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('fpds_scraper_log')
      .select('records_found')
      .eq('scrape_type', 'dod_tech_daily')
      .eq('date_range', `${startDate}_to_${endDate}`)
      .eq('status', 'running')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.log('[DOD Tech] No previous progress found, starting from page 1');
      return 1;
    }

    const lastPage = Math.floor(data.records_found / 100);
    const resumePage = Math.max(1, lastPage - 1);
    
    console.log(`[DOD Tech] Resuming from page ${resumePage} (last completed: ${lastPage})`);
    return resumePage;
  } catch (err) {
    console.log('[DOD Tech] Error checking progress, starting from page 1:', err);
    return 1;
  }
}

async function saveProgress(
  startDate: string,
  endDate: string,
  currentPage: number,
  totalProcessed: number,
  totalInserted: number,
  totalErrors: number
): Promise<void> {
  try {
    const dateRangeKey = `${startDate}_to_${endDate}`;
    
    const { data: existing } = await supabase
      .from('fpds_scraper_log')
      .select('id, started_at')
      .eq('scrape_type', 'dod_tech_daily')
      .eq('date_range', dateRangeKey)
      .single();
    
    if (existing) {
      const { error } = await supabase
        .from('fpds_scraper_log')
        .update({
          records_found: totalProcessed,
          records_inserted: totalInserted,
          records_errors: totalErrors,
          status: 'running'
        })
        .eq('id', existing.id);
      
      if (!error) {
        console.log(`[DOD Tech] Progress saved: Page ${currentPage}, ${totalInserted} contracts`);
      }
    } else {
      const { error } = await supabase
        .from('fpds_scraper_log')
        .insert({
          scrape_type: 'dod_tech_daily',
          date_range: dateRangeKey,
          records_found: totalProcessed,
          records_inserted: totalInserted,
          records_errors: totalErrors,
          status: 'running'
        });
      
      if (!error) {
        console.log(`[DOD Tech] Progress log created: Page ${currentPage}, ${totalInserted} contracts`);
      }
    }
  } catch (err) {
    console.log('[DOD Tech] Error saving progress:', err);
  }
}

// ============================================
// Failed Contract Logging
// ============================================

async function logFailedContract(
  contractId: string,
  errorMessage: string,
  errorType: string,
  dateRange: string,
  pageNumber: number
) {
  try {
    await supabase
      .from('dod_tech_failed_contracts')
      .insert({
        contract_id: contractId,
        error_message: errorMessage.substring(0, 500),
        error_type: errorType,
        date_range: dateRange,
        page_number: pageNumber,
        attempt_count: 1
      });
  } catch (err) {
    // Silent fail
  }
}

// ============================================
// Main Scraping Function
// ============================================

export async function scrapeDODTechContracts(
  startDate: string,
  endDate: string,
  options: {
    minAmount?: number;
    maxContracts?: number;
    resumeFrom?: number;
  } = {}
) {
  const { minAmount = 100000, maxContracts = 10000 } = options;
  const startTime = new Date();

  console.log(`[DOD Tech] Starting DOD tech contracts scrape: ${startDate} to ${endDate}`);
  console.log(`[DOD Tech] Min amount: $${minAmount.toLocaleString()}`);
  console.log(`[DOD Tech] Max contracts: ${maxContracts}`);

  let page = await getLastCompletedPage(startDate, endDate);
  let totalProcessed = 0;
  let totalInserted = 0;
  let totalErrors = 0;
  
  try {
    while (totalProcessed < maxContracts) {
      // Step 1: Search for contracts
      const searchResult = await searchDODTechContracts({
        startDate,
        endDate,
        page,
        limit: 100,
        minAmount
      });

      if (searchResult.results.length === 0) {
        console.log(`[DOD Tech] No more contracts found`);
        break;
      }

      console.log(`\n[DOD Tech] Page ${page}: Found ${searchResult.results.length} contracts`);
      console.log(`[DOD Tech] Fetching full details...`);

      // Step 2: Fetch full details for each contract
      const enrichedContracts: any[] = [];
      
      for (let i = 0; i < searchResult.results.length; i++) {
        const basicContract = searchResult.results[i];
        
        if ((i + 1) % 10 === 0) {
          console.log(`[DOD Tech]   Fetched ${i + 1}/${searchResult.results.length} details...`);
        }

        try {
          const fullDetails = await getDODContractFullDetails(basicContract.generated_internal_id);
          
          if (fullDetails) {
            const normalized = normalizeDODContract(fullDetails);
            enrichedContracts.push(normalized);
          } else {
            totalErrors++;
            await logFailedContract(
              basicContract.generated_internal_id,
              'Failed to fetch contract details',
              'details_fetch_failed',
              `${startDate} to ${endDate}`,
              page
            );
          }

          await sleep(DETAILS_DELAY_MS);
          
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.error(`[DOD Tech] Error enriching contract:`, error);
          totalErrors++;
          
          await logFailedContract(
            basicContract.generated_internal_id,
            errorMsg,
            'enrichment_error',
            `${startDate} to ${endDate}`,
            page
          );
        }
      }

      // Step 3: Validate and insert
      if (enrichedContracts.length > 0) {
        console.log(`[DOD Tech] Validating ${enrichedContracts.length} contracts...`);
        const { cleaned, stats } = validateContractBatch(enrichedContracts);
        
        console.log(`[DOD Tech] Data Quality: ${stats.averageScore.toFixed(1)}/100 avg score`);
        console.log(`[DOD Tech]   High: ${stats.highQuality}, Medium: ${stats.mediumQuality}, Low: ${stats.lowQuality}`);
        
        console.log(`[DOD Tech] Inserting ${cleaned.length} contracts...`);
        const result = await batchInsertDODContracts(cleaned);
        totalInserted += result.inserted;
        totalErrors += result.errors;
      }

      totalProcessed += searchResult.results.length;
      
      console.log(`[DOD Tech] Progress: ${totalProcessed}/${maxContracts} contracts processed`);
      console.log(`[DOD Tech] Inserted: ${totalInserted}, Errors: ${totalErrors}`);

      await saveProgress(startDate, endDate, page, totalProcessed, totalInserted, totalErrors);

      if (!searchResult.hasMore || totalProcessed >= maxContracts) {
        break;
      }

      page++;
      await sleep(SEARCH_DELAY_MS);
    }

    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Mark complete
    await supabase
      .from('fpds_scraper_log')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('scrape_type', 'dod_tech_daily')
      .eq('date_range', `${startDate}_to_${endDate}`);

    console.log(`\n[DOD Tech] ========================================`);
    console.log(`[DOD Tech] Scrape Complete!`);
    console.log(`[DOD Tech] ========================================`);
    console.log(`[DOD Tech] Processed: ${totalProcessed} contracts`);
    console.log(`[DOD Tech] Inserted: ${totalInserted}`);
    console.log(`[DOD Tech] Errors: ${totalErrors}`);
    console.log(`[DOD Tech] Duration: ${Math.floor(durationSeconds / 60)} minutes`);

    return { 
      totalProcessed, 
      totalInserted, 
      totalErrors
    };
    
  } catch (error) {
    console.error('[DOD Tech] Fatal error:', error);
    throw error;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


import { createClient } from "@supabase/supabase-js";

// Lazy initialization of Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and key must be set in environment variables");
  }

  return createClient(supabaseUrl, supabaseKey);
}

// All MATRIX-related tables to query
const MATRIX_TABLES: Record<string, string[]> = {
  // Army Innovation / xTech
  xtech: [
    'army_innovation_opportunities',
    'army_innovation_programs',
    'army_innovation_submissions',
    'army_innovation_finalists_with_details',
    'army_innovation_winners_with_details',
    'army_innovation_phase_progress',
    'army_innovation_competition_stats',
    'army_innovation_prize_summary',
    'army_innovation_documents',
    'army_innovation_upcoming_deadlines',
  ],
  // MANTECH
  mantech: [
    'mantech_projects',
    'mantech_by_component',
    'mantech_company_mentions',
    'mantech_top_companies',
    'mantech_sbir_transitions',
    'mantech_transition_pipeline',
    'mantech_recent_projects',
  ],
  // DOD Contract News & Information
  dod_contracts: [
    'dod_contract_news',
    'dod_news_scraper_log',
    'mil_recent_news',
    'military_news_articles',
    'military_news_scraper_log',
  ],
  // GSA Schedule & Contractors
  gsa: [
    'active_gsa_schedule_holders',
    'gsa_contractors_with_pricing',
    'gsa_gwac_scraper_log',
    'gsa_labor_categories',
    'gsa_price_lists',
    'gsa_pricing_scraper_log',
    'gsa_schedule_holders',
    'gsa_sin_catalog',
    'small_business_gsa_holders',
  ],
  // Stock Trades & Defense Contractors
  financial: [
    'congressional_stock_trades',
    'defense_contractors_tickers',
    'defense_stock_trades',
  ],
  // Small Business specific
  small_business: [
    'small_business_gsa_holders',
    // 'sba_awards',  // Add when government API is back online
    // 'dsip_awards', // Add when available
    // 'fpds_small_business', // Add when imported
  ],
};

/**
 * Column names to search for each table type
 * Maps table names to their searchable text columns
 */
const TABLE_SEARCH_COLUMNS: Record<string, string[]> = {
  // Army Innovation / xTech tables
  army_innovation_documents: ['title', 'description', 'document_type', 'content'],
  army_innovation_opportunities: ['title', 'description', 'opportunity_name'],
  army_innovation_programs: ['program_name', 'description'],
  army_innovation_submissions: ['company_name', 'technology_description', 'challenge_title', 'solution_title'],
  
  // MANTECH tables
  mantech_projects: ['project_title', 'description', 'technology_area', 'company'],
  mantech_company_mentions: ['company_name', 'project_title', 'context'],
  
  // DOD Contract News
  dod_contract_news: ['title', 'description', 'contractor_name', 'content'],
  dvids_military_news: ['title', 'description', 'content'],
  
  // GSA tables
  gsa_schedule_holders: ['company_name', 'contractor_name', 'business_type'],
  gsa_labor_categories: ['category_name', 'description'],
  gsa_sin_catalog: ['sin_number', 'description', 'title'],
  gsa_price_lists: ['vendor_name', 'product_description'],
  
  // Financial tables
  congressional_stock_trades: ['ticker', 'company_name', 'member_name'],
  defense_contractors_tickers: ['company_name', 'ticker', 'sector'],
  
  // SBIR
  sbir_final: ['company', 'project_title', 'abstract', 'award_title', 'agency'],
  
  // Default columns to try if table not in map
  _default: ['title', 'description', 'name', 'company', 'company_name', 'content'],
};

/**
 * Search relevant Supabase tables based on topic and settings
 * Intelligently searches across appropriate columns based on table structure
 */
export async function searchSupabaseTables(
  topic: string,
  options: {
    smallBusinessFocus?: boolean;
    sectionId?: string;
  } = {}
): Promise<{ results: any[]; sources: string[] }> {
  const supabase = getSupabaseClient();
  const results: any[] = [];
  const sources: string[] = [];

  try {
    // Determine which tables to search based on settings
    let tablesToSearch: string[] = [];
    
    if (options.smallBusinessFocus) {
      tablesToSearch = [
        ...MATRIX_TABLES.xtech,
        ...MATRIX_TABLES.mantech,
        ...MATRIX_TABLES.small_business,
        'sbir_final', // Always include SBIR for small business focus
      ];
    } else {
      // Search all relevant tables
      tablesToSearch = [
        ...MATRIX_TABLES.xtech,
        ...MATRIX_TABLES.mantech,
        ...MATRIX_TABLES.dod_contracts,
        ...MATRIX_TABLES.gsa,
        ...MATRIX_TABLES.financial,
        'sbir_final',
      ];
    }

    // Remove duplicates
    tablesToSearch = [...new Set(tablesToSearch)];

    // Search each table for relevant data
    for (const tableName of tablesToSearch) {
      try {
        // Get columns to search for this specific table
        const columnsToSearch = TABLE_SEARCH_COLUMNS[tableName] || TABLE_SEARCH_COLUMNS._default;
        
        // Build OR query: column1 ILIKE '%topic%' OR column2 ILIKE '%topic%' ...
        const orConditions = columnsToSearch.map(col => `${col}.ilike.%${topic}%`).join(',');
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .or(orConditions)
          .limit(10); // Limit per table to keep context manageable

        if (error) {
          console.log(`Error searching ${tableName}:`, error.message);
        } else if (data && data.length > 0) {
          results.push({
            table: tableName,
            count: data.length,
            data: data,
          });
          sources.push(tableName);
          console.log(`Found ${data.length} results in ${tableName}`);
        }
      } catch (tableError: any) {
        // Table might not exist or have different columns - skip gracefully
        console.log(`Skipping table ${tableName}:`, tableError.message);
      }
    }

    return { results, sources };
  } catch (error) {
    console.error("Error searching Supabase tables:", error);
    return { results: [], sources: [] };
  }
}

/**
 * Get funding data for a topic
 */
export async function getFundingData(topic: string): Promise<any[]> {
  const supabase = getSupabaseClient();
  const fundingData: any[] = [];

  try {
    // Query xTech prize data
    const { data: xtechData } = await supabase
      .from('army_innovation_prize_summary')
      .select('*')
      .ilike('program_name', `%${topic}%`)
      .limit(20);

    if (xtechData) fundingData.push(...xtechData);

    // Query MANTECH transitions
    const { data: mantechData } = await supabase
      .from('mantech_sbir_transitions')
      .select('*')
      .ilike('project_title', `%${topic}%`)
      .limit(20);

    if (mantechData) fundingData.push(...mantechData);

    return fundingData;
  } catch (error) {
    console.error("Error getting funding data:", error);
    return [];
  }
}

/**
 * Get competition/company data for a topic
 */
export async function getCompetitionData(topic: string): Promise<any[]> {
  const supabase = getSupabaseClient();
  const competitionData: any[] = [];

  try {
    // Query MANTECH companies
    const { data: companyData } = await supabase
      .from('mantech_top_companies')
      .select('*')
      .limit(50);

    if (companyData) competitionData.push(...companyData);

    // Query xTech winners
    const { data: winnerData } = await supabase
      .from('army_innovation_winners_with_details')
      .select('*')
      .ilike('solution_title', `%${topic}%`)
      .limit(20);

    if (winnerData) competitionData.push(...winnerData);

    return competitionData;
  } catch (error) {
    console.error("Error getting competition data:", error);
    return [];
  }
}

/**
 * Format Supabase results for inclusion in LLM context
 */
export function formatSupabaseContext(results: any[]): string {
  if (results.length === 0) {
    return "No relevant data found in internal databases.";
  }

  let context = "Relevant data from internal databases:\n\n";

  for (const result of results) {
    context += `From ${result.table} (${result.count} results):\n`;
    
    // Format first few results as examples
    const examples = result.data.slice(0, 3);
    for (const item of examples) {
      context += `- ${JSON.stringify(item).substring(0, 200)}...\n`;
    }
    context += "\n";
  }

  return context;
}

/**
 * Get all available table names (for documentation/debugging)
 */
export function getAllTableNames(): string[] {
  return [
    ...MATRIX_TABLES.xtech,
    ...MATRIX_TABLES.mantech,
    ...MATRIX_TABLES.dod_contracts,
    ...MATRIX_TABLES.small_business,
  ];
}

/**
 * Add a new table to the search list
 * Call this when you add DOD contract tables
 */
export function addTableToSearch(category: string, tableName: string) {
  if (!MATRIX_TABLES[category]) {
    MATRIX_TABLES[category] = [];
  }
  if (!MATRIX_TABLES[category].includes(tableName)) {
    MATRIX_TABLES[category].push(tableName);
  }
}


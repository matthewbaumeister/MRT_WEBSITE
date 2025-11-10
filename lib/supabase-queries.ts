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

// Cache for table column mappings (to avoid querying schema repeatedly)
let tableColumnsCache: Record<string, string[]> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Dynamically discover searchable text columns for a table
 * Uses smart detection by querying a sample row
 */
async function getSearchableColumns(tableName: string): Promise<string[]> {
  const supabase = getSupabaseClient();
  
  try {
    // Primary method: Get one row to see the column structure
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`Could not query ${tableName}:`, error.message);
      return ['title', 'description', 'name', 'company', 'content'];
    }

    if (!data || data.length === 0) {
      // Table is empty, try to get schema via RPC (optional enhancement)
      return await getSearchableColumnsViaRPC(tableName);
    }

    // Get all column names from the first row
    const allColumns = Object.keys(data[0]);
    
    // Filter to likely text columns (heuristic approach)
    const textColumns = allColumns.filter(col => {
      const lowerCol = col.toLowerCase();
      const value = data[0][col];
      const isString = typeof value === 'string';
      
      // Prioritize columns with searchable names and string values
      return isString && (
        lowerCol.includes('title') ||
        lowerCol.includes('name') ||
        lowerCol.includes('description') ||
        lowerCol.includes('content') ||
        lowerCol.includes('text') ||
        lowerCol.includes('company') ||
        lowerCol.includes('contractor') ||
        lowerCol.includes('abstract') ||
        lowerCol.includes('summary') ||
        lowerCol.includes('technology') ||
        lowerCol.includes('category') ||
        lowerCol.includes('project') ||
        lowerCol.includes('program') ||
        lowerCol.includes('solution') ||
        lowerCol.includes('challenge')
      );
    });

    // If no text columns found by name, use all string columns
    if (textColumns.length === 0) {
      const stringColumns = allColumns.filter(col => typeof data[0][col] === 'string');
      return stringColumns.length > 0 ? stringColumns.slice(0, 5) : ['title', 'description', 'name'];
    }

    return textColumns;
  } catch (error) {
    console.error(`Error getting columns for ${tableName}:`, error);
    return ['title', 'description', 'name', 'company', 'content'];
  }
}

/**
 * Optional: Try to get column info via RPC function (if it exists)
 * This is a fallback if table is empty
 */
async function getSearchableColumnsViaRPC(tableName: string): Promise<string[]> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name_param: tableName
    });

    if (error || !data || data.length === 0) {
      return ['title', 'description', 'name'];
    }

    // Filter to text-based columns
    const textColumns = data
      .filter((col: any) => {
        const dataType = col.data_type?.toLowerCase() || '';
        return (
          dataType.includes('text') ||
          dataType.includes('varchar') ||
          dataType.includes('character varying')
        );
      })
      .map((col: any) => col.column_name);

    return textColumns.length > 0 ? textColumns : ['title', 'description', 'name'];
  } catch (error) {
    return ['title', 'description', 'name'];
  }
}


/**
 * Get or build the table columns cache
 * Discovers searchable columns for all tables automatically
 */
async function getTableColumnsCache(): Promise<Record<string, string[]>> {
  const now = Date.now();
  
  // Return cache if valid
  if (tableColumnsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return tableColumnsCache;
  }

  console.log('Building table columns cache...');
  const cache: Record<string, string[]> = {};

  // Get all table names
  const allTables = [
    ...MATRIX_TABLES.xtech,
    ...MATRIX_TABLES.mantech,
    ...MATRIX_TABLES.dod_contracts,
    ...MATRIX_TABLES.gsa,
    ...MATRIX_TABLES.financial,
    ...MATRIX_TABLES.small_business,
    'sbir_final', // Always include SBIR
  ];

  // Discover columns for each table
  for (const tableName of allTables) {
    cache[tableName] = await getSearchableColumns(tableName);
    console.log(`  ${tableName}: ${cache[tableName].join(', ')}`);
  }

  tableColumnsCache = cache;
  cacheTimestamp = now;

  console.log(`✅ Cached columns for ${Object.keys(cache).length} tables`);
  
  return cache;
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
 * Search relevant Supabase tables based on topic and settings
 * Dynamically discovers and searches appropriate columns for each table
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
    // Build column cache (first time only, then cached for 1 hour)
    const columnCache = await getTableColumnsCache();
    
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

    console.log(`Searching ${tablesToSearch.length} tables for: "${topic}"`);

    // Search each table for relevant data
    for (const tableName of tablesToSearch) {
      try {
        // Get dynamically discovered columns for this table
        const columnsToSearch = columnCache[tableName] || ['title', 'description', 'name'];
        
        // Build OR query: column1 ILIKE '%topic%' OR column2 ILIKE '%topic%' ...
        const orConditions = columnsToSearch.map(col => `${col}.ilike.%${topic}%`).join(',');
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .or(orConditions)
          .limit(10); // Limit per table to keep context manageable

        if (error) {
          console.log(`❌ Error searching ${tableName}:`, error.message);
        } else if (data && data.length > 0) {
          results.push({
            table: tableName,
            count: data.length,
            data: data,
          });
          sources.push(tableName);
          console.log(`✓ Found ${data.length} results in ${tableName} (searched: ${columnsToSearch.slice(0, 3).join(', ')}...)`);
        } else {
          console.log(`  No results in ${tableName}`);
        }
      } catch (tableError: any) {
        // Table might not exist or have different columns - skip gracefully
        console.log(`⚠️  Skipping table ${tableName}:`, tableError.message);
      }
    }

    console.log(`\n✅ Search complete: Found results in ${results.length} tables`);
    
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


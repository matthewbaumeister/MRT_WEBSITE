import { createClient } from "@supabase/supabase-js";

// Lazy initialization of Supabase client
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

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
      // Table is empty, try to get schema via RPC
      console.log(`⚠️  ${tableName} is empty, trying RPC to get columns...`);
      const rpcColumns = await getSearchableColumnsViaRPC(tableName);
      console.log(`  ${tableName} (empty table): ${rpcColumns.join(', ')}`);
      return rpcColumns;
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

    if (error) {
      console.log(`RPC error for ${tableName}:`, error.message);
      // Return empty array to skip this table
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`No text columns found in ${tableName} schema, skipping`);
      return [];
    }

    // All columns returned are text-based (filtered in SQL)
    const textColumns = data.map((col: any) => col.column_name);

    console.log(`✅ RPC found columns for ${tableName}:`, textColumns.join(', '));
    return textColumns;
  } catch (error) {
    console.log(`Exception calling RPC for ${tableName}:`, error);
    return [];
  }
}


/**
 * Auto-discover all data tables in Supabase
 * Returns tables that have data and aren't system tables
 */
async function discoverDataTables(): Promise<string[]> {
  const supabase = getSupabaseClient();
  
  try {
    // Query pg_stat_user_tables to find tables with data
    const { data, error } = await supabase.rpc('get_tables_with_data');
    
    if (error || !data) {
      console.log('⚠️  Could not auto-discover tables, using configured list');
      // Fallback to configured tables
      return [
        ...MATRIX_TABLES.xtech,
        ...MATRIX_TABLES.mantech,
        ...MATRIX_TABLES.dod_contracts,
        ...MATRIX_TABLES.sbir,
        ...MATRIX_TABLES.gsa,
        ...MATRIX_TABLES.financial,
      ];
    }
    
    // Filter out system tables
    const dataTablesNames = data
      .filter((table: any) => {
        const name = table.tablename || table.relname;
        // Exclude system tables
        return name && 
          !name.startsWith('matrix_') &&       // Internal Matrix app tables
          !name.startsWith('verification_') &&  // Auth tables
          !name.includes('_scraper_log') &&     // Scraper logs
          !name.includes('user_') &&            // User management tables
          name !== 'users' &&
          name !== 'contact_submissions';
      })
      .map((table: any) => table.tablename || table.relname);
    
    console.log(`🔍 Auto-discovered ${dataTablesNames.length} data tables:`, dataTablesNames);
    return dataTablesNames;
    
  } catch (error) {
    console.log('⚠️  Error auto-discovering tables:', error);
    // Fallback to configured tables
    return [
      ...MATRIX_TABLES.xtech,
      ...MATRIX_TABLES.mantech,
      ...MATRIX_TABLES.dod_contracts,
      ...MATRIX_TABLES.sbir,
      ...MATRIX_TABLES.gsa,
      ...MATRIX_TABLES.financial,
    ];
  }
}

/**
 * Get or build the table columns cache
 * Discovers searchable columns for all tables automatically
 * NOW ALSO AUTO-DISCOVERS TABLES! 🚀
 */
async function getTableColumnsCache(): Promise<Record<string, string[]>> {
  const now = Date.now();
  
  // Return cache if valid
  if (tableColumnsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return tableColumnsCache;
  }

  console.log('🔍 Building smart table & column cache...');
  const cache: Record<string, string[]> = {};

  // STEP 1: Auto-discover all data tables (NEW!)
  const discoveredTables = await discoverDataTables();
  
  // STEP 2: Combine with configured tables (ensures we don't miss anything)
  const allTables = [...new Set([
    ...discoveredTables,
    ...MATRIX_TABLES.xtech,
    ...MATRIX_TABLES.mantech,
    ...MATRIX_TABLES.dod_contracts,
    ...MATRIX_TABLES.sbir,
    ...MATRIX_TABLES.gsa,
    ...MATRIX_TABLES.financial,
  ])];

  console.log(`📊 Will search ${allTables.length} tables total`);

  // STEP 3: Discover searchable columns for each table
  for (const tableName of allTables) {
    cache[tableName] = await getSearchableColumns(tableName);
    if (cache[tableName].length > 0) {
      console.log(`  ✅ ${tableName}: ${cache[tableName].join(', ')}`);
    }
  }

  tableColumnsCache = cache;
  cacheTimestamp = now;

  console.log(`✅ Smart cache built! ${Object.keys(cache).length} tables ready to search`);
  
  return cache;
}

// All MATRIX-related tables to query
// ✅ = Verified tables that exist in your database
const MATRIX_TABLES: Record<string, string[]> = {
  // Army Innovation / xTech ✅ VERIFIED
  xtech: [
    'army_innovation_opportunities',       // 44 rows ✅
    'army_innovation_programs',            // 2 rows ✅
    'army_innovation_submissions',         // 988 rows ✅
    'army_innovation_documents',           // 0 rows (table exists) ✅
  ],
  // MANTECH ✅ VERIFIED
  mantech: [
    'mantech_projects',                    // 296 rows ✅
    'mantech_company_mentions',            // 343 rows ✅
  ],
  // DOD Contract News & Information ✅ VERIFIED - BIG DATA!
  dod_contracts: [
    'dod_contract_news',                   // 44,113 rows! 🔥
    'dvids_military_news',                 // 3,048 rows ✅
  ],
  // SBIR Data ✅ VERIFIED - BIG DATA!
  sbir: [
    'sbir_final',                          // 32,131 rows! 🔥
  ],
  // GSA Schedule & Contractors ✅ VERIFIED - MASSIVE DATA!
  gsa: [
    'gsa_labor_categories',                // 196,714 rows! 🔥🔥🔥
    'gsa_schedule_holders',                // 13,968 rows ✅
    'gsa_price_lists',                     // 1,968 rows ✅
  ],
  // Stock Trades & Defense Contractors ✅ VERIFIED
  financial: [
    'congressional_stock_trades',          // 3,338 rows ✅
    'defense_contractors_tickers',         // 20 rows ✅
  ],
  // Small Business specific
  small_business: [
    'army_innovation_submissions',         // Often small businesses
    'sbir_final',                          // SBIR = small business program
  ],
};

/**
 * Search relevant Supabase tables based on topic and settings
 * Dynamically discovers and searches appropriate columns for each table
 * Supports date range filtering (e.g., "last 3 months", "Q4 2024")
 */
export async function searchSupabaseTables(
  topic: string,
  options: {
    smallBusinessFocus?: boolean;
    sectionId?: string;
    dateRange?: { start: Date; end: Date } | null;
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
        ...MATRIX_TABLES.sbir, // SBIR for small business focus
      ];
    } else {
      // Search all relevant tables
      tablesToSearch = [
        ...MATRIX_TABLES.xtech,
        ...MATRIX_TABLES.mantech,
        ...MATRIX_TABLES.dod_contracts,
        ...MATRIX_TABLES.sbir,          // 32K rows of SBIR data! 🔥
        ...MATRIX_TABLES.gsa,
        ...MATRIX_TABLES.financial,
      ];
    }

    // Remove duplicates
    tablesToSearch = [...new Set(tablesToSearch)];

    console.log(`Searching ${tablesToSearch.length} tables for: "${topic}"`);

    // Search each table for relevant data
    for (const tableName of tablesToSearch) {
      try {
        // Get dynamically discovered columns for this table
        const columnsToSearch = columnCache[tableName];
        
        // Skip tables with no searchable columns (empty or no text columns)
        if (!columnsToSearch || columnsToSearch.length === 0) {
          console.log(`⏭️  Skipping ${tableName}: no searchable columns`);
          continue;
        }
        
        // Split topic into keywords for better matching
        // "defense ai contracts" → ["defense", "ai", "contracts"]
        const keywords = topic.toLowerCase().split(/\s+/).filter(k => k.length > 2); // Filter out 1-2 char words
        
        // Sanitize keywords to prevent Supabase errors with special characters
        const sanitizedKeywords = keywords.map(k => k.replace(/[%_]/g, '\\$&'));
        
        // Build smart OR query: 
        // (column1 ILIKE '%defense%' OR column1 ILIKE '%ai%' OR column1 ILIKE '%contracts%')
        // OR (column2 ILIKE '%defense%' OR column2 ILIKE '%ai%' OR column2 ILIKE '%contracts%')
        const orConditions = columnsToSearch.flatMap(col => 
          sanitizedKeywords.map(keyword => `${col}.ilike.%${keyword}%`)
        ).join(',');
        
        console.log(`  🔍 Searching ${tableName} for keywords: [${keywords.join(', ')}]`);
        
        // INCREASED LIMIT: Market research needs comprehensive data!
        // For "army" searches with 290K rows, we want LOTS of results
        let query = supabase
          .from(tableName)
          .select('*')
          .or(orConditions);

        // Apply date range filter if provided
        // Check common date column names
        if (options.dateRange) {
          const dateColumns = ['created_at', 'updated_at', 'date', 'published_date', 'award_date', 'submission_date'];
          // Try to apply date filter (will silently fail if column doesn't exist)
          for (const dateCol of dateColumns) {
            try {
              query = query
                .gte(dateCol, options.dateRange.start.toISOString())
                .lte(dateCol, options.dateRange.end.toISOString());
              console.log(`  📅 Applied date filter on ${tableName}.${dateCol}`);
              break; // Only apply to first matching column
            } catch (e) {
              // Column doesn't exist, try next one
              continue;
            }
          }
        }

        const { data, error } = await query.limit(1000); // Get up to 1000 results per table

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
 * Map table names to user-friendly display names
 */
function getTableDisplayName(tableName: string): string {
  const displayNameMap: Record<string, string> = {
    'dod_tech_contracts': 'DOD Contract News',
    'dod_contract_news': 'DOD Contract News',
    'army_innovation_opportunities': 'xTech Army Opps',
    'army_innovation_programs': 'xTech Army Opps',
    'army_innovation_submissions': 'xTech Army Opps',
    'army_innovation_documents': 'xTech Army Opps',
    'army_innovation_finalists_with_details': 'xTech Army Opps',
    'army_innovation_winners_with_details': 'xTech Army Opps',
    'army_innovation_phase_progress': 'xTech Army Opps',
    'army_innovation_competition_stats': 'xTech Army Opps',
    'army_innovation_prize_summary': 'xTech Army Opps',
    'army_innovation_upcoming_deadlines': 'xTech Army Opps',
  };
  
  // Check if table name starts with army_innovation
  if (tableName.startsWith('army_innovation')) {
    return 'xTech Army Opps';
  }
  
  // Check if table name contains dod_contract or dod_tech
  if (tableName.includes('dod_contract') || tableName.includes('dod_tech')) {
    return 'DOD Contract News';
  }
  
  return displayNameMap[tableName] || tableName;
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
    const displayName = getTableDisplayName(result.table);
    context += `From ${displayName} (${result.count} results):\n`;
    
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
 * Extract actual URLs from Supabase data records
 * Looks for common URL fields in the data and returns DataSource objects
 */
export function extractSupabaseURLs(results: any[]): Array<{ name: string; url: string }> {
  const urls: Array<{ name: string; url: string }> = [];
  const seenUrls = new Set<string>(); // Prevent duplicates

  // Common URL field names to check
  const urlFields = [
    'url', 'link', 'website', 'source_url', 'article_url', 
    'source', 'reference_url', 'web_url', 'permalink'
  ];

  // Common title/name fields for display
  const nameFields = [
    'title', 'name', 'company', 'company_name', 'project_title',
    'solution_title', 'article_title', 'headline', 'program_name'
  ];

  for (const result of results) {
    console.log(`[URL EXTRACTION] Checking table: ${result.table}, ${result.data.length} rows`);
    
    // Log first row keys to see what fields are available
    if (result.data.length > 0) {
      const sampleKeys = Object.keys(result.data[0]);
      console.log(`[URL EXTRACTION] Available fields in ${result.table}:`, sampleKeys.filter(k => 
        k.toLowerCase().includes('url') || k.toLowerCase().includes('link') || k.toLowerCase().includes('website')
      ));
    }
    
    for (const item of result.data) {
      // Find URL in this record
      let foundUrl: string | null = null;
      let foundField: string | null = null;
      
      for (const field of urlFields) {
        if (item[field] && typeof item[field] === 'string' && item[field].startsWith('http')) {
          foundUrl = item[field];
          foundField = field;
          break;
        }
      }

      if (foundUrl && !seenUrls.has(foundUrl)) {
        seenUrls.add(foundUrl);

        // Find a good name for this source
        let sourceName = result.table; // Default to table name
        for (const field of nameFields) {
          if (item[field] && typeof item[field] === 'string') {
            sourceName = item[field].substring(0, 100); // Limit length
            break;
          }
        }

        const displayName = getTableDisplayName(result.table);
        console.log(`[URL EXTRACTION] ✅ Found URL in ${result.table}.${foundField}: ${foundUrl.substring(0, 60)}...`);
        
        urls.push({
          name: `${sourceName} - ${displayName}`,
          url: foundUrl
        });
      }
    }
  }

  // If no URLs found in data, return generic sources
  if (urls.length === 0 && results.length > 0) {
    console.warn(`[URL EXTRACTION] ⚠️  NO URLs found in any data! Using generic fallback URLs.`);
    console.warn(`[URL EXTRACTION] This means your Supabase tables don't have url/link/website columns with actual URLs.`);
    
    // Return generic references to the tables
    const uniqueTables = [...new Set(results.map(r => r.table))];
    return uniqueTables.map(table => {
      const displayName = getTableDisplayName(table);
      return {
        name: `${displayName} database`,
        url: `https://www.makereadytech.com/matrix?source=${table}`
      };
    });
  }

  console.log(`[URL EXTRACTION] ✅ Successfully extracted ${urls.length} real URLs from Supabase data`);
  return urls;
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


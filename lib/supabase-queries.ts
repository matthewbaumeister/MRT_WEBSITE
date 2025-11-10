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
  // Add your DOD contract tables here when ready
  dod_contracts: [
    // 'dod_contract_news',  // Add when you create this table
    // 'dod_contract_awards',
    // 'fpds_small_business',
  ],
  // Small Business specific
  small_business: [
    // 'sba_awards',  // Add when available
    // 'dsip_awards',
  ],
};

/**
 * Search relevant Supabase tables based on topic and settings
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
    const tablesToSearch = options.smallBusinessFocus
      ? [...MATRIX_TABLES.xtech, ...MATRIX_TABLES.mantech, ...MATRIX_TABLES.small_business]
      : [...MATRIX_TABLES.xtech, ...MATRIX_TABLES.mantech, ...MATRIX_TABLES.dod_contracts];

    // Search each table for relevant data
    for (const tableName of tablesToSearch) {
      try {
        // Search in text columns for the topic
        // Note: This is a simple search - you can make it more sophisticated
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .or(`title.ilike.%${topic}%, description.ilike.%${topic}%, name.ilike.%${topic}%`)
          .limit(50);

        if (data && data.length > 0) {
          results.push({
            table: tableName,
            count: data.length,
            data: data,
          });
          sources.push(tableName);
        }
      } catch (tableError) {
        // Table might not exist yet or have different columns
        console.log(`Skipping table ${tableName}:`, tableError);
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


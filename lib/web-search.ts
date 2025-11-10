/**
 * Web Search Integration using Serper API
 * Cost: ~$0.01 per search (5,000 searches for $50/month)
 * Provides real-time web data to supplement Supabase databases
 */

export interface SerperSearchResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

export interface WebSearchResults {
  organic: SerperSearchResult[];
  newsResults?: SerperSearchResult[];
  totalResults: number;
}

/**
 * Search the web using Serper API
 * @param query - Search query string
 * @param numResults - Number of results to return (default: 10)
 * @returns Web search results
 */
export async function searchWeb(
  query: string,
  numResults: number = 10
): Promise<WebSearchResults | null> {
  const apiKey = process.env.SERPER_API_KEY;

  // If no API key, return null (web search disabled)
  if (!apiKey) {
    console.log("Serper API key not configured - web search disabled");
    return null;
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: numResults,
      }),
    });

    if (!response.ok) {
      console.error("Serper API error:", response.statusText);
      return null;
    }

    const data = await response.json();

    return {
      organic: data.organic || [],
      newsResults: data.newsResults || [],
      totalResults: data.searchInformation?.totalResults || 0,
    };
  } catch (error) {
    console.error("Error searching web:", error);
    return null;
  }
}

/**
 * Search for DOD/defense-specific news and information
 * @param topic - Research topic
 * @param sectionType - Type of section (funding, competition, etc.)
 * @returns Relevant web search results
 */
export async function searchDoDWeb(
  topic: string,
  sectionType?: string
): Promise<WebSearchResults | null> {
  // Construct DOD-focused search queries
  const queries: Record<string, string> = {
    background: `${topic} DOD defense military overview 2024`,
    funding: `${topic} SBIR STTR funding awards contracts DOD`,
    "market-size": `${topic} market size revenue defense industry`,
    tam: `${topic} total addressable market defense DOD`,
    competition: `${topic} companies contractors DOD awards`,
    technology: `${topic} technology innovation DOD military`,
    "usg-alignment": `${topic} DOD priorities Army Navy Air Force`,
    regulatory: `${topic} regulations FAR DFARS compliance`,
    barriers: `${topic} barriers entry risks defense contracting`,
    conclusion: `${topic} DOD opportunities recommendations`,
  };

  const query = sectionType && queries[sectionType]
    ? queries[sectionType]
    : `${topic} DOD defense military`;

  return searchWeb(query);
}

/**
 * Search for recent news articles
 * @param topic - Topic to search for
 * @param daysBack - Number of days to look back (default: 180 = 6 months)
 * @returns Recent news results
 */
export async function searchRecentNews(
  topic: string,
  daysBack: number = 180
): Promise<WebSearchResults | null> {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://google.serper.dev/news", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `${topic} DOD defense military contracts`,
        num: 10,
        tbs: `qdr:d${daysBack}`, // Recent results
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      organic: [],
      newsResults: data.news || [],
      totalResults: data.news?.length || 0,
    };
  } catch (error) {
    console.error("Error searching news:", error);
    return null;
  }
}

/**
 * Format web search results for LLM context
 * @param results - Web search results
 * @param maxResults - Maximum number of results to include (default: 5)
 * @returns Formatted string for LLM context
 */
export function formatWebSearchContext(
  results: WebSearchResults | null,
  maxResults: number = 5
): string {
  if (!results || (results.organic.length === 0 && (!results.newsResults || results.newsResults.length === 0))) {
    return "";
  }

  let context = "\n\n=== RECENT WEB INFORMATION ===\n";

  // Add organic results
  if (results.organic.length > 0) {
    context += "\nWeb Search Results:\n";
    results.organic.slice(0, maxResults).forEach((result, index) => {
      context += `${index + 1}. ${result.title}\n`;
      context += `   ${result.snippet}\n`;
      context += `   Source: ${result.link}\n\n`;
    });
  }

  // Add news results
  if (results.newsResults && results.newsResults.length > 0) {
    context += "\nRecent News Articles:\n";
    results.newsResults.slice(0, maxResults).forEach((result, index) => {
      context += `${index + 1}. ${result.title}\n`;
      context += `   ${result.snippet}\n`;
      if (result.date) context += `   Date: ${result.date}\n`;
      context += `   Source: ${result.link}\n\n`;
    });
  }

  context += "=== END WEB INFORMATION ===\n\n";
  context += "Use the above recent web information to supplement your response with current, publicly available data. Cite sources when referencing web information.\n";

  return context;
}

/**
 * Check if Serper API is configured
 * @returns true if API key is set, false otherwise
 */
export function isWebSearchEnabled(): boolean {
  return !!process.env.SERPER_API_KEY;
}

/**
 * Estimate cost of web search
 * @param numSearches - Number of searches
 * @returns Estimated cost in dollars
 */
export function estimateSearchCost(numSearches: number): number {
  const COST_PER_SEARCH = 0.01; // $50 for 5,000 searches
  return numSearches * COST_PER_SEARCH;
}


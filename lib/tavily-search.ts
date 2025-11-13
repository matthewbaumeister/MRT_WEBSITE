/**
 * Tavily AI Search API integration
 * Designed for LLM/RAG applications - perfect for enrichment
 * https://tavily.com
 */

export interface TavilySearchResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

export async function searchTavily(
  query: string,
  numResults: number = 3
): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY not configured');
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'basic', // 'basic' for speed, 'advanced' for deeper search
        include_answer: false,
        include_raw_content: false,
        max_results: numResults,
        include_domains: [], // Empty = search all domains
        exclude_domains: ['exact-url.com', 'example.com', 'placeholder.com'], // Exclude placeholders
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[TAVILY SEARCH] API error: ${response.status} - ${errorText}`);
      throw new Error(`Tavily Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Tavily returns results in a 'results' array
    const results = data.results || [];
    
    return results.map((result: any) => ({
      title: result.title || '',
      link: result.url || '',
      snippet: result.content || result.snippet || '',
      date: result.published_date || undefined,
    }));
  } catch (error) {
    console.error(`[TAVILY SEARCH] Error searching "${query}":`, error);
    throw error;
  }
}

/**
 * Search Tavily for multiple queries and return combined results
 */
export async function searchTavilyMultiple(
  queries: string[],
  numResultsPerQuery: number = 3
): Promise<TavilySearchResult[]> {
  const allResults: TavilySearchResult[] = [];
  const seenUrls = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchTavily(query, numResultsPerQuery);
      
      // Deduplicate by URL
      for (const result of results) {
        if (!seenUrls.has(result.link)) {
          seenUrls.add(result.link);
          allResults.push(result);
        }
      }
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[TAVILY SEARCH] Failed to search "${query}":`, error);
      // Continue with other queries even if one fails
    }
  }

  return allResults;
}


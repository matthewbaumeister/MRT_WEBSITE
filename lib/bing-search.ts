/**
 * Bing Search API integration
 * Official Microsoft API - no CAPTCHA, reliable, cost-effective
 */

export interface BingSearchResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

export async function searchBing(
  query: string,
  numResults: number = 3
): Promise<BingSearchResult[]> {
  const apiKey = process.env.BING_SEARCH_API_KEY;
  
  if (!apiKey) {
    throw new Error('BING_SEARCH_API_KEY not configured');
  }

  try {
    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${numResults}&responseFilter=Webpages`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BING SEARCH] API error: ${response.status} - ${errorText}`);
      throw new Error(`Bing Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract web page results
    const results = data.webPages?.value || [];
    
    return results.map((result: any) => ({
      title: result.name || '',
      link: result.url || '',
      snippet: result.snippet || '',
      date: result.dateLastCrawled || undefined,
    }));
  } catch (error) {
    console.error(`[BING SEARCH] Error searching "${query}":`, error);
    throw error;
  }
}

/**
 * Search Bing for multiple queries and return combined results
 */
export async function searchBingMultiple(
  queries: string[],
  numResultsPerQuery: number = 3
): Promise<BingSearchResult[]> {
  const allResults: BingSearchResult[] = [];
  const seenUrls = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchBing(query, numResultsPerQuery);
      
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
      console.error(`[BING SEARCH] Failed to search "${query}":`, error);
      // Continue with other queries even if one fails
    }
  }

  return allResults;
}


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { searchSupabaseTables, formatSupabaseContext, extractSupabaseURLs } from "@/lib/supabase-queries";
import { parseDateRange, stripDateRange, formatDateRange } from "@/lib/date-parser";

/**
 * POST /api/matrix/search
 * Smart hybrid search: Semantic AI search + Keyword search
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, sectionId, smallBusinessFocus, useSemanticSearch = true } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Parse date range from query (e.g., "army contracts last 3 months")
    const dateRange = parseDateRange(topic);
    const searchTopic = dateRange ? stripDateRange(topic, dateRange) : topic;

    if (dateRange) {
      console.log(`📅 Parsed date range: ${formatDateRange(dateRange)} from query: "${topic}"`);
      console.log(`📝 Clean search topic: "${searchTopic}"`);
    }

    let results: any[] = [];
    let sources: string[] = [];
    let searchMethod = "keyword";

    // Try semantic search first (if enabled)
    if (useSemanticSearch) {
      try {
        console.log(`[SEARCH] Attempting semantic search for: "${topic}"`);
        
        const semanticResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/matrix/semantic-search`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Cookie": request.headers.get("cookie") || "" },
          body: JSON.stringify({
            query: topic,
            matchThreshold: 0.65, // Lower threshold for broader matches
            matchCount: 30,
          }),
        });

        if (semanticResponse.ok) {
          const semanticData = await semanticResponse.json();
          
          if (semanticData.success && semanticData.results && semanticData.results.length > 0) {
            results = semanticData.results;
            sources = semanticData.results.map((r: any) => r.table);
            searchMethod = "semantic";
            console.log(`[SEARCH] ✅ Semantic search found ${semanticData.totalMatches} matches (avg similarity: ${(semanticData.averageSimilarity * 100).toFixed(1)}%)`);
          } else {
            console.log(`[SEARCH] ⚠️  Semantic search returned no results, falling back to keyword`);
          }
        } else {
          console.log(`[SEARCH] ⚠️  Semantic search failed, falling back to keyword`);
        }
      } catch (error) {
        console.warn(`[SEARCH] Semantic search error, falling back to keyword:`, error);
      }
    }

    // Fall back to keyword search if semantic didn't work or was disabled
    if (results.length === 0) {
      console.log(`[SEARCH] Using keyword search for: "${searchTopic}"${dateRange ? ' (with date filter)' : ''}`);
      const keywordResults = await searchSupabaseTables(searchTopic, {
        smallBusinessFocus: smallBusinessFocus || false,
        sectionId: sectionId || undefined,
        dateRange: dateRange || undefined,
      });
      results = keywordResults.results;
      sources = keywordResults.sources;
    }

    // Format context for LLM
    const formattedContext = formatSupabaseContext(results);

    // Extract real URLs from the data
    const dataSourceURLs = extractSupabaseURLs(results);

    // Debug logging
    console.log("=== SEARCH API DEBUG ===");
    console.log(`Search Method: ${searchMethod.toUpperCase()} ${searchMethod === "semantic" ? "🧠 (AI-powered)" : "🔍 (keyword)"}`);
    console.log(`Topic: "${topic}"`);
    console.log(`Section: ${sectionId || "all"}`);
    console.log(`Small Business Focus: ${smallBusinessFocus}`);
    console.log(`Tables searched: ${sources.join(", ")}`);
    console.log(`Total results: ${results.length}`);
    console.log(`Results per table:`);
    results.forEach(r => {
      console.log(`  - ${r.table}: ${r.count} rows`);
    });
    console.log(`URLs extracted: ${dataSourceURLs.length}`);
    dataSourceURLs.slice(0, 3).forEach(url => {
      console.log(`  - ${url.name.substring(0, 60)}...`);
      console.log(`    ${url.url}`);
    });
    console.log(`Context length: ${formattedContext.length} chars`);
    console.log("========================");

    return NextResponse.json({
      success: true,
      searchMethod, // "semantic" or "keyword"
      dateRange: dateRange ? {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
        formatted: formatDateRange(dateRange),
        originalPhrase: dateRange.originalPhrase,
      } : null,
      context: formattedContext,
      sources,
      sourceURLs: dataSourceURLs, // Actual URLs from database records
      resultCount: results.length,
      debug: {
        searchMethod,
        dateRangeApplied: !!dateRange,
        tablesSearched: sources,
        totalResults: results.length,
        urlsExtracted: dataSourceURLs.length,
        contextLength: formattedContext.length,
        resultsPerTable: results.map(r => ({ table: r.table, count: r.count })),
      },
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


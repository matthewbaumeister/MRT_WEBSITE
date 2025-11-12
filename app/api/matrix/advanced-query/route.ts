import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { searchSupabaseTables, formatSupabaseContext } from "@/lib/supabase-queries";
import { searchDoDWeb, searchRecentNews, formatWebSearchContext } from "@/lib/web-search";
import { parseDateRange, stripDateRange } from "@/lib/date-parser";
import OpenAI from "openai";

/**
 * POST /api/matrix/advanced-query
 * Advanced query with live data fetching
 * Unlike regular queries, this searches fresh data from Supabase AND web
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      query, 
      contextSection,  // Current report section content (optional)
      researchTopic,   // Original report topic
      sectionId        // Which section is being queried
    } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    console.log(`[ADVANCED QUERY] User query: "${query}"`);
    console.log(`[ADVANCED QUERY] Section: ${sectionId || "whole report"}`);
    console.log(`[ADVANCED QUERY] Research topic: ${researchTopic || "N/A"}`);

    // Parse date range from query
    const dateRange = parseDateRange(query);
    const searchTopic = dateRange ? stripDateRange(query, dateRange) : query;

    if (dateRange) {
      console.log(`[ADVANCED QUERY] 📅 Date range detected: ${dateRange.originalPhrase}`);
    }

    // Step 1: Search Supabase for fresh data
    console.log(`[ADVANCED QUERY] Searching Supabase...`);
    const supabaseSearch = await searchSupabaseTables(searchTopic, {
      sectionId,
      dateRange: dateRange || undefined,
    });

    const supabaseContext = formatSupabaseContext(supabaseSearch.results);
    console.log(`[ADVANCED QUERY] ✅ Found ${supabaseSearch.results.length} tables with data`);

    // Step 2: Search web for public data
    let webContext = "";
    const serperKey = process.env.SERPER_API_KEY;
    
    if (serperKey) {
      console.log(`[ADVANCED QUERY] Searching web...`);
      try {
        // Search DoD-specific sites
        const dodResults = await searchDoDWeb(searchTopic);
        if (dodResults) {
          webContext += formatWebSearchContext(dodResults, 5);
        }

        // Search recent news
        const newsResults = await searchRecentNews(searchTopic, 180);
        if (newsResults) {
          webContext += "\n\n" + formatWebSearchContext(newsResults, 5);
        }

        console.log(`[ADVANCED QUERY] ✅ Web search completed`);
      } catch (error) {
        console.warn(`[ADVANCED QUERY] Web search failed:`, error);
      }
    } else {
      console.log(`[ADVANCED QUERY] ⚠️  Web search disabled (no Serper API key)`);
    }

    // Step 3: Build comprehensive context
    let contextForLLM = "";

    // Add existing report section if provided
    if (contextSection) {
      contextForLLM += `Current Report Section Content:\n${contextSection}\n\n`;
    }

    // Add fresh Supabase data
    if (supabaseContext) {
      contextForLLM += `Fresh Database Data:\n${supabaseContext}\n\n`;
    }

    // Add web search data
    if (webContext) {
      contextForLLM += `Public Web Data:\n${webContext}\n\n`;
    }

    if (!contextForLLM) {
      contextForLLM = "No additional data found. Using general knowledge to answer.";
    }

    // Step 4: Query OpenAI with comprehensive context
    console.log(`[ADVANCED QUERY] Querying OpenAI with ${contextForLLM.length} chars of context...`);

    const openai = new OpenAI({ apiKey: openAIApiKey });

    // Build data source summary
    const sourceSummary = [];
    if (supabaseSearch.results.length > 0) {
      const tableNames = supabaseSearch.results.map(r => r.tableName).join(", ");
      sourceSummary.push(`Supabase database (${supabaseSearch.results.length} tables: ${tableNames})`);
    }
    if (webContext) {
      sourceSummary.push("DoD websites and recent news articles");
    }
    const sourcesSearched = sourceSummary.length > 0 
      ? sourceSummary.join(" + ") 
      : "No sources returned data";

    const systemPrompt = sectionId
      ? `You are a DoD market research analyst. Your task is to UPDATE/ENHANCE the "${sectionId}" section of this report.
      
CRITICAL INSTRUCTIONS:
1. ALWAYS provide content to add to the report section - never say "no data available" without also providing what WAS found
2. Synthesize ANY relevant information from the provided context
3. If direct data isn't available, provide related/adjacent information that adds value
4. Be SPECIFIC about data sources: explicitly state which databases/websites were searched
5. Format as report content ready to be added to the section (use markdown)
6. Include numbers, dates, companies, contracts, and URLs when available
7. If truly no relevant data exists, state: "Searched: ${sourcesSearched}. No additional public information found on [topic]. Recommend: [specific data sources that might have this info]."

FOCUS: Provide actionable content that IMPROVES the ${sectionId} section, even if indirect.`
      : `You are a DoD market research analyst. Your task is to provide content to ENHANCE this entire research report.

CRITICAL INSTRUCTIONS:
1. ALWAYS provide synthesized content - never just say "no data"
2. Use ANY relevant information from the provided context
3. Be SPECIFIC about sources searched: ${sourcesSearched}
4. Format as report-ready content (use markdown)
5. Include numbers, dates, companies, and sources
6. If no direct data, state what WAS searched and provide related insights
7. Focus on ADDING VALUE to the report with whatever information exists

GOAL: Provide actionable insights that enhance the overall market research report.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Research Topic: ${researchTopic || "Various DoD programs"}

Data Sources Searched:
${sourcesSearched}

Available Context:
${contextForLLM}

User Query: ${query}

TASK: Provide report-ready content that addresses this query. Include:
1. What information WAS found (be specific with sources)
2. Specific data points (numbers, dates, companies, URLs)
3. If no direct data exists, state what was searched and provide related/adjacent insights
4. Format with markdown for easy integration into report

Remember: ALWAYS provide value - synthesize available data into actionable content.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const answer = completion.choices[0].message.content || "No response generated.";

    console.log(`[ADVANCED QUERY] ✅ Response generated (${answer.length} chars)`);

    return NextResponse.json({
      success: true,
      answer,
      dataSources: {
        supabaseTables: supabaseSearch.results.length,
        webResults: webContext.length > 0,
        dateRangeApplied: !!dateRange,
      },
      debug: {
        supabaseResults: supabaseSearch.results.length,
        contextLength: contextForLLM.length,
        webSearchEnabled: !!serperKey,
        dateRange: dateRange ? {
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
        } : null,
      },
    });

  } catch (error: any) {
    console.error("[ADVANCED QUERY API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process advanced query" },
      { status: 500 }
    );
  }
}


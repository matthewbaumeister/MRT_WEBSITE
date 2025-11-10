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

    const systemPrompt = sectionId
      ? `You are a DoD market research analyst. Answer the user's question specifically about the ${sectionId} section. 
         Use the provided data to give SPECIFIC, DATA-DRIVEN answers with numbers, dates, and sources.
         Do NOT give generic instructions - provide actual findings from the data.
         If the data doesn't contain the answer, say "The available data does not contain this information" and suggest what would be needed.`
      : `You are a DoD market research analyst. Answer the user's question using the provided data.
         Provide SPECIFIC, DATA-DRIVEN answers with numbers, dates, and sources.
         Do NOT give generic instructions - provide actual findings from the data.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Research Topic: ${researchTopic || "Various DoD programs"}

Context Data:
${contextForLLM}

User Question: ${query}

Provide a specific, data-driven answer using the context above. Include specific numbers, dates, companies, and sources when available.`,
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


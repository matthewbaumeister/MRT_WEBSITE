import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseClient } from "@/lib/supabase-queries";
import OpenAI from "openai";

/**
 * POST /api/matrix/semantic-search
 * Perform AI-powered semantic search using embeddings
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query, matchThreshold = 0.7, matchCount = 20, filterTables } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      console.warn("[SEMANTIC SEARCH] OpenAI API key not configured, falling back to keyword search");
      return NextResponse.json({
        success: false,
        fallbackToKeyword: true,
        message: "Semantic search not available, use keyword search",
      });
    }

    console.log(`[SEMANTIC SEARCH] Query: "${query}"`);
    console.log(`[SEMANTIC SEARCH] Threshold: ${matchThreshold}, Limit: ${matchCount}`);

    // Step 1: Generate embedding for the search query
    const openai = new OpenAI({ apiKey: openAIApiKey });
    
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;
    console.log(`[SEMANTIC SEARCH] Generated query embedding (${queryEmbedding.length} dimensions)`);

    // Step 2: Search Supabase using vector similarity
    const supabase = getSupabaseClient();

    const { data: semanticResults, error } = await supabase.rpc(
      "search_documents_semantic",
      {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
        filter_tables: filterTables || null,
      }
    );

    if (error) {
      console.error("[SEMANTIC SEARCH] Supabase error:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
        fallbackToKeyword: true,
      }, { status: 500 });
    }

    console.log(`[SEMANTIC SEARCH] Found ${semanticResults?.length || 0} semantically similar results`);

    // Step 3: Fetch full records for the matched documents
    const resultsByTable: Record<string, any[]> = {};
    
    if (semanticResults && semanticResults.length > 0) {
      // Group by source table
      for (const result of semanticResults) {
        if (!resultsByTable[result.source_table]) {
          resultsByTable[result.source_table] = [];
        }
        
        // Fetch the full record from the source table
        const { data: fullRecord } = await supabase
          .from(result.source_table)
          .select('*')
          .eq('id', result.source_id)
          .single();

        if (fullRecord) {
          resultsByTable[result.source_table].push({
            ...fullRecord,
            _similarity: result.similarity,
            _matched_content: result.content_text,
          });
        }
      }
    }

    // Format results
    const formattedResults = Object.entries(resultsByTable).map(([table, data]) => ({
      table,
      count: data.length,
      data,
    }));

    console.log(`[SEMANTIC SEARCH] Returning ${formattedResults.length} tables with results`);

    return NextResponse.json({
      success: true,
      results: formattedResults,
      totalMatches: semanticResults?.length || 0,
      averageSimilarity: semanticResults?.length > 0
        ? semanticResults.reduce((sum: number, r: any) => sum + r.similarity, 0) / semanticResults.length
        : 0,
    });

  } catch (error: any) {
    console.error("[SEMANTIC SEARCH API] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Semantic search failed",
        fallbackToKeyword: true,
      },
      { status: 500 }
    );
  }
}


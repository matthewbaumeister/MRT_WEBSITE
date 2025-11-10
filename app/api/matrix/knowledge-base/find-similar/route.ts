import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseClient } from "@/lib/supabase-queries";
import OpenAI from "openai";

/**
 * POST /api/matrix/knowledge-base/find-similar
 * Find similar records to a given record using AI semantic search
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { record, table, limit = 10 } = await request.json();

    if (!record || !table) {
      return NextResponse.json(
        { error: "Record and table are required" },
        { status: 400 }
      );
    }

    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    console.log(`[FIND SIMILAR] Finding similar records to ${record.id || 'unknown'} in ${table}`);

    // Build a text representation of the record for similarity search
    const recordText = buildRecordText(record);

    console.log(`[FIND SIMILAR] Record text: ${recordText.substring(0, 200)}...`);

    // Try semantic search first (if embeddings exist)
    try {
      const openai = new OpenAI({ apiKey: openAIApiKey });
      
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: recordText,
      });

      const queryEmbedding = embeddingResponse.data[0].embedding;

      const supabase = getSupabaseClient();
      
      const { data: semanticResults, error } = await supabase.rpc(
        "search_documents_semantic",
        {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: limit + 1, // +1 to account for the record itself
          filter_tables: [table],
        }
      );

      if (!error && semanticResults && semanticResults.length > 0) {
        console.log(`[FIND SIMILAR] Found ${semanticResults.length} semantic matches`);
        
        // Fetch full records
        const similarRecords: any[] = [];
        
        for (const result of semanticResults) {
          // Skip the original record
          if (result.source_id === record.id) continue;
          
          const { data: fullRecord } = await supabase
            .from(table)
            .select('*')
            .eq('id', result.source_id)
            .single();

          if (fullRecord) {
            similarRecords.push({
              ...fullRecord,
              _similarity: result.similarity,
            });
          }
        }

        return NextResponse.json({
          success: true,
          method: "semantic",
          results: similarRecords.slice(0, limit),
          total: similarRecords.length,
        });
      }
    } catch (semanticError) {
      console.warn(`[FIND SIMILAR] Semantic search failed:`, semanticError);
    }

    // Fallback to keyword-based similarity
    console.log(`[FIND SIMILAR] Using keyword fallback`);
    
    const keywords = extractKeywords(recordText);
    const supabase = getSupabaseClient();
    
    // Get sample to determine searchable columns
    const { data: sampleData } = await supabase.from(table).select("*").limit(1);
    
    if (!sampleData || sampleData.length === 0) {
      return NextResponse.json({
        success: true,
        method: "keyword",
        results: [],
        total: 0,
      });
    }

    const searchableColumns = Object.keys(sampleData[0]).filter(col => {
      const value = sampleData[0][col];
      return typeof value === 'string' && col !== 'id';
    });

    // Build OR query with keywords
    const orConditions = keywords
      .flatMap(keyword => 
        searchableColumns.map(col => `${col}.ilike.%${keyword}%`)
      )
      .join(',');

    const { data: keywordResults } = await supabase
      .from(table)
      .select("*")
      .or(orConditions)
      .neq('id', record.id)
      .limit(limit);

    return NextResponse.json({
      success: true,
      method: "keyword",
      results: keywordResults || [],
      total: (keywordResults || []).length,
    });

  } catch (error: any) {
    console.error("[FIND SIMILAR API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to find similar records" },
      { status: 500 }
    );
  }
}

// Helper: Build searchable text from record
function buildRecordText(record: any): string {
  const textFields = [];
  
  // Prioritize certain field types
  const priorityFields = ['title', 'name', 'description', 'abstract', 'summary', 'content'];
  const secondaryFields = ['company', 'contractor', 'technology', 'category', 'keywords'];
  
  // Add priority fields first
  for (const field of priorityFields) {
    if (record[field] && typeof record[field] === 'string') {
      textFields.push(record[field]);
    }
  }
  
  // Add secondary fields
  for (const field of secondaryFields) {
    if (record[field] && typeof record[field] === 'string') {
      textFields.push(record[field]);
    }
  }
  
  // If we still don't have much, add all string fields
  if (textFields.join(' ').length < 100) {
    for (const [key, value] of Object.entries(record)) {
      if (typeof value === 'string' && value.length > 10 && !textFields.includes(value)) {
        textFields.push(value);
      }
    }
  }
  
  return textFields.join(' ').substring(0, 8000); // Limit to 8K chars
}

// Helper: Extract keywords from text
function extractKeywords(text: string): string[] {
  // Simple keyword extraction (split by spaces, remove common words)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were']);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 20); // Top 20 keywords
  
  return [...new Set(words)]; // Remove duplicates
}


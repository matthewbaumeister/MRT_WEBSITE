import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseClient } from "@/lib/supabase-queries";
import OpenAI from "openai";

/**
 * POST /api/matrix/generate-embeddings
 * Background job to generate embeddings for existing data
 * 
 * WARNING: This is expensive! Each embedding costs ~$0.0001
 * With 290K rows, this could cost ~$30-50
 * 
 * Run this ONCE to populate embeddings, then run incrementally for new data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow admin users to run this
    const supabase = getSupabaseClient();
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("email", session.user.email)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { 
      tableName, 
      batchSize = 100,
      limit = 1000,  // Default limit to prevent accidents
      skipExisting = true,
    } = await request.json();

    if (!tableName) {
      return NextResponse.json(
        { error: "tableName is required" },
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

    console.log(`[GENERATE EMBEDDINGS] Starting for table: ${tableName}`);
    console.log(`[GENERATE EMBEDDINGS] Batch size: ${batchSize}, Limit: ${limit}`);

    const openai = new OpenAI({ apiKey: openAIApiKey });

    // Get records that need embeddings
    let query = supabase
      .from(tableName)
      .select('*')
      .limit(limit);

    // Skip records that already have embeddings
    if (skipExisting) {
      const { data: existingEmbeddings } = await supabase
        .from('document_embeddings')
        .select('source_id')
        .eq('source_table', tableName);

      const existingIds = existingEmbeddings?.map(e => e.source_id) || [];
      if (existingIds.length > 0) {
        console.log(`[GENERATE EMBEDDINGS] Skipping ${existingIds.length} existing records`);
        query = query.not('id', 'in', `(${existingIds.join(',')})`);
      }
    }

    const { data: records, error: fetchError } = await query;

    if (fetchError || !records) {
      return NextResponse.json(
        { error: fetchError?.message || "Failed to fetch records" },
        { status: 500 }
      );
    }

    console.log(`[GENERATE EMBEDDINGS] Processing ${records.length} records`);

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process in batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      console.log(`[GENERATE EMBEDDINGS] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}`);

      for (const record of batch) {
        try {
          // Extract searchable text from record
          const textParts: string[] = [];
          
          // Common text fields to include
          const textFields = ['title', 'name', 'description', 'content', 'abstract', 'summary',
                             'article_title', 'contract_description', 'opportunity_title',
                             'solution_title', 'problem_statement', 'challenge_description'];

          for (const field of textFields) {
            if (record[field] && typeof record[field] === 'string') {
              textParts.push(record[field]);
            }
          }

          if (textParts.length === 0) {
            console.warn(`[GENERATE EMBEDDINGS] No text fields found for record ${record.id}`);
            continue;
          }

          const combinedText = textParts.join(' ').substring(0, 8000); // Limit to 8K chars

          // Generate embedding
          const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: combinedText,
          });

          const embedding = embeddingResponse.data[0].embedding;

          // Store embedding in database
          const { error: insertError } = await supabase
            .from('document_embeddings')
            .upsert({
              source_table: tableName,
              source_id: record.id.toString(),
              content_type: 'full_text',
              content_text: combinedText.substring(0, 1000), // Store preview
              embedding,
              metadata: {
                fields_used: textFields.filter(f => record[f]),
                created_at: new Date().toISOString(),
              },
            }, {
              onConflict: 'source_table,source_id,content_type',
            });

          if (insertError) {
            console.error(`[GENERATE EMBEDDINGS] Failed to store embedding for ${record.id}:`, insertError);
            failed++;
            errors.push(`${record.id}: ${insertError.message}`);
          } else {
            processed++;
          }

          // Rate limiting: ~500ms between requests
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error: any) {
          console.error(`[GENERATE EMBEDDINGS] Error processing record ${record.id}:`, error);
          failed++;
          errors.push(`${record.id}: ${error.message}`);
        }
      }
    }

    console.log(`[GENERATE EMBEDDINGS] Complete! Processed: ${processed}, Failed: ${failed}`);

    return NextResponse.json({
      success: true,
      table: tableName,
      processed,
      failed,
      errors: errors.slice(0, 10), // Return first 10 errors
      message: `Generated embeddings for ${processed} records from ${tableName}`,
    });

  } catch (error: any) {
    console.error("[GENERATE EMBEDDINGS API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import OpenAI from "openai";

/**
 * POST /api/matrix/embeddings
 * Generate embeddings for text using OpenAI
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, texts } = await request.json();

    if (!text && (!texts || texts.length === 0)) {
      return NextResponse.json(
        { error: "Either 'text' or 'texts' array is required" },
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

    const openai = new OpenAI({ apiKey: openAIApiKey });

    // Single text embedding
    if (text) {
      console.log(`[EMBEDDINGS] Generating embedding for single text (${text.length} chars)`);
      
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });

      const embedding = response.data[0].embedding;
      
      return NextResponse.json({
        success: true,
        embedding,
        dimensions: embedding.length,
      });
    }

    // Batch text embeddings
    if (texts && texts.length > 0) {
      console.log(`[EMBEDDINGS] Generating embeddings for ${texts.length} texts`);
      
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: texts,
      });

      const embeddings = response.data.map(d => d.embedding);
      
      return NextResponse.json({
        success: true,
        embeddings,
        count: embeddings.length,
        dimensions: embeddings[0].length,
      });
    }

    return NextResponse.json({ error: "No text provided" }, { status: 400 });

  } catch (error: any) {
    console.error("[EMBEDDINGS API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}


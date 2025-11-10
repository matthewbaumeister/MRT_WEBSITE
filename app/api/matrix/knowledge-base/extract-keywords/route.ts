import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import OpenAI from "openai";

/**
 * POST /api/matrix/knowledge-base/extract-keywords
 * Extract search keywords from uploaded document using AI
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file content
    const text = await file.text();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "File is empty or too short" },
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

    console.log(`[KEYWORD EXTRACTION] Processing document: ${file.name} (${text.length} chars)`);

    // Use OpenAI to extract keywords
    const openai = new OpenAI({ apiKey: openAIApiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a keyword extraction expert. Analyze documents and extract relevant search keywords.
Focus on:
- Technical terms and acronyms
- Company names and organizations
- Product names and technologies
- Key concepts and capabilities
- Industry-specific terminology

Return ONLY a comma-separated list of keywords (no explanations).
Example: "artificial intelligence, machine learning, neural networks, computer vision, autonomous systems"`,
        },
        {
          role: "user",
          content: `Extract search keywords from this document:\n\n${text.substring(0, 8000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const keywords = completion.choices[0].message.content || "";
    
    console.log(`[KEYWORD EXTRACTION] Extracted keywords: ${keywords}`);

    return NextResponse.json({
      success: true,
      keywords: keywords.trim(),
      documentName: file.name,
      documentSize: text.length,
    });

  } catch (error: any) {
    console.error("[KEYWORD EXTRACTION API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract keywords" },
      { status: 500 }
    );
  }
}


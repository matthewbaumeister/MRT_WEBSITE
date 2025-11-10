import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { enhanceReportWithPublicData } from "@/lib/research-enhancer";

/**
 * POST /api/matrix/enrich
 * Enhance report sections with public company/people data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sections, topic } = body;

    if (!sections || !topic) {
      return NextResponse.json({ error: "Sections and topic are required" }, { status: 400 });
    }

    // Get OpenAI API key (server-side)
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    // Enhance report with public data
    const enhancements = await enhanceReportWithPublicData(
      sections,
      topic,
      openAIApiKey
    );

    return NextResponse.json({
      success: true,
      enhancements,
    });
  } catch (error: any) {
    console.error("Enrichment API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


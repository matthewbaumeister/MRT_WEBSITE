import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { searchSupabaseTables, formatSupabaseContext, extractSupabaseURLs } from "@/lib/supabase-queries";

/**
 * POST /api/matrix/search
 * Search Supabase tables for relevant data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, sectionId, smallBusinessFocus } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Search Supabase tables
    const { results, sources } = await searchSupabaseTables(topic, {
      smallBusinessFocus: smallBusinessFocus || false,
      sectionId: sectionId || undefined,
    });

    // Format context for LLM
    const formattedContext = formatSupabaseContext(results);

    // Extract real URLs from the data
    const dataSourceURLs = extractSupabaseURLs(results);

    return NextResponse.json({
      success: true,
      context: formattedContext,
      sources,
      sourceURLs: dataSourceURLs, // Actual URLs from database records
      resultCount: results.length,
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


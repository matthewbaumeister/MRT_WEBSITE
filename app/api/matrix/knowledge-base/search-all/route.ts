import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { searchSupabaseTables, formatSupabaseContext } from "@/lib/supabase-queries";

/**
 * POST /api/matrix/knowledge-base/search-all
 * Search across ALL tables using keyword search
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query, limit = 50 } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    console.log(`[KB SEARCH ALL] Searching all tables for: "${query}"`);

    // Use existing searchSupabaseTables function
    const searchResults = await searchSupabaseTables(query);

    // Flatten results from all tables
    const allData: any[] = [];
    let totalCount = 0;

    for (const result of searchResults.results) {
      // Add table name to each record for identification
      const recordsWithSource = result.data.map((record: any) => ({
        ...record,
        _source_table: result.table,
      }));
      
      allData.push(...recordsWithSource);
      totalCount += result.count;
    }

    // Limit results
    const limitedData = allData.slice(0, limit);

    // Get columns from first result
    const columns = limitedData.length > 0 ? Object.keys(limitedData[0]) : [];

    console.log(`[KB SEARCH ALL] Found ${totalCount} total results across ${searchResults.results.length} tables`);
    console.log(`[KB SEARCH ALL] Returning ${limitedData.length} results`);

    return NextResponse.json({
      success: true,
      data: limitedData,
      columns,
      total: totalCount,
      tablesSearched: searchResults.results.length,
      tableBreakdown: searchResults.results.map(r => ({
        table: r.table,
        count: r.count,
      })),
    });

  } catch (error: any) {
    console.error("[KNOWLEDGE BASE SEARCH ALL API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}


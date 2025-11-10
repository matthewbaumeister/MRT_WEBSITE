import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseClient } from "@/lib/supabase-queries";

/**
 * POST /api/matrix/knowledge-base/search
 * Search within a specific table using keyword search
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { table, query, page = 1, limit = 50 } = await request.json();

    if (!table || !query) {
      return NextResponse.json(
        { error: "Table name and query are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const offset = (page - 1) * limit;

    // First, get a sample row to determine searchable columns
    const { data: sampleData } = await supabase
      .from(table)
      .select("*")
      .limit(1);

    if (!sampleData || sampleData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        columns: [],
        total: 0,
      });
    }

    // Get all string columns
    const allColumns = Object.keys(sampleData[0]);
    const searchableColumns = allColumns.filter(col => {
      const value = sampleData[0][col];
      return typeof value === 'string' && col !== 'id';
    });

    if (searchableColumns.length === 0) {
      return NextResponse.json({
        error: "No searchable text columns found in this table",
      }, { status: 400 });
    }

    // Build OR query for all searchable columns
    const orConditions = searchableColumns.map(col => `${col}.ilike.%${query}%`).join(',');

    // Execute search with pagination
    const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .or(orConditions)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error(`Error searching ${table}:`, error);
      return NextResponse.json(
        { error: `Search failed: ${error.message}` },
        { status: 500 }
      );
    }

    console.log(`[KB SEARCH] Found ${count || 0} results in ${table} for query: "${query}"`);

    return NextResponse.json({
      success: true,
      data: data || [],
      columns: allColumns,
      total: count || 0,
      searchedColumns: searchableColumns,
    });

  } catch (error: any) {
    console.error("[KNOWLEDGE BASE SEARCH API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}


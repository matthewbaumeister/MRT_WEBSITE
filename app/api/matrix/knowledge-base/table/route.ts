import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseClient } from "@/lib/supabase-queries";

/**
 * GET /api/matrix/knowledge-base/table
 * Fetch data from a specific table with pagination and sorting
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const table = searchParams.get("table");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortColumn = searchParams.get("sortColumn");
    const sortDirection = searchParams.get("sortDirection") || "asc";

    if (!table) {
      return NextResponse.json({ error: "Table name is required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase.from(table).select("*", { count: "exact" });

    // Apply sorting if specified
    if (sortColumn) {
      query = query.order(sortColumn, { ascending: sortDirection === "asc" });
    } else {
      // Default sort by created_at or updated_at if available
      // Otherwise by id
      query = query.order("created_at", { ascending: false }).limit(1);
      const testResult = await query;
      
      if (testResult.error) {
        // Try updated_at
        query = supabase.from(table).select("*", { count: "exact" }).order("updated_at", { ascending: false });
        const testResult2 = await query.limit(1);
        
        if (testResult2.error) {
          // Fall back to id
          query = supabase.from(table).select("*", { count: "exact" }).order("id", { ascending: true });
        }
      } else {
        query = supabase.from(table).select("*", { count: "exact" }).order("created_at", { ascending: false });
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return NextResponse.json(
        { error: `Failed to fetch data: ${error.message}` },
        { status: 500 }
      );
    }

    // Get columns from first row
    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

    return NextResponse.json({
      success: true,
      data: data || [],
      columns,
      total: count || 0,
      page,
      limit,
    });

  } catch (error: any) {
    console.error("[KNOWLEDGE BASE TABLE API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch table data" },
      { status: 500 }
    );
  }
}


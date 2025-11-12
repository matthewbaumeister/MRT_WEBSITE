import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseClient } from "@/lib/supabase-queries";

/**
 * POST /api/matrix/knowledge-base/search
 * Search within a specific table using keyword search
 */
export async function POST(request: NextRequest) {
  let table: string = '';
  let query: string = '';
  let page: number = 1;
  let limit: number = 50;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    table = body.table;
    query = body.query;
    page = body.page || 1;
    limit = body.limit || 50;

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

    // Try to query Postgres information_schema to get actual column types
    let columnTypes: any = null;
    try {
      const { data } = await supabase.rpc('get_column_types', { 
        table_name: table 
      });
      columnTypes = data;
    } catch (rpcError) {
      console.log(`[KB SEARCH] RPC get_column_types not available, using fallback`);
    }
    
    // If RPC doesn't exist, use client-side detection
    const allColumns = Object.keys(sampleData[0]);
    let searchableColumns = allColumns;
    
    // If we got column types from DB, use them to filter properly
    if (columnTypes && Array.isArray(columnTypes) && columnTypes.length > 0) {
      const textTypeColumns = new Set(
        columnTypes
          .filter((col: any) => {
            // Only include standard text types
            const isTextType = col.data_type === 'text' || 
                              col.data_type === 'character varying' ||
                              col.data_type === 'varchar';
            // Explicitly exclude tsvector, vector, and other special types
            const isExcludedType = col.udt_name === 'tsvector' || 
                                  col.udt_name === 'vector' ||
                                  col.data_type === 'USER-DEFINED' ||
                                  col.data_type === 'date' ||
                                  col.data_type === 'timestamp' ||
                                  col.data_type === 'timestamp with time zone' ||
                                  col.data_type === 'timestamp without time zone';
            
            return isTextType && !isExcludedType;
          })
          .map((col: any) => col.column_name)
      );
      
      searchableColumns = allColumns.filter(col => textTypeColumns.has(col) && col !== 'id');
      console.log(`[KB SEARCH] Using DB schema - ${searchableColumns.length} text columns found`);
      console.log(`[KB SEARCH] Excluded types:`, columnTypes.filter((col: any) => !textTypeColumns.has(col.column_name)).map((col: any) => `${col.column_name}(${col.data_type}/${col.udt_name})`));
    } else {
      // Fallback: Filter by value inspection
      searchableColumns = allColumns.filter(col => {
        const value = sampleData[0][col];
        const colLower = col.toLowerCase();
        
        // Must be string type
        if (typeof value !== 'string') return false;
        if (col === 'id') return false;
        
        // Exclude special Postgres types by column name patterns
        if (colLower.includes('vector') || colLower.includes('tsv')) return false;
        if (colLower.includes('date') || colLower.includes('_at') || colLower.includes('time')) return false;
        if (colLower.includes('uuid') || colLower.endsWith('_id')) return false;
        
        // Exclude by value format
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) return false; // Date format
        if (value && value.length < 3) return false; // Too short
        
        return true;
      });
      console.log(`[KB SEARCH] Using client detection - ${searchableColumns.length} text columns found`);
    }

    if (searchableColumns.length === 0) {
      return NextResponse.json({
        error: "No searchable text columns found in this table",
      }, { status: 400 });
    }

    // Build OR query for all searchable columns
    // Escape special characters in query to prevent Supabase errors
    const sanitizedQuery = query.replace(/[%_]/g, '\\$&');
    const orConditions = searchableColumns.map(col => `${col}.ilike.%${sanitizedQuery}%`).join(',');

    console.log(`[KB SEARCH] Searching ${table} with query: "${sanitizedQuery}" across columns: ${searchableColumns.join(', ')}`);

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
    console.error("[KNOWLEDGE BASE SEARCH API] Error stack:", error.stack);
    console.error("[KNOWLEDGE BASE SEARCH API] Request params:", { table, query, page, limit });
    return NextResponse.json(
      { 
        error: error.message || "Search failed",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}


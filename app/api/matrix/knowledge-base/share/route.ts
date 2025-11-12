import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { table, query, searchMode, sortColumn, sortDirection, pageSize } = body;

    if (!table) {
      return NextResponse.json(
        { error: "Table name is required" },
        { status: 400 }
      );
    }

    // Generate a unique share ID
    const shareId = `kb_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store the share configuration
    const { error } = await supabase
      .from("knowledge_base_shares")
      .insert({
        share_id: shareId,
        table_name: table,
        search_query: query || null,
        search_mode: searchMode || "keyword",
        sort_column: sortColumn || null,
        sort_direction: sortDirection || null,
        page_size: pageSize || 50,
        created_by: session.user.email,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error creating share:", error);
      return NextResponse.json(
        { error: "Failed to create share link" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      shareId,
    });
  } catch (error) {
    console.error("Error in share endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


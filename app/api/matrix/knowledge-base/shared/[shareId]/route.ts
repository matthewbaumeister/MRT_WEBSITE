import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const shareId = params.shareId;

    if (!shareId) {
      return NextResponse.json(
        { error: "Share ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the share configuration
    const { data, error } = await supabase
      .from("knowledge_base_shares")
      .select("*")
      .eq("share_id", shareId)
      .single();

    if (error || !data) {
      console.error("Error retrieving share:", error);
      return NextResponse.json(
        { error: "Share link not found or expired" },
        { status: 404 }
      );
    }

    // Return the configuration (no auth required for public access)
    return NextResponse.json({
      share_id: data.share_id,
      table_name: data.table_name,
      search_query: data.search_query,
      search_mode: data.search_mode,
      sort_column: data.sort_column,
      sort_direction: data.sort_direction,
      page_size: data.page_size,
      created_at: data.created_at,
    });
  } catch (error) {
    console.error("Error in shared view endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


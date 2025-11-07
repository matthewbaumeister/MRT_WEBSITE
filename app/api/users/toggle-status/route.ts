import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, isActive } = body;

    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid parameters" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    const { error } = await supabase
      .from("users")
      .update({ is_active: isActive })
      .eq("id", userId);

    if (error) {
      console.error("Error toggling user status:", error);
      return NextResponse.json(
        { error: "Failed to update user status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `User ${isActive ? "activated" : "deactivated"} successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Toggle status API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user status" },
      { status: 500 }
    );
  }
}


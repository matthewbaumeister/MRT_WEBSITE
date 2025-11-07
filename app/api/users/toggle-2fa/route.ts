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
    const { userId, twoFactorEnabled } = body;

    if (!userId || typeof twoFactorEnabled !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid parameters" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    const { error } = await supabase
      .from("users")
      .update({ two_factor_enabled: twoFactorEnabled })
      .eq("id", userId);

    if (error) {
      console.error("Error toggling 2FA:", error);
      return NextResponse.json(
        { error: "Failed to update 2FA status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `2FA ${twoFactorEnabled ? "enabled" : "disabled"} successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Toggle 2FA API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update 2FA status" },
      { status: 500 }
    );
  }
}


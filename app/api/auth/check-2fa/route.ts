import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Check if user exists and has 2FA enabled
    const { data: user, error } = await supabase
      .from("users")
      .select("two_factor_enabled")
      .eq("email", email)
      .single();

    if (error || !user) {
      // Don't reveal if user exists
      return NextResponse.json(
        { requires2FA: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { requires2FA: user.two_factor_enabled || false },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Check 2FA error:", error);
    return NextResponse.json(
      { requires2FA: false },
      { status: 200 }
    );
  }
}


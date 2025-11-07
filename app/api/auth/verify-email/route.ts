import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { verifyTwoFactorCode } from "@/lib/two-factor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Verify the code
    const isValid = verifyTwoFactorCode(email, code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Activate the user account
    const supabase = getSupabaseClient();
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_active: true })
      .eq("email", email);

    if (updateError) {
      console.error("Error activating user:", updateError);
      return NextResponse.json(
        { error: "Failed to activate account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email verified successfully! You can now login." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
}


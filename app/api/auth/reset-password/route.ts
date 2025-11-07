import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Verify token from verification_codes table
    const { data: tokenData, error: tokenError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("code", token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    if (Date.now() > expiresAt.getTime()) {
      // Delete expired token
      await supabase
        .from("verification_codes")
        .delete()
        .eq("code", token);
      
      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("email", tokenData.email);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Delete used token
    await supabase
      .from("verification_codes")
      .delete()
      .eq("code", token);

    return NextResponse.json(
      { message: "Password successfully reset" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}


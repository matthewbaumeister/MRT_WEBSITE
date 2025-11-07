import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/sendgrid";

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
    
    // Get user details first
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update 2FA status
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

    // Send email notification
    await sendEmail({
      to: user.email,
      from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
      subject: `Two-Factor Authentication ${twoFactorEnabled ? "Enabled" : "Disabled"} for Your Account`,
      text: `
Hello ${user.first_name || ''},

Two-factor authentication (2FA) has been ${twoFactorEnabled ? "enabled" : "disabled"} for your Make Ready account by an administrator.

${twoFactorEnabled ? "From now on, you will receive a verification code via email each time you log in." : "You will no longer need to enter a verification code when logging in."}

Changed by: ${session.user.name || session.user.email}

If you have questions about this change, contact us at info@make-ready-consulting.com

Best regards,
Make Ready Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2F2F72;">2FA ${twoFactorEnabled ? "Enabled" : "Disabled"}</h2>
          <p>Hello ${user.first_name || ''},</p>
          <p>Two-factor authentication (2FA) has been <strong>${twoFactorEnabled ? "enabled" : "disabled"}</strong> for your Make Ready account by an administrator.</p>
          ${twoFactorEnabled ? '<p>From now on, you will receive a verification code via email each time you log in for added security.</p>' : '<p>You will no longer need to enter a verification code when logging in.</p>'}
          <p style="font-size: 14px; color: #666; margin-top: 20px;">Changed by: ${session.user.name || session.user.email}</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated email from Make Ready Consulting.
          </p>
        </div>
      `,
    });

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


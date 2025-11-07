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
    const { userId, isActive } = body;

    if (!userId || typeof isActive !== "boolean") {
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

    // Update status
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

    // Send email notification
    await sendEmail({
      to: user.email,
      from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
      subject: `Your Make Ready Account Has Been ${isActive ? "Activated" : "Deactivated"}`,
      text: `
Hello ${user.first_name || ''},

Your Make Ready account has been ${isActive ? "activated" : "deactivated"} by an administrator.

${isActive ? "You can now log in and access your account at https://makereadytech.com/login" : "You will no longer be able to access your account. If you believe this is an error, please contact support."}

Changed by: ${session.user.name || session.user.email}

If you have questions, contact us at info@make-ready-consulting.com

Best regards,
Make Ready Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2F2F72;">Account ${isActive ? "Activated" : "Deactivated"}</h2>
          <p>Hello ${user.first_name || ''},</p>
          <p>Your Make Ready account has been <strong>${isActive ? "activated" : "deactivated"}</strong> by an administrator.</p>
          ${isActive ? '<p>You can now log in and access your account at <a href="https://makereadytech.com/login" style="color: #2F2F72;">https://makereadytech.com/login</a></p>' : '<p>You will no longer be able to access your account. If you believe this is an error, please contact support.</p>'}
          <p style="font-size: 14px; color: #666; margin-top: 20px;">Changed by: ${session.user.name || session.user.email}</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated email from Make Ready Consulting.
          </p>
        </div>
      `,
    });

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


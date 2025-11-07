import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { generateTwoFactorCode, storeTwoFactorCode } from "@/lib/two-factor";
import { sendEmail } from "@/lib/sendgrid";

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

    // Check if user exists and needs verification
    const supabase = getSupabaseServiceClient();
    const { data: user } = await supabase
      .from("users")
      .select("email, first_name, last_name, is_active")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    if (user.is_active) {
      return NextResponse.json(
        { error: "Account is already verified. Please login." },
        { status: 400 }
      );
    }

    // Generate and send new verification code
    const verificationCode = generateTwoFactorCode();
    await storeTwoFactorCode(email, verificationCode);

    const emailResult = await sendEmail({
      to: email,
      from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
      subject: "Verify Your Make Ready Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2F2F72; margin: 0; font-weight: 600;">MAKE READY</h1>
            <p style="color: #666; margin: 5px 0;">Welcome!</p>
          </div>
          
          <h2 style="color: #2F2F72;">Verify Your Email Address</h2>
          
          <p>Hello ${user.first_name || ''} ${user.last_name || ''},</p>
          
          <p>Please verify your email address using the code below:</p>
          
          <div style="background: linear-gradient(-138deg, #D4AF37 0%, #F4D479 50%, #D4AF37 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <p style="margin: 0 0 10px 0; color: #2F2F72; font-size: 14px; font-weight: bold;">VERIFICATION CODE</p>
            <h1 style="margin: 0; font-size: 48px; color: #2F2F72 !important; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${verificationCode}
            </h1>
          </div>
          
          <div style="background-color: #FFF9E0; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>⏱ This code will expire in 10 minutes.</strong>
            </p>
          </div>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    return NextResponse.json(
      { message: "Verification code sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "An error occurred while sending verification code" },
      { status: 500 }
    );
  }
}


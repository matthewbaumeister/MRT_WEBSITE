import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/sendgrid";
import crypto from "crypto";

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

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("email", email)
      .single();

    // Always return success to prevent email enumeration attacks
    if (userError || !user) {
      console.log("User not found for password reset:", email);
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive reset instructions." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store reset token in verification_codes table
    const { error: storeError } = await supabase
      .from("verification_codes")
      .insert([
        {
          email: user.email,
          code: resetToken,
          expires_at: expiresAt.toISOString(),
        },
      ]);

    if (storeError) {
      console.error("Error storing reset token:", storeError);
      return NextResponse.json(
        { error: "Failed to generate reset token" },
        { status: 500 }
      );
    }

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: user.email,
      from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
      subject: "Reset Your Make Ready Password",
      text: `
Hello ${user.first_name || ''},

You requested to reset your password for your Make Ready account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
Make Ready Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2F2F72; margin: 0; font-weight: 600;">MAKE READY</h1>
            <p style="color: #666; margin: 5px 0;">Password Reset</p>
          </div>
          
          <h2 style="color: #2F2F72;">Reset Your Password</h2>
          
          <p>Hello ${user.first_name || ''},</p>
          
          <p>You requested to reset your password for your Make Ready account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(-138deg, #2F2F72 0%, #6464AA 100%); 
                      color: #FFFFFF !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; font-size: 16px;">
              <span style="color: #FFFFFF !important;">Reset Password</span>
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #2F2F72; word-break: break-all; font-size: 12px;">
            ${resetUrl}
          </p>
          
          <div style="background-color: #FFF9E0; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>⏱ This link will expire in 1 hour.</strong>
            </p>
          </div>
          
          <p style="color: #666;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated email from Make Ready Consulting.<br>
            If you have concerns, contact us at info@make-ready-consulting.com<br>
            <br>
            <strong>Do not reply to this email.</strong>
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "If an account exists with this email, you will receive reset instructions." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}


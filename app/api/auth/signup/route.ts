import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { generateTwoFactorCode, storeTwoFactorCode } from "@/lib/two-factor";
import { sendEmail } from "@/lib/sendgrid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, company, phone } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for user creation
    const supabase = getSupabaseServiceClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, is_active")
      .eq("email", email)
      .single();

    if (existingUser) {
      // If user exists but isn't verified, resend verification code
      if (existingUser.is_active === false) {
        console.log("User exists but not verified, resending code");
        
        // Generate new verification code
        const verificationCode = generateTwoFactorCode();
        await storeTwoFactorCode(email, verificationCode);

        // Send verification email
        await sendEmail({
          to: email,
          from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
          subject: "Verify Your Make Ready Account",
          text: `
Hello,

You're trying to access your Make Ready account. Please verify your email using the code below:

Your verification code is: ${verificationCode}

This code expires in 10 minutes.

Best regards,
Make Ready Team
          `,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2F2F72;">Verify Your Email Address</h2>
              <p>Hello,</p>
              <p>You're trying to access your Make Ready account. Please verify your email using the code below:</p>
              <div style="background: linear-gradient(-138deg, #D4AF37 0%, #F4D479 50%, #D4AF37 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
                <h1 style="margin: 0; font-size: 48px; color: #2F2F72 !important; font-weight: bold; letter-spacing: 8px;">
                  ${verificationCode}
                </h1>
              </div>
              <p style="color: #666; font-size: 14px;"><strong>This code expires in 10 minutes.</strong></p>
            </div>
          `,
        });

        return NextResponse.json(
          {
            message: "Account exists but not verified. A new verification code has been sent.",
            email: email,
            needsVerification: true,
          },
          { status: 200 }
        );
      }
      
      // User exists and is verified
      return NextResponse.json(
        { error: "An account with this email already exists. Please login instead." },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (starts as 'client' role, inactive until email verified)
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role: "general", // New signups default to general role
          two_factor_enabled: false,
          is_active: false, // Inactive until email verified
        },
      ])
      .select()
      .single();

    if (createError || !newUser) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // Generate verification code
    const verificationCode = generateTwoFactorCode();
    storeTwoFactorCode(email, verificationCode);

    // Send verification email
    const emailResult = await sendEmail({
      to: email,
      from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
      subject: "Verify Your Make Ready Account",
      text: `
Hello ${firstName} ${lastName},

Welcome to Make Ready! Please verify your email address to complete your registration.

Your verification code is: ${verificationCode}

This code will expire in 10 minutes.

If you did not create this account, please ignore this email.

Best regards,
Make Ready Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2F2F72; margin: 0; font-weight: 600;">MAKE READY</h1>
            <p style="color: #666; margin: 5px 0;">Welcome!</p>
          </div>
          
          <h2 style="color: #2F2F72;">Verify Your Email Address</h2>
          
          <p>Hello ${firstName} ${lastName},</p>
          
          <p>Welcome to Make Ready! To complete your registration and access our platforms, please verify your email address using the code below:</p>
          
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
          
          <p style="color: #666; font-size: 14px;">If you did not create this account, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated email from Make Ready Consulting.<br>
            Please do not reply to this message.
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email to verify.",
        email: email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign up" },
      { status: 500 }
    );
  }
}


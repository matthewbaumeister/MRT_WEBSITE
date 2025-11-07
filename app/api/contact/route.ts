import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/sendgrid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    console.log("Contact form submission received:", { firstName, lastName, email, subject });

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please contact us directly at info@make-ready-consulting.com" },
        { status: 500 }
      );
    }

    console.log("Attempting to send email via SendGrid...");

    // Send email via SendGrid
    const result = await sendContactFormEmail({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    if (!result.success) {
      console.error("SendGrid error:", result.error);
      throw new Error(result.error || "Failed to send email");
    }

    console.log("Email sent successfully!");
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to send email. Please contact us directly at info@make-ready-consulting.com" },
      { status: 500 }
    );
  }
}


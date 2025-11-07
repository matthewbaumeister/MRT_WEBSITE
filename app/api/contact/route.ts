import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail, sendCustomerConfirmationEmail } from "@/lib/sendgrid";
import { getSupabaseClient, generateTicketNumber } from "@/lib/supabase";

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

    // Generate ticket number
    const ticketNumber = generateTicketNumber();
    console.log("Generated ticket number:", ticketNumber);

    // Save to Supabase
    const supabase = getSupabaseClient();
    const { data, error: dbError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          ticket_number: ticketNumber,
          first_name: firstName,
          last_name: lastName,
          email: email,
          subject: subject,
          message: message,
          status: "open",
        },
      ])
      .select();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save submission");
    }

    console.log("Saved to database successfully");

    // Send email to company
    const companyEmailResult = await sendContactFormEmail({
      firstName,
      lastName,
      email,
      subject,
      message,
      ticketNumber,
    });

    if (!companyEmailResult.success) {
      console.error("Failed to send company email:", companyEmailResult.error);
    }

    // Send confirmation email to customer
    const customerEmailResult = await sendCustomerConfirmationEmail({
      firstName,
      lastName,
      email,
      subject,
      ticketNumber,
    });

    if (!customerEmailResult.success) {
      console.error("Failed to send customer confirmation:", customerEmailResult.error);
    }

    console.log("Emails sent successfully!");
    return NextResponse.json(
      { 
        message: "Thank you for your message! We'll get back to you soon.",
        ticketNumber: ticketNumber
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to process your request. Please contact us directly at info@make-ready-consulting.com" },
      { status: 500 }
    );
  }
}


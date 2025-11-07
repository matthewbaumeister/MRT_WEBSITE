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
    const { userId, newTier } = body;

    if (!userId || !newTier) {
      return NextResponse.json(
        { error: "User ID and new tier are required" },
        { status: 400 }
      );
    }

    if (!["free", "pro", "enterprise", "none"].includes(newTier)) {
      return NextResponse.json(
        { error: "Invalid tier. Must be free, pro, enterprise, or none" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Get user details
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

    // Update subscription tier
    const { error: updateError } = await supabase
      .from("users")
      .update({ subscription_tier: newTier })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating subscription tier:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription tier" },
        { status: 500 }
      );
    }

    // Send email notification to user
    const tierName = newTier === "free" ? "Free" : newTier === "pro" ? "Pro" : newTier === "enterprise" ? "Enterprise" : "No Subscription";
    
    await sendEmail({
      to: user.email,
      from: process.env.EMAIL_FROM || "info@make-ready-consulting.com",
      subject: `Your Make Ready Subscription Has Been Updated`,
      text: `
Hello ${user.first_name || ''},

Your Make Ready subscription tier has been updated to: ${tierName}

${newTier === "pro" ? "You now have access to premium features including:\n- Advanced Matrix analytics\n- Priority support\n- Extended data exports\n- Custom reporting" : ""}
${newTier === "free" ? "You have access to basic features. Upgrade to Pro for more advanced capabilities!" : ""}

If you have questions, contact us at info@make-ready-consulting.com

Best regards,
Make Ready Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2F2F72; margin: 0; font-weight: 600;">MAKE READY</h1>
            <p style="color: #666; margin: 5px 0;">Subscription Update</p>
          </div>
          
          <h2 style="color: #2F2F72;">Subscription Updated</h2>
          
          <p>Hello ${user.first_name || ''},</p>
          
          <p>Your Make Ready subscription tier has been updated to:</p>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" style="background: #2F2F72; border-radius: 8px;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <h3 style="margin: 0; font-size: 24px; font-weight: bold; color: #FFFFFF; font-family: Arial, sans-serif;">${tierName.toUpperCase()}</h3>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #FFFFFF; font-family: Arial, sans-serif;">Subscription Tier</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          ${newTier === "pro" ? `
          <div style="background-color: #F0F4FF; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #2F2F72;">Pro Features Now Available:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
              <li>Advanced Matrix analytics</li>
              <li>Priority support</li>
              <li>Extended data exports</li>
              <li>Custom reporting</li>
              <li>API access</li>
            </ul>
          </div>
          ` : ''}
          
          ${newTier === "free" ? `
          <div style="background-color: #FFF9E0; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">
              You have access to basic features. Want more?<br>
              <strong>Upgrade to Pro for advanced capabilities!</strong>
            </p>
          </div>
          ` : ''}
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" style="background: #2F2F72; border-radius: 8px;">
                  <tr>
                    <td style="padding: 14px 32px; text-align: center;">
                      <a href="${process.env.NEXTAUTH_URL}/platforms" 
                         style="color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; display: block;">
                        Access MRT Platforms
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <p style="color: #666;">If you have questions about your subscription, contact us at info@make-ready-consulting.com</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated email from Make Ready Consulting.<br>
            Changed by: ${session.user.name || session.user.email}<br>
            <br>
            <strong>Do not reply to this email.</strong>
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        message: "Subscription tier updated successfully",
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          tier: newTier,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating subscription tier:", error);
    return NextResponse.json(
      { error: "Failed to update subscription tier" },
      { status: 500 }
    );
  }
}


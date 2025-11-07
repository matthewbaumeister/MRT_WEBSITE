import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { sendRoleChangeNotificationEmail } from "@/lib/sendgrid";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, newRole } = body;

    // Validate inputs
    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "User ID and new role are required" },
        { status: 400 }
      );
    }

    if (!["admin", "employee", "client"].includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, employee, or client" },
        { status: 400 }
      );
    }

    // Prevent users from changing their own role (security measure)
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot change your own role. Ask another admin to change it for you." },
        { status: 403 }
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

    // Update user role
    const { error: updateError } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user role:", updateError);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }

    // Send email notification to user
    const emailResult = await sendRoleChangeNotificationEmail({
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      newRole,
      changedBy: session.user.name || session.user.email || "Administrator",
    });

    if (!emailResult.success) {
      console.error("Failed to send role change email:", emailResult.error);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: "User role updated successfully",
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: newRole,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    console.log("=== DATABASE TEST ===");
    
    // Test 1: Can we connect to Supabase?
    const supabase = getSupabaseServiceClient();
    console.log("✓ Supabase client created");
    
    // Test 2: Can we query the users table?
    const { data: users, error: queryError } = await supabase
      .from("users")
      .select("email, role, is_active")
      .limit(5);
    
    if (queryError) {
      console.error("✗ Query error:", queryError);
      return NextResponse.json({
        success: false,
        error: "Query failed",
        details: queryError,
      });
    }
    
    console.log("✓ Query successful, found", users?.length, "users");
    
    // Test 3: Can we find the admin user?
    const { data: adminUser, error: adminError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "admin@make-ready-consulting.com")
      .single();
    
    if (adminError) {
      console.error("✗ Admin user not found:", adminError);
      return NextResponse.json({
        success: false,
        error: "Admin user not found",
        details: adminError,
      });
    }
    
    console.log("✓ Admin user found");
    
    // Test 4: Can we verify the admin password?
    const testPassword = "ChangeThisPassword123!";
    const passwordValid = await bcrypt.compare(testPassword, adminUser.password_hash);
    
    console.log("✓ Password verification:", passwordValid ? "VALID" : "INVALID");
    
    return NextResponse.json({
      success: true,
      tests: {
        supabaseConnection: "✓ Connected",
        queryUsers: `✓ Found ${users?.length} users`,
        adminUser: "✓ Found",
        adminPassword: passwordValid ? "✓ Valid" : "✗ Invalid",
      },
      users: users?.map(u => ({ email: u.email, role: u.role, is_active: u.is_active })),
      adminDetails: {
        email: adminUser.email,
        role: adminUser.role,
        is_active: adminUser.is_active,
        two_factor_enabled: adminUser.two_factor_enabled,
      },
    });
  } catch (error: any) {
    console.error("=== DATABASE TEST FAILED ===", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}


import bcrypt from "bcryptjs";

/**
 * Script to generate a hashed password for the admin user
 * Usage: npx ts-node scripts/create-admin.ts
 */

async function createAdmin() {
  const email = "admin@make-ready-consulting.com";
  const password = "ChangeThisPassword123!"; // CHANGE THIS!
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log("\n=== Admin User Credentials ===");
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("\nHashed Password (use this in lib/auth-config.ts):");
  console.log(hashedPassword);
  console.log("\n⚠️  IMPORTANT: Change the default password after first login!");
  console.log("============================\n");
}

createAdmin();


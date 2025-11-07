import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@/types/auth";
import { getSupabaseServiceClient } from "./supabase";
import {
  generateTwoFactorCode,
  sendTwoFactorEmail,
  storeTwoFactorCode,
  verifyTwoFactorCode,
} from "./two-factor";

// Get user from Supabase database
async function getUserByEmail(email: string) {
  try {
    // Use service role to bypass RLS for authentication
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.first_name && data.last_name 
        ? `${data.first_name} ${data.last_name}`.trim()
        : data.email.split('@')[0], // Use email prefix as fallback
      password: data.password_hash,
      role: data.role,
      twoFactorEnabled: data.two_factor_enabled,
      twoFactorSecret: data.two_factor_secret,
      isActive: data.is_active !== undefined ? data.is_active : true, // Default to true if column doesn't exist
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Update last login time
async function updateLastLogin(userId: string) {
  try {
    // Use service role to bypass RLS
    const supabase = getSupabaseServiceClient();
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", userId);
  } catch (error) {
    console.error("Error updating last login:", error);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "2FA Token", type: "text", optional: true },
      },
      async authorize(credentials) {
        try {
          console.log("=== LOGIN ATTEMPT ===");
          console.log("Email:", credentials?.email);
          console.log("Password provided:", !!credentials?.password);
          
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          // Get user from Supabase
          console.log("Fetching user from database...");
          const user = await getUserByEmail(credentials.email);
          
          if (!user) {
            console.log("User not found in database");
            return null;
          }
          
          console.log("User found:", {
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            twoFactorEnabled: user.twoFactorEnabled
          });

          // Verify password
          console.log("Verifying password...");
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isValidPassword);

          if (!isValidPassword) {
            console.log("Password verification failed");
            return null;
          }

          // Check if account is active (email verified)
          // Only check if is_active exists and is explicitly false
          if (user.isActive === false) {
            console.log("Login blocked: Account not verified for", credentials.email);
            return null;
          }

          // Check 2FA if enabled (Email-based 2FA via SendGrid)
          if (user.twoFactorEnabled) {
            if (!credentials.token) {
              // Generate and send 2FA code via email
              const code = generateTwoFactorCode();
              await storeTwoFactorCode(user.email, code);
              
              await sendTwoFactorEmail({
                email: user.email,
                name: user.name,
                code,
              });
              
              console.log("2FA code sent");
              return null;
            }

            // Verify the code entered by user
            const verified = await verifyTwoFactorCode(user.email, credentials.token);
            
            if (!verified) {
              console.log("2FA verification failed");
              return null;
            }
          }

          // Update last login time
          await updateLastLogin(user.id);

          console.log("=== LOGIN SUCCESSFUL ===");
          
          // Return user object (exclude sensitive data)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error("=== LOGIN ERROR ===", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  debug: true, // Enable debug mode to see detailed logs
  callbacks: {
    async jwt({ token, user }) {
      try {
        console.log("[JWT Callback] Input:", { hasUser: !!user, hasToken: !!token });
        if (user) {
          token.role = user.role;
          token.id = user.id;
          console.log("[JWT Callback] Added role and id to token");
        }
        console.log("[JWT Callback] Success");
        return token;
      } catch (error) {
        console.error("[JWT Callback] ERROR:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        console.log("[Session Callback] Input:", { hasSession: !!session, hasToken: !!token });
        if (session?.user && token) {
          session.user.role = (token.role as string) || "client";
          session.user.id = (token.id as string) || "";
          console.log("[Session Callback] Set role:", session.user.role);
        }
        console.log("[Session Callback] Success");
        return session;
      } catch (error) {
        console.error("[Session Callback] ERROR:", error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


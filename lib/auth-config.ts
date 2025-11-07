import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@/types/auth";
import { getSupabaseClient } from "./supabase";
import {
  generateTwoFactorCode,
  sendTwoFactorEmail,
  storeTwoFactorCode,
  verifyTwoFactorCode,
} from "./two-factor";

// Get user from Supabase database
async function getUserByEmail(email: string) {
  try {
    const supabase = getSupabaseClient();
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
    const supabase = getSupabaseClient();
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Get user from Supabase
        const user = await getUserByEmail(credentials.email);
        
        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        // Check if account is active (email verified)
        // Only check if is_active exists and is explicitly false
        if (user.isActive === false) {
          console.log("Login blocked: Account not verified for", credentials.email);
          throw new Error("Please verify your email before logging in. Check your inbox for the verification code.");
        }

        // Check 2FA if enabled (Email-based 2FA via SendGrid)
        if (user.twoFactorEnabled) {
          if (!credentials.token) {
            // Generate and send 2FA code via email
            const code = generateTwoFactorCode();
            storeTwoFactorCode(user.email, code);
            
            await sendTwoFactorEmail({
              email: user.email,
              name: user.name,
              code,
            });
            
            throw new Error("2FA_CODE_SENT");
          }

          // Verify the code entered by user
          const verified = verifyTwoFactorCode(user.email, credentials.token);
          
          if (!verified) {
            throw new Error("Invalid or expired verification code");
          }
        }

        // Update last login time
        await updateLastLogin(user.id);

        // Return user object (exclude sensitive data)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


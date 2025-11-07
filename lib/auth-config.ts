import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@/types/auth";

// This is a temporary in-memory user store
// In production, replace with database (Supabase, PostgreSQL, etc.)
const users: User[] = [
  // Default admin user - CHANGE THIS PASSWORD IN PRODUCTION
  {
    id: "1",
    email: "admin@make-ready-consulting.com",
    name: "Admin",
    password: "$2a$10$YourHashedPasswordHere", // This will be replaced
    role: "admin",
    twoFactorEnabled: false,
  },
];

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

        // Find user (replace with database query)
        const user = users.find((u) => u.email === credentials.email);
        
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

        // Check 2FA if enabled
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.token) {
            throw new Error("2FA token required");
          }

          const speakeasy = require("speakeasy");
          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: credentials.token,
            window: 2,
          });

          if (!verified) {
            throw new Error("Invalid 2FA token");
          }
        }

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
    signIn: "/admin/login",
    error: "/admin/login",
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


import { createClient } from "@supabase/supabase-js";

// Create Supabase client lazily to avoid build-time errors
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Create Supabase client with service role key (bypasses RLS)
// Use this for backend operations like signup, auth, admin functions
export function getSupabaseServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase service role environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Generate unique ticket number
export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MRT-${timestamp}-${random}`;
}

// Database types
export interface ContactSubmission {
  id: string;
  ticket_number: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
}


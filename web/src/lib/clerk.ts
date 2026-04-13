import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Service role client for server-side operations (bypasses RLS)
// Uses SUPABASE_SERVICE_ROLE_KEY for admin operations
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Prefer service role key for server operations, fallback to anon key for local dev
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// Get the current user ID from Clerk session
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session.userId;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId !== null;
}

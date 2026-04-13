import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Service role client for server-side operations (bypasses RLS)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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

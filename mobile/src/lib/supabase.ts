import { createClient } from "@supabase/supabase-js";

// Read-only Supabase client for the mobile app.
// All mutations go through the River Rats API (packages/api or web/api routes)
// which use the service role key server-side.
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
  }
);

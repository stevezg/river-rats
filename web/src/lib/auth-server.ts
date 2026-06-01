import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;

  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("id", sessionToken)
    .single();

  if (error || !session) return null;
  if (new Date(session.expires_at) < new Date()) {
    // Clean up expired session
    await supabase.from("sessions").delete().eq("id", sessionToken);
    cookieStore.delete("session_token");
    return null;
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, email, display_name, username, skill_level, avatar_url")
    .eq("id", session.user_id)
    .single();

  return user || null;
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

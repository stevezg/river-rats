import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase/service";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomUUID();
}

export async function createSession(userId: string): Promise<string> {
  const supabase = createServiceClient();
  const token = generateSessionToken();

  const { error } = await supabase
    .from("sessions")
    .insert({
      id: token,
      user_id: userId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

  if (error) throw error;
  return token;
}

export async function validateSession(token: string): Promise<{ userId: string; email: string; displayName: string } | null> {
  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("id", token)
    .single();

  if (error || !session) return null;
  if (new Date(session.expires_at) < new Date()) return null;

  const { data: user } = await supabase
    .from("users")
    .select("id, email, display_name")
    .eq("id", session.user_id)
    .single();

  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    displayName: user.display_name,
  };
}

export async function deleteSession(token: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("sessions").delete().eq("id", token);
}

import { currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  clerkUserId: string;
  username: string;
  displayName: string;
  skillLevel: string;
  homeRiverSlug: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

function mapRow(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    clerkUserId: row.clerk_user_id as string,
    username: row.username as string,
    displayName: row.display_name as string,
    skillLevel: row.skill_level as string,
    homeRiverSlug: (row.home_river_slug as string | null) ?? null,
    bio: (row.bio as string | null) ?? null,
    avatarUrl: (row.avatar_url as string | null) ?? null,
  };
}

const SELECT =
  "id, clerk_user_id, username, display_name, skill_level, home_river_slug, bio, avatar_url";

// Returns existing profile or creates one on first Clerk login.
export async function getOrCreateProfile(
  clerkUserId: string
): Promise<Profile | null> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select(SELECT)
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing) return mapRow(existing as Record<string, unknown>);

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const baseUsername = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "") || "paddler";

  const displayName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    baseUsername;

  // Try up to 10 suffixes to find a unique username
  for (let i = 0; i <= 9; i++) {
    const username = i === 0 ? baseUsername : `${baseUsername}${i}`;
    const { data: created, error } = await supabase
      .from("profiles")
      .insert({
        clerk_user_id: clerkUserId,
        username,
        display_name: displayName,
        skill_level: "III",
      })
      .select(SELECT)
      .single();

    if (!error && created) return mapRow(created as Record<string, unknown>);
    if (error?.code !== "23505") break; // non-uniqueness error — stop retrying
  }

  return null;
}

// Lightweight lookup — just returns the internal profile UUID.
export async function getProfileId(
  clerkUserId: string
): Promise<string | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .single();
  return data?.id ?? null;
}

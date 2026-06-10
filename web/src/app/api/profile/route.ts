import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("users")
    .select("id, email, display_name, username, skill_level, bio, home_river_slug, avatar_url")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ profile: data });
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { displayName, username, skillLevel, bio, homeRiverSlug, avatarUrl } = body;

    const updates: Record<string, unknown> = {};
    if (displayName !== undefined) updates.display_name = displayName.trim();
    if (username !== undefined) updates.username = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (skillLevel !== undefined) updates.skill_level = skillLevel;
    if (bio !== undefined) updates.bio = bio.trim() || null;
    if (homeRiverSlug !== undefined) updates.home_river_slug = homeRiverSlug.trim() || null;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl.trim() || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Check username uniqueness if changing
    if (updates.username && updates.username !== user.username) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("username", updates.username)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

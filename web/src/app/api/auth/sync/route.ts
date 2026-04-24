import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateProfile } from "@/lib/profile";

// GET /api/auth/sync — ensures a Supabase profile exists for the Clerk user.
// Called lazily on first protected page visit.
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getOrCreateProfile(userId);
  if (!profile) {
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

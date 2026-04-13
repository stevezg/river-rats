import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/clerk";

// POST /api/profile - Create a profile for a new user
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, displayName, skillLevel } = await request.json();

    // Verify the requesting user matches the session
    if (userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServiceClient();

    // Create profile in Supabase
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      display_name: displayName,
      skill_level: skillLevel,
    });

    if (error) {
      console.error("Error creating profile:", error);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in profile creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tripId } = await request.json();
    if (!tripId) {
      return NextResponse.json(
        { error: "tripId required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("join_requests")
      .insert({ trip_id: tripId, user_id: user.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join trip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

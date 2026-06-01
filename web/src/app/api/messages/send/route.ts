import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { conversationId, body } = await request.json();
    if (!conversationId || !body?.trim()) {
      return NextResponse.json(
        { error: "Missing conversationId or body" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Verify user is a member of the conversation
    const { data: membership } = await supabase
      .from("conversation_members")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json(
        { error: "Not a member of this conversation" },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: body.trim(),
      })
      .select("id, conversation_id, sender_id, body, created_at, edited_at")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, displayName, skillLevel } = await request.json();

    if (!email || !password || !displayName || !skillLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Generate username from email
    let username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!username) username = "paddler";

    // Ensure username uniqueness
    let counter = 0;
    let candidate = username;
    while (true) {
      const { data: taken } = await supabase
        .from("users")
        .select("id")
        .eq("username", candidate)
        .single();
      if (!taken) break;
      counter++;
      candidate = `${username}${counter}`;
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        display_name: displayName.trim(),
        username: candidate,
        skill_level: skillLevel,
      })
      .select("id")
      .single();

    if (insertError || !user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // Create session
    const sessionToken = await createSession(user.id);

    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

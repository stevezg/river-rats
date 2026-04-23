import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PROTECTED_PATHS = ["/dashboard", "/trips/new"];
const PROTECTED_PATTERN = /^\/u\/[^/]+\/edit$/;

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Check for session token cookie
  const sessionToken = request.cookies.get("session_token")?.value;
  let user = null;

  if (sessionToken) {
    // We can't use the server client here easily in Edge, so we'll check in the layout/components
    // For middleware, we'll just pass the token through and let the server components validate
    // Or we can use a lightweight check
    try {
      // For Edge runtime, we'll do a simple fetch to our own API
      // But that's slow. Instead, we'll validate in server components.
      // Middleware just sets a flag if cookie exists.
      user = { id: "unknown" }; // Placeholder - real check happens in server components
    } catch {
      // Invalid session
    }
  }

  const { pathname } = request.nextUrl;

  const isProtected =
    PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    PROTECTED_PATTERN.test(pathname);

  // For protected routes, we'll redirect to login if no session cookie
  // The actual validation happens in the page server components
  if (isProtected && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

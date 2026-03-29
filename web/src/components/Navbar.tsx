import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavbarSignOut from "@/components/NavbarSignOut";

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let avatarUrl: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();
    displayName = profile?.display_name ?? user.email?.split("@")[0] ?? null;
    avatarUrl = profile?.avatar_url ?? null;
  }

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(15, 17, 23, 0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#4ECDC4" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M9 2C9 2 4 6.5 4 10a5 5 0 0010 0c0-3.5-5-8-5-8z"
                fill="white"
              />
              <path
                d="M3 12.5C5 11.5 7 12 9 11s5-1.5 6 .5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            className="text-xl font-bold tracking-tight transition-colors group-hover:text-[#4ECDC4]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            River Rats
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          {[
            { href: "/rivers", label: "Rivers" },
            { href: "/trips", label: "Trips" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[#8B8FA8] transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#8B8FA8] transition-colors hover:text-white"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth area */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#0F1117] transition-opacity group-hover:opacity-80"
                style={{
                  backgroundColor: avatarUrl ? "transparent" : "#4ECDC4",
                  backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
                  backgroundSize: "cover",
                }}
              >
                {!avatarUrl && getInitials(displayName)}
              </div>
              <span className="hidden text-sm font-medium text-white sm:block">
                {displayName}
              </span>
            </Link>
            <NavbarSignOut />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#8B8FA8] transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

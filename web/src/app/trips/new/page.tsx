import type { Metadata } from "next";
import Link from "next/link";
import NewTripForm from "@/components/NewTripForm";

// This route is protected by middleware — unauthenticated users are redirected to /login.
// To customize the Supabase confirmation email template, go to:
//   Supabase Dashboard → Authentication → Email Templates → Confirm signup
// You can update the subject, body, and redirect URL there to match your domain.

export const metadata: Metadata = {
  title: "Post a Trip | River Rats",
  description: "Post a whitewater trip and find paddling partners at your skill level.",
};

export default function NewTripPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Header */}
      <div
        className="border-b px-4 py-12 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(78, 205, 196, 0.08) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <nav className="mb-5 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/trips" className="transition-colors hover:text-white" style={{ color: "#8B8FA8" }}>
              Trips
            </Link>
            <span style={{ color: "#5c6070" }}>/</span>
            <span style={{ color: "#8B8FA8" }}>New Trip</span>
          </nav>
          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Post a Trip
          </h1>
          <p className="mt-3 text-lg" style={{ color: "#8B8FA8" }}>
            Pick a river, set your date, and find your crew.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            backgroundColor: "#1C1F26",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <NewTripForm />
        </div>
      </div>
    </div>
  );
}

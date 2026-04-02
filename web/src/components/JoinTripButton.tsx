"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export type JoinState =
  | "not-logged-in"
  | "creator"
  | "pending"
  | "member"
  | "full"
  | "open";

interface Props {
  tripId: string;
  initialState: JoinState;
  spotsRemaining: number;
  totalSpots: number;
  /** class to add for width control — pass "w-full" on mobile */
  className?: string;
}

export default function JoinTripButton({
  tripId,
  initialState,
  spotsRemaining,
  totalSpots,
  className = "",
}: Props) {
  const [state, setState] = useState<JoinState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase
      .from("join_requests")
      .insert({ trip_id: tripId });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setState("pending");
    }
  }

  const baseClass = `rounded-xl py-3.5 text-base font-semibold text-[#0F1117] transition-all ${className}`;

  if (state === "not-logged-in") {
    return (
      <Link
        href={`/login?next=/trips/${tripId}`}
        className={`${baseClass} block text-center hover:opacity-90`}
        style={{ backgroundColor: "#4ECDC4" }}
      >
        Sign In to Join
      </Link>
    );
  }

  if (state === "creator") {
    return (
      <button
        disabled
        className={`${baseClass} cursor-not-allowed opacity-50`}
        style={{ backgroundColor: "#5c6070" }}
      >
        Your Trip
      </button>
    );
  }

  if (state === "member") {
    return (
      <button
        disabled
        className={`${baseClass} cursor-not-allowed`}
        style={{ backgroundColor: "rgba(78,205,196,0.20)", color: "#4ECDC4" }}
      >
        ✓ You&apos;re In
      </button>
    );
  }

  if (state === "pending") {
    return (
      <button
        disabled
        className={`${baseClass} cursor-not-allowed`}
        style={{ backgroundColor: "rgba(255,169,77,0.15)", color: "#FFA94D" }}
      >
        Request Pending
      </button>
    );
  }

  if (state === "full") {
    return (
      <button
        disabled
        className={`${baseClass} cursor-not-allowed opacity-50`}
        style={{ backgroundColor: "#5c6070" }}
      >
        Trip Full
      </button>
    );
  }

  // open — can request to join
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full rounded-xl py-3.5 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#4ECDC4" }}
      >
        {loading ? "Sending…" : "Request to Join"}
      </button>
      {error && (
        <p className="text-xs text-center" style={{ color: "#FF6B6B" }}>
          {error}
        </p>
      )}
      <p className="text-center text-xs" style={{ color: "#8B8FA8" }}>
        {spotsRemaining} of {totalSpots} spots remaining
      </p>
    </div>
  );
}

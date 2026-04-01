"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  tripId: string;
  spotsRemaining: number;
  isLoggedIn: boolean;
}

export default function ImmInButton({ tripId, spotsRemaining, isLoggedIn }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "joined" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  if (spotsRemaining === 0) return null;

  async function handleJoin() {
    if (!isLoggedIn) {
      window.location.href = `/login?next=/trips`;
      return;
    }
    setState("loading");
    const { error } = await supabase.rpc("instant_join_trip", { p_trip_id: tripId });
    if (error) {
      setErrorMsg(error.message.includes("Already") ? "You're already on this trip" : "Couldn't join — try again");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    } else {
      setState("joined");
    }
  }

  if (state === "joined") {
    return (
      <div
        className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-[#52B788]"
        style={{ backgroundColor: "rgba(82,183,136,0.12)", border: "1px solid rgba(82,183,136,0.25)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        You're in!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleJoin}
        disabled={state === "loading"}
        className="w-full rounded-xl py-2.5 text-center text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{ backgroundColor: "#4ECDC4" }}
      >
        {state === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Joining…
          </span>
        ) : (
          "I'm In"
        )}
      </button>
      {state === "error" && (
        <p className="text-center text-xs" style={{ color: "#FF6B6B" }}>{errorMsg}</p>
      )}
    </div>
  );
}

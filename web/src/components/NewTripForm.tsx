"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { riversData } from "@riverrats/shared";

const SKILL_LEVELS = ["I-II", "III", "III-IV", "IV", "IV-V", "V", "V+"] as const;

export default function NewTripForm() {
  const router = useRouter();
  const [riverSlug, setRiverSlug] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [totalSpots, setTotalSpots] = useState("6");
  const [minSkill, setMinSkill] = useState("III");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!riverSlug) { setError("Please select a river."); return; }
    setError("");
    setLoading(true);

    const river = riversData.find((r) => r.slug === riverSlug);
    if (!river) { setError("Invalid river selection."); setLoading(false); return; }

    const supabase = createClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) { setError("You must be signed in to post a trip."); setLoading(false); return; }

    const spots = parseInt(totalSpots, 10);

    // Insert trip — spots_remaining starts at total_spots; the trigger will decrement
    // when we insert the creator member row below.
    const { data: trip, error: tripErr } = await supabase
      .from("trips")
      .insert({
        creator_id: user.id,
        river_slug: river.slug,
        river_name: river.name,
        date,
        time,
        meeting_point: meetingPoint,
        total_spots: spots,
        spots_remaining: spots,
        min_skill: minSkill,
        notes: notes || null,
        status: "open",
      })
      .select("id")
      .single();

    if (tripErr || !trip) {
      setError(tripErr?.message ?? "Failed to create trip.");
      setLoading(false);
      return;
    }

    // Insert creator as member (role = 'creator')
    const { error: memberErr } = await supabase.from("trip_members").insert({
      trip_id: trip.id,
      user_id: user.id,
      role: "creator",
    });

    if (memberErr) {
      // Non-fatal for UX — trip was created, navigate anyway
      console.error("trip_members insert error:", memberErr.message);
    }

    router.push(`/trips/${trip.id}`);
  }

  const inputClass =
    "w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#4ECDC4] placeholder:text-[#5c6070]";
  const inputStyle = { backgroundColor: "#1C1F26", borderColor: "rgba(255,255,255,0.10)" };
  const labelClass = "block mb-1.5 text-sm font-medium text-white";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* River */}
      <div>
        <label htmlFor="river" className={labelClass}>River</label>
        <select
          id="river"
          required
          value={riverSlug}
          onChange={(e) => setRiverSlug(e.target.value)}
          className={inputClass + " cursor-pointer"}
          style={inputStyle}
        >
          <option value="">Select a river…</option>
          {[...riversData]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name} — Class {r.difficulty} ({r.state})
              </option>
            ))}
        </select>
      </div>

      {/* Date + Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>Date</label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="time" className={labelClass}>Meet time</label>
          <input
            id="time"
            type="text"
            required
            placeholder="e.g. 8:00 AM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Meeting Point */}
      <div>
        <label htmlFor="meetingPoint" className={labelClass}>Meeting point</label>
        <input
          id="meetingPoint"
          type="text"
          required
          placeholder="e.g. Grizzly Creek Rest Area, I-70 Exit 121"
          value={meetingPoint}
          onChange={(e) => setMeetingPoint(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Total Spots + Min Skill */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="totalSpots" className={labelClass}>Total spots</label>
          <input
            id="totalSpots"
            type="number"
            required
            min={1}
            max={20}
            value={totalSpots}
            onChange={(e) => setTotalSpots(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="minSkill" className={labelClass}>Minimum skill level</label>
          <select
            id="minSkill"
            required
            value={minSkill}
            onChange={(e) => setMinSkill(e.target.value)}
            className={inputClass + " cursor-pointer"}
            style={inputStyle}
          >
            {SKILL_LEVELS.map((s) => (
              <option key={s} value={s}>Class {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes{" "}
          <span className="text-xs font-normal" style={{ color: "#5c6070" }}>
            (optional)
          </span>
        </label>
        <textarea
          id="notes"
          rows={5}
          placeholder="Shuttle info, gear requirements, what to expect…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {error && (
        <p className="text-sm rounded-xl border px-4 py-3" style={{ color: "#FF6B6B", borderColor: "rgba(255,107,107,0.20)", backgroundColor: "rgba(255,107,107,0.06)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3.5 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#4ECDC4" }}
      >
        {loading ? "Posting trip…" : "Post Trip"}
      </button>
    </form>
  );
}

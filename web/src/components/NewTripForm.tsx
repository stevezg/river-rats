"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { riversData } from "@riverrats/shared";

const SKILL_LEVELS = ["I-II", "III", "III-IV", "IV", "IV-V", "V", "V+"] as const;
const TRIP_TYPES = [
  { value: "day", label: "Day Session" },
  { value: "overnight", label: "Overnight" },
  { value: "expedition", label: "Expedition (3+ days)" },
] as const;

export default function NewTripForm() {
  const router = useRouter();
  const [riverSlug, setRiverSlug] = useState("");
  const [tripType, setTripType] = useState<"day" | "overnight" | "expedition">("day");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        riverSlug,
        tripType,
        date,
        endDate: tripType !== "day" ? endDate : undefined,
        time,
        meetingPoint,
        totalSpots: parseInt(totalSpots, 10),
        minSkill,
        notes: notes || undefined,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Failed to create trip.");
      setLoading(false);
      return;
    }

    router.push(`/trips/${json.tripId}`);
  }

  const inputClass =
    "w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#4ECDC4] placeholder:text-[#5c6070]";
  const inputStyle = { backgroundColor: "#1C1F26", borderColor: "rgba(255,255,255,0.10)" };
  const labelClass = "block mb-1.5 text-sm font-medium text-white";

  const isMultiDay = tripType !== "day";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Trip Type */}
      <div>
        <label className={labelClass}>Trip type</label>
        <div className="flex gap-2">
          {TRIP_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTripType(value)}
              className="flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all"
              style={{
                borderColor: tripType === value ? "#4ECDC4" : "rgba(255,255,255,0.10)",
                backgroundColor: tripType === value ? "rgba(78,205,196,0.12)" : "#1C1F26",
                color: tripType === value ? "#4ECDC4" : "#8B8FA8",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

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

      {/* Date(s) */}
      <div className={`grid gap-4 ${isMultiDay ? "sm:grid-cols-2" : ""}`}>
        <div>
          <label htmlFor="date" className={labelClass}>
            {isMultiDay ? "Start date" : "Date"}
          </label>
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
        {isMultiDay && (
          <div>
            <label htmlFor="endDate" className={labelClass}>End date</label>
            <input
              id="endDate"
              type="date"
              required
              min={date}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        )}
      </div>

      {/* Time */}
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
            {isMultiDay ? "(itinerary, gear list, permit info)" : "(optional)"}
          </span>
        </label>
        <textarea
          id="notes"
          rows={5}
          placeholder={
            isMultiDay
              ? "Itinerary, shuttle info, gear requirements, permits needed…"
              : "Shuttle info, gear requirements, what to expect…"
          }
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {error && (
        <p
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            color: "#FF6B6B",
            borderColor: "rgba(255,107,107,0.20)",
            backgroundColor: "rgba(255,107,107,0.06)",
          }}
        >
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

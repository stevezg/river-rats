"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  }

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-2xl border p-8 text-center"
        style={{
          backgroundColor: "rgba(78, 205, 196, 0.08)",
          borderColor: "rgba(78, 205, 196, 0.30)",
        }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
          style={{ backgroundColor: "rgba(78, 205, 196, 0.15)" }}
        >
          🚣
        </div>
        <div>
          <h3
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            You&apos;re on the water!
          </h3>
          <p className="mt-1 text-sm" style={{ color: "#8B8FA8" }}>
            We&apos;ll reach out to {email} when we launch. Get your paddle ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 rounded-xl border px-4 py-3 text-sm text-white placeholder-[#5c6070] outline-none transition-colors focus:border-[#4ECDC4]"
          style={{
            backgroundColor: "#1C1F26",
            borderColor: "rgba(255,255,255,0.12)",
          }}
          aria-label="Your name"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 min-w-0 rounded-xl border px-4 py-3 text-sm text-white placeholder-[#5c6070] outline-none transition-colors focus:border-[#4ECDC4]"
          style={{
            backgroundColor: "#1C1F26",
            borderColor: "rgba(255,255,255,0.12)",
          }}
          aria-label="Your email"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !name.trim() || !email.trim()}
        className="w-full rounded-xl py-3.5 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#4ECDC4" }}
      >
        {loading ? "Joining..." : "Join the Waitlist — Free"}
      </button>
      <p className="text-center text-xs" style={{ color: "#5c6070" }}>
        No spam. We&apos;ll only email you when it matters.
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SkillLevel = "I-II" | "III" | "III-IV" | "IV" | "IV-V" | "V" | "V+";

const SKILL_LEVELS: SkillLevel[] = ["I-II", "III", "III-IV", "IV", "IV-V", "V", "V+"];

function normalizePhone(raw: string): string {
  // Strip everything except digits and the leading +
  const digits = raw.replace(/[^\d+]/g, "");
  // If it starts with +, keep it; otherwise assume US and prepend +1
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits;
}

export default function SignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("III");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone.startsWith("+") || normalizedPhone.length < 8) {
      setError("Please enter a valid phone number with country code (e.g. +13035551234).");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      phone: normalizedPhone,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: displayName, skill_level: skillLevel })
        .eq("id", data.user.id);

      if (profileError) {
        // Non-fatal: profile update failed but auth succeeded
        console.error("Profile update error:", profileError.message);
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0F1117" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Join River Rats
          </h1>
          <p className="text-sm" style={{ color: "#8B8FA8" }}>
            Find paddling partners at your skill level
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#1C1F26" }}
        >
          {/* Error */}
          {error && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(255,107,107,0.06)",
                border: "1px solid rgba(255,107,107,0.25)",
                color: "#FF6B6B",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "#8B8FA8" }}
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                autoComplete="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{
                  backgroundColor: "#0F1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                placeholder="River Runner"
              />
            </div>

            <div>
              <label
                htmlFor="skillLevel"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "#8B8FA8" }}
              >
                Skill Level
              </label>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                style={{
                  backgroundColor: "#0F1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              >
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level} style={{ backgroundColor: "#1C1F26" }}>
                    Class {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "#8B8FA8" }}
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{
                  backgroundColor: "#0F1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                placeholder="+1 (303) 555-1234"
              />
              <p className="mt-1 text-xs" style={{ color: "#5c6070" }}>
                Include country code (e.g. +1 for US)
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "#8B8FA8" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{
                  backgroundColor: "#0F1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F1117]/30 border-t-[#0F1117]" />
              )}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm" style={{ color: "#8B8FA8" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold transition-colors hover:opacity-80"
            style={{ color: "#4ECDC4" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

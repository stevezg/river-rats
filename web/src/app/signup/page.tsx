"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

type SkillLevel = "I-II" | "III" | "III-IV" | "IV" | "IV-V" | "V" | "V+";

const SKILL_LEVELS: SkillLevel[] = ["I-II", "III", "III-IV", "IV", "IV-V", "V", "V+"];

export default function SignupPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("III");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  // Wait for Clerk to load first
  if (!isLoaded) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center" style={{ backgroundColor: "#0F1117" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4ECDC4] border-t-transparent" />
      </div>
    );
  }

  // Redirect if already signed in (after Clerk is loaded)
  if (signUp?.status === "complete") {
    router.push("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Start phone verification
      await signUp.create({
        phoneNumber: phone,
      });

      // Send verification code
      await signUp.preparePhoneNumberVerification();
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      // Verify the code
      const completeSignUp = await signUp.attemptPhoneNumberVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        // Set the session
        await setActive({ session: completeSignUp.createdSessionId });

        // Create profile in Supabase
        const userId = completeSignUp.createdUserId;
        if (userId) {
          await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              displayName,
              skillLevel,
            }),
          });
        }

        router.push("/dashboard");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setVerifying(false);
    }
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

          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="+1 (555) 123-4567"
                />
                <p className="mt-1 text-xs" style={{ color: "#5c6070" }}>
                  Include country code (e.g., +1 for US)
                </p>
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
                {loading ? "Sending code..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-sm" style={{ color: "#8B8FA8" }}>
                  Enter the verification code sent to
                </p>
                <p className="text-white font-medium">{phone}</p>
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: "#8B8FA8" }}
                >
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070] text-center tracking-widest"
                  style={{
                    backgroundColor: "#0F1117",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "1.25rem",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: "#4ECDC4" }}
              >
                {verifying && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F1117]/30 border-t-[#0F1117]" />
                )}
                {verifying ? "Verifying..." : "Verify & Create Account"}
              </button>

              <button
                type="button"
                onClick={() => setPendingVerification(false)}
                className="w-full text-sm text-[#8B8FA8] hover:text-white transition-colors"
              >
                Change phone number
              </button>
            </form>
          )}
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
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
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#8B8FA8" }}>
            Sign in to your River Rats account
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

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "#8B8FA8" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070] focus:ring-2"
                style={{
                  backgroundColor: "#0F1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                placeholder="you@example.com"
              />
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{
                  backgroundColor: "#0F1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                placeholder="••••••••"
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm" style={{ color: "#8B8FA8" }}>
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold transition-colors hover:opacity-80"
            style={{ color: "#4ECDC4" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

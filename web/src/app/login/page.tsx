"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMethod = "email" | "phone";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits;
}

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    let credentials: { email?: string; phone?: string; password: string };

    if (authMethod === "phone") {
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone.startsWith("+") || normalizedPhone.length < 8) {
        setError("Please enter a valid phone number with country code (e.g. +13035551234).");
        setLoading(false);
        return;
      }
      credentials = { phone: normalizedPhone, password };
    } else {
      credentials = { email, password };
    }

    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0F1117" }}
    >
      <div className="w-full max-w-md">
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

        <div className="rounded-2xl p-8" style={{ backgroundColor: "#1C1F26" }}>
          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-semibold text-white transition-all hover:bg-white/5 active:scale-[0.98] disabled:opacity-60"
            style={{ borderColor: "rgba(255,255,255,0.12)" }}
          >
            {googleLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
            )}
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#8B8FA8" }}>or sign in with</span>
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          </div>

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

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Phone toggle */}
            <div>
              <div
                className="mb-3 flex rounded-xl p-1"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {(["email", "phone"] as AuthMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => { setAuthMethod(method); setError(""); }}
                    className="flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all"
                    style={{
                      backgroundColor: authMethod === method ? "#4ECDC4" : "transparent",
                      color: authMethod === method ? "#0F1117" : "#8B8FA8",
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {authMethod === "email" ? (
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                  style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  placeholder="you@example.com"
                />
              ) : (
                <>
                  <input
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                    style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECDC4")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    placeholder="+1 (303) 555-1234"
                  />
                  <p className="mt-1 text-xs" style={{ color: "#5c6070" }}>
                    Include country code (e.g. +1 for US)
                  </p>
                </>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#8B8FA8" }}>
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
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

        <p className="mt-6 text-center text-sm" style={{ color: "#8B8FA8" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold transition-colors hover:opacity-80" style={{ color: "#4ECDC4" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

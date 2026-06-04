"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SKILL_LEVELS = ["I-II", "III", "III-IV", "IV", "IV-V", "V", "V+"];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [skillLevel, setSkillLevel] = useState("III");
  const [bio, setBio] = useState("");
  const [homeRiverSlug, setHomeRiverSlug] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        const p = data.profile;
        if (p) {
          setDisplayName(p.display_name ?? "");
          setUsername(p.username ?? "");
          setSkillLevel(p.skill_level ?? "III");
          setBio(p.bio ?? "");
          setHomeRiverSlug(p.home_river_slug ?? "");
          setAvatarUrl(p.avatar_url ?? "");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName,
        username,
        skillLevel,
        bio,
        homeRiverSlug,
        avatarUrl,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center" style={{ backgroundColor: "#0F1117" }}>
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#4ECDC4]/30 border-t-[#4ECDC4]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-12" style={{ backgroundColor: "#0F1117" }}>
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Edit Profile
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#8B8FA8" }}>
            Update your paddling persona
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#1C1F26" }}
        >
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

          {success && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(82,183,136,0.06)",
                border: "1px solid rgba(82,183,136,0.25)",
                color: "#52B788",
              }}
            >
              Profile saved successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#8B8FA8" }}>
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="River Runner"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#8B8FA8" }}>
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="river_runner"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#8B8FA8" }}>
                Skill Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level} style={{ backgroundColor: "#1C1F26" }}>
                    Class {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#8B8FA8" }}>
                Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)", resize: "vertical" }}
                placeholder="Tell other paddlers about yourself..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#8B8FA8" }}>
                Home River Slug
              </label>
              <input
                type="text"
                value={homeRiverSlug}
                onChange={(e) => setHomeRiverSlug(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="e.g. arkansas-royal-gorge"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#8B8FA8" }}>
                Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]"
                style={{ backgroundColor: "#0F1117", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: "#4ECDC4" }}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <Link
                href="/dashboard"
                className="rounded-xl border px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

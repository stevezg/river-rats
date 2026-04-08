"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Friend, PendingRequestReceived, PendingRequestSent } from "@/lib/friends-types";
import FriendsList from "@/components/FriendsList";
import FriendRequests from "@/components/FriendRequests";
import { Users, UserPlus } from "lucide-react";

export default function FriendsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [received, setReceived] = useState<PendingRequestReceived[]>([]);
  const [sent, setSent] = useState<PendingRequestSent[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends");
      if (res.status === 401) {
        router.push("/login?next=/friends");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch friends");
      const data = await res.json();
      setFriends(data.friends || []);
      setReceived(data.pendingReceived || []);
      setSent(data.pendingSent || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (friendshipId: string) => {
    try {
      const res = await fetch("/api/friends/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId }),
      });
      if (res.ok) {
        fetchFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (friendshipId: string) => {
    try {
      const res = await fetch("/api/friends/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId }),
      });
      if (res.ok) {
        fetchFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (friendshipId: string) => {
    try {
      const res = await fetch("/api/friends/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId }),
      });
      if (res.ok) {
        fetchFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfriend = async (friendshipId: string) => {
    if (!confirm("Remove this friend?")) return;
    try {
      const res = await fetch("/api/friends/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId }),
      });
      if (res.ok) {
        fetchFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0F1117" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4ECDC4] border-t-transparent" />
      </div>
    );
  }

  const pendingCount = received.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Header */}
      <div
        className="border-b px-4 py-10 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(78,205,196,0.08) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Friends
          </h1>
          <p className="mt-2 text-base" style={{ color: "#8B8FA8" }}>
            Connect with your paddling crew
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex gap-6 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "friends"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Users className="h-4 w-4" />
            Friends
            {friends.length > 0 && (
              <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                {friends.length}
              </span>
            )}
            {activeTab === "friends" && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: "#4ECDC4" }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "requests"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Requests
            {pendingCount > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{ backgroundColor: "#4ECDC4", color: "#0F1117" }}
              >
                {pendingCount}
              </span>
            )}
            {activeTab === "requests" && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: "#4ECDC4" }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-10">
        {activeTab === "friends" ? (
          <FriendsList
            friends={friends}
            currentUserId="" // passed from server in real impl
            onUnfriend={handleUnfriend}
          />
        ) : (
          <FriendRequests
            received={received}
            sent={sent}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

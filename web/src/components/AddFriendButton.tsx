"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck, Clock, Loader2 } from "lucide-react";
import type { FriendshipStatusResult } from "@/lib/friends-types";

interface AddFriendButtonProps {
  userId: string;
  displayName: string;
  initialStatus?: FriendshipStatusResult;
  size?: "sm" | "md";
}

export default function AddFriendButton({
  userId,
  displayName,
  initialStatus,
  size = "md",
}: AddFriendButtonProps) {
  const [status, setStatus] = useState<FriendshipStatusResult>(
    initialStatus ?? { status: "none" }
  );
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Check status on mount if not provided
  useEffect(() => {
    if (!initialStatus) {
      checkStatus();
    }
  }, [userId]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/friends/status?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error("Failed to check friendship status:", err);
    }
  };

  const sendRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: userId }),
      });

      if (res.ok) {
        setStatus({ status: "pending_sent" });
        showToastMessage(`Friend request sent to ${displayName}`);
      } else {
        const error = await res.text();
        showToastMessage(error || "Failed to send request");
      }
    } catch (err) {
      showToastMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const buttonClasses =
    size === "sm"
      ? "rounded-full px-3 py-1.5 text-xs font-medium"
      : "rounded-full px-4 py-2 text-sm font-medium";

  // Already friends
  if (status.status === "accepted") {
    return (
      <button
        disabled
        className={`${buttonClasses} flex items-center gap-1.5 bg-green-500/20 text-green-400`}
      >
        <UserCheck className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        <span className="hidden sm:inline">Friends</span>
      </button>
    );
  }

  // Request pending (sent by me)
  if (status.status === "pending_sent") {
    return (
      <button
        disabled
        className={`${buttonClasses} flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400`}
      >
        <Clock className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        <span className="hidden sm:inline">Pending</span>
      </button>
    );
  }

  // Request pending (received from them)
  if (status.status === "pending_received") {
    return (
      <a
        href="/friends"
        className={`${buttonClasses} flex items-center gap-1.5 bg-[#4ECDC4]/20 text-[#4ECDC4] hover:bg-[#4ECDC4]/30 transition-colors`}
      >
        <UserPlus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        <span className="hidden sm:inline">Respond</span>
      </a>
    );
  }

  // Not friends - show add button
  return (
    <>
      <button
        onClick={sendRequest}
        disabled={loading}
        className={`${buttonClasses} flex items-center gap-1.5 transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]`}
        style={{ backgroundColor: "#4ECDC4", color: "#0F1117" }}
      >
        {loading ? (
          <Loader2 className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} animate-spin`} />
        ) : (
          <UserPlus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        )}
        <span className="hidden sm:inline">Add Friend</span>
      </button>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          <div
            className="rounded-full px-4 py-2 text-sm font-medium shadow-lg"
            style={{ backgroundColor: "#1A1D26", color: "#4ECDC4", border: "1px solid rgba(78,205,196,0.3)" }}
          >
            {toastMessage}
          </div>
        </div>
      )}
    </>
  );
}

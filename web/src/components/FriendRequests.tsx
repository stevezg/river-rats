"use client";

import { useState } from "react";
import type { PendingRequestReceived, PendingRequestSent } from "@/lib/friends-types";
import { UserPlus, Check, X, Clock } from "lucide-react";

interface FriendRequestsProps {
  received: PendingRequestReceived[];
  sent: PendingRequestSent[];
  onAccept: (friendshipId: string) => void;
  onDecline: (friendshipId: string) => void;
  onCancel: (friendshipId: string) => void;
}

export default function FriendRequests({
  received,
  sent,
  onAccept,
  onDecline,
  onCancel,
}: FriendRequestsProps) {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  const hasRequests = received.length > 0 || sent.length > 0;

  if (!hasRequests) {
    return (
      <div className="text-center py-8">
        <UserPlus className="mx-auto h-10 w-10 text-gray-600" />
        <p className="mt-3 text-gray-400">No pending friend requests</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <button
          onClick={() => setActiveTab("received")}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === "received" ? "text-white" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Received
          {received.length > 0 && (
            <span
              className="ml-2 rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: "#4ECDC4", color: "#0F1117" }}
            >
              {received.length}
            </span>
          )}
          {activeTab === "received" && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: "#4ECDC4" }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === "sent" ? "text-white" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Sent
          {sent.length > 0 && (
            <span className="ml-2 rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
              {sent.length}
            </span>
          )}
          {activeTab === "sent" && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: "#4ECDC4" }}
            />
          )}
        </button>
      </div>

      {/* Received Requests */}
      {activeTab === "received" && (
        <div className="space-y-3">
          {received.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No pending requests</p>
          ) : (
            received.map((req) => (
              <div
                key={req.friendshipId}
                className="flex items-center justify-between rounded-xl p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-[#0F1117]"
                    style={{ backgroundColor: "#4ECDC4" }}
                  >
                    {req.requesterName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{req.requesterName}</p>
                    <p className="text-xs text-gray-500">wants to be friends</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAccept(req.friendshipId)}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#4ECDC4", color: "#0F1117" }}
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => onDecline(req.friendshipId)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="Decline"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sent Requests */}
      {activeTab === "sent" && (
        <div className="space-y-3">
          {sent.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No pending requests</p>
          ) : (
            sent.map((req) => (
              <div
                key={req.friendshipId}
                className="flex items-center justify-between rounded-xl p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-[#0F1117]"
                    style={{ backgroundColor: "#4ECDC4" }}
                  >
                    {req.recipientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{req.recipientName}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      Pending
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onCancel(req.friendshipId)}
                  className="text-sm text-gray-500 transition-colors hover:text-red-400"
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

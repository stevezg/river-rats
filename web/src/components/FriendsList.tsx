"use client";

import Link from "next/link";
import type { Friend } from "@/lib/friends-types";
import { UserCircle, MessageCircle, X } from "lucide-react";

interface FriendsListProps {
  friends: Friend[];
  currentUserId: string;
  onUnfriend: (friendshipId: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function FriendsList({
  friends,
  onUnfriend,
}: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCircle className="mx-auto h-12 w-12 text-gray-600" />
        <h3 className="mt-4 text-lg font-medium text-white">No friends yet</h3>
        <p className="mt-2 text-gray-400">
          Connect with other paddlers on trips or river pages.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <div
          key={friend.friendshipId}
          className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-white/5"
          style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-[#0F1117]"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              {getInitials(friend.friendName)}
            </div>
            <div>
              <p className="font-medium text-white">{friend.friendName}</p>
              {friend.friendBio && (
                <p className="text-sm text-gray-400 line-clamp-1">
                  {friend.friendBio}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/messages/${friend.friendId}`}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: "#4ECDC4" }}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Message</span>
            </Link>
            <button
              onClick={() => onUnfriend(friend.friendshipId)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
              title="Remove friend"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

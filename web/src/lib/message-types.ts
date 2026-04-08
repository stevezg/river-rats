export interface ConversationSummary {
  id: string;
  type: "trip" | "direct";
  title: string;           // river name for trip, other user's name for DM
  tripId: string | null;
  tripSlug: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastSenderName: string | null;
  unreadCount: number;
  memberCount: number;
  otherUserId?: string;    // for DMs — the other participant
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderInitial: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
  isOwn: boolean;
}

export interface ConversationDetail {
  id: string;
  type: "trip" | "direct";
  title: string;
  tripId: string | null;
  tripSlug: string | null;
  members: Array<{ userId: string; displayName: string; joinedAt: string }>;
}

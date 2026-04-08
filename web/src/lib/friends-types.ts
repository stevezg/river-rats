export interface Friend {
  friendshipId: string;
  friendId: string;
  friendName: string;
  friendBio: string | null;
  friendsSince: string;
}

export interface PendingRequestSent {
  friendshipId: string;
  recipientId: string;
  recipientName: string;
  createdAt: string;
}

export interface PendingRequestReceived {
  friendshipId: string;
  requesterId: string;
  requesterName: string;
  createdAt: string;
}

export type FriendshipStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'declined' | 'blocked';

export interface FriendshipStatusResult {
  status: FriendshipStatus;
  friendshipId?: string;
}

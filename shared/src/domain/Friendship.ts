export type FriendshipStatus = "pending" | "accepted" | "declined" | "blocked";

export interface FriendshipRow {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export class Friendship {
  readonly id: string;
  readonly requesterId: string;
  readonly recipientId: string;
  readonly status: FriendshipStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(row: FriendshipRow) {
    this.id = row.id;
    this.requesterId = row.requester_id;
    this.recipientId = row.recipient_id;
    this.status = row.status;
    this.createdAt = new Date(row.created_at);
    this.updatedAt = new Date(row.updated_at);
  }

  get isAccepted(): boolean {
    return this.status === "accepted";
  }

  get isPending(): boolean {
    return this.status === "pending";
  }

  get isBlocked(): boolean {
    return this.status === "blocked";
  }

  friendId(myId: string): string {
    return this.requesterId === myId ? this.recipientId : this.requesterId;
  }

  involves(userId: string): boolean {
    return this.requesterId === userId || this.recipientId === userId;
  }

  isBetween(userId1: string, userId2: string): boolean {
    return (
      (this.requesterId === userId1 && this.recipientId === userId2) ||
      (this.requesterId === userId2 && this.recipientId === userId1)
    );
  }
}

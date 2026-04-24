export type ConversationType = "trip" | "direct";

export interface ConversationRow {
  id: string;
  type: ConversationType;
  trip_id: string | null;
  title: string | null;
  created_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  edited_at: string | null;
}

export class Message {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly body: string;
  readonly createdAt: Date;
  readonly editedAt: Date | null;

  constructor(row: MessageRow) {
    this.id = row.id;
    this.conversationId = row.conversation_id;
    this.senderId = row.sender_id;
    this.body = row.body;
    this.createdAt = new Date(row.created_at);
    this.editedAt = row.edited_at ? new Date(row.edited_at) : null;
  }

  get isEdited(): boolean {
    return this.editedAt !== null;
  }

  isSentBy(userId: string): boolean {
    return this.senderId === userId;
  }
}

export class Conversation {
  readonly id: string;
  readonly type: ConversationType;
  readonly tripId: string | null;
  readonly title: string | null;
  readonly createdAt: Date;

  constructor(row: ConversationRow) {
    this.id = row.id;
    this.type = row.type;
    this.tripId = row.trip_id;
    this.title = row.title;
    this.createdAt = new Date(row.created_at);
  }

  get isTrip(): boolean {
    return this.type === "trip";
  }

  get isDirect(): boolean {
    return this.type === "direct";
  }

  get displayTitle(): string {
    return this.title ?? (this.isDirect ? "Direct Message" : "Group Chat");
  }
}

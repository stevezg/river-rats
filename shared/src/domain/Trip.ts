import type { DifficultyClass } from "../rivers-data";

export type TripType = "day" | "overnight" | "expedition";
export type TripStatus = "open" | "full" | "cancelled" | "completed";
export type JoinRequestStatus = "pending" | "approved" | "declined";

export interface TripRow {
  id: string;
  creator_id: string;
  river_slug: string;
  river_name: string;
  date: string;
  time: string;
  meeting_point: string;
  notes: string | null;
  min_skill: DifficultyClass;
  total_spots: number;
  spots_remaining: number;
  status: TripStatus;
  trip_type: TripType;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripMemberRow {
  id: string;
  trip_id: string;
  user_id: string;
  role: "creator" | "member";
  joined_at: string;
}

export class TripMember {
  readonly id: string;
  readonly tripId: string;
  readonly userId: string;
  readonly role: "creator" | "member";
  readonly joinedAt: Date;

  constructor(row: TripMemberRow) {
    this.id = row.id;
    this.tripId = row.trip_id;
    this.userId = row.user_id;
    this.role = row.role;
    this.joinedAt = new Date(row.joined_at);
  }

  get isCreator(): boolean {
    return this.role === "creator";
  }
}

export class Trip {
  readonly id: string;
  readonly creatorId: string;
  readonly riverSlug: string;
  readonly riverName: string;
  readonly date: Date;
  readonly time: string;
  readonly meetingPoint: string;
  readonly notes: string | null;
  readonly minSkill: DifficultyClass;
  readonly totalSpots: number;
  readonly spotsRemaining: number;
  readonly status: TripStatus;
  readonly tripType: TripType;
  readonly endDate: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(row: TripRow) {
    this.id = row.id;
    this.creatorId = row.creator_id;
    this.riverSlug = row.river_slug;
    this.riverName = row.river_name;
    this.date = new Date(row.date);
    this.time = row.time;
    this.meetingPoint = row.meeting_point;
    this.notes = row.notes;
    this.minSkill = row.min_skill;
    this.totalSpots = row.total_spots;
    this.spotsRemaining = row.spots_remaining;
    this.status = row.status;
    this.tripType = row.trip_type ?? "day";
    this.endDate = row.end_date ? new Date(row.end_date) : null;
    this.createdAt = new Date(row.created_at);
    this.updatedAt = new Date(row.updated_at);
  }

  get isOpen(): boolean {
    return this.status === "open";
  }

  get isFull(): boolean {
    return this.status === "full";
  }

  get isMultiDay(): boolean {
    return this.tripType !== "day";
  }

  get durationDays(): number {
    if (!this.endDate) return 1;
    const ms = this.endDate.getTime() - this.date.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1;
  }

  hasSpots(): boolean {
    return this.spotsRemaining > 0;
  }

  isCreatedBy(userId: string): boolean {
    return this.creatorId === userId;
  }
}

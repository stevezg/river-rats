import type { DifficultyClass } from "@riverrats/shared";

export type { DifficultyClass };

/**
 * Shape used everywhere a trip needs to be displayed (TripCard, trips page, etc.)
 * Satisfied by both mock data and DB-enriched rows.
 */
export interface TripSummary {
  id: string;
  riverSlug: string;
  riverName: string;
  difficulty: DifficultyClass;
  date: string;           // "2026-04-12"
  time: string;           // "7:30 AM"
  meetingPoint: string;
  notes: string;
  minSkill: DifficultyClass;
  creatorName: string;
  creatorLevel: DifficultyClass;
  totalSpots: number;
  spotsRemaining: number;
  currentCfs: number;
  region: string;
  state: string;
}

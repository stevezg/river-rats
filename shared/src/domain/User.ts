import type { DifficultyClass } from "../rivers-data";

export type SkillLevel = DifficultyClass;

export interface ProfileRow {
  id: string;
  clerk_user_id: string;
  username: string;
  display_name: string;
  skill_level: SkillLevel;
  home_river_slug: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const SKILL_ORDER: SkillLevel[] = ["I-II", "III", "III-IV", "IV", "IV-V", "V", "V+"];

export class User {
  readonly id: string;
  readonly clerkUserId: string;
  readonly username: string;
  readonly displayName: string;
  readonly skillLevel: SkillLevel;
  readonly homeRiverSlug: string | null;
  readonly bio: string | null;
  readonly avatarUrl: string | null;
  readonly createdAt: Date;

  constructor(row: ProfileRow) {
    this.id = row.id;
    this.clerkUserId = row.clerk_user_id;
    this.username = row.username;
    this.displayName = row.display_name;
    this.skillLevel = row.skill_level;
    this.homeRiverSlug = row.home_river_slug;
    this.bio = row.bio;
    this.avatarUrl = row.avatar_url;
    this.createdAt = new Date(row.created_at);
  }

  get initials(): string {
    return this.displayName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  get skillRank(): number {
    return SKILL_ORDER.indexOf(this.skillLevel);
  }

  canRun(minSkill: SkillLevel): boolean {
    return this.skillRank >= SKILL_ORDER.indexOf(minSkill);
  }

  meetsMinimum(tripMinSkill: SkillLevel): boolean {
    return this.canRun(tripMinSkill);
  }
}

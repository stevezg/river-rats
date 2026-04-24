export interface FlowAlertRow {
  id: string;
  user_id: string;
  river_slug: string;
  gauge_id: string;
  min_cfs: number;
  max_cfs: number;
  enabled: boolean;
  last_notified_at: string | null;
  created_at: string;
}

export class FlowAlert {
  readonly id: string;
  readonly userId: string;
  readonly riverSlug: string;
  readonly gaugeId: string;
  readonly minCfs: number;
  readonly maxCfs: number;
  readonly enabled: boolean;
  readonly lastNotifiedAt: Date | null;
  readonly createdAt: Date;

  constructor(row: FlowAlertRow) {
    this.id = row.id;
    this.userId = row.user_id;
    this.riverSlug = row.river_slug;
    this.gaugeId = row.gauge_id;
    this.minCfs = row.min_cfs;
    this.maxCfs = row.max_cfs;
    this.enabled = row.enabled;
    this.lastNotifiedAt = row.last_notified_at
      ? new Date(row.last_notified_at)
      : null;
    this.createdAt = new Date(row.created_at);
  }

  isTriggeredBy(cfs: number): boolean {
    return this.enabled && cfs >= this.minCfs && cfs <= this.maxCfs;
  }

  get windowLabel(): string {
    return `${this.minCfs.toLocaleString()}–${this.maxCfs.toLocaleString()} CFS`;
  }

  get hasBeenNotified(): boolean {
    return this.lastNotifiedAt !== null;
  }
}

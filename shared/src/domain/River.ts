import type { DifficultyClass, RiverStatic } from "../rivers-data";
import type { FlowData, FlowTrend } from "../usgs";

export type FlowStatus = "optimal" | "too_low" | "too_high" | "unknown";

export class River {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly region: string;
  readonly state: string;
  readonly difficulty: DifficultyClass;
  readonly optimalMin: number;
  readonly optimalMax: number;
  readonly description: string;
  readonly hazards: readonly string[];
  readonly gaugeId: string;
  readonly awReachId?: string;

  private readonly _flow: FlowData | null;

  constructor(data: RiverStatic, flow: FlowData | null = null) {
    this.id = data.id;
    this.slug = data.slug;
    this.name = data.name;
    this.region = data.region;
    this.state = data.state;
    this.difficulty = data.difficulty;
    this.optimalMin = data.optimalMin;
    this.optimalMax = data.optimalMax;
    this.description = data.description;
    this.hazards = data.hazards;
    this.gaugeId = data.gaugeId;
    this.awReachId = data.awReachId;
    this._flow = flow;
  }

  get cfs(): number | null {
    return this._flow?.cfs ?? null;
  }

  get trend(): FlowTrend {
    return this._flow?.trend ?? "stable";
  }

  get tempC(): number | undefined {
    return this._flow?.tempC;
  }

  get flowStatus(): FlowStatus {
    const cfs = this.cfs;
    if (cfs === null) return "unknown";
    if (cfs < this.optimalMin) return "too_low";
    if (cfs > this.optimalMax) return "too_high";
    return "optimal";
  }

  get isRunnable(): boolean {
    return this.flowStatus === "optimal";
  }

  withFlow(flow: FlowData): River {
    return new River(this.toStatic(), flow);
  }

  toStatic(): RiverStatic {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      region: this.region,
      state: this.state,
      difficulty: this.difficulty,
      optimalMin: this.optimalMin,
      optimalMax: this.optimalMax,
      description: this.description,
      hazards: [...this.hazards],
      gaugeId: this.gaugeId,
      awReachId: this.awReachId,
    };
  }

  static fromStatic(data: RiverStatic, flow?: FlowData): River {
    return new River(data, flow ?? null);
  }
}

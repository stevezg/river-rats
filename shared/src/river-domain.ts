import type { FlowData, FlowTrend } from "./usgs";
import type { RiverStatic } from "./rivers-data";

export interface River extends RiverStatic {
  currentCfs: number;
  timestamp: string;
  trend: FlowTrend;
  runnable: boolean;
  tempC?: number;
}

export interface FlowStatus {
  label: "Too Low" | "Low Optimal" | "Optimal" | "High Optimal" | "High Water";
  color: string;
}

export interface RiverFlowPolicy {
  isRunnable(cfs: number, river: Pick<RiverStatic, "optimalMin" | "optimalMax">): boolean;
  getStatus(cfs: number, river: Pick<RiverStatic, "optimalMin" | "optimalMax">): FlowStatus;
}

export class DefaultRiverFlowPolicy implements RiverFlowPolicy {
  isRunnable(cfs: number, river: Pick<RiverStatic, "optimalMin" | "optimalMax">): boolean {
    return cfs >= river.optimalMin && cfs <= river.optimalMax * 1.5;
  }

  getStatus(cfs: number, river: Pick<RiverStatic, "optimalMin" | "optimalMax">): FlowStatus {
    if (cfs < river.optimalMin) {
      return { label: "Too Low", color: "#5c6070" };
    }

    if (cfs > river.optimalMax) {
      return { label: "High Water", color: "#FF6B6B" };
    }

    const pct = (cfs - river.optimalMin) / (river.optimalMax - river.optimalMin);
    if (pct < 0.33) return { label: "Low Optimal", color: "#4ECDC4" };
    if (pct < 0.66) return { label: "Optimal", color: "#52B788" };
    return { label: "High Optimal", color: "#FFA94D" };
  }
}

export class RiverFlowSnapshot {
  constructor(
    private readonly river: RiverStatic,
    private readonly flow: FlowData | undefined,
    private readonly policy: RiverFlowPolicy = new DefaultRiverFlowPolicy()
  ) {}

  toRiver(): River {
    const currentCfs = this.flow?.cfs ?? 0;

    return {
      ...this.river,
      currentCfs,
      timestamp: this.flow?.timestamp ?? "",
      trend: this.flow?.trend ?? "stable",
      runnable: this.flow ? this.policy.isRunnable(currentCfs, this.river) : false,
      ...(this.flow?.tempC !== undefined ? { tempC: this.flow.tempC } : {}),
    };
  }
}

export class RiverCatalog {
  private readonly bySlug: Map<string, RiverStatic>;
  private readonly byGaugeId: Map<string, RiverStatic>;

  constructor(
    private readonly rivers: RiverStatic[],
    private readonly policy: RiverFlowPolicy = new DefaultRiverFlowPolicy()
  ) {
    this.bySlug = new Map(rivers.map((river) => [river.slug, river]));
    this.byGaugeId = new Map(rivers.map((river) => [river.gaugeId, river]));
  }

  all(): RiverStatic[] {
    return [...this.rivers];
  }

  getGaugeIds(): string[] {
    return [...this.byGaugeId.keys()];
  }

  findBySlug(slug: string): RiverStatic | undefined {
    return this.bySlug.get(slug);
  }

  findByGaugeId(gaugeId: string): RiverStatic | undefined {
    return this.byGaugeId.get(gaugeId);
  }

  withFlows(flowMap: Map<string, FlowData>): River[] {
    return this.rivers.map((river) => this.withFlow(river, flowMap.get(river.gaugeId)));
  }

  withFlow(river: RiverStatic, flow: FlowData | undefined): River {
    return new RiverFlowSnapshot(river, flow, this.policy).toRiver();
  }

  getFlowStatus(cfs: number, river: Pick<RiverStatic, "optimalMin" | "optimalMax">): FlowStatus {
    return this.policy.getStatus(cfs, river);
  }
}

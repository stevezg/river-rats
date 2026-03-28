// USGS Instantaneous Values (IV) API
// Docs: https://waterservices.usgs.gov/docs/instantaneous-values/instantaneous-values-details/
// Re-exports the shared USGS fetcher for use within the web app.
export type { FlowTrend, FlowData } from "@riverrats/shared";
export { fetchFlowData } from "@riverrats/shared";

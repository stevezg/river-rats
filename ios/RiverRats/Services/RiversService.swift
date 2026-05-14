import Foundation

@MainActor
final class RiversService: ObservableObject {
    @Published var flowData: [String: FlowData] = [:]  // gaugeId → FlowData
    @Published var isLoading = false

    // Fetch live CFS for a set of gauge IDs (same logic as shared/src/usgs.ts)
    func fetchFlows(for gaugeIds: [String]) async {
        guard !gaugeIds.isEmpty else { return }
        isLoading = true
        defer { isLoading = false }

        let sites = gaugeIds.joined(separator: ",")
        let urlStr = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=\(sites)&parameterCd=00060,00010&siteStatus=active"
        guard let url = URL(string: urlStr) else { return }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let decoded = try JSONDecoder().decode(USGSResponse.self, from: data)

            struct GaugeAccum {
                var cfs: Double?
                var cfsTimestamp: Date?
                var cfsValues: [USGSMeasurement] = []
                var tempC: Double?
            }

            var accumulator: [String: GaugeAccum] = [:]

            for series in decoded.value.timeSeries {
                guard let gaugeId = series.sourceInfo.siteCode.first?.value else { continue }
                let paramCode = series.variable?.variableCode?.first?.value
                let measurements = series.values.first?.value ?? []
                guard let latest = measurements.last,
                      let parsed = Double(latest.value), parsed >= 0 else { continue }

                if accumulator[gaugeId] == nil { accumulator[gaugeId] = GaugeAccum() }

                if paramCode == "00060" {
                    let formatter = ISO8601DateFormatter()
                    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
                    let ts = formatter.date(from: latest.dateTime) ?? Date()
                    accumulator[gaugeId]!.cfs = parsed
                    accumulator[gaugeId]!.cfsTimestamp = ts
                    accumulator[gaugeId]!.cfsValues = measurements
                } else if paramCode == "00010" {
                    accumulator[gaugeId]!.tempC = parsed
                }
            }

            for (gaugeId, accum) in accumulator {
                guard let cfs = accum.cfs, let ts = accum.cfsTimestamp else { continue }
                let trend = determineTrend(accum.cfsValues)
                flowData[gaugeId] = FlowData(cfs: cfs, trend: trend, timestamp: ts, tempC: accum.tempC)
            }
        } catch {
            print("[RiversService] USGS fetch failed:", error)
        }
    }

    private func determineTrend(_ values: [USGSMeasurement]) -> FlowData.FlowTrend {
        guard values.count >= 2 else { return .stable }
        guard let latest = Double(values[values.count - 1].value),
              let previous = Double(values[values.count - 2].value) else { return .stable }
        let diff = latest - previous
        if abs(diff) < 1 { return .stable }
        return diff > 0 ? .rising : .falling
    }
}

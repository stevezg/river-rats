import SwiftUI

struct RiverDetailView: View {
    let river: River
    @ObservedObject var service: RiversService

    private var flow: FlowData? { service.flowData[river.gaugeId] }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {

                // Header card
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        DifficultyBadge(difficulty: river.difficulty)
                        Spacer()
                        Text("\(river.region), \(river.state)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }

                    FlowStatusView(river: river, flow: flow)

                    FlowRangeBar(river: river, flow: flow)

                    if let tempC = flow?.tempC {
                        let tempF = tempC * 9 / 5 + 32
                        Label(String(format: "Water temp: %.0f°F (%.0f°C)", tempF, tempC), systemImage: "thermometer.medium")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }

                    if let ts = flow?.timestamp {
                        Text("Updated \(ts.formatted(.relative(presentation: .named)))")
                            .font(.caption2)
                            .foregroundStyle(.tertiary)
                    }
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))

                // Description
                VStack(alignment: .leading, spacing: 8) {
                    Text("About")
                        .font(.headline)
                    Text(river.description)
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }

                // Hazards
                if !river.hazards.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Hazards")
                            .font(.headline)
                        ForEach(river.hazards, id: \.self) { hazard in
                            HStack(alignment: .top, spacing: 8) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .font(.caption)
                                    .foregroundStyle(.orange)
                                    .padding(.top, 2)
                                Text(hazard)
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                    }
                }

                // Optimal range note
                VStack(alignment: .leading, spacing: 4) {
                    Text("Optimal Flow")
                        .font(.headline)
                    Text("\(river.optimalMin)–\(river.optimalMax) CFS")
                        .font(.title3.bold())
                        .foregroundStyle(.green)
                    Text("USGS Gauge \(river.gaugeId)")
                        .font(.caption)
                        .foregroundStyle(.tertiary)
                }
            }
            .padding()
        }
        .navigationTitle(river.name)
        .navigationBarTitleDisplayMode(.large)
        .task {
            await service.fetchFlows(for: [river.gaugeId])
        }
        .refreshable {
            await service.fetchFlows(for: [river.gaugeId])
        }
    }
}

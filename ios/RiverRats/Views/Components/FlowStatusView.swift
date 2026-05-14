import SwiftUI

struct FlowStatusView: View {
    let river: River
    let flow: FlowData?

    private var status: RunnableStatus { river.runnableStatus(cfs: flow?.cfs) }

    private var statusColor: Color {
        switch status {
        case .optimal: .green
        case .tooLow:  .blue
        case .tooHigh: .red
        case .unknown: .gray
        }
    }

    var body: some View {
        HStack(spacing: 6) {
            if let flow {
                Image(systemName: flow.trend.symbol)
                    .font(.caption.bold())
                    .foregroundStyle(statusColor)
                Text("\(Int(flow.cfs)) CFS")
                    .font(.subheadline.bold())
                    .foregroundStyle(.primary)
            } else {
                Image(systemName: "questionmark.circle")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text("No data")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Text("·")
                .foregroundStyle(.secondary)

            Text(status.label)
                .font(.caption.bold())
                .foregroundStyle(statusColor)
        }
    }
}

struct FlowRangeBar: View {
    let river: River
    let flow: FlowData?

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("Optimal: \(river.optimalMin)–\(river.optimalMax) CFS")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
                if let cfs = flow?.cfs {
                    Text("\(Int(cfs)) CFS")
                        .font(.caption.bold())
                }
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color(.systemGray5))
                        .frame(height: 8)

                    // Optimal zone highlight
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.green.opacity(0.3))
                        .frame(width: geo.size.width * 0.5, height: 8)
                        .offset(x: geo.size.width * 0.25)

                    // Current CFS needle
                    if let cfs = flow?.cfs {
                        let maxScale = Double(river.optimalMax) * 1.5
                        let fraction = min(cfs / maxScale, 1.0)
                        Circle()
                            .fill(needleColor(cfs: cfs))
                            .frame(width: 10, height: 10)
                            .offset(x: geo.size.width * fraction - 5)
                    }
                }
            }
            .frame(height: 10)
        }
    }

    private func needleColor(cfs: Double) -> Color {
        switch river.runnableStatus(cfs: cfs) {
        case .optimal: .green
        case .tooLow:  .blue
        case .tooHigh: .red
        case .unknown: .gray
        }
    }
}

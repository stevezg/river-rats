import SwiftUI

struct RunsView: View {
    @EnvironmentObject private var store: OfflineStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    OfflineBanner(snapshot: store.sync) {
                        store.toggleOfflineMode()
                    }

                    VStack(alignment: .leading, spacing: 10) {
                        Text("The river is in. Who's going?")
                            .font(.system(size: 38, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)
                            .fixedSize(horizontal: false, vertical: true)
                        Text("\(store.runnableRuns.count) Colorado runs are in range. Cached for low-signal launch zones.")
                            .font(.body)
                            .foregroundStyle(RiverTheme.muted)
                            .lineSpacing(3)
                    }
                    .padding(.top, 6)

                    if let primary = store.runnableRuns.first {
                        NavigationLink(value: primary) {
                            FeaturedRunCard(run: primary)
                        }
                        .buttonStyle(.plain)
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("All runs")
                            .font(.title3.weight(.bold))
                            .foregroundStyle(.white)

                        ForEach(store.runs) { run in
                            NavigationLink(value: run) {
                                RunRow(run: run)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding(18)
            }
            .background(RiverTheme.background.ignoresSafeArea())
            .navigationTitle("RiverRat")
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(for: RiverRun.self) { run in
                RunDetailView(run: run)
            }
        }
    }
}

private struct FeaturedRunCard: View {
    let run: RiverRun

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Best window now")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(RiverTheme.primary)
                Spacer()
                StatusPill(status: run.status)
            }
            VStack(alignment: .leading, spacing: 6) {
                Text(run.name)
                    .font(.title2.weight(.bold))
                    .foregroundStyle(.white)
                Text(run.region)
                    .font(.subheadline)
                    .foregroundStyle(RiverTheme.muted)
            }
            HStack(spacing: 10) {
                MetricBox(label: "Flow", value: "\(run.currentCfs)", detail: "CFS")
                MetricBox(label: "Class", value: run.difficulty.rawValue, detail: "Whitewater")
                MetricBox(label: "Trend", value: run.trend.rawValue.capitalized, detail: "USGS")
            }
        }
        .padding(18)
        .background(RiverTheme.surfaceRaised)
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

private struct MetricBox: View {
    let label: String
    let value: String
    let detail: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(RiverTheme.muted)
            Text(value)
                .font(.subheadline.weight(.bold))
                .foregroundStyle(.white)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text(detail)
                .font(.caption2)
                .foregroundStyle(RiverTheme.muted.opacity(0.75))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(10)
        .background(Color.white.opacity(0.045))
        .clipShape(RoundedRectangle(cornerRadius: 9, style: .continuous))
    }
}

private struct RunRow: View {
    let run: RiverRun

    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 5) {
                HStack(spacing: 8) {
                    Text(run.name)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.white)
                        .lineLimit(1)
                    StatusPill(status: run.status)
                }
                Text("\(run.region) - Class \(run.difficulty.rawValue)")
                    .font(.caption)
                    .foregroundStyle(RiverTheme.muted)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 2) {
                Text("\(run.currentCfs)")
                    .font(.headline.weight(.bold))
                    .foregroundStyle(run.isRunnable ? RiverTheme.primary : .white)
                Text("CFS")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(RiverTheme.muted)
            }
        }
        .padding(14)
        .background(RiverTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

struct RunsView_Previews: PreviewProvider {
    static var previews: some View {
        RunsView()
            .environmentObject(OfflineStore())
    }
}

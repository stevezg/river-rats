import SwiftUI

struct RunDetailView: View {
    let run: RiverRun

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        DifficultyPill(difficulty: run.difficulty)
                        StatusPill(status: run.status)
                    }
                    Text(run.name)
                        .font(.system(size: 34, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text(run.region)
                        .foregroundStyle(RiverTheme.muted)
                }

                HStack(spacing: 10) {
                    DetailMetric(title: "Current", value: "\(run.currentCfs)", subtitle: "CFS")
                    DetailMetric(title: "Optimal", value: "\(run.optimalMin)-\(run.optimalMax)", subtitle: "CFS")
                }

                VStack(alignment: .leading, spacing: 10) {
                    Text("Hazards")
                        .font(.title3.weight(.bold))
                        .foregroundStyle(.white)
                    ForEach(run.hazards, id: \.self) { hazard in
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: "exclamationmark.triangle")
                                .font(.caption.weight(.bold))
                                .foregroundStyle(RiverTheme.warning)
                                .padding(.top, 2)
                            Text(hazard)
                                .font(.subheadline)
                                .foregroundStyle(RiverTheme.muted)
                        }
                    }
                }
                .padding(16)
                .background(RiverTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))

                NavigationLink {
                    CreateTripView(preselectedRun: run)
                } label: {
                    Label("Create trip for this run", systemImage: "plus.circle.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .foregroundStyle(Color.black.opacity(0.85))
                        .background(RiverTheme.primary)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                }
            }
            .padding(18)
        }
        .background(RiverTheme.background.ignoresSafeArea())
        .navigationTitle("Run")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct DetailMetric: View {
    let title: String
    let value: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title)
                .font(.caption)
                .foregroundStyle(RiverTheme.muted)
            Text(value)
                .font(.title3.weight(.bold))
                .foregroundStyle(.white)
                .lineLimit(1)
                .minimumScaleFactor(0.65)
            Text(subtitle)
                .font(.caption2)
                .foregroundStyle(RiverTheme.muted.opacity(0.75))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(RiverTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

struct RunDetailView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            RunDetailView(run: SampleData.runs[0])
        }
    }
}

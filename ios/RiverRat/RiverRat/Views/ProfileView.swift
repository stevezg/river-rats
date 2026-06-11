import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var store: OfflineStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    HStack(spacing: 14) {
                        AvatarCircle(paddler: SampleData.alex, size: 62)
                        VStack(alignment: .leading, spacing: 5) {
                            Text(SampleData.alex.displayName)
                                .font(.title2.weight(.bold))
                                .foregroundStyle(.white)
                            Text("Home run: \(SampleData.alex.homeRun)")
                                .foregroundStyle(RiverTheme.muted)
                            DifficultyPill(difficulty: SampleData.alex.skillLevel)
                        }
                    }

                    OfflineBanner(snapshot: store.sync) {
                        store.toggleOfflineMode()
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Offline readiness")
                            .font(.title3.weight(.bold))
                            .foregroundStyle(.white)
                        ReadinessRow(icon: "externaldrive", title: "Runs cached", detail: "\(store.runs.count) Colorado runs available offline")
                        ReadinessRow(icon: "calendar.badge.clock", title: "Trip queue", detail: "\(store.sync.queuedChanges) local changes waiting")
                        ReadinessRow(icon: "shield.checkered", title: "Safety-first mode", detail: "Surface stale data clearly in low connectivity zones")
                    }
                    .padding(16)
                    .background(RiverTheme.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
                .padding(18)
            }
            .background(RiverTheme.background.ignoresSafeArea())
            .navigationTitle("Profile")
        }
    }
}

private struct ReadinessRow: View {
    let icon: String
    let title: String
    let detail: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(RiverTheme.primary)
                .frame(width: 34, height: 34)
                .background(RiverTheme.primary.opacity(0.12))
                .clipShape(Circle())
            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.white)
                Text(detail)
                    .font(.caption)
                    .foregroundStyle(RiverTheme.muted)
            }
        }
    }
}

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView()
            .environmentObject(OfflineStore())
    }
}

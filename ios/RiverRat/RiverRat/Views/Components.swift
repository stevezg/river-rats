import SwiftUI

struct OfflineBanner: View {
    let snapshot: SyncSnapshot
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                Image(systemName: snapshot.isOffline ? "wifi.slash" : "checkmark.icloud")
                    .font(.system(size: 14, weight: .semibold))
                VStack(alignment: .leading, spacing: 2) {
                    Text(snapshot.isOffline ? "River mode" : "Synced")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.white)
                    Text(snapshot.isOffline ? "\(snapshot.queuedChanges) changes queued - last sync \(snapshot.lastSync.relativeSyncLabel)" : "Latest data cached locally")
                        .font(.caption)
                        .foregroundStyle(RiverTheme.muted)
                }
                Spacer()
                Image(systemName: "arrow.triangle.2.circlepath")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(RiverTheme.primary)
            }
            .padding(14)
            .background(RiverTheme.surfaceRaised)
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

struct StatusPill: View {
    let status: RunStatus

    var body: some View {
        Text(status.rawValue)
            .font(.caption.weight(.bold))
            .foregroundStyle(status.color)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(status.color.opacity(0.12))
            .clipShape(Capsule())
    }
}

struct DifficultyPill: View {
    let difficulty: Difficulty

    var body: some View {
        Text("Class \(difficulty.rawValue)")
            .font(.caption.weight(.semibold))
            .foregroundStyle(difficulty.color)
            .padding(.horizontal, 9)
            .padding(.vertical, 5)
            .background(difficulty.color.opacity(0.13))
            .clipShape(Capsule())
    }
}

struct AvatarCircle: View {
    let paddler: Paddler
    var size: CGFloat = 36

    var body: some View {
        Text(paddler.initials)
            .font(.system(size: size * 0.32, weight: .bold))
            .foregroundStyle(Color.black.opacity(0.82))
            .frame(width: size, height: size)
            .background(paddler.isFriend ? RiverTheme.primary : RiverTheme.warning)
            .clipShape(Circle())
    }
}

struct EmptySpotRow: View {
    let minSkill: Difficulty

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "plus")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(RiverTheme.muted)
                .frame(width: 36, height: 36)
                .background(Color.white.opacity(0.04))
                .clipShape(Circle())
            VStack(alignment: .leading, spacing: 3) {
                Text("Open spot")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(RiverTheme.muted)
                Text("Minimum Class \(minSkill.rawValue)")
                    .font(.caption)
                    .foregroundStyle(RiverTheme.muted.opacity(0.75))
            }
            Spacer()
        }
        .padding(12)
        .background(Color.white.opacity(0.025))
        .overlay {
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .stroke(style: StrokeStyle(lineWidth: 1, dash: [4]))
                .foregroundStyle(Color.white.opacity(0.12))
        }
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
    }
}

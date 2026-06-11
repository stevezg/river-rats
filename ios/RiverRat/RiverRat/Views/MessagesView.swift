import SwiftUI

struct MessagesView: View {
    @EnvironmentObject private var store: OfflineStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Messages")
                        .font(.largeTitle.weight(.bold))
                        .foregroundStyle(.white)
                    Text("Crew coordination for shuttle, gear, and flow changes.")
                        .foregroundStyle(RiverTheme.muted)

                    VStack(spacing: 12) {
                        ForEach(store.messages) { message in
                            MessageRow(message: message)
                        }
                    }
                }
                .padding(18)
            }
            .background(RiverTheme.background.ignoresSafeArea())
        }
    }
}

private struct MessageRow: View {
    let message: CrewMessage

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            AvatarCircle(paddler: message.sender)
            VStack(alignment: .leading, spacing: 5) {
                HStack {
                    Text(message.sender.displayName)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.white)
                    Spacer()
                    Text(message.sentAt.relativeSyncLabel)
                        .font(.caption)
                        .foregroundStyle(RiverTheme.muted)
                }
                Text(message.body)
                    .font(.subheadline)
                    .foregroundStyle(RiverTheme.muted)
                    .lineSpacing(2)
            }
        }
        .padding(14)
        .background(RiverTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

struct MessagesView_Previews: PreviewProvider {
    static var previews: some View {
        MessagesView()
            .environmentObject(OfflineStore())
    }
}

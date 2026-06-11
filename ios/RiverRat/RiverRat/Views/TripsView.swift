import SwiftUI

struct TripsView: View {
    @EnvironmentObject private var store: OfflineStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Trips")
                        .font(.largeTitle.weight(.bold))
                        .foregroundStyle(.white)
                    Text("Crews forming around runnable water.")
                        .foregroundStyle(RiverTheme.muted)

                    ForEach(store.trips) { trip in
                        NavigationLink(value: trip) {
                            TripCard(trip: trip)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(18)
            }
            .background(RiverTheme.background.ignoresSafeArea())
            .navigationDestination(for: Trip.self) { trip in
                TripDetailView(trip: trip)
            }
        }
    }
}

struct TripCard: View {
    let trip: Trip

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(trip.runName)
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text("\(trip.meetTime) - \(trip.meetingPoint)")
                        .font(.caption)
                        .foregroundStyle(RiverTheme.muted)
                }
                Spacer()
                DifficultyPill(difficulty: trip.minSkill)
            }

            Text(trip.notes)
                .font(.subheadline)
                .foregroundStyle(RiverTheme.muted)
                .lineLimit(2)

            HStack {
                HStack(spacing: -8) {
                    AvatarCircle(paddler: trip.organizer, size: 30)
                    ForEach(trip.members.prefix(3)) { member in
                        AvatarCircle(paddler: member, size: 30)
                            .overlay(Circle().stroke(RiverTheme.surface, lineWidth: 2))
                    }
                }
                Text(trip.crewSummary)
                    .font(.caption)
                    .foregroundStyle(RiverTheme.muted)
                    .lineLimit(1)
                Spacer()
                Text("\(trip.openSpots) open")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(trip.openSpots > 0 ? RiverTheme.primary : RiverTheme.danger)
            }
        }
        .padding(16)
        .background(RiverTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

struct TripDetailView: View {
    let trip: Trip

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                VStack(alignment: .leading, spacing: 8) {
                    DifficultyPill(difficulty: trip.minSkill)
                    Text(trip.runName)
                        .font(.system(size: 34, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text("\(trip.meetTime) - \(trip.meetingPoint)")
                        .foregroundStyle(RiverTheme.muted)
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("Who's paddling?")
                        .font(.title3.weight(.bold))
                        .foregroundStyle(.white)
                    Text(trip.crewSummary)
                        .foregroundStyle(RiverTheme.muted)

                    CrewRow(paddler: trip.organizer, role: "Organizer")
                    ForEach(trip.members) { member in
                        CrewRow(paddler: member, role: "Confirmed")
                    }
                    ForEach(0..<trip.openSpots, id: \.self) { _ in
                        EmptySpotRow(minSkill: trip.minSkill)
                    }
                }
                .padding(16)
                .background(RiverTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                VStack(alignment: .leading, spacing: 8) {
                    Text("Crew context")
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text("Crew chat is where shuttle timing, gear checks, and flow changes get sorted before launch.")
                        .font(.subheadline)
                        .foregroundStyle(RiverTheme.muted)
                    Button {
                    } label: {
                        Label("Open crew chat", systemImage: "bubble.left.and.bubble.right")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .foregroundStyle(Color.black.opacity(0.85))
                            .background(RiverTheme.primary)
                            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    }
                }
                .padding(16)
                .background(RiverTheme.surfaceRaised)
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
            .padding(18)
        }
        .background(RiverTheme.background.ignoresSafeArea())
        .navigationTitle("Trip")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct CrewRow: View {
    let paddler: Paddler
    let role: String

    var body: some View {
        HStack(spacing: 12) {
            AvatarCircle(paddler: paddler)
            VStack(alignment: .leading, spacing: 3) {
                Text(paddler.displayName)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.white)
                Text(role)
                    .font(.caption)
                    .foregroundStyle(RiverTheme.muted)
            }
            Spacer()
            DifficultyPill(difficulty: paddler.skillLevel)
        }
        .padding(12)
        .background(Color.white.opacity(0.035))
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
    }
}

struct TripsView_Previews: PreviewProvider {
    static var previews: some View {
        TripsView()
            .environmentObject(OfflineStore())
    }
}

import SwiftUI

struct TripsListView: View {
    @EnvironmentObject private var auth: AuthService
    @StateObject private var tripsService = TripsService()
    @State private var showCreateTrip = false

    var body: some View {
        NavigationStack {
            Group {
                if tripsService.isLoading && tripsService.trips.isEmpty {
                    ProgressView("Loading trips…")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if tripsService.trips.isEmpty {
                    ContentUnavailableView("No Open Trips", systemImage: "water.waves",
                                          description: Text("Be the first to post a trip."))
                } else {
                    List(tripsService.trips) { trip in
                        NavigationLink(destination: TripDetailView(trip: trip, tripsService: tripsService)) {
                            TripRow(trip: trip)
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Trips")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    if auth.currentUser != nil {
                        Button {
                            showCreateTrip = true
                        } label: {
                            Image(systemName: "plus")
                        }
                    }
                }
            }
            .sheet(isPresented: $showCreateTrip) {
                CreateTripView(tripsService: tripsService)
            }
            .task {
                await tripsService.fetchOpenTrips()
            }
            .refreshable {
                await tripsService.fetchOpenTrips()
            }
        }
    }
}

struct TripRow: View {
    let trip: Trip

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(trip.riverName)
                    .font(.headline)
                Spacer()
                TripStatusBadge(status: trip.status)
            }

            HStack {
                Label(formattedDate(trip.date), systemImage: "calendar")
                Text("·")
                Label(trip.time, systemImage: "clock")
            }
            .font(.caption)
            .foregroundStyle(.secondary)

            HStack {
                if let organizer = trip.profiles {
                    Label(organizer.displayName, systemImage: "person.fill")
                }
                Spacer()
                Label("\(trip.spotsRemaining) of \(trip.totalSpots) spots", systemImage: "person.2")
                    .foregroundStyle(trip.spotsRemaining == 0 ? .red : .secondary)
            }
            .font(.caption)
            .foregroundStyle(.secondary)

            DifficultyBadge(difficulty: trip.minSkill)
        }
        .padding(.vertical, 4)
    }

    private func formattedDate(_ dateStr: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: dateStr) else { return dateStr }
        formatter.dateStyle = .medium
        formatter.timeStyle = .none
        return formatter.string(from: date)
    }
}

struct TripStatusBadge: View {
    let status: Trip.TripStatus

    private var label: String {
        switch status {
        case .open: "Open"
        case .full: "Full"
        case .cancelled: "Cancelled"
        case .completed: "Completed"
        }
    }

    private var color: Color {
        switch status {
        case .open:      .green
        case .full:      .orange
        case .cancelled: .red
        case .completed: .secondary
        }
    }

    var body: some View {
        Text(label)
            .font(.caption.bold())
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(color.opacity(0.15))
            .foregroundStyle(color)
            .clipShape(Capsule())
    }
}

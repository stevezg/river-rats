import SwiftUI

struct TripDetailView: View {
    let trip: Trip
    @ObservedObject var tripsService: TripsService
    @EnvironmentObject private var auth: AuthService

    @State private var members: [TripMember] = []
    @State private var myRequest: JoinRequest?
    @State private var joinMessage = ""
    @State private var showJoinSheet = false
    @State private var isActionLoading = false
    @State private var errorMessage: String?

    private var isOrganizer: Bool {
        guard let userId = auth.currentUser?.id else { return false }
        return trip.creatorId == userId
    }

    private var isMember: Bool {
        guard let userId = auth.currentUser?.id else { return false }
        return members.contains { $0.userId == userId }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {

                // Info card
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        TripStatusBadge(status: trip.status)
                        Spacer()
                        DifficultyBadge(difficulty: trip.minSkill)
                    }

                    Label(formattedDate(trip.date) + " at " + trip.time, systemImage: "calendar")
                    Label(trip.meetingPoint, systemImage: "mappin.circle")

                    if let organizer = trip.profiles {
                        Label("Organized by \(organizer.displayName)", systemImage: "person.fill")
                    }

                    Label("\(trip.spotsRemaining) of \(trip.totalSpots) spots remaining", systemImage: "person.2")
                        .foregroundStyle(trip.spotsRemaining == 0 ? .red : .primary)
                }
                .font(.subheadline)
                .padding()
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))

                // Notes
                if let notes = trip.notes, !notes.isEmpty {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Notes")
                            .font(.headline)
                        Text(notes)
                            .font(.body)
                            .foregroundStyle(.secondary)
                    }
                }

                // Members
                if !members.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Crew (\(members.count))")
                            .font(.headline)
                        ForEach(members) { member in
                            HStack {
                                Image(systemName: "person.circle.fill")
                                    .foregroundStyle(.secondary)
                                Text(member.profiles?.displayName ?? "Paddler")
                                    .font(.subheadline)
                                if member.role == "creator" {
                                    Text("Organizer")
                                        .font(.caption)
                                        .foregroundStyle(.blue)
                                }
                            }
                        }
                    }
                }

                // Error
                if let error = errorMessage {
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(.red)
                }

                // CTA
                if !isOrganizer, let _ = auth.currentUser {
                    joinButton
                }

                Spacer()
            }
            .padding()
        }
        .navigationTitle(trip.riverName)
        .navigationBarTitleDisplayMode(.large)
        .sheet(isPresented: $showJoinSheet) {
            joinSheet
        }
        .task {
            await loadData()
        }
    }

    @ViewBuilder
    private var joinButton: some View {
        if isMember {
            Label("You're on this trip", systemImage: "checkmark.circle.fill")
                .foregroundStyle(.green)
                .font(.subheadline.bold())
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.green.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 12))
        } else if let request = myRequest {
            switch request.status {
            case .pending:
                Label("Join request sent — awaiting approval", systemImage: "clock")
                    .font(.subheadline)
                    .foregroundStyle(.orange)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.orange.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            case .declined:
                Label("Your request was declined", systemImage: "xmark.circle")
                    .font(.subheadline)
                    .foregroundStyle(.red)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            case .approved:
                Label("You're on this trip", systemImage: "checkmark.circle.fill")
                    .foregroundStyle(.green)
                    .font(.subheadline.bold())
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        } else if trip.status == .open {
            Button {
                showJoinSheet = true
            } label: {
                Label("Request to Join", systemImage: "hand.raised.fill")
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
            }
            .buttonStyle(.borderedProminent)
            .disabled(isActionLoading)
        }
    }

    private var joinSheet: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Text("Send a short message to the organizer (optional):")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                TextField("e.g. I have a solid Class IV roll", text: $joinMessage, axis: .vertical)
                    .textFieldStyle(.roundedBorder)
                    .lineLimit(3...6)
                Spacer()
            }
            .padding()
            .navigationTitle("Join \(trip.riverName)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { showJoinSheet = false }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Send Request") {
                        Task { await submitJoinRequest() }
                    }
                    .disabled(isActionLoading)
                }
            }
        }
        .presentationDetents([.medium])
    }

    private func loadData() async {
        do {
            members = try await tripsService.fetchTripMembers(tripId: trip.id)
            if let userId = auth.currentUser?.id {
                myRequest = try await tripsService.fetchJoinRequest(tripId: trip.id, userId: userId)
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func submitJoinRequest() async {
        guard let userId = auth.currentUser?.id else { return }
        isActionLoading = true
        showJoinSheet = false
        do {
            try await tripsService.requestToJoin(tripId: trip.id, userId: userId,
                                                  message: joinMessage.isEmpty ? nil : joinMessage)
            myRequest = try await tripsService.fetchJoinRequest(tripId: trip.id, userId: userId)
        } catch {
            errorMessage = error.localizedDescription
        }
        isActionLoading = false
    }

    private func formattedDate(_ dateStr: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: dateStr) else { return dateStr }
        formatter.dateStyle = .long
        return formatter.string(from: date)
    }
}

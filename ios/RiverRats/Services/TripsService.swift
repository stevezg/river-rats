import Foundation

@MainActor
final class TripsService: ObservableObject {
    @Published var trips: [Trip] = []
    @Published var myTrips: [Trip] = []
    @Published var isLoading = false

    func fetchOpenTrips() async {
        isLoading = true
        defer { isLoading = false }
        do {
            let result: [Trip] = try await supabase
                .from("trips")
                .select("*, profiles!creator_id(*)")
                .in("status", values: ["open", "full"])
                .order("date")
                .execute()
                .value
            trips = result
        } catch {
            print("[TripsService] fetchOpenTrips failed:", error)
        }
    }

    func fetchMyTrips(userId: UUID) async {
        do {
            // Trips I created
            let created: [Trip] = try await supabase
                .from("trips")
                .select("*, profiles!creator_id(*)")
                .eq("creator_id", value: userId.uuidString)
                .order("date")
                .execute()
                .value

            // Trips I joined as member (but didn't create)
            let memberRows: [TripMemberWithTrip] = try await supabase
                .from("trip_members")
                .select("*, trips(*, profiles!creator_id(*))")
                .eq("user_id", value: userId.uuidString)
                .neq("role", value: "creator")
                .execute()
                .value

            let joined = memberRows.compactMap(\.trips)

            // Merge, deduplicate by id
            var seen = Set<UUID>()
            var all: [Trip] = []
            for trip in created + joined {
                if seen.insert(trip.id).inserted { all.append(trip) }
            }
            myTrips = all.sorted { $0.date < $1.date }
        } catch {
            print("[TripsService] fetchMyTrips failed:", error)
        }
    }

    func fetchTripMembers(tripId: UUID) async throws -> [TripMember] {
        try await supabase
            .from("trip_members")
            .select("*, profiles!user_id(*)")
            .eq("trip_id", value: tripId.uuidString)
            .execute()
            .value
    }

    func fetchJoinRequest(tripId: UUID, userId: UUID) async throws -> JoinRequest? {
        let results: [JoinRequest] = try await supabase
            .from("join_requests")
            .select()
            .eq("trip_id", value: tripId.uuidString)
            .eq("user_id", value: userId.uuidString)
            .execute()
            .value
        return results.first
    }

    func fetchPendingRequests(tripId: UUID) async throws -> [JoinRequest] {
        try await supabase
            .from("join_requests")
            .select()
            .eq("trip_id", value: tripId.uuidString)
            .eq("status", value: "pending")
            .execute()
            .value
    }

    func requestToJoin(tripId: UUID, userId: UUID, message: String?) async throws {
        let payload = NewJoinRequest(tripId: tripId, userId: userId, message: message)
        try await supabase
            .from("join_requests")
            .insert(payload)
            .execute()
    }

    func approveRequest(requestId: UUID) async throws {
        try await supabase
            .from("join_requests")
            .update(["status": "approved"])
            .eq("id", value: requestId.uuidString)
            .execute()
    }

    func declineRequest(requestId: UUID) async throws {
        try await supabase
            .from("join_requests")
            .update(["status": "declined"])
            .eq("id", value: requestId.uuidString)
            .execute()
    }

    func createTrip(_ trip: NewTrip) async throws -> Trip {
        try await supabase
            .from("trips")
            .insert(trip)
            .select("*, profiles!creator_id(*)")
            .single()
            .execute()
            .value
    }
}

struct TripMemberWithTrip: Decodable {
    let id: UUID
    let tripId: UUID
    let userId: UUID
    let role: String
    let joinedAt: String
    let trips: Trip?
}

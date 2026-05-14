import Foundation

struct Trip: Identifiable, Codable {
    let id: UUID
    let creatorId: UUID
    let riverSlug: String
    let riverName: String
    let date: String
    let time: String
    let meetingPoint: String
    let notes: String?
    let minSkill: String
    let totalSpots: Int
    let spotsRemaining: Int
    let status: TripStatus
    let createdAt: String
    let updatedAt: String
    var profiles: Profile?  // joined organizer profile

    enum TripStatus: String, Codable {
        case open, full, cancelled, completed
    }
}

struct TripMember: Identifiable, Codable {
    let id: UUID
    let tripId: UUID
    let userId: UUID
    let role: String
    let joinedAt: String
    var profiles: Profile?
}

struct JoinRequest: Identifiable, Codable {
    let id: UUID
    let tripId: UUID
    let userId: UUID
    let status: JoinStatus
    let message: String?
    let createdAt: String
    let updatedAt: String

    enum JoinStatus: String, Codable {
        case pending, approved, declined
    }
}

// Insert payloads

struct NewTrip: Encodable {
    let creatorId: UUID
    let riverSlug: String
    let riverName: String
    let date: String
    let time: String
    let meetingPoint: String
    let notes: String?
    let minSkill: String
    let totalSpots: Int
    let spotsRemaining: Int
}

struct NewJoinRequest: Encodable {
    let tripId: UUID
    let userId: UUID
    let message: String?
}

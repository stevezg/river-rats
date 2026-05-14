import Foundation

struct Profile: Identifiable, Codable {
    let id: UUID
    let username: String
    let displayName: String
    let skillLevel: String
    let homeRiverSlug: String?
    let bio: String?
    let avatarUrl: String?
    let createdAt: String
    let updatedAt: String
}

struct ProfileUpdate: Encodable {
    let displayName: String
    let skillLevel: String
    let homeRiverSlug: String?
    let bio: String?
}

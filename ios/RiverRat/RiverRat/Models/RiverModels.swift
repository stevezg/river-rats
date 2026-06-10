import Foundation

enum Difficulty: String, CaseIterable, Identifiable, Codable {
    case classTwoThree = "II-III"
    case classThree = "III"
    case classThreeFour = "III-IV"
    case classFour = "IV"
    case classFourFive = "IV-V"
    case classFive = "V"

    var id: String { rawValue }
}

enum FlowTrend: String, Codable {
    case rising
    case falling
    case stable
}

enum RunStatus: String, Codable {
    case `in` = "In"
    case watch = "Watch"
    case high = "High"
}

struct RiverRun: Identifiable, Hashable, Codable {
    let id: UUID
    let slug: String
    let name: String
    let region: String
    let difficulty: Difficulty
    let currentCfs: Int
    let optimalMin: Int
    let optimalMax: Int
    let trend: FlowTrend
    let hazards: [String]
    let lastUpdated: Date

    var status: RunStatus {
        if currentCfs < optimalMin { return .watch }
        if currentCfs > Int(Double(optimalMax) * 1.5) { return .high }
        return .in
    }

    var isRunnable: Bool {
        status == .in
    }
}

struct Paddler: Identifiable, Hashable, Codable {
    let id: UUID
    let displayName: String
    let skillLevel: Difficulty
    let homeRun: String
    let isFriend: Bool

    var initials: String {
        displayName
            .split(separator: " ")
            .compactMap { $0.first }
            .prefix(2)
            .map(String.init)
            .joined()
            .uppercased()
    }
}

struct Trip: Identifiable, Hashable, Codable {
    let id: UUID
    let runSlug: String
    let runName: String
    let date: Date
    let meetTime: String
    let meetingPoint: String
    let organizer: Paddler
    let members: [Paddler]
    let totalSpots: Int
    let minSkill: Difficulty
    let notes: String

    var filledCount: Int {
        1 + members.count
    }

    var openSpots: Int {
        max(totalSpots - filledCount, 0)
    }

    var crewSummary: String {
        if members.isEmpty {
            return "\(organizer.displayName) is organizing. \(openSpots) spots open."
        }
        return "\(organizer.displayName) plus \(members.count) paddlers are in."
    }
}

struct CrewMessage: Identifiable, Hashable, Codable {
    let id: UUID
    let sender: Paddler
    let body: String
    let sentAt: Date
}

struct SyncSnapshot: Hashable {
    let isOffline: Bool
    let lastSync: Date
    let queuedChanges: Int
}

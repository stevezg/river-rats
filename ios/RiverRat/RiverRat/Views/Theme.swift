import SwiftUI

enum RiverTheme {
    static let background = Color(red: 0.059, green: 0.067, blue: 0.09)
    static let surface = Color(red: 0.11, green: 0.122, blue: 0.149)
    static let surfaceRaised = Color(red: 0.086, green: 0.137, blue: 0.165)
    static let primary = Color(red: 0.306, green: 0.804, blue: 0.769)
    static let muted = Color(red: 0.545, green: 0.561, blue: 0.659)
    static let warning = Color(red: 1.0, green: 0.663, blue: 0.302)
    static let danger = Color(red: 1.0, green: 0.42, blue: 0.42)
    static let success = Color(red: 0.322, green: 0.718, blue: 0.533)
}

extension Difficulty {
    var color: Color {
        switch self {
        case .classTwoThree, .classThree:
            return RiverTheme.warning
        case .classThreeFour:
            return Color(red: 1.0, green: 0.55, blue: 0.26)
        case .classFour, .classFourFive:
            return Color(red: 1.0, green: 0.45, blue: 0.24)
        case .classFive:
            return RiverTheme.danger
        }
    }
}

extension RunStatus {
    var color: Color {
        switch self {
        case .in:
            return RiverTheme.primary
        case .watch:
            return RiverTheme.muted
        case .high:
            return RiverTheme.danger
        }
    }
}

extension Date {
    var relativeSyncLabel: String {
        let minutes = max(Int(Date().timeIntervalSince(self) / 60), 0)
        if minutes < 1 { return "just now" }
        if minutes == 1 { return "1 min ago" }
        return "\(minutes) min ago"
    }
}

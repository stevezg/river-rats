import SwiftUI

struct DifficultyBadge: View {
    let difficulty: String

    private var color: Color {
        switch difficulty {
        case "I-II":   return .green
        case "II-III": return .mint
        case "III":    return .yellow
        case "III-IV": return .orange
        case "IV":     return .orange
        case "IV-V":   return .red
        case "V":      return .red
        case "V+":     return .purple
        default:       return .gray
        }
    }

    var body: some View {
        Text("Class \(difficulty)")
            .font(.caption.bold())
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(color.opacity(0.15))
            .foregroundStyle(color)
            .clipShape(Capsule())
            .overlay(Capsule().strokeBorder(color.opacity(0.4), lineWidth: 1))
    }
}

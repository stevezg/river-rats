import Foundation
import Supabase

// Read Supabase credentials from Info.plist (populated from Secrets.xcconfig)
private func infoPlistValue(_ key: String) -> String {
    guard let value = Bundle.main.object(forInfoDictionaryKey: key) as? String,
          !value.isEmpty, !value.hasPrefix("$(") else {
        fatalError("Missing Info.plist key '\(key)'. Copy Secrets.xcconfig.example → Secrets.xcconfig and fill in your values.")
    }
    return value
}

let supabase = SupabaseClient(
    supabaseURL: URL(string: infoPlistValue("SUPABASE_URL"))!,
    supabaseKey: infoPlistValue("SUPABASE_ANON_KEY")
)

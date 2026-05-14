import Foundation
import Supabase

@MainActor
final class AuthService: ObservableObject {
    @Published var currentUser: User?
    @Published var currentProfile: Profile?
    @Published var isLoading = true

    static let shared = AuthService()
    private init() {}

    func startListening() {
        Task {
            // Restore session on launch
            if let session = try? await supabase.auth.session {
                currentUser = session.user
                await loadProfile(userId: session.user.id)
            }
            isLoading = false

            // Stream subsequent auth state changes
            for await (event, session) in supabase.auth.authStateChanges {
                switch event {
                case .signedIn:
                    if let user = session?.user {
                        currentUser = user
                        await loadProfile(userId: user.id)
                    }
                case .signedOut, .userDeleted:
                    currentUser = nil
                    currentProfile = nil
                default:
                    break
                }
            }
        }
    }

    func signIn(email: String, password: String) async throws {
        let session = try await supabase.auth.signIn(email: email, password: password)
        currentUser = session.user
        await loadProfile(userId: session.user.id)
    }

    func signUp(email: String, password: String) async throws {
        let response = try await supabase.auth.signUp(email: email, password: password)
        if let user = response.user {
            currentUser = user
            // Profile is auto-created by DB trigger; fetch after a brief delay
            try? await Task.sleep(for: .seconds(1))
            await loadProfile(userId: user.id)
        }
    }

    func signOut() async throws {
        try await supabase.auth.signOut()
        currentUser = nil
        currentProfile = nil
    }

    private func loadProfile(userId: UUID) async {
        do {
            let profile: Profile = try await supabase
                .from("profiles")
                .select()
                .eq("id", value: userId.uuidString)
                .single()
                .execute()
                .value
            currentProfile = profile
        } catch {
            print("[AuthService] Failed to load profile:", error)
        }
    }
}

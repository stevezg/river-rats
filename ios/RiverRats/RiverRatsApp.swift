import SwiftUI

@main
struct RiverRatsApp: App {
    @StateObject private var auth = AuthService.shared

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(auth)
                .task {
                    auth.startListening()
                }
        }
    }
}

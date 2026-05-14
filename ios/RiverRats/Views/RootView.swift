import SwiftUI

struct RootView: View {
    @EnvironmentObject private var auth: AuthService

    var body: some View {
        if auth.isLoading {
            ProgressView("Loading…")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else if auth.currentUser != nil {
            MainTabView()
        } else {
            LoginView()
        }
    }
}

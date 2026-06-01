import SwiftUI

@main
struct RiverRatApp: App {
    @StateObject private var store = OfflineStore()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environmentObject(store)
        }
    }
}

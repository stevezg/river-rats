import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            RunsView()
                .tabItem {
                    Label("Runs", systemImage: "water.waves")
                }

            TripsView()
                .tabItem {
                    Label("Trips", systemImage: "calendar")
                }

            CreateTripView()
                .tabItem {
                    Label("Create", systemImage: "plus.circle.fill")
                }

            MessagesView()
                .tabItem {
                    Label("Messages", systemImage: "bubble.left.and.bubble.right")
                }

            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.crop.circle")
                }
        }
        .tint(RiverTheme.primary)
    }
}

struct RootTabView_Previews: PreviewProvider {
    static var previews: some View {
        RootTabView()
            .environmentObject(OfflineStore())
    }
}

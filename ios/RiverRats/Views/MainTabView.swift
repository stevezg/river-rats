import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            RiversListView()
                .tabItem {
                    Label("Rivers", systemImage: "water.waves")
                }

            TripsListView()
                .tabItem {
                    Label("Trips", systemImage: "figure.kayaking")
                }

            DashboardView()
                .tabItem {
                    Label("Profile", systemImage: "person.circle")
                }
        }
    }
}

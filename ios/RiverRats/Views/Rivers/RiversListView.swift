import SwiftUI

struct RiversListView: View {
    @StateObject private var service = RiversService()
    @State private var searchText = ""
    @State private var selectedState: String = "All"

    private let allStates = ["All"] + Array(Set(riversData.map(\.state))).sorted()

    private var filtered: [River] {
        riversData.filter { river in
            (selectedState == "All" || river.state == selectedState) &&
            (searchText.isEmpty || river.name.localizedCaseInsensitiveContains(searchText) ||
             river.region.localizedCaseInsensitiveContains(searchText))
        }
    }

    var body: some View {
        NavigationStack {
            List(filtered) { river in
                NavigationLink(destination: RiverDetailView(river: river, service: service)) {
                    RiverRow(river: river, flow: service.flowData[river.gaugeId])
                }
            }
            .listStyle(.plain)
            .searchable(text: $searchText, prompt: "Search rivers")
            .navigationTitle("Rivers")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Picker("State", selection: $selectedState) {
                            ForEach(allStates, id: \.self) { state in
                                Text(state).tag(state)
                            }
                        }
                    } label: {
                        Label("Filter", systemImage: selectedState == "All" ? "line.3.horizontal.decrease.circle" : "line.3.horizontal.decrease.circle.fill")
                    }
                }
            }
            .task {
                await service.fetchFlows(for: riversData.map(\.gaugeId))
            }
            .refreshable {
                await service.fetchFlows(for: riversData.map(\.gaugeId))
            }
        }
    }
}

struct RiverRow: View {
    let river: River
    let flow: FlowData?

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(river.name)
                        .font(.headline)
                    Text("\(river.region) · \(river.state)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                DifficultyBadge(difficulty: river.difficulty)
            }
            FlowStatusView(river: river, flow: flow)
        }
        .padding(.vertical, 4)
    }
}

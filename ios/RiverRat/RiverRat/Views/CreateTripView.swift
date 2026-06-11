import SwiftUI

struct CreateTripView: View {
    @EnvironmentObject private var store: OfflineStore
    let preselectedRun: RiverRun?

    @State private var selectedRunSlug: String
    @State private var meetTime = "5:30 PM"
    @State private var meetingPoint = "Main takeout"
    @State private var didQueueTrip = false

    init(preselectedRun: RiverRun? = nil) {
        self.preselectedRun = preselectedRun
        _selectedRunSlug = State(initialValue: preselectedRun?.slug ?? "")
    }

    private var selectedRun: RiverRun? {
        store.runs.first { $0.slug == selectedRunSlug } ?? preselectedRun ?? store.runs.first
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Run", selection: $selectedRunSlug) {
                        ForEach(store.runs) { run in
                            Text(run.name).tag(run.slug)
                        }
                    }
                    TextField("Meet time", text: $meetTime)
                    TextField("Meeting point", text: $meetingPoint)
                } header: {
                    Text("Trip")
                } footer: {
                    Text("Trip drafts are queueable offline and sync when signal returns.")
                }

                if let run = selectedRun {
                    Section("Run status") {
                        HStack {
                            Text(run.name)
                            Spacer()
                            StatusPill(status: run.status)
                        }
                        HStack {
                            Text("Current flow")
                            Spacer()
                            Text("\(run.currentCfs) CFS")
                                .foregroundStyle(RiverTheme.primary)
                        }
                    }

                    Section {
                        Button {
                            store.queueTripDraft(run: run, meetTime: meetTime, meetingPoint: meetingPoint)
                            didQueueTrip = true
                        } label: {
                            Label("Queue trip draft", systemImage: "tray.and.arrow.up")
                                .frame(maxWidth: .infinity)
                        }
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(RiverTheme.background)
            .navigationTitle("Create")
            .alert("Trip queued", isPresented: $didQueueTrip) {
                Button("OK", role: .cancel) {}
            } message: {
                Text("This draft is saved locally and ready to sync.")
            }
            .onAppear {
                if selectedRunSlug.isEmpty {
                    selectedRunSlug = store.runs.first?.slug ?? ""
                }
            }
        }
    }
}

struct CreateTripView_Previews: PreviewProvider {
    static var previews: some View {
        CreateTripView()
            .environmentObject(OfflineStore())
    }
}

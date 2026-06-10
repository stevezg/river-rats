import Foundation

@MainActor
final class OfflineStore: ObservableObject {
    @Published private(set) var runs: [RiverRun]
    @Published private(set) var trips: [Trip]
    @Published private(set) var messages: [CrewMessage]
    @Published private(set) var sync: SyncSnapshot

    init(
        runs: [RiverRun] = SampleData.runs,
        trips: [Trip] = SampleData.trips,
        messages: [CrewMessage] = SampleData.messages,
        sync: SyncSnapshot = SyncSnapshot(isOffline: true, lastSync: Date().addingTimeInterval(-18 * 60), queuedChanges: 2)
    ) {
        self.runs = runs
        self.trips = trips
        self.messages = messages
        self.sync = sync
    }

    var runnableRuns: [RiverRun] {
        runs.filter(\.isRunnable)
    }

    var nextTrip: Trip? {
        trips.sorted { $0.date < $1.date }.first
    }

    func queueTripDraft(run: RiverRun, meetTime: String, meetingPoint: String) {
        let trip = Trip(
            id: UUID(),
            runSlug: run.slug,
            runName: run.name,
            date: Date().addingTimeInterval(3 * 60 * 60),
            meetTime: meetTime,
            meetingPoint: meetingPoint,
            organizer: SampleData.alex,
            members: [],
            totalSpots: 4,
            minSkill: run.difficulty,
            notes: "Queued offline. This will sync when signal returns."
        )

        trips.insert(trip, at: 0)
        sync = SyncSnapshot(isOffline: sync.isOffline, lastSync: sync.lastSync, queuedChanges: sync.queuedChanges + 1)
    }

    func toggleOfflineMode() {
        sync = SyncSnapshot(isOffline: !sync.isOffline, lastSync: Date(), queuedChanges: sync.isOffline ? 0 : sync.queuedChanges)
    }
}

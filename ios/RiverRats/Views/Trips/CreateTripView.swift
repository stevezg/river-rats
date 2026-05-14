import SwiftUI

struct CreateTripView: View {
    @ObservedObject var tripsService: TripsService
    @EnvironmentObject private var auth: AuthService
    @Environment(\.dismiss) private var dismiss

    @State private var selectedRiver: River = riversData[0]
    @State private var date = Date().addingTimeInterval(7 * 86400)
    @State private var time = "08:00 AM"
    @State private var meetingPoint = ""
    @State private var notes = ""
    @State private var minSkill = "III"
    @State private var totalSpots = 4
    @State private var isLoading = false
    @State private var errorMessage: String?

    private let skillLevels = ["I-II", "II-III", "III", "III-IV", "IV", "IV-V", "V", "V+"]

    var body: some View {
        NavigationStack {
            Form {
                Section("River") {
                    Picker("River", selection: $selectedRiver.id) {
                        ForEach(riversData) { river in
                            Text(river.name).tag(river.id)
                        }
                    }
                    .pickerStyle(.navigationLink)
                    .onChange(of: selectedRiver.id) { _, newId in
                        if let river = riversData.first(where: { $0.id == newId }) {
                            selectedRiver = river
                        }
                    }
                }

                Section("Date & Time") {
                    DatePicker("Date", selection: $date, in: Date()..., displayedComponents: .date)
                    TextField("Time (e.g. 8:00 AM)", text: $time)
                }

                Section("Logistics") {
                    TextField("Meeting point", text: $meetingPoint)
                    TextEditor(text: $notes)
                        .frame(minHeight: 80)
                        .overlay(alignment: .topLeading) {
                            if notes.isEmpty {
                                Text("Notes (optional)")
                                    .foregroundStyle(.tertiary)
                                    .padding(.top, 8)
                                    .padding(.leading, 4)
                                    .allowsHitTesting(false)
                            }
                        }
                }

                Section("Requirements") {
                    Picker("Minimum Skill", selection: $minSkill) {
                        ForEach(skillLevels, id: \.self) { level in
                            Text("Class \(level)").tag(level)
                        }
                    }
                    Stepper("Total Spots: \(totalSpots)", value: $totalSpots, in: 1...20)
                }

                if let error = errorMessage {
                    Section {
                        Text(error).foregroundStyle(.red).font(.caption)
                    }
                }
            }
            .navigationTitle("Post a Trip")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Post") {
                        Task { await createTrip() }
                    }
                    .disabled(isLoading || meetingPoint.isEmpty)
                }
            }
        }
    }

    private func createTrip() async {
        guard let userId = auth.currentUser?.id else { return }
        isLoading = true
        errorMessage = nil

        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let dateStr = dateFormatter.string(from: date)

        let newTrip = NewTrip(
            creatorId: userId,
            riverSlug: selectedRiver.slug,
            riverName: selectedRiver.name,
            date: dateStr,
            time: time,
            meetingPoint: meetingPoint,
            notes: notes.isEmpty ? nil : notes,
            minSkill: minSkill,
            totalSpots: totalSpots,
            spotsRemaining: totalSpots
        )

        do {
            _ = try await tripsService.createTrip(newTrip)
            await tripsService.fetchOpenTrips()
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

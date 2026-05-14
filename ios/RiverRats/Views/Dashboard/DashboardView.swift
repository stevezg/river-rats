import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var auth: AuthService
    @StateObject private var tripsService = TripsService()
    @State private var showEditProfile = false

    var body: some View {
        NavigationStack {
            Group {
                if let profile = auth.currentProfile {
                    profileContent(profile)
                } else {
                    ProgressView()
                }
            }
            .navigationTitle("My Profile")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Edit") { showEditProfile = true }
                }
                ToolbarItem(placement: .topBarLeading) {
                    Button("Sign Out") {
                        Task { try? await auth.signOut() }
                    }
                    .foregroundStyle(.red)
                }
            }
            .sheet(isPresented: $showEditProfile) {
                if let profile = auth.currentProfile {
                    EditProfileView(profile: profile)
                }
            }
            .task {
                if let userId = auth.currentUser?.id {
                    await tripsService.fetchMyTrips(userId: userId)
                }
            }
        }
    }

    @ViewBuilder
    private func profileContent(_ profile: Profile) -> some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text(profile.displayName)
                        .font(.title2.bold())
                    Text("@\(profile.username)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    HStack {
                        DifficultyBadge(difficulty: profile.skillLevel)
                        if let homeSlug = profile.homeRiverSlug,
                           let homeRiver = riversData.first(where: { $0.slug == homeSlug }) {
                            Label(homeRiver.name, systemImage: "house")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    if let bio = profile.bio, !bio.isEmpty {
                        Text(bio)
                            .font(.body)
                            .foregroundStyle(.secondary)
                    }
                }
                .padding(.vertical, 4)
            }

            Section("My Trips (\(tripsService.myTrips.count))") {
                if tripsService.myTrips.isEmpty {
                    Text("No trips yet — post or join one!")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(tripsService.myTrips) { trip in
                        NavigationLink(destination: TripDetailView(trip: trip, tripsService: tripsService)) {
                            TripRow(trip: trip)
                        }
                    }
                }
            }
        }
    }
}

struct EditProfileView: View {
    let profile: Profile
    @EnvironmentObject private var auth: AuthService
    @Environment(\.dismiss) private var dismiss

    @State private var displayName: String
    @State private var skillLevel: String
    @State private var homeRiverSlug: String
    @State private var bio: String
    @State private var isLoading = false
    @State private var errorMessage: String?

    private let skillLevels = ["I-II", "II-III", "III", "III-IV", "IV", "IV-V", "V", "V+"]

    init(profile: Profile) {
        self.profile = profile
        _displayName = State(initialValue: profile.displayName)
        _skillLevel = State(initialValue: profile.skillLevel)
        _homeRiverSlug = State(initialValue: profile.homeRiverSlug ?? "")
        _bio = State(initialValue: profile.bio ?? "")
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Display Name") {
                    TextField("Display name", text: $displayName)
                }
                Section("Skill Level") {
                    Picker("Skill Level", selection: $skillLevel) {
                        ForEach(skillLevels, id: \.self) { level in
                            Text("Class \(level)").tag(level)
                        }
                    }
                }
                Section("Home River") {
                    Picker("Home River", selection: $homeRiverSlug) {
                        Text("None").tag("")
                        ForEach(riversData) { river in
                            Text(river.name).tag(river.slug)
                        }
                    }
                    .pickerStyle(.navigationLink)
                }
                Section("Bio") {
                    TextEditor(text: $bio)
                        .frame(minHeight: 80)
                }
                if let error = errorMessage {
                    Section {
                        Text(error).foregroundStyle(.red).font(.caption)
                    }
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task { await save() }
                    }
                    .disabled(isLoading || displayName.isEmpty)
                }
            }
        }
    }

    private func save() async {
        guard let userId = auth.currentUser?.id else { return }
        isLoading = true
        do {
            let update = ProfileUpdate(
                displayName: displayName,
                skillLevel: skillLevel,
                homeRiverSlug: homeRiverSlug.isEmpty ? nil : homeRiverSlug,
                bio: bio.isEmpty ? nil : bio
            )
            try await supabase
                .from("profiles")
                .update(update)
                .eq("id", value: userId.uuidString)
                .execute()
            // Reload profile in auth service
            if let updated: Profile = try? await supabase
                .from("profiles")
                .select()
                .eq("id", value: userId.uuidString)
                .single()
                .execute()
                .value {
                await MainActor.run { auth.currentProfile = updated }
            }
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

# River Rats iOS

Native SwiftUI app — requires Xcode 15+ on macOS.

## Setup

### 1. Install XcodeGen

```bash
brew install xcodegen
```

### 2. Configure Supabase credentials

```bash
cp Secrets.xcconfig.example Secrets.xcconfig
# Edit Secrets.xcconfig with your project URL and anon key
```

Get your credentials from your Supabase project → Settings → API.

### 3. Generate the Xcode project

```bash
cd ios
xcodegen generate
```

### 4. Open and run

```bash
open RiverRats.xcodeproj
```

Select a simulator or device, then press ⌘R.

## Structure

```
RiverRats/
  RiverRatsApp.swift       — app entry point
  Models/                  — River, Trip, Profile, FlowData
  Services/
    SupabaseClient.swift   — shared Supabase client
    AuthService.swift      — login / signup / session
    RiversService.swift    — USGS live flow fetching
    TripsService.swift     — trip CRUD + join requests
  Views/
    Auth/                  — LoginView, SignupView
    Rivers/                — RiversListView, RiverDetailView
    Trips/                 — TripsListView, TripDetailView, CreateTripView
    Dashboard/             — DashboardView, EditProfileView
    Components/            — DifficultyBadge, FlowStatusView
```

## Dependencies

- [supabase-swift](https://github.com/supabase/supabase-swift) v2.x — auth + database
- USGS Instantaneous Values API — live river flow (no key required)

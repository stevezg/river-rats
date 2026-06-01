# RiverRat iOS

Native SwiftUI starter for RiverRat Colorado Beta.

## Open

Open `RiverRat.xcodeproj` in Xcode.

If command-line builds use the Command Line Tools instead of Xcode, run commands with:

```sh
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild -project RiverRat.xcodeproj -scheme RiverRat -destination 'platform=iOS Simulator,name=iPhone 16' build
```

## Current Scope

- SwiftUI app shell with five tabs: Runs, Trips, Create, Messages, Profile
- Offline-first sample store with local queued trip drafts
- Colorado run list and run detail screens
- Trip detail with "Who's paddling?" crew layer
- Message and profile placeholders aligned with the web beta
- Unit tests for run status, trip spot math, and paddler initials

## Next Build Steps

1. Add a real persistence layer for cached runs, trips, trip members, and messages.
2. Add Supabase auth/session storage.
3. Add sync service with retry queue for create trip, join request, and message send.
4. Replace sample data with local database reads.
5. Add MapKit run access points once the first flows are solid.

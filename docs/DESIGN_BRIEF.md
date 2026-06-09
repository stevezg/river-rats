# River Rats — Design Brief for Claude Design

## What to paste into Claude Design

Copy the block below and paste it as your prompt. Specify which surface you want first (desktop web, tablet, mobile web, or iPhone app) and which screen(s) to start with.

---

## THE PROMPT

---

**App:** River Rats — a social logistics platform for whitewater kayakers.

**One-liner:** Tinder meets Google Maps meets group chat, for people who want to paddle rivers together. Someone sees good flows, posts a "Trip Beacon" saying where and when they're going, and other paddlers can find it and request to join. The app handles all the coordination — who's coming, where to meet, how the shuttle works, group chat — so people spend less time in text threads and more time on the water.

---

### Brand & Visual Identity

**Personality:** Raw, outdoorsy, adventure-forward. Not REI catalog polished. More like a well-worn dry bag — functional, rugged, trusted. Think dark river water at dusk, neon on a wet paddle blade.

**Color palette (use exactly):**
- Background: `#0F1117` (near-black, very dark navy)
- Surface cards: `#1C1F26`
- Surface elevated: `#23272f`
- Primary / teal accent: `#4ECDC4` (used for active states, CTAs, key highlights)
- Warm accent / orange: `#FFA94D` (used for flow alerts, attention states)
- Danger / red: `#FF6B6B` (full trips, warnings)
- Text primary: `#FFFFFF`
- Text secondary: `#8B8FA8`
- Text muted: `#5C6070`
- Difficulty colors:
  - Class I–II (easy): `#52B788` (green)
  - Class III (moderate): `#FFA94D` (amber)
  - Class III–IV: `#FF8C42` (orange)
  - Class IV (hard): `#FF6B6B` (red-orange)
  - Class IV–V / V+ (expert/extreme): `#C62828` (deep red)

**Typography:**
- Display / headings: Space Grotesk (bold, tight letter-spacing)
- Body: Inter
- Numbers / data: tabular numerals, monospaced feel for CFS readings

**Design language:**
- Dark mode only
- Rounded cards (border-radius 16px on cards, 12px on smaller elements)
- Subtle borders: `rgba(255,255,255,0.08)` — barely visible, structural not decorative
- Thin teal top-accent bar (2px) on each card, `#4ECDC4` at 60% opacity
- Glassmorphism on nav bars: `rgba(15,17,23,0.97)` + blur
- Micro-interactions: cards scale to 101% on hover, smooth 200ms transitions
- No heavy drop shadows — use surface color layering instead
- Icons: clean outlined SVG style (similar to Lucide), 1.8–2.5px stroke weight
- CTA buttons: teal fill `#4ECDC4`, dark text `#0F1117`, rounded-full pill shape

---

### App Structure & Navigation

**Bottom navigation (mobile / iPhone app) — 6 tabs:**
1. **Feed** — trip beacons from the community
2. **Rivers** — river directory with live flow data
3. **Post** (center, teal pill button) — post a new trip beacon
4. **Friends** — connections, requests
5. **Messages** — group chats + DMs
6. **Profile** — user dashboard

**Top navigation (desktop web):**
- Left: "River Rats" wordmark (Space Grotesk, bold, teal)
- Right: Rivers · Trips · Friends · notification bell · messages icon · avatar
- Sticky, blurred glass background

**Tablet:** Side rail navigation (64px wide), same 6 tabs as mobile but vertical, icons + labels. Content area fills remaining width.

---

### Key Screens to Design

Design all screens in order. For each surface (desktop web, tablet, mobile web, iPhone app) produce the same set of screens so they feel like a unified system at different breakpoints.

---

#### SCREEN 1 — Marketing / Landing Page (web only)
- Hero: full-width dark image of a kayaker in whitewater (placeholder). Large headline: "Find your crew. Hit the river." Subline: "Post a trip. Join a run. Coordinate everything." Two CTAs: "Post a Trip" (teal filled) and "Browse Trips" (ghost/outline).
- Section: "How it works" — 3 steps with icons: 1) See good flows → 2) Post a beacon → 3) Paddlers join & coordinate
- Section: "Live trips near you" — 3 sample TripCards in a row
- Section: "70+ rivers tracked" — river directory teaser with flow badges
- Footer: dark, minimal

#### SCREEN 2 — Trip Feed (authenticated)
The main feed. This is the heart of the app.

Layout (desktop): Left sidebar (240px) with filters, main area with 3-column card grid.
Layout (tablet): 2-column card grid, filters in collapsible drawer.
Layout (mobile/iPhone): Single column card list, filter chips scrollable horizontally at top.

**TripCard anatomy:**
- 2px teal top accent bar across full card width
- River name (white, Space Grotesk semibold) + Region, State (secondary text)
- Difficulty badge (color-coded pill: "Class IV", "Class III-IV", etc.)
- Date + time row with calendar and clock icons
- Flow badge: CFS reading with color status dot (green=optimal, amber=low, red=high)
- Notes preview (2 lines max, secondary text)
- Footer row: Creator avatar (teal initials circle) + name + min skill badge | Spots remaining ("3 spots left" in teal, or "Full" in red) + thin fill bar
- CTA: "I'm In!" (teal pill button, full width) + "View details →" link below

**Filter sidebar / chips:** Difficulty (Class I–II through V+), State, Date range, Trip type (Day / Multi-day), Shuttle status

#### SCREEN 3 — Trip Detail
Full trip information page. Two-column on desktop (main content left, sidebar right).

**Main content:**
- River name + difficulty badge as page heading
- Creator row: avatar + name + "Class IV paddler" + "Add Friend" button
- Key info grid: Date · Time · Meeting Point · Spots remaining
- Shuttle section: shuttle type (badge), available seats, who needs a ride
- Put-in / Take-out: two map pins side by side with location names + "Directions" deeplink button (opens Apple/Google Maps)
- Static map embed showing put-in and take-out pins
- American Whitewater link button: "View river beta on AW →"
- Notes (full text)
- Crew list: avatar grid of confirmed members with skill levels

**Sidebar (desktop) / bottom section (mobile):**
- "Join this trip" CTA card: spots bar, skill requirement warning if below min, "Request to Join" button
- Group chat preview: last 3 messages, "Open group chat" button

#### SCREEN 4 — Post a Trip (Trip Beacon Creation)
Form screen. Single column, card-grouped sections.

Sections:
1. **River** — searchable dropdown (river name + difficulty + state)
2. **When** — date picker (single or range for multi-day) + time input
3. **Where to meet** — put-in location (map pin picker) + take-out location (map pin picker)
4. **Shuttle** — radio group: Self-sufficient / Need shuttle help / Have extra seats / Motorcycle shuttle
5. **Group size** — min/max stepper
6. **Skill requirement** — minimum class selector (same colored pills as difficulty badges)
7. **Visibility** — Friends only / Public (toggle)
8. **Notes** — textarea
9. **American Whitewater link** — optional text input (paste AW section URL)

Bottom: "Post Beacon" teal full-width button.

#### SCREEN 5 — Messages / Inbox
**List view:**
- Each conversation row: avatar or group icon | conversation title (river name for trips, person's name for DMs) | last message preview + timestamp | unread count badge (teal pill)
- Two sections: "Trips" and "Direct Messages"

**Thread view (desktop: right pane / mobile: full screen):**
- Header: conversation title + participant count + back button (mobile)
- Message bubbles: own messages right-aligned (teal background), others left-aligned (surface-2 background)
- Sender name + avatar above each bubble (group chats)
- Input bar: text field + send button, pinned to bottom, glass blur background

#### SCREEN 6 — Profile / Dashboard
- Header: large avatar (80px circle, teal border), Display name (Space Grotesk bold), "Class IV · Creeker" subtitle
- Stats row: Trips · Rivers paddled · Friends
- "Frequent Crew" horizontal scroll: avatar chips of frequent paddling partners
- Upcoming trips list (2–3 TripCards, compact)
- Past trips / history (list view, compact)
- Flow alerts section: rivers user is watching with CFS range badges
- Edit Profile button (ghost/outline)

#### SCREEN 7 — Friends
Three tabs: Friends · Requests · Find Paddlers

**Friends tab:** Grid of friend cards — avatar, name, skill level, "Paddled together X times" chip, "Message" icon button.

**Requests tab:** Incoming requests (accept / decline). Outgoing requests (cancel).

**Find Paddlers tab:** Search by region + skill level. Results as cards: avatar, name, skill, home river, mutual connections count, "Add Friend" / "Invite to Trip" buttons.

#### SCREEN 8 — River Detail
- Header: River name, State, Difficulty badge
- Current CFS with large number display, trend arrow (↑ rising / ↓ falling / → stable)
- Flow status bar: ━━━━●━━━ showing current CFS within optimal range, color-coded
- Flow sparkline chart (7-day)
- Optimal range: "680–1200 CFS" in teal
- "Trips on this river" — filtered TripCard list
- "Set flow alert" button → slide-up/modal with min/max CFS inputs

---

### iPhone App — Additional Notes

For the native iPhone app screens, follow iOS conventions on top of the brand:

- Safe area insets respected (status bar, home indicator)
- Bottom tab bar: frosted glass (matches the web bottom nav), 6 tabs with the "Post" tab as a raised teal circle in the center
- Swipe gestures implied (swipe back from detail views)
- Sheet presentations for: join request confirmation, shuttle claim, float plan export, flow alert setup
- Haptic feedback implied on "I'm In!" and "Request to Join" taps
- Push notification design: show a sample notification for "Jake joined your trip on the Upper Gauley"
- App icon concept: kayak paddle blade silhouette on dark background, with a teal water ripple

---

### Tone for Microcopy

- "Post a Beacon" (not "Create a Trip")
- "I'm In!" (not "Join")
- "Crew" (not "Members" or "Participants")
- "Your runs" (not "Your trips" on profile)
- Flow status: "Firing" (optimal), "Too low", "Blown out"
- Skill level gate warning: "Heads up — this run requires Class IV experience. Make sure your group is comfortable."
- Empty feed: "No trips near you yet. Be the first to post a beacon."

---

### What NOT to include

- No flow gauge data display (users check AW/USGS themselves — we just link to AW)
- No star ratings or reviews of paddlers
- No payment or booking flows
- No light mode

---

## Suggested Starting Points by Surface

**Desktop web:** Start with the Trip Feed (Screen 2) — it's the highest-signal screen for establishing the design system.

**Tablet:** Start with the Trip Feed in 2-column layout with the side rail nav.

**Mobile web:** Start with the Trip Feed as a single-column scrolling list with horizontal filter chips.

**iPhone app:** Start with the bottom nav + Trip Feed, then the Post a Trip form, then the Trip Detail sheet presentation.

# River Rats — Product Requirements Document (MVP)

**Version:** 1.1  
**Date:** 2026-05-06  
**Status:** Active Development

> Status key: ✅ Done · 🔧 Partial / needs work · ⬜ Not started

---

## 1. Vision

River Rats is a social logistics platform for kayakers. It removes the friction of organizing river trips — finding partners, coordinating put-ins/take-outs, arranging shuttles, and matching paddlers by skill level — so people can spend less time in group chats and more time on the water.

Flow data and river beta already exist (American Whitewater, USGS, etc.). River Rats is not trying to replicate those. Instead, it is the coordination layer that sits on top: who is going, when, where to meet, how to get cars back, and whether the group's skill mix is appropriate for the run.

---

## 2. Problem Statement

Organizing a river trip today looks like:
- Scanning flows on USGS or AW, seeing something good, then scrambling through contacts
- Multi-hour group texts trying to confirm who's in, who's driving, where to meet
- Mismatched skill levels showing up at the put-in
- No easy way to meet new paddling partners outside of club mailing lists

The result is that people paddle less, paddle with the same small circle, or take on unsuitable water because they couldn't coordinate a better group.

---

## 3. Target Users

| Persona | Description |
|---|---|
| The Opportunist | Checks flows daily, wants to jump on a good window fast |
| The Planner | Organizes multi-day trips weeks out, needs RSVP and logistics tracking |
| The Social Paddler | Wants to grow their network, meet new paddlers, join existing trips |
| The Safety-Conscious Guide | Wants skill verification before accepting strangers on committing water |

---

## 4. Core Concept: The Trip Beacon

A **Trip Beacon** is the central object in River Rats. It is a public or semi-public post that says:

> "I'm running [River / Section] on [Date]. Put-in at [location] at [time]. Looking for [N] paddlers. Skill: [Class X+]. Shuttle: [arranged / needed]."

Anyone with access (friends, club members, or the public) can see the beacon and request to join. The trip creator approves members. Once the group is set, the beacon becomes a private **Trip** with its own coordination space.

---

## 5. Feature Status

### 5.1 Authentication & Profiles

| Feature | Status | Notes |
|---|---|---|
| Phone + password signup/login | ✅ Done | Supabase Auth |
| Google OAuth | ✅ Done | |
| Auto-profile creation on signup | ✅ Done | Username derived from email/phone |
| Protected routes / middleware | ✅ Done | |
| Skill level on profile | ✅ Done | Class I–V+ self-reported, set at signup |
| Disciplines / boat types | ⬜ Not started | e.g., creek, playboat, sea kayak, canoe |
| Bio field | ✅ Done | |
| Home river | ✅ Done | `home_river_slug` |
| Avatar upload | ✅ Done | `avatar_url` |
| Trip history (auto from completed trips) | ⬜ Not started | Need post-trip flow |
| "Paddled with" connection graph | 🔧 Partial | Friends table exists; auto-populate from trips not built |

### 5.2 Trip Beacon (Trip Creation)

| Feature | Status | Notes |
|---|---|---|
| River / section picker | ✅ Done | From static river list |
| Date + time | ✅ Done | |
| Meeting point (text) | ✅ Done | |
| Spot count | ✅ Done | `total_spots` + `spots_remaining` via trigger |
| Minimum skill level | ✅ Done | |
| Notes field | ✅ Done | |
| Put-in / take-out map pins | ⬜ Not started | Currently just text meeting point |
| Shuttle plan | ⬜ Not started | No shuttle fields yet |
| Visibility (friends only / public) | ⬜ Not started | All trips currently public |
| Multi-day date range | ⬜ Not started | Single date only |
| AW section link | ⬜ Not started | |
| Quick join vs. approval toggle | ✅ Done | `quick_join_enabled` field |

### 5.3 Trip Feed

| Feature | Status | Notes |
|---|---|---|
| Trip feed (list view) | ✅ Done | Real-time via Supabase subscriptions |
| Filter by difficulty / state / date | ✅ Done | |
| Trip card with CFS, creator, spots | ✅ Done | |
| Map view of open beacons | ⬜ Not started | |
| Saved searches / alerts for new trips | ⬜ Not started | Flow alerts exist; trip alerts don't |
| "Near me" filter | ⬜ Not started | |

### 5.4 Join Flow & Group Management

| Feature | Status | Notes |
|---|---|---|
| Request to join a trip | ✅ Done | `join_requests` table |
| Creator approve / decline | ✅ Done | |
| Quick join (no approval) | ✅ Done | `instant_join_trip()` RPC |
| View requester profile before deciding | 🔧 Partial | Data is there; UI needs work |
| Waitlist | ⬜ Not started | |
| Leave trip / remove member | ⬜ Not started | |
| Auto-approve for friends | ⬜ Not started | |
| Skill level warning on join | ⬜ Not started | |

### 5.5 Trip Coordination Space

| Feature | Status | Notes |
|---|---|---|
| Trip detail page | ✅ Done | `/trips/[id]` |
| Participant list | ✅ Done | |
| Group chat (auto-created per trip) | ✅ Done | Conversation auto-created on trip post |
| Auto-add members to trip chat | ✅ Done | |
| Real-time messaging | ✅ Done | Supabase Realtime |
| Logistics tab (put-in/take-out pins) | ⬜ Not started | |
| Shuttle coordinator view | ⬜ Not started | |
| Shared packing list | ⬜ Not started | |
| Emergency contacts (members only) | ⬜ Not started | |
| Float plan export | ⬜ Not started | |
| RSVP status (confirmed / tentative) | ⬜ Not started | |

### 5.6 Shuttle Coordination

| Feature | Status | Notes |
|---|---|---|
| Shuttle type selector | ⬜ Not started | |
| Seat tracking (drivers post seats, riders claim) | ⬜ Not started | |
| Carpool matching by origin region | ⬜ Not started | |
| Motorcycle shuttle flag | ⬜ Not started | |

### 5.7 Maps

| Feature | Status | Notes |
|---|---|---|
| Put-in / take-out map pins on trip detail | ⬜ Not started | |
| Directions deeplink (Apple/Google Maps) | ⬜ Not started | |
| Trip feed map view | ⬜ Not started | |

### 5.8 Social & Matching

| Feature | Status | Notes |
|---|---|---|
| Friend requests (send / accept / decline / cancel) | ✅ Done | Full flow with DB views + RPC |
| Friends list | ✅ Done | |
| Block | ✅ Done | `blocked` status in friends table |
| "Find a paddler" (search by region + skill) | ⬜ Not started | |
| Suggested paddlers | ⬜ Not started | |
| Frequent partners list (auto from shared trips) | ⬜ Not started | |
| Invite a friend to a trip | ⬜ Not started | |

### 5.9 Messaging

| Feature | Status | Notes |
|---|---|---|
| Trip group chat | ✅ Done | |
| 1:1 direct messages | ✅ Done | Create-or-get logic |
| Unread message count + badge | ✅ Done | `last_read_at` per member |
| Inbox / conversation list | ✅ Done | `/messages` |
| Push notifications for messages | ⬜ Not started | In-app only currently |

### 5.10 Notifications

| Feature | Status | Notes |
|---|---|---|
| In-app notification bell | ✅ Done | |
| Notifications table + subscriptions | ✅ Done | |
| Join request received | ✅ Done | `join_request` type |
| Trip joined / approved | ✅ Done | `trip_joined` / `trip_approved` types |
| Flow alerts (USGS gauge, CFS range) | ✅ Done | Cron job, 6hr cooldown |
| New message notification | 🔧 Partial | Table supports it; UI notification not wired |
| Friend posts a beacon | ⬜ Not started | |
| Trip time reminder (24hr / 2hr) | ⬜ Not started | |
| Push notifications (web push / mobile) | ⬜ Not started | |

### 5.11 Rivers & Flow Data

| Feature | Status | Notes |
|---|---|---|
| River directory (70+ rivers) | ✅ Done | Static list with USGS gauge IDs |
| Live CFS from USGS | ✅ Done | |
| Optimal flow range + status badge | ✅ Done | low / optimal / high |
| Flow trend (rising / falling / stable) | ✅ Done | |
| Flow sparkline | ✅ Done | |
| River detail page | ✅ Done | `/rivers/[slug]` |
| User-configured flow alerts | ✅ Done | |
| AW section link on trip | ⬜ Not started | |

### 5.12 Post-Trip

| Feature | Status | Notes |
|---|---|---|
| Mark trip complete | ⬜ Not started | |
| Trip history log on profile | ⬜ Not started | |
| "Paddled with" confirmation prompt | ⬜ Not started | Builds connection graph |
| Trip conditions notes (private log) | ⬜ Not started | |
| Float plan export | ⬜ Not started | |

---

## 6. MVP Remaining Work (Priority Order)

These are the gaps between current state and a shippable MVP:

### P0 — Core Logistics (the whole point of the app)
1. **Put-in / take-out map pins** on trip creation and trip detail
2. **Shuttle coordination** — type selector, seat tracking, carpool matching
3. **Trip visibility** — friends-only vs. public toggle
4. **Leave trip / remove member** — basic group management
5. **Skill-level warning** when a requester is below the trip minimum

### P1 — Trip Lifecycle
6. **Post-trip flow** — mark complete, log trip, "paddled with" prompt
7. **Trip history on profile** — auto-populated
8. **Multi-day trip support** — date range, multi-section notes
9. **RSVP status** (confirmed / tentative) within a confirmed trip

### P2 — Discovery & Matching
10. **Map view** of open trip beacons
11. **"Find a paddler"** — search by region + skill level
12. **Invite friend to a trip** from friend list
13. **Frequent partners** auto-computed from shared trips

### P3 — Safety & Compliance
14. **Emergency contacts** visible to trip members only
15. **Float plan export** (text/PDF with river, put-in, take-out, group, return time)
16. **Community reporting** on profiles/trips

### P4 — Polish
17. **Push notifications** (web push to start)
18. **Trip time reminders** (24hr / 2hr)
19. **AW section link** on trip creation
20. **Saved trip searches** / alert subscriptions

---

## 7. Out of Scope for MVP

| Feature | Rationale |
|---|---|
| Flow data / gauge display in-app | Already done (and AW/USGS exist anyway) |
| River beta / run descriptions | AW has this; we link |
| In-app payments / trip fees | Regulatory complexity |
| Commercial guiding | Different liability model |
| Gear rental | Post-MVP |
| Video / media uploads | Storage cost |
| Club/organization management | Post-MVP |
| AI trip suggestions | Post-MVP |
| Paddler ratings / reviews | Toxicity risk; post-MVP |

---

## 8. Data Model (Current + Gaps)

### Existing Tables
```
profiles         — user identity, skill_level, bio, avatar_url, home_river_slug
trips            — creator_id, river_slug, date, time, meeting_point, min_skill,
                   total_spots, spots_remaining, status, quick_join_enabled
trip_members     — user_id, trip_id, role (creator|member)
join_requests    — user_id, trip_id, status (pending|approved|declined), message
friends          — requester_id, recipient_id, status (pending|accepted|declined|blocked)
conversations    — type (trip|direct), trip_id
conversation_members — user_id, conversation_id, last_read_at
messages         — sender_id, conversation_id, body, edited_at
notifications    — user_id, type, read, payload
flow_alerts      — user_id, river_slug, gauge_id, min_cfs, max_cfs, enabled
flow_alert_notifications — audit log, prevents spam
```

### Fields / Tables to Add
```
trips            + put_in_lat, put_in_lng, put_in_label
                 + take_out_lat, take_out_lng, take_out_label
                 + shuttle_type (none|self|need_driver|has_seats|moto)
                 + date_end (multi-day)
                 + aw_section_url
                 + visibility (public|friends)

trip_members     + rsvp_status (confirmed|tentative|dropped)
                 + needs_shuttle_seat (bool)

profiles         + disciplines[] (creek|playboat|sea_kayak|canoe|sup)
                 + boat_types[]

trip_log         — completed trips per user (trip_id, user_id, notes, completed_at)
```

---

## 9. Technical Stack

- **Frontend:** Next.js 14+ (React, TypeScript, Tailwind CSS) — dark theme, `#0F1117` bg, `#4ECDC4` accent
- **Backend / DB:** Supabase (Postgres + Auth + Realtime + RLS)
- **Real-time:** Supabase Realtime subscriptions (trips feed, messages, notifications)
- **Auth:** Supabase Auth — phone/password + Google OAuth
- **Maps:** Mapbox or Google Maps Static API (embed) + deeplink to native maps — not yet integrated
- **External APIs:** USGS Water Services (live CFS, gauge data)
- **Shared:** Monorepo `shared/` package for TypeScript types and river static data
- **Push notifications:** Not yet implemented; plan is web push via Supabase Edge Functions

---

## 10. MVP Success Metrics

| Metric | Target (90 days post-launch) |
|---|---|
| Trips posted | 100+ |
| Users who join a trip with someone they didn't know before | 40% of active users |
| Trip coordination messages sent | 500+ |
| Shuttle resolved in-app vs. reverting to group text | >60% of trips |
| Zero incidents attributed to skill mismatch | Ongoing |

---

## 11. Build Order (Revised)

Already done (foundation is solid):
- Auth, profiles, trip CRUD, trip feed, join flow, group chat, messaging, friends, flow alerts

Remaining, in order:
1. Put-in / take-out fields + map pins on trip creation + detail
2. Shuttle coordination fields + UI
3. Trip visibility toggle (friends / public)
4. Leave trip / remove member
5. Skill-level warning on join request
6. Post-trip flow (mark complete + "paddled with" prompt)
7. Trip history on profile
8. Multi-day trip support
9. Map view of beacons (trip feed)
10. Find a paddler (search)
11. Invite friend to trip
12. Emergency contacts + float plan export
13. Push notifications + reminders
14. AW section link on trips

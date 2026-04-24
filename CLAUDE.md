# River Rats — CLAUDE.md

## What This Is

River Rats is a **mobile-first social platform for whitewater kayakers**. The core problem it solves: kayakers currently coordinate runs through Facebook groups and group texts. This app replaces that workflow with a purpose-built tool — check live river flows, post a trip, invite friends at your skill level, and coordinate everything (day runs, overnights, multi-day expeditions) in one place.

**Live at:** [riverratsapp.com](https://riverratsapp.com) — deployed from `master` on Vercel.

---

## Monorepo Structure

```
river-rats/
├── web/              — Next.js 15 web app (App Router, RSC, Tailwind v4)
├── shared/           — @riverrats/shared: USGS fetcher, river definitions, shared types
├── packages/api/     — Hono REST API (standalone, not yet deployed)
├── supabase/         — Postgres migrations, RLS policies, local config
│   └── migrations/   — Applied in order; never edit existing migrations, always add new ones
├── docs/             — Project documentation
└── CLAUDE.md         — This file
```

**Package manager:** Yarn Workspaces (root `package.json` defines `workspaces: ["web", "shared", "packages/*"]`).

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Web framework | Next.js 15 (App Router) | RSC by default; client components only when needed |
| Styling | Tailwind CSS v4 | Mobile-first breakpoints |
| Language | TypeScript (strict) | All packages |
| Database | Supabase — PostgreSQL 17 | Row-Level Security on every table |
| Auth | Supabase Auth → **migrating to Clerk** | See Auth section below |
| External data | USGS Instantaneous Values API | Live CFS + water temp per gauge |
| API server | Hono (`packages/api`) | Node.js, not yet deployed |
| Hosting | Vercel (`web/`) | `master` branch = production |
| Shared lib | `@riverrats/shared` | USGS fetcher, `riversData`, shared types |

### Planned / In Progress

| Layer | Technology | Status |
|---|---|---|
| Mobile | React Native or native iOS/Android | Architecture decision pending |
| Auth (mobile) | Clerk | Branch: `feature/clerk-phone-auth` |
| Phone auth | Clerk (SMS OTP) | After email auth is solid |
| Push notifications | TBD (Expo or APNs/FCM) | Needed for flow alerts |

---

## Architecture Principles

### Object-Oriented, Custom Data Structures

All core domain models are **typed interfaces / classes** — not loose record types. When adding a domain concept, define it as an explicit type in `shared/src/` or `web/src/lib/`. Prefer:

- Typed interfaces for data (e.g., `RiverStatic`, `FlowData`, `Trip`, `Message`)
- Classes for logic-bearing objects (e.g., a `TripCoordinator` class that knows how to manage join requests)
- Enums or string literal unions for bounded values (e.g., `DifficultyClass`, `FlowTrend`)

Custom collection types (typed Maps, typed Sets) over plain objects wherever the semantics warrant it. The `fetchFlowData` function already uses `Map<string, FlowData>` — follow that pattern.

For performance-critical data structure work (e.g., a spatial index over gauges, a priority queue for flow alert processing), implementations in **C++ or Python** can be exposed as a microservice or native module. Default to TypeScript first; only drop to C++/Python when profiling justifies it.

### Mobile-First

- Web layouts designed for 375px width first, then scaled up
- Bottom navigation bar already implemented (`BottomNav.tsx`)
- Touch targets ≥ 44px
- The web app is a stepping stone; native mobile (React Native or native) is the target platform. When building features, think "how will this work on a phone?"

### Security

- All Supabase tables have RLS enabled — **never disable RLS**, add policies instead
- Supabase Auth handles password hashing (bcrypt) — never roll your own password storage
- Clerk (when migrated) provides: email magic link, password with autofill support, phone OTP later. Clerk is SOC 2 Type II and handles all token management
- Row-level policies enforce that users can only read/write their own data unless explicitly public
- Server components fetch data server-side; anon key is fine for public reads, service role key is never exposed to the client

---

## Auth Strategy

### Current: Supabase Auth
Email/password + Google OAuth. Works on `master`/production today.

### Migration: Clerk (in progress on `feature/clerk-phone-auth`)
**Why Clerk over Supabase Auth:**
- Native mobile SDKs (React Native, Expo, iOS, Android)
- Autofill-compatible email/password flows out of the box
- Phone OTP support without extra configuration (needed for Phase 2)
- Pre-built UI components that match app branding
- Better session management across web + mobile

**Migration plan:**
1. Wire Clerk into `web/` with email/password
2. Sync Clerk user IDs to `profiles.id` (or add a `clerk_id` column)
3. Replace Supabase middleware auth checks with Clerk middleware
4. Mobile app uses Clerk's React Native or native SDK
5. Enable phone auth after email is stable

**Password policy:** Clerk enforces minimum complexity. Passwords are hashed by Clerk (bcrypt/argon2 — not our concern). Users get autofill-friendly flows on both web and mobile.

---

## Environments

| Environment | Branch | URL | Supabase project |
|---|---|---|---|
| Production | `master` | riverratsapp.com (Vercel) | Production project |
| Development | any feature branch | localhost:3000 | Local Supabase stack |
| Staging | (to be created) | TBD | Staging project |

### Environment Variables

`web/.env.local` (never committed):
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321      # or prod URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>         # server-only
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk key>        # when Clerk is live
CLERK_SECRET_KEY=<clerk secret>                      # server-only
CRON_SECRET=<secret>                                 # for /api/cron routes
```

Production env vars are set in Vercel dashboard — never in code.

---

## Database Schema

All tables live in `public` schema with RLS enabled. Migrations in `supabase/migrations/` applied in timestamp order.

### Core Tables

| Table | Purpose |
|---|---|
| `profiles` | User profiles (id = auth.users.id). skill_level, home_river_slug, bio, avatar_url |
| `trips` | Trip postings. river_slug, date, meeting_point, min_skill, spots_remaining, status |
| `trip_members` | Confirmed participants. role: creator \| member |
| `join_requests` | Pending requests. status: pending \| approved \| declined |
| `flow_alerts` | Per-user CFS range subscriptions per river |
| `conversations` | Messaging threads. type: trip \| direct |
| `conversation_members` | Who is in each conversation + last_read_at |
| `messages` | Message body, sender, timestamps |
| `friends` | Friendship graph. status: pending \| accepted \| declined \| blocked |

### Key Triggers

- `trg_on_auth_user_created` — auto-creates a `profiles` row on signup
- `trg_trip_members_spots` — keeps `trips.spots_remaining` in sync
- `trg_trip_create_conversation` — auto-creates a group chat when a trip is posted
- `trg_trip_member_join_conversation` — adds new trip members to the group chat

### Migration Rules

1. **Never edit existing migration files** — Supabase applies them idempotently by filename
2. Always create a new `.sql` file with a timestamp prefix: `YYYYMMDDHHMMSS_description.sql`
3. Include rollback comments where feasible
4. Test locally with `supabase db reset` before pushing

---

## River Data

`shared/src/rivers-data.ts` — 31 hand-curated rivers with static properties:
- `gaugeId` — USGS site ID for live CFS lookup
- `optimalMin` / `optimalMax` — CFS range for "runnable" status
- `difficulty` — `DifficultyClass` union (`"I-II" | "III" | "III-IV" | "IV" | "IV-V" | "V" | "V+"`)
- `hazards[]` — safety information

Live flow data fetched from USGS IV API (`shared/src/usgs.ts`):
- In-memory 5-minute cache per gauge
- Returns `FlowData { cfs, timestamp, trend, tempC? }`
- Trend computed by comparing last two readings (< 1 CFS delta = "stable")
- `parameterCd=00060` (discharge) + `00010` (water temperature) fetched together

---

## Social Features

### Trip Coordination
Organizer posts a trip (river, date, meeting point, min skill level, spot count). Other users request to join. Organizer approves/declines. Approved members get added to the trip's group chat automatically.

### Messaging
- Every trip auto-gets a group conversation
- Direct messages (1:1) between any two users via `create_or_get_dm()` RPC
- Real-time via Supabase Realtime (`messages` table subscribed)
- Unread count tracked via `conversation_members.last_read_at`

### Friends
Full friendship graph: send request → accept/decline → unfriend. Views `my_friends`, `pending_requests_sent`, `pending_requests_received` for easy querying.

### Flow Alerts
Users subscribe to a CFS range on a river. Cron job at `/api/cron/check-alerts` polls USGS and sends notifications when a gauge enters the user's target range.

---

## Key APIs & Routes

### Web Routes (`web/src/app/`)

| Route | Type | Description |
|---|---|---|
| `/` | Server | Marketing + waitlist |
| `/rivers` | Server | Browse all rivers with live CFS |
| `/rivers/[slug]` | Server | River detail, gauge history, open trips |
| `/trips` | Client | Browse + filter open trips |
| `/trips/new` | Client | Create trip (auth required) |
| `/trips/[id]` | Server | Trip detail, join request |
| `/dashboard` | Server | Profile, my trips |
| `/messages` | Server | Conversation list |
| `/messages/[id]` | Client | Real-time message thread |
| `/friends` | Server | Friends list + pending requests |
| `/login` | Client | Auth |
| `/signup` | Client | Auth |

### Hono API (`packages/api/src/index.ts`)

| Endpoint | Description |
|---|---|
| `GET /api/rivers` | All rivers with live flow |
| `GET /api/rivers/:slug` | Single river with live flow |
| `GET /api/flow/:gaugeId` | Raw USGS data for a gauge |

This API is currently standalone (not deployed). It will serve the mobile app.

---

## Development Setup

### Prerequisites
- Node.js 18+
- Yarn (`npm i -g yarn`)
- Supabase CLI (`brew install supabase/tap/supabase`)
- Docker (for local Supabase)

### Local Dev

```bash
# Install all workspace dependencies
yarn install

# Start local Supabase (PostgreSQL + Auth + Studio + Realtime)
supabase start

# Local services:
#   API:     http://localhost:54321
#   DB:      postgresql://localhost:54322
#   Studio:  http://localhost:54323
#   Email:   http://localhost:54324 (Inbucket)

# Create web/.env.local with keys from `supabase start` output
# Then run the web app
cd web && yarn dev   # http://localhost:3000

# Stop Supabase
supabase stop
```

### Database Reset (apply all migrations fresh)

```bash
supabase db reset
```

### Running the Hono API

```bash
cd packages/api && yarn dev   # http://localhost:3001
```

---

## Branch & Git Workflow

| Branch | Purpose |
|---|---|
| `master` | Production — auto-deploys to Vercel. **Protect this branch.** |
| `feature/*` | Feature development |
| `fix/*` | Bug fixes |
| `claude/*` | AI-assisted work |

- Never force-push `master`
- PRs required to merge into `master`
- Staging environment (TBD) will track a `staging` branch

---

## Shared Library (`@riverrats/shared`)

Import from anywhere in the monorepo:
```ts
import { fetchFlowData, riversData } from "@riverrats/shared";
import type { RiverStatic, FlowData, DifficultyClass, FlowTrend } from "@riverrats/shared";
```

When adding new shared types or utilities, export them from `shared/src/index.ts`.

---

## Coding Conventions

- **TypeScript strict mode** everywhere — no `any`, no `@ts-ignore` except at genuine library boundaries
- **OOP for domain logic** — define classes/interfaces for entities, not plain `Record<string, unknown>`
- **Server components by default** — add `"use client"` only when you need hooks, browser APIs, or real-time subscriptions
- **No comments on obvious code** — only add a comment when the WHY is non-obvious (a constraint, a workaround, a subtle invariant)
- **RLS is the access control layer** — don't replicate it in application code
- **Environment secrets** — only in `.env.local` (local) or Vercel dashboard (production), never hardcoded

---

## Mobile App Direction

The web app is the MVP foundation. The mobile app is the primary long-term target.

**Preferred approach:** React Native (Expo) — shares TypeScript types from `@riverrats/shared`, uses same Supabase backend, Clerk auth SDK available natively.

**Alternative:** Native iOS (Swift) + Android (Kotlin) — more work, better performance. Justified if push notifications, camera access, or offline flow caching become core features.

**Mobile workspace:** When the mobile app is added, it will live at `mobile/` in the monorepo as another Yarn workspace.

The Hono API in `packages/api/` will be the mobile backend — deploy it (Railway, Fly.io, or Supabase Edge Functions) before starting mobile development.

---

## What's Next (Rough Priority)

1. **Clerk auth migration** — complete `feature/clerk-phone-auth`, merge to `master`
2. **Staging environment** — Vercel preview + staging Supabase project, separate env vars
3. **Mobile app scaffold** — `mobile/` workspace, Expo + React Native, Clerk SDK
4. **Flow alert push notifications** — APNs/FCM via Expo or native
5. **Overnight/multi-day trip support** — extend trip schema (multi-day dates, gear lists, camping logistics)
6. **Phone auth (SMS OTP)** — via Clerk after email auth is solid
7. **Deploy Hono API** — needed before mobile launch

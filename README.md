# River Rats

A social platform for whitewater paddlers — find trip partners at your skill level, check live river flows, and log your paddling resume.

## What It Does

River Rats solves the "running a river alone" problem. Paddlers can:

- **Browse rivers** with live USGS flow data (CFS), difficulty ratings, and current conditions
- **Post and join trips** — organizers set date, meeting point, minimum skill level, and spot count
- **Request to join** trips and get approved by the organizer
- **Track their paddling resume** via a personal dashboard of past and upcoming trips

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router, React Server Components) |
| Styling | Tailwind CSS v4 |
| Auth & Database | Supabase (PostgreSQL 17, Row-Level Security) |
| External Data | USGS Instantaneous Values API (live river flow) |
| Language | TypeScript |

**Monorepo structure (Yarn Workspaces):**

```
web/          — Next.js app
shared/       — @riverrats/shared: USGS fetcher, river definitions
supabase/     — Migrations, seed data, local config
docs/         — Project docs
linear/       — Issue tracking exports
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- Docker (for the local Supabase stack)

### Setup

**1. Install dependencies**

```bash
yarn install
```

**2. Start the local Supabase stack**

```bash
supabase start
```

This boots PostgreSQL, Auth, REST API, and Studio. Migrations in `supabase/migrations/` are applied automatically.

| Service | URL |
|---------|-----|
| API | http://localhost:54321 |
| Database | postgresql://localhost:54322 |
| Studio | http://localhost:54323 |
| Email testing (Inbucket) | http://localhost:54324 |

**3. Configure environment variables**

Create `web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
```

**4. Run the dev server**

```bash
cd web
yarn dev
```

App runs at [http://localhost:3000](http://localhost:3000).

**5. Stop Supabase when done**

```bash
supabase stop
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing homepage with waitlist signup |
| `/rivers` | Browse rivers with live CFS, difficulty, and conditions |
| `/rivers/[slug]` | River detail — flow data, gauge history, open trips |
| `/trips` | Browse all open trips with filters |
| `/trips/new` | Create a trip (requires auth) |
| `/trips/[id]` | Trip detail — participants, join request, live flow |
| `/dashboard` | Personal dashboard — profile, my trips, upcoming |
| `/login` | Email/password and Google OAuth |
| `/signup` | Create an account |

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles synced from Supabase Auth |
| `trips` | Trip postings (river, date, spots, min skill) |
| `trip_members` | Confirmed trip participants |
| `join_requests` | Pending join requests (pending / approved / declined) |
| `flow_alerts` | User flow notifications (future feature) |

Key triggers: auto-creates profiles on signup, keeps `spots_remaining` in sync as members join/leave.

---

## Key Features

- **Live flow data** — USGS gauge IDs tied to each river; CFS fetched server-side on every request
- **Auth-aware UI** — Middleware protects `/trips/new`; dashboard and join buttons reflect auth state
- **Skill-level matching** — Trips have a minimum skill level; organizers control who joins
- **Shared library** — `@riverrats/shared` exports USGS fetcher and river static data, reusable across the monorepo

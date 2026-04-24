# River Rats — CLAUDE.md

> "Never run a river alone."

Social coordination platform for whitewater kayakers. Replaces the group text / Facebook group with a purpose-built app: check live flows, post a trip, find partners at your skill level, and stay connected with your paddling crew.

---

## What We're Building

Kayakers currently coordinate via group texts, Facebook groups, and word of mouth. This app is the tool they've been missing:

- **Check flows** — live USGS CFS data with runnable windows, trend arrows, and flow alerts
- **Post a trip** — one-day sessions (a "boating sesh"), multi-day overnight expeditions
- **Find partners** — skill-level matching, join requests, organizer approval
- **Stay connected** — group chat per trip, 1:1 DMs, friends list, activity feed
- **Build a resume** — personal dashboard of rivers run, skill progression, trip history

---

## Project State (as of April 2026)

### What's already built (on `master` → riverratsapp.com)

| Feature | Status |
|---------|--------|
| Live USGS flow data (31 rivers, national) | ✅ Done |
| River browser with difficulty, hazards, flow badge | ✅ Done |
| Trip posting + join request flow | ✅ Done |
| Trip group chats (auto-created on trip post) | ✅ Done |
| 1:1 direct messages | ✅ Done |
| Friends system (request / accept / decline) | ✅ Done |
| Flow alerts (cron, email notifications) | ✅ Done |
| Auth (Supabase email/password) | ✅ Done — migrating to Clerk |
| Mobile app | ❌ Not started |
| Overnight / multi-day trips | ❌ Not started |
| Push notifications (mobile) | ❌ Not started |
| User profile / paddle resume | 🟡 Partial (dashboard exists) |
| "Imm-in" quick sesh coordination | 🟡 Button exists, needs fleshing out |

### Open PR
- **PR #4** — `feature/clerk-phone-auth`: migrates auth from Supabase to Clerk (phone + SMS). **Do not merge until mobile is ready and Clerk is fully configured.**

---

## Monorepo Structure

```
river-rats/
├── web/                     Next.js web app (Vercel → riverratsapp.com)
├── mobile/                  React Native app (Expo) — TO BE CREATED
├── shared/                  @riverrats/shared — domain models, USGS, types
│   └── src/
│       ├── rivers-data.ts   RiverStatic definitions (31 rivers + USGS gauge IDs)
│       ├── usgs.ts          USGS Instantaneous Values API client (5-min cache)
│       └── index.ts         Barrel export
├── packages/
│   └── api/                 Hono HTTP API (TypeScript) — /api/rivers, /api/flow/:gaugeId
├── supabase/
│   ├── config.toml
│   └── migrations/          All DB schema lives here — never edit Supabase Studio directly
└── CLAUDE.md                ← you are here
```

Package manager: **Yarn Workspaces** (`yarn install` from root installs everything).

---

## Tech Stack

### Web
| Layer | Technology | Decision |
|-------|-----------|----------|
| Framework | Next.js 16 (App Router) | Already on Vercel, keep it |
| Language | TypeScript | Shared with all packages |
| Styling | Tailwind CSS v4 | Already in place |
| Auth | **Clerk** | Migrate from Supabase Auth — see Auth section |
| Database | Supabase PostgreSQL | Keep — excellent RLS, realtime, migrations |
| External data | USGS Instantaneous Values API | Free, authoritative, already integrated |
| Deployment | Vercel | Already connected to master |

### Mobile (to build)
| Layer | Technology | Decision |
|-------|-----------|----------|
| Framework | **React Native + Expo** | Shares TypeScript/React with web; shares `@riverrats/shared` |
| Navigation | Expo Router | File-based routing, mirrors Next.js mental model |
| Styling | NativeWind (Tailwind for RN) | Same utility classes as web |
| Auth | Clerk Expo SDK | Same auth provider as web |
| Push notifications | Expo Notifications + APNs/FCM | Native push for flow alerts and trip activity |
| State | Zustand | Lightweight, no boilerplate |
| Data fetching | TanStack Query | Caching, background refresh, optimistic updates |

### Backend / API
| Layer | Technology |
|-------|-----------|
| API server | Hono (TypeScript, `packages/api/`) |
| Database client | `@supabase/supabase-js` with service role key |
| Cron / alerts | Vercel Cron + `web/src/app/api/cron/` |

### Domain / Data Structures

**Principle: object-oriented domain models in TypeScript first; Python for data processing / ML; C++ via WASM only if performance requires it.**

All domain objects live in `shared/src/` so both web and mobile import from `@riverrats/shared`.

Core classes to build out:

```typescript
// Core domain objects — all in shared/src/domain/

class River { ... }           // Static definition + live flow state
class Trip { ... }            // Day trip or multi-day expedition
class TripMember { ... }      // Participant with role and join state
class User / Profile { ... }  // Paddler identity, skill level, resume
class Conversation { ... }    // Trip group chat or 1:1 DM
class Message { ... }         // Individual message within a conversation
class FlowAlert { ... }       // User-configured CFS notification
class Friendship { ... }      // Bidirectional friend relationship
```

Enums / value objects:
```typescript
enum DifficultyClass { 'I-II', 'III', 'III-IV', 'IV', 'IV-V', 'V', 'V+' }
enum TripStatus { open, full, cancelled, completed }
enum JoinRequestStatus { pending, approved, declined }
enum FriendshipStatus { pending, accepted, declined, blocked }
enum FlowTrend { rising, falling, stable }
enum TripType { day, overnight, expedition }  // new — add multi-day
```

---

## Authentication

### Decision: Clerk (email first, phone OTP later)

**Why Clerk over Supabase Auth:**
- Modern, polished auth UI components that work in React Native out of the box
- Email magic link + password autofill natively supported
- Phone/SMS OTP ready to flip on without a code change
- No "confirm email" link issues on localhost that broke Supabase Auth
- Clerk JWT → Supabase RLS via `SUPABASE_JWT_SECRET` (Clerk issues JWTs Supabase understands)

**Auth architecture:**
```
User → Clerk (identity, sessions, MFA)
         ↓ Clerk JWT
Supabase (data only, no auth — service role for writes, anon+RLS for reads)
```

**Supabase RLS with Clerk JWTs:**
Update all `auth.uid()` references to use Clerk's `sub` claim. In Supabase Dashboard → Auth → JWT Settings, paste the Clerk JWT secret so Supabase validates Clerk-issued tokens.

**What to configure in Clerk Dashboard:**
1. Enable Email address (required) — password or magic link
2. Enable Phone number (optional for now, required later)
3. Set redirect URLs: `https://riverratsapp.com`, `exp://` (for Expo)
4. Collect: display name on sign-up

**Password security:** Clerk handles bcrypt hashing and salting. Never store passwords in Supabase.

**Required env vars (Clerk):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## Database Schema

All schema lives in `supabase/migrations/`. Never edit production schema via Supabase Studio — always write a migration file.

### Tables (current)

| Table | Purpose |
|-------|---------|
| `profiles` | One row per user; links to Clerk user ID (not `auth.users`) after migration |
| `trips` | Trip postings — day or overnight (add `trip_type` column) |
| `trip_members` | Confirmed participants; creator auto-added on insert |
| `join_requests` | pending / approved / declined |
| `flow_alerts` | User CFS notifications per river |
| `conversations` | Trip group chats (`type='trip'`) and 1:1 DMs (`type='direct'`) |
| `conversation_members` | Who is in each conversation + `last_read_at` |
| `messages` | Individual messages; Supabase Realtime enabled |
| `friends` | Bidirectional friend relationships with status |

### Next migrations needed

1. **Clerk migration** — change `profiles.id` from `auth.users` FK to a plain UUID; store `clerk_user_id text UNIQUE` for lookups. Update all RLS policies to use `current_setting('request.jwt.claims', true)::json->>'sub'` instead of `auth.uid()`.
2. **Trip types** — add `trip_type text CHECK (trip_type IN ('day', 'overnight', 'expedition'))` and `end_date date` to `trips`.
3. **Paddle resume** — add `trip_completions` table or a `completed_at` timestamp to `trip_members`.
4. **River conditions** — user-reported conditions (`conditions_reports` table).

---

## Environments

| Environment | Branch | URL | Supabase project |
|-------------|--------|-----|-----------------|
| Production | `master` | riverratsapp.com | prod project |
| Staging | `staging` | staging.riverratsapp.com (Vercel preview) | staging project |
| Development | local | localhost:3000 | local Supabase stack |

**Rules:**
- `master` is protected — never push directly, always PR
- All feature work branches off `develop` (create this) or a feature branch
- PRs from feature branches → `develop` → `staging` → `master`
- Vercel auto-deploys `master` to production; preview deployments for all other branches

### Local dev setup

```bash
# 1. Install dependencies
yarn install

# 2. Start local Supabase
supabase start          # requires Docker

# 3. Configure env
cp web/.env.local.example web/.env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (from supabase start output)
# fill in NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY

# 4. Run web dev server
cd web && yarn dev      # http://localhost:3000

# 5. Run mobile (once mobile/ exists)
cd mobile && yarn expo start
```

### Environment variables reference

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only, never expose to client

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# (future)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=   # mobile
```

---

## Key Product Features

### Trip Types

**Day Session ("boating sesh")**
- River, date, meet time, meeting point, skill level, spots
- Auto-creates group chat on post
- Join request → organizer approve/decline
- "Imm-in" quick-join for friends (skip request flow)

**Overnight Trip**
- Same as above + `end_date`, itinerary notes, gear list, permit info
- Multi-day conversation thread
- Checklist feature (food, safety gear, permits)

**Quick Sesh Coordination (future)**
- "Who's on the water today?" — broadcast to friends with 24h expiry
- Inspired by Snapchat Stories / Zelle "request money" simplicity

### Flow Alerts
- User sets CFS min/max window per river
- Cron job (Vercel Cron, every 15 min) checks USGS gauges
- Push notification to mobile + email fallback when window is entered/exited
- "River came into shape" → one tap to post a trip

### Social Graph
- Friends (bidirectional, accepted)
- Trip crew visibility — see which friends are on upcoming trips
- Activity feed — friends' recent trips and rivers run (future)

### Paddle Resume
- Every completed trip auto-logged
- Rivers run count, hardest class run, total days on water
- Shareable profile card (future)

---

## Code Conventions

### TypeScript
- All domain objects as classes in `shared/src/domain/`
- Interfaces for API response shapes; classes for stateful objects
- Strict mode enabled; no `any`
- Prefer `type` for unions/aliases, `interface` for objects that may be extended

### File structure (web)
```
web/src/
├── app/           Next.js App Router pages and API routes
├── components/    Shared UI components
└── lib/
    ├── supabase/  client.ts (browser) + server.ts (RSC)
    ├── *-types.ts Domain type definitions (migrate to shared/ over time)
    └── utils.ts   Helpers
```

### File structure (shared)
```
shared/src/
├── domain/        OOP domain classes — River, Trip, User, etc.
├── rivers-data.ts Static river definitions with USGS gauge IDs
├── usgs.ts        USGS API client with in-memory cache
└── index.ts       Barrel export
```

### API routes (web/src/app/api/)
- Use Supabase **service role** client for writes
- Validate Clerk session with `auth()` from `@clerk/nextjs/server` before any mutation
- Return JSON; use 401 for unauthenticated, 403 for unauthorized, 422 for validation errors

### Git
- Branch naming: `feature/<thing>`, `fix/<thing>`, `chore/<thing>`
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- No force-push to `master` ever

### Security
- Never put `SUPABASE_SERVICE_ROLE_KEY` or `CLERK_SECRET_KEY` in client-side code
- All `NEXT_PUBLIC_` vars are safe to expose
- Supabase RLS is the last line of defense — keep policies tight
- Sanitize all user-generated content before rendering (Next.js does this for JSX; be careful with `dangerouslySetInnerHTML`)
- Rate-limit API routes that send notifications or messages

---

## Existing River Data

31 rivers with real USGS gauge IDs across: Colorado, West Virginia, Tennessee, California, Washington, Idaho, Oregon. Defined in `shared/src/rivers-data.ts` as `RiverStatic[]`.

Adding a new river requires:
1. Find the USGS gauge ID at waterdata.usgs.gov
2. Add a `RiverStatic` entry to `riversData` in `shared/src/rivers-data.ts`
3. Verify the gauge returns discharge (parameter `00060`) data

---

## What To Build Next (Priority Order)

1. **Clerk auth migration** — finish PR #4 but adapt for email-first (not phone-first); update Supabase RLS for Clerk JWTs; test sign-up / sign-in flow end-to-end
2. **Mobile app scaffold** — `mobile/` directory, Expo + Expo Router, NativeWind, Clerk Expo SDK, Supabase client; basic tabs: Feed, Rivers, Trips, Messages, Profile
3. **Domain model classes** — River, Trip, User classes in `shared/src/domain/` with proper OOP; replace raw Supabase row types throughout
4. **Overnight trips** — add `trip_type` and `end_date` to schema; update trip posting form and trip detail page
5. **Push notifications** — Expo Notifications for flow alerts and trip activity
6. **Paddle resume** — `trip_completions`, profile stats, shareable card
7. **Activity feed** — friends' recent trips and rivers run
8. **`develop` and `staging` branches** — proper multi-environment git workflow

---

## Useful Commands

```bash
# Web
yarn workspace web dev          # start Next.js dev server
yarn workspace web build        # production build
yarn workspace web lint         # ESLint

# Shared
yarn workspace @riverrats/shared build   # compile TypeScript

# Supabase
supabase start                  # start local stack (needs Docker)
supabase stop                   # stop local stack
supabase db reset               # wipe and re-run all migrations
supabase migration new <name>   # create a new migration file
supabase status                 # print local URLs and keys

# Git
git checkout -b feature/<name>  # new feature branch
git push -u origin feature/<name>
```

---

## Links

- **Production**: https://riverratsapp.com
- **Supabase Dashboard**: https://supabase.com/dashboard (stevezg's project)
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **USGS Water Data**: https://waterdata.usgs.gov/nwis/rt
- **American Whitewater**: https://www.americanwhitewater.org

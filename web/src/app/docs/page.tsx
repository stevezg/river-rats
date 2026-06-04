import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Database,
  MessageCircle,
  Route,
  ShieldCheck,
  Smartphone,
  TerminalSquare,
  Users,
  Waves,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Docs | RiverRat Colorado Beta",
  description: "Product, architecture, data model, and development notes for RiverRat Colorado Beta.",
};

const productPillars = [
  {
    title: "Runs",
    icon: Waves,
    body: "Colorado river runs with gauge-backed CFS, runnable ranges, difficulty, hazards, and run detail pages.",
  },
  {
    title: "Trips",
    icon: Route,
    body: "A paddler can create a trip against a run, set time and meeting details, and expose open spots to the community.",
  },
  {
    title: "Crew",
    icon: Users,
    body: "Trip detail answers the core social question: who is paddling, what skill level they are, and whether spots are open.",
  },
  {
    title: "Messages",
    icon: MessageCircle,
    body: "Trip crew chat and direct messages support shuttle timing, gear checks, and last-minute flow changes.",
  },
];

const stack = [
  ["Frontend", "Next.js web beta now; React Native + Expo remains the iOS-first mobile path."],
  ["Backend", "Supabase for custom auth, profiles, trips, members, join requests, notifications, and messages."],
  ["Realtime", "Supabase Realtime and conversation tables support the current chat model."],
  ["River data", "Shared USGS integration fetches CFS, water temperature when available, trend, and graceful fallbacks."],
  ["Testing", "Node's built-in test runner with tsx covers shared logic, web utilities, and API route behavior."],
];

const dataObjects = [
  "users",
  "profiles",
  "rivers",
  "runs",
  "gauges",
  "trips",
  "trip_members",
  "join_requests",
  "conversations",
  "conversation_members",
  "messages",
  "flow_alerts",
  "notifications",
  "friendships",
];

const buildPlan = [
  {
    phase: "Weeks 1-2",
    title: "Prototype",
    body: "Clickable app flow for home feed, run detail, create trip, trip page, profile, and chat. Test with 10 paddlers.",
  },
  {
    phase: "Weeks 3-6",
    title: "MVP build",
    body: "Auth, profiles, trip creation, join requests, crew membership, chat, and manually seeded Colorado run data.",
  },
  {
    phase: "Weeks 7-9",
    title: "Flow integration",
    body: "CFS display, runnable ranges, favorite runs, and basic flow notifications.",
  },
  {
    phase: "Weeks 10-12",
    title: "Private beta",
    body: "Launch in Colorado around Clear Creek, Arkansas, Gore, Poudre, Colorado River, Roaring Fork, and Fryingpan-area runs.",
  },
];

const commands = [
  ["Install", "npm install"],
  ["Run web", "npm run dev -w web"],
  ["Run tests", "npm test"],
  ["Build web", "npm run build -w web"],
  ["Lint web", "npm run lint -w web"],
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0F1117]">
      <section className="border-b border-white/[0.06] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4ECDC4]">
              RiverRat Colorado Beta docs
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Product and engineering notes for the beta.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#8B8FA8]">
              RiverRat is a social river-running app. The product promise is simple: the river is in, and paddlers can see who is going.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/runs"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#4ECDC4] px-5 text-sm font-semibold text-[#0F1117]"
              >
                View runs
              </Link>
              <Link
                href="/trips/new"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-5 text-sm font-semibold text-white transition-colors hover:border-[#4ECDC4]/40"
              >
                Create trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section id="product" className="py-4">
          <div className="mb-5 flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-[#4ECDC4]" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-white">Product Surface</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productPillars.map(({ title, icon: Icon, body }) => (
              <article key={title} className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-5">
                <Icon className="h-5 w-5 text-[#4ECDC4]" aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8B8FA8]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="architecture" className="py-10">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#4ECDC4]" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-white">Architecture</h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            {stack.map(([label, body]) => (
              <div key={label} className="grid gap-2 border-b border-white/[0.06] bg-[#1C1F26] p-4 last:border-b-0 sm:grid-cols-[180px_1fr]">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-sm leading-6 text-[#8B8FA8]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="data-model" className="py-10">
          <div className="mb-5 flex items-center gap-3">
            <Database className="h-5 w-5 text-[#4ECDC4]" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-white">Data Model</h2>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-[#8B8FA8]">
            The beta already has the social primitives needed for trips: profiles, trip membership, join requests, conversation membership, messages, notifications, and friendships.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {dataObjects.map((object) => (
              <span
                key={object}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white"
              >
                {object}
              </span>
            ))}
          </div>
        </section>

        <section id="plan" className="py-10">
          <div className="mb-5 flex items-center gap-3">
            <Bell className="h-5 w-5 text-[#4ECDC4]" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-white">90-Day Plan</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {buildPlan.map(({ phase, title, body }) => (
              <article key={phase} className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4ECDC4]">{phase}</p>
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8B8FA8]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="development" className="py-10">
          <div className="mb-5 flex items-center gap-3">
            <TerminalSquare className="h-5 w-5 text-[#4ECDC4]" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-white">Development</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {commands.map(([label, command]) => (
              <div key={label} className="rounded-lg border border-white/[0.06] bg-[#1C1F26] p-4">
                <p className="text-sm font-semibold text-white">{label}</p>
                <code className="mt-2 block rounded-md bg-[#0F1117] px-3 py-2 text-sm text-[#4ECDC4]">
                  {command}
                </code>
              </div>
            ))}
          </div>
        </section>

        <section id="quality" className="py-10">
          <div className="rounded-lg border border-[#4ECDC4]/20 bg-[#17232A] p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4ECDC4]" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold text-white">Current Quality Bar</h2>
                <p className="mt-2 text-sm leading-6 text-[#8B8FA8]">
                  Unit tests cover shared river data, USGS parsing and graceful failure, web formatting helpers, flow status logic, and API 404 behavior. The web production build passes with USGS network failures handled as missing gauge data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

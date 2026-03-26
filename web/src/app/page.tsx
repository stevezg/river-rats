import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "River Rats — Never Run a River Alone",
  description:
    "Find paddling partners at your skill level, check live river flows, and build your whitewater resume. The social platform for kayakers.",
};

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Find Your Crew",
    description:
      "Match with paddlers at your skill level in your region. Filter by class rating, river, and schedule. No more solo runs because you couldn't find anyone to go with.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 9c3-3 6 0 9-3s6 3 9 0" />
        <path d="M3 15c3-3 6 0 9-3s6 3 9 0" />
        <path d="M3 3v18" strokeOpacity="0" />
      </svg>
    ),
    title: "Live Flow Data",
    description:
      "Real-time CFS data from USGS gauges on every river. Know before you go whether it's too low, perfect, or blown out. Set alerts for your favorite runs.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Trip Logging",
    description:
      "Log every run with CFS, conditions, and notes. Build your paddling resume to show future partners what you've run. Track your progression from Class II to Class V.",
  },
];

const steps = [
  {
    step: "01",
    title: "Post a Trip",
    description:
      "Pick a river, set your date, specify the skill level you need, and post. Takes 60 seconds.",
  },
  {
    step: "02",
    title: "Get Matched",
    description:
      "Paddlers at your level request to join. Review their run history and approve your crew.",
  },
  {
    step: "03",
    title: "Paddle Safely",
    description:
      "Hit the river with a vetted crew at your skill level. Log the run, build your resume.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(78, 205, 196, 0.15) 0%, transparent 60%)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{
              borderColor: "rgba(78, 205, 196, 0.30)",
              backgroundColor: "rgba(78, 205, 196, 0.08)",
              color: "#4ECDC4",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
            Now accepting early access — 500+ paddlers on waitlist
          </div>

          <h1
            className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Never run a river{" "}
            <span
              className="relative"
              style={{
                background: "linear-gradient(135deg, #4ECDC4, #52B788)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              alone.
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
            style={{ color: "#8B8FA8" }}
          >
            Find paddling partners at your exact skill level, check live river
            flows before you launch, and build the whitewater resume that unlocks
            harder runs. Built by kayakers, for kayakers.
          </p>

          {/* Waitlist form */}
          <div
            id="waitlist"
            className="mx-auto mt-10 max-w-lg rounded-2xl border p-6"
            style={{
              backgroundColor: "#1C1F26",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <h2
              className="mb-4 text-lg font-semibold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Get early access
            </h2>
            <WaitlistForm />
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center gap-6">
            {["500+ paddlers", "8 rivers live", "Launch this season"].map(
              (item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ECDC4]" />
                  <span style={{ color: "#8B8FA8" }}>{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-4 py-24 sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(180deg, #0F1117 0%, rgba(28,31,38,0.5) 50%, #0F1117 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Everything a paddler needs
            </h2>
            <p className="mt-3 text-lg" style={{ color: "#8B8FA8" }}>
              Built around the reality of whitewater — flows change, partners
              matter, and your skill history is your reputation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border p-7 transition-all duration-200 hover:border-[rgba(78,205,196,0.20)]"
                style={{
                  backgroundColor: "#1C1F26",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "rgba(78, 205, 196, 0.12)",
                    color: "#4ECDC4",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  className="mb-2 text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8B8FA8" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rivers preview */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Rivers live now
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#8B8FA8" }}>
                Real-time flow data from USGS gauges
              </p>
            </div>
            <Link
              href="/rivers"
              className="flex items-center gap-1 text-sm font-medium text-[#4ECDC4] transition-colors hover:text-[#3db8b0]"
            >
              View all rivers
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Mini river stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Arkansas Royal Gorge", cfs: "850", class: "IV-V", state: "CO", color: "#FF8C42", status: "Prime" },
              { name: "Gauley River", cfs: "2,600", class: "V", state: "WV", color: "#FF6B6B", status: "Running" },
              { name: "Cache la Poudre", cfs: "480", class: "III", state: "CO", color: "#FFA94D", status: "Falling" },
              { name: "Ocoee River", cfs: "1,200", class: "III-IV", state: "TN", color: "#FFA94D", status: "Optimal" },
            ].map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between rounded-xl border p-4"
                style={{
                  backgroundColor: "#1C1F26",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <p className="text-sm font-medium text-white leading-snug">{r.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#8B8FA8" }}>
                    {r.state} · Class {r.class}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#4ECDC4]">{r.cfs}</p>
                  <p className="text-xs" style={{ color: r.color }}>{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="about"
        className="px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              How it works
            </h2>
            <p className="mt-3" style={{ color: "#8B8FA8" }}>
              From couch to kayak in three steps.
            </p>
          </div>

          <div className="relative grid gap-8 sm:grid-cols-3">
            {/* Connector line */}
            <div
              className="absolute left-0 right-0 top-6 hidden h-px sm:block"
              style={{ backgroundColor: "rgba(78, 205, 196, 0.15)" }}
              aria-hidden="true"
            />

            {steps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div
                  className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold"
                  style={{
                    backgroundColor: "#0F1117",
                    borderColor: "#4ECDC4",
                    color: "#4ECDC4",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {s.step}
                </div>
                <h3
                  className="mb-3 text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8B8FA8" }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / CTA band */}
      <section
        className="mx-4 mb-24 rounded-2xl px-8 py-16 text-center sm:mx-6 lg:mx-8"
        style={{
          background: "linear-gradient(135deg, rgba(78, 205, 196, 0.12) 0%, rgba(82, 183, 136, 0.08) 100%)",
          border: "1px solid rgba(78, 205, 196, 0.20)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <h2
            className="text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Join 500+ paddlers already on the waitlist
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#8B8FA8" }}>
            Colorado, West Virginia, Tennessee, California — the community is
            forming. Get early access before we open to the public.
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm" style={{ color: "#8B8FA8" }}>
            {["Class II beginners to Class V experts", "Free during beta", "No credit card required"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/#waitlist"
              className="rounded-full px-8 py-3.5 text-base font-semibold text-[#0F1117] transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ backgroundColor: "#4ECDC4" }}
            >
              Get Early Access
            </Link>
            <Link
              href="/rivers"
              className="rounded-full border px-8 py-3.5 text-base font-medium transition-all hover:border-white/20"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "#8B8FA8" }}
            >
              Browse Rivers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

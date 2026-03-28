import type { Metadata } from "next";
import { getRivers } from "@/lib/rivers";
import RiversFilter from "@/components/RiversFilter";

export const metadata: Metadata = {
  title: "Rivers | River Rats",
  description:
    "Live flow data, difficulty ratings, and conditions for the best whitewater runs in the country.",
};

export default async function RiversPage() {
  const rivers = await getRivers();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1117" }}>
      {/* Page header */}
      <div
        className="border-b px-4 py-12 sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(78, 205, 196, 0.10) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Rivers
          </h1>
          <p className="mt-3 text-lg" style={{ color: "#8B8FA8" }}>
            Live flow data, difficulty ratings, and conditions for the best
            whitewater runs in the country.
          </p>
        </div>
      </div>

      <RiversFilter rivers={rivers} />
    </div>
  );
}

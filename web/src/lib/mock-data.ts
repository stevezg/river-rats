// Re-export shared types so existing imports keep working
export type { DifficultyClass, FlowTrend } from "@riverrats/shared";

export interface Trip {
  id: string;
  riverId: string;
  riverSlug: string;
  riverName: string;
  difficulty: import("@riverrats/shared").DifficultyClass;
  date: string;
  time: string;
  meetingPoint: string;
  notes: string;
  minSkill: import("@riverrats/shared").DifficultyClass;
  creatorName: string;
  creatorLevel: import("@riverrats/shared").DifficultyClass;
  totalSpots: number;
  spotsRemaining: number;
  currentCfs: number;
  region: string;
  state: string;
}

export const trips: Trip[] = [
  {
    id: "trip-1",
    riverId: "6",
    riverSlug: "gauley-river",
    riverName: "Gauley River",
    difficulty: "V",
    date: "2026-04-12",
    time: "7:30 AM",
    meetingPoint: "Summersville Dam Tailwater Parking Lot, WV-129",
    notes: "Upper Gauley scheduled release day — 2,800 CFS. Full Upper run from Summersville Dam to Peters Creek takeout. Expecting big water conditions. Must have reliable combat roll and prior Class V experience. I've run this 8 times and will lead the group. Bring lunch, dry suit mandatory, and be ready for 6+ hours on the water.",
    minSkill: "IV-V",
    creatorName: "Marcus Webb",
    creatorLevel: "V",
    totalSpots: 6,
    spotsRemaining: 2,
    currentCfs: 2600,
    region: "New River Gorge",
    state: "WV",
  },
  {
    id: "trip-2",
    riverId: "1",
    riverSlug: "arkansas-royal-gorge",
    riverName: "Arkansas River — Royal Gorge",
    difficulty: "IV-V",
    date: "2026-04-18",
    time: "8:00 AM",
    meetingPoint: "Centennial Park, Cañon City, CO",
    notes: "Running the full Royal Gorge section while flows are prime. Put in at Centennial Park, takeout at Parkdale. Shuttle sorted. Looking for 3-4 paddlers with solid IV-V experience. Flows been rising all week — should hit 900+ by Saturday. Bring creek boat or stout river runner. No pure playboats.",
    minSkill: "IV",
    creatorName: "Tanya Kowalski",
    creatorLevel: "V",
    totalSpots: 5,
    spotsRemaining: 3,
    currentCfs: 850,
    region: "Royal Gorge",
    state: "CO",
  },
  {
    id: "trip-3",
    riverId: "3",
    riverSlug: "cache-la-poudre",
    riverName: "Cache la Poudre",
    difficulty: "III",
    date: "2026-04-20",
    time: "9:00 AM",
    meetingPoint: "Poudre Park Picnic Area, Poudre Canyon Rd",
    notes: "Mellow Poudre day — running the Bridges section from Poudre Park to Hewlett Gulch. Great flow for intermediate paddlers to work on ferrying and eddy catching. All experience levels welcome as long as you're comfortable Class II. I'll be in my playboat but creek boats and river runners totally fine. Usually done by 1 PM, hit Vern's for burritos after.",
    minSkill: "III",
    creatorName: "Dani Reyes",
    creatorLevel: "III-IV",
    totalSpots: 8,
    spotsRemaining: 5,
    currentCfs: 480,
    region: "Northern Front Range",
    state: "CO",
  },
  {
    id: "trip-4",
    riverId: "5",
    riverSlug: "colorado-glenwood",
    riverName: "Colorado River — Glenwood Canyon",
    difficulty: "III-IV",
    date: "2026-04-25",
    time: "8:30 AM",
    meetingPoint: "Grizzly Creek Rest Area, I-70 Exit 121",
    notes: "Shoshone to No Name run. High water season is HERE and Shoshone is firing. This is pushy, committing Class IV at these flows — not a beginner trip. Meet at Grizzly Creek Rest Area for shuttle. Helmets and PFDs non-negotiable. Rescue throw bag on every boat. Cold water — drysuits or at minimum farmer john + splash top.",
    minSkill: "III-IV",
    creatorName: "Jake Thurston",
    creatorLevel: "IV-V",
    totalSpots: 6,
    spotsRemaining: 1,
    currentCfs: 2400,
    region: "Glenwood Canyon",
    state: "CO",
  },
  {
    id: "trip-5",
    riverId: "2",
    riverSlug: "clear-creek",
    riverName: "Clear Creek",
    difficulty: "III-IV",
    date: "2026-05-03",
    time: "10:00 AM",
    meetingPoint: "Tucker Gulch Trailhead, Golden, CO",
    notes: "Front Range classic — Clear Creek Canyon from Tucker Gulch to Tunnel 1 takeout. Flows are perfect right now. This is a great progression run for paddlers with solid Class III experience ready to step up. I run this section every week during runoff and will be happy to coach lines. Eddy hopping down is the move. Expect 3-4 hours on water.",
    minSkill: "III",
    creatorName: "Priya Nair",
    creatorLevel: "IV",
    totalSpots: 4,
    spotsRemaining: 2,
    currentCfs: 320,
    region: "Front Range",
    state: "CO",
  },
  {
    id: "trip-6",
    riverId: "4",
    riverSlug: "animas-river",
    riverName: "Animas River",
    difficulty: "III-IV",
    date: "2026-05-10",
    time: "9:30 AM",
    meetingPoint: "Animas River Park, 28th St, Durango, CO",
    notes: "Durango town run — Animas River Park to Oxbow Park. Multiple laps on Smelter if the group is feeling it. Flows coming up as snowmelt season kicks in — expect technical eddy work and some pushy water through the gorge. Great trip for Durango locals or anyone in town for the weekend. After session: Ska Brewing is non-negotiable.",
    minSkill: "III",
    creatorName: "Cole Frazier",
    creatorLevel: "IV",
    totalSpots: 7,
    spotsRemaining: 4,
    currentCfs: 650,
    region: "San Juan Mountains",
    state: "CO",
  },
];

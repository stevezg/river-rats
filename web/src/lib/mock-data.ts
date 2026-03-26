export type DifficultyClass =
  | "I-II"
  | "III"
  | "III-IV"
  | "IV"
  | "IV-V"
  | "V"
  | "V+";

export type FlowTrend = "rising" | "falling" | "stable";

export interface River {
  id: string;
  slug: string;
  name: string;
  region: string;
  state: string;
  difficulty: DifficultyClass;
  currentCfs: number;
  optimalMin: number;
  optimalMax: number;
  runnable: boolean;
  trend: FlowTrend;
  description: string;
  hazards: string[];
  gaugeId: string;
}

export interface Trip {
  id: string;
  riverId: string;
  riverSlug: string;
  riverName: string;
  difficulty: DifficultyClass;
  date: string;
  time: string;
  meetingPoint: string;
  notes: string;
  minSkill: DifficultyClass;
  creatorName: string;
  creatorLevel: DifficultyClass;
  totalSpots: number;
  spotsRemaining: number;
  currentCfs: number;
  region: string;
  state: string;
}

export const rivers: River[] = [
  {
    id: "1",
    slug: "arkansas-royal-gorge",
    name: "Arkansas River — Royal Gorge",
    region: "Royal Gorge",
    state: "CO",
    difficulty: "IV-V",
    currentCfs: 850,
    optimalMin: 600,
    optimalMax: 1200,
    runnable: true,
    trend: "rising",
    description:
      "The Royal Gorge section of the Arkansas River is Colorado's most iconic big-water run. Towering granite walls rise 1,000 feet on either side as you punch through continuous Class IV and V rapids. The gorge delivers relentless whitewater with little chance for recovery — this is committing water that demands experienced paddlers with solid roll mechanics and experience reading fast, technical lines.",
    hazards: [
      "Continuous Class IV-V rapids with limited eddies",
      "Undercut rocks at Sunshine Falls (Class V)",
      "Keeper hydraulic at Wall Slammer in high water",
      "Remote canyon — no road access for rescue",
    ],
    gaugeId: "07091200",
  },
  {
    id: "2",
    slug: "clear-creek",
    name: "Clear Creek",
    region: "Front Range",
    state: "CO",
    difficulty: "III-IV",
    currentCfs: 320,
    optimalMin: 200,
    optimalMax: 600,
    runnable: true,
    trend: "stable",
    description:
      "Clear Creek Canyon is the Front Range's go-to training ground for intermediate paddlers. Running just 45 minutes from Denver, it delivers punchy Class III-IV rapids in a tight canyon. The Upper section above Golden pushes harder, while the lower canyon offers more technical boulder gardens. Flows change fast after afternoon storms — always check before you go.",
    hazards: [
      "Several low-head dams on approach — mandatory portages",
      "Strainer risk in high water above 500 CFS",
      "Road noise and public access means busy weekends",
    ],
    gaugeId: "06719505",
  },
  {
    id: "3",
    slug: "cache-la-poudre",
    name: "Cache la Poudre",
    region: "Northern Front Range",
    state: "CO",
    difficulty: "III",
    currentCfs: 480,
    optimalMin: 300,
    optimalMax: 800,
    runnable: true,
    trend: "falling",
    description:
      "Colorado's only federally designated Wild & Scenic River, the Poudre delivers miles of sustained Class III whitewater through a stunning canyon north of Fort Collins. Multiple access points allow everything from quick day runs to full-canyon descents. Summer snowmelt from the Mummy Range keeps it running through July. A perfect river for paddlers stepping up from Class II or sharpening skills before bigger objectives.",
    hazards: [
      "Poudre Falls (Class VI) — mandatory portage at high water mark",
      "Several washed-out bridge abutments create sieves",
      "Flows drop quickly after peak runoff in late June",
    ],
    gaugeId: "06752000",
  },
  {
    id: "4",
    slug: "animas-river",
    name: "Animas River",
    region: "San Juan Mountains",
    state: "CO",
    difficulty: "III-IV",
    currentCfs: 650,
    optimalMin: 400,
    optimalMax: 900,
    runnable: true,
    trend: "rising",
    description:
      "The Animas runs through the heart of Durango with one of the most accessible whitewater sections in the state. The Smelter Rapid section in town draws local kayakers daily, while the Animas Canyon above Durango delivers remote Class IV in a wilderness setting accessible only by the Durango & Silverton Narrow Gauge Railroad. Current flows are pushing the upper end of optimal — expect flushing water and less technical eddying.",
    hazards: [
      "Smelter Rapid washes out above 1,200 CFS and becomes dangerous keeper",
      "Animas Canyon — remote, multi-day commitment",
      "Water quality concerns post-Gold King Mine spill (test before swimming)",
    ],
    gaugeId: "09361500",
  },
  {
    id: "5",
    slug: "colorado-glenwood",
    name: "Colorado River — Glenwood Canyon",
    region: "Glenwood Canyon",
    state: "CO",
    difficulty: "III-IV",
    currentCfs: 2400,
    optimalMin: 1500,
    optimalMax: 3500,
    runnable: true,
    trend: "stable",
    description:
      "Glenwood Canyon is one of America's great natural wonders — and it has the whitewater to match. At current flows, Shoshone Rapid is firing at full Class IV, with a powerful hydraulic that flips unprepared boaters regularly. The canyon walls rise 1,200 feet of Precambrian granite, and I-70 runs the full length above — easy shuttle but no escaping the grandeur. Current high water creates pushy, technical lines throughout.",
    hazards: [
      "Shoshone Rapid — powerful hydraulic, avoid far river left",
      "High water creates strainers on river-left at numerous bends",
      "I-70 debris and runoff after heavy rain",
      "Cold water year-round from deep canyon shade",
    ],
    gaugeId: "09085000",
  },
  {
    id: "6",
    slug: "gauley-river",
    name: "Gauley River",
    region: "New River Gorge",
    state: "WV",
    difficulty: "V",
    currentCfs: 2600,
    optimalMin: 2500,
    optimalMax: 4000,
    runnable: true,
    trend: "rising",
    description:
      "Summersville Dam releases transform the Gauley into the most storied big-water run in the eastern United States. Five-plus miles of continuous Class V rapids — Insignificant, Pillow Rock, Lost Paddle, Iron Ring, Sweet's Falls — arrive with barely enough time to catch your breath. The Upper Gauley during scheduled dam releases is bucket-list whitewater. Period. You need a combat roll, a trusted crew, and the humility to know when to portage.",
    hazards: [
      "Pillow Rock Rapid — vertical 14-foot drop, Left Side only",
      "Lost Paddle — 3/4-mile continuous Class V, swimmers at risk",
      "Cold water even in September — dry suit recommended",
      "High consequence swims — rescue is slow in this canyon",
    ],
    gaugeId: "03155000",
  },
  {
    id: "7",
    slug: "ocoee-river",
    name: "Ocoee River",
    region: "Blue Ridge",
    state: "TN",
    difficulty: "III-IV",
    currentCfs: 1200,
    optimalMin: 1000,
    optimalMax: 2000,
    runnable: true,
    trend: "stable",
    description:
      "The Ocoee is America's most-rafted river and the venue for the 1996 Olympics — but that doesn't diminish its credentials. The Middle Ocoee delivers five miles of nearly continuous Class III-IV rapids, each one earned with precision paddling and quick decision-making. TVA controls releases, so check the schedule before you drive. Flows are at the sweet spot right now with classic intermediate lines running clean.",
    hazards: [
      "Flowmaster Rapid — dangerous hole at levels above 1,600 CFS",
      "TVA controls water — releases can change abruptly",
      "Commercial raft traffic on weekends — give way to guides",
    ],
    gaugeId: "03554000",
  },
  {
    id: "8",
    slug: "kern-river",
    name: "Kern River",
    region: "Sierra Nevada",
    state: "CA",
    difficulty: "IV",
    currentCfs: 780,
    optimalMin: 500,
    optimalMax: 1200,
    runnable: true,
    trend: "falling",
    description:
      "The Kern drains the southern Sierra Nevada and punches through granite gorges that rival anything in North America. The Limestone Run and Forks of the Kern deliver Class IV-V in backcountry settings, while the Upper Kern above Kernville keeps the whitewater close to the road. Snowmelt season peaks in late May and June, and current flows sit at the upper end of Class IV technical. The Kern demands commitment — it's remote, powerful, and serious.",
    hazards: [
      "Forks of the Kern — Class V+ at high water, multi-day commitment",
      "Limestone Run has multiple Class V portages when above 900 CFS",
      "Water temperature below 45°F in spring — immersion gear mandatory",
      "Flash flood risk after Sierra thunderstorms",
    ],
    gaugeId: "11186000",
  },
];

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
    notes:
      "Upper Gauley scheduled release day — 2,800 CFS. Full Upper run from Summersville Dam to Peters Creek takeout. Expecting big water conditions. Must have reliable combat roll and prior Class V experience. I've run this 8 times and will lead the group. Bring lunch, dry suit mandatory, and be ready for 6+ hours on the water.",
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
    notes:
      "Running the full Royal Gorge section while flows are prime. Put in at Centennial Park, takeout at Parkdale. Shuttle sorted. Looking for 3-4 paddlers with solid IV-V experience. Flows been rising all week — should hit 900+ by Saturday. Bring creek boat or stout river runner. No pure playboats.",
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
    notes:
      "Mellow Poudre day — running the Bridges section from Poudre Park to Hewlett Gulch. Great flow for intermediate paddlers to work on ferrying and eddy catching. All experience levels welcome as long as you're comfortable Class II. I'll be in my playboat but creek boats and river runners totally fine. Usually done by 1 PM, hit Vern's for burritos after.",
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
    notes:
      "Shoshone to No Name run. High water season is HERE and Shoshone is firing. This is pushy, committing Class IV at these flows — not a beginner trip. Meet at Grizzly Creek Rest Area for shuttle. Helmets and PFDs non-negotiable. Rescue throw bag on every boat. Cold water — drysuits or at minimum farmer john + splash top.",
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
    notes:
      "Front Range classic — Clear Creek Canyon from Tucker Gulch to Tunnel 1 takeout. Flows are perfect right now. This is a great progression run for paddlers with solid Class III experience ready to step up. I run this section every week during runoff and will be happy to coach lines. Eddy hopping down is the move. Expect 3-4 hours on water.",
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
    notes:
      "Durango town run — Animas River Park to Oxbow Park. Multiple laps on Smelter if the group is feeling it. Flows coming up as snowmelt season kicks in — expect technical eddy work and some pushy water through the gorge. Great trip for Durango locals or anyone in town for the weekend. After session: Ska Brewing is non-negotiable.",
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

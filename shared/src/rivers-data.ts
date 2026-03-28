// Static river definitions — properties that don't change regardless of flow conditions.
// Live CFS, trend, and runnable status are fetched separately from USGS.

export type DifficultyClass =
  | "I-II"
  | "III"
  | "III-IV"
  | "IV"
  | "IV-V"
  | "V"
  | "V+";

export interface RiverStatic {
  id: string;
  slug: string;
  name: string;
  region: string;
  state: string;
  difficulty: DifficultyClass;
  optimalMin: number;
  optimalMax: number;
  description: string;
  hazards: string[];
  gaugeId: string;
}

export const riversData: RiverStatic[] = [
  {
    id: "1",
    slug: "arkansas-royal-gorge",
    name: "Arkansas River — Royal Gorge",
    region: "Royal Gorge",
    state: "CO",
    difficulty: "IV-V",
    optimalMin: 600,
    optimalMax: 1200,
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
    optimalMin: 200,
    optimalMax: 600,
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
    optimalMin: 300,
    optimalMax: 800,
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
    optimalMin: 400,
    optimalMax: 900,
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
    optimalMin: 1500,
    optimalMax: 3500,
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
    optimalMin: 2500,
    optimalMax: 4000,
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
    optimalMin: 1000,
    optimalMax: 2000,
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
    optimalMin: 500,
    optimalMax: 1200,
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

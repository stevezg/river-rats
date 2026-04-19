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
  awReachId?: string;
}

export const riversData: RiverStatic[] = [
  {
    id: "1",
    slug: "arkansas-royal-gorge",
    name: "Arkansas River — Royal Gorge",
    region: "Royal Gorge",
    state: "CO",
    difficulty: "III-IV",
    optimalMin: 600,
    optimalMax: 1200,
    description:
      "The Royal Gorge section of the Arkansas River is Colorado's most iconic big-water run. Towering granite walls rise 1,000 feet on either side as you punch through continuous Class III and IV rapids with occasional Class V features. The gorge delivers sustained whitewater that demands experienced paddlers with solid roll mechanics and experience reading fast, technical lines.",
    hazards: [
      "Continuous Class III-IV rapids with limited eddies",
      "Undercut rocks at Sunshine Falls (Class V)",
      "Keeper hydraulic at Wall Slammer in high water",
      "Remote canyon — no road access for rescue",
    ],
    gaugeId: "07094500",
  },
  {
    id: "2",
    slug: "clear-creek",
    name: "Clear Creek",
    region: "Front Range",
    state: "CO",
    difficulty: "III-IV",
    optimalMin: 400,
    optimalMax: 1000,
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
    difficulty: "II-III",
    optimalMin: 400,
    optimalMax: 900,
    description:
      "The Lower Animas runs through the heart of Durango and offers one of the most accessible whitewater sections in the state. The Smelter Rapid section in town draws local kayakers daily with fun Class II-III wave trains and play features. This is the town run — for the expert Upper Animas Canyon (Class IV-V), a different gauge and put-in are required. Current flows are pushing the upper end of optimal — expect flushing water and less technical eddying.",
    hazards: [
      "Smelter Rapid washes out above 1,200 CFS and becomes dangerous keeper",
      "Town run — busy with commercial traffic on summer weekends",
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
      "Glenwood Canyon is one of America's great natural wonders — and it has the whitewater to match. At current flows, the canyon delivers sustained Class III-IV wave trains and powerful hydraulics that flip unprepared boaters regularly. The canyon walls rise 1,200 feet of Precambrian granite, and I-70 runs the full length above — easy shuttle but no escaping the grandeur. Current high water creates pushy, technical lines throughout.",
    hazards: [
      "Powerful hydraulics at multiple rapids — avoid far river left",
      "High water creates strainers on river-left at numerous bends",
      "I-70 debris and runoff after heavy rain",
      "Cold water year-round from deep canyon shade",
    ],
    gaugeId: "09071750",
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

  // — Colorado — Aspen / Roaring Fork Valley —
  {
    id: "9",
    slug: "roaring-fork-river",
    name: "Roaring Fork River",
    region: "Roaring Fork Valley",
    state: "CO",
    difficulty: "III-IV",
    optimalMin: 400,
    optimalMax: 1200,
    description:
      "The Roaring Fork drains the high country above Aspen and drops through the Roaring Fork Valley before joining the Colorado at Glenwood Springs. The most popular whitewater sections run from Carbondale down through the lower canyon — wave trains, punchy holes, and scenic Colorado River plateau country. In peak snowmelt, the Fork runs fast and pushy, flushing paddlers through long Class III wave trains with a few Class IV moves mixed in. The proximity to Aspen makes this the local training river for the valley's strong paddling community.",
    hazards: [
      "Woody debris and sweepers in the braided upper sections above Basalt",
      "Several irrigation diversion dams — mandatory portages, marked on river left",
      "Flows spike rapidly after afternoon thunderstorms in the Elk Mountains",
      "Lower canyon narrows above the Colorado confluence — powerful at high water",
    ],
    gaugeId: "09073400",
  },
  {
    id: "10",
    slug: "crystal-river",
    name: "Crystal River",
    region: "Elk Mountains",
    state: "CO",
    difficulty: "IV",
    optimalMin: 500,
    optimalMax: 3000,
    description:
      "The Crystal River descends from the Elk Mountains through Marble — the same town that quarried the stone for the Lincoln Memorial — and carves a stunning canyon past the ghost town of Crystal and its famous mill. The river is tight, technical, and beautiful. Class IV drops arrive in quick succession through a narrow canyon of white marble bedrock and dark metamorphic rock. Snowmelt from the Raggeds keeps it running through late June, and the brief window when flows are optimal is some of the finest creek-boating in the state.",
    hazards: [
      "Crystal Mill section — very technical Class IV, tight moves between marble boulders",
      "Short season — flows typically peak in late May and drop to unrunnable by mid-July",
      "Remote upper canyon — no road access for several miles above Marble",
      "Marble bedrock is extremely slippery for portages and scouting",
    ],
    gaugeId: "09081600",
  },
  {
    id: "11",
    slug: "castle-creek",
    name: "Castle Creek",
    region: "Elk Mountains",
    state: "CO",
    difficulty: "IV-V",
    optimalMin: 150,
    optimalMax: 450,
    description:
      "Castle Creek is Aspen's backyard creeking run — a steep, technical descent from the ghost town of Ashcroft down to the Roaring Fork confluence near Aspen. At optimal flows it's a demanding Class IV-V creek with continuous gradient, tight moves between boulders, and the spectacular backdrop of the Elk Mountains' fourteeners looming overhead. It's a short run but it packs serious technical challenge into every drop. Local kayakers hit it on spring mornings before work when the snowmelt peaks.",
    hazards: [
      "Very short season — runnable window is typically 2-4 weeks in late May",
      "Multiple Class V drops in the upper canyon require confident creek skills",
      "Wood debris is common — downed trees can block the entire channel",
      "Remote upper sections — difficult self-rescue, limited road access from Ashcroft",
    ],
    gaugeId: "09073300",
  },
  {
    id: "12",
    slug: "colorado-shoshone",
    name: "Colorado River — Shoshone",
    region: "Glenwood Canyon",
    state: "CO",
    difficulty: "III-IV",
    optimalMin: 1200,
    optimalMax: 4000,
    description:
      "Shoshone Rapid is the most famous single drop on the Colorado River — a powerful Class III hydraulic created by a natural constriction just upstream of the Shoshone Hydroelectric Plant in Glenwood Canyon. The Shoshone power plant holds the oldest water rights on the Colorado, which means that whenever the plant is running, the river must maintain minimum flows through the canyon regardless of upstream diversions. That makes Shoshone a uniquely reliable gauge: if the plant is on, the river is running. The short run through the rapid and the canyon downstream is spectacular, with I-70 above and 1,200-foot walls on both sides.",
    hazards: [
      "Shoshone Rapid — powerful hydraulic on river left, run center to right",
      "High water above 3,500 CFS creates a more aggressive hydraulic — scout if unfamiliar",
      "I-70 traffic noise in the canyon, but no road access to the riverbank mid-canyon",
      "Cold water year-round from deep canyon shade and upstream snowmelt",
    ],
    gaugeId: "09084000",
  },

  // — Colorado — Additional —
  {
    id: "13",
    slug: "arkansas-numbers",
    name: "Arkansas River — The Numbers",
    region: "Upper Arkansas",
    state: "CO",
    difficulty: "V",
    optimalMin: 200,
    optimalMax: 700,
    description:
      "The Numbers is Colorado's premier technical Class V run — a tight, boulder-choked gauntlet that earns its name from the sequential rapids labeled 1 through 6 (and beyond). Put in above Granite and brace for non-stop technical moves in a narrow channel with little margin for error. Lines are precise, eddies are small, and the consequence of a missed brace is immediate. This is the proving ground for Front Range paddlers chasing Class V credentials. Low water reveals more rock; high water turns it into a pushy, chaotic flush — both extremes demand respect.",
    hazards: [
      "Continuous Class V boulder gardens — no rest between rapids",
      "Pinning hazard in low water at multiple constrictions",
      "High water above 700 CFS creates powerful hydraulics throughout",
      "Cold runoff from the Collegiate Peaks — immersion gear mandatory",
    ],
    gaugeId: "07086000",
  },
  {
    id: "14",
    slug: "gunnison-gorge",
    name: "Gunnison Gorge",
    region: "Black Canyon",
    state: "CO",
    difficulty: "III-IV",
    optimalMin: 1000,
    optimalMax: 3500,
    description:
      "The Gunnison Gorge is Colorado's best-kept secret — a remote, roadless canyon accessible only by foot trail or river. Once inside, sheer volcanic walls tower above continuous Class III-IV rapids, and the outside world completely disappears. The gorge is a National Conservation Area, and it shows — the river corridor is pristine, the fishing is world-class, and the solitude is extraordinary for a front-country run. This is not a beginner river but it rewards experienced paddlers with one of the most stunning canyons in the West.",
    hazards: [
      "Access requires a 1.5-mile trail hike — no road egress mid-canyon",
      "Chukar Trail Rapid — Class IV+ technical move at the canyon entrance",
      "Several horizon lines require scouting — can't always read from the boat",
      "Cold water year-round from upstream Black Canyon snowmelt",
    ],
    gaugeId: "09149500",
  },
  {
    id: "15",
    slug: "taylor-river",
    name: "Taylor River",
    region: "Gunnison Basin",
    state: "CO",
    difficulty: "III-IV",
    optimalMin: 250,
    optimalMax: 700,
    description:
      "The Taylor punches out of Taylor Park Reservoir and drops through a series of tight, technical Class IV rapids before mellowing near Almont. This is a dam-controlled run, which means consistent flows when much of Colorado is too high or too low — a rare luxury on a Front Range trip. The canyon is intimate and beautiful, with spruce forests and granite boulders framing each rapid. It's a short run but it packs technical difficulty into every mile.",
    hazards: [
      "Dam releases can spike flow rapidly — check Taylor Park Reservoir releases",
      "Several undercut boulders in the upper canyon",
      "Rock gardens below 200 CFS become scratchy and technical",
      "Almont confluence area — watch for boat traffic on busy weekends",
    ],
    gaugeId: "09111250",
  },

  // — Washington —
  {
    id: "16",
    slug: "skykomish-river",
    name: "Skykomish River — Boulder Drop",
    region: "Cascade Foothills",
    state: "WA",
    difficulty: "IV",
    optimalMin: 2000,
    optimalMax: 7000,
    description:
      "The Sky is the heartbeat of Washington paddling. The Index to Goldbar stretch — known as Boulder Drop — is the state's most iconic Class IV run, a relentless series of powerful hydraulics, boulder sieves, and swift Class III connectors set against the backdrop of the Cascades. It's big Pacific Northwest water: high volume, fast moving, and unforgiving when flows are up. The Sunset Falls section adds Class V for those looking to push it, while Boulder Drop itself is a rite of passage for serious Northwest paddlers.",
    hazards: [
      "Boulder Drop Rapid — Class IV+ at higher flows, multiple lines",
      "Sunset Falls — Class V mandatory portage for most paddlers",
      "High volume means fast swims with few eddies to self-rescue",
      "Rainfall spikes flows rapidly — always check gauge before driving out",
    ],
    gaugeId: "12134500",
  },
  {
    id: "17",
    slug: "white-salmon-river",
    name: "White Salmon River",
    region: "Columbia Gorge",
    state: "WA",
    difficulty: "IV-V",
    optimalMin: 200,
    optimalMax: 600,
    description:
      "The White Salmon is one of the Pacific Northwest's crown jewels — a volcanic spring-fed river that runs cold and clear year-round through a basalt canyon carved by ancient lava flows. The upper section above Husum Falls is accessible Class III-IV, but the real prize is the lower gorge below BZ Corner: continuous Class IV-V in a spectacular canyon, capped by the iconic 12-foot Spirit Falls. Since the removal of Condit Dam, the lower White Salmon has been returned to a free-flowing river and is better than ever.",
    hazards: [
      "Spirit Falls (Class V+) — 12-foot drop, must scout and portage if not ready",
      "Husum Falls — 10-foot vertical drop, portage on river right",
      "Cold water year-round (50°F) from volcanic springs — hypothermia risk",
      "Tight basalt canyon with limited egress below BZ Corner",
    ],
    gaugeId: "14123500",
  },
  {
    id: "18",
    slug: "wenatchee-river",
    name: "Wenatchee River",
    region: "Cascade Mountains",
    state: "WA",
    difficulty: "III",
    optimalMin: 2500,
    optimalMax: 7000,
    description:
      "The Wenatchee is eastern Washington's premier intermediate run — a wide, braided river that drops through apple orchards and ponderosa pine forests on the dry side of the Cascades. Snowmelt from the Cascades keeps it running strong from April through July, and US-2 parallels the river the entire way making shuttle logistics simple. Cashmere to Peshastin is the classic stretch, with wave trains, playful holes, and gorgeous Eastern Cascades scenery. This is the perfect river to sharpen skills, work on catching eddies, and log miles before stepping up to harder water.",
    hazards: [
      "Several strainer-prone braids in the lower section — stay in the main channel",
      "Flows above 6,000 CFS wash out technical features into continuous swift water",
      "Cold snowmelt water through June — wetsuit required",
      "Irrigation diversion structures in the lower valley — verify portages",
    ],
    gaugeId: "12462500",
  },
  {
    id: "19",
    slug: "tieton-river",
    name: "Tieton River",
    region: "Yakima Basin",
    state: "WA",
    difficulty: "III-IV",
    optimalMin: 1200,
    optimalMax: 2500,
    description:
      "The Tieton is Washington's great dam-release festival run. Rimrock Lake releases every September for several weeks, transforming a trickle of a river into a consistent Class III-IV playground that draws paddlers from across the Pacific Northwest. The canyon is stunning — high basalt walls, golden tamarack in the fall, and clean whitewater with a perfect gradient. Because flows are dam-controlled, you know exactly what you're getting on any given day. This is one of the best-organized release schedules in the country.",
    hazards: [
      "Waffle Wall Rapid — Class IV, sticky hydraulic on river left",
      "Tieton Narrows — technical III-IV, scout on first descent",
      "Dam releases are scheduled — no releases outside the September window",
      "Flows can surge quickly after release schedule changes — watch BOR announcements",
    ],
    gaugeId: "12486500",
  },

  // — Idaho —
  {
    id: "20",
    slug: "lochsa-river",
    name: "Lochsa River",
    region: "Bitterroot Mountains",
    state: "ID",
    difficulty: "IV",
    optimalMin: 3000,
    optimalMax: 10000,
    description:
      "The Lochsa is Idaho's great spring flood — a 50-mile corridor of continuous Class III-IV rapids tucked along US-12 in the Bitterroot Mountains. Snowmelt from the Clearwater Range turns this wilderness river into one of the country's best sustained high-volume runs from April through June. The gradient is relentless, the scenery is roadless wilderness, and nearly every bend brings another wave train or technical rapid. The Lochsa demands high-water skills and solid bracing — but rewards paddlers with mile after mile of world-class whitewater.",
    hazards: [
      "Lochsa Falls — Class V, mandatory portage, scout carefully before approach",
      "High volume above 10,000 CFS creates keeper hydraulics throughout",
      "50-mile corridor means committing to the run — no easy bailout points",
      "Cold late-spring water (45-50°F) — dry suit mandatory",
    ],
    gaugeId: "13337000",
  },
  {
    id: "21",
    slug: "middle-fork-salmon",
    name: "Middle Fork of the Salmon",
    region: "Frank Church Wilderness",
    state: "ID",
    difficulty: "IV",
    optimalMin: 2000,
    optimalMax: 8000,
    description:
      "The Middle Fork of the Salmon is America's greatest wilderness river trip — 100 miles of Class IV whitewater through the largest contiguous wilderness in the lower 48 states, the Frank Church River of No Return. No roads. No towns. Just granite gorges, hot springs, ancient pictographs, and over 300 rapids. Permits are required and lottery-competitive for a reason: this river is irreplaceable. Put in at Boundary Creek and spend 5-7 days earning every mile. The Middle Fork is not just a river — it's a pilgrimage.",
    hazards: [
      "Permit required — highly competitive lottery, apply in January",
      "Dagger Falls — Class V mandatory portage at the put-in at higher flows",
      "100% self-sufficient — no rescue services in the Frank Church Wilderness",
      "Flash flooding possible from afternoon thunderstorms in July-August",
    ],
    gaugeId: "13295000",
  },
  {
    id: "22",
    slug: "north-fork-payette",
    name: "North Fork Payette River",
    region: "Payette River Corridor",
    state: "ID",
    difficulty: "V",
    optimalMin: 800,
    optimalMax: 3000,
    description:
      "The North Fork Payette is among the top Class V runs in North America — a 15-mile, all-day sufferfest of continuous, powerful whitewater that starts at Smiths Ferry and ends in the town of Banks. Juicer, Golf Course, Jaws, and a dozen more named Class V rapids arrive without pause. This is big western water at its most unrelenting. The NFP is not a river you run to relax — it's a river you run to prove something, and it demands your best game every single mile.",
    hazards: [
      "Jaws Rapid — Class V+, multiple lines, powerful hydraulic on the left wall",
      "Golf Course — long Class V rapid with multiple consequential holes",
      "Continuous gradient means no recovery after a swim — roll or portage",
      "High water above 3,000 CFS transitions to Class V+ throughout — serious upgrade in consequence",
    ],
    gaugeId: "13235000",
  },
  {
    id: "23",
    slug: "selway-river",
    name: "Selway River",
    region: "Selway-Bitterroot Wilderness",
    state: "ID",
    difficulty: "IV-V",
    optimalMin: 2000,
    optimalMax: 7000,
    description:
      "The Selway may be the most coveted river permit in the country. With only one launch per day allowed at Selway Falls, this 47-mile wilderness float through the Selway-Bitterroot Wilderness is profoundly rare. The river combines serious Class IV-V whitewater with scenery and solitude that is simply unavailable anywhere else at this scale. Moose wade in the shallows. Eagles nest on the canyon walls. And the river, unconstrained by roads or dams, runs exactly as it has for millennia.",
    hazards: [
      "Selway Falls — Class VI mandatory portage, long and technical carry",
      "One launch per day permit — apply through lottery, extremely competitive",
      "Wilderness setting means multi-day self-sufficiency is required",
      "Water levels can change dramatically day to day in early season",
    ],
    gaugeId: "13336500",
  },

  // — Oregon —
  {
    id: "24",
    slug: "rogue-river",
    name: "Rogue River — Wild Section",
    region: "Siskiyou Mountains",
    state: "OR",
    difficulty: "III-IV",
    optimalMin: 1500,
    optimalMax: 6000,
    description:
      "The Rogue's Wild Section is Oregon's definitive multi-day river adventure — a 35-mile float through a federally designated Wild & Scenic corridor that has captivated paddlers since Zane Grey first wet a line here in the 1920s. Lodges dot the banks (a unique Oregon tradition), the fishing is legendary, and the whitewater is a sustained Class III-IV mix that builds to the powerful drops at Mule Creek Canyon and Blossom Bar. At current flows, Blossom Bar is firing at full Class IV — technical and boulder-choked, it separates the serious from the casual.",
    hazards: [
      "Blossom Bar — Class IV boulder garden, multiple mandatory moves, scout first time",
      "Mule Creek Canyon — narrow canyon, powerful hydraulics, no portage option",
      "Rainie Falls — Class V mandatory portage on river right",
      "Permit required for the Wild Section during the summer season",
    ],
    gaugeId: "14361500",
  },
  {
    id: "25",
    slug: "deschutes-river",
    name: "Deschutes River — Maupin Section",
    region: "High Desert",
    state: "OR",
    difficulty: "III",
    optimalMin: 3000,
    optimalMax: 8000,
    description:
      "The Deschutes is Oregon's great high-desert river — a dam-controlled gem that flows consistently through canyon country of basalt columns, sagebrush, and golden hills. The Maupin section, from Harpham Flat to Maupin, is the most popular stretch: classic Class III wave trains, playful holes, and the iconic Wapinitia Rapid make this an ideal step-up run or a confidence-building trip for intermediate paddlers. The Deschutes runs strong year-round thanks to upstream regulation, making it a reliable destination when other Oregon rivers are running too high or too low.",
    hazards: [
      "Wapinitia Rapid (Class III+) — biggest drop, can flip open boats at high water",
      "Oak Springs Rapid — Class III, technical line at lower flows",
      "Fishing pressure — yield to anglers in designated fishing zones",
      "Afternoon wind in the canyon can make flatwater sections slow and uncomfortable",
    ],
    gaugeId: "14092750",
  },
  {
    id: "26",
    slug: "north-umpqua-river",
    name: "North Umpqua River",
    region: "Umpqua National Forest",
    state: "OR",
    difficulty: "IV-V",
    optimalMin: 500,
    optimalMax: 2000,
    description:
      "The North Umpqua is Oregon's most demanding accessible whitewater run — a relentlessly technical series of Class IV-V drops carved through ancient basalt lava flows near Toketee Falls. The river is crystalline green, cold, and fast, with drops that require precise line selection and a reliable roll. Wright Creek, Deadline Falls, and the boulder-congested upper canyon deliver continuous technical challenge in one of the most beautiful river corridors in the state. The North Umpqua is underrated nationally and over-delivers every time.",
    hazards: [
      "Deadline Falls — Class V, mandatory portage, steep lava rock portage on river right",
      "Multiple undercut basalt walls on the right bank — never eddy river-right in the upper canyon",
      "Low water exposes technical rock gardens requiring advanced maneuvering",
      "Limited cell service — no assistance available in the canyon",
    ],
    gaugeId: "14321000",
  },
  {
    id: "27",
    slug: "illinois-river",
    name: "Illinois River",
    region: "Klamath Mountains",
    state: "OR",
    difficulty: "IV-V",
    optimalMin: 500,
    optimalMax: 2500,
    description:
      "The Illinois is Oregon's wildest whitewater river — a 3-day, permit-required descent through the Kalmiopsis Wilderness into the Klamath Mountains. This is technical, remote, and serious: the Illinois demands expert paddle craft in a setting where there is no road access for the entire middle section of the run. The water is an otherworldly jade green, the geology is stunning (peridotite and serpentinite outcroppings), and the rapids are as challenging as anything in Oregon. Green Wall Rapid alone justifies the permit application.",
    hazards: [
      "Green Wall Rapid — Class V, powerful drop with undercut wall on right, portage available on left",
      "3-day commitment — no egress in the Kalmiopsis Wilderness middle section",
      "Spring flooding can make the Illinois extremely dangerous above 2,500 CFS",
      "Permit required — apply through the Siskiyou National Forest permit system",
    ],
    gaugeId: "14377100",
  },

  // — California —
  {
    id: "28",
    slug: "south-fork-american",
    name: "American River — South Fork",
    region: "Gold Country",
    state: "CA",
    difficulty: "III-IV",
    optimalMin: 800,
    optimalMax: 4000,
    description:
      "The South Fork of the American is California's most beloved paddling river — a Gold Rush-era canyon that delivers classic Class III-IV whitewater just an hour east of Sacramento. The Chili Bar to Coloma run is the most popular stretch: Meatgrinder, Troublemaker, and a dozen more named rapids flow through a stunning river canyon lined with ponderosa pine and gray oak. The South Fork is the gateway drug for California paddling — it's where most Sierra Nevada kayakers run their first Class IV and where veterans still return for long summer days in the canyon.",
    hazards: [
      "Troublemaker Rapid — Class IV, powerful hydraulic on the right wall at medium flows",
      "Meatgrinder — Class III+, rocky line at lower water",
      "High commercial raft traffic on weekends — be aware and communicate with guides",
      "Flows above 4,000 CFS upgrade Troublemaker to serious Class IV+ — reassess at high water",
    ],
    gaugeId: "11444500",
  },
  {
    id: "29",
    slug: "tuolumne-river",
    name: "Tuolumne River",
    region: "Sierra Nevada Foothills",
    state: "CA",
    difficulty: "IV-V",
    optimalMin: 600,
    optimalMax: 2500,
    description:
      "The Tuolumne is the jewel of California whitewater — a 18-mile Class IV-V canyon run that has defined Sierra kayaking since the first descents of the 1970s. The T deserves every superlative: the canyon is deep, the rapids are relentless, the scenery is extraordinary. Clavey Falls alone (Class V) is worth the drive — a powerful 15-foot drop that demands your best line selection. Camp 9 to Wards Ferry is the classic run, and it remains one of the finest single-day (or overnight) whitewater experiences in North America.",
    hazards: [
      "Clavey Falls — Class V, 15-foot drop, scouts required, portage on river left",
      "Jawbone Rapid — Class IV, technical move through boulder garden",
      "Limited flows — Hetch Hetchy reservoir controls release, check TID schedule",
      "Remote canyon — TID does not provide rescue; self-sufficiency required",
    ],
    gaugeId: "11289000",
  },
  {
    id: "30",
    slug: "cal-salmon-river",
    name: "Cal Salmon River",
    region: "Klamath Mountains",
    state: "CA",
    difficulty: "IV-V",
    optimalMin: 600,
    optimalMax: 3000,
    description:
      "The Cal Salmon (California's Salmon River, not to be confused with Idaho's) is a gem of the Klamath Mountains — a steep, technical Class IV-V run through pristine wilderness on the northern edge of the Marble Mountain Wilderness. The river drops through continuous boulder gardens, narrow chutes, and several significant falls, all framed by Douglas fir forest and serpentine rock outcroppings. The Salmon is spring-dependent, running its best in April and May, and the window can close quickly. Those who time it right get one of the finest technical runs in the state.",
    hazards: [
      "Bloomer Falls — Class V waterfall, mandatory portage on river right",
      "Last Chance Rapid — Class V, serious hydraulic, careful scout required",
      "Spring season only — flows drop dramatically after June snowmelt ends",
      "Remote location — cell service is nonexistent in the canyon",
    ],
    gaugeId: "11522500",
  },
  {
    id: "31",
    slug: "kings-river",
    name: "Kings River — Garlic Falls Section",
    region: "Sierra Nevada",
    state: "CA",
    difficulty: "IV",
    optimalMin: 1000,
    optimalMax: 4000,
    description:
      "The Kings River drains the highest terrain in the Sierra Nevada and runs through one of California's most underappreciated river canyons. The Garlic Falls section — put in at Kirch Flat — delivers a sustained Class IV experience through a spectacular gorge with clear green water, massive granite slabs, and excellent camping. Garlic Falls itself is a Class V that most paddlers portage, and the canyon above and below delivers continuous Class IV in a setting that feels far more remote than it is. The Kings is a spring river — come in May or early June.",
    hazards: [
      "Garlic Falls — Class V, steep and powerful, portage on river left recommended",
      "High granite walls create long portages — scout before committing to lines",
      "Flows above 4,000 CFS turn Class IV rapids into serious Class V",
      "Cold snowmelt water well into June — immersion gear required",
    ],
    gaugeId: "11218500",
  },
];

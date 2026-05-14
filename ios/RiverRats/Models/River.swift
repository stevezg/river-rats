import Foundation

struct River: Identifiable {
    let id: String
    let slug: String
    let name: String
    let region: String
    let state: String
    let difficulty: String
    let optimalMin: Int
    let optimalMax: Int
    let description: String
    let hazards: [String]
    let gaugeId: String
    let awReachId: String?

    // Runnable status based on live CFS
    func runnableStatus(cfs: Double?) -> RunnableStatus {
        guard let cfs else { return .unknown }
        if cfs < Double(optimalMin) { return .tooLow }
        if cfs > Double(optimalMax) { return .tooHigh }
        return .optimal
    }
}

enum RunnableStatus {
    case optimal, tooLow, tooHigh, unknown

    var label: String {
        switch self {
        case .optimal: "Runnable"
        case .tooLow: "Too Low"
        case .tooHigh: "Too High"
        case .unknown: "—"
        }
    }

    var color: String {
        switch self {
        case .optimal: "green"
        case .tooLow: "blue"
        case .tooHigh: "red"
        case .unknown: "gray"
        }
    }
}

// MARK: - Static Data (mirrors shared/src/rivers-data.ts)

let riversData: [River] = [
    River(id: "1", slug: "arkansas-royal-gorge", name: "Arkansas River — Royal Gorge",
          region: "Royal Gorge", state: "CO", difficulty: "III-IV",
          optimalMin: 600, optimalMax: 1200,
          description: "The Royal Gorge section of the Arkansas River is Colorado's most iconic big-water run. Towering granite walls rise 1,000 feet on either side as you punch through continuous Class III and IV rapids.",
          hazards: ["Continuous Class III-IV rapids with limited eddies", "Undercut rocks at Sunshine Falls (Class V)", "Keeper hydraulic at Wall Slammer in high water", "Remote canyon — no road access for rescue"],
          gaugeId: "07094500", awReachId: nil),
    River(id: "2", slug: "clear-creek", name: "Clear Creek",
          region: "Front Range", state: "CO", difficulty: "III-IV",
          optimalMin: 400, optimalMax: 1000,
          description: "Clear Creek Canyon is the Front Range's go-to training ground for intermediate paddlers. Running just 45 minutes from Denver, it delivers punchy Class III-IV rapids in a tight canyon.",
          hazards: ["Several low-head dams on approach — mandatory portages", "Strainer risk in high water above 500 CFS", "Road noise and public access means busy weekends"],
          gaugeId: "06719505", awReachId: nil),
    River(id: "3", slug: "cache-la-poudre", name: "Cache la Poudre",
          region: "Northern Front Range", state: "CO", difficulty: "III",
          optimalMin: 300, optimalMax: 800,
          description: "Colorado's only federally designated Wild & Scenic River, the Poudre delivers miles of sustained Class III whitewater through a stunning canyon north of Fort Collins.",
          hazards: ["Poudre Falls (Class VI) — mandatory portage at high water mark", "Several washed-out bridge abutments create sieves", "Flows drop quickly after peak runoff in late June"],
          gaugeId: "06752000", awReachId: nil),
    River(id: "4", slug: "animas-river", name: "Animas River",
          region: "San Juan Mountains", state: "CO", difficulty: "II-III",
          optimalMin: 400, optimalMax: 900,
          description: "The Lower Animas runs through the heart of Durango and offers one of the most accessible whitewater sections in the state.",
          hazards: ["Smelter Rapid washes out above 1,200 CFS and becomes dangerous keeper", "Town run — busy with commercial traffic on summer weekends", "Water quality concerns post-Gold King Mine spill"],
          gaugeId: "09361500", awReachId: nil),
    River(id: "5", slug: "colorado-glenwood", name: "Colorado River — Glenwood Canyon",
          region: "Glenwood Canyon", state: "CO", difficulty: "III-IV",
          optimalMin: 1500, optimalMax: 3500,
          description: "Glenwood Canyon is one of America's great natural wonders — and it has the whitewater to match. At current flows, the canyon delivers sustained Class III-IV wave trains and powerful hydraulics.",
          hazards: ["Powerful hydraulics at multiple rapids", "High water creates strainers on river-left", "I-70 debris and runoff after heavy rain", "Cold water year-round from deep canyon shade"],
          gaugeId: "09071750", awReachId: nil),
    River(id: "6", slug: "gauley-river", name: "Gauley River",
          region: "New River Gorge", state: "WV", difficulty: "V",
          optimalMin: 2500, optimalMax: 4000,
          description: "Summersville Dam releases transform the Gauley into the most storied big-water run in the eastern United States. Five-plus miles of continuous Class V rapids.",
          hazards: ["Pillow Rock Rapid — vertical 14-foot drop, Left Side only", "Lost Paddle — 3/4-mile continuous Class V", "Cold water even in September", "High consequence swims"],
          gaugeId: "03155000", awReachId: nil),
    River(id: "7", slug: "ocoee-river", name: "Ocoee River",
          region: "Blue Ridge", state: "TN", difficulty: "III-IV",
          optimalMin: 1000, optimalMax: 2000,
          description: "The Ocoee is America's most-rafted river and the venue for the 1996 Olympics. The Middle Ocoee delivers five miles of nearly continuous Class III-IV rapids.",
          hazards: ["Flowmaster Rapid — dangerous hole at levels above 1,600 CFS", "TVA controls water — releases can change abruptly", "Commercial raft traffic on weekends"],
          gaugeId: "03554000", awReachId: nil),
    River(id: "8", slug: "kern-river", name: "Kern River",
          region: "Sierra Nevada", state: "CA", difficulty: "IV",
          optimalMin: 500, optimalMax: 1200,
          description: "The Kern drains the southern Sierra Nevada and punches through granite gorges that rival anything in North America.",
          hazards: ["Forks of the Kern — Class V+ at high water", "Limestone Run has multiple Class V portages", "Water temperature below 45°F in spring", "Flash flood risk after Sierra thunderstorms"],
          gaugeId: "11186000", awReachId: nil),
    River(id: "9", slug: "roaring-fork-river", name: "Roaring Fork River",
          region: "Roaring Fork Valley", state: "CO", difficulty: "III-IV",
          optimalMin: 400, optimalMax: 1200,
          description: "The Roaring Fork drains the high country above Aspen and drops through the Roaring Fork Valley before joining the Colorado at Glenwood Springs.",
          hazards: ["Woody debris and sweepers in the braided upper sections", "Several irrigation diversion dams — mandatory portages", "Flows spike rapidly after afternoon thunderstorms"],
          gaugeId: "09073400", awReachId: nil),
    River(id: "10", slug: "crystal-river", name: "Crystal River",
          region: "Elk Mountains", state: "CO", difficulty: "IV",
          optimalMin: 500, optimalMax: 3000,
          description: "The Crystal River descends from the Elk Mountains through Marble and carves a stunning canyon past the ghost town of Crystal.",
          hazards: ["Crystal Mill section — very technical Class IV", "Short season — flows peak in late May", "Remote upper canyon", "Marble bedrock is extremely slippery"],
          gaugeId: "09081600", awReachId: nil),
    River(id: "11", slug: "castle-creek", name: "Castle Creek",
          region: "Elk Mountains", state: "CO", difficulty: "IV-V",
          optimalMin: 150, optimalMax: 450,
          description: "Castle Creek is Aspen's backyard creeking run — a steep, technical descent from Ashcroft down to the Roaring Fork confluence.",
          hazards: ["Very short season — 2-4 weeks in late May", "Multiple Class V drops in the upper canyon", "Wood debris common", "Remote upper sections"],
          gaugeId: "09073300", awReachId: nil),
    River(id: "12", slug: "colorado-shoshone", name: "Colorado River — Shoshone",
          region: "Glenwood Canyon", state: "CO", difficulty: "III-IV",
          optimalMin: 1200, optimalMax: 4000,
          description: "Shoshone Rapid is the most famous single drop on the Colorado River — a powerful Class III hydraulic created by a natural constriction.",
          hazards: ["Shoshone Rapid — powerful hydraulic on river left", "High water above 3,500 CFS more aggressive", "Cold water year-round"],
          gaugeId: "09084000", awReachId: nil),
    River(id: "13", slug: "arkansas-numbers", name: "Arkansas River — The Numbers",
          region: "Upper Arkansas", state: "CO", difficulty: "V",
          optimalMin: 200, optimalMax: 700,
          description: "The Numbers is Colorado's premier technical Class V run — a tight, boulder-choked gauntlet that earns its name from the sequential rapids labeled 1 through 6.",
          hazards: ["Continuous Class V boulder gardens", "Pinning hazard in low water", "High water above 700 CFS creates powerful hydraulics", "Cold runoff from the Collegiate Peaks"],
          gaugeId: "07086000", awReachId: nil),
    River(id: "14", slug: "gunnison-gorge", name: "Gunnison Gorge",
          region: "Black Canyon", state: "CO", difficulty: "III-IV",
          optimalMin: 1000, optimalMax: 3500,
          description: "The Gunnison Gorge is Colorado's best-kept secret — a remote, roadless canyon accessible only by foot trail or river.",
          hazards: ["Access requires a 1.5-mile trail hike", "Chukar Trail Rapid — Class IV+", "Several horizon lines require scouting", "Cold water year-round"],
          gaugeId: "09149500", awReachId: nil),
    River(id: "15", slug: "taylor-river", name: "Taylor River",
          region: "Gunnison Basin", state: "CO", difficulty: "III-IV",
          optimalMin: 250, optimalMax: 700,
          description: "The Taylor punches out of Taylor Park Reservoir and drops through a series of tight, technical Class IV rapids before mellowing near Almont.",
          hazards: ["Dam releases can spike flow rapidly", "Several undercut boulders in the upper canyon", "Rock gardens below 200 CFS become scratchy"],
          gaugeId: "09111250", awReachId: nil),
    River(id: "16", slug: "skykomish-river", name: "Skykomish River — Boulder Drop",
          region: "Cascade Foothills", state: "WA", difficulty: "IV",
          optimalMin: 2000, optimalMax: 7000,
          description: "The Sky is the heartbeat of Washington paddling. The Index to Goldbar stretch is the state's most iconic Class IV run.",
          hazards: ["Boulder Drop Rapid — Class IV+ at higher flows", "Sunset Falls — Class V mandatory portage", "High volume means fast swims", "Rainfall spikes flows rapidly"],
          gaugeId: "12134500", awReachId: nil),
    River(id: "17", slug: "white-salmon-river", name: "White Salmon River",
          region: "Columbia Gorge", state: "WA", difficulty: "IV-V",
          optimalMin: 200, optimalMax: 600,
          description: "The White Salmon is one of the Pacific Northwest's crown jewels — a volcanic spring-fed river that runs cold and clear year-round.",
          hazards: ["Spirit Falls (Class V+) — 12-foot drop", "Husum Falls — 10-foot vertical drop", "Cold water year-round (50°F)", "Tight basalt canyon with limited egress"],
          gaugeId: "14123500", awReachId: nil),
    River(id: "18", slug: "wenatchee-river", name: "Wenatchee River",
          region: "Cascade Mountains", state: "WA", difficulty: "III",
          optimalMin: 2500, optimalMax: 7000,
          description: "The Wenatchee is eastern Washington's premier intermediate run — a wide, braided river that drops through apple orchards and ponderosa pine forests.",
          hazards: ["Several strainer-prone braids in the lower section", "Flows above 6,000 CFS wash out technical features", "Cold snowmelt water through June", "Irrigation diversion structures"],
          gaugeId: "12462500", awReachId: nil),
    River(id: "19", slug: "tieton-river", name: "Tieton River",
          region: "Yakima Basin", state: "WA", difficulty: "III-IV",
          optimalMin: 1200, optimalMax: 2500,
          description: "The Tieton is Washington's great dam-release festival run. Rimrock Lake releases every September for several weeks.",
          hazards: ["Waffle Wall Rapid — Class IV, sticky hydraulic on river left", "Tieton Narrows — technical III-IV", "Dam releases are scheduled", "Flows can surge quickly"],
          gaugeId: "12486500", awReachId: nil),
    River(id: "20", slug: "lochsa-river", name: "Lochsa River",
          region: "Bitterroot Mountains", state: "ID", difficulty: "IV",
          optimalMin: 3000, optimalMax: 10000,
          description: "The Lochsa is Idaho's great spring flood — a 50-mile corridor of continuous Class III-IV rapids tucked along US-12 in the Bitterroot Mountains.",
          hazards: ["Lochsa Falls — Class V, mandatory portage", "High volume above 10,000 CFS creates keeper hydraulics", "50-mile corridor — no easy bailout", "Cold late-spring water"],
          gaugeId: "13337000", awReachId: nil),
    River(id: "21", slug: "middle-fork-salmon", name: "Middle Fork of the Salmon",
          region: "Frank Church Wilderness", state: "ID", difficulty: "IV",
          optimalMin: 2000, optimalMax: 8000,
          description: "The Middle Fork of the Salmon is America's greatest wilderness river trip — 100 miles of Class IV whitewater through the largest contiguous wilderness in the lower 48.",
          hazards: ["Permit required — highly competitive lottery", "Dagger Falls — Class V mandatory portage", "100% self-sufficient", "Flash flooding possible"],
          gaugeId: "13295000", awReachId: nil),
    River(id: "22", slug: "north-fork-payette", name: "North Fork Payette River",
          region: "Payette River Corridor", state: "ID", difficulty: "V",
          optimalMin: 800, optimalMax: 3000,
          description: "The North Fork Payette is among the top Class V runs in North America — a 15-mile, all-day sufferfest of continuous, powerful whitewater.",
          hazards: ["Jaws Rapid — Class V+", "Golf Course — long Class V rapid", "Continuous gradient means no recovery after a swim", "High water above 3,000 CFS is Class V+ throughout"],
          gaugeId: "13235000", awReachId: nil),
    River(id: "23", slug: "selway-river", name: "Selway River",
          region: "Selway-Bitterroot Wilderness", state: "ID", difficulty: "IV-V",
          optimalMin: 2000, optimalMax: 7000,
          description: "The Selway may be the most coveted river permit in the country. With only one launch per day allowed, this 47-mile wilderness float is profoundly rare.",
          hazards: ["Selway Falls — Class VI mandatory portage", "One launch per day permit", "Wilderness setting — multi-day self-sufficiency required", "Water levels can change dramatically day to day"],
          gaugeId: "13336500", awReachId: nil),
    River(id: "24", slug: "rogue-river", name: "Rogue River — Wild Section",
          region: "Siskiyou Mountains", state: "OR", difficulty: "III-IV",
          optimalMin: 1500, optimalMax: 6000,
          description: "The Rogue's Wild Section is Oregon's definitive multi-day river adventure — a 35-mile float through a federally designated Wild & Scenic corridor.",
          hazards: ["Blossom Bar — Class IV boulder garden", "Mule Creek Canyon — narrow canyon, powerful hydraulics", "Rainie Falls — Class V mandatory portage", "Permit required for the Wild Section"],
          gaugeId: "14361500", awReachId: nil),
    River(id: "25", slug: "deschutes-river", name: "Deschutes River — Maupin Section",
          region: "High Desert", state: "OR", difficulty: "III",
          optimalMin: 3000, optimalMax: 8000,
          description: "The Deschutes is Oregon's great high-desert river — a dam-controlled gem that flows consistently through canyon country of basalt columns and sagebrush.",
          hazards: ["Wapinitia Rapid (Class III+)", "Oak Springs Rapid — Class III", "Fishing pressure — yield to anglers", "Afternoon wind in the canyon"],
          gaugeId: "14092750", awReachId: nil),
    River(id: "26", slug: "north-umpqua-river", name: "North Umpqua River",
          region: "Umpqua National Forest", state: "OR", difficulty: "IV-V",
          optimalMin: 500, optimalMax: 2000,
          description: "The North Umpqua is Oregon's most demanding accessible whitewater run — a relentlessly technical series of Class IV-V drops carved through ancient basalt lava flows.",
          hazards: ["Deadline Falls — Class V, mandatory portage", "Multiple undercut basalt walls", "Low water exposes technical rock gardens", "Limited cell service"],
          gaugeId: "14321000", awReachId: nil),
    River(id: "27", slug: "illinois-river", name: "Illinois River",
          region: "Klamath Mountains", state: "OR", difficulty: "IV-V",
          optimalMin: 500, optimalMax: 2500,
          description: "The Illinois is Oregon's wildest whitewater river — a 3-day, permit-required descent through the Kalmiopsis Wilderness.",
          hazards: ["Green Wall Rapid — Class V", "3-day commitment — no egress in the Kalmiopsis Wilderness", "Spring flooding can be extremely dangerous", "Permit required"],
          gaugeId: "14377100", awReachId: nil),
    River(id: "28", slug: "south-fork-american", name: "American River — South Fork",
          region: "Gold Country", state: "CA", difficulty: "III-IV",
          optimalMin: 800, optimalMax: 4000,
          description: "The South Fork of the American is California's most beloved paddling river — a Gold Rush-era canyon that delivers classic Class III-IV whitewater.",
          hazards: ["Troublemaker Rapid — Class IV", "Meatgrinder — Class III+", "High commercial raft traffic on weekends", "Flows above 4,000 CFS upgrade Troublemaker to serious Class IV+"],
          gaugeId: "11444500", awReachId: nil),
    River(id: "29", slug: "tuolumne-river", name: "Tuolumne River",
          region: "Sierra Nevada Foothills", state: "CA", difficulty: "IV-V",
          optimalMin: 600, optimalMax: 2500,
          description: "The Tuolumne is the jewel of California whitewater — a 18-mile Class IV-V canyon run that has defined Sierra kayaking since the first descents of the 1970s.",
          hazards: ["Clavey Falls — Class V, 15-foot drop", "Jawbone Rapid — Class IV", "Limited flows — Hetch Hetchy controls release", "Remote canyon"],
          gaugeId: "11289000", awReachId: nil),
    River(id: "30", slug: "cal-salmon-river", name: "Cal Salmon River",
          region: "Klamath Mountains", state: "CA", difficulty: "IV-V",
          optimalMin: 600, optimalMax: 3000,
          description: "The Cal Salmon is a gem of the Klamath Mountains — a steep, technical Class IV-V run through pristine wilderness.",
          hazards: ["Bloomer Falls — Class V waterfall", "Last Chance Rapid — Class V", "Spring season only", "Remote location — no cell service"],
          gaugeId: "11522500", awReachId: nil),
    River(id: "31", slug: "kings-river", name: "Kings River — Garlic Falls Section",
          region: "Sierra Nevada", state: "CA", difficulty: "IV",
          optimalMin: 1000, optimalMax: 4000,
          description: "The Kings River drains the highest terrain in the Sierra Nevada and runs through one of California's most underappreciated river canyons.",
          hazards: ["Garlic Falls — Class V, steep and powerful", "High granite walls create long portages", "Flows above 4,000 CFS turn Class IV to serious Class V", "Cold snowmelt water well into June"],
          gaugeId: "11218500", awReachId: nil),
]

import Foundation

enum SampleData {
    static let alex = Paddler(
        id: UUID(uuidString: "DD95C30B-A341-41DE-9618-1F40DB4A70E1")!,
        displayName: "Alex Rivera",
        skillLevel: .classFour,
        homeRun: "Clear Creek",
        isFriend: true
    )

    static let maya = Paddler(
        id: UUID(uuidString: "85398273-A788-4619-9D5F-19B1F0649BA2")!,
        displayName: "Maya Chen",
        skillLevel: .classThreeFour,
        homeRun: "Arkansas",
        isFriend: true
    )

    static let eli = Paddler(
        id: UUID(uuidString: "8EF5393F-E611-4881-918B-F9255253C20E")!,
        displayName: "Eli Brooks",
        skillLevel: .classFive,
        homeRun: "Gore Canyon",
        isFriend: false
    )

    static let runs: [RiverRun] = [
        RiverRun(
            id: UUID(uuidString: "A66C1A0F-C456-4C1D-B0C8-3B62A28D1571")!,
            slug: "clear-creek",
            name: "Clear Creek",
            region: "Front Range",
            difficulty: .classThreeFour,
            currentCfs: 520,
            optimalMin: 400,
            optimalMax: 1000,
            trend: .rising,
            hazards: ["Low-head dams on approach", "Strainer risk above 500 CFS", "Busy road-side access"],
            lastUpdated: Date().addingTimeInterval(-9 * 60)
        ),
        RiverRun(
            id: UUID(uuidString: "8F2803AC-C5EE-471E-AC99-E11F03599EB2")!,
            slug: "arkansas-royal-gorge",
            name: "Arkansas River - Royal Gorge",
            region: "Royal Gorge",
            difficulty: .classThreeFour,
            currentCfs: 870,
            optimalMin: 600,
            optimalMax: 1200,
            trend: .stable,
            hazards: ["Limited eddies", "Undercut rocks at Sunshine Falls", "Remote canyon rescue"],
            lastUpdated: Date().addingTimeInterval(-18 * 60)
        ),
        RiverRun(
            id: UUID(uuidString: "6911D4FB-D611-4205-96F6-2B63312D10EF")!,
            slug: "cache-la-poudre",
            name: "Cache la Poudre",
            region: "Northern Front Range",
            difficulty: .classThree,
            currentCfs: 255,
            optimalMin: 300,
            optimalMax: 800,
            trend: .falling,
            hazards: ["Poudre Falls portage", "Bridge abutment sieves", "Fast post-peak drops"],
            lastUpdated: Date().addingTimeInterval(-31 * 60)
        ),
        RiverRun(
            id: UUID(uuidString: "8249DB12-2658-4F81-873A-6797D205E093")!,
            slug: "gore-canyon",
            name: "Colorado River - Gore Canyon",
            region: "Upper Colorado",
            difficulty: .classFive,
            currentCfs: 1280,
            optimalMin: 900,
            optimalMax: 1600,
            trend: .rising,
            hazards: ["Class V commitment", "Long swims", "Remote rescue"],
            lastUpdated: Date().addingTimeInterval(-14 * 60)
        )
    ]

    static let trips: [Trip] = [
        Trip(
            id: UUID(uuidString: "704B66A0-27C4-43AA-8C1C-F7B7B7B84DE4")!,
            runSlug: "clear-creek",
            runName: "Clear Creek",
            date: Date().addingTimeInterval(5 * 60 * 60),
            meetTime: "5:30 PM",
            meetingPoint: "Golden takeout",
            organizer: alex,
            members: [maya],
            totalSpots: 4,
            minSkill: .classThreeFour,
            notes: "After-work lap if flow holds. Quick shuttle and cold water gear."
        ),
        Trip(
            id: UUID(uuidString: "6155B760-B355-479B-97EE-71FA4F305B83")!,
            runSlug: "gore-canyon",
            runName: "Colorado River - Gore Canyon",
            date: Date().addingTimeInterval(26 * 60 * 60),
            meetTime: "8:00 AM",
            meetingPoint: "Pumphouse lot",
            organizer: eli,
            members: [alex],
            totalSpots: 3,
            minSkill: .classFive,
            notes: "Experienced crew only. Confirm roll, safety kit, and exit plan before launch."
        )
    ]

    static let messages: [CrewMessage] = [
        CrewMessage(
            id: UUID(uuidString: "8D36DA12-BE59-44BA-93D8-FFACFAEED1F3")!,
            sender: alex,
            body: "Gauge is still rising. I can bring the throw bag and first aid kit.",
            sentAt: Date().addingTimeInterval(-22 * 60)
        ),
        CrewMessage(
            id: UUID(uuidString: "E0D24D07-C47B-4EF2-86BF-8988F869605C")!,
            sender: maya,
            body: "I am in. Need one more driver for shuttle.",
            sentAt: Date().addingTimeInterval(-12 * 60)
        )
    ]
}

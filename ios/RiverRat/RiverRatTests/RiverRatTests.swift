import XCTest
@testable import RiverRat

final class RiverRatTests: XCTestCase {
    func testRunStatusClassifiesRunnableWater() {
        let run = SampleData.runs[0]
        XCTAssertEqual(run.status, .in)
        XCTAssertTrue(run.isRunnable)
    }

    func testTripOpenSpotsIncludesOrganizer() {
        let trip = SampleData.trips[0]
        XCTAssertEqual(trip.filledCount, 2)
        XCTAssertEqual(trip.openSpots, 2)
    }

    func testPaddlerInitialsUseFirstTwoWords() {
        XCTAssertEqual(SampleData.alex.initials, "AR")
    }
}

import Foundation

struct FlowData {
    let cfs: Double
    let trend: FlowTrend
    let timestamp: Date
    let tempC: Double?

    enum FlowTrend {
        case rising, falling, stable

        var symbol: String {
            switch self {
            case .rising: "arrow.up"
            case .falling: "arrow.down"
            case .stable: "arrow.right"
            }
        }
    }
}

// USGS API response shapes

struct USGSResponse: Decodable {
    let value: USGSValue
}

struct USGSValue: Decodable {
    let timeSeries: [USGSTimeSeries]
}

struct USGSTimeSeries: Decodable {
    let sourceInfo: USGSSourceInfo
    let variable: USGSVariable?
    let values: [USGSValuesGroup]
}

struct USGSSourceInfo: Decodable {
    let siteCode: [USGSSiteCode]
}

struct USGSSiteCode: Decodable {
    let value: String
}

struct USGSVariable: Decodable {
    let variableCode: [USGSVariableCode]?
}

struct USGSVariableCode: Decodable {
    let value: String
}

struct USGSValuesGroup: Decodable {
    let value: [USGSMeasurement]
}

struct USGSMeasurement: Decodable {
    let value: String
    let dateTime: String
}

import ElevationQueryResponse from "usgs-ned/ElevationQueryResult";
import SurfacePenetrationInfo from "./SurfacePenetrationInfo";
/**
 * @typedef {Object} AirspaceCalculatorResult
 * @property {SurfacePenetrationInfo} surfacePenetration
 * @property {NedElevationInfo} terrainInfo
 * @property {number[]} xy - An array containing two number elements: X and Y values.
 */
export interface AirspaceCalculatorResult {
    surfacePenetration: SurfacePenetrationInfo;
    terrainInfo: ElevationQueryResponse;
    xy: [number, number];
}
export default class AirspaceCalculator {
    imageServiceUrl: string;
    /**
     * Calculates surface penetrations
     * @constructor
     * @alias module:AirspaceCalculator
     */
    constructor(imageServiceUrl: string);
    /**
     * Performs calculation
     * @param {number} x
     * @param {number} y
     * @param {number} agl - Height above ground level (AGL) in feet.
     * @returns {Promise<AirspaceCalculatorResult>}
     */
    calculate(x: number, y: number, agl: number): Promise<AirspaceCalculatorResult>;
    /**
     * Performs calculation
     * @param {number} x
     * @param {number} y
     * @param {number} agl - Height above ground level (AGL) in feet.
     * @param {string} imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
     * @returns {Promise<AirspaceCalculatorResult>}
     */
    static calculateSurfacePenetration: (x: number, y: number, agl: number, imageServiceUrl: string) => Promise<AirspaceCalculatorResult>;
}

import ElevationQueryResponse from "usgs-ned/ElevationQueryResult";
import SurfacePenetrationInfo from "./SurfacePenetrationInfo";
/**
 * Result of the Airspace Calculator.
 */
export interface AirspaceCalculatorResult {
    /** Surface penetration information */
    surfacePenetration: SurfacePenetrationInfo;
    /** Terrain Information */
    terrainInfo: ElevationQueryResponse;
    /** An array containing two number elements: X and Y values. */
    xy: [number, number];
}
/**
 * Calculates surface penetrations
 */
export default class AirspaceCalculator {
    imageServiceUrl: string;
    elevationServiceUrl: string;
    /**
     * @param imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
     * @param [elevationServiceUrl] - Override the default URL to the USGS National Map Elevation service, in case they move the service in the future.
     */
    constructor(imageServiceUrl: string, elevationServiceUrl?: string);
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
    static calculateSurfacePenetration: (x: number, y: number, agl: number, imageServiceUrl: string, elevationServiceUrl?: string | undefined) => Promise<AirspaceCalculatorResult>;
}

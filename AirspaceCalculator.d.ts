/// <reference path="typings/index.d.ts" />
/// <reference path="SurfacePenetrationInfo.d.ts" />

declare type Units = "Feet" | "Meters";

/**
 * @typedef NedElevationInfo
 * @property {number} x
 * @property {number} y
 * @property {string} Data_Source
 * @property {number} Elevation
 * @property {string} Units - 'Feet' or 'Meters'
 */
interface NedElevationInfo {
	x: number,
	y: number,
	Data_Source: string,
	Elevation: number,
	Units: Units
}

/**
 * @typedef {Object} AirspaceCalculatorResult
 * @property {SurfacePenetrationInfo} surfacePenetration
 * @property {NedElevationInfo} terrainInfo
 * @property {number[]} xy - An array containing two number elements: X and Y values.
 */
interface AirspaceCalculatorResult {
	surfacePenetration: SurfacePenetrationInfo;
	terrainInfo: NedElevationInfo;
	xy: [number, number];
}


/**
 * Calculates surface penetrations
 * @class
 */
declare class AirspaceCalculator {
	/**
	 * @param {string} imageServiceUrl - Image service URL that provides imaginary surfaces for airports.
	 */
	constructor(imageServiceUrl: string);
	/**
	 * Performs calculation
	 * @param {number} x
	 * @param {number} y
	 * @param {number} agl - Height above ground level (AGL) in feet.
	 * @returns {Promise<AirspaceCalculatorResult>}
	 */
	calculate(x: number, y: number, agl: number): Promise<AirspaceCalculatorResult>

	/**
	 * Performs calculation
	 * @param {number} x
	 * @param {number} y
	 * @param {number} agl - Height above ground level (AGL) in feet.
	 * @param {string} imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
	 * @returns {Promise<AirspaceCalculatorResult>}
	 */
	static calculateSurfacePenetration(x: number, y: number, agl: number, imageServiceUrl: string): Promise<AirspaceCalculatorResult>
}
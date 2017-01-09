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
    calculate(x: number, y: number, agl: number): Promise<{}>;
    /**
     * Performs calculation
     * @param {number} x
     * @param {number} y
     * @param {number} agl - Height above ground level (AGL) in feet.
     * @param {string} imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
     * @returns {Promise<AirspaceCalculatorResult>}
     */
    static calculateSurfacePenetration: (x: number, y: number, agl: number, imageServiceUrl: string) => Promise<{}>;
}

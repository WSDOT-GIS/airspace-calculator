/**
 * Calculates surface penetrations
 * @module AirspaceCalculator
 */

import getElevation from "usgs-ned";
import ElevationQueryResponse from "usgs-ned/ElevationQueryResult";
import SurfacePenetrationInfo from "./SurfacePenetrationInfo";

/**
 * @external ArcGisPoint
 * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/02r3/02r3000000n1000000.htm#POINT|Point}
 */

/**
 * Converts WGS 84 coordinate pair into ArcGIS format point object.
 * @returns {ArcGisPoint}
 */
function createEsriGeometry(x: number, y: number) {
    return {
        x: x,
        y: y,
        spatialReference: {
            wkid: 4326
        }
    };
}

/**
 * Converts an object into a query string
 */
function objectToQueryString(o: any) {
    let output = [];
    for (let name in o) {
        if (o.hasOwnProperty(name)) {
            let v = o[name];
            if (typeof v === "object") {
                v = JSON.stringify(v);
            }
            output.push([name, v].map(encodeURIComponent).join("="));
        }
    }
    return output.join("&");
}

/**
 * Executes an identify operation on an image service.
 */
function identify(x: number, y: number, imageServerUrl: string): Promise<number | string> {
    let params = {
        geometry: createEsriGeometry(x, y),
        returnGeometry: false,
        geometryType: "esriGeometryPoint",
        f: "json"
    };

    // Add the identify operation to the URL if not present.
    if (!/\/identify\/?$/.test(imageServerUrl)) {
        imageServerUrl = imageServerUrl.replace(/\/?$/, "/identify");
    }

    // Add the query string URL.
    imageServerUrl = [imageServerUrl, objectToQueryString(params)].join("?");

    return fetch(imageServerUrl).then(function (response) {
        return response.json();
    }).then(function (json: any) {
        let pixelValue = json.value as number | string;
        let n = Number(pixelValue);
        // Return the number, or pixel value if not a number.
        return isNaN(n) ? pixelValue : n;
    });
}

/**
 * @typedef {Object} AirspaceCalculatorResult
 * @property {SurfacePenetrationInfo} surfacePenetration
 * @property {NedElevationInfo} terrainInfo
 * @property {number[]} xy - An array containing two number elements: X and Y values.
 */

export interface AirspaceCalculatorResult {
    surfacePenetration: SurfacePenetrationInfo;
    terrainInfo: ElevationQueryResponse;
    xy: [number, number]
}

/**
 * Performs calculation
 * @param x - X
 * @param y - Y
 * @param agl - Height above ground level (AGL) in feet.
 * @param imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
 * @returns {Promise<AirspaceCalculatorResult>}
 */
let calculateSurfacePenetration = function (x: number, y: number, agl: number, imageServiceUrl: string): Promise<AirspaceCalculatorResult> {

    let elevationPromise = getElevation(x, y);
    let identifyPromise = identify(x, y, imageServiceUrl);

    return new Promise(function (resolve, reject) {
        Promise.all([elevationPromise, identifyPromise]).then(function (promises) {
            let terrainResponse = promises[0];
            let surfaceElevation = typeof promises[1] === "number" ? promises[1] : null;
            let spInfo = new SurfacePenetrationInfo(agl, surfaceElevation, terrainResponse.elevation);
            resolve({
                surfacePenetration: spInfo,
                terrainInfo: terrainResponse,
                xy: [x, y]
            });
        }, function (error) {
            reject(error);
        });
    });
};


export default class AirspaceCalculator {
    /**
     * Calculates surface penetrations
     * @constructor
     * @alias module:AirspaceCalculator
     */
    constructor(public imageServiceUrl: string) {
        if (!imageServiceUrl) {
            throw new TypeError("imageServiceUrl not provided");
        }
    }

    /**
     * Performs calculation
     * @param {number} x
     * @param {number} y
     * @param {number} agl - Height above ground level (AGL) in feet.
     * @returns {Promise<AirspaceCalculatorResult>}
     */
    calculate(x: number, y: number, agl: number) {
        return calculateSurfacePenetration(x, y, agl, this.imageServiceUrl);
    };

    /**
     * Performs calculation
     * @param {number} x
     * @param {number} y
     * @param {number} agl - Height above ground level (AGL) in feet.
     * @param {string} imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
     * @returns {Promise<AirspaceCalculatorResult>}
     */
    static calculateSurfacePenetration = calculateSurfacePenetration;
}
/**
 * Calculates surface penetrations
 * @module AirspaceCalculator
 */

import { Point } from "arcgis-rest-api";
import getElevation from "usgs-ned";
import ElevationQueryResponse from "usgs-ned/ElevationQueryResult";
import SurfacePenetrationInfo from "./SurfacePenetrationInfo";

/**
 * Converts WGS 84 coordinate pair into ArcGIS format point object.
 * @returns {ArcGisPoint}
 */
function createEsriGeometry(x: number, y: number): Point {
    return {
        x,
        y,
        // tslint:disable-next-line:object-literal-sort-keys
        spatialReference: {
            wkid: 4326,
        },
    };
}

/**
 * Converts an object into a query string
 */
function objectToQueryString(o: any) {
    const output = [];
    for (const name in o) {
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
 * Executes an identify operation on an image service and returns the numeric value.
 */
function identify(x: number, y: number, imageServerUrl: string): Promise<number | string> {
    const params = {
        f: "json",
        geometry: createEsriGeometry(x, y),
        geometryType: "esriGeometryPoint",
        returnGeometry: false,
    };

    // Add the identify operation to the URL if not present.
    if (!/\/identify\/?$/.test(imageServerUrl)) {
        imageServerUrl = imageServerUrl.replace(/\/?$/, "/identify");
    }

    // Add the query string URL.
    imageServerUrl = [imageServerUrl, objectToQueryString(params)].join("?");

    return fetch(imageServerUrl).then((response) => {
        return response.json();
        // For JSON structure, see response section here:
        // http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Identify/02r30000010s000000/
    }).then((json: any) => {
        const pixelValue = json.value as string;
        const n = Number(pixelValue);
        // Return the number, or pixel value if not a number.
        return isNaN(n) ? pixelValue : n;
    });
}

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
    /**
     * Performs calculation
     * @param x - X coordinate of a point
     * @param y - Y coordinate of a point
     * @param agl - Height above ground level (AGL) in feet.
     * @param imageServiceUrl - E.g.,
     * http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
     * @param [elevationServiceUrl] - Override the default URL to the USGS National Map Elevation service,
     * in case they move the service in the future.
     */
    public static async calculateSurfacePenetration(
        x: number, y: number, agl: number, imageServiceUrl: string, elevationServiceUrl?: string) {

        const elevationPromise = getElevation(x, y, "Feet", elevationServiceUrl);
        const identifyPromise = identify(x, y, imageServiceUrl);
        const [terrainResponse, surfaceElevation] = await Promise.all([elevationPromise, identifyPromise]);
        const spInfo = new SurfacePenetrationInfo(agl, surfaceElevation, terrainResponse.elevation);
        const output: AirspaceCalculatorResult = {
            surfacePenetration: spInfo,
            terrainInfo: terrainResponse,
            xy: [x, y],
        };
        return output;
    }

    /**
     * @param imageServiceUrl - E.g.,
     * http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
     * @param [elevationServiceUrl] - Override the default URL to the USGS National Map Elevation service,
     * in case they move the service in the future.
     */
    constructor(public imageServiceUrl: string, public elevationServiceUrl?: string) {
        if (!imageServiceUrl) {
            throw new TypeError("imageServiceUrl not provided");
        }
    }

    /**
     * Performs calculation
     * @param {number} x - The X coordinate
     * @param {number} y - The Y coordinate
     * @param {number} agl - Height above ground level (AGL) in feet.
     * @returns {Promise<AirspaceCalculatorResult>}
     */
    public calculate(x: number, y: number, agl: number) {
        return AirspaceCalculator.calculateSurfacePenetration(
            x, y, agl, this.imageServiceUrl, this.elevationServiceUrl);
    }

}

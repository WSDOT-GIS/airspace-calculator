/**
 * Calculates surface penetrations
 * @module AirspaceCalculator
 */

import { Point } from "arcgis-rest-api";
import {
  getElevationData,
  MeasurementUnits,
  WKId,
  type ElevationData,
} from "usgs-ned";
import { IdentifyResponse } from "./arcgis-rest-api-ext";
import SurfacePenetrationInfo from "./SurfacePenetrationInfo";

/**
 * Converts WGS 84 coordinate pair into ArcGIS format point object.
 */
function createEsriGeometry(x: number, y: number): Point {
  return {
    x,
    y,
    
    spatialReference: {
      wkid: 4326,
    },
  };
}

/**
 * Converts an object into a query string
 */
function objectToQueryString(o: Record<string, unknown>) {
  const output = new URLSearchParams();
  for (const name in o) {
    if (Object.prototype.hasOwnProperty.call(o, name)) {
      let v = o[name];
      if (v == null) {
        v = "";
      } else if (typeof v === "object") {
        v = JSON.stringify(v);
      }

      output.set(name, typeof v === "string" ? v : `${v}`);
    }
  }
  return output;
}

/**
 * Executes an identify operation on an image service and returns the numeric value.
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param imageServerUrl - Image server URL
 * @returns Returns the elevation value. If the value returned from the service cannot be converted
 * to a number, the value itself (a string) will be returned.
 */
async function identify(
  x: number,
  y: number,
  imageServerUrl: string
): Promise<number | string> {
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

  const queryResponse = await fetch(imageServerUrl);
  // For JSON structure, see response section here:
  // https://developers.arcgis.com/rest/services-reference/enterprise/identify-image-service-.htm
  const jsonObj: IdentifyResponse = await queryResponse.json();
  const pixelValue = jsonObj.value;
  const n = Number(pixelValue);
  // Return the number, or pixel value if not a number.
  return isNaN(n) ? pixelValue : n;
}

/**
 * Result of the Airspace Calculator.
 */
export interface AirspaceCalculatorResult {
  /** Surface penetration information */
  surfacePenetration: SurfacePenetrationInfo;
  /** Terrain Information */
  terrainInfo: ElevationData<Date>;
  /** An array containing two number elements: X and Y values. */
  xy: [number, number];
}

/**
 * Performs calculation
 * @param x - X coordinate of a point
 * @param y - Y coordinate of a point
 * @param agl - Height above ground level (AGL) in feet.
 * @param imageServiceUrl - E.g.,
 * https://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
 * @param [elevationServiceUrl] - Override the default URL to the USGS National Map Elevation service,
 * in case they move the service in the future.
 */
export async function calculateSurfacePenetration(
  x: number,
  y: number,
  agl: number,
  imageServiceUrl: string,
  elevationServiceUrl?: string
) {
  const elevationPromise = getElevationData(
    { x, y, units: MeasurementUnits.Feet, includeDate: true, wkid: WKId.gps },
    elevationServiceUrl
  );
  const identifyPromise = identify(x, y, imageServiceUrl);
  const [terrainResponse, surfaceElevation] = await Promise.all([
    elevationPromise,
    identifyPromise,
  ]);
  const spInfo = new SurfacePenetrationInfo(
    agl,
    surfaceElevation,
    terrainResponse.value
  );
  const output: AirspaceCalculatorResult = {
    surfacePenetration: spInfo,
    terrainInfo: terrainResponse,
    xy: [x, y],
  };
  return output;
}

/**
 * Calculates surface penetrations
 * @deprecated Use {@link calculateSurfacePenetration} instead.
 */
export default class AirspaceCalculator {
  /**
   * @param imageServiceUrl - E.g.,
   * https://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
   * @param [elevationServiceUrl] - Override the default URL to the USGS National Map Elevation service,
   * in case they move the service in the future.
   */
  constructor(
    public imageServiceUrl: string,
    public elevationServiceUrl?: string
  ) {
    if (!imageServiceUrl) {
      throw new TypeError("imageServiceUrl not provided");
    }
  }

  /**
   * @deprecated Use {@link calculateSurfacePenetration} instead.
   */
  public static calculateSurfacePenetration = calculateSurfacePenetration;

  /**
   * Performs calculation
   * @param {number} x - The X coordinate
   * @param {number} y - The Y coordinate
   * @param {number} agl - Height above ground level (AGL) in feet.
   * @returns {Promise<AirspaceCalculatorResult>}
   * @deprecated Use {@link calculateSurfacePenetration} instead.
   */
  public calculate(x: number, y: number, agl: number) {
    return calculateSurfacePenetration(
      x,
      y,
      agl,
      this.imageServiceUrl,
      this.elevationServiceUrl
    );
  }
}

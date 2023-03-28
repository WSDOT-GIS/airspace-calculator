import {
  getElevationData,
  MeasurementUnits,
  WKId,
  type ElevationData,
} from "usgs-ned";
import { identify } from "./identify";
import SurfacePenetrationInfo from "./SurfacePenetrationInfo";
export * from "./SurfacePenetrationInfo";
export * from "./formatting";

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

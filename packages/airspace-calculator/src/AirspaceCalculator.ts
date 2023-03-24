/**
 * Calculates surface penetrations
 * @module AirspaceCalculator
 */

import { calculateSurfacePenetration } from "./index";

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
   * @param x - The X coordinate
   * @param y - The Y coordinate
   * @param agl - Height above ground level (AGL) in feet.
   * @returns A promise with the result of the calculation
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

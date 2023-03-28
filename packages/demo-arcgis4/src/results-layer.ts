import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { AirspaceCalculatorResult } from "airspace-calculator";
import type { ElevationData } from "usgs-ned";

export type AirspaceCalculatorResultAttributes = Partial<
  Pick<ElevationData<Date>, "locationId" | "rasterId" | "resolution"> & {
    AcquisitionDate: ReturnType<typeof Date.prototype.valueOf>;
  } & { agl: number; surfaceElevation: number | null; terrainElevation: number }
>;

function flattenAirspaceCalculatorResult(
  airspaceCalculatorResult: AirspaceCalculatorResult
): AirspaceCalculatorResultAttributes {
  const { surfacePenetration, terrainInfo } = airspaceCalculatorResult;
  const { agl, surfaceElevation, terrainElevation } = surfacePenetration;
  const { locationId, rasterId, resolution, attributes } = terrainInfo;
  return {
    agl,
    surfaceElevation,
    terrainElevation,
    locationId,
    rasterId,
    resolution,
    AcquisitionDate: attributes?.AcquisitionDate.valueOf(),
  };
}

/**
 *
 */
export class AirspaceCalculatorResultGraphic extends Graphic {
  declare attributes: AirspaceCalculatorResultAttributes;
  /**
   * @inheritdoc
   */
  constructor(
    airspaceCalculatorResult: AirspaceCalculatorResult,
    properties?: __esri.GraphicProperties
  ) {
    properties = properties ?? {};

    const acAttributes: AirspaceCalculatorResultAttributes &
      Record<string, unknown> = flattenAirspaceCalculatorResult(
      airspaceCalculatorResult
    );

    if (!properties.attributes) {
      properties.attributes = acAttributes;
    } else {
      for (const key in acAttributes) {
        if (Object.prototype.hasOwnProperty.call(acAttributes, key)) {
          const value = acAttributes[key];
          properties.attributes[key] = value;
        }
      }
    }

    super(properties);
  }
}

/**
 * Feature layer for Airspace Calculator results.
 */
export class AirspaceCalculatorResultsLayer extends FeatureLayer {
  /**
   * @inheritdoc
   */
  constructor(properties?: __esri.FeatureLayerProperties) {
    // Initialize properties if they were not provided.
    if (!properties) {
      properties = {};
    }
    // This layer will not use a remote source, only locally created graphics.
    properties.source = properties.source ?? [];
    super(properties);
  }

  /**
   * Add an Airspace Calculator result as a graphic to the layer.
   */
  public addAirspaceCalculatorResult(result: AirspaceCalculatorResult) {
    const graphic = new AirspaceCalculatorResultGraphic(result);
    this.source.add(graphic);
  }
}

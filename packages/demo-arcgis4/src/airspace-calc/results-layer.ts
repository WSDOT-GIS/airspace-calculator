import Collection from "@arcgis/core/core/Collection";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type {
  AirspaceCalculatorResult,
  SurfacePenetrationInfo
} from "airspace-calculator";
import type { ElevationData } from "usgs-ned";
import { popupTemplate } from "./popup-template";

/**
 * Defines the properties that a feature in the results {@link FeatureLayer} will have
 */
export type AirspaceCalculatorResultAttributes = Partial<
  Pick<ElevationData<Date>, "locationId" | "rasterId" | "resolution"> & {
    AcquisitionDate: ReturnType<typeof Date.prototype.valueOf> | null;
  } & Pick<
      SurfacePenetrationInfo,
      | "agl"
      | "surfaceElevation"
      | "terrainElevation"
      | "distanceFromSurface"
      | "penetrationOfSurface"
    > & {
      agl: number;
      ObjectID: number;
      penetratesSurface: number;
    }
>;

/**
 * Converts an {@link AirspaceCalculatorResult} into an object for use
 * as a graphic's attributes, removing nested objects.
 * @param airspaceCalculatorResult
 * @returns
 */
function flattenAirspaceCalculatorResult(
  airspaceCalculatorResult: AirspaceCalculatorResult
): AirspaceCalculatorResultAttributes {
  const { surfacePenetration, terrainInfo } = airspaceCalculatorResult;
  const {
    agl,
    surfaceElevation,
    terrainElevation,
    distanceFromSurface,
    penetratesSurface,
    penetrationOfSurface,
  } = surfacePenetration;
  const { locationId, rasterId, resolution, attributes } = terrainInfo;
  return {
    agl,
    surfaceElevation,
    terrainElevation,
    locationId,
    rasterId,
    resolution,
    distanceFromSurface,
    penetratesSurface: Number(penetratesSurface),
    penetrationOfSurface,
    AcquisitionDate: attributes?.AcquisitionDate.valueOf() ?? null,
  };
}

function createResultGraphic(
  airspaceCalculatorResult: AirspaceCalculatorResult,
  properties?: __esri.GraphicProperties
) {
  properties = properties ?? {};
  const [x, y] = airspaceCalculatorResult.xy;
  properties.geometry = new Point({ x, y });

  const acAttributes: ReturnType<typeof flattenAirspaceCalculatorResult> &
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
  return new Graphic(properties);
}

/**
 * An enumeration of field names, allowing them to be referenced
 * without having multiple copies of the same string.
 */
export const enum fieldNames { 
  ObjectID = "OBJECTID",
  agl = "agl",
  surfaceElevation = "surfaceElevation",
  terrainElevation = "terrainElevation",
  locationId = "locationId",
  rasterId = "rasterId",
  resolution = "resolution",
  AcquisitionDate = "AcquisitionDate",
  distanceFromSurface = "distanceFromSurface",
  penetratesSurface = "penetratesSurface",
  penetrationOfSurface = "penetrationOfSurface",
}

const renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    style: "circle",
    color: "white",
    outline: {
      color: "black",
    },
    size: 12,
  }),
});

export const airspaceCalculatorResultsLayerTitle =
  "Airspace Calculator Results";

/**
 * Create a feature layer for Airspace Calculator results.
 */
export function createAirspaceCalculatorResultsLayer(): FeatureLayer {
  const layer = new FeatureLayer({
    title: airspaceCalculatorResultsLayerTitle,
    id: "results",
    objectIdField: fieldNames.ObjectID,
    fields: [
      {
        name: fieldNames.ObjectID,
        type: "oid",
        alias: "Object ID",
        nullable: false,
        valueType: "unique-identifier",
      },
      {
        name: fieldNames.agl,
        type: "double",
        description: "Height about ground level in feet",
        alias: "Height above ground level (ft.)",
      },
      {
        name: fieldNames.surfaceElevation,
        alias: "Surface Elevation",
        type: "double",
      },
      {
        name: fieldNames.terrainElevation,
        alias: "Terrain Elevation",
        type: "double",
      },
      {
        name: fieldNames.locationId,
        alias: "USGS Location ID",
        type: "integer",
      },
      { name: fieldNames.rasterId, alias: "USGS Raster ID", type: "integer" },
      { name: fieldNames.resolution, alias: "Resolution", type: "double" },
      {
        name: fieldNames.AcquisitionDate,
        alias: "Acquisition Date",
        type: "date",
      },
      {
        name: fieldNames.distanceFromSurface,
        alias: "Distance from Surface",
        type: "double",
        valueType: "measurement",
      },
      {
        name: fieldNames.penetratesSurface,
        alias: "Penetrates Surface",
        type: "small-integer",
        valueType: "binary",
      },
      {
        name: fieldNames.penetrationOfSurface,
        alias: "Penetration of Surface",
        type: "double",
        valueType: "measurement",
      },
    ],
    // This layer will not use a remote source, only locally created graphics.
    source: new Collection(),
    popupEnabled: true,
    renderer: renderer,
    geometryType: "point",
    spatialReference: {
      wkid: 4326,
    },
    popupTemplate: popupTemplate
  });

  layer.on("layerview-create-error", (error) => {
    console.error("an error occurred", error);
  });

  return layer;
}

/**
 * Add an Airspace Calculator result as a graphic to the layer
 * by calling {@link FeatureLayer.prototype.applyEdits}
 */
export async function addAirspaceCalculatorResult(
  layer: ReturnType<typeof createAirspaceCalculatorResultsLayer>,
  result: AirspaceCalculatorResult
) {
  const graphic = createResultGraphic(result);
  const editsResult = await layer.applyEdits({
    addFeatures: [graphic],
  });
  return { editsResult, graphic };
}

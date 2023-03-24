import type {
  Feature,
  Point,
  SpatialReference,
  esriGeometryType,
} from "arcgis-rest-api";

/**
 * Response format for the result of an Image Server's Identify operation.
 * See https://developers.arcgis.com/rest/services-reference/identify-image-service-.htm
 */
interface IdentifyResponse {
  objectId: number;
  name: string;
  /**
   * The numerical value as a string (for some reason).
   */
  value: string;
  /**
   * the identified location
   */
  location: Point;
  /**
   * The properties of the identified object. (Returned only
   * when the image service source is from a mosaic dataset.)
   */
  properties: {
    [name: string]: never;
  } | null;
  /**
   * catalogItems are returned only when the image service source is a mosaic dataset.
   */
  catalogItems?: {
    objectIdFieldName: string;
    spatialReference: SpatialReference;
    geometryType: esriGeometryType;
    features: Feature[];
  } | null;
  /** 
   * catalogItemVisibilities are returned only when the image service
   * source is a mosaic dataset.
   * `[<catalogItem1Visibility>, <catalogItem2Visibility> ]`
   */
  catalogItemVisibilities: never[] | null;
}

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
export async function identify(
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

export default identify;

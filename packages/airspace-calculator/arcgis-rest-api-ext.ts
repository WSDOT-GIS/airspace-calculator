import type { Feature, Point, SpatialReference, esriGeometryType } from "arcgis-rest-api";

/**
 * Response format for the result of an Image Server's Identify operation.
 * See https://developers.arcgis.com/rest/services-reference/identify-image-service-.htm
 */
export interface IdentifyResponse {
    objectId: number,
    name: string,
    /** The numerical value as a string (for some reason). */
    value: string,
    location: Point, //the identified location
    properties: { //the properties of the identified object. (returned only when the image service source is from a mosaic dataset)
        [name: string]: never
    } | null,
    //catalogItems are returned only when the image service source is a mosaic dataset.
    catalogItems?: {
        objectIdFieldName: string,
        spatialReference: SpatialReference,
        geometryType: esriGeometryType,
        features: Feature[]
    } | null,
    //catalogItemVisibilities are returned only when the image service source is a mosaic dataset.
    catalogItemVisibilities: never[] | null; //[<catalogItem1Visibility>, <catalogItem2Visibility> ]
}
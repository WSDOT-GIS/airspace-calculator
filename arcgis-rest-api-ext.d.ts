import { Feature, Point, SpatialReference, esriGeometryType } from "arcgis-rest-api";

/**
 * Response format for the result of an Image Server's Identify operation.
 * See http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Identify/02r30000010s000000/
 */
interface IdentifyResponse {
    objectId: number,
    name: string,
    /** The numerical value as a string (for some reason). */
    value: string,
    location: Point, //the identified location
    properties: { //the properties of the identified object. (returned only when the image service source is from a mosaic dataset)
        [name: string]: any
    } | null,
    //catalogItems are returned only when the image service source is a mosaic dataset.
    catalogItems?: {
        objectIdFieldName: string,
        spatialReference: SpatialReference,
        geometryType: esriGeometryType,
        features: Feature[]
    } | null,
    //catalogItemVisibilities are returned only when the image service source is a mosaic dataset.
    catalogItemVisibilities: any[] | null; //[<catalogItem1Visibility>, <catalogItem2Visibility> ]
}
/// <reference types="arcgis-js-api" />
/**
 * Airspace Calculator for use with ArcGIS API for JavaScript.
 * @module ArcGisUI
 */
import UI from "./UI";
import EsriMap = require("esri/map");
/**
 * Extension of {@link AirspaceCalculator/UI} for ArcGIS API.
 * @constructor
 * @augments AirspaceCalculator/UI
 */
export default class ArcGisUI extends UI {
    private _draw;
    private _map;
    private markerGraphic;
    private markerLayer;
    private zoomLevel;
    private resultLayer;
    private mapMarkerSymbol;
    private updateMapMarker(dmsCoordinates);
    map: EsriMap | null;
    constructor(imageServiceUrl: string);
}

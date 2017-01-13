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
    zoomLevel: number;
    private _draw;
    private _map;
    private _markerGraphic;
    private _markerLayer;
    private _resultLayer;
    private _mapMarkerSymbol;
    private updateMapMarker(dmsCoordinates?);
    map: EsriMap | null;
    constructor(imageServiceUrl: string, elevationServiceUrl?: string);
}

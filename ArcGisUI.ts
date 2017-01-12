/**
 * Airspace Calculator for use with ArcGIS API for JavaScript.
 * @module ArcGisUI
 */
import UI from "./UI";
import Color = require("esri/Color");
import Draw = require("esri/toolbars/draw");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Graphic = require("esri/graphic");
import Point = require("esri/geometry/Point");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import InfoTemplate = require("esri/InfoTemplate");

import { AirspaceCalculatorResult } from "./AirspaceCalculator";
import DmsCoordinates from "dms-conversion";
import EsriMap = require("esri/map");
import Popup = require("esri/dijit/Popup");

/**
 * Creates the renderer
 * @returns {UniqueValueRenderer}
 */
function createRenderer() {
    let lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 1);
    let defaultSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, lineSymbol, new Color([255, 255, 255, 0.5]));
    let renderer = new UniqueValueRenderer(defaultSymbol, "penetratesSurface");
    let penetrationSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, lineSymbol, new Color("red"));
    renderer.addValue({
        value: 1,
        symbol: penetrationSymbol,
        label: "Penetration",
        description: "Penetration"
    });
    return renderer;
}


/**
 * Converts feet to meters
 * @param {number} feet
 * @returns {number}
 */
function feetToMeters(feet: number) {
    let ftPerM = 3.28084;
    return feet / ftPerM;
}

/**
 * Formats a Number (feet) into a string (feet and inches (rounded))
 * @param {number} feet
 * @returns {string}
 */
function formatAsFeetAndInches(feet: number) {
    const prime = "\u2032";
    const doublePrime = "\u2033";
    let inches = feet % 1;
    feet = feet - inches;
    inches = Math.round(inches * 12);
    if (inches === 12) {
        feet += 1;
        inches = 0;
    }
    return inches > 0 ? [feet, prime, inches, doublePrime].join("") : [feet, prime].join("");
}

/**
 * Formats feet as X'Y" (Z m.)
 * @param {number} feet
 * @returns {string}
 */
function formatFeetAsFeetAndInchesAndMeters(feet: number) {
    let m = feetToMeters(feet);
    return [formatAsFeetAndInches(feet), " (", Math.round(m * 100) / 100, " m.)"].join("");
}

/**
 * Converts an {@link AirspaceCalculatorResult} into a {@link external:Graphic}.
 * @param {AirspaceCalculatorResult} acResult
 * @returns {external:Graphic}
 */
function acResultToGraphic(acResult: AirspaceCalculatorResult) {
    let point = new Point({
        x: acResult.xy[0],
        y: acResult.xy[1],
        spatialReference: { wkid: 4326 }
    });
    let graphic = new Graphic(point, undefined, {
        agl: acResult.surfacePenetration.agl,
        distanceFromSurface: acResult.surfacePenetration.distanceFromSurface,
        penetrationOfSurface: acResult.surfacePenetration.penetrationOfSurface,
        surfaceElevation: acResult.surfacePenetration.surfaceElevation,
        terrainElevation: acResult.surfacePenetration.terrainElevation,
        penetratesSurface: acResult.surfacePenetration.penetratesSurface ? 1 : 0
    });

    return graphic;
}

/**
 * Creates the info window title.
 * @param {Graphic} graphic
 * @returns {string}
 */
function formatTitle(graphic: Graphic) {
    return graphic.attributes.penetratesSurface ? "Surface Penetration" : "No Surface Penetration";
}

/**
 * Creates the info window content.
 * @param {Graphic} graphic
 * @returns {HTMLDivElement}
 */
function formatResults(graphic: Graphic) {
    let output, message, list;
    message = ["A structure ", graphic.attributes.agl, "' above ground level ", graphic.attributes.penetratesSurface ? " would " : " would not ", " penetrate an airport's airspace."].join("");

    output = document.createElement("div");

    let p = document.createElement("p");
    let a;
    p.textContent = message;
    output.appendChild(p);

    if (graphic.attributes.penetratesSurface) {
        p = document.createElement("p");
        a = document.createElement("a");
        a.href = "http://www.faa.gov/forms/index.cfm/go/document.information/documentID/186273";
        a.target = "_blank";
        a.textContent = a.title = "Form FAA 7460-1: Notice of Proposed Construction or Alteration";
        p.appendChild(a);
        output.appendChild(p);
    }

    list = document.createElement("dl");
    output.appendChild(list);

    let data: any = {
        "Penetration of <abbr title='Federal Aviation Regulations'>FAR</abbr> Surface occurred at": formatFeetAsFeetAndInchesAndMeters(graphic.attributes.distanceFromSurface),
        "Terrain Elevation": formatFeetAsFeetAndInchesAndMeters(graphic.attributes.terrainElevation)
    };
    if (graphic.attributes.penetratesSurface) {
        data["Structure Exceeds <abbr title='Federal Aviation Regulations'>FAR</abbr> Surface by"] = formatFeetAsFeetAndInchesAndMeters(graphic.attributes.penetrationOfSurface);
    }

    for (let propName in data) {
        if (data.hasOwnProperty(propName)) {
            let dt = document.createElement("dt");
            dt.innerHTML = propName;
            list.appendChild(dt);
            let dd = document.createElement("dd");
            dd.textContent = data[propName];
            list.appendChild(dd);
        }
    }

    return output;
}

/**
 * Extension of {@link AirspaceCalculator/UI} for ArcGIS API.
 * @constructor
 * @augments AirspaceCalculator/UI
 */

export default class ArcGisUI extends UI {
    zoomLevel: number = 11;
    private _draw: Draw | null = null;
    private _map: EsriMap | null = null;
    private _markerGraphic: Graphic | null;
    private _markerLayer: GraphicsLayer;
    private _resultLayer: GraphicsLayer;
    private _mapMarkerSymbol = new SimpleMarkerSymbol();
    private updateMapMarker(dmsCoordinates?: Point | DmsCoordinates) {
        if (dmsCoordinates) {
            let point = dmsCoordinates instanceof Point ? dmsCoordinates : new Point({
                x: dmsCoordinates.longitude.dd,
                y: dmsCoordinates.latitude.dd,
                spatialReference: {
                    wkid: 4326
                }
            });
            if (!this._markerGraphic) {
                this._markerGraphic = new Graphic(point, this._mapMarkerSymbol);
                this._markerLayer.add(this._markerGraphic);
            } else {
                this._markerGraphic.setGeometry(point);
            }
            (this._markerLayer as any).refresh();
        } else {
            // Remove existing marker
            if (this._markerGraphic) {
                this._markerLayer.remove(this._markerGraphic);
                (this._markerLayer as any).refresh();
                this._markerGraphic = null;
            }
        }
    }
    public get map(): EsriMap | null {
        return this._map;
    }
    public set map(value: EsriMap | null) {
        this._map = value;
        let self = this;
        if (this._map) {
            this._draw = new Draw(this._map);
            this._markerLayer = this._map.graphics;


            this._draw.on("draw-complete", function (drawResponse) {
                drawResponse.target.deactivate();
                const drawPoint = drawResponse.geographicGeometry as Point;
                self.form.x.value = drawPoint.x as any;
                self.form.y.value = drawPoint.y as any;
                self.updateMapMarker(drawPoint);

                let evt = new CustomEvent("draw-complete", {
                    detail: drawResponse
                });
                self.form.dispatchEvent(evt);
            });

            this.form.addEventListener("add-from-map", function () {
                (self._draw as Draw).activate(Draw.POINT);
            });

            this.form.addEventListener("calculation-complete", function (e: CustomEvent) {
                let acResult = e.detail;
                let graphic = acResultToGraphic(acResult);
                self._resultLayer.add(graphic);
                self.updateMapMarker();
            });

            this.form.addEventListener("clear-graphics", function () {
                self._resultLayer.clear();
            });

            this.form.addEventListener("coordinates-update", function (e: CustomEvent) {
                let dmsCoordinates = e ? e.detail : null;
                self.updateMapMarker(dmsCoordinates);
            });

            let renderer = createRenderer();
            let infoTemplate = new InfoTemplate(formatTitle, formatResults);

            this._resultLayer = new GraphicsLayer({
                id: "results",
                infoTemplate: infoTemplate
            });
            this._resultLayer.setRenderer(renderer);

            this._resultLayer.on("graphic-add", function (e) {
                let graphic = e ? e.graphic || null : null;
                if (graphic) {
                    let geometry = graphic.geometry;
                    if (self._map) {
                        let infoWindow = self._map.infoWindow as Popup;
                        infoWindow.setFeatures([graphic]);
                        infoWindow.show(geometry as Point);
                        self._map.centerAndZoom(geometry as Point, self.zoomLevel);
                    }
                }
            });

            this._map.addLayer(self._resultLayer);
        }
    }

    constructor(imageServiceUrl: string, elevationServiceUrl?: string) {
        super(imageServiceUrl, elevationServiceUrl);
    }
}
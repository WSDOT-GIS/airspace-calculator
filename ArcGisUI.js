/*global define*/

/**
 * Airspace Calculator for use with ArcGIS API for JavaScript.
 * @module ArcGisUI
 */
define([
	"AirspaceCalculator/UI",
	"dms",

	"dojo/_base/Color",

	"esri/toolbars/draw",
	"esri/layers/GraphicsLayer",
	"esri/graphic",
	"esri/geometry/Point",
	"esri/renderers/UniqueValueRenderer",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/InfoTemplate"
], function (
	UI,
	DmsCoordinates,
	Color,
	Draw,
	GraphicsLayer,
	Graphic,
	Point,
	UniqueValueRenderer,
	SimpleMarkerSymbol,
	SimpleLineSymbol,
	InfoTemplate
) {

	/**
	 * @external Graphic
	 * @see {@link https://developers.arcgis.com/javascript/jsapi/graphic-amd.html|Graphic}
	 */

	/**
	 * Creates the renderer
	 * @returns {UniqueValueRenderer}
	 */
	function createRenderer() {
		var renderer, defaultSymbol, lineSymbol, penetrationSymbol;
		lineSymbol = SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("black"), 1);
		defaultSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, lineSymbol, new Color([255, 255, 255, 0.5]));
		renderer = new UniqueValueRenderer(defaultSymbol, "penetratesSurface");
		penetrationSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, lineSymbol, new Color("red"));
		renderer.addValue({
			value: 1,
			symbol: penetrationSymbol,
			label: "Penetration",
			description: "Penetration"
		});
		return renderer;
	}

	var mapMarkerSymbol = new SimpleMarkerSymbol();

	/**
	 * Converts feet to meters
	 * @param {number} feet
	 * @returns {number}
	 */
	function feetToMeters(feet) {
		var ftPerM = 3.28084;
		return feet / ftPerM;
	}

	/**
	 * Formats a Number (feet) into a string (feet and inches (rounded))
	 * @param {number} feet
	 * @returns {string}
	 */
	function formatAsFeetAndInches(feet) {
		var prime = "\u2032", doublePrime = '\u2033', inches = feet % 1;
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
	function formatFeetAsFeetAndInchesAndMeters(feet) {
		var m = feetToMeters(feet);
		return [formatAsFeetAndInches(feet), " (", Math.round(m * 100) / 100, " m.)"].join("");
	}

	/**
	 * Converts an {@link AirspaceCalculatorResult} into a {@link external:Graphic}.
	 * @param {AirspaceCalculatorResult} acResult
	 * @returns {external:Graphic}
	 */
	function acResultToGraphic(acResult) {
		var point = new Point( { 
			x: acResult.xy[0],
			y: acResult.xy[1],
			spatialReference: { wkid: 4326 }
		});
		var graphic = new Graphic(point, null, {
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
	function formatTitle(graphic) {
		return graphic.attributes.penetratesSurface ? "Surface Penetration" : "No Surface Penetration";
	}

	/**
	 * Creates the info window content.
	 * @param {Graphic} graphic
	 * @returns {HTMLDivElement}
	 */
	function formatResults(graphic) {
		var output, message, list;
		message = ["A structure ", graphic.attributes.agl, "' above ground level ", graphic.attributes.penetratesSurface ? " would " : " would not ", " penetrate an airport's airspace."].join("");

		output = document.createElement("div");
		
		var p = document.createElement("p");
		var a;
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

		var data = {
			"Penetration of <abbr title='Federal Aviation Regulations'>FAR</abbr> Surface occurred at": formatFeetAsFeetAndInchesAndMeters(graphic.attributes.penetrationOfSurface),
			"Terrain Elevation": formatFeetAsFeetAndInchesAndMeters(graphic.attributes.terrainElevation)
		};
		if (graphic.attributes.penetratesSurface) {
			data["Exceeds <abbr title='Federal Aviation Regulations'>FAR</abbr> Surface by"] = formatFeetAsFeetAndInchesAndMeters(graphic.attributes.distanceFromSurface);
		}

		var dt, dd;
		for (var propName in data) {
			if (data.hasOwnProperty(propName)) {
				dt = document.createElement("dt");
				dt.innerHTML = propName;
				list.appendChild(dt);
				dd = document.createElement("dd");
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
	function ArcGisUI(imageServiceUrl) {
		UI.call(this, imageServiceUrl); // call super constructor
		this._map = null;
		this._draw = null;
		var resultLayer = null;
		var markerGraphic = null;

		var markerLayer;

		function updateMapMarker(dmsCoordinates) {
			var point;
			if (dmsCoordinates) {
				point = dmsCoordinates instanceof Point ? dmsCoordinates : new Point({
					x: dmsCoordinates.longitude.dd,
					y: dmsCoordinates.latitude.dd,
					spatialReference: {
						wkid: 4326
					}
				});
				if (!markerGraphic) {
					markerGraphic = new Graphic(point, mapMarkerSymbol);
					markerLayer.add(markerGraphic);
				} else {
					markerGraphic.setGeometry(point);
				}
				markerLayer.refresh();
			} else {
				// Remove existing marker
				if (markerGraphic) {
					markerLayer.remove(markerGraphic);
					markerLayer.refresh();
					markerGraphic = null;
				}
			}
		}


		Object.defineProperties(this, {
			map: {
				get: function () {
					return this._map;
				},
				set: function (value) {
					var self = this;
					this._map = value;
					this._draw = new Draw(this._map);
					markerLayer = this._map.graphics;


					this._draw.on("draw-complete", function (drawResponse) {
						drawResponse.target.deactivate();
						self.form.x.value = drawResponse.geographicGeometry.x;
						self.form.y.value = drawResponse.geographicGeometry.y;
						updateMapMarker(drawResponse.geographicGeometry);

						var evt = new CustomEvent("draw-complete", {
							detail: drawResponse
						});
						self.form.dispatchEvent(evt);
					});

					this.form.addEventListener("add-from-map", function () {
						self._draw.activate(Draw.POINT);
					});

					this.form.addEventListener("calculation-complete", function (e) {
						var acResult = e.detail;
						var graphic = acResultToGraphic(acResult);
						resultLayer.add(graphic);
						updateMapMarker();
					});

					this.form.addEventListener("clear-graphics", function () {
						resultLayer.clear();
					});

					this.form.addEventListener("coordinates-update", function (e) {
						var dmsCoordinates = e ? e.detail : null;
						updateMapMarker(dmsCoordinates);
					});

					var renderer = new createRenderer();
					var infoTemplate = new InfoTemplate(formatTitle, formatResults);

					resultLayer = new GraphicsLayer({
						id: "results",
						infoTemplate: infoTemplate
					});
					resultLayer.setRenderer(renderer);

					resultLayer.on("graphic-add", function (e) {
						var graphic = e ? e.graphic || null : null;
						var geometry;
						if (graphic) {
							geometry = graphic.geometry;
							self._map.infoWindow.setFeatures([graphic]);
							self._map.infoWindow.show(geometry);
						}
					});

					this._map.addLayer(resultLayer);
				}
			}
		});
	}

	ArcGisUI.prototype = Object.create(UI.prototype);
	ArcGisUI.constructor = ArcGisUI;

	return ArcGisUI;
});
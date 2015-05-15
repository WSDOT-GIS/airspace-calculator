/*global define*/

/**
 * Airspace Calculator for use with ArcGIS API for JavaScript.
 * @module ArcGisAirspaceCalculator
 */
define([
	"AirspaceCalculator/UI",
	"esri/toolbars/draw",
	"esri/layers/GraphicsLayer",
	"esri/graphic",
	"esri/geometry/Point",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleMarkerSymbol"
], function (UI, Draw, GraphicsLayer, Graphic, Point, SimpleRenderer, SimpleMarkerSymbol) {

	/**
	 * @external Graphic
	 * @see {@link https://developers.arcgis.com/javascript/jsapi/graphic-amd.html|Graphic}
	 */

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
			//surfacePenetration: acResult.surfacePenetration,
			//terrainInfo: acResult.terrainInfo
			agl: 50,
			distanceFromSurface: acResult.surfacePenetration.distanceFromSurface,
			penetrationOfSurface: acResult.surfacePenetration.penetrationOfSurface,
			surfaceElevation: acResult.surfacePenetration.surfaceElevation,
			terrainElevation: acResult.surfacePenetration.terrainElevation
		});

		return graphic;
	}

	/**
	 * Extension of {@link AirspaceCalculator/UI} for ArcGIS API.
	 * @constructor
	 * @augments AirspaceCalculator/UI
	 */
	function ArcGisAirspaceCalculator(imageServiceUrl) {
		UI.call(this, imageServiceUrl); // call super constructor
		this._map = null;
		this._draw = null;
		var resultLayer = null;


		Object.defineProperties(this, {
			map: {
				get: function () {
					return this._map;
				},
				set: function (value) {
					var self = this;
					this._map = value;
					this._draw = new Draw(this._map);

					this._draw.on("draw-complete", function (drawResponse) {
						drawResponse.target.deactivate();
						self.form.x.value = drawResponse.geographicGeometry.x;
						self.form.y.value = drawResponse.geographicGeometry.y;
					});

					this.form.addEventListener("add-from-map", function () {
						self._draw.activate(Draw.POINT);
					});

					this.form.addEventListener("calculation-complete", function (e) {
						var acResult = e.detail;
						var graphic = acResultToGraphic(acResult);
						resultLayer.add(graphic);
						console.log("acResult", graphic);
					});

					var symbol = new SimpleMarkerSymbol();
					symbol.setColor("red");
					var renderer = new SimpleRenderer(symbol);

					resultLayer = new GraphicsLayer({
						id: "results",
					});
					resultLayer.setRenderer(renderer);

					this._map.addLayer(resultLayer);
				}
			}
		});
	}

	ArcGisAirspaceCalculator.prototype = Object.create(UI.prototype);
	ArcGisAirspaceCalculator.constructor = ArcGisAirspaceCalculator;

	return ArcGisAirspaceCalculator;
});
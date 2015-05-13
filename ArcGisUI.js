/*global define*/

/**
 * Airspace Calculator for use with ArcGIS API for JavaScript.
 * @module ArcGisAirspaceCalculator
 */
define([
	"AirspaceCalculator/UI",
	"esri/toolbars/draw"
], function (UI, Draw) {

	/**
	 * Extension of UI for ArcGIS API.
	 * @constructor
	 * @augments UI
	 */
	function ArcGisAirspaceCalculator(imageServiceUrl) {
		UI.call(this, imageServiceUrl); // call super constructor
		this._map = null;
		this._draw = null;


		Object.defineProperty(this, "map", {
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
			}
		});
	}

	ArcGisAirspaceCalculator.prototype = Object.create(UI.prototype);
	ArcGisAirspaceCalculator.constructor = ArcGisAirspaceCalculator;

	return ArcGisAirspaceCalculator;
});
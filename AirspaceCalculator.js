/*global define, module, require*/

/**
 * Calculates surface penetrations
 * @module AirspaceCalculator
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(["./SurfacePenetrationInfo", "usgsNed"], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		fetch = require("node-fetch");
		module.exports = factory(require("./SurfacePenetrationInfo"), require("usgs-ned"));
	} else {
		// Browser globals (root is window)
		root.AirspaceCalculator = factory(root.SurfacePenetrationInfo, root.usgsNed);
	}
} (this, function (SurfacePenetrationInfo, usgsNed) {
	/**
	 * @typedef NedElevationInfo
	 * @property {number} x
	 * @property {number} y
	 * @property {string} Data_Source
	 * @property {number} Elevation
	 * @property {string} Units - 'Feet' or 'Meters'
	 */

	/**
	 * @external ArcGisPoint
	 * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/02r3/02r3000000n1000000.htm#POINT|Point}
	 */

	/**
	 * Converts WGS 84 coordinate pair into ArcGIS format point object.
	 * @returns {ArcGisPoint}
	 */
	function createEsriGeometry(/**{number}*/ x, /**{number*/ y) {
		return {
			x: x,
			y: y,
			spatialReference: {
				wkid: 4326
			}
		};
	}

	/**
	 * Converts an object into a query string
	 * @returns {string}
	 */
	function objectToQueryString(/**{Object}*/ o) {
		var output = [], v;
		for (var name in o) {
			if (o.hasOwnProperty(name)) {
				v = o[name];
				if (typeof v === "object") {
					v = JSON.stringify(v);
				}
				output.push([name, v].map(encodeURIComponent).join("="));
			}
		}
		return output.join("&");
	}

	/**
	 * Executes an identify operation on an image service.
	 * @returns {Promise}
	 */
	function identify(x, y, imageServerUrl) {
		var params = {
			geometry: createEsriGeometry(x, y),
			returnGeometry: false,
			geometryType: "esriGeometryPoint",
			f: "json"
		};

		// Add the identify operation to the URL if not present.
		if (!/\/identify\/?$/.test(imageServerUrl)) {
			imageServerUrl = imageServerUrl.replace(/\/?$/, "/identify");
		}

		// Add the query string URL.
		imageServerUrl = [imageServerUrl, objectToQueryString(params)].join("?");

		return fetch(imageServerUrl).then(function (response) {
			return response.json();
		}).then(function (json) {
			var pixelValue = json.value;
			var n = Number(pixelValue);
			// Return the number, or pixel value if not a number.
			return isNaN(n) ? pixelValue : n;
		});
	}

	/**
	 * @typedef {Object} AirspaceCalculatorResult
	 * @property {SurfacePenetrationInfo} surfacePenetration
	 * @property {NedElevationInfo} terrainInfo
	 * @property {number[]} xy - An array containing two number elements: X and Y values.
	 */

	/**
	 * Performs calculation
	 * @param {number} x
	 * @param {number} y
	 * @param {number} agl - Height above ground level (AGL) in feet.
	 * @param {string} imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
	 * @returns {Promise<AirspaceCalculatorResult>}
	 */
	var calculateSurfacePenetration = function (x, y, agl, imageServiceUrl) {

		var elevationPromise = usgsNed.default(x, y);
		var identifyPromise = identify(x, y, imageServiceUrl);

		return new Promise(function (resolve, reject) {
			Promise.all([elevationPromise, identifyPromise]).then(function (/**{Promise[]}*/ promises) {
				var terrainResponse, surfaceElevation;
				terrainResponse = promises[0];
				surfaceElevation = typeof promises[1] === "number" ? promises[1] : null;
				var spInfo = new SurfacePenetrationInfo(agl, surfaceElevation, terrainResponse.Elevation);
				resolve({
					surfacePenetration: spInfo,
					terrainInfo: terrainResponse,
					xy: [x, y]
				});
			}, function (error) {
				reject(error);
			});
		});
	};

	/**
	 * Calculates surface penetrations
	 * @constructor
	 * @alias module:AirspaceCalculator
	 */
	function AirspaceCalculator(imageServiceUrl) {
		if (!imageServiceUrl) {
			throw new TypeError("imageServiceUrl not provided");
		}

		Object.defineProperties(this, {
			imageServiceUrl: {
				value: imageServiceUrl
			}
		});
	}

	/**
	 * Performs calculation
	 * @param {number} x
	 * @param {number} y
	 * @param {number} agl - Height above ground level (AGL) in feet.
	 * @returns {Promise<AirspaceCalculatorResult>}
	 */
	AirspaceCalculator.prototype.calculate = function (x, y, agl) {
		return calculateSurfacePenetration(x, y, agl, this.imageServiceUrl);
	};

	/**
	 * Performs calculation
	 * @param {number} x
	 * @param {number} y
	 * @param {number} agl - Height above ground level (AGL) in feet.
	 * @param {string} imageServiceUrl - E.g., http://example.com/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer
	 * @returns {Promise<AirspaceCalculatorResult>}
	 */
	AirspaceCalculator.calculateSurfacePenetration = calculateSurfacePenetration;

	return AirspaceCalculator;
}));
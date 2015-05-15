/*global define, module*/

/**
 * Calculates surface penetrations
 * @module AirspaceCalculator
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.AirspaceCalculator = factory();
	}
}(this, function () {
	/**
	 * @typedef NedElevationInfo
	 * @property {number} x
	 * @property {number} y
	 * @property {string} Data_Source
	 * @property {number} Elevation
	 * @property {string} Units - 'Feet' or 'Meters'
	 */


	/**
	 * Creates a request to the USGS NED point service
	 * @param {number} x
	 * @param {number} y
	 * @param {string} [units='Feet']
	 * @returns {Promise<NedElevationInfo>}
	 */
	function getElevation(x, y, units) {
		return new Promise(function (resolve, reject) {
			var baseUrl = "http://ned.usgs.gov/epqs/pqs.php";
			var params = {
				x: x,
				y: y,
				units: units || "Feet",
				output: "json"
			};
			var request = new XMLHttpRequest();
			request.open("get", [baseUrl, objectToQueryString(params)].join("?"));
			request.onloadend = function () {
				/*
				{
					"USGS_Elevation_Point_Query_Service": {
						"Elevation_Query": {
							"x": -123,
							"y": 45,
							"Data_Source": "NED 1/3 arc-second",
							"Elevation": 177.965854,
							"Units": "Feet"
						}
					}
				}
				 */
				var response = JSON.parse(this.responseText);
				resolve(response.USGS_Elevation_Point_Query_Service.Elevation_Query);
			};
			request.onerror = function (e) {
				reject(e);
			};
			request.send();
		});
	}

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

		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();
			request.open("get", imageServerUrl);
			request.onloadend = function () {
				var response = JSON.parse(this.responseText);
				var pixelValue = response.value;
				var number = Number(pixelValue);
				// Return the number, or pixel value if not a number.
				resolve(isNaN(number) ? pixelValue : number);
			};
			request.onerror = function (e) {
				reject(e);
			};
			request.send();
		});

	}

	/**
	 * Provides information about surface penetration.
	 * @param {number} agl
	 * @param {number} surfaceElevation
	 * @param {number} terrainElevation
	 */
	function SurfacePenetrationInfo(agl, surfaceElevation, terrainElevation) {
		if (typeof surfaceElevation === "string") {
			if (surfaceElevation === "NoData") {
				throw new Error("Surface elevation has no data.");
			} else {
				surfaceElevation = parseFloat(surfaceElevation);
			}
		}

		Object.defineProperties(this, {
			/** @member {number} */
			agl: {
				value: agl
			},
			/** @member {?number} */
			surfaceElevation: {
				value: surfaceElevation
			},
			/** @member {number} */
			terrainElevation: {
				value: terrainElevation
			},
			/*jshint eqnull:true*/
			/** @member {number} */
			distanceFromSurface: {
				get: function () {
					return surfaceElevation != null ? this.surfaceElevation - this.terrainElevation : null;
				}
			},
			/** @member {number} */
			penetrationOfSurface: {
				get: function () {
					return surfaceElevation != null ? this.agl - this.distanceFromSurface : null;
				}
			},
			/** @member {Boolean} */
			penetratesSurface: {
				get: function () {
					return this.penetrationOfSurface != null && this.penetrationOfSurface > 0;
				}
			}
			/*jshint eqnull:false*/
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

		var elevationPromise = getElevation(x, y);
		var identifyPromise = identify(x, y, imageServiceUrl);

		return new Promise(function (resolve, reject) {
			Promise.all([elevationPromise, identifyPromise]).then(function (/**{Promise[]}*/ promises) {
				var terrainResponse, surfaceElevation;
				terrainResponse = promises[0];
				surfaceElevation = typeof promises[1] === "number" ? promises[1]: null;
				var spInfo = new SurfacePenetrationInfo(agl, surfaceElevation, terrainResponse.Elevation);
				resolve({
					surfacePenetration: spInfo,
					terrainInfo: terrainResponse,
					xy: [x,y]
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
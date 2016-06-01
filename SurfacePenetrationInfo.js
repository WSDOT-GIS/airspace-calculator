/*global define, module, require*/

/**
 * SurfacePenetrationInfo
 * @module SurfacePenetrationInfo
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
		root.SurfacePenetrationInfo = factory();
	}
}(this, function () {
	/**
	 * Provides information about surface penetration.
	 * @param {number} agl
	 * @param {number} surfaceElevation
	 * @param {number} terrainElevation
	 * @alias module:SurfacePenetrationInfo
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
	
	return SurfacePenetrationInfo;
}));
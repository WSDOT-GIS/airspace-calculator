/**
 * Provides information about surface penetration.
 * @param {number} agl
 * @param {number} surfaceElevation
 * @param {number} terrainElevation
 * @alias module:SurfacePenetrationInfo
 */
declare class SurfacePenetrationInfo {
	constructor(agl:number, surfaceElevation:number, terrainElevation:number);

	/** @member {number} */
	agl: number;
	/** @member {?number} */
	surfaceElevation: number
	/** @member {number} */
	terrainElevation: number;
	/*jshint eqnull:true*/
	/** @member {number} */
	distanceFromSurface: {
		get(): number;
	}
	/** @member {number} */
	penetrationOfSurface: {
		get(): number;
	};
	/** @member {Boolean} */
	penetratesSurface: {
		get(): boolean;
	}
	/*jshint eqnull:false*/

}

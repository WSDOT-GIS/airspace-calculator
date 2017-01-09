/**
 * SurfacePenetrationInfo module
 */
/**
 * Provides information about surface penetration.
 */
export default class SurfacePenetrationInfo {
    private _agl;
    private _surfaceElevation;
    private _terrainElevation;
    constructor(agl: number, surfaceElevation: number | string | null, terrainElevation: number);
    readonly agl: number;
    readonly surfaceElevation: number | null;
    readonly terrainElevation: number;
    readonly distanceFromSurface: number | null;
    readonly penetrationOfSurface: number | null;
    readonly penetratesSurface: boolean;
}

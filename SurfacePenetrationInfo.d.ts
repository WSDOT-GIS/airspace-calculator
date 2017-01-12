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
    /**
     * Creates a new instance of this class
     * @param agl - Height about ground level in feet
     * @param surfaceElevation - Surface elevation
     * @param terrainElevation - Terrain elevation
     */
    constructor(agl: number, surfaceElevation: number | string | null, terrainElevation: number);
    /**
     * Height about ground level in feet.
     */
    readonly agl: number;
    /**
     * Elevation of the surface
     */
    readonly surfaceElevation: number | null;
    /**
     * Elevation of the terrain.
     */
    readonly terrainElevation: number;
    /**
     * Distance from the surface
     */
    readonly distanceFromSurface: number | null;
    /**
     * Penetration of surface
     */
    readonly penetrationOfSurface: number | null;
    /**
     * Indicates if a structure of the given height would penetrate the surface
     */
    readonly penetratesSurface: boolean;
}

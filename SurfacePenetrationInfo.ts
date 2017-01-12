/**
 * SurfacePenetrationInfo module
 */

/**
 * Provides information about surface penetration.
 */
export default class SurfacePenetrationInfo {
    private _agl: number;
    private _surfaceElevation: number | null;
    private _terrainElevation: number;

    /**
     * Creates a new instance of this class
     * @param agl - Height about ground level in feet
     * @param surfaceElevation - Surface elevation
     * @param terrainElevation - Terrain elevation
     */
    constructor(agl: number, surfaceElevation: number | string | null, terrainElevation: number) {
        if (typeof surfaceElevation === "string") {
            if (surfaceElevation === "NoData") {
                throw new Error("Surface elevation has no data.");
            } else {
                this._surfaceElevation = parseFloat(surfaceElevation);
            }
        } else if (typeof surfaceElevation === "number") {
            this._surfaceElevation = surfaceElevation;
        } else {
            this._surfaceElevation = null;
        }
        this._agl = agl;
        this._terrainElevation = terrainElevation;
    }

    /**
     * Height about ground level in feet.
     */
    public get agl() {
        return this._agl;
    }

    /**
     * Elevation of the surface
     */
    public get surfaceElevation() {
        return this._surfaceElevation;
    }

    /**
     * Elevation of the terrain.
     */
    public get terrainElevation() {
        return this._terrainElevation;
    }

    /**
     * Distance from the surface
     */
    public get distanceFromSurface(): number | null {
        return this.surfaceElevation != null ? this.surfaceElevation - this.terrainElevation : null;
    }

    /**
     * Penetration of surface
     */
    public get penetrationOfSurface(): number | null {
        return this.surfaceElevation != null ? this.agl - this.distanceFromSurface : null;
    }

    /**
     * Indicates if a structure of the given height would penetrate the surface
     */
    public get penetratesSurface(): boolean {
        return this.penetrationOfSurface != null && this.penetrationOfSurface > 0;
    }

}
/**
 * Provides information about surface penetration.
 */
export class SurfacePenetrationInfo {
    private readonly _surfaceElevation: number | null;

    /**
     * Creates a new instance of this class
     * @param agl - Height about ground level in feet
     * @param surfaceElevation - Elevation of the surface
     * @param terrainElevation - Elevation of the terrain
     */
    constructor(public readonly agl: number, surfaceElevation: number | string | null, public readonly terrainElevation: number) {
        if (typeof surfaceElevation === "string") {
            if (surfaceElevation === "NoData") {
                throw new TypeError("Surface elevation has no data.");
            } else {
                surfaceElevation = parseFloat(surfaceElevation);
                if (isNaN(surfaceElevation)) {
                    throw new TypeError(`Input string is not a number: ${surfaceElevation}`);
                }
                this._surfaceElevation = surfaceElevation;
            }
        } else if (typeof surfaceElevation === "number") {
            this._surfaceElevation = surfaceElevation;
        } else {
            this._surfaceElevation = null;
        }
    }

    /**
     * Elevation of the surface
     */
    public get surfaceElevation() {
        return this._surfaceElevation;
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
        return this.surfaceElevation != null ? this.agl - (this.distanceFromSurface || 0) : null;
    }

    /**
     * Indicates if a structure of the given height would penetrate the surface
     */
    public get penetratesSurface(): boolean {
        return this.penetrationOfSurface != null && this.penetrationOfSurface > 0;
    }

}

export default SurfacePenetrationInfo;

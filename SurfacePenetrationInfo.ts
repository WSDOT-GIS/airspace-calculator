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

    public get agl() {
        return this._agl;
    }


    public get surfaceElevation() {
        return this._surfaceElevation;
    }

    public get terrainElevation() {
        return this._terrainElevation;
    }


    public get distanceFromSurface(): number | null {
        return this.surfaceElevation != null ? this.surfaceElevation - this.terrainElevation : null;
    }


    public get penetrationOfSurface(): number | null {
        return this.surfaceElevation != null ? this.agl - this.distanceFromSurface : null;
    }


    public get penetratesSurface(): boolean {
        return this.penetrationOfSurface != null && this.penetrationOfSurface > 0;
    }

}
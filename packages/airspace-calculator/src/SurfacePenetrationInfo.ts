import { createSurfacePenetrationMessage } from "./formatting";

/**
 * Determines if a penetration of surface value value
 * is non-null and greater than zero.
 * @param penetrationOfSurface
 * @returns - The result of {@link penetrationOfSurface} `!= null &&` {@link penetrationOfSurface} `> 0`
 */
export function penetratesSurface(
  penetrationOfSurface?: ReturnType<typeof getPenetrationOfSurface>
): boolean {
  return penetrationOfSurface != null && penetrationOfSurface > 0;
}

/**
 * Gets the distance from the surface.
 * @param surfaceElevation
 * @param terrainElevation
 * @returns Distance from the surface: {@link surfaceElevation} - {@link terrainElevation}
 */
export function getDistanceFromSurface(
  surfaceElevation: number,
  terrainElevation: number
) {
  return surfaceElevation != null ? surfaceElevation - terrainElevation : null;
}

/**
 * Gets the penetration of surface.
 * @param surfaceElevation
 * @param agl
 * @param distanceFromSurface
 * @returns
 */
export function getPenetrationOfSurface(
  surfaceElevation: number,
  agl: number,
  distanceFromSurface: ReturnType<typeof getDistanceFromSurface>
) {
  return surfaceElevation != null ? agl - (distanceFromSurface || 0) : null;
}

/**
 * Parses a surface elevation value into a number.
 * @param surfaceElevation
 * @returns - {@link surfaceElevation} as a number.
 */
export function parseSurfaceElevation(
  surfaceElevation: number | string | null
) {
  if (surfaceElevation === null) {
    return null;
  }
  if (typeof surfaceElevation === "number") {
    if (isNaN(surfaceElevation)) {
      throw new TypeError("Input surface elevation cannot NaN.");
    }
    return surfaceElevation;
  }

  if (surfaceElevation === "NoData") {
    throw new TypeError("Surface elevation has no data.");
  } else {
    const parsedSurfaceElevation = parseFloat(surfaceElevation);
    if (isNaN(parsedSurfaceElevation)) {
      throw new TypeError(`Input string is not a number: ${surfaceElevation}`);
    }
    return parsedSurfaceElevation;
  }
}

/**
 * Provides information about surface penetration.
 */
export class SurfacePenetrationInfo extends Object {
  private readonly _surfaceElevation: number | null;

  /**
   * Creates a new instance of this class
   * @param agl - Height about ground level in feet
   * @param surfaceElevation - Elevation of the surface
   * @param terrainElevation - Elevation of the terrain
   */
  constructor(
    public readonly agl: number,
    surfaceElevation: number | string | null,
    public readonly terrainElevation: number
  ) {
    super();
    this._surfaceElevation = parseSurfaceElevation(surfaceElevation);
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
    if (this.surfaceElevation === null) {
      return null;
    }
    return getDistanceFromSurface(this.surfaceElevation, this.terrainElevation);
  }

  /**
   * Penetration of surface
   */
  public get penetrationOfSurface(): number | null {
    if (this.surfaceElevation == null || this.distanceFromSurface == null) {
      return null;
    }
    return getPenetrationOfSurface(
      this.surfaceElevation,
      this.agl,
      this.distanceFromSurface
    );
  }

  /**
   * Indicates if a structure of the given height would penetrate the surface
   */
  public get penetratesSurface(): boolean {
    return penetratesSurface(this.penetrationOfSurface);
  }

  /**
   * @inheritdoc
   */
  override toString() {
    return createSurfacePenetrationMessage(this);
  }
}

export default SurfacePenetrationInfo;

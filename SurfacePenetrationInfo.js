/**
 * SurfacePenetrationInfo module
 */
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Provides information about surface penetration.
     */
    var SurfacePenetrationInfo = (function () {
        function SurfacePenetrationInfo(agl, surfaceElevation, terrainElevation) {
            if (typeof surfaceElevation === "string") {
                if (surfaceElevation === "NoData") {
                    throw new Error("Surface elevation has no data.");
                }
                else {
                    this._surfaceElevation = parseFloat(surfaceElevation);
                }
            }
            else if (typeof surfaceElevation === "number") {
                this._surfaceElevation = surfaceElevation;
            }
            else {
                this._surfaceElevation = null;
            }
            this._agl = agl;
            this._terrainElevation = terrainElevation;
        }
        Object.defineProperty(SurfacePenetrationInfo.prototype, "agl", {
            get: function () {
                return this._agl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurfacePenetrationInfo.prototype, "surfaceElevation", {
            get: function () {
                return this._surfaceElevation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurfacePenetrationInfo.prototype, "terrainElevation", {
            get: function () {
                return this._terrainElevation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurfacePenetrationInfo.prototype, "distanceFromSurface", {
            get: function () {
                return this.surfaceElevation != null ? this.surfaceElevation - this.terrainElevation : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurfacePenetrationInfo.prototype, "penetrationOfSurface", {
            get: function () {
                return this.surfaceElevation != null ? this.agl - this.distanceFromSurface : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurfacePenetrationInfo.prototype, "penetratesSurface", {
            get: function () {
                return this.penetrationOfSurface != null && this.penetrationOfSurface > 0;
            },
            enumerable: true,
            configurable: true
        });
        return SurfacePenetrationInfo;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SurfacePenetrationInfo;
});
//# sourceMappingURL=SurfacePenetrationInfo.js.map
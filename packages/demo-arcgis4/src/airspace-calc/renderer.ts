import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import {
  AirspaceCalculatorResult,
  formatAsFeetAndInches,
  SurfacePenetrationInfo,
} from "airspace-calculator";



const defaultSymbol = new SimpleMarkerSymbol({
  style: "circle",
  color: "green",
  outline: {
    color: "white",
  },
});

/**
 * Creates a symbol for the input {@link SurfacePenetrationInfo}.
 * @param acResult
 * @returns
 */
export function createSymbol(
  acResult:
    | Pick<AirspaceCalculatorResult, "surfacePenetration">
    | SurfacePenetrationInfo
) {
  const surfacePenetration =
    acResult instanceof SurfacePenetrationInfo
      ? acResult
      : acResult.surfacePenetration;
  if (
    !surfacePenetration.penetratesSurface ||
    surfacePenetration.penetrationOfSurface == null
  ) {
    return defaultSymbol;
  }
  const symbol = new TextSymbol({
    text: formatAsFeetAndInches(surfacePenetration.penetrationOfSurface),
    color: "red",
    borderLineColor: "white",
    borderLineSize: 1,
  });
  return symbol;
}

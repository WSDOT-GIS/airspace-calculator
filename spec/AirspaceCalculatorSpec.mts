import assert from "node:assert/strict";
import { calculateSurfacePenetration } from "../AirspaceCalculator";

const url =
  "https://data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirspaceCalculatorSurface/ImageServer";
const x = -122.9033660888309;
const y = 46.972736571798244;
const agl = 100;
const acResult = await calculateSurfacePenetration(x, y, agl, url);

assert.ok(acResult.surfacePenetration);
assert.ok(acResult.terrainInfo);
const xy = acResult.xy;
assert.strictEqual(2, xy.length, "The xy property should have two elements");
for (const n of xy) {
    assert.equal("number", typeof n);
    assert.equal(false, isNaN(n));
}

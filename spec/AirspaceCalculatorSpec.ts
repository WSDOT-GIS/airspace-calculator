/// <reference types="jasmine" />

import AirspaceCalculator from "../AirspaceCalculator";

describe("Airspace Calculator", () => {

    it("should be able to calculate", async (done) => {
        // tslint:disable-next-line:max-line-length
        const ac = new AirspaceCalculator("https://data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirspaceCalculatorSurface/ImageServer");
        const x = -122.9033660888309;
        const y = 46.972736571798244;
        const agl = 100;
        try {
            const acResult = await ac.calculate(x, y, agl);
            expect(acResult.surfacePenetration).toBeTruthy();
            expect(acResult.terrainInfo).toBeTruthy();
            const xy = acResult.xy;
            expect(acResult.xy.length).toEqual(2, "The xy property should have two elements");
            expect(typeof xy[0] === "number" && typeof xy[1] === "number");
            expect(isNaN(xy[0])).toEqual(false);
            expect(isNaN(xy[1])).toEqual(false);
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

describe("Airspace Calculator", () => {
    let AirspaceCalculator = require("../AirspaceCalculator");

    it("should be able to calculate", (done) => {
        let ac = new AirspaceCalculator("http://data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirspaceCalculatorSurface/ImageServer");
        let x = -122.9033660888309;
        let y = 46.972736571798244;
        let agl = 100;
        let promise = ac.calculate(x, y, agl);
        promise.then(acResult => {
            expect(acResult.surfacePenetration).toBeTruthy();
            expect(acResult.terrainInfo).toBeTruthy();
            let xy = acResult.xy;
            expect(acResult.xy.length).toEqual(2, "The xy property should have two elements");
            expect(typeof xy[0] === "number" && typeof xy[1] === "number");
            expect(isNaN(xy[0])).toEqual(false);
            expect(isNaN(xy[1])).toEqual(false);
            done();
        }, error => {
            done.fail(error);
        });
    });
});
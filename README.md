Airspace Calculator
===================

[![Build Status](https://travis-ci.org/WSDOT-GIS/airspace-calculator.svg?branch=master)](https://travis-ci.org/WSDOT-GIS/airspace-calculator)

A module that will calculate surface penetration using the [USGS NED Point Query Service] and an ArcGIS [Image service].

Demo
----

[You can see the library in action with this single-page application (SPA) web map.](https://wsdot-gis.github.io/airspace-calculator/demo/) This application is built with the [ArcGIS API for JavaScript] (the older version, [3.X](https://developers.arcgis.com/javascript/3/)).

Setup
-----

### Image Service ###

You will need an image service in order to use this library. Instructions for setting up an image service can be found [here](https://enterprise.arcgis.com/en/server/latest/publish-services/windows/key-concepts-for-image-services.htm).

### Installing the library via NPM ###

The airspace calculator is hosted on NPM and can be installed as follows:

```console
$ npm install -S airspace-calculator
```

Use
---

Below is an example written in TypeScript which shows how to perform a calculation.

```TypeScript
import AirspaceCalculator from "airspace-calculator";

const ac = new AirspaceCalculator("https://example.com/arcgis/rest/services/AirportMapApplication/AirspaceCalculatorSurface/ImageServer");
const x = -122.9033660888309;
const y = 46.972736571798244;
const agl = 100;
try {
    const acResult = await ac.calculate(x, y, agl);
    const [outX, outY] = acResult.xy;
    const msg = `An elevation of ${acResult.agl} will penetrate the surface at ${acResult.surfacePenetration}. Coords: [${outX}, ${outY}]`;
} catch (error) {
    console.error(error);
}
```

For maintainers
---------------

Installing dependencies. After the dependencies are installed, the *prepare* step will run.

```console
$ npm install
```

Build

```console
$ npm run prepare
```

### Testing ###

Unit tests are written using [Jasmine]. You can run the unit tests with the following command.

```console
$ npm test
```
[ArcGIS API for JavaScript]:https://developers.arcgis.com/javascript/
[Image Service]:https://resources.arcgis.com/en/help/arcgis-rest-api/#/Image_Service/02r3000000q8000000/
[Jasmine]:https://jasmine.github.io/
[NPM]:https://www.npmjs.com/
[USGS NED Point Query Service]:https://ned.usgs.gov/epqs/

/*global require*/
require(["esri/map", "airspace-calculator"], function (Map, AirspaceCalculator) {
	var map;

	map = new Map("map", {
		basemap: "hybrid",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 7,
		showAttribution: true
	});

	var airspaceCalculator = new AirspaceCalculator();
	document.getElementById("tools").appendChild(airspaceCalculator.form);
});
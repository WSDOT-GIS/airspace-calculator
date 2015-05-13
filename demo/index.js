/*global require*/
require([
	"esri/map",
	"esri/layers/ArcGISImageServiceLayer",
	"AirspaceCalculator/ArcGisUI"
], function (Map, ArcGISImageServiceLayer, ArcGisUI) {
	var map, imageServiceUrl;

	imageServiceUrl = "http://hqolymgis99t/arcgis/rest/services/Airport/Airport_Surfaces_40ft_Int/ImageServer";

	map = new Map("map", {
		basemap: "streets",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 7,
		showAttribution: true
	});

	var ui = new ArcGisUI(imageServiceUrl);

	ui.form.addEventListener("calculation-complete", function (results) {
		console.log("calculation-complete", results);
	});

	ui.form.addEventListener("calculation-error", function (error) {
		console.error("calculation-error", error);
	});

	document.getElementById("tools").appendChild(ui.form);

	map.on("load", function () {
		ui.map = map;

		map.addLayer(new ArcGISImageServiceLayer(imageServiceUrl, {
			id: "surfaces",
			opacity: 0.5
		}));
	});
});
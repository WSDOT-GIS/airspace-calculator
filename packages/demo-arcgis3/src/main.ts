import HomeButton from "esri/dijit/HomeButton";
import Extent from "esri/geometry/Extent";
import EsriMap from "esri/map";

import ArcGISImageServiceLayer from "esri/layers/ArcGISImageServiceLayer";
import ArcGisUI from "airspace-calculator-ui-arcgis3";

/**
 * Extent of WA.
 * @see https://epsg.io/1416-area
 */
const extent = new Extent({
  xmin: -124.79,
  ymin: 45.54,
  xmax: -116.91,
  ymax: 49.05,
});

const mapDiv = document.getElementById("map");

if (!mapDiv) {
  throw new TypeError("mapDiv should be truthy");
}

const map = new EsriMap(mapDiv, {
  extent,
  basemap: "topo-vector",
});

// Create home button
const mapRoot = document.querySelector("#map_root");
if (mapRoot) {
  const homeDiv = document.createElement("div");
  mapRoot.appendChild(homeDiv);

  new HomeButton(
    {
      map,
      extent,
    },
    homeDiv
  );
}

  // Define the image service URL with airport surfaces.
  const imageServiceUrl = "//data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirspaceCalculatorSurface/ImageServer";
  // // Create the map.
  // var map = new Map("map", {
  //     basemap: "streets",
  //     center: [-120.80566406246835, 47.41322033015946],
  //     zoom: 7,
  //     showAttribution: true
  // });
  // Create the ArcGIS Airspace Calculator UI.
  const ui = new ArcGisUI(imageServiceUrl);
  ui.zoomLevel = 11;
  ui.form.addEventListener("calculation-error", function (e) {
      console.error("calculation error", e);
  });
  // Insert the UI's <form> into the "tools" div as the first element.
  const toolsDiv = document.getElementById("tools");
  if (toolsDiv) {
  toolsDiv.insertBefore(ui.form, toolsDiv.firstChild);
  // Once the map has loaded...
  map.on("load", function () {
      // Assign the AirspaceCalculator/ArcGisUI's map property.
      ui.map = map;
      ui.form.addEventListener("draw-complete", function () {
          map.setInfoWindowOnClick(true);
      });
      ui.form.addEventListener("add-from-map", function () {
          map.setInfoWindowOnClick(false);
      });
      // You can add the image service to the map, but it's not necessary for the airspace calculator to function.
      map.addLayer(new ArcGISImageServiceLayer(imageServiceUrl, {
          id: "surfaces",
          opacity: 0.5
      }));
  });
}
import { BasemapLayerOptions } from "esri";
import Basemap from "esri/dijit/Basemap";
import BasemapLayer from "esri/dijit/BasemapLayer";

const basemapLayers = new Array<BasemapLayerOptions>(
  {
    url:
      "https://data.wsdot.wa.gov/arcgis/rest/services/Shared/WebBaseMapWebMercator/MapServer",
    displayLevels: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    url:
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    displayLevels: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  },
  {
    url:
      "https://data.wsdot.wa.gov/arcgis/rest/services/Traffic/LocalRoads/MapServer"
  }
).map(l => new BasemapLayer(l));

const [, , localRoadsLayer] = basemapLayers;

const multilevelBasemap = new Basemap({
  id: "multilevel",
  title: "Multilevel",
  thumbnailUrl: "images/MultilevelThumbnail.png",
  layers: basemapLayers
});

const localRoadsOnlyBasemap = new Basemap({
  id: "local-roads-only",
  title: "Local Roads Only",
  layers: [localRoadsLayer]
});

export { multilevelBasemap, localRoadsOnlyBasemap };

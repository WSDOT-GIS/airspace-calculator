import BasemapGallery from "esri/dijit/BasemapGallery";
import HomeButton from "esri/dijit/HomeButton";
import Extent from "esri/geometry/Extent";
import LOD = require("esri/layers/LOD");
import EsriMap from "esri/map";
import { createMapProgress } from "./MapProgress";
import { localRoadsOnlyBasemap, multilevelBasemap } from "./MultilevelBasemap";

/**
 * Extent of WA.
 * @see https://epsg.io/1416-area
 */
const extent = new Extent({
  xmin: -124.79,
  ymin: 45.54,
  xmax: -116.91,
  ymax: 49.05
});

const lods = [
  { level: 0, resolution: 1222.99245256249, scale: 4622324.434309 },
  { level: 1, resolution: 611.49622628138, scale: 2311162.217155 },
  { level: 2, resolution: 305.748113140558, scale: 1155581.108577 },
  { level: 3, resolution: 152.874056570411, scale: 577790.554289 },
  { level: 4, resolution: 76.4370282850732, scale: 288895.277144 },
  { level: 5, resolution: 38.2185141425366, scale: 144447.638572 },
  { level: 6, resolution: 19.1092570712683, scale: 72223.819286 },
  { level: 7, resolution: 9.55462853563415, scale: 36111.909643 },
  { level: 8, resolution: 4.77731426794937, scale: 18055.954822 },
  { level: 9, resolution: 2.38865713397468, scale: 9027.977411 },
  { level: 10, resolution: 1.19432856685505, scale: 4513.988705 },
  { level: 11, resolution: 0.597164283559817, scale: 2256.994353 },
  { level: 12, resolution: 0.298582141647617, scale: 1128.497176 }
].map(l => {
  const lod = new LOD();
  lod.level = l.level;
  lod.resolution = l.resolution;
  lod.scale = l.scale;
  return lod;
});

const mapDiv = document.getElementById("map")!;

const map = new EsriMap(mapDiv, {
  extent,
  basemap: "multilevel",
  lods
});

// Create home button
const homeDiv = document.createElement("div");
const mapRoot = document.querySelector("#map_root")!;
mapRoot.appendChild(homeDiv);

createMapProgress(map);

// tslint:disable-next-line:no-unused-expression
new HomeButton(
  {
    map,
    extent
  },
  homeDiv
);

// Create basemap gallery.
const bgDiv = document.createElement("div");
mapRoot.appendChild(bgDiv);
const bmGallery = new BasemapGallery(
  {
    map,
    showArcGISBasemaps: false,
    basemaps: [multilevelBasemap, localRoadsOnlyBasemap]
  },
  bgDiv
);
bmGallery.startup();

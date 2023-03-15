import domUtils from "esri/domUtils";
import EsriMap from "esri/map";

/**
 * Creates a map progress meter that appears when the map is loading data.
 * Progress element is appended to the map's "root" element.
 * @param map An ArcGIS API map object
 * @returns a progress element with the map-progress class applied to it
 * as well as the update start/end handles.
 */
export function createMapProgress(map: EsriMap) {
  const progressElement = document.createElement("progress");
  progressElement.classList.add("map-progress");
  map.root.appendChild(progressElement);

  const updateStartHandle = map.on("update-start", () => {
    domUtils.show(progressElement);
  });

  const updateEndHandle = map.on("update-end", ({ error }) => {
    domUtils.hide(progressElement);
    if (error) {
      // tslint:disable-next-line:no-console
      console.error('map("update-end:) error', error);
    }
  });
  return { progressElement, updateStartHandle, updateEndHandle };
}

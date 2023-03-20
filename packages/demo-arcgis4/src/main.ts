import "./style.css";
import { setupWidgets } from "./widgets";

Promise.all([
  import("@arcgis/core/Map"),
  import("@arcgis/core/views/MapView"),
  import("./LoadingIndicator"),
  import("./WAExtent"),
  import("./layers"),
]).then(
  ([
    { default: EsriMap },
    { default: MapView },
    { setupLoadingIndicator },
    { waExtent },
    { default: layers },
  ]) => {
    const map = new EsriMap({
      basemap: "hybrid",
      layers,
      ground: "world-elevation",
    });

    const view = new MapView({
      container: "viewDiv",
      extent: waExtent,
      map,
    });

    setupLoadingIndicator(view);

    view.when(function () {
      setupWidgets(view);
    });
  }
);

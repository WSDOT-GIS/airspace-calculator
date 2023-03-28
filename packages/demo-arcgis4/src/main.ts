import { setupDisclaimer } from "./dialog";
import "./style.css";

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
      popup: {
        defaultPopupTemplateEnabled: true
      },
      extent: waExtent,
      map,
    });

    setupLoadingIndicator(view);

    view.when(async () => {
      const { setupWidgets } = await import("./widgets");
      setupWidgets(view);
      setupDisclaimer(view.container);
    });
  }
);

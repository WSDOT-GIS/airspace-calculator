import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { airspaceCalculatorResultsLayerTitle } from "./airspace-calc/results-layer";
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
        defaultPopupTemplateEnabled: true,
      },
      extent: waExtent,
      map,
    });

    //  Setup the Airspace Calculator layer to automatically open a features popup after its added to the layer.
    view.on("layerview-create", ({ layer }) => {
      if (
        layer.title === airspaceCalculatorResultsLayerTitle &&
        layer instanceof FeatureLayer
      ) {
        (layer as FeatureLayer).on("edits", async ({ addedFeatures }) => {
          const featureEditResult = addedFeatures.at(0);
          if (featureEditResult) {
            const { objectId } = featureEditResult;
            const featureSet = await layer.queryFeatures({
              objectIds: [objectId],
            });
            view.popup.open({
              features: featureSet.features,
            });
          }
        });
      }
    });

    setupLoadingIndicator(view);

    view.when(async () => {
      const { setupWidgets } = await import("./widgets");
      setupWidgets(view);
      setupDisclaimer(view.container);
    });
  }
);

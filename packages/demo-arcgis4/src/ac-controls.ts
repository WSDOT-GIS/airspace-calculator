import type EsriMap from "@arcgis/core/Map";
import type View from "@arcgis/core/views/View";
import Expand from "@arcgis/core/widgets/Expand";
import type { AirspaceCalculatorResult } from "airspace-calculator";

const defaultImageServiceUrl =
  "https://data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirspaceCalculatorSurface/ImageServer";

export function isAirspaceCalculatorResult(
  e: Event
): e is CustomEvent<AirspaceCalculatorResult> {
  if (!(e instanceof CustomEvent)) {
    return false;
  }
  const { detail } = e;
  const keys = ["surfacePenetration", "terrainInfo", "xy"];
  for (const key of keys) {
    if (!Object.hasOwn(detail, key)) {
      return false;
    }
  }
  return true;
}

async function addImageryLayer(
  map: EsriMap,
  imageryLayerProperties: __esri.ImageryLayerProperties
) {
  const { default: ImageryLayer } = await import(
    "@arcgis/core/layers/ImageryLayer"
  );

  const layer = new ImageryLayer(imageryLayerProperties);
  map.layers.add(layer);
}

export async function setupAirspaceCalculator(
  view: View,
  imageServiceUrl = defaultImageServiceUrl
) {
  // Import modules.
  const uiPromise = import("airspace-calculator-ui").then(
    ({ default: AirspaceCalculatorUI }) => AirspaceCalculatorUI
  );

  const xyToLngLatPromise = import(
    "@arcgis/core/geometry/support/webMercatorUtils"
  ).then(({ xyToLngLat }) => xyToLngLat);

  addImageryLayer(view.map, {
    url: imageServiceUrl,
    title: "Airspace Calculator Surface",
    visible: false,
  });

  // Await the import modules' promises.
  const [AirspaceCalculatorUI, xyToLngLat] = await Promise.all([
    uiPromise,
    xyToLngLatPromise,
  ]);

  const ui = new AirspaceCalculatorUI(imageServiceUrl);
  const { form } = ui;

  function populateXYInputs(event: __esri.ViewClickEvent) {
    console.debug("map clicked", { event });
    const { mapPoint } = event;
    let { x, y } = mapPoint;
    // Project from web mercator to geographic
    [x, y] = xyToLngLat(x, y);
    form.x.value = `${x}`;
    form.y.value = `${y}`;

    // Expand the widget to show the Airspace Calculator form
    // with the coordinates from the map click.
    if (!expand.expanded) {
      expand.expand();
    }
  }

  form.classList.add("esri-widget");
  form.addEventListener("calculation-error", function (e) {
    console.error("calculation error", e);
  });

  function handleCalculationCompletion(e: Event) {
    // If the event is not of the expected type, write the
    // error to the console.
    if (!isAirspaceCalculatorResult(e)) {
      const message = `Was expecting event to be a ${CustomEvent.name}`;
      console.error(message);
      // TODO: Show a popup at the clicked location informing the user that there was a problem.
      return;
    }
    // Get the airspace calculator result from the CustomEvent's detail.
    const { detail: acResult } = e;
    // TODO: Add a graphic with this result as its attributes to a graphics or feature layer.
    // TODO: Open that graphic's popup.
    console.log(acResult.surfacePenetration.toString(), acResult);
  }

  form.addEventListener("calculation-complete", handleCalculationCompletion);
  view.on("click", populateXYInputs);

  const expand = new Expand({
    content: ui.form,
  });

  return expand;
}

import type EsriMap from "@arcgis/core/Map";
import Expand from "@arcgis/core/widgets/Expand";
import type { AirspaceCalculatorResult } from "airspace-calculator";
import {
  addAirspaceCalculatorResult,
  airspaceCalculatorResultsLayerTitle,
} from "./results-layer";
import type { AirspaceCalculatorForm } from "airspace-calculator-ui";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapView from "@arcgis/core/views/MapView";

/**
 * This is the image service URL that is used by default if not overridden.
 */
const defaultImageServiceUrl =
  "https://data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirspaceCalculatorSurface/ImageServer";

/**
 * Determines if an {@link Event} is a {@link CustomEvent<AirspaceCalculatorResult>}
 * @param e - An event
 * @returns Returns a boolean indicating if the input event an {@link AirspaceCalculatorResult} {@link CustomEvent}
 */
export function isAirspaceCalculatorResult(
  e: unknown
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

export function isAirspaceCalulatorErrorEvent(
  e: unknown
): e is CustomEvent<Error> {
  return e instanceof CustomEvent && e.detail instanceof Error;
}

/**
 * Hide and disable the "pick" button, as this app
 * already does this whenever the user clicks on the map.
 */
function customizeButtons(form: AirspaceCalculatorForm) {
  const titles = [
    "Pick coordinates by clicking a location on the map",
    "Clears graphics from the map created by this control",
  ];
  const selector = titles.map((t) => `button[title='${t}']`).join(",");
  let buttons = form.querySelectorAll<HTMLButtonElement>(selector);
  buttons.forEach((button) => {
    button.remove();
  });

  buttons = form.querySelectorAll("button");
  buttons.forEach((b) => {
    b.classList.add("esri-button");
    if (b.type === "submit") {
      b.classList.add("esri-widget-button", "esri-button--primary");
    } else {
      b.classList.add("esri-widget-button", "esri-button--secondary");
    }
  });

  form.querySelectorAll("input,label").forEach((element) => {
    const cssClass = `esri-${element.tagName.toLowerCase()}`;
    element.classList.add(cssClass);
  });
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
  view: MapView,
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

  customizeButtons(form);

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
    const isExpectedErrorType = isAirspaceCalulatorErrorEvent(e);
    const message = isExpectedErrorType ? e.detail.message : JSON.stringify(e);
    console.error(isExpectedErrorType ? message : "calculation error", e);
    alert(message);
  });

  function handleCalculationCompletion(e: Event) {
    const acLayerView = view.layerViews.find(
      (lv) => lv.layer.title === airspaceCalculatorResultsLayerTitle
    );
    const acLayer = acLayerView.layer as FeatureLayer;

    // If the event is not of the expected type, write the
    // error to the console.
    if (!isAirspaceCalculatorResult(e)) {
      const message = `Was expecting event to be a ${CustomEvent.name}`;
      console.error(message);
      alert(`An unexpected error was encountered: ${message}`);
      // TODO: Show a popup at the clicked location informing the user that there was a problem.
      return;
    }
    // Get the airspace calculator result from the CustomEvent's detail.
    const { detail: acResult } = e;
    const message = acResult.surfacePenetration.toString();
    // TODO: Add a graphic with this result as its attributes to a graphics or feature layer.
    // TODO: Open that graphic's popup.
    console.log(message, acResult);

    addAirspaceCalculatorResult(acLayer, acResult);
  }

  form.addEventListener("calculation-complete", handleCalculationCompletion);
  view.on("click", populateXYInputs);

  const expand = new Expand({
    content: ui.form,
    expanded: true,
  });

  return expand;
}

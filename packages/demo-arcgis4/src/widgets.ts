import type MapView from "@arcgis/core/views/MapView";
import Expand from "@arcgis/core/widgets/Expand";
import type Widget from "@arcgis/core/widgets/Widget";
import type ListItem from "@arcgis/core/widgets/LayerList/ListItem";
import type { AirspaceCalculatorForm } from "airspace-calculator-ui";
import { setupAirspaceCalculator } from "./airspace-calc";

function setupLegend(view: MapView) {
  import("@arcgis/core/widgets/Legend").then(({ default: Legend }) => {
    const legend = new Legend({ view });
    const expand = new Expand({
      content: legend,
    });
    view.ui.add(expand, "bottom-leading");
  });
}

function createTitleWidget() {
  const div = document.createElement("h1");
  div.textContent = "🚧 Work-in-progress 🚧: WSDOT Airspace Calculator"
  div.classList.add("esri-widget","esri-header")

  return div
}

export async function setupWidgets(view: MapView) {
  // set up the bottom-left widgets.
  setupLegend(view);

  view.ui.add(createTitleWidget(), {
    index: 0,
    position: "top-leading"
  });

  /**
   * Dynamically imports the "Search" widget module and creates a Search widget.
   * @returns A Search widget.
   */
  async function setupSearch() {
    const { default: Search } = await import("@arcgis/core/widgets/Search");
    const search = new Search({
      view,
      includeDefaultSources: false,
      sources: [
        {
          // Use the WSDOT Customized view of the Geocoder
          url: "https://utility.arcgis.com/usrsvcs/servers/a86fa8aeabdd470792022a8ef959afb6/rest/services/World/GeocodeServer",
          name: "ArcGIS World Geocode Service",
          locationType: "street",
          // Probably don't need to specify US since an extent is already specified in the view
          // that the URL points to, but shouldn't harm anything.
          countryCode: "US",
          suggestionsEnabled: true,
          // Show a graphic for the location, zoom to it, and open its popup.
          popupEnabled: true,
          autoNavigate: true,
          resultGraphicEnabled: true,
          placeholder: "Find address or place",
          singleLineFieldName: "SingleLine",
        } as __esri.LocatorSearchSourceProperties,
      ],
    });
    return search;
  }

  // top-trailing

  /**
   * Creates the widgets in the upper-right of the map.
   */
  async function setupTopTrailing() {
    const searchPromise = setupSearch();

    const group = "top-trailing";

    // Import modules and then create the corresponding widgets.

    const basemapGalleryPromise = import(
      "@arcgis/core/widgets/BasemapGallery"
    ).then(({ default: BasemapGallery }) => {
      const basemapGallery = new BasemapGallery({
        // source: wsdotBasemaps,
        view,
        activeBasemap: view.map.basemap,
      });
      const basemapExpand = new Expand({
        content: basemapGallery,
        view,
        group,
      });
      return basemapExpand;
    });

    const layerListPromise = import("@arcgis/core/widgets/LayerList").then(
      ({ default: LayerList }) => {
        const layerList = new LayerList({
          view,
          selectionEnabled: true,
          multipleSelectionEnabled: true,
          visibleElements: {
            errors: true,
            statusIndicators: true,
          },
          listItemCreatedFunction: function (event) {
            const item: ListItem = event.item;
            item.panel = {
              content: ["legend"],
            } as typeof ListItem.prototype.panel;
            // TODO: Add link to metadata.
          },
        });
        const layerListExpand = new Expand({
          content: layerList,
          group,
        });
        return layerListExpand;
      }
    );

    const homePromise = import("@arcgis/core/widgets/Home").then(
      ({ default: Home }) => {
        const home = new Home({
          view,
        });
        return home;
      }
    );

    // Put all of the widget creation promises into an array.
    // The order of this array determines the order of the widgets
    // on the map.
    const widgetPromises = [
      searchPromise,
      homePromise,
      basemapGalleryPromise,
      layerListPromise,
      setupAirspaceCalculator(view),
    ];

    // Wait for the widget creations to be settled.
    const promiseSettledResults = await Promise.allSettled(widgetPromises);

    // Create arrays for the widgets (successful promises) and failed promises.
    const widgets = new Array<Widget | AirspaceCalculatorForm>();
    const failures = new Array<
      PromiseSettledResult<Widget | AirspaceCalculatorForm>
    >();

    // Populate the arrays.
    for (const item of promiseSettledResults) {
      if (item.status === "rejected") {
        console.error(`promise failed`, item.reason);
        failures.push(item);
      } else {
        widgets.push(item.value);
      }
    }

    // Add the widgets that were successfully created to the view UI.
    view.ui.add(widgets, group);
  }

  setupTopTrailing();
}

import type MapView from "@arcgis/core/views/MapView";
import type Widget from "@arcgis/core/widgets/Widget";

export async function setupWidgets(view: MapView) {
  const { default: Expand } = await import("@arcgis/core/widgets/Expand");

  // bottom-leading

  import("@arcgis/core/widgets/Legend").then(({ default: Legend }) => {
    const legend = new Legend({ view });
    const expand = new Expand({
      content: legend,
    });
    view.ui.add(expand, "bottom-leading");
  });

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

  async function setupTopTrailing() {
    const searchPromise = setupSearch();

    const group = "top-trailing";

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
            const { item } = event;
            item.panel = {
              content: "legend"
            }
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

    const widgetPromises = [
      searchPromise,
      basemapGalleryPromise,
      layerListPromise,
      homePromise,
    ];

    const promiseSettledResults = await Promise.allSettled(widgetPromises);

    const widgets = new Array<Widget>();
    const failures = new Array<PromiseSettledResult<Widget>>();
    for (const item of promiseSettledResults) {
      if (item.status === "rejected") {
        console.error(`promise failed`, item.reason);
        failures.push(item);
      } else {
        widgets.push(item.value);
      }
    }

    view.ui.add(widgets, group);
  }

  setupTopTrailing();
}

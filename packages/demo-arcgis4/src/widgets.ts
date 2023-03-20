import type MapView from "@arcgis/core/views/MapView";

export async function setupWidgets(view: MapView) {
  const { default: Expand } = await import("@arcgis/core/widgets/Expand");

  // bottom-leading

  import("@arcgis/core/widgets/Legend").then(({ default: Legend }) => {
    const legend = new Legend({ view });
    view.ui.add(legend, "bottom-leading");
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
        });
        const layerListExpand = new Expand({
          content: layerList,
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

    const results = (await Promise.allSettled(widgetPromises))
      .filter((item, index) => {
        if (item.status === "rejected") {
          console.error(`item ${index} failed`, item.reason);
          return false;
        }
        return true;
      })
      .map((item) => (item.status === "fulfilled" ? item.value : null));

    view.ui.add(
      results.filter((item) => item !== null),
      "top-trailing"
    );
  }

  setupTopTrailing();
}

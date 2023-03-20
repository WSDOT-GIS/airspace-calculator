import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

export const airportFacilitiesLayer = new MapImageLayer({
  title: "Airport Facilities",
  url: "https://data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirportFacilities/MapServer",
});

export const airspaceFeatures = new MapImageLayer({
  title: "Airspace Features",
  url: "https://data.wsdot.wa.gov/arcgis/rest/services/AirportMapApplication/AirspaceFeatures/MapServer",
  opacity: 0.5,
});

export const faaObstaclesLayer = new MapImageLayer({
  title: "FAA Obstacles",
  url: "https://maps6.arcgisonline.com/ArcGIS/rest/services/A-16/FAA_Obstacles/MapServer",
});

export default [airportFacilitiesLayer, airspaceFeatures, faaObstaclesLayer];

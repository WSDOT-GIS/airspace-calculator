import PopupTemplate from "@arcgis/core/PopupTemplate";
import { formatResults } from "airspace-calculator";

/**
 * Creates the popup title
 * @param graphic
 * @returns
 */
function formatTitle(feature: __esri.Feature) {
  const { graphic } = feature;
  console.debug(`${formatTitle.name}`, { graphic });
  if (!Object.hasOwn(graphic.attributes, "penetratesSurface")) {
    return "Surface Penetration Unknown";
  }
  return graphic.attributes.penetratesSurface
    ? "Surface Penetration"
    : "No Surface Penetration";
}

export const popupTemplate = new PopupTemplate({
  //   fieldInfos: [
  //     {
  //       fieldName: "agl",
  //     },
  //     { fieldName: "surfaceElevation" },
  //     { fieldName: "terrainElevation" },
  //     { fieldName: "locationId" },
  //     { fieldName: "rasterId" },
  //     { fieldName: "resolution" },
  //     {
  //       fieldName: "AcquisitionDate",
  //       format: {
  //         dateFormat: "short-date",
  //       },
  //     },
  //     { fieldName: "distanceFromSurface" },
  //     { fieldName: "penetratesSurface" },
  //     { fieldName: "penetrationOfSurface" },
  //   ],
  outFields: [
    "ObjectID",
    "agl",
    "surfaceElevation",
    "terrainElevation",
    "locationId",
    "rasterId",
    "resolution",
    "AcquisitionDate",
    "distanceFromSurface",
    "penetratesSurface",
    "penetrationOfSurface",
  ],
  content: function (feature: __esri.Feature) {
    const { graphic } = feature;
    const { attributes } = graphic;
    console.debug("create content function", attributes);
    return formatResults(attributes);
  },
  title: formatTitle,
});

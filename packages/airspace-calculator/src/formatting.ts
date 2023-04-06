import SurfacePenetrationInfo from "./SurfacePenetrationInfo";

/**
 * Converts feet to meters
 * @param {number} feet
 * @returns {number}
 */
export function feetToMeters(feet: number) {
  const ftPerM = 3.28084;
  return feet / ftPerM;
}

/**
 * Formats a Number (feet) into a string (feet and inches (rounded))
 * @param {number} feet
 * @returns {string}
 */
export function formatAsFeetAndInches(feet: number) {
  const prime = "\u2032";
  const doublePrime = "\u2033";
  let inches = feet % 1;
  feet = feet - inches;
  inches = Math.round(inches * 12);
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  return inches > 0
    ? [feet, prime, inches, doublePrime].join("")
    : [feet, prime].join("");
}

/**
 * Formats feet as X'Y" (Z m.)
 * @param {number} feet
 * @returns {string}
 */
export function formatFeetAsFeetAndInchesAndMeters(feet: number) {
  const m = feetToMeters(feet);
  return [
    formatAsFeetAndInches(feet),
    " (",
    Math.round(m * 100) / 100,
    " m.)",
  ].join("");
}

const faaFormUrl =
  "https://www.faa.gov/forms/index.cfm/go/document.information/documentID/186273";
const faaFormTitle =
  "Form FAA 7460-1: Notice of Proposed Construction or Alteration";

/**
 * Creates the info window content.
 * @param attributes - {@link SurfacePenetrationInfo}
 * @returns {HTMLDivElement}
 */
export function formatResults(
  attributes: Pick<
    SurfacePenetrationInfo,
    | "agl"
    | "penetratesSurface"
    | "distanceFromSurface"
    | "terrainElevation"
    | "penetrationOfSurface"
  >
) {
  const message = createSurfacePenetrationMessage(attributes);

  const output = document.createElement("div");

  let p = document.createElement("p");
  let a;
  p.textContent = message;
  output.appendChild(p);

  if (attributes.penetratesSurface) {
    p = document.createElement("p");
    a = document.createElement("a");
    a.href = faaFormUrl;
    a.target = "_blank";
    a.textContent = a.title = faaFormTitle;
    p.appendChild(a);
    output.appendChild(p);
  }

  const list = document.createElement("dl");
  output.appendChild(list);

  const data: Record<
    string,
    ReturnType<typeof formatFeetAsFeetAndInchesAndMeters>
  > = {
    "Penetration of <abbr title='Federal Aviation Regulations'>FAR</abbr> Surface occurred at":
      attributes.distanceFromSurface != null
        ? formatFeetAsFeetAndInchesAndMeters(attributes.distanceFromSurface)
        : "null",
    "Terrain Elevation": formatFeetAsFeetAndInchesAndMeters(
      attributes.terrainElevation
    ),
  };
  if (attributes.penetratesSurface && attributes.penetrationOfSurface != null) {
    data[
      "Structure Exceeds <abbr title='Federal Aviation Regulations'>FAR</abbr> Surface by"
    ] = formatFeetAsFeetAndInchesAndMeters(attributes.penetrationOfSurface);
  }

  for (const propName in data) {
    if (Object.prototype.hasOwnProperty.call(data, propName)) {
      const dt = document.createElement("dt");
      dt.innerHTML = propName;
      list.appendChild(dt);
      const dd = document.createElement("dd");
      dd.textContent = data[propName];
      list.appendChild(dd);
    }
  }

  return output;
}
export type SurfacePenetrationMessage =
  `A structure ${number}' above ground level ${
    | "would"
    | "would not"} penetrate an airport's airspace.`;

export function createSurfacePenetrationMessage(
  attributes: Pick<SurfacePenetrationInfo, "agl" | "penetratesSurface">
): SurfacePenetrationMessage {
  return `A structure ${attributes.agl}' above ground level ${
    attributes.penetratesSurface ? "would" : "would not"
  } penetrate an airport's airspace.`;
}

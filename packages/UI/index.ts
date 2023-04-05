/**
 * Provides Airspace Calculator UI
 * @module AirspaceCalculator/UI
 */

import { default as DmsCoordinates, parseDms } from "dms-conversion";
import { calculateSurfacePenetration } from "airspace-calculator";

/**
 * @external CustomEvent
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent|CustomEvent}
 */

export const coordinatesUpdateEventName = "coordinates-update";
export const calculationCompleteEventName = "calculation-complete";
export const calculationErrorEventName = "calculation-error";

/**
 * An HTML form containing Airspace Calculator controls.
 */
export interface AirspaceCalculatorForm extends HTMLFormElement {
  /**
   * The X coordinate input element.
   */
  x: HTMLInputElement;
  /**
   * The Y coordinate input element.
   */
  y: HTMLInputElement;
  /**
   * The height input element.
   */
  height: HTMLInputElement;
}

/**
 * @event AirspaceCalculatorForm#add-from-map
 * @type {external:CustomEvent}
 */

/**
 * @event AirspaceCalculatorForm#clear-graphics
 * @type {external:CustomEvent}
 */

/**
 * @event AirspaceCalculatorForm#calculation-complete
 * @type {external:CustomEvent}
 * @property {AirspaceCalculatorResult} detail
 */

/**
 * @event AirspaceCalculatorForm#calculation-error
 * @type {external:CustomEvent}
 * @property {Error} detail
 */

/**
 * @event AirspaceCalculatorForm#coordinates-update
 * @type {external:CustomEvent}
 * @property {DmsCoordinates} detail
 */

/**
 * Options for creating a button.
 * [iconClass] - CSS class(es) used to give the button an icon.
 * @property type[type=button] - The type of button to create (E.g., "button", "submit", or "reset")
 */
interface CreateButtonOptions
  extends Partial<Pick<HTMLButtonElement, "title" | "type">> {
  /**
   * button caption
   */
  caption: string | HTMLElement;
  /**
   * CSS class(es) used to give the button an icon.
   */
  iconClass?: string | string[];
}

/**
 * Options for creating an input element and associated label.
 */
interface CreateLabelAndInputOptions
  extends Partial<
    Omit<HTMLInputElement, "required" | "autocomplete" | "min" | "pattern">
  > {
  /**
   * Text for the label element. If omitted, a label element will not be created.
   */
  label?: string;
  required?: "required" | typeof HTMLInputElement.prototype.required;
  pattern?: RegExp | typeof HTMLInputElement.prototype.pattern;
  autocomplete?: "on" | "off";
  min?: number;
}

/**
 * Creates a button
 * @param options - button creation options
 * @returns An HTML button.
 */
function createButton(options: CreateButtonOptions) {
  options = options || {};
  const button = document.createElement("button");
  button.type = options.type || "button";
  if (options.title) {
    button.title = options.title;
  }

  const iconSpan = document.createElement("span");
  iconSpan.classList.add("icon");
  if (typeof options.iconClass === "string") {
    iconSpan.classList.add(options.iconClass);
  } else if (Array.isArray(options.iconClass)) {
    iconSpan.classList.add(...options.iconClass);
  }

  const captionSpan = document.createElement("span");
  captionSpan.classList.add("caption");
  if (typeof options.caption === "string") {
    captionSpan.textContent = options.caption;
  } else if (options.caption instanceof HTMLElement) {
    captionSpan.appendChild(options.caption);
  }

  button.appendChild(iconSpan);
  button.appendChild(captionSpan);

  return button;
}

function isIdInUse(id: string, ...parentsToSearch: Element[]): boolean {
  let element = document.getElementById(id);

  if (element) {
    return true;
  }

  if (!parentsToSearch || !parentsToSearch.length) {
    return false;
  }

  for (const parent of parentsToSearch) {
    element = parent.querySelector(`#${id}`);
    if (element) {
      return true;
    }
  }

  return false;
}

function createUniqueId(id?: string, ...parentsToSearch: Element[]): string {
  // Initialize ID if one wasn't provided.
  if (id == null) {
    id = "id";
  }

  // Return the input ID if it is not already in use.
  if (!isIdInUse(id)) {
    return id;
  }

  // Keep appending numbers until an unused ID is found.
  let newId: string = id;
  let i = 0;
  while (isIdInUse(newId, ...parentsToSearch)) {
    i++;
    newId = `${id}${i}`;
  }

  return newId;
}

/**
 * Creates a document fragment containing a label and an input element.
 * @param options - Properties correspond to input attributes.
 * @returns An HTML Document fragment containing a input element and associated label.
 */
function createLabelAndInput(
  options: CreateLabelAndInputOptions,
  ...parentsToSearch: Element[]
) {
  options = options || {};

  const docFrag = document.createDocumentFragment();

  options.id = createUniqueId(options.name, ...parentsToSearch);

  if (options.label) {
    const label = document.createElement("label");
    label.textContent = options.label;
    label.htmlFor = options.id;
    docFrag.appendChild(label);
  }

  const input = document.createElement("input");

  input.required =
    typeof options.required === "boolean"
      ? options.required
      : Boolean(options.required);

  const ignoredOptionNamesRe = /^(?:(?:label)|(?:required))$/i;

  type InputElementPropertyType = string | boolean | RegExp;

  for (const name in options) {
    if (!Object.prototype.hasOwnProperty.call(options, name)) {
      continue;
    }
    const option = (options as Record<string, InputElementPropertyType>)[name];
    if (option == null || ignoredOptionNamesRe.test(name)) {
      continue;
    }
    const propVal = option;
    if (propVal instanceof RegExp) {
      input.setAttribute(name, propVal.source);
    } else if (typeof propVal !== "string") {
      (input as unknown as Record<string, InputElementPropertyType>)[name] =
        propVal;
    } else {
      input.setAttribute(name, propVal);
    }
  }

  docFrag.appendChild(input);

  return docFrag;
}

/**
 * UI for the AirspaceCalculator
 * @constructor
 * @alias module:AirspaceCalculator/UI
 * @param {string} imageServiceUrl
 */
export default class UI {
  private _form: AirspaceCalculatorForm;

  public get form() {
    return this._form;
  }

  constructor(
    public imageServiceUrl: string,
    public elevationServiceUrl?: string
  ) {
    const coordinateBlur = () => {
      // Parse to coordinates.
      const x = parseDms(this._form.x.value);
      const y = parseDms(this._form.y.value);

      let dms: DmsCoordinates | null;
      // Create a DmsCoordinates object to ensure values are valid.
      try {
        dms = new DmsCoordinates(y, x);
      } catch (err) {
        // Set to null if not valid.
        dms = null;
      }

      const evt = new CustomEvent(coordinatesUpdateEventName, {
        detail: dms,
      });

      this._form.dispatchEvent(evt);
    };

    const form = document.createElement("form") as AirspaceCalculatorForm;
    this._form = form;
    form.classList.add("airspace-calculator");

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("container");

    // Add latitude controls.

    let frag = createLabelAndInput({
      label: "Longitude",
      name: "x",
      type: "text",
      pattern: DmsCoordinates.dmsRe.source,
      placeholder: "longitude",
      title: "Longitude in dec. degrees or DMS format.",
      required: "required",
      autocomplete: "on",
    }, inputContainer);
    let div = document.createElement("div");
    div.appendChild(frag);

    inputContainer.appendChild(div);

    // Add longitude controls.

    frag = createLabelAndInput({
      label: "Latitude",
      name: "y",
      type: "text",
      pattern: DmsCoordinates.dmsRe.source,
      placeholder: "latitude",
      title: "Latitude in dec. degrees or DMS format.",
      required: "required",
      autocomplete: "on",
    }, inputContainer);
    div = document.createElement("div");
    div.appendChild(frag);

    inputContainer.appendChild(div);

    // Add height controls.

    frag = createLabelAndInput({
      label: "Structure Height",
      name: "height",
      type: "number",
      placeholder: "Structure Height",
      title: "Enter a structure height in feet",
      min: 1,
      required: "required",
    }, inputContainer);
    div = document.createElement("div");
    div.appendChild(frag);

    inputContainer.appendChild(div);

    form.appendChild(inputContainer);

    const mapButtons = document.createElement("div");
    mapButtons.classList.add("map-buttons");

    let btn = createButton({
      caption: "Get coords. from map",
      title: "Pick coordinates by clicking a location on the map",
      iconClass: ["fa", "fa-location-arrow"],
    });
    mapButtons.appendChild(btn);

    btn.addEventListener("click", () => {
      const evt = new CustomEvent("add-from-map", {
        detail: null,
      });
      form.dispatchEvent(evt);
    });

    btn = createButton({
      caption: "Clear Graphics",
      title: "Clears graphics from the map created by this control",
      iconClass: ["fa", "fa-trash"],
    });
    mapButtons.appendChild(btn);

    btn.addEventListener("click", () => {
      const evt = new CustomEvent("clear-graphics", {
        detail: null,
      });
      form.dispatchEvent(evt);
    });

    form.appendChild(mapButtons);

    // Add buttons
    div = document.createElement("div");
    div.classList.add("btn-group");

    btn = createButton({
      type: "submit",
      caption: "Calculate",
      title: "Begin the calculation",
    });

    div.appendChild(btn);

    btn = createButton({
      type: "reset",
      caption: "Reset",
      title: "Resets the form",
    });

    div.appendChild(btn);

    form.appendChild(div);

    for (const currentInput of [form.x, form.y]) {
      currentInput.addEventListener("blur", coordinateBlur);
    }

    // Disable default form submission behavior (which is to navigate away from current page)
    form.onsubmit = () => {
      const x = parseDms(form.x.value);
      const y = parseDms(form.y.value);
      let dms: DmsCoordinates | null;
      try {
        dms = new DmsCoordinates(y, x);
      } catch (e) {
        dms = null;
        alert("Invalid coordinates");
      }

      if (dms) {
        const agl = Number(form.height.value);

        calculateSurfacePenetration(
          x,
          y,
          agl,
          this.imageServiceUrl,
          this.elevationServiceUrl
        ).then(
          (response) => {
            const evt = new CustomEvent(calculationCompleteEventName, {
              detail: response,
            });
            form.dispatchEvent(evt);
          },
          (error) => {
            const evt = new CustomEvent(calculationErrorEventName, {
              detail: error,
            });
            form.dispatchEvent(evt);
          }
        );
      }
      return false;
    };

    form.addEventListener("reset", () => {
      const evt = new CustomEvent(coordinatesUpdateEventName, {
        detail: null,
      });

      form.dispatchEvent(evt);
    });
  }
}

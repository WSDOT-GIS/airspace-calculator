/*global define, require, module*/

/**
 * Provides Airspace Calculator UI
 * @module AirspaceCalculator/UI
 */

import { default as DmsCoordinates, parseDms } from "dms-conversion";
import AirspaceCalculator from "./AirspaceCalculator";

/**
 * @external CustomEvent
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent|CustomEvent}
 */

/**
 * @typedef {HTMLFormElement} AirspaceCalculatorForm
 * @property {HTMLInputElement} x
 * @property {HTMLInputElement} y
 * @property {HTMLInputElement} height
 */

export interface AirspaceCalculatorForm extends HTMLFormElement {
    x: HTMLInputElement;
    y: HTMLInputElement;
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

interface CreateButtonOptions {
    /** button caption */
    caption: string | HTMLElement;
    /** button title */
    title?: string;
    /** CSS class(es) used to give the button an icon. */
    iconClass?: string | string[];
    /** The type of button to create (E.g., "button", "submit", or "reset") */
    type?: string;
}

// Just return a value to define the module export.
// This example returns an object, but the module
// can return a function as the exported value.
/**
 * Creates a button
 * @param {Object} options
 * @param {(string|HTMLElement)} options.caption - button caption
 * @param {(string|HTMLElement)} [options.title] - button title
 * @param {(string|string[])} [options.iconClass] - CSS class(es) used to give the button an icon.
 * @param {string} [options.type=button] - The type of button to create (E.g., "button", "submit", or "reset")
 * @returns {HTMLButtonElement}
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
        options.iconClass.forEach((s) => {
            iconSpan.classList.add(s);
        });
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

/**
 * Creates a document fragment containing a label and an input element.
 * @param {Object} options - Properties correspond to input attributes.
 * @param {string} [label] - Text for the label element. If omitted, a label element will not be created.
 * @returns {HTMLDocumentFragment}
 */
function createLabelAndInput(options: {
    label: string,
    required?: "required",
    name?: string,
    type?: string,
    pattern?: string,
    placeholder?: string,
    title?: string,
    autocomplete?: "on" | "off",
    min?: number,
}) {
    options = options || {};

    const docFrag = document.createDocumentFragment();

    if (options.label) {
        const label = document.createElement("label");
        label.textContent = options.label;
        docFrag.appendChild(label);
    }

    const input = document.createElement("input");

    input.required = Boolean(options.required);

    const ignoredOptionNames = /^(?:(?:label)|(required))$/i;
    // tslint:disable-next-line:forin
    for (const name in options) {
        const option = (options as any)[name];
        if (options.hasOwnProperty(name) && !ignoredOptionNames.test(option) && option != null) {
            const propVal = option;
            if (propVal instanceof RegExp) {
                input.setAttribute(name, propVal.source);
            } else {
                input.setAttribute(name, propVal);
            }
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
    // tslint:disable-next-line:variable-name
    private _airspaceCalc: AirspaceCalculator;
    // tslint:disable-next-line:variable-name
    private _form: AirspaceCalculatorForm;

    public get airspaceCalculator() {
        return this._airspaceCalc;
    }

    public get form() {
        return this._form;
    }

    constructor(imageServiceUrl: string, elevationServiceUrl?: string) {
        this._airspaceCalc = new AirspaceCalculator(imageServiceUrl, elevationServiceUrl);
        const self = this;

        const coordinateBlur = () => {
            const theForm = self.form;

            // Parse to coordinates.
            const x = parseDms(theForm.x.value);
            const y = parseDms(theForm.y.value);

            let dms: DmsCoordinates | null;
            // Create a DmsCoordinates object to ensure values are valid.
            try {
                dms = new DmsCoordinates(y, x);
            } catch (err) {
                // Set to null if not valid.
                dms = null;
            }

            const evt = new CustomEvent("coordinates-update", {
                detail: dms,
            });

            theForm.dispatchEvent(evt);
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
        });
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
        });
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
        });
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

        form.x.addEventListener("blur", coordinateBlur);
        form.y.addEventListener("blur", coordinateBlur);

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

                self._airspaceCalc.calculate(x, y, agl).then((response) => {
                    const evt = new CustomEvent("calculation-complete", {
                        detail: response,
                    });
                    form.dispatchEvent(evt);
                }, (error) => {
                    const evt = new CustomEvent("calculation-error", {
                        detail: error,
                    });
                    form.dispatchEvent(evt);
                });
            }
            return false;
        };

        form.addEventListener("reset", () => {
            const evt = new CustomEvent("coordinates-update", {
                detail: null,
            });

            form.dispatchEvent(evt);
        });
    }
}

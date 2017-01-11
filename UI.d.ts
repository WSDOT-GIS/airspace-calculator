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
 * UI for the AirspaceCalculator
 * @constructor
 * @alias module:AirspaceCalculator/UI
 * @param {string} imageServiceUrl
 */
export default class UI {
    _airspaceCalc: AirspaceCalculator;
    _form: AirspaceCalculatorForm;
    readonly airspaceCalculator: AirspaceCalculator;
    readonly form: AirspaceCalculatorForm;
    constructor(imageServiceUrl: string);
}

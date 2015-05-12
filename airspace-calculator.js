/*global define*/

/**
 * Provides Airspace Calculator UI
 * @module AirspaceCalculator
 */
define(["dms"], function (DmsCoordinates) {

	/**
	 * Creates a button
	 * @param {Object} options
	 * @param {(string|HTMLElement)} options.caption - button caption
	 * @param {(string|HTMLElement)} [options.title] - button title
	 * @param {(string|string[])} [options.iconClass] - CSS class(es) used to give the button an icon.
	 * @param {string} [options.button='button'] - The type of button to create (E.g., "button", "submit", or "reset")
	 * @returns {HTMLButtonElement}
	 */
	function createButton(options) {
		var button, iconSpan, captionSpan;
		options = options || {};
		button = document.createElement("button");
		button.type = options.type || "button";
		if (options.title) {
			button.title = options.title;
		}


		iconSpan = document.createElement("span");
		iconSpan.classList.add("icon");
		if (typeof options.iconClass === "string") {
			iconSpan.classList.add(options.iconClass);
		} else if (Array.isArray(options.iconClass)) {
			options.iconClass.forEach(function (s) {
				iconSpan.classList.add(s);
			});
		}


		captionSpan = document.createElement("span");
		if (typeof options.caption === "string") {
			captionSpan.innerText = options.caption;
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
	function createLabelAndInput(options) {
		var docFrag, label, input;

		options = options || {};

		docFrag = document.createDocumentFragment();


		if (options.label) {
			label = document.createElement("label");
			label.textContent = options.label;
			docFrag.appendChild(label);
		}

		input = document.createElement("input");

		input.required = Boolean(options.required);

		var ignoredOptionNames = /^(?:(?:label)|(required))$/i, propVal;
		for (var name in options) {
			/*jshint eqnull:true*/
			if (options.hasOwnProperty(name) && !ignoredOptionNames.test(options[name]) && options[name] != null) {
			/*jshint eqnull:false*/
				propVal = options[name];
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
	 * @constructor
	 * @alias module:AirspaceCalculator
	 */
	function AirspaceCalculator() {
		var form, frag, div, btn, inputContainer;

		form = document.createElement("form");
		form.classList.add("airspace-calculator");

		Object.defineProperty(this, "form", {
			get: function () {
				return form;
			}
		});

		inputContainer = document.createElement("div");
		inputContainer.classList.add("container");

		// Add latitude controls.

		frag = createLabelAndInput({
			label: "Longitude",
			name: "x",
			type: "text",
			pattern: DmsCoordinates.dmsRe.source,
			placeholder: "longitude",
			title: "Longitude in dec. degrees or DMS format.",
			required: "required"
		});
		div = document.createElement("div");
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
			required: "required"
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
			required: "required"
		});
		div = document.createElement("div");
		div.appendChild(frag);

		inputContainer.appendChild(div);

		form.appendChild(inputContainer);


		// Add buttons
		div = document.createElement("div");
		div.classList.add("btn-group");

		btn = createButton({
			caption: "Add from map",
			title: "Pick coordinates by clicking a location on the map"
		});
		div.appendChild(btn);

		btn.addEventListener("click", function () {
			var evt = new CustomEvent("add-from-map", {
				detail: null
			});
			form.dispatchEvent(evt);
		});

		btn = createButton({
			caption: "Clear Graphics",
			title: "Clears graphics from the map created by this control"
		});
		div.appendChild(btn);

		btn.addEventListener("click", function () {
			var evt = new CustomEvent("clear-graphics", {
				detail: null
			});
			form.dispatchEvent(evt);
		});

		btn = createButton({
			type: "submit",
			caption: "Calculate",
			title: "Begin the calculation"
		});

		div.appendChild(btn);

		btn = createButton({
			type: "reset",
			caption: "Reset",
			title: "Resets the form"
		});


		div.appendChild(btn);


		form.appendChild(div);




		// Disable default form submission behavior (which is to navigate away from current page)
		form.onsubmit = function () {
			return false;
		};
	}

	return AirspaceCalculator;
});
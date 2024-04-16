/* global customElementsInitiator */
/* *CE/WC* v0, see: https://github.com/IndigoMultimediaTeam/customElementsInitiator
 *
 * Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`:
 * 
 * - The “image caption” component, i.e. the line from `<*>` to the pointer (circle)
 * - The component is expanded to 100% and placed in the top left
 * - box and wheel (and line) are positioned percentage-wise within the component using the `position-*` attributes
 * - partially treated if, the box and wheel are in the horizontal/vertical plane
 * - by default the box is moved to `0 0` and the wheel to `100 100` (see `attributes`)
 * - all configuration options see `getComponentConfig` (and type `config` and `attributes`)
 *
 * version: 1.2.0
 * source: https://github.com/IndigoMultimediaTeam/c-box-line
 */
(typeof customElementsInitiator==="function" ? customElementsInitiator : function customElementsInitiator(component, when= "now"){
    if(when==="DOMContentLoaded"&&document.readyState==="loading")
        return document.addEventListener(when, component.bind(this));
    component.call(this);
})(function component(){
(function (g, f) {
    if ("object" == typeof exports && "object" == typeof module) {
      module.exports = f();
    } else if ("function" == typeof define && define.amd) {
      define("CBoxLine", [], f);
    } else if ("object" == typeof exports) {
      exports["CBoxLine"] = f();
    } else {
      g["CBoxLine"] = f();
    }
  }(this, () => {
var exports = {};
var module = { exports };
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// CBoxLine.js
var CBoxLine_exports = {};
__export(CBoxLine_exports, {
  CBoxLine: () => CBoxLine
});
module.exports = __toCommonJS(CBoxLine_exports);
var { min, max, abs } = Math;
var createElement = document.createElement.bind(document);
var createElementNS = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
var CBoxLine = class extends HTMLElement {
  static get tagName() {
    return "c-box-line";
  }
  static get attributes() {
    return [
      { name: "position-bubble", initial: "0 0" },
      { name: "position-circle", initial: "100 100" },
      { name: "stroke-width", initial: "2" }
    ];
  }
  connectedCallback() {
    const config = getComponentConfig(this);
    this._shadow.appendChild(Object.assign(createElement("style"), {
      innerHTML: getStyleContent(config)
    }));
    this._shadow.appendChild(getTemplate(config));
    this._ready = true;
  }
  /* this is more for debugging - e.g. styles are regenerated whole */
  static get observedAttributes() {
    return this.attributes.map(({ name }) => name);
  }
  attributeChangedCallback(_, value_old, value_new) {
    if (!this._ready || value_new === value_old)
      return false;
    const config = getComponentConfig(this);
    this._shadow.querySelector("style").innerHTML = getStyleContent(config);
    assignLineConfig(this._shadow.querySelector("line"), config);
  }
  /* only constructor with Shadow Root locked */
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "closed" });
  }
};
customElements.define(CBoxLine.tagName, CBoxLine);
function getLine12(size) {
  switch (true) {
    case size === 0:
      return ["50%", "50%"];
    case size < 0:
      return ["100%", "0"];
    default:
      return ["0", "100%"];
  }
}
function assignLineConfig(el, { line: [deltaX, deltaY] }) {
  const attributes = ["x1", "x2", "y1", "y2"];
  const from_x1_to_y2 = getLine12(deltaX).concat(getLine12(deltaY));
  for (let i = 0, key; key = attributes[i]; i++) {
    el.setAttribute(key, from_x1_to_y2[i]);
  }
  return el;
}
function getComponentConfig(el) {
  const [bubble, circle, strokeWidth] = el.constructor.attributes.map(({ name, initial }) => el.getAttribute(name) || initial);
  const [bX, bY] = bubble.trim().split(" ").map((n) => Number(n)), [cX, cY] = circle.trim().split(" ").map((n) => Number(n));
  const deltaX = cX - bX, deltaY = cY - bY;
  return {
    color: "#ffcc00",
    stroke: parseInt(strokeWidth),
    bubble: [bX, bY],
    circle: [cX, cY],
    line: [deltaX, deltaY]
  };
}
function getStyleContent({ color, stroke, bubble, circle, line: pre_line }) {
  const line = pre_line.map((v) => max(0.25, abs(v))).map((v) => v === 0.25 ? stroke + "px" : v + "%");
  const [color_line, color_circle] = ["line", "circle"].map((type) => `var(--cboxline-color-${type}, ${color})`);
  return `
		:host{
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}
		::slotted(*){
			position: absolute;
			top: ${bubble[1]}%;
			left: ${bubble[0]}%;
			transform: translate(-50%, -50%);
			z-index: 1;
		}
		svg{
			position: absolute;
			top: ${min(bubble[1], circle[1])}%;
			left: ${min(bubble[0], circle[0])}%;
			width: ${line[0]};
			height: ${line[1]};
			stroke: ${color_line};
			fill: ${color_line};
			stroke-width: ${stroke};
			z-index: 0;
		}
		.circle{
			position: absolute;
			left: ${circle[0]}%;
			top: ${circle[1]}%;
			background: ${color_circle};
			border-radius: 100%;
			height: 1rem;
			width: 1rem;
			transform: translate(-50%, -50%);
		}
		`.split("\n").map((l) => l.trim()).filter(Boolean).join("");
}
function getTemplate(config) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(
    createElement("slot")
  );
  const el_svg = fragment.appendChild(
    createElementNS("svg")
  );
  el_svg.appendChild(
    assignLineConfig(createElementNS("line"), config)
  );
  fragment.appendChild(
    Object.assign(createElement("div"), { className: "circle" })
  );
  return fragment;
}
if (typeof module.exports == "object" && typeof exports == "object") {
  var __cp = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of Object.getOwnPropertyNames(from)) {
        if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
        Object.defineProperty(to, key, {
          get: () => from[key],
          enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
        });
      }
    }
    return to;
  };
  module.exports = __cp(module.exports, exports);
}
return module.exports;
}))
}, "now");
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
 * version: 1.2.1
 * source: https://github.com/IndigoMultimediaTeam/c-box-line
 */
(typeof customElementsInitiator==="function" ? customElementsInitiator : function customElementsInitiator(component, when= "now"){
    if(when==="DOMContentLoaded"&&document.readyState==="loading")
        return document.addEventListener(when, component.bind(this));
    component.call(this);
})(function component(){
/* global customElements */
const /* utility pro mat. operace & vytváření elementů HTML/SVG */
	{ min, max, abs }= Math,
	createElement= document.createElement.bind(document),
	createElementNS= document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
/**
 * Static values of `CBoxLine` ... just a hint
 * @typedef CBoxLine_static
 * @type {HTMLElement & { constructor: { attributes: { name: string, initial: string }[], tagName: string } }}
 */
class CBoxLine extends HTMLElement {
	static get tagName(){ /* see CBoxLine_static */ return "c-box-line"; }
	static get attributes(){ /* see CBoxLine_static */ return [
		{ name: "position-bubble", initial: "0 0" },
		{ name: "position-circle", initial: "100 100" },
		{ name: "stroke-width", initial: "2" }
	]; }
	connectedCallback(){
		const config= getComponentConfig(this);
		this._shadow.appendChild(Object.assign(createElement("style"), {
			innerHTML: getStyleContent(config)
		}));
		this._shadow.appendChild(getTemplate(config));
		this._ready= true;
	}
	/* this is more for debugging - e.g. styles are regenerated whole */
	static get observedAttributes() { return this.attributes.map(({ name })=> name); }
	attributeChangedCallback(_, value_old, value_new){
		if(!this._ready||value_new===value_old) return false;
		const config= getComponentConfig(this);
		this._shadow.querySelector("style")
			.innerHTML= getStyleContent(config);
		assignLineConfig(this._shadow.querySelector("line"), config);
	}
	/* only constructor with Shadow Root locked */
	constructor(){ super(); this._shadow= this.attachShadow({ mode: "closed" }); }
}
customElements.define(CBoxLine.tagName, CBoxLine);

/**
 * The i-th coordinate of the line vector decides how the line will be positioned.
 * 
 * In the result (by combining X and Y) the line goes from the top-left to the bottom-right corner, or from the top-right …, from the middle …, etc.
 * @param {number} size
 * @returns {[ string, string ]}
 */
function getLine12(size){
	switch(true){
		case size===0:  return [ "50%", "50%" ];
		case size<0:    return [ "100%", "0" ];
		default:        return [ "0", "100%" ];
	}
} 
/**
 * Analogy `Object.assign` only for `<line>` (in the loop `*.setAttribute` is applied) and 
 * `config` is used as input not directly for native parameters (from there it calculates `x1`, ...)
 * @param {SVGLineElement} el
 * @param {config} config
 * @returns {SVGLineElement} `el`
 */
function assignLineConfig(el, { line: [ deltaX, deltaY ] }){
	const attributes= [ "x1", "x2", "y1", "y2" ];
	const from_x1_to_y2= getLine12(deltaX).concat(getLine12(deltaY));
	for(let i=0, key;( key= attributes[i] ); i++){
		el.setAttribute(key, from_x1_to_y2[i]);
	}
	return el;
}

/**
 * Represents the state of the component (color, position of individual elements). The source is the function {@link getComponentConfig}.
 * @typedef {object} config
 * @property {string} [color="#ffcc00"] hex color of lines and fill (for line and circle)
 * @property {number} [stroke=2] width of lines
 * @property {[number, number]} bubble `[ X, Y ]` bubble position
 * @property {[number, number]} circle `[ X, Y ]` wheel position
 * @property {[number, number]} line `[ deltaX, deltaY ]` vector representation of a line
 */
/**
 * Returns component parameters
 * @param {CBoxLine_static} el
 * @returns {config}
 */
function getComponentConfig(el){
	const /* atributtes */
		[ bubble, circle, strokeWidth ]= el.constructor.attributes
			.map(({ name, initial })=> el.getAttribute(name)||initial);
	const /* pozitions */
		[ bX, bY ]= bubble.trim().split(" ").map(n=> Number(n)),
		[ cX, cY ]= circle.trim().split(" ").map(n=> Number(n));
	const /* computed – area for a line */
		deltaX= cX-bX,
		deltaY= cY-bY;
	return {
		color: "#ffcc00",
		stroke: parseInt(strokeWidth),
		bubble: [ bX, bY ],
		circle: [ cX, cY ],
		line: [ deltaX, deltaY ]
	};
}

/**
 * @param {config} config
 * @returns {string} It is expected as an argument for {@link HTMLStyleElement.innerHTML}
 */
function getStyleContent({ color, stroke, bubble, circle, line: pre_line }){
	const line= pre_line.map(v=> max(0.25, abs(v))).map(v=> v===0.25 ? stroke+"px" : v+"%"); // hypothetically negative size or zero (vertical/horizontal line)
	const [ color_line, color_circle ]= [ "line", "circle" ].map(type=> `var(--cboxline-color-${type}, ${color})`);
	return (`
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
		`).split("\n").map(l=> l.trim()).filter(Boolean).join("");
}

/**
 * Generates `<><slot/><svg><line/></svg><div.circle/></>`
 * @param {config} config
 * @returns {DocumentFragment}
 */
function getTemplate(config){
	const fragment= document.createDocumentFragment();
	
	fragment.appendChild(
		createElement("slot"));
	const el_svg= fragment.appendChild(
		createElementNS("svg"));
	el_svg.appendChild(
		assignLineConfig(createElementNS("line"), config));
	fragment.appendChild(
		Object.assign(createElement("div"), { className: "circle" }));
	return fragment;
}
}, "now");
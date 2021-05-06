/* global customElements */
/*
    Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`
        - Komponenta „popisku obrázku”, tedy čára od `<*>` k ukazovátku (kolečko)
        - Komponenta se roztáhne na 100% a umístí se vlevo nahoře
        - box a kolečko (a čára) se pozicují procentuálně uvnitř komponenty pomocí atributů `position-*`
        - částečně ošetřeno pokud, je box a kolečko v horizonální/vertikální rovinně
        - defaultně se box posouvá do `0 0` a kolečko do `100 100` (viz `attributes`)
        - všechny možnosti konfigurace viz `getComponentConfig` (a typ `config` a `attributes`)
    verze: "1.1.0"
    zdroj: "https://github.com/IndigoMultimediaTeam/c-box-line#readme"
 */
(function componenta(){
    const /* utility pro mat. operace & vytváření elementů HTML/SVG */
        { min, max, abs }= Math,
        createElement= document.createElement.bind(document),
        createElementNS= document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
    /**
     * Statické hodnoty `CBoxLine` … jen pomocné pro napovídání
     * @typedef CBoxLine_static
     * @type {HTMLElement & { constructor: { attributes: { name: string, initial: string }[], tagName: string } }}
     */
    class CBoxLine extends HTMLElement {
        static get tagName(){ /* viz CBoxLine_static */ return "c-box-line"; }
        static get attributes(){ /* viz CBoxLine_static */ return [
            { name: "position-bubble", initial: "0 0" },
            { name: "position-circle", initial: "100 100" }
        ]; }
        connectedCallback(){
            const config= getComponentConfig(this);
            this._shadow.appendChild(Object.assign(createElement("style"), {
                innerHTML: getStyleContent(config)
            }));
            this._shadow.appendChild(getTemplate(config));
            this._ready= true;
        }
        /* toto je spíše pro debugování – např. styly se přegenerovávají celé */
        static get observedAttributes() { return this.attributes.map(({ name })=> name); }
        attributeChangedCallback(_, value_old, value_new){
            if(!this._ready||value_new===value_old) return false;
            const config= getComponentConfig(this);
            this._shadow.querySelector("style")
                .innerHTML= getStyleContent(config);
            assignLineConfig(this._shadow.querySelector("line"), config);
        }
        /* jen konstruktor s uzamčeným Shadow Root */
        constructor(){ super(); this._shadow= this.attachShadow({ mode: "closed" }); }
    }
    /**
     * Dle i-té souřadnice vektoru čáry rozhodne jak bude napozicována.
     * 
     * Ve výsledku (kombinací X a Y) čára jde z levého-horního do pravého-dolního rohu, nebo z pravého-horního …, z prostředku … apod.
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
     * Analogie `Object.assign` jen pro `<line>` (v cyklu se aplikuje `*.setAttribute`) a 
     * jako vstup neslouží přímo nativní parametry ale `config` (odtud si spočte `x1`, …)
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
     * Reprezentuje stav komponenty (barva, pozice jednotlivých elemetnů). Zdrojem je funkce {@link getComponentConfig}.
     * @typedef {object} config
     * @property {string} [color="#ffcc00"] hex barva čar a výplně (pro čáru i kruh)
     * @property {number} [stroke=2] šířka čar
     * @property {[number, number]} bubble `[ X, Y ]` pozice bubliny
     * @property {[number, number]} circle `[ X, Y ]` pozice kolečka
     * @property {[number, number]} line `[ deltaX, deltaY ]` vektorová reprezentace čáry
     */
    /**
     * Vrací parametry komponenty
     * @param {CBoxLine_static} el
     * @returns {config}
     */
    function getComponentConfig(el){
        const /* atributy */
            [ bubble, circle ]= el.constructor.attributes
                .map(({ name, initial })=> el.getAttribute(name)||initial);
        const /* pozice */
            [ bX, bY ]= bubble.trim().split(" ").map(n=> Number(n)),
            [ cX, cY ]= circle.trim().split(" ").map(n=> Number(n));
        const /* spočteno – prostor pro čáru */
            deltaX= cX-bX,
            deltaY= cY-bY;
        return {
            color: "#ffcc00",
            stroke: 2,
            bubble: [ bX, bY ],
            circle: [ cX, cY ],
            line: [ deltaX, deltaY ]
        };
    }
 
    /**
     * 
     * @param {config} config
     * @returns {string} Očekává se jako argument pro {@link HTMLStyleElement.innerHTML}
     */
    function getStyleContent({ color, stroke, bubble, circle, line: pre_line }){
        const line= pre_line.map(v=> max(0.25, abs(v))); //hypoteticky záporné velikosti, nebo nulové (vertikální/horizontální linka)
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
                width: ${line[0]}%;
                height: ${line[1]}%;
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
     * Generuje `<><slot/><svg><line/></svg><div.circle/></>`
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
    customElements.define(CBoxLine.tagName, CBoxLine);
})();
/* global customElements */
/*
    Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`
        - Komponenta „popisku obrázku”, tedy čára od `<*>` k ukazovátku (kolečko)
        - Komponenta se roztáhne na 100% a umístí se vlevo nahoře
        - box a kolečko (a čára) se pozicují procentuálně uvnitř komponenty pomocí atributů `position-*`
        - částečně ošetřeno pokud, je box a kolečko v horizonální/vertikální rovinně
        - defaultně se box posouvá do `0 0` a kolečko do `100 100`
        - všechny možnosti konfigurace viz `getComponentConfig` (a typ `config` a `observed_attributes`)
 */
(function componenta(){
    const observed_attributes= [ "position-bubble", "position-circle" ];
    const /* utility pro mat. operace & vytváření elementů HTML/SVG */
        { min, max, abs }= Math,
        createElement= document.createElement.bind(document),
        createElementNS= document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
    class CBoxLine extends HTMLElement {
        connectedCallback(){
            const config= getComponentConfig(this);
            this.__shadow.appendChild(Object.assign(createElement("style"), {
                innerHTML: getStyleContent(config)
            }));
            this.__shadow.appendChild(getTemplate(config));
            this.__ready= true;
        }
        /* toto je spíše pro debugování – např. styly se přegenerovávají celé */
        static get observedAttributes() { return observed_attributes; }
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.__ready) return false;
            const config= getComponentConfig(this);
            Object.assign(this.__shadow.querySelector("style"), {
                innerHTML: getStyleContent(config)
            });
            assignLineConfig(this.__shadow.querySelector("line"), config);
            
        }
        /* jen konstruktor s uzamčeným Shadow Root */
        constructor(){ super(); this.__shadow= this.attachShadow({ mode: "closed" }); }
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
     * @param {HTMLElement|SVGElement} el
     * @param {config} config
     * @returns {HTMLElement|SVGElement} `el`
     */
    function assignLineConfig(el, { line: [ deltaX, deltaY ] }){
        const [ x1, x2 ]= getLine12(deltaX);
        const [ y1, y2 ]= getLine12(deltaY);
        for(const [ key, value ] of Object.entries({ x1, x2, y1, y2 })){
            el.setAttribute(key, value);
        }
        return el;
    }
    /**
     * Reprezentuje stav komponenty (barva, pozice jednotlivých elemetnů)
     * @typedef {object} config
     * @property {string} color hex barva čar a výplně (pro čáru i kruh)
     * @property {[number, number]} bubble `[ X, Y ]` pozice bubliny
     * @property {[number, number]} circle `[ X, Y ]` pozice kolečka
     * @property {[number, number]} line `[ deltaX, deltaY ]` vektorová reprezentace čáry
     */
    /**
     * Vrací parametry komponenty
     * @param {HTMLElement} el
     * @returns {config}
     */
    function getComponentConfig(el){
        const /* atributy */
            bubble= el.getAttribute(observed_attributes[0]) || "0 0",
            circle= el.getAttribute(observed_attributes[1]) || "100 100";
        const /* pozice */
            [ bX, bY ]= bubble.trim().split(" ").map(n=> Number(n)),
            [ cX, cY ]= circle.trim().split(" ").map(n=> Number(n));
        const /* spočteno – prostor pro čáru */
            deltaX= cX-bX,
            deltaY= cY-bY;
        return {
            color: "#ffcc00",
            bubble: [ bX, bY ],
            circle: [ cX, cY ],
            line: [ deltaX, deltaY ]
        };
    }
 
    /**
     * 
     * @param {config} config
     * @returns {HTMLStyleElement}
     */
    function getStyleContent({ color, bubble, circle, line: pre_line }){
        const line= pre_line.map(v=> max(0.25, abs(v))); //hypoteticky záporné velikosti, nebo nulové (vertikální/horizontální linka)
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
                stroke: ${color};
                fill: ${color};
                stroke-width: 1.5;
                z-index: 0;
            }
            .circle{
                position: absolute;
                left: ${circle[0]}%;
                top: ${circle[1]}%;
                background: ${color};
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
     * @returns {HTMLFrameElement}
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
    customElements.define("c-box-line", CBoxLine);
})();
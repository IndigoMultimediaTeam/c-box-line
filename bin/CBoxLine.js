/* global customElements */
/*
    Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`
        - Komponenta „popisku obrázku”, tedy čára od `*` k ukazovátku (kolečko)
        - Komponenta se roztáhne na 100% a umístí se vlevo nahoře
        - box a kolečko (a čára) se pozicují procentuálně uvnitř komponenty pomocí atributů `position-*`
        - částečně ošetřeno pokud, je box a kolečko v horizonální/vertikální rovinně
        - defaultně se box posouvá do `0 0` a kolečko do `100 100`
 */
(function componenta(){
    const /* utility pro mat. operace & vytváření elementů HTML/SVG */
        { min, max, abs }= Math,
        createElement= document.createElement.bind(document),
        createElementNS= document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
    class CBoxLine extends HTMLElement {
        connectedCallback(){
            const /* atributy */
                bubble= this.getAttribute("position-bubble") || "0 0",
                circle= this.getAttribute("position-circle") || "100 100";
            const /* pozice */
                [ bX, bY ]= bubble.trim().split(" ").map(n=> Number(n)),
                [ cX, cY ]= circle.trim().split(" ").map(n=> Number(n));
            const /* spočteno – prostor pro čáru */
                width= cX-bX,
                height= cY-bY;
            this.__shadow.appendChild(getStyle({
                color: "#ffcc00",
                bubble: [ bX, bY ],
                circle: [ cX, cY ],
                line: [ width, height ].map(v=> max(0.25, abs(v)))
            }));
            this.__shadow.appendChild(getTemplate({
                width, height
            }));
        }
        constructor(){
            super();
            this.__shadow= this.attachShadow({ mode: "closed" });
        }
    }
 
    
    /**
     * 
     * @param {object} def 
     * @param {string} def.color hex barva čar a výplně (pro čáru i kruh)
     * @param {[number, number]} def.bubble `[ X, Y ]` pozice bubliny
     * @param {[number, number]} def.circle `[ X, Y ]` pozice kolečka
     * @param {[number, number]} def.line `[ deltaX, deltaY ]` vektorová reprezentace čáry
     * @returns {HTMLStyleElement}
     */
    function getStyle({ color, bubble, circle, line }){
        return Object.assign(createElement("style"), { innerHTML: (`
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
            `).split("\n").map(l=> l.trim()).filter(Boolean).join("")});
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
     * Jako `Object.assign` jen pro elemnety (v cyklu se aplikuje `*.setAttribute`)
     * @param {HTMLElement|SVGElement} el
     * @param {object} params 
     * @returns {HTMLElement|SVGElement} `el`
     */
    function dom_assign(el, params){
        for(const [ key, value ] of Object.entries(params)){
            el.setAttribute(key, value);
        }
        return el;
    } 
 
    
    /**
     * Generuje `<><slot/><svg><line/></svg><div.circle/></>`
     * @param {object} def 
     * @param {number} def.width x-ová délka čáry
     * @param {number} def.height y-ová délka čáry
     * @returns {HTMLFrameElement}
     */
    function getTemplate({ width, height }){
        const [ x1, x2 ]= getLine12(width);
        const [ y1, y2 ]= getLine12(height);
        const fragment= document.createDocumentFragment();
        
        fragment.appendChild(createElement("slot"));
        const el_svg= fragment.appendChild(createElementNS("svg"));
        el_svg.appendChild(dom_assign(
            createElementNS("line"),
            { x1, x2, y1, y2 }
        ));
        fragment.appendChild(Object.assign(
            createElement("div"),
            { className: "circle" }
        ));
        return fragment;
    }
    customElements.define("c-box-line", CBoxLine);
})();
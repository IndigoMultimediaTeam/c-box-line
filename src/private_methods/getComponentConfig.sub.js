/* global observed_attributes */
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
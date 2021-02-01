gulp_place("../utils/CBoxLine_static_type.sub.js", "file_once");/* global CBoxLine_static */
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
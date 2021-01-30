/* parent *//* global CBoxLine */
gulp_place("../utils/small_utils.sub.js", "file_once"); /* global createElement, min, max, abs */

/**
 * 
 * @param {object} def 
 * @param {string} def.color hex barva čar a výplně (pro čáru i kruh)
 * @param {[number, number]} def.bubble `[ X, Y ]` pozice bubliny
 * @param {[number, number]} def.circle `[ X, Y ]` pozice kolečka
 * @param {[number, number]} def.line `[ deltaX, deltaY ]` vektorová reprezentace čáry
 * @returns {HTMLStyleElement}
 */
function getStyle({ color, bubble, circle, line: pre_line }){
    const line= pre_line.map(v=> max(0.25, abs(v))); //hypoteticky záporné velikosti, nebo nulové (vertikální/horizontální linka)
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
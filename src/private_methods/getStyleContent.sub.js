/* parent *//* global CBoxLine */
gulp_place("../utils/small_utils.sub.js", "file_once"); /* global createElement, min, max, abs */
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
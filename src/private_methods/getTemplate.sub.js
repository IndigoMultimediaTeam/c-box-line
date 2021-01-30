/* parent *//* global CBoxLine */
gulp_place("../utils/getLine12.sub.js", "file_once"); /* global getLine12 */
gulp_place("../utils/dom_assign.sub.js", "file_once"); /* global dom_assign */
gulp_place("../utils/small_utils.sub.js", "file_once"); /* global createElement, createElementNS */

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
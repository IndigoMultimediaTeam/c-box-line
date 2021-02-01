/* parent *//* global CBoxLine */
gulp_place("./assignLineConfig.sub.js", "file_once"); /* global assignLineConfig */
gulp_place("../utils/small_utils.sub.js", "file_once"); /* global createElement, createElementNS */
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
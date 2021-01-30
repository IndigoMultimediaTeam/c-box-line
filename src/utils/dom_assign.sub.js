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
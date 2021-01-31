gulp_place("../utils/getLine12.sub.js", "file_once"); /* global getLine12 */
/**
 * Analogie `Object.assign` jen pro `<line>` (v cyklu se aplikuje `*.setAttribute`) a 
 * jako vstup neslouží přímo nativní parametry ale `config` (odtud si spočte `x1`, …)
 * @param {HTMLElement|SVGElement} el
 * @param {config} config
 * @returns {HTMLElement|SVGElement} `el`
 */
function assignLineConfig(el, { line: [ deltaX, deltaY ] }){
    const attributes= [ "x1", "x2", "y1", "y2" ];
    const from_x1_to_y2= getLine12(deltaX).concat(getLine12(deltaY));
    for(let i=0, key;( key= attributes[i] ); i++){
        el.setAttribute(key, from_x1_to_y2[i]);
    }
    return el;
}
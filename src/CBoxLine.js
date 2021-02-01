/* global customElements */
/*
    Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`
        - Komponenta „popisku obrázku”, tedy čára od `<*>` k ukazovátku (kolečko)
        - Komponenta se roztáhne na 100% a umístí se vlevo nahoře
        - box a kolečko (a čára) se pozicují procentuálně uvnitř komponenty pomocí atributů `position-*`
        - částečně ošetřeno pokud, je box a kolečko v horizonální/vertikální rovinně
        - defaultně se box posouvá do `0 0` a kolečko do `100 100` (viz `attributes`)
        - všechny možnosti konfigurace viz `getComponentConfig` (a typ `config` a `attributes`)
    verze: gulp_place("app.version", "variable")
    zdroj: gulp_place("app.homepage", "variable")
 */
(function componenta(){
    gulp_place("./utils/small_utils.sub.js", "file_once");/* global createElement */
    gulp_place("./utils/CBoxLine_static_type.sub.js", "file_once");/* global CBoxLine_static */
    class CBoxLine extends HTMLElement {
        static get tagName(){ /* viz CBoxLine_static */ return "c-box-line"; }
        static get attributes(){ /* viz CBoxLine_static */ return [
            { name: "position-bubble", initial: "0 0" },
            { name: "position-circle", initial: "100 100" }
        ]; }
        connectedCallback(){
            const config= getComponentConfig(this);
            this._shadow.appendChild(Object.assign(createElement("style"), {
                innerHTML: getStyleContent(config)
            }));
            this._shadow.appendChild(getTemplate(config));
            this._ready= true;
        }
        /* toto je spíše pro debugování – např. styly se přegenerovávají celé */
        static get observedAttributes() { return this.attributes.map(({ name })=> name); }
        attributeChangedCallback(_, value_old, value_new){
            if(!this._ready||value_new===value_old) return false;
            const config= getComponentConfig(this);
            this._shadow.querySelector("style")
                .innerHTML= getStyleContent(config);
            assignLineConfig(this._shadow.querySelector("line"), config);
        }
        /* jen konstruktor s uzamčeným Shadow Root */
        constructor(){ super(); this._shadow= this.attachShadow({ mode: "closed" }); }
    }
    gulp_place('./private_methods/*.js', "glob_once");/* global getComponentConfig, getStyleContent, getTemplate, assignLineConfig */
    customElements.define(CBoxLine.tagName, CBoxLine);
})();
/* global customElements */
/*
    Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`
        - Komponenta „popisku obrázku”, tedy čára od `<*>` k ukazovátku (kolečko)
        - Komponenta se roztáhne na 100% a umístí se vlevo nahoře
        - box a kolečko (a čára) se pozicují procentuálně uvnitř komponenty pomocí atributů `position-*`
        - částečně ošetřeno pokud, je box a kolečko v horizonální/vertikální rovinně
        - defaultně se box posouvá do `0 0` a kolečko do `100 100`
        - všechny možnosti konfigurace viz `getComponentConfig` (a typ `config` a `observed_attributes`)
 */
(function componenta(){
    const observed_attributes= [ "position-bubble", "position-circle" ];
    gulp_place("./utils/small_utils.sub.js", "file_once");/* global createElement */
    class CBoxLine extends HTMLElement {
        connectedCallback(){
            const config= getComponentConfig(this);
            this.__shadow.appendChild(Object.assign(createElement("style"), {
                innerHTML: getStyleContent(config)
            }));
            this.__shadow.appendChild(getTemplate(config));
            this.__ready= true;
        }
        /* toto je spíše pro debugování – např. styly se přegenerovávají celé */
        static get observedAttributes() { return observed_attributes; }
        attributeChangedCallback(name, oldValue, newValue) {
            if(!this.__ready) return false;
            const config= getComponentConfig(this);
            Object.assign(this.__shadow.querySelector("style"), {
                innerHTML: getStyleContent(config)
            });
            assignLineConfig(this.__shadow.querySelector("line"), config);
            
        }
        /* jen konstruktor s uzamčeným Shadow Root */
        constructor(){ super(); this.__shadow= this.attachShadow({ mode: "closed" }); }
    }
    gulp_place('./private_methods/*.js', "glob_once");/* global getComponentConfig, getStyleContent, getTemplate, assignLineConfig */
    customElements.define("c-box-line", CBoxLine);
})();
/* global customElements */
/*
    Web Component `<c-box-line position-bubble position-circle><*></*></c-box-line>`
        - Komponenta „popisku obrázku”, tedy čára od `*` k ukazovátku (kolečko)
        - Komponenta se roztáhne na 100% a umístí se vlevo nahoře
        - box a kolečko (a čára) se pozicují procentuálně uvnitř komponenty pomocí atributů `position-*`
        - částečně ošetřeno pokud, je box a kolečko v horizonální/vertikální rovinně
        - defaultně se box posouvá do `0 0` a kolečko do `100 100`
 */
(function componenta(){
    gulp_place("./utils/small_utils.sub.js", "file_once");/* global max, abs */
    class CBoxLine extends HTMLElement {
        connectedCallback(){
            const /* atributy */
                bubble= this.getAttribute("position-bubble") || "0 0",
                circle= this.getAttribute("position-circle") || "100 100";
            const /* pozice */
                [ bX, bY ]= bubble.trim().split(" ").map(n=> Number(n)),
                [ cX, cY ]= circle.trim().split(" ").map(n=> Number(n));
            const /* spočteno – prostor pro čáru */
                width= cX-bX,
                height= cY-bY;
            this.__shadow.appendChild(getStyle({
                color: "#ffcc00",
                bubble: [ bX, bY ],
                circle: [ cX, cY ],
                line: [ width, height ].map(v=> max(0.25, abs(v)))
            }));
            this.__shadow.appendChild(getTemplate({
                width, height
            }));
        }
        constructor(){
            super();
            this.__shadow= this.attachShadow({ mode: "closed" });
        }
    }
    gulp_place('./private_methods/*.js', "glob_once");/* global getStyle, getTemplate */
    customElements.define("c-box-line", CBoxLine);
})();
/* global customElementsInitiator */
/* *CE/WC* v0, see: https://github.com/IndigoMultimediaTeam/customElementsInitiator
 *
// USAGE
 */
(typeof customElementsInitiator==="function" ? customElementsInitiator : function customElementsInitiator(component, when= "now"){
    if(when==="DOMContentLoaded"&&document.readyState==="loading")
        return document.addEventListener(when, component.bind(this));
    component.call(this);
})(function component(){
// COMPONENT
}, "now");

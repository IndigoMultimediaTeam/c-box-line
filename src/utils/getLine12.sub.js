/**
 * Dle i-té souřadnice vektoru čáry rozhodne jak bude napozicována.
 * 
 * Ve výsledku (kombinací X a Y) čára jde z levého-horního do pravého-dolního rohu, nebo z pravého-horního …, z prostředku … apod.
 * @param {number} size
 * @returns {[ string, string ]}
 */
function getLine12(size){
    switch(true){
        case size===0:  return [ "50%", "50%" ];
        case size<0:    return [ "100%", "0" ];
        default:        return [ "0", "100%" ];
    }
}
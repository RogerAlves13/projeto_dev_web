"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularDistancia = calcularDistancia;
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const terra = 6371; //Distância da terra em KM
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const formula = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const calculo = 2 * Math.atan2(Math.sqrt(formula), Math.sqrt(1 - formula));
    return terra * calculo;
}
//# sourceMappingURL=distancia.js.map
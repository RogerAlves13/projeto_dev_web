"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtrarParadasPorRaio = filtrarParadasPorRaio;
const distancia_1 = require("./distancia");
function filtrarParadasPorRaio(usuarioLat, usuarioLon, paradas, raioKm) {
    const resultado = [];
    for (const parada of paradas) {
        const distancia = (0, distancia_1.calcularDistancia)(usuarioLat, usuarioLon, parada.latitude, parada.longitude);
        if (distancia <= raioKm) {
            resultado.push(parada);
        }
    }
    return resultado;
}
//# sourceMappingURL=filtrarParadasPorRaio.js.map
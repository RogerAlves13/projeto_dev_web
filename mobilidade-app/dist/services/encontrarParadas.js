"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encontrarParadasMaisProximas = encontrarParadasMaisProximas;
const distancia_1 = require("./distancia");
function encontrarParadasMaisProximas(usuarioLat, usuarioLon, paradas, quantidade) {
    const resultado = [];
    for (const parada of paradas) {
        const distancia = (0, distancia_1.calcularDistancia)(usuarioLat, usuarioLon, parada.latitude, parada.longitude);
        resultado.push({
            parada,
            distancia
        });
    }
    resultado.sort((a, b) => a.distancia - b.distancia);
    return resultado.slice(0, quantidade);
}
//# sourceMappingURL=encontrarParadas.js.map
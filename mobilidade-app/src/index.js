"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paradas_1 = require("./data/paradas");
const distancia_1 = require("./services/distancia");
const usuarioLat = -23.5615;
const usuarioLon = -46.6559;
for (const parada of paradas_1.paradas) {
    const distancia = (0, distancia_1.calcularDistancia)(usuarioLat, usuarioLon, parada.latitude, parada.longitude);
    console.log(parada.nome, "-", distancia.toFixed(2), "km de distância");
}
//# sourceMappingURL=index.js.map
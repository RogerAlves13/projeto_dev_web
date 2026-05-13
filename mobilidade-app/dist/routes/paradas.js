"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paradas_1 = require("../data/paradas");
const encontrarParadas_1 = require("../services/encontrarParadas");
const router = (0, express_1.Router)();
router.get("/proximas", (req, res) => {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const resultado = (0, encontrarParadas_1.encontrarParadasMaisProximas)(lat, lon, paradas_1.paradas, 5);
    res.json(resultado);
});
exports.default = router;
//# sourceMappingURL=paradas.js.map
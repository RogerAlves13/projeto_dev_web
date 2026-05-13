"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paradas_1 = require("./data/paradas");
const encontrarParadas_1 = require("./services/encontrarParadas");
const path_1 = __importDefault(require("path"));
const linhas_1 = require("./data/linhas");
const app = (0, express_1.default)();
// ==============================
// pasta pública (HTML, CSS, JS)
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// ==============================
// rota principal
app.get("/", (req, res) => {
    res.send("API de paradas funcionando 🚍");
});
// ==============================
// endpoint das linhas
app.get("/linhas", (req, res) => {
    res.json(linhas_1.linhas);
});
// ==============================
// endpoint de paradas próximas
app.get("/paradas/proximas", (req, res) => {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const resultado = (0, encontrarParadas_1.encontrarParadasMaisProximas)(lat, lon, paradas_1.paradas, 5);
    res.json(resultado);
});
// ==============================
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
import express from "express"
import { paradas } from "./data/paradas"
import { encontrarParadasMaisProximas } from "./services/encontrarParadas"
import path from "path"
import { linhas } from "./data/linhas"

const app = express()

// ==============================
// pasta pública (HTML, CSS, JS)

app.use(express.static(path.join(__dirname, "../public")))

// ==============================
// rota principal

app.get("/", (req, res) => {
    res.send("API de paradas funcionando 🚍")
})

// ==============================
// endpoint das linhas

app.get("/linhas", (req, res) => {
    res.json(linhas)
})

// ==============================
// endpoint de paradas próximas

app.get("/paradas/proximas", (req, res) => {

    const lat = Number(req.query.lat)
    const lon = Number(req.query.lon)

    const resultado = encontrarParadasMaisProximas(
        lat,
        lon,
        paradas,
        5
    )

    res.json(resultado)

})

// ==============================

const PORT = 3000

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
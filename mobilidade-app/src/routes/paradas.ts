import { Router } from "express"
import { paradas } from "../data/paradas"
import { encontrarParadasMaisProximas } from "../services/encontrarParadas"

const router = Router()

router.get ("/proximas", (req, res) => {

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

export default router

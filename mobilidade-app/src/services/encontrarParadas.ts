import { calcularDistancia } from "./distancia"
import { ParadaOnibus } from "../types/ParadaOnibus"

type ParadaComDistancia = {
    parada: ParadaOnibus
    distancia: number
}

export function encontrarParadasMaisProximas(
    usuarioLat: number,
    usuarioLon: number,
    paradas: ParadaOnibus[],
    quantidade: number
): ParadaComDistancia[] {
   
    const resultado: ParadaComDistancia[] = []

    for (const parada of paradas) {

        const distancia = calcularDistancia(
            usuarioLat,
            usuarioLon,
            parada.latitude,
            parada.longitude
        )
         
        resultado.push({
            parada,
            distancia
         })
    }

    resultado.sort((a, b) => a.distancia - b.distancia)
    
    return resultado.slice(0, quantidade)
}


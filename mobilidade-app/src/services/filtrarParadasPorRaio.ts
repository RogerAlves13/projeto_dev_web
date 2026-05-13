import { calcularDistancia } from "./distancia";
import { ParadaOnibus } from "../types/ParadaOnibus"

export function filtrarParadasPorRaio(
    usuarioLat: number,
    usuarioLon: number,
    paradas: ParadaOnibus[],
    raioKm: number
): ParadaOnibus[] {

    const resultado: ParadaOnibus[] = []

    for (const parada of paradas) {
        const distancia = calcularDistancia(
            usuarioLat,
            usuarioLon,
            parada.latitude,
            parada.longitude
        )

        if (distancia <= raioKm) {
            resultado.push(parada)
        }
    }

    return resultado

}
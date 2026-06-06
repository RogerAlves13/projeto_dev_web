// =====================================
// IMPORTAÇÕES
// =====================================

// Importa o CSS da aplicação
import './style.css'

// Importa a biblioteca Leaflet
import L from 'leaflet'

// Importa o CSS do Leaflet
import 'leaflet/dist/leaflet.css'

  // =====================================
  // CRIAÇÃO DO MAPA
  // =====================================

window.addEventListener('DOMContentLoaded', () => {

  
  const mapa = L.map('mapa').setView(
    [-23.55052, -46.633308],
    13
  )

  // Camada das paradas
const camadaParadas =
  L.layerGroup().addTo(mapa)

  // Camada do OpenStreetMap
  L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap'
    }
  ).addTo(mapa)

  // =====================================
  // GEOLOCALIZAÇÃO AUTOMÁTICA
  // =====================================

  // Verifica suporte do navegador
  if (navigator.geolocation) {

    // Obtém localização do usuário
    navigator.geolocation.getCurrentPosition(

      // SUCESSO
      (posicao) => {

        // Latitude
        const latitude =
          posicao.coords.latitude

        // Longitude
        const longitude =
          posicao.coords.longitude

        console.log('Latitude:', latitude)
        console.log('Longitude:', longitude)

        // Centraliza mapa na posição do usuário
        mapa.setView(
          [latitude, longitude],
          16
        )

        // =====================================
        // ÍCONE CUSTOMIZADO
        // =====================================

        const iconeUsuario = L.divIcon({

          className: '',

          html: `
            <div class="user-location"></div>
          `,

          iconSize: [32, 32],

          iconAnchor: [16, 16]

        })

        // =====================================
        // MARCADOR DO USUÁRIO
        // =====================================

        L.marker(
          [latitude, longitude],
          {
            icon: iconeUsuario
          }
        )
          .addTo(mapa)
          .bindPopup('📍 Você está aqui!')
          .openPopup()

          // Busca paradas próximas
            buscarParadas(
              latitude,
              longitude
            )

            buscarClima(
              latitude,
              longitude
            )

      },

      // ERRO
      (erro) => {

        console.error(
          'Erro ao obter localização:',
          erro
        )

        alert(
          'Não foi possível obter sua localização.'
        )

      }

    )

  } else {

    alert(
      'Geolocalização não suportada.'
    )

  }

  // =====================================
  // ELEMENTOS HTML
  // =====================================

  // Input origem
  const inputOrigem =
    document.querySelector<HTMLInputElement>(
      '#origem'
    )

  // Input destino
  const inputDestino =
    document.querySelector<HTMLInputElement>(
      '#destino'
    )

  // Botão GPS
  const botaoLocalizacao =
    document.querySelector<HTMLButtonElement>(
      '#minha-localizacao'
    )

  // Botão trocar rota
  const botaoTrocar =
    document.querySelector<HTMLButtonElement>(
      '#trocar-rota'
    )

    /* =====================================
   BUSCAR PARADAS PRÓXIMAS
===================================== */

const iconeParada = L.divIcon({

  className: 'custom-bus-icon',

  html: `
    <div class="bus-stop-icon">
      <span>🚌</span>
    </div>
  `,

  iconSize: [40, 40],

  iconAnchor: [20, 20]

})

async function buscarParadas(

  latitude: number,
  longitude: number

) {

  try {

    camadaParadas.clearLayers()

    // Query da Overpass API
    const query = `
      [out:json];

      (
        node
          ["highway"="bus_stop"]
          (around:1000,${latitude},${longitude});
      );

      out;
    `

    // Requisição
    const resposta = await fetch(

      'https://overpass-api.de/api/interpreter',

      {
        method: 'POST',

        body: query
      }

    )

    // JSON da API
    const dados =
      await resposta.json()

    const lista =
    document.querySelector<HTMLUListElement>(
      '#lista-linhas'
    )

  if (!lista) return

  lista.innerHTML = ''

  const linhasMock = [

  {
    nome: '8622-10',
    tempo: '3 min'
  },

  {
    nome: '875A-10',
    tempo: '6 min'
  },

  {
    nome: '809P-10',
    tempo: '8 min'
  }

]

linhasMock.forEach((linha) => {

  lista.innerHTML += `
    <li class="linha-item">

      <span class="linha-nome">
        🚌 ${linha.nome}
      </span>

      <span class="linha-tempo">
        ${linha.tempo}
      </span>

    </li>
  `
})

    //console.log(dados)

    // Percorre paradas
    dados.elements
.slice(0, 5)
.forEach((parada: any) => {

  const lat = parada.lat

  const lon = parada.lon

  const nome =
    parada.tags?.name || 'Parada sem nome'

  L.marker(
    [lat, lon],
    {
      icon: iconeParada
    }
  )
    .addTo(camadaParadas)
    .bindPopup(`
    <strong>🚌 Parada</strong>
    <br>
    ${nome}
  `)

})

  } catch (erro) {

    console.error(
      'Erro ao buscar paradas:',
      erro
    )

  }

}

async function buscarClima(
  latitude: number,
  longitude: number
) {

  try {

    const resposta = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
    )

    const dados: any =
      await resposta.json()

    if (!dados.current) {

      return

    }

    //console.log(dados)


    const temperatura =
      dados.current.temperature_2m

    const cardClima =
      document.querySelector('#clima-card')

    if (cardClima) {

      cardClima!.innerHTML = `
        <h3>🌦️ Clima</h3>
        <p>🌡️ ${temperatura}°C</p>
      `
    }

  } catch (erro) {

    console.error(
      'Erro ao buscar clima:',
      erro
    )

  }

}

  // Botão buscar
  const botaoBuscar =
    document.querySelector<HTMLButtonElement>(
      '#buscar'
    )

  // =====================================
  // VARIÁVEIS DO MAPA
  // =====================================

  // Marcador da busca
  let marcadorBusca: L.Marker | null = null

  // Linha da rota
  let linhaRota: L.Polyline | null = null

  // Marcador de destino
  let marcadorDestino: L.Marker | null = null

  // =====================================
  // BOTÃO MINHA LOCALIZAÇÃO
  // =====================================

  botaoLocalizacao?.addEventListener(

    'click',

    () => {

      // Verifica suporte
      if (!navigator.geolocation) {

        alert(
          'Geolocalização não suportada.'
        )

        return

      }

      // Obtém posição
      navigator.geolocation.getCurrentPosition(

        async (posicao) => {

          // Latitude
          const latitude =
            posicao.coords.latitude

          // Longitude
          const longitude =
            posicao.coords.longitude

          try {

            // =====================================
            // REVERSE GEOCODING
            // Converte coordenadas em endereço
            // =====================================

            const resposta = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
              )

              if (!resposta.ok) {

                alert('Erro ao consultar localização.')

                return

              }

              const dados = await resposta.json()

              console.log(dados)

              if (inputOrigem) {

                inputOrigem.value =
                  dados.display_name

              }
              mapa.setView(
                [latitude, longitude],
                16
              )

          } catch (erro) {

            console.error(erro)

            alert(
              'Erro ao obter localização.'
            )

          }

        }

      )

    }

  )

  // =====================================
  // TROCAR ORIGEM E DESTINO
  // =====================================

  botaoTrocar?.addEventListener(

    'click',

    () => {

      // Verifica inputs
      if (!inputOrigem || !inputDestino) {

        return

      }

      // Guarda origem temporariamente
      const origemAtual =
        inputOrigem.value

      // Troca valores
      inputOrigem.value =
        inputDestino.value

      inputDestino.value =
        origemAtual

    }

  )

  // =====================================
  // BOTÃO BUSCAR
  // =====================================

  botaoBuscar?.addEventListener(

    'click',

    async () => {

      // Valores digitados
      const origem =
        inputOrigem?.value

      const destino =
        inputDestino?.value

      // Verifica se campos foram preenchidos
      if (!origem || !destino) {

        alert(
          'Digite origem e destino.'
        )

        return

      }

      try {

        // =====================================
        // BUSCA ORIGEM
        // =====================================

        const respostaOrigem =
          await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(origem)}`
          )

          if (!respostaOrigem.ok) {

            alert('Erro ao consultar origem.')

            return

          }

        const dadosOrigem: any[] =
          await respostaOrigem.json()

        // =====================================
        // BUSCA DESTINO
        // =====================================

        const respostaDestino =
          await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(destino)}`

          )

          if (!respostaDestino.ok) {

            alert('Erro ao consultar destino.')

            return

          }

        const dadosDestino: any[] =
          await respostaDestino.json()

        console.log(
          dadosOrigem,
          dadosDestino
        )

        // Verifica resultados
        if (
          dadosOrigem.length === 0 ||
          dadosDestino.length === 0
        ) {

          alert(
            'Local não encontrado.'
          )

          return

        }

        // =====================================
        // COORDENADAS ORIGEM
        // =====================================

        const origemLat =
          parseFloat(
            dadosOrigem[0].lat
          )

        const origemLon =
          parseFloat(
            dadosOrigem[0].lon
          )

        // =====================================
        // COORDENADAS DESTINO
        // =====================================

        const destinoLat =
          parseFloat(
            dadosDestino[0].lat
          )

        const destinoLon =
          parseFloat(
            dadosDestino[0].lon
          )

        // =====================================
        // BUSCA ROTA
        // =====================================

        const respostaRota =
          await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origemLon},${origemLat};${destinoLon},${destinoLat}?overview=full&geometries=geojson`
          )

          if (!respostaRota.ok) {

            alert('Erro ao calcular rota.')

            return

          }

        const dadosRota =
          await respostaRota.json()

        // Coordenadas da rota
        if (
              !dadosRota.routes ||
              dadosRota.routes.length === 0
            ) {

              alert('Rota não encontrada.')

              return

            }

        const distanciaMetros =
          dadosRota.routes[0].distance

        const tempoSegundos =
          dadosRota.routes[0].duration

        const distanciaKm =
          (distanciaMetros / 1000)
          .toFixed(1)

        const tempoMinutos =
          Math.round(
            tempoSegundos / 60
          )
        
        const rotaCard =
          document.querySelector<HTMLParagraphElement>(
            '#rota-card p'
          )

        if (rotaCard) {

          rotaCard.innerHTML = `
            📏 ${distanciaKm} km
            <br>
            ⏱️ ${tempoMinutos} min
          `

        }

        const coordenadas =
          dadosRota.routes[0]
            .geometry.coordinates

        // =====================================
        // CONVERTE COORDENADAS
        // =====================================

        const rotaLatLng:
          L.LatLngTuple[] =

          coordenadas.map(
            (
              coord: [number, number]
            ) => [

              coord[1],
              coord[0]

            ]
          )

        // =====================================
        // REMOVE ROTA ANTERIOR
        // =====================================

        if (linhaRota) {

          mapa.removeLayer(
            linhaRota
          )

        }

        // =====================================
        // CRIA NOVA ROTA
        // =====================================

        linhaRota = L.polyline(

          rotaLatLng,

          {
            color: '#1e90ff',
            weight: 6
          }

        ).addTo(mapa)

        // Ajusta zoom automaticamente
        mapa.fitBounds(rotaLatLng)

        // =====================================
        // REMOVE MARCADOR ANTERIOR
        // =====================================

        if (marcadorBusca) {

          mapa.removeLayer(
            marcadorBusca
          )

        }

        // =====================================
        // CRIA NOVO MARCADOR
        // =====================================

        marcadorBusca = L.marker(
          [origemLat, origemLon]
        )

          .addTo(mapa)
          .bindPopup('📍 Origem')

        if (marcadorDestino) {

          mapa.removeLayer(
            marcadorDestino
          )

        }

        marcadorDestino = L.marker(
          [destinoLat, destinoLon]
        )
        .addTo(mapa)
        .bindPopup(
          `🏁 ${dadosDestino[0].display_name}`
        )
        .openPopup()

      } catch (erro) {

        console.error(erro)

        alert(
          'Erro ao buscar local.'
        )

      }

    }

  )
})
//console.log(document.body.innerHTML)

// =====================================
// IMPORTAÇÕES
// =====================================

// Importa o banco de dados
import { supabase } from './services/supabase'

// Importa a autenticação do login da pasta services/auth
import { login } from './services/auth'

// Importa a autenticação do cadastro da pasta services/auth
import { cadastrar } from './services/auth'

// Importa o CSS da aplicação
import './style.css'

// Importa a biblioteca Leaflet
import L from 'leaflet'

// Importa o CSS do Leaflet
import 'leaflet/dist/leaflet.css'

// Importa as estações
import { estacoes } from './dados/estacoes.ts'

// Importa as linha de ônibus
import { linhasMock } from './dados/linhas.ts'

/*interface Historico {

  origem: string

  destino: string

  data: string

}
*/

interface FavoritoBanco {

  id: number

  usuario_id: string

  nome: string

  endereco: string

  latitude: number

  longitude: number

  criado_em: string

}

interface HistoricoBanco {

  id: number

  usuario_id: string

  origem: string

  destino: string

  criado_em: string

}

async function obterUsuarioAtual() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user

}

async function obterPerfil() {

  const user =
    await obterUsuarioAtual()

  if (!user) {

    return null

  }

  const { data, error } = await supabase
  .from("perfis")
  .select("*")
  .eq("id", user.id)
  .maybeSingle()

  if (error) {

    console.error(error)

    return null

  }

  return data

}

async function atualizarPerfil(
  nome: string,
  cpf: string,
  fotoPerfil: string
) {

  const usuario =
    await obterUsuarioAtual()

  if (!usuario) return

  const { error } =
    await supabase

      .from('perfis')

      .update({

        nome,

        cpf,

        foto_perfil: fotoPerfil

      })

      .eq(
        'id',
        usuario.id
      )

  if (error) {

    console.error(error)

  }

}

async function atualizarInterfaceUsuario() {

  const usuario =
    await obterUsuarioAtual()

  const spanUsuario =
    document.querySelector('#usuario')

  const btnLogin =
    document.querySelector('#btn-login')

  const btnCadastro =
    document.querySelector('#btn-cadastro')

  const btnLogout =
    document.querySelector('#btn-logout')

  if (usuario) {

    if (spanUsuario) {

      const perfil =
        await obterPerfil()

      spanUsuario.textContent =
        `👤 ${
          perfil?.nome ||
          usuario.email
        }`

    }

    btnLogin?.setAttribute(
      'style',
      'display:none'
    )

    btnCadastro?.setAttribute(
      'style',
      'display:none'
    )

    btnLogout?.setAttribute(
      'style',
      'display:block'
    )

  } else {

    if (spanUsuario) {

      spanUsuario.textContent = ''

    }

    btnLogout?.setAttribute(
      'style',
      'display:none'
    )

  }

}
async function obterFavoritosBanco():
Promise<FavoritoBanco[]> {

  const usuario =
    await obterUsuarioAtual()

  if (!usuario) {

    return []

  }

  const {
    data,
    error
  } = await supabase

    .from('locais_salvos')
    .select('*')
    .eq('usuario_id', usuario.id)

  if (error) {

    console.error(error)

    return []

  }

  return data || []

}

async function removerFavoritoBanco(
  id: number
) {

  const { error } =
    await supabase

      .from('locais_salvos')

      .delete()

      .eq('id', id)

  if (error) {

    console.error(error)

  }

}

async function salvarFavoritoBanco(
  nome: string,
  endereco: string,
  latitude: number,
  longitude: number
) {

  const usuario =
    await obterUsuarioAtual()

  if (!usuario) {

    alert('Faça login primeiro.')

    return

  }

  const { error } =
    await supabase

      .from('locais_salvos')

      .insert({

        usuario_id: usuario.id,

        nome,

        endereco,

        latitude,

        longitude

      })

  if (error) {

    console.error(error)

  }

}

async function atualizarFavoritoBanco(
  id: number,
  nome: string
) {

  const { error } =
    await supabase

      .from('locais_salvos')

      .update({

        nome

      })

      .eq('id', id)

  if (error) {

    console.error(error)

  }

}

async function obterHistoricoBanco():
Promise<HistoricoBanco[]> {

  const usuario =
    await obterUsuarioAtual()

  if (!usuario) {

    return []

  }

  const {
    data,
    error
  } = await supabase

    .from('historico_buscas')

    .select('*')

    .eq(
      'usuario_id',
      usuario.id
    )

    .order(
      'criado_em',
      {
        ascending: false
      }
    )

  if (error) {

    console.error(error)

    return []

  }

  return data || []

}

async function salvarHistoricoBanco(
  origem: string,
  destino: string
) {

  const usuario =
    await obterUsuarioAtual()

  if (!usuario) {

    return

  }

  const { error } =
    await supabase

      .from('historico_buscas')

      .insert({

        usuario_id:
          usuario.id,

        origem,

        destino

      })

  if (error) {

    console.error(error)

  }

}

async function removerHistoricoBanco(
  id: number
) {

  const { error } =
    await supabase

      .from('historico_buscas')

      .delete()

      .eq('id', id)

  if (error) {

    console.error(error)

  }

}

async function adicionarHistorico(
  origem: string,
  destino: string
) {

  await salvarHistoricoBanco(

    origem,

    destino

  )

  await carregarHistorico()

}

async function carregarHistorico() {

  const historico =
   await  obterHistoricoBanco()

  const lista =
    document.querySelector<HTMLUListElement>(
      '#lista-historico'
    )

  if (!lista) return

  if (historico.length === 0) {

    lista.innerHTML =
      '<li>Nenhuma busca realizada</li>'

    return

  }

  lista.innerHTML =
  historico.map(
    (item, indice) => `

<li class="historico-item">

  <div
    class="historico-conteudo"
    data-indice="${indice}"
    data-origem="${item.origem}"
    data-destino="${item.destino}">

    <strong>
      ${item.destino}
    </strong>

    <br>

    <small>
      ${item.origem}
    </small>

  </div>

  <button
    class="btn-remover-historico"
    data-indice="${indice}">
    ❌
  </button>

</li>
`
).join('')

  document
    .querySelectorAll('.historico-conteudo')
    .forEach(item => {

      item.addEventListener(
        'click',
        () => {

          const origem =
            item.getAttribute(
              'data-origem'
            )

          const destino =
            item.getAttribute(
              'data-destino'
            )

          const inputOrigem =
            document.querySelector<HTMLInputElement>(
              '#origem'
            )

          const inputDestino =
            document.querySelector<HTMLInputElement>(
              '#destino'
            )

          if (
            !inputOrigem ||
            !inputDestino
          ) return

          inputOrigem.value =
            origem || ''

          inputDestino.value =
            destino || ''

          document
            .querySelector<HTMLButtonElement>(
              '#buscar'
            )
            ?.click()

        }

      )

    })

  document
  .querySelectorAll(
    '.btn-remover-historico'
  )
  .forEach(botao => {

    botao.addEventListener(
      'click',
     async (evento) => {

        evento.stopPropagation()

        const indice =
          Number(
            botao.getAttribute(
              'data-indice'
            )
          )

        removerHistorico(
          indice
        )

      }
    )

  })

}

//console.log('IMPORT LINHAS: ', linhasMock)

// =====================================
// FUNÇÃO PARA CÁLCULO DE DISTÂNCIA
// =====================================
function calcularDistancia(

  lat1:number,
  lon1:number,
  lat2:number,
  lon2:number

){

  const R = 6371

  const dLat =
    (lat2 - lat1) * Math.PI / 180

  const dLon =
    (lon2 - lon1) * Math.PI / 180

  const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180)

    *

    Math.sin(dLon/2) *
    Math.sin(dLon/2)

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1-a)
    )

  return R * c

}

// =====================================
// FUNÇÃO PARA LOCALIZAÇÃO DA ESTAÇÃO MAIS PRÓXIMA
// =====================================

function buscarEstacaoMaisProxima(

  latitude:number,
  longitude:number

){

  let estacaoMaisProxima =
    estacoes[0]

  let menorDistancia =
    Infinity

  estacoes.forEach((estacao) => {

    const distancia =
      calcularDistancia(

        latitude,
        longitude,

        estacao.lat,
        estacao.lon

      )

    if (distancia < menorDistancia){

      menorDistancia =
        distancia

      estacaoMaisProxima =
        estacao

    }

  })

  return {

    estacao:
      estacaoMaisProxima,

    distancia:
      menorDistancia

  }

}

  // =====================================
  // CRIAÇÃO DO MAPA
  // =====================================

async function carregarFavoritos() {

  const favoritos =
    await obterFavoritosBanco()

  const lista =
    document.querySelector<HTMLUListElement>(
      '#lista-favoritos'
    )

  if (!lista) return

  lista.innerHTML = ''

  if (favoritos.length === 0) {

    lista.innerHTML =
      '<li>Nenhum favorito salvo</li>'

    return

  }

  lista.innerHTML =
  favoritos.map(
    (
      favorito: FavoritoBanco,
      indice: number
    ) => `

      <li class="favorito-item">

        <div>

          <strong>
            ${favorito.nome}
          </strong>

          <br>

          <small>
            ${favorito.endereco}
          </small>

        </div>

        <div class="acoes-favorito">

          <button
            class="btn-ir"
            data-indice="${indice}">
            🚀
          </button>

          <button
            class="btn-editar"
            data-indice="${indice}">
            ✏️
          </button>

          <button
            class="btn-remover"
            data-indice="${indice}">
            ❌
          </button>

        </div>

      </li>

    `
  ).join('')

// Botão remover
document
  .querySelectorAll('.btn-remover')
  .forEach(botao => {

    botao.addEventListener(
      'click',
      async () => {

        const indice =
          Number(
            botao.getAttribute(
              'data-indice'
            )
          )

        const favoritos =
          await obterFavoritosBanco()

        await removerFavoritoBanco(
          favoritos[indice].id
        )

        await carregarFavoritos()

      }
    )

  })

// Botão editar
document
  .querySelectorAll('.btn-editar')
  .forEach(botao => {

    botao.addEventListener(
      'click',
      async () => {

        const indice =
          Number(
            botao.getAttribute(
              'data-indice'
            )
          )

        const favoritos =
           await obterFavoritosBanco()

        const novoNome =
          prompt(
            'Novo nome:',
            favoritos[indice].nome
          )

        if (!novoNome) return

        await atualizarFavoritoBanco(

          favoritos[indice].id,

          novoNome

        )

        await carregarFavoritos()

      }
    )

  })

// Botão ir
document
  .querySelectorAll('.btn-ir')
  .forEach(botao => {

    botao.addEventListener(
      'click',
      async () => {

        const indice =
          Number(
            botao.getAttribute(
              'data-indice'
            )
          )

        const favoritos =
           await obterFavoritosBanco()
          

        const inputDestino =
          document.querySelector<HTMLInputElement>(
            '#destino'
          )

        if (!inputDestino) return

        inputDestino.value =
          favoritos[indice].endereco

      }
    )

  }) 

}

async function removerHistorico(
  indice: number
) {

  const historico =
    await obterHistoricoBanco()

  await removerHistoricoBanco(

    historico[indice].id

  )

  await carregarHistorico()

}

window.addEventListener('DOMContentLoaded', async () => {

/*console.log(
  document.querySelector('#favoritos-card')
)

console.log(
  document.querySelector('#lista-favoritos')
)
*/

await carregarFavoritos()

await carregarHistorico()

await atualizarInterfaceUsuario()

const btnChat =
  document.querySelector<HTMLButtonElement>(
    '#btn-chat-ia'
  )

const chat =
  document.querySelector<HTMLDivElement>(
    '#chat-ia'
  )

btnChat?.addEventListener(
  'click',
  () => {

    if (!chat) return

    chat.style.display =
      chat.style.display === 'flex'
      ? 'none'
      : 'flex'

  }
)

const btnEnviarIA =
  document.querySelector<HTMLButtonElement>(
    '#enviar-ia'
  )

btnEnviarIA?.addEventListener(
  'click',
  enviarPerguntaIA
)

const inputIA =
  document.querySelector<HTMLInputElement>(
    '#input-ia'
  )

inputIA?.addEventListener(
  'keydown',
  (evento) => {

    if (evento.key === 'Enter') {

      enviarPerguntaIA()

    }

  }
)

const btnFavoritar =
  document.querySelector<HTMLButtonElement>(
    '#favoritar-destino'
  )

btnFavoritar?.addEventListener(
  'click',
  async () => {

    const destino =
      document.querySelector<HTMLInputElement>(
        '#destino'
      )

    if (!destino?.value.trim()) {
      alert('Digite um destino primeiro.')
      return
    }

    const apelido =
      prompt('Nome do favorito:', 'Casa')

    if (!apelido) return

    await salvarFavoritoBanco(

      apelido,

      destino.value,

      ultimoDestinoLat,

      ultimoDestinoLon

    )

    await carregarFavoritos()

  }
)
  
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

        //console.log('Latitude:', latitude)
        //console.log('Longitude:', longitude)

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

            buscarLinhasReais(
              latitude,
              longitude
            )

          const resultado =
            buscarEstacaoMaisProxima(
              latitude,
              longitude
            )

              console.log(resultado)
          const nomeEstacao =
          document.querySelector(
            '#nome-estacao'
          )

          const imagemEstacao =
            document.querySelector<HTMLImageElement>(
              '#imagem-estacao'
            )

          if (nomeEstacao) {

            nomeEstacao.textContent =
              `${resultado.estacao.nome}
                (${resultado.distancia.toFixed(1)} km)`

          }

          if (imagemEstacao) {

            imagemEstacao.src =
              resultado.estacao.imagem

          }

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

if (!resposta.ok) {

  console.warn(
    `Overpass indisponível (${resposta.status})`
  )

  return

}
    // JSON da API
    const dados =
      await resposta.json()

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

async function buscarLinhasReais(
  latitude:number,
  longitude:number
) {

  try {

    const query = `
      [out:json];

      relation
        ["route"="bus"]
        (around:1000,${latitude},${longitude});

      out tags;
    `

    const resposta = await fetch(
        'https://overpass-api.de/api/interpreter',
        {
          method: 'POST',
          body: query
        }
      )

      if (!resposta.ok) {

        console.warn(
          `Overpass indisponível (${resposta.status})`
        )

        linhasMock.forEach((linha) => {

          lista!.innerHTML += `
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

        return

      }

      const dados = 
      await resposta.json()

    const lista =
      document.querySelector<HTMLUListElement>(
        '#lista-linhas'
      )

    if (!lista) return

    lista.innerHTML = ''

    if (
  !dados.elements ||
  dados.elements.length === 0
) {

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

  return
}

    const linhasUnicas =
      new Map<string, string>()

    dados.elements.forEach(
      (linha:any) => {

        const codigo =
          linha.tags?.ref ||
          'Sem código'

        const nomeCompleto =
          linha.tags?.name ||
          'Linha sem nome'

        const nome =
          nomeCompleto.replace(
            codigo,
            ''
          ).trim()

        linhasUnicas.set(
          codigo,
          nome
        )

      }
    )

      linhasUnicas.forEach(
        (nome, codigo) => {

          const tempoChegada =
            Math.floor(
              Math.random() * 15
            ) + 2

        lista.innerHTML += `
          <li class="linha-item">

            <span class="linha-nome">
              🚌 ${codigo} - ${nome}
            </span>

            <span class="linha-tempo">
              ⏱️ ${tempoChegada} min
            </span>

          </li>
        `
      }
    )

  } catch (erro) {

    console.error(
      'Erro ao buscar linhas:',
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

      cardClima.innerHTML = `
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

  let ultimoDestinoLat = 0

  let ultimoDestinoLon = 0

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

              if (!resposta.ok) {

                console.error(
                  'Erro Overpass:',
                  resposta.status
                )

                return

              }

              const dados =
                await resposta.json()

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

          ultimoDestinoLat = destinoLat

          ultimoDestinoLon = destinoLon

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

        await adicionarHistorico(

        origem,

        destino

      )
      } catch (erro) {

        console.error(erro)

        alert(
          'Erro ao buscar local.'
        )

      }

    }

  )

})

// =====================================
// CONEXÃO COM O BANCO DE DADOS
// =====================================

async function testarSupabase() {

  const { data, error } =
    await supabase
      .from('paradas')
      .select('*')
      .limit(1)

  console.log(data)
  console.log(error)

}

testarSupabase()

// =====================================
// OPERAÇÃO DE CADASTRO / LOGIN
// =====================================

const btnLogin =
  document.querySelector('#btn-login')

btnLogin?.addEventListener(

  'click',

  async () => {

    const email =
      prompt('Email')

    const senha =
      prompt('Senha')

    if(
      !email ||
      !senha
    ){
      return
    }

    const {

      error

    } = await login(

      email,

      senha

    )

    if(error){

      alert(
        error.message
      )

      return
    }

    alert(
      'Login realizado!'
    )

    await carregarFavoritos()

    await atualizarInterfaceUsuario()

    await carregarFavoritos()

  const favoritos =
    await obterFavoritosBanco()

console.log(favoritos)

  }

)

const btnCadastro =
  document.querySelector('#btn-cadastro')

btnCadastro?.addEventListener(

  'click',

  async () => {

    const email =
      prompt('Email')

    const senha =
      prompt('Senha')

    if(
      !email ||
      !senha
    ){
      return
    }

    const {

      error

    } = await cadastrar(

      email,

      senha

    )

    if(error){

      alert(
        error.message
      )

      return
    }

    alert(
      'Conta criada!'
    )

  }

)

const btnLogout =
  document.querySelector('#btn-logout')

btnLogout?.addEventListener(

  'click',

  async () => {

    await supabase.auth.signOut()

    location.reload()

  }

)

const btnPerfil =
  document.querySelector('#btn-perfil')

btnPerfil?.addEventListener(
  'click',
  async () => {

    const perfil =
      await obterPerfil()

    const nome =
      prompt(
        'Nome:',
        perfil?.nome || ''
      )

    if (nome === null) return

    const cpf =
      prompt(
        'CPF:',
        String(
          perfil?.cpf || ''
        )
      )

    if (cpf === null) return

    const foto =
      prompt(
        'URL da foto:',
        perfil?.foto_perfil || ''
      )

    if (foto === null) return

    await atualizarPerfil(

      nome,

      cpf,

      foto

    )

    await atualizarInterfaceUsuario()

    alert(
      'Perfil atualizado!'
    )

  }
)

async function perguntarIA(
  pergunta:string,
  contexto:any
) {

  const resposta =
    await fetch(
      'http://localhost:3000/api/ia',
      {

        method:'POST',

        headers:{
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({

          pergunta,
          contexto

        })

      }
    )

  return await resposta.json()

}

async function enviarPerguntaIA() {

  const input =
    document.querySelector<HTMLInputElement>(
      '#input-ia'
    )

  const mensagens =
    document.querySelector<HTMLDivElement>(
      '#chat-mensagens'
    )

  if (
    !input ||
    !mensagens
  ) return

  const pergunta =
    input.value.trim()

  if (!pergunta) return

  mensagens.innerHTML += `
    <div class="msg-usuario">
       ${pergunta} 👤
    </div>
  `

  mensagens.scrollTop =
  mensagens.scrollHeight

  input.value = ''

  try {

    const resposta =
      await perguntarIA(
        pergunta,
        {}
      )

    mensagens.innerHTML += `
      <div class="msg-ia">
        🤖 ${resposta.resposta}
      </div>
    `

    mensagens.scrollTop =
      mensagens.scrollHeight

  } catch {

    mensagens.innerHTML += `
      <div class="msg-erro">
        ❌ Erro ao consultar IA
      </div>
    `

  }

}
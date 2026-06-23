// Inicializa o mapa
const mapa = L.map('mapa').setView([-23.55052, -46.633308], 13);

// Camada OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(mapa);

// Marcadores e rota
let marcadorOrigem = null;
let marcadorDestino = null;
let linhaRota = null;

// Geolocalização automática
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((posicao) => {

        const lat = posicao.coords.latitude;
        const lon = posicao.coords.longitude;

        mapa.setView([lat, lon], 15);

        marcadorOrigem = L.marker([lat, lon])
            .addTo(mapa)
             .bindPopup('📍 Você está aqui!')
          .openPopup()
    });
}

// Botão Buscar
document.getElementById("botaoBuscarClaro")
.addEventListener("click", async () => {

    const origem = document.getElementById("inputPartidaClaro").value;
    const destino = document.getElementById("inputChegadaClaro").value;

    if (!origem || !destino) {
        alert("Preencha origem e destino.");
        return;
    }

    try {

        // Busca origem
        const respostaOrigem = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origem)}`
        );

        const dadosOrigem = await respostaOrigem.json();

        // Busca destino
        const respostaDestino = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destino)}`
        );

        const dadosDestino = await respostaDestino.json();

        if (
            dadosOrigem.length === 0 ||
            dadosDestino.length === 0
        ) {
            alert("Local não encontrado.");
            return;
        }

        const origemLat = parseFloat(dadosOrigem[0].lat);
        const origemLon = parseFloat(dadosOrigem[0].lon);

        const destinoLat = parseFloat(dadosDestino[0].lat);
        const destinoLon = parseFloat(dadosDestino[0].lon);

        // Remove marcadores antigos
        if (marcadorOrigem) mapa.removeLayer(marcadorOrigem);
        if (marcadorDestino) mapa.removeLayer(marcadorDestino);
        if (linhaRota) mapa.removeLayer(linhaRota);

        // Adiciona marcadores
        marcadorOrigem = L.marker([origemLat, origemLon])
            .addTo(mapa)
            .bindPopup("Partida");

        marcadorDestino = L.marker([destinoLat, destinoLon])
            .addTo(mapa)
            .bindPopup("Destino");

        // Busca rota
        const respostaRota = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origemLon},${origemLat};${destinoLon},${destinoLat}?overview=full&geometries=geojson`
        );

        const dadosRota = await respostaRota.json();

        const coordenadas =
            dadosRota.routes[0].geometry.coordinates;

        const rotaLatLng = coordenadas.map(coord => [
            coord[1],
            coord[0]
        ]);

        linhaRota = L.polyline(rotaLatLng, {
            color: '#0d6efd',
            weight: 6
        }).addTo(mapa);

        mapa.fitBounds(linhaRota.getBounds(), {
            padding: [50, 50]
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao buscar rota.");
    }
});

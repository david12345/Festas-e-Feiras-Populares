// Vista de mapa (Leaflet + OpenStreetMap).
(function () {
  "use strict";

  let mapa = null;
  let camadaMarcadores = null;

  function garantirMapa() {
    if (typeof L === "undefined") {
      document.getElementById("view-mapa").innerHTML =
        '<p class="vazio">O mapa não está disponível (a biblioteca Leaflet não carregou).</p>';
      return null;
    }
    if (mapa) return mapa;
    mapa = L.map("mapa", { scrollWheelZoom: true }).setView([39.6, -8.0], 7);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);
    camadaMarcadores = L.layerGroup().addTo(mapa);
    return mapa;
  }

  function render(eventos, aoAbrirDetalhe) {
    if (!garantirMapa()) return;
    camadaMarcadores.clearLayers();
    const pontos = [];

    for (const ev of eventos) {
      if (typeof ev.lat !== "number" || typeof ev.lng !== "number") continue;
      const cat = U.categoriaInfo(ev.categoria);
      const marcador = L.circleMarker([ev.lat, ev.lng], {
        radius: 9, color: "#ffffff", weight: 2,
        fillColor: cat.cor, fillOpacity: 0.9
      });
      const html =
        '<div class="popup-evento">' +
        '<strong>' + cat.emoji + " " + U.escapaHtml(ev.nome) + "</strong><br>" +
        U.escapaHtml(ev.municipio) + " · " + U.escapaHtml(U.formataIntervalo(ev)) + "<br>" +
        '<button class="popup-detalhe" data-id="' + U.escapaAttr(ev.id) + '">Ver detalhes</button>' +
        "</div>";
      marcador.bindPopup(html);
      marcador.on("popupopen", function (e) {
        const btn = e.popup.getElement().querySelector(".popup-detalhe");
        if (btn) btn.addEventListener("click", () => aoAbrirDetalhe(ev.id));
      });
      marcador.addTo(camadaMarcadores);
      pontos.push([ev.lat, ev.lng]);
    }

    if (pontos.length) {
      mapa.fitBounds(L.latLngBounds(pontos).pad(0.15));
    }
    // O Leaflet precisa de recalcular o tamanho quando o contentor passa a visível.
    setTimeout(() => mapa.invalidateSize(), 60);
  }

  function focar(ev) {
    if (!garantirMapa()) return;
    if (typeof ev.lat === "number" && typeof ev.lng === "number") {
      mapa.setView([ev.lat, ev.lng], 13);
    }
    setTimeout(() => mapa.invalidateSize(), 60);
  }

  window.MapView = { render, focar };
})();

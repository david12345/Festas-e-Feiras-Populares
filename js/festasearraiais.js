// Conector para https://festasearraiais.pt/ — importa eventos do site para a aplicação.
// Usa os utilitários partilhados de WebFontes (proxies CORS, JSON-LD, geocodificação).
(function () {
  "use strict";

  const BASE = "https://festasearraiais.pt";
  const ORIGEM = "festasearraiais";
  const MAX_PAGINAS = 80; // limite de páginas a descarregar por importação

  async function urlsDoSitemap() {
    for (const caminho of ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"]) {
      try {
        const xml = await WebFontes.fetchTexto(BASE + caminho);
        let urls = WebFontes.extrairLocs(xml);
        // Índice de sitemaps: descer um nível.
        const subSitemaps = urls.filter(u => /\.xml(\?|$)/i.test(u)).slice(0, 10);
        if (subSitemaps.length && subSitemaps.length === urls.length) {
          urls = [];
          for (const sm of subSitemaps) {
            try { urls = urls.concat(WebFontes.extrairLocs(await WebFontes.fetchTexto(sm))); } catch (e) { /* segue */ }
          }
        }
        urls = urls.filter(u => u.startsWith(BASE) && !/\.xml(\?|$)/i.test(u));
        if (urls.length) return urls;
      } catch (err) { /* tenta o caminho seguinte */ }
    }
    return [];
  }

  // Sem sitemap: páginas de listagem conhecidas (distritos e ilhas).
  function paginasPorOmissao() {
    const distritos = ["aveiro", "beja", "braga", "braganca", "castelo-branco", "coimbra",
      "evora", "faro", "guarda", "leiria", "lisboa", "portalegre", "porto", "santarem",
      "setubal", "viana-do-castelo", "vila-real", "viseu",
      "ilha-da-madeira", "ilha-de-sao-miguel", "ilha-terceira", "ilha-do-pico",
      "ilha-do-faial", "ilha-de-sao-jorge", "ilha-graciosa", "ilha-das-flores",
      "ilha-de-santa-maria", "ilha-de-porto-santo"];
    return [BASE + "/"].concat(distritos.map(d => BASE + "/distrito/" + d));
  }

  // Fallback: ligações para páginas de evento no HTML de listagem.
  function ligacoesDeEventos(html) {
    const urls = new Set();
    const re = /href=["']([^"']+)["']/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      let u = m[1];
      if (u.startsWith("/")) u = BASE + u;
      if (!u.startsWith(BASE)) continue;
      if (/\/(evento|eventos|festa|festas|arraial|feira)s?\/[^/]+\/?$/i.test(u) &&
          !/\/(distrito|festas-este-mes|festas-perto-de-mim|categoria|sobre|contacto)s?\//i.test(u)) {
        urls.add(u.split("#")[0].split("?")[0]);
      }
    }
    return Array.from(urls);
  }

  function normalizarEvento(bruto) {
    return {
      id: ORIGEM + "-" + U.slug(bruto.nome + "-" + (bruto.municipio || "") + "-" + (bruto.inicio || "")),
      nome: bruto.nome,
      categoria: WebFontes.categoriaHeuristica(bruto.nome),
      municipio: bruto.municipio || "Portugal",
      distrito: bruto.distrito || "",
      regiao: "",
      local: bruto.local || "",
      lat: bruto.lat, lng: bruto.lng,
      inicio: bruto.inicio, fim: bruto.fim,
      estadoData: bruto.inicio ? "confirmada" : "estimada",
      descricao: bruto.descricao || "",
      origem: ORIGEM,
      fonte: { nome: "Festas & Arraiais", url: bruto.url || BASE },
      fontesAdicionais: [{ nome: "festasearraiais.pt", url: BASE }]
    };
  }

  async function importar(progresso) {
    progresso = progresso || function () {};
    const vistos = new Set();
    const brutos = [];
    let paginasLidas = 0;

    progresso("A procurar o sitemap de festasearraiais.pt…");
    let paginas = await urlsDoSitemap();
    if (!paginas.length) paginas = paginasPorOmissao();

    // Prioridade: páginas que parecem ser de eventos individuais, depois listagens.
    const deEvento = paginas.filter(u => /\/(evento|festa|arraial)s?\//i.test(u));
    const restantes = paginas.filter(u => !deEvento.includes(u));
    let fila = deEvento.concat(restantes).slice(0, MAX_PAGINAS);

    for (let i = 0; i < fila.length && paginasLidas < MAX_PAGINAS; i++) {
      const url = fila[i];
      if (vistos.has(url)) continue;
      vistos.add(url);
      progresso("festasearraiais.pt: página " + (paginasLidas + 1) + "/" + Math.min(fila.length, MAX_PAGINAS) + "…");
      let html;
      try { html = await WebFontes.fetchTexto(url); } catch (err) { continue; }
      paginasLidas++;

      const encontrados = WebFontes.eventosDoJsonLd(html, url, BASE);
      brutos.push(...encontrados);

      // Em páginas de listagem sem eventos JSON-LD, segue as ligações para eventos.
      if (!encontrados.length) {
        for (const lig of ligacoesDeEventos(html)) {
          if (!vistos.has(lig) && fila.length < MAX_PAGINAS * 2) fila.push(lig);
        }
      }
    }

    if (!brutos.length) {
      throw new Error("não foi possível extrair eventos (" + paginasLidas +
        " páginas lidas). O site pode estar a bloquear os proxies CORS — tente novamente mais tarde.");
    }

    // Normaliza e remove duplicados (mesmo nome+município+data).
    const porId = new Map();
    for (const b of brutos) {
      const ev = normalizarEvento(b);
      if (!porId.has(ev.id)) porId.set(ev.id, ev);
    }
    const eventos = Array.from(porId.values());

    await WebFontes.geocodificar(eventos, progresso, 30);

    return { eventos, paginasLidas };
  }

  window.FestasArraiais = { importar, BASE, ORIGEM };
})();

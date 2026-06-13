// Conector para https://festasearraiais.pt/ — importa eventos do site para a aplicação.
//
// Como a aplicação corre só no browser, o acesso ao site pode ser bloqueado por CORS.
// Estratégia: tentar fetch direto e, se falhar, recorrer a proxies CORS públicos.
// A extração privilegia dados estruturados schema.org (JSON-LD "Event"), o formato
// que os sites de eventos publicam para SEO, com fallback a parsing genérico do HTML.
(function () {
  "use strict";

  const BASE = "https://festasearraiais.pt";
  const ORIGEM = "festasearraiais";
  const MAX_PAGINAS = 80; // limite de páginas a descarregar por importação

  const PROXIES = [
    (u) => u, // direto (caso o site permita CORS)
    (u) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
    (u) => "https://corsproxy.io/?url=" + encodeURIComponent(u),
    (u) => "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u)
  ];

  async function fetchTexto(url) {
    let ultimoErro = null;
    for (const proxy of PROXIES) {
      try {
        const resp = await fetch(proxy(url), { redirect: "follow" });
        if (!resp.ok) { ultimoErro = new Error("HTTP " + resp.status); continue; }
        const texto = await resp.text();
        if (texto && texto.length > 50) return texto;
        ultimoErro = new Error("resposta vazia");
      } catch (err) {
        ultimoErro = err;
      }
    }
    throw ultimoErro || new Error("sem resposta");
  }

  // ------------------------------------------------------------ Sitemap ---

  function extrairLocs(xml) {
    const locs = [];
    const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
    let m;
    while ((m = re.exec(xml)) !== null) locs.push(m[1].trim());
    return locs;
  }

  async function urlsDoSitemap() {
    for (const caminho of ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"]) {
      try {
        const xml = await fetchTexto(BASE + caminho);
        let urls = extrairLocs(xml);
        // Índice de sitemaps: descer um nível.
        const subSitemaps = urls.filter(u => /\.xml(\?|$)/i.test(u)).slice(0, 10);
        if (subSitemaps.length && subSitemaps.length === urls.length) {
          urls = [];
          for (const sm of subSitemaps) {
            try { urls = urls.concat(extrairLocs(await fetchTexto(sm))); } catch (e) { /* segue */ }
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

  // ------------------------------------------------- Extração de eventos ---

  function aplanarJsonLd(no, acc) {
    if (!no) return acc;
    if (Array.isArray(no)) { no.forEach(n => aplanarJsonLd(n, acc)); return acc; }
    if (typeof no !== "object") return acc;
    const tipo = no["@type"];
    const tipos = Array.isArray(tipo) ? tipo : [tipo];
    if (tipos.some(t => typeof t === "string" && /Event$/i.test(t))) acc.push(no);
    // Desce em @graph, itemListElement, etc.
    for (const chave of ["@graph", "itemListElement", "item", "subEvent", "mainEntity"]) {
      if (no[chave]) aplanarJsonLd(no[chave], acc);
    }
    return acc;
  }

  function eventosDoJsonLd(html, urlPagina) {
    const eventos = [];
    const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      try {
        const json = JSON.parse(m[1].trim());
        for (const no of aplanarJsonLd(json, [])) {
          const ev = converterJsonLd(no, urlPagina);
          if (ev) eventos.push(ev);
        }
      } catch (err) { /* JSON inválido — ignora este bloco */ }
    }
    return eventos;
  }

  function textoDe(v) {
    if (v == null) return "";
    if (typeof v === "string") return v.trim();
    if (typeof v === "object") return textoDe(v.name || v["@value"] || "");
    return String(v);
  }

  function dataIso(v) {
    if (!v || typeof v !== "string") return null;
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? m[1] + "-" + m[2] + "-" + m[3] : null;
  }

  function converterJsonLd(no, urlPagina) {
    const nome = textoDe(no.name);
    if (!nome) return null;
    const loc = no.location || {};
    const morada = (loc && loc.address) || {};
    const geo = (loc && loc.geo) || {};
    const municipio = textoDe(morada.addressLocality) || textoDe(loc.name) || "";
    const url = (typeof no.url === "string" && no.url) ? no.url : urlPagina;
    const ev = {
      nome: nome,
      municipio: municipio || "Portugal",
      distrito: textoDe(morada.addressRegion) || "",
      local: textoDe(loc.name) || "",
      inicio: dataIso(no.startDate),
      fim: dataIso(no.endDate) || dataIso(no.startDate),
      descricao: textoDe(no.description),
      url: url.startsWith("http") ? url : BASE + url
    };
    const lat = parseFloat(geo.latitude), lng = parseFloat(geo.longitude);
    if (isFinite(lat) && isFinite(lng)) { ev.lat = lat; ev.lng = lng; }
    return ev;
  }

  // Fallback: liga­ções para páginas de evento no HTML de listagem.
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

  function categoriaHeuristica(nome) {
    const n = U.normaliza(nome);
    if (/(medieval|quinhentist|renascentist|templari|viking|romano)/.test(n)) return "feira-medieval";
    if (/artesanato|artesa/.test(n)) return "feira-artesanato";
    if (/carnaval|entrudo/.test(n)) return "carnaval";
    if (/(romaria|senhor|senhora|nossa sra|santuario|circio|cirio|procissao|fatima)/.test(n)) return "romaria";
    if (/feira|mercado|mostra/.test(n)) return "feira-tradicional";
    return "festa-popular";
  }

  function normalizarEvento(bruto) {
    return {
      id: ORIGEM + "-" + U.slug(bruto.nome + "-" + (bruto.municipio || "") + "-" + (bruto.inicio || "")),
      nome: bruto.nome,
      categoria: categoriaHeuristica(bruto.nome),
      municipio: bruto.municipio,
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

  // -------------------------------------------------------- Geocodificação ---

  // Nominatim (OpenStreetMap) permite CORS; usado só para eventos sem coordenadas,
  // ao nível do município, com cache local e limite de pedidos por importação.
  const CHAVE_GEO = "ffp.geocache.v1";

  async function geocodificar(eventos, progresso, maxPedidos) {
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(CHAVE_GEO) || "{}"); } catch (e) { /* recomeça */ }
    let pedidos = 0;
    for (const ev of eventos) {
      if (typeof ev.lat === "number" && typeof ev.lng === "number") continue;
      const chave = U.normaliza(ev.municipio + "|" + ev.distrito);
      if (cache[chave]) {
        ev.lat = cache[chave][0]; ev.lng = cache[chave][1];
        continue;
      }
      if (pedidos >= (maxPedidos || 30)) continue;
      try {
        progresso("A geocodificar " + ev.municipio + "…");
        const q = encodeURIComponent(ev.municipio + (ev.distrito ? ", " + ev.distrito : "") + ", Portugal");
        const resp = await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pt&q=" + q);
        pedidos++;
        if (resp.ok) {
          const json = await resp.json();
          if (json[0]) {
            ev.lat = parseFloat(json[0].lat); ev.lng = parseFloat(json[0].lon);
            cache[chave] = [ev.lat, ev.lng];
          }
        }
        await new Promise(r => setTimeout(r, 1100)); // política de utilização do Nominatim
      } catch (err) { /* segue sem coordenadas */ }
    }
    try { localStorage.setItem(CHAVE_GEO, JSON.stringify(cache)); } catch (e) { /* sem espaço */ }
  }

  // ------------------------------------------------------------ Importar ---

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
      progresso("A ler página " + (paginasLidas + 1) + "/" + Math.min(fila.length, MAX_PAGINAS) + "…");
      let html;
      try { html = await fetchTexto(url); } catch (err) { continue; }
      paginasLidas++;

      const encontrados = eventosDoJsonLd(html, url);
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

    progresso("A geocodificar municípios em falta…");
    await geocodificar(eventos, progresso, 30);

    return { eventos, paginasLidas };
  }

  window.FestasArraiais = { importar, BASE, ORIGEM };
})();

// Funções partilhadas para ler fontes na web a partir do browser:
// fetch com fallback a proxies CORS, extração de eventos JSON-LD (schema.org),
// leitura de feeds RSS/Atom, heurística de categorias e geocodificação.
(function () {
  "use strict";

  const PROXIES = [
    (u) => u, // direto (caso a fonte permita CORS)
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

  function extrairLocs(xml) {
    const locs = [];
    const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
    let m;
    while ((m = re.exec(xml)) !== null) locs.push(m[1].trim());
    return locs;
  }

  // ------------------------------------------------------ JSON-LD (Event) ---

  function aplanarJsonLd(no, acc) {
    if (!no) return acc;
    if (Array.isArray(no)) { no.forEach(n => aplanarJsonLd(n, acc)); return acc; }
    if (typeof no !== "object") return acc;
    const tipo = no["@type"];
    const tipos = Array.isArray(tipo) ? tipo : [tipo];
    if (tipos.some(t => typeof t === "string" && /Event$/i.test(t))) acc.push(no);
    for (const chave of ["@graph", "itemListElement", "item", "subEvent", "mainEntity"]) {
      if (no[chave]) aplanarJsonLd(no[chave], acc);
    }
    return acc;
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

  function converterJsonLd(no, urlPagina, base) {
    const nome = textoDe(no.name);
    if (!nome) return null;
    const loc = no.location || {};
    const morada = (loc && loc.address) || {};
    const geo = (loc && loc.geo) || {};
    const municipio = textoDe(morada.addressLocality) || textoDe(loc.name) || "";
    let url = (typeof no.url === "string" && no.url) ? no.url : urlPagina;
    if (url && !url.startsWith("http")) url = (base || "").replace(/\/+$/, "") + url;
    const ev = {
      nome: nome,
      municipio: municipio,
      distrito: textoDe(morada.addressRegion) || "",
      local: textoDe(loc.name) || "",
      inicio: dataIso(no.startDate),
      fim: dataIso(no.endDate) || dataIso(no.startDate),
      descricao: textoDe(no.description),
      url: url
    };
    const lat = parseFloat(geo.latitude), lng = parseFloat(geo.longitude);
    if (isFinite(lat) && isFinite(lng)) { ev.lat = lat; ev.lng = lng; }
    return ev;
  }

  function eventosDoJsonLd(html, urlPagina, base) {
    const eventos = [];
    const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      try {
        const json = JSON.parse(m[1].trim());
        for (const no of aplanarJsonLd(json, [])) {
          const ev = converterJsonLd(no, urlPagina, base);
          if (ev) eventos.push(ev);
        }
      } catch (err) { /* bloco inválido — ignora */ }
    }
    return eventos;
  }

  // ------------------------------------------------------------ RSS/Atom ---

  function eRssOuAtom(texto) {
    return /<(rss|feed|rdf:RDF)[\s>]/i.test(texto.slice(0, 4000));
  }

  function limpaTexto(s) {
    return String(s || "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&#0?39;/g, "'").replace(/&quot;/g, '"')
      .replace(/\s+/g, " ").trim();
  }

  function itensDeRss(xml) {
    const itens = [];
    const re = /<(item|entry)[\s>][\s\S]*?<\/\1>/gi;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const bloco = m[0];
      const titulo = limpaTexto((bloco.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
      let url = limpaTexto((bloco.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1]);
      if (!url) url = (bloco.match(/<link[^>]*href=["']([^"']+)["']/i) || [])[1] || "";
      const resumo = limpaTexto((bloco.match(/<(description|summary|content)[^>]*>([\s\S]*?)<\/\1>/i) || [])[2]).slice(0, 400);
      if (titulo) itens.push({ titulo, url, resumo });
    }
    return itens;
  }

  // ----------------------------------------------------------- Categorias ---

  function categoriaHeuristica(nome) {
    const n = U.normaliza(nome);
    if (/(medieval|quinhentist|renascentist|templari|viking|romano)/.test(n)) return "feira-medieval";
    if (/artesanato|artesa/.test(n)) return "feira-artesanato";
    if (/carnaval|entrudo/.test(n)) return "carnaval";
    if (/(romaria|senhor|senhora|nossa sra|santuario|circio|cirio|procissao|fatima)/.test(n)) return "romaria";
    if (/feira|mercado|mostra/.test(n)) return "feira-tradicional";
    return "festa-popular";
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
      if (!ev.municipio) continue;
      const chave = U.normaliza(ev.municipio + "|" + (ev.distrito || ""));
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

  window.WebFontes = {
    fetchTexto, extrairLocs,
    eventosDoJsonLd, eRssOuAtom, itensDeRss,
    categoriaHeuristica, geocodificar
  };
})();

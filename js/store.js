// Camada de dados: junta o dataset base (seed) com alterações do utilizador
// e guarda tudo em localStorage, para a aplicação funcionar offline e sem backend.
(function () {
  "use strict";

  const CHAVE = "ffp.dados.v1";

  // URL "canónica" do dataset no repositório — usada pelo botão "Atualizar dados"
  // para ir buscar à web a versão mais recente publicada (raw.githubusercontent permite CORS).
  const URL_DADOS_REMOTOS =
    "https://raw.githubusercontent.com/david12345/festas-e-feiras-populares/claude/municipal-events-app-5szsxz/data/events.json";

  function estadoVazio() {
    return {
      seedVersion: 0,
      seedCache: null,        // cópia do último seed descarregado da web (ou null → usa o embebido)
      personalizados: [],     // eventos criados pelo utilizador
      alterados: {},          // id -> evento editado (substitui o do seed)
      removidos: [],          // ids de eventos escondidos pelo utilizador
      importados: {}          // origem -> { atualizadoEm, eventos: [...] } (ex.: festasearraiais)
    };
  }

  function lerEstado() {
    try {
      const raw = localStorage.getItem(CHAVE);
      if (!raw) return estadoVazio();
      const e = JSON.parse(raw);
      return Object.assign(estadoVazio(), e);
    } catch (err) {
      console.warn("Estado local inválido, a recomeçar.", err);
      return estadoVazio();
    }
  }

  function gravarEstado(e) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(e));
    } catch (err) {
      U.toast("Não foi possível guardar localmente: " + err.message);
    }
  }

  let estado = lerEstado();

  function seedAtual() {
    const embebido = window.SEED_DATA || { version: 0, eventos: [] };
    const cache = estado.seedCache;
    if (cache && cache.version >= embebido.version) return cache;
    return embebido;
  }

  // Lista final de eventos visíveis na aplicação.
  function todos() {
    const seed = seedAtual();
    const removidos = new Set(estado.removidos);
    const lista = [];
    for (const ev of seed.eventos) {
      if (removidos.has(ev.id)) continue;
      lista.push(estado.alterados[ev.id] ? Object.assign({}, ev, estado.alterados[ev.id]) : ev);
    }
    for (const ev of estado.personalizados) lista.push(ev);

    // Eventos importados de fontes externas (ex.: festasearraiais.pt),
    // sem duplicar os que já existem com o mesmo nome e município.
    const chaves = new Set(lista.map(e => U.normaliza(e.nome + "|" + e.municipio)));
    for (const origem of Object.keys(estado.importados)) {
      for (const ev of (estado.importados[origem].eventos || [])) {
        if (removidos.has(ev.id)) continue;
        const chave = U.normaliza(ev.nome + "|" + ev.municipio);
        if (chaves.has(chave)) continue;
        chaves.add(chave);
        lista.push(estado.alterados[ev.id] ? Object.assign({}, ev, estado.alterados[ev.id]) : ev);
      }
    }

    lista.sort((a, b) => String(a.inicio || "9999").localeCompare(String(b.inicio || "9999")));
    return lista;
  }

  function guardarImportados(origem, eventos) {
    estado.importados[origem] = {
      atualizadoEm: new Date().toISOString().slice(0, 10),
      eventos: eventos
    };
    gravarEstado(estado);
  }

  function infoImportados(origem) {
    const reg = estado.importados[origem];
    return reg ? { atualizadoEm: reg.atualizadoEm, total: reg.eventos.length } : null;
  }

  function porId(id) {
    return todos().find(e => e.id === id) || null;
  }

  function ePersonalizado(id) {
    return estado.personalizados.some(e => e.id === id);
  }

  function guardarEvento(ev) {
    const seedIds = new Set(seedAtual().eventos.map(e => e.id));
    const idsImportados = new Set(Object.values(estado.importados)
      .flatMap(reg => (reg.eventos || []).map(e => e.id)));
    if (!ev.id) {
      ev.id = U.slug(ev.nome) + "-" + Date.now().toString(36);
      ev.origem = "manual";
      estado.personalizados.push(ev);
    } else if (seedIds.has(ev.id) || idsImportados.has(ev.id)) {
      estado.alterados[ev.id] = ev;
    } else {
      const i = estado.personalizados.findIndex(e => e.id === ev.id);
      if (i >= 0) estado.personalizados[i] = ev; else estado.personalizados.push(ev);
    }
    gravarEstado(estado);
    return ev;
  }

  function removerEvento(id) {
    const i = estado.personalizados.findIndex(e => e.id === id);
    if (i >= 0) {
      estado.personalizados.splice(i, 1);
    } else {
      delete estado.alterados[id];
      if (!estado.removidos.includes(id)) estado.removidos.push(id);
    }
    gravarEstado(estado);
  }

  function reporOriginais() {
    estado.alterados = {};
    estado.removidos = [];
    gravarEstado(estado);
  }

  // --- Atualização a partir da web -----------------------------------------

  async function atualizarDaWeb() {
    const resp = await fetch(URL_DADOS_REMOTOS, { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const dados = await resp.json();
    if (!dados || !Array.isArray(dados.eventos)) throw new Error("formato inesperado");
    const anterior = seedAtual().version;
    estado.seedCache = dados;
    estado.seedVersion = dados.version;
    gravarEstado(estado);
    return { versaoAnterior: anterior, versaoNova: dados.version, total: dados.eventos.length };
  }

  // Descoberta de eventos na Wikipédia (API pública com CORS aberto).
  // Devolve sugestões {titulo, url} que o utilizador pode importar como rascunho.
  async function descobrirWikipedia() {
    const categorias = [
      "Categoria:Festas de Portugal",
      "Categoria:Festividades religiosas de Portugal",
      "Categoria:Feiras de Portugal",
      "Categoria:Romarias de Portugal",
      "Categoria:Carnaval de Portugal"
    ];
    const sugestoes = new Map();
    for (const cat of categorias) {
      const url = "https://pt.wikipedia.org/w/api.php?action=query&list=categorymembers" +
        "&cmtitle=" + encodeURIComponent(cat) +
        "&cmlimit=200&cmnamespace=0&format=json&origin=*";
      try {
        const resp = await fetch(url);
        if (!resp.ok) continue;
        const json = await resp.json();
        const membros = (json.query && json.query.categorymembers) || [];
        for (const m of membros) {
          sugestoes.set(m.title, {
            titulo: m.title,
            url: "https://pt.wikipedia.org/wiki/" + encodeURIComponent(m.title.replace(/ /g, "_"))
          });
        }
      } catch (err) {
        console.warn("Wikipédia indisponível para", cat, err);
      }
    }
    return Array.from(sugestoes.values()).sort((a, b) => a.titulo.localeCompare(b.titulo, "pt"));
  }

  // --- Exportar / importar ---------------------------------------------------

  function exportar() {
    return JSON.stringify({
      formato: "festas-e-feiras-populares",
      exportadoEm: new Date().toISOString(),
      eventos: todos()
    }, null, 2);
  }

  function importar(json) {
    const dados = JSON.parse(json);
    const eventos = Array.isArray(dados) ? dados : dados.eventos;
    if (!Array.isArray(eventos)) throw new Error("O ficheiro não contém uma lista de eventos.");
    let n = 0;
    const idsExistentes = new Set(todos().map(e => e.id));
    for (const ev of eventos) {
      if (!ev || !ev.nome) continue;
      if (ev.id && idsExistentes.has(ev.id)) continue; // não duplica
      guardarEvento(Object.assign({}, ev, { id: ev.id || null }));
      n++;
    }
    return n;
  }

  function infoDados() {
    const seed = seedAtual();
    return {
      versao: seed.version,
      atualizadoEm: seed.atualizadoEm,
      origem: estado.seedCache ? "web (atualizado)" : "embebido na aplicação",
      totalSeed: seed.eventos.length,
      totalPersonalizados: estado.personalizados.length,
      totalImportados: Object.values(estado.importados)
        .reduce((n, reg) => n + (reg.eventos || []).length, 0)
    };
  }

  window.Store = {
    todos, porId, ePersonalizado,
    guardarEvento, removerEvento, reporOriginais,
    guardarImportados, infoImportados,
    atualizarDaWeb, descobrirWikipedia,
    exportar, importar, infoDados,
    URL_DADOS_REMOTOS
  };
})();

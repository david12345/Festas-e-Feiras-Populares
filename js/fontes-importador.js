// Importador genérico de fontes locais (juntas de freguesia, câmaras, etc.).
// Para cada fonte, tenta os caminhos habituais de agenda/eventos e o feed RSS,
// extraindo eventos de dados estruturados JSON-LD e, em último recurso, de
// títulos de notícias que pareçam anunciar festas/arraiais (sem data — rascunho).
(function () {
  "use strict";

  const MAX_PAGINAS_POR_FONTE = 8;
  const RE_EVENTO = /(festa|feira|arraial|romaria|marcha|santos populares|s(ao|\.|t)? ?joao|santo antonio|sao pedro|mercado|festival|procissao|quermesse|sardinhada|magusto|carnaval|baile|piquenique|convivio)/;

  function caminhosCandidatos(fonte) {
    const raiz = fonte.url.replace(/\/+$/, "");
    const especificos = (fonte.paths || []).map(p => raiz + (p.startsWith("/") ? p : "/" + p));
    const habituais = [
      raiz,
      raiz + "/eventos", raiz + "/Eventos", raiz + "/agenda", raiz + "/agenda-cultural",
      raiz + "/eventos/feed", raiz + "/feed"
    ];
    // Caminhos da fonte primeiro, sem repetir, limitados ao máximo por fonte.
    const vistos = new Set();
    return especificos.concat(habituais).filter(u => {
      if (vistos.has(u)) return false;
      vistos.add(u);
      return true;
    });
  }

  function normalizar(bruto, fonte) {
    return {
      id: "fonte-" + fonte.id + "-" + U.slug(bruto.nome + "-" + (bruto.inicio || "")),
      nome: bruto.nome,
      categoria: WebFontes.categoriaHeuristica(bruto.nome, fonte.categoria),
      municipio: bruto.municipio || fonte.municipio || "",
      distrito: bruto.distrito || fonte.distrito || "",
      regiao: "",
      local: bruto.local || "",
      lat: bruto.lat, lng: bruto.lng,
      inicio: bruto.inicio || null, fim: bruto.fim || bruto.inicio || null,
      estadoData: bruto.inicio ? "confirmada" : "estimada",
      descricao: bruto.descricao || "",
      origem: "fontes",
      fonte: { nome: fonte.nome, url: bruto.url || fonte.url },
      fontesAdicionais: [{ nome: fonte.nome + " (página principal)", url: fonte.url }]
    };
  }

  async function importarFonte(fonte, progresso) {
    progresso = progresso || function () {};
    const brutos = [];
    let lidas = 0;

    for (const url of caminhosCandidatos(fonte)) {
      if (lidas >= MAX_PAGINAS_POR_FONTE) break;
      progresso(fonte.nome + ": a ler " + url.replace(fonte.url, "") || "/");
      let texto;
      try { texto = await WebFontes.fetchTexto(url); } catch (err) { continue; }
      lidas++;

      if (WebFontes.eRssOuAtom(texto)) {
        // Feed de notícias: aproveita os itens cujo título pareça um evento.
        for (const item of WebFontes.itensDeRss(texto)) {
          if (RE_EVENTO.test(U.normaliza(item.titulo))) {
            brutos.push({ nome: item.titulo, url: item.url, descricao: item.resumo });
          }
        }
      } else {
        brutos.push(...WebFontes.eventosDoJsonLd(texto, url, fonte.url));
      }
    }

    const porId = new Map();
    for (const b of brutos) {
      if (!b.nome) continue;
      const ev = normalizar(b, fonte);
      if (!porId.has(ev.id)) porId.set(ev.id, ev);
    }
    const eventos = Array.from(porId.values());
    await WebFontes.geocodificar(eventos, progresso, 10);
    return { eventos, paginasLidas: lidas };
  }

  // Relê todas as fontes: registo + fontes do utilizador + festasearraiais.pt.
  async function importarTudo(progresso) {
    progresso = progresso || function () {};
    const resumo = [];
    const fontes = (window.FONTES_REGISTO || []).concat(Store.fontesUtilizador());

    for (const f of fontes) {
      try {
        const r = await importarFonte(f, progresso);
        Store.guardarImportados("fonte:" + f.id, r.eventos);
        resumo.push({ nome: f.nome, n: r.eventos.length });
      } catch (err) {
        resumo.push({ nome: f.nome, erro: err.message });
      }
    }

    if (window.FestasArraiais) {
      try {
        const r = await FestasArraiais.importar(progresso);
        Store.guardarImportados(FestasArraiais.ORIGEM, r.eventos);
        resumo.push({ nome: "festasearraiais.pt", n: r.eventos.length });
      } catch (err) {
        resumo.push({ nome: "festasearraiais.pt", erro: err.message });
      }
    }

    return resumo;
  }

  window.FontesImportador = { importarFonte, importarTudo };
})();

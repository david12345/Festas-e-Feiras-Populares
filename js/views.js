// Vistas de lista, calendário, fontes e modal de detalhe/edição.
(function () {
  "use strict";

  // ---------------------------------------------------------------- Lista ---

  function badgeEstadoData(ev) {
    if (ev.estadoData === "confirmada") return '<span class="badge badge-confirmada" title="Datas anunciadas pela organização">datas confirmadas</span>';
    return '<span class="badge badge-estimada" title="Datas previstas com base em edições anteriores — confirme na fonte oficial">datas previstas</span>';
  }

  function badgeTemporal(ev) {
    const t = U.estadoTemporal(ev);
    if (t === "decorre") return '<span class="badge badge-decorre">a decorrer</span>';
    if (t === "passado") return '<span class="badge badge-passado">terminado</span>';
    return "";
  }

  function cartaoEvento(ev) {
    const cat = U.categoriaInfo(ev.categoria);
    return (
      '<article class="cartao" data-id="' + U.escapaAttr(ev.id) + '" style="--cor-cat:' + cat.cor + '">' +
        '<div class="cartao-cab">' +
          '<span class="chip" style="background:' + cat.cor + '">' + cat.emoji + " " + U.escapaHtml(cat.nome) + "</span>" +
          badgeTemporal(ev) +
        "</div>" +
        "<h3>" + U.escapaHtml(ev.nome) + "</h3>" +
        '<p class="cartao-meta">📍 ' + U.escapaHtml(ev.municipio) + (ev.distrito ? " · " + U.escapaHtml(ev.distrito) : "") + "</p>" +
        '<p class="cartao-meta">🗓️ ' + U.escapaHtml(U.formataIntervalo(ev)) + " " + badgeEstadoData(ev) + "</p>" +
      "</article>"
    );
  }

  function renderLista(eventos) {
    const raiz = document.getElementById("view-lista");
    if (!eventos.length) {
      raiz.innerHTML = '<p class="vazio">Nenhum evento corresponde aos filtros. Experimente alargar a pesquisa ou incluir eventos já terminados.</p>';
      return;
    }
    // Agrupa por mês/ano de início.
    const grupos = new Map();
    for (const ev of eventos) {
      const d = U.parseData(ev.inicio);
      const chave = d ? (U.MESES[d.getMonth()] + " de " + d.getFullYear()) : "Sem data";
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(ev);
    }
    let html = "";
    for (const [titulo, lista] of grupos) {
      html += '<h2 class="grupo-mes">' + U.escapaHtml(titulo) + "</h2>" +
              '<div class="grelha">' + lista.map(cartaoEvento).join("") + "</div>";
    }
    raiz.innerHTML = html;
  }

  // ----------------------------------------------------------- Calendário ---

  const cal = { ano: null, mes: null };

  function renderCalendario(eventos) {
    const h = U.hoje();
    if (cal.ano === null) { cal.ano = h.getFullYear(); cal.mes = h.getMonth(); }
    const raiz = document.getElementById("view-calendario");

    const primeiro = new Date(cal.ano, cal.mes, 1);
    const diasNoMes = new Date(cal.ano, cal.mes + 1, 0).getDate();
    // Semana a começar à segunda-feira.
    const desvio = (primeiro.getDay() + 6) % 7;

    const doMes = eventos.filter(ev => U.eventoNoMes(ev, cal.ano, cal.mes));

    let html =
      '<div class="cal-cab">' +
        '<button class="btn" id="cal-prev" aria-label="Mês anterior">‹</button>' +
        "<h2>" + U.MESES[cal.mes].charAt(0).toUpperCase() + U.MESES[cal.mes].slice(1) + " " + cal.ano + "</h2>" +
        '<button class="btn" id="cal-next" aria-label="Mês seguinte">›</button>' +
        '<button class="btn" id="cal-hoje">Hoje</button>' +
      "</div>" +
      '<div class="cal-grelha cal-dias-semana">' +
        ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(d => "<div>" + d + "</div>").join("") +
      "</div>" +
      '<div class="cal-grelha">';

    for (let i = 0; i < desvio; i++) html += '<div class="cal-dia cal-vazio"></div>';

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(cal.ano, cal.mes, dia, 12);
      const eHoje = data.getFullYear() === h.getFullYear() && data.getMonth() === h.getMonth() && data.getDate() === h.getDate();
      const doDia = doMes.filter(ev => {
        const i2 = U.parseData(ev.inicio), f2 = U.parseData(ev.fim || ev.inicio);
        return i2 && i2 <= data && (f2 || i2) >= data;
      });
      html += '<div class="cal-dia' + (eHoje ? " cal-hoje-dia" : "") + '">' +
        '<span class="cal-num">' + dia + "</span>";
      for (const ev of doDia.slice(0, 4)) {
        const cat = U.categoriaInfo(ev.categoria);
        html += '<button class="cal-evento" data-id="' + U.escapaAttr(ev.id) + '" style="background:' + cat.cor + '" title="' +
          U.escapaAttr(ev.nome + " — " + U.formataIntervalo(ev)) + '">' + U.escapaHtml(ev.nome) + "</button>";
      }
      if (doDia.length > 4) html += '<span class="cal-mais">+' + (doDia.length - 4) + "</span>";
      html += "</div>";
    }
    html += "</div>";

    if (!doMes.length) {
      html += '<p class="vazio">Sem eventos neste mês (com os filtros atuais).</p>';
    }
    raiz.innerHTML = html;

    raiz.querySelector("#cal-prev").addEventListener("click", () => { mudaMes(-1); });
    raiz.querySelector("#cal-next").addEventListener("click", () => { mudaMes(1); });
    raiz.querySelector("#cal-hoje").addEventListener("click", () => {
      cal.ano = h.getFullYear(); cal.mes = h.getMonth(); App.renderAtual();
    });

    function mudaMes(delta) {
      cal.mes += delta;
      if (cal.mes < 0) { cal.mes = 11; cal.ano--; }
      if (cal.mes > 11) { cal.mes = 0; cal.ano++; }
      App.renderAtual();
    }
  }

  // ---------------------------------------------------------------- Fontes ---

  function renderFontes(eventos) {
    const raiz = document.getElementById("view-fontes");
    const fontes = new Map();
    for (const ev of eventos) {
      const lista = [ev.fonte].concat(ev.fontesAdicionais || []).filter(Boolean);
      for (const f of lista) {
        if (!f.url) continue;
        if (!fontes.has(f.url)) fontes.set(f.url, { nome: f.nome || f.url, url: f.url, eventos: [] });
        fontes.get(f.url).eventos.push(ev.nome);
      }
    }
    const ordenadas = Array.from(fontes.values()).sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
    const temFA = typeof window.FestasArraiais !== "undefined";
    const infoFA = temFA ? Store.infoImportados(FestasArraiais.ORIGEM) : null;
    const caixaFA = !temFA ? "" :
      '<div class="caixa-fonte-externa">' +
        '<h3>🌐 festasearraiais.pt</h3>' +
        '<p><a href="' + FestasArraiais.BASE + '/" target="_blank" rel="noopener">Festas &amp; Arraiais</a> agrega ' +
        "festas e arraiais de todo o país. A importação descarrega os eventos do site diretamente no seu browser e " +
        "guarda-os localmente; pode repeti-la quando quiser para atualizar." +
        (infoFA ? " <strong>Última importação: " + U.escapaHtml(infoFA.atualizadoEm) + " (" + infoFA.total + " eventos).</strong>" : "") +
        "</p>" +
        '<button class="btn btn-primary" id="btn-importar-fa">⤵️ Importar / atualizar de festasearraiais.pt</button>' +
        '<span id="fa-progresso" class="fa-progresso"></span>' +
      "</div>";
    let html =
      '<div class="fontes-intro">' +
        "<h2>Fontes municipais e oficiais</h2>" +
        "<p>Sítios oficiais (câmaras municipais e organizações) de onde provém a informação dos eventos guardados nesta aplicação. " +
        "Use o botão <strong>⟳ Atualizar dados</strong> para procurar dados atualizados na web, e os botões abaixo para importar de fontes externas.</p>" +
        caixaFA +
        '<button class="btn" id="btn-wikipedia">🔎 Descobrir mais eventos (Wikipédia)</button>' +
        '<div id="wiki-resultados"></div>' +
      "</div>" +
      '<ul class="lista-fontes">' +
      ordenadas.map(f =>
        "<li>" +
          '<a href="' + U.escapaAttr(f.url) + '" target="_blank" rel="noopener">' + U.escapaHtml(f.nome) + "</a>" +
          ' <span class="fonte-n">(' + f.eventos.length + " evento" + (f.eventos.length === 1 ? "" : "s") + ")</span>" +
          '<div class="fonte-eventos">' + U.escapaHtml(f.eventos.join(" · ")) + "</div>" +
        "</li>").join("") +
      "</ul>";
    raiz.innerHTML = html;

    const btnFA = raiz.querySelector("#btn-importar-fa");
    if (btnFA) btnFA.addEventListener("click", async (e) => {
      const progresso = raiz.querySelector("#fa-progresso");
      e.target.disabled = true;
      try {
        const r = await FestasArraiais.importar(msg => { progresso.textContent = msg; });
        Store.guardarImportados(FestasArraiais.ORIGEM, r.eventos);
        progresso.textContent = "";
        U.toast(r.eventos.length + " eventos importados de festasearraiais.pt (" + r.paginasLidas + " páginas lidas).");
        App.renderAtual();
      } catch (err) {
        progresso.textContent = "";
        U.toast("Importação falhou: " + err.message);
        e.target.disabled = false;
      }
    });

    raiz.querySelector("#btn-wikipedia").addEventListener("click", async (e) => {
      const alvo = raiz.querySelector("#wiki-resultados");
      e.target.disabled = true;
      alvo.innerHTML = '<p class="vazio">A pesquisar na Wikipédia…</p>';
      try {
        const sugestoes = await Store.descobrirWikipedia();
        if (!sugestoes.length) {
          alvo.innerHTML = '<p class="vazio">Sem resultados (verifique a ligação à internet).</p>';
        } else {
          alvo.innerHTML =
            "<h3>" + sugestoes.length + " artigos encontrados</h3>" +
            '<ul class="lista-wiki">' +
            sugestoes.map(s =>
              "<li><a href=\"" + U.escapaAttr(s.url) + "\" target=\"_blank\" rel=\"noopener\">" +
              U.escapaHtml(s.titulo) + "</a> " +
              '<button class="btn btn-mini wiki-importar" data-titulo="' + U.escapaAttr(s.titulo) +
              '" data-url="' + U.escapaAttr(s.url) + '">＋ importar rascunho</button></li>').join("") +
            "</ul>";
          alvo.querySelectorAll(".wiki-importar").forEach(btn => {
            btn.addEventListener("click", () => {
              Views.abrirFormulario(null, {
                nome: btn.dataset.titulo,
                fonte: { nome: "Wikipédia: " + btn.dataset.titulo, url: btn.dataset.url }
              });
            });
          });
        }
      } catch (err) {
        alvo.innerHTML = '<p class="vazio">Erro ao contactar a Wikipédia: ' + U.escapaHtml(err.message) + "</p>";
      } finally {
        e.target.disabled = false;
      }
    });
  }

  // ----------------------------------------------------- Modal de detalhe ---

  function abrirModal(html) {
    document.getElementById("modal-conteudo").innerHTML = html;
    document.getElementById("modal").classList.remove("hidden");
  }
  function fecharModal() {
    document.getElementById("modal").classList.add("hidden");
  }

  function abrirDetalhe(id) {
    const ev = Store.porId(id);
    if (!ev) return;
    const cat = U.categoriaInfo(ev.categoria);
    const fontes = [ev.fonte].concat(ev.fontesAdicionais || []).filter(f => f && f.url);
    const linkMaps = "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(typeof ev.lat === "number" ? ev.lat + "," + ev.lng : ev.nome + " " + ev.municipio);
    const pesquisaWeb = "https://www.google.com/search?q=" +
      encodeURIComponent('"' + ev.nome + '" ' + ev.municipio + " " + new Date().getFullYear() + " datas programa");

    let html =
      '<div class="detalhe" style="--cor-cat:' + cat.cor + '">' +
        '<span class="chip" style="background:' + cat.cor + '">' + cat.emoji + " " + U.escapaHtml(cat.nome) + "</span> " +
        badgeTemporal(ev) +
        "<h2>" + U.escapaHtml(ev.nome) + "</h2>" +
        '<p class="detalhe-meta">🗓️ <strong>' + U.escapaHtml(U.formataIntervalo(ev)) + "</strong> " + badgeEstadoData(ev) + "</p>" +
        '<p class="detalhe-meta">📍 ' + U.escapaHtml([ev.local, ev.municipio, ev.distrito].filter(Boolean).join(" · ")) +
          (ev.regiao ? ' <span class="badge badge-regiao">' + U.escapaHtml(ev.regiao) + "</span>" : "") + "</p>" +
        (ev.descricao ? "<p class='detalhe-desc'>" + U.escapaHtml(ev.descricao) + "</p>" : "") +
        "<h3>Fonte oficial</h3>" +
        '<ul class="detalhe-fontes">' +
        (fontes.length
          ? fontes.map(f => '<li><a href="' + U.escapaAttr(f.url) + '" target="_blank" rel="noopener">🔗 ' +
              U.escapaHtml(f.nome || f.url) + "</a></li>").join("")
          : "<li>Sem fonte registada.</li>") +
        "</ul>" +
        '<div class="detalhe-acoes">' +
          '<a class="btn" href="' + U.escapaAttr(linkMaps) + '" target="_blank" rel="noopener">🗺️ Google Maps</a>' +
          '<a class="btn" href="' + U.escapaAttr(pesquisaWeb) + '" target="_blank" rel="noopener">🔎 Pesquisar atualizações na web</a>' +
          (typeof ev.lat === "number" ? '<button class="btn" id="det-ver-mapa">📍 Ver no mapa da aplicação</button>' : "") +
          '<button class="btn" id="det-editar">✏️ Editar</button>' +
          '<button class="btn btn-perigo" id="det-remover">🗑️ Remover</button>' +
        "</div>" +
      "</div>";

    abrirModal(html);

    const verMapa = document.getElementById("det-ver-mapa");
    if (verMapa) verMapa.addEventListener("click", () => {
      fecharModal();
      App.mudarVista("mapa");
      MapView.focar(ev);
    });
    document.getElementById("det-editar").addEventListener("click", () => abrirFormulario(ev));
    document.getElementById("det-remover").addEventListener("click", () => {
      if (confirm("Remover “" + ev.nome + "” da sua lista local?")) {
        Store.removerEvento(ev.id);
        fecharModal();
        App.renderAtual();
        U.toast("Evento removido. Use “Repor dados originais” nas Fontes do rodapé para recuperar eventos base.");
      }
    });
  }

  // --------------------------------------------------- Formulário de evento ---

  function abrirFormulario(ev, prePreenchido) {
    const e = ev || Object.assign({
      nome: "", categoria: "festa-popular", municipio: "", distrito: "", regiao: "",
      local: "", lat: null, lng: null, inicio: "", fim: "", estadoData: "estimada",
      descricao: "", fonte: { nome: "", url: "" }
    }, prePreenchido || {});

    const opcoesCat = Object.entries(U.CATEGORIAS)
      .map(([k, v]) => '<option value="' + k + '"' + (e.categoria === k ? " selected" : "") + ">" + v.emoji + " " + v.nome + "</option>")
      .join("");

    abrirModal(
      '<div class="detalhe"><h2>' + (ev ? "Editar evento" : "Adicionar evento") + "</h2>" +
      '<form id="form-evento" class="formulario">' +
        '<label>Nome *<input name="nome" required value="' + U.escapaAttr(e.nome) + '"></label>' +
        "<label>Categoria<select name='categoria'>" + opcoesCat + "</select></label>" +
        '<div class="form-linha">' +
          '<label>Município *<input name="municipio" required value="' + U.escapaAttr(e.municipio) + '"></label>' +
          '<label>Distrito<input name="distrito" value="' + U.escapaAttr(e.distrito || "") + '"></label>' +
        "</div>" +
        '<label>Local<input name="local" value="' + U.escapaAttr(e.local || "") + '"></label>' +
        '<div class="form-linha">' +
          '<label>Início<input type="date" name="inicio" value="' + U.escapaAttr(e.inicio || "") + '"></label>' +
          '<label>Fim<input type="date" name="fim" value="' + U.escapaAttr(e.fim || "") + '"></label>' +
          "<label>Estado das datas<select name='estadoData'>" +
            '<option value="confirmada"' + (e.estadoData === "confirmada" ? " selected" : "") + ">Confirmadas</option>" +
            '<option value="estimada"' + (e.estadoData !== "confirmada" ? " selected" : "") + ">Previstas</option>" +
          "</select></label>" +
        "</div>" +
        '<div class="form-linha">' +
          '<label>Latitude<input type="number" step="any" name="lat" value="' + (typeof e.lat === "number" ? e.lat : "") + '"></label>' +
          '<label>Longitude<input type="number" step="any" name="lng" value="' + (typeof e.lng === "number" ? e.lng : "") + '"></label>' +
        "</div>" +
        '<label>Descrição<textarea name="descricao" rows="4">' + U.escapaHtml(e.descricao || "") + "</textarea></label>" +
        '<div class="form-linha">' +
          '<label>Nome da fonte<input name="fonteNome" value="' + U.escapaAttr((e.fonte && e.fonte.nome) || "") + '"></label>' +
          '<label>URL da fonte<input type="url" name="fonteUrl" placeholder="https://…" value="' + U.escapaAttr((e.fonte && e.fonte.url) || "") + '"></label>' +
        "</div>" +
        '<div class="detalhe-acoes">' +
          '<button type="submit" class="btn btn-primary">Guardar</button>' +
          '<button type="button" class="btn" id="form-cancelar">Cancelar</button>' +
        "</div>" +
      "</form></div>"
    );

    document.getElementById("form-cancelar").addEventListener("click", fecharModal);
    document.getElementById("form-evento").addEventListener("submit", (sub) => {
      sub.preventDefault();
      const fd = new FormData(sub.target);
      const novo = Object.assign({}, ev || {}, {
        id: ev ? ev.id : null,
        nome: fd.get("nome").trim(),
        categoria: fd.get("categoria"),
        municipio: fd.get("municipio").trim(),
        distrito: fd.get("distrito").trim(),
        local: fd.get("local").trim(),
        inicio: fd.get("inicio") || null,
        fim: fd.get("fim") || fd.get("inicio") || null,
        estadoData: fd.get("estadoData"),
        lat: fd.get("lat") !== "" ? Number(fd.get("lat")) : null,
        lng: fd.get("lng") !== "" ? Number(fd.get("lng")) : null,
        descricao: fd.get("descricao").trim(),
        fonte: { nome: fd.get("fonteNome").trim(), url: fd.get("fonteUrl").trim() }
      });
      if (novo.lat === null || isNaN(novo.lat)) delete novo.lat;
      if (novo.lng === null || isNaN(novo.lng)) delete novo.lng;
      Store.guardarEvento(novo);
      fecharModal();
      App.renderAtual();
      U.toast("Evento guardado localmente.");
    });
  }

  window.Views = { renderLista, renderCalendario, renderFontes, abrirDetalhe, abrirFormulario, fecharModal };
})();

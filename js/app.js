// Controlador principal: filtros, navegação entre vistas e ações da barra superior.
(function () {
  "use strict";

  let vistaAtual = "lista";

  // ------------------------------------------------------------- Filtros ---

  function lerFiltros() {
    return {
      texto: U.normaliza(document.getElementById("filtro-texto").value),
      categoria: document.getElementById("filtro-categoria").value,
      distrito: document.getElementById("filtro-distrito").value,
      mes: document.getElementById("filtro-mes").value, // "2026-07" ou ""
      incluirPassados: document.getElementById("filtro-passados").checked
    };
  }

  function filtrar(eventos) {
    const f = lerFiltros();
    return eventos.filter(ev => {
      if (!f.incluirPassados && U.estadoTemporal(ev) === "passado") return false;
      if (f.categoria && ev.categoria !== f.categoria) return false;
      if (f.distrito && ev.distrito !== f.distrito) return false;
      if (f.mes) {
        const [ano, mes] = f.mes.split("-").map(Number);
        if (!U.eventoNoMes(ev, ano, mes - 1)) return false;
      }
      if (f.texto) {
        const alvo = U.normaliza([ev.nome, ev.municipio, ev.distrito, ev.regiao, ev.local, ev.descricao].join(" "));
        if (!alvo.includes(f.texto)) return false;
      }
      return true;
    });
  }

  function preencherFiltros() {
    const eventos = Store.todos();

    const selCat = document.getElementById("filtro-categoria");
    const catAtual = selCat.value;
    selCat.innerHTML = '<option value="">Todas as categorias</option>' +
      Object.entries(U.CATEGORIAS)
        .map(([k, v]) => '<option value="' + k + '">' + v.emoji + " " + v.nome + "</option>").join("");
    selCat.value = catAtual;

    const selDis = document.getElementById("filtro-distrito");
    const disAtual = selDis.value;
    const distritos = Array.from(new Set(eventos.map(e => e.distrito).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, "pt"));
    selDis.innerHTML = '<option value="">Todos os distritos</option>' +
      distritos.map(d => '<option value="' + U.escapaAttr(d) + '">' + U.escapaHtml(d) + "</option>").join("");
    selDis.value = disAtual;

    const selMes = document.getElementById("filtro-mes");
    const mesAtual = selMes.value;
    const meses = Array.from(new Set(eventos
      .filter(e => e.inicio)
      .flatMap(e => {
        const lista = [];
        const i = U.parseData(e.inicio), fim = U.parseData(e.fim || e.inicio) || i;
        if (!i) return lista;
        const c = new Date(i.getFullYear(), i.getMonth(), 1, 12);
        while (c <= fim) {
          lista.push(c.getFullYear() + "-" + String(c.getMonth() + 1).padStart(2, "0"));
          c.setMonth(c.getMonth() + 1);
        }
        return lista;
      }))).sort();
    selMes.innerHTML = '<option value="">Todos os meses</option>' +
      meses.map(m => {
        const [a, mm] = m.split("-").map(Number);
        return '<option value="' + m + '">' + U.MESES[mm - 1] + " " + a + "</option>";
      }).join("");
    selMes.value = mesAtual;
  }

  // ----------------------------------------------------------- Renderizar ---

  function renderAtual() {
    preencherFiltros();
    const eventos = filtrar(Store.todos());
    document.getElementById("contagem").textContent =
      eventos.length + " evento" + (eventos.length === 1 ? "" : "s");

    if (vistaAtual === "lista") Views.renderLista(eventos);
    else if (vistaAtual === "mapa") MapView.render(eventos, Views.abrirDetalhe);
    else if (vistaAtual === "calendario") Views.renderCalendario(eventos);
    else if (vistaAtual === "fontes") Views.renderFontes(Store.todos());

    const info = Store.infoDados();
    document.getElementById("info-dados").innerHTML =
      "Dados: versão " + info.versao + " (" + U.escapaHtml(info.origem) + "), atualizados a " +
      U.escapaHtml(info.atualizadoEm || "—") + " · " + info.totalSeed + " eventos base + " +
      info.totalPersonalizados + " adicionados por si · " +
      '<button class="btn-ligacao" id="btn-repor">Repor dados originais</button>';
    document.getElementById("btn-repor").addEventListener("click", () => {
      if (confirm("Repor os eventos base (mantém os que adicionou manualmente)?")) {
        Store.reporOriginais();
        renderAtual();
        U.toast("Dados base repostos.");
      }
    });
  }

  function mudarVista(nome) {
    vistaAtual = nome;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === nome));
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + nome));
    renderAtual();
  }

  // ---------------------------------------------------------------- Eventos ---

  function ligarEventos() {
    document.querySelectorAll(".tab").forEach(t =>
      t.addEventListener("click", () => mudarVista(t.dataset.view)));

    ["filtro-categoria", "filtro-distrito", "filtro-mes", "filtro-passados"].forEach(id =>
      document.getElementById(id).addEventListener("change", renderAtual));
    document.getElementById("filtro-texto").addEventListener("input", renderAtual);

    // Abrir detalhe ao clicar num cartão da lista ou num evento do calendário.
    document.body.addEventListener("click", (e) => {
      const alvo = e.target.closest(".cartao, .cal-evento");
      if (alvo && alvo.dataset.id) Views.abrirDetalhe(alvo.dataset.id);
    });

    document.getElementById("modal-fechar").addEventListener("click", Views.fecharModal);
    document.getElementById("modal").addEventListener("click", (e) => {
      if (e.target.id === "modal") Views.fecharModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Views.fecharModal();
    });

    document.getElementById("btn-adicionar").addEventListener("click", () => Views.abrirFormulario(null));

    document.getElementById("btn-atualizar").addEventListener("click", async (e) => {
      e.target.disabled = true;
      e.target.textContent = "⟳ A atualizar…";
      try {
        const r = await Store.atualizarDaWeb();
        renderAtual();
        U.toast(r.versaoNova > r.versaoAnterior
          ? "Dados atualizados da web: versão " + r.versaoNova + " com " + r.total + " eventos."
          : "Já tem a versão mais recente (" + r.versaoNova + ").");
      } catch (err) {
        U.toast("Não foi possível atualizar da web (" + err.message + "). A usar os dados locais.");
      } finally {
        e.target.disabled = false;
        e.target.textContent = "⟳ Atualizar dados";
      }
    });

    document.getElementById("btn-exportar").addEventListener("click", () => {
      const blob = new Blob([Store.exportar()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "festas-e-feiras-populares.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });

    document.getElementById("input-importar").addEventListener("change", async (e) => {
      const ficheiro = e.target.files[0];
      if (!ficheiro) return;
      try {
        const n = Store.importar(await ficheiro.text());
        renderAtual();
        U.toast(n + " evento" + (n === 1 ? "" : "s") + " importado" + (n === 1 ? "" : "s") + ".");
      } catch (err) {
        U.toast("Erro ao importar: " + err.message);
      } finally {
        e.target.value = "";
      }
    });
  }

  window.App = { renderAtual, mudarVista };

  ligarEventos();
  renderAtual();
})();

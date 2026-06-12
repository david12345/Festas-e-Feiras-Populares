// Funções utilitárias partilhadas.
(function () {
  "use strict";

  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  const CATEGORIAS = {
    "festa-popular":     { nome: "Festa popular",      cor: "#e63946", emoji: "🎉" },
    "feira-medieval":    { nome: "Feira medieval",     cor: "#8d5524", emoji: "🏰" },
    "feira-artesanato":  { nome: "Feira de artesanato", cor: "#e76f51", emoji: "🧶" },
    "romaria":           { nome: "Romaria / religiosa", cor: "#7b2cbf", emoji: "⛪" },
    "carnaval":          { nome: "Carnaval",           cor: "#2a9d8f", emoji: "🎭" },
    "feira-tradicional": { nome: "Feira tradicional",  cor: "#457b9d", emoji: "🐂" }
  };

  function categoriaInfo(cat) {
    return CATEGORIAS[cat] || { nome: cat || "Outro", cor: "#6c757d", emoji: "📌" };
  }

  // "2026-07-29" -> Date local (meio-dia para evitar problemas de fuso)
  function parseData(iso) {
    if (!iso) return null;
    const [a, m, d] = iso.split("-").map(Number);
    if (!a || !m || !d) return null;
    return new Date(a, m - 1, d, 12, 0, 0);
  }

  function hoje() {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 12, 0, 0);
  }

  function formataData(iso) {
    const d = parseData(iso);
    if (!d) return "—";
    return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear();
  }

  function formataIntervalo(ev) {
    const i = parseData(ev.inicio), f = parseData(ev.fim || ev.inicio);
    if (!i) return "Datas por anunciar";
    if (!f || i.getTime() === f.getTime()) return formataData(ev.inicio);
    if (i.getMonth() === f.getMonth() && i.getFullYear() === f.getFullYear()) {
      return i.getDate() + "–" + f.getDate() + " de " + MESES[i.getMonth()] + " de " + i.getFullYear();
    }
    if (i.getFullYear() === f.getFullYear()) {
      return i.getDate() + " de " + MESES[i.getMonth()] + " – " + f.getDate() + " de " + MESES[f.getMonth()] + " de " + i.getFullYear();
    }
    return formataData(ev.inicio) + " – " + formataData(ev.fim);
  }

  // Estado temporal do evento: "decorre", "futuro", "passado"
  function estadoTemporal(ev) {
    const h = hoje();
    const i = parseData(ev.inicio), f = parseData(ev.fim || ev.inicio);
    if (!i) return "futuro";
    if (f && f < h) return "passado";
    if (i <= h && (!f || f >= h)) return "decorre";
    return "futuro";
  }

  function eventoNoMes(ev, ano, mes /* 0-11 */) {
    const i = parseData(ev.inicio), f = parseData(ev.fim || ev.inicio);
    if (!i) return false;
    const inicioMes = new Date(ano, mes, 1, 0, 0, 0);
    const fimMes = new Date(ano, mes + 1, 0, 23, 59, 59);
    return i <= fimMes && (f || i) >= inicioMes;
  }

  function escapaHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function escapaAttr(s) { return escapaHtml(s); }

  function normaliza(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function slug(s) {
    return normaliza(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "evento";
  }

  let toastTimer = null;
  function toast(msg, ms) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), ms || 3500);
  }

  window.U = {
    MESES, CATEGORIAS, categoriaInfo,
    parseData, hoje, formataData, formataIntervalo,
    estadoTemporal, eventoNoMes,
    escapaHtml, escapaAttr, normaliza, slug, toast
  };
})();

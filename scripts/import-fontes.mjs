#!/usr/bin/env node
// Importa eventos de todas as fontes configuradas e atualiza data/events.json.
//
// Corre num runner (ex.: GitHub Actions) onde o acesso à rede é livre e não há
// restrições de CORS — ao contrário do browser, aqui o fetch direto funciona.
// Reutiliza o registo de fontes (js/fontes-registo.js) e o dataset curado
// (js/seed-events.js), junta os eventos importados (JSON-LD schema.org + feeds
// RSS), geocodifica municípios em falta via Nominatim e grava o resultado.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = process.env;
const FICHEIRO_SEED = env.FFP_SEED || "js/seed-events.js";
const FICHEIRO_REGISTO = env.FFP_REGISTO || "js/fontes-registo.js";
const FICHEIRO_EVENTOS = env.FFP_OUT ? path.resolve(env.FFP_OUT) : path.join(RAIZ, "data", "events.json");
const FICHEIRO_GEOCACHE = env.FFP_GEOCACHE ? path.resolve(env.FFP_GEOCACHE) : path.join(RAIZ, "data", "geocache.json");
const FA_BASE = (env.FFP_FA_BASE || "https://festasearraiais.pt").replace(/\/+$/, "");
const NOMINATIM = (env.FFP_NOMINATIM || "https://nominatim.openstreetmap.org").replace(/\/+$/, "");

const MAX_PATHS_POR_FONTE = 6;
const MAX_PAGINAS_FA = Number(env.FFP_MAX_FA || 150);  // páginas de evento no festasearraiais.pt
const MAX_GEOCODE = Number(env.FFP_MAX_GEOCODE || 150); // pedidos de geocodificação por execução
const UA = "festas-e-feiras-populares/1.0 (+https://github.com/david12345/festas-e-feiras-populares)";

const RE_EVENTO = /(festa|feira|arraial|romaria|marcha|santos populares|s(ao|\.|t)? ?joao|santo antonio|sao pedro|mercado|festival|concerto|espetaculo|exposic|procissao|quermesse|sardinhada|magusto|carnaval|baile|recital|danca|teatro|opera|jazz)/;

// --------------------------------------------------- utilitários de texto ---

function normaliza(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function slug(s) {
  return normaliza(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "evento";
}

// Carrega um ficheiro do browser que faz `window.X = ...`, devolvendo X.
function carregarComWindow(ficheiro, chave) {
  const codigo = fs.readFileSync(path.resolve(RAIZ, ficheiro), "utf8");
  const win = {};
  new Function("window", codigo)(win);
  return win[chave];
}

// ------------------------------------------------------------ fetch + http ---

async function fetchTexto(url, timeoutMs = 25000) {
  const ctrl = AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined;
  const resp = await fetch(url, {
    redirect: "follow",
    signal: ctrl,
    headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml,application/rss+xml;q=0.9,*/*;q=0.8" }
  });
  if (!resp.ok) throw new Error("HTTP " + resp.status);
  return await resp.text();
}

// ----------------------------------------------------------- sitemap (loc) ---

function extrairLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) locs.push(m[1].trim());
  return locs;
}

// ------------------------------------------------------- JSON-LD (schema) ---

function aplanarJsonLd(no, acc) {
  if (!no) return acc;
  if (Array.isArray(no)) { no.forEach(n => aplanarJsonLd(n, acc)); return acc; }
  if (typeof no !== "object") return acc;
  const tipos = Array.isArray(no["@type"]) ? no["@type"] : [no["@type"]];
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
  let url = (typeof no.url === "string" && no.url) ? no.url : urlPagina;
  if (url && !url.startsWith("http")) url = (base || "").replace(/\/+$/, "") + url;
  const ev = {
    nome,
    municipio: textoDe(morada.addressLocality) || textoDe(loc.name) || "",
    distrito: textoDe(morada.addressRegion) || "",
    local: textoDe(loc.name) || "",
    inicio: dataIso(no.startDate),
    fim: dataIso(no.endDate) || dataIso(no.startDate),
    descricao: textoDe(no.description),
    url
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
    } catch { /* bloco inválido */ }
  }
  return eventos;
}

// ------------------------------------------------------------- RSS / Atom ---

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

// ------------------------------------------------------------ categorias ---

function categoriaHeuristica(nome, porOmissao) {
  const n = normaliza(nome);
  if (/(medieval|quinhentist|renascentist|templari|viking|romano)/.test(n)) return "feira-medieval";
  if (/artesanato|artesa/.test(n)) return "feira-artesanato";
  if (/carnaval|entrudo/.test(n)) return "carnaval";
  if (/(romaria|senhor|senhora|nossa sra|santuario|circio|cirio|procissao|fatima)/.test(n)) return "romaria";
  if (/(festival|concerto|musica|exposic|teatro|danca|cinema|opera|jazz|recital|orquestra)/.test(n)) return "festival";
  if (/feira|mercado|mostra/.test(n)) return "feira-tradicional";
  return porOmissao || "festa-popular";
}

// --------------------------------------------------------- geocodificação ---

let geocache = {};
try { geocache = JSON.parse(fs.readFileSync(FICHEIRO_GEOCACHE, "utf8")); } catch { geocache = {}; }
let geoPedidos = 0;

async function geocodificar(eventos) {
  for (const ev of eventos) {
    if (typeof ev.lat === "number" && typeof ev.lng === "number") continue;
    if (!ev.municipio) continue;
    const chave = normaliza(ev.municipio + "|" + (ev.distrito || ""));
    if (geocache[chave]) { ev.lat = geocache[chave][0]; ev.lng = geocache[chave][1]; continue; }
    if (geoPedidos >= MAX_GEOCODE) continue;
    try {
      const q = encodeURIComponent(ev.municipio + (ev.distrito ? ", " + ev.distrito : "") + ", Portugal");
      const resp = await fetch(NOMINATIM + "/search?format=json&limit=1&countrycodes=pt&q=" + q,
        { headers: { "User-Agent": UA } });
      geoPedidos++;
      if (resp.ok) {
        const json = await resp.json();
        if (json[0]) {
          ev.lat = parseFloat(json[0].lat); ev.lng = parseFloat(json[0].lon);
          geocache[chave] = [ev.lat, ev.lng];
        }
      }
      await new Promise(r => setTimeout(r, 1100));
    } catch { /* segue sem coordenadas */ }
  }
}

// ------------------------------------------------- importar uma fonte local ---

function caminhosCandidatos(fonte) {
  const raiz = fonte.url.replace(/\/+$/, "");
  const especificos = (fonte.paths || []).map(p => raiz + (p.startsWith("/") ? p : "/" + p));
  const habituais = [raiz, raiz + "/eventos", raiz + "/agenda", raiz + "/agenda-cultural", raiz + "/feed"];
  const vistos = new Set();
  return especificos.concat(habituais).filter(u => (vistos.has(u) ? false : (vistos.add(u), true))).slice(0, MAX_PATHS_POR_FONTE);
}

function normalizarLocal(bruto, fonte) {
  return {
    id: "fonte-" + fonte.id + "-" + slug(bruto.nome + "-" + (bruto.inicio || "")),
    nome: bruto.nome,
    categoria: categoriaHeuristica(bruto.nome, fonte.categoria),
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

async function importarFonte(fonte) {
  const brutos = [];
  for (const url of caminhosCandidatos(fonte)) {
    let texto;
    try { texto = await fetchTexto(url); } catch { continue; }
    if (eRssOuAtom(texto)) {
      for (const item of itensDeRss(texto)) {
        if (RE_EVENTO.test(normaliza(item.titulo))) brutos.push({ nome: item.titulo, url: item.url, descricao: item.resumo });
      }
    } else {
      brutos.push(...eventosDoJsonLd(texto, url, fonte.url));
    }
  }
  const porId = new Map();
  for (const b of brutos) {
    if (!b.nome) continue;
    const ev = normalizarLocal(b, fonte);
    if (!porId.has(ev.id)) porId.set(ev.id, ev);
  }
  return Array.from(porId.values());
}

// --------------------------------------------- importar festasearraiais.pt ---

async function urlsSitemapFA() {
  for (const caminho of ["/sitemap.xml", "/sitemap_index.xml"]) {
    try {
      const xml = await fetchTexto(FA_BASE + caminho);
      let urls = extrairLocs(xml);
      const subs = urls.filter(u => /\.xml(\?|$)/i.test(u)).slice(0, 12);
      if (subs.length && subs.length === urls.length) {
        urls = [];
        for (const sm of subs) { try { urls = urls.concat(extrairLocs(await fetchTexto(sm))); } catch {} }
      }
      urls = urls.filter(u => u.startsWith(FA_BASE) && !/\.xml(\?|$)/i.test(u));
      if (urls.length) return urls;
    } catch { /* tenta o próximo */ }
  }
  return [];
}

async function importarFestasArraiais() {
  let paginas = await urlsSitemapFA();
  const deEvento = paginas.filter(u => /\/(evento|festa|arraial)s?\//i.test(u));
  const fila = (deEvento.length ? deEvento : paginas).slice(0, MAX_PAGINAS_FA);
  const brutos = [];
  for (const url of fila) {
    let html;
    try { html = await fetchTexto(url); } catch { continue; }
    brutos.push(...eventosDoJsonLd(html, url, FA_BASE));
  }
  const porId = new Map();
  for (const b of brutos) {
    if (!b.nome) continue;
    const ev = {
      id: "festasearraiais-" + slug(b.nome + "-" + (b.municipio || "") + "-" + (b.inicio || "")),
      nome: b.nome,
      categoria: categoriaHeuristica(b.nome),
      municipio: b.municipio || "Portugal",
      distrito: b.distrito || "",
      regiao: "",
      local: b.local || "",
      lat: b.lat, lng: b.lng,
      inicio: b.inicio || null, fim: b.fim || b.inicio || null,
      estadoData: b.inicio ? "confirmada" : "estimada",
      descricao: b.descricao || "",
      origem: "festasearraiais",
      fonte: { nome: "Festas & Arraiais", url: b.url || FA_BASE },
      fontesAdicionais: [{ nome: "festasearraiais.pt", url: FA_BASE }]
    };
    if (!porId.has(ev.id)) porId.set(ev.id, ev);
  }
  return Array.from(porId.values());
}

// ----------------------------------------------------------------- main ---

async function main() {
  const seed = carregarComWindow(FICHEIRO_SEED, "SEED_DATA");
  const registo = carregarComWindow(FICHEIRO_REGISTO, "FONTES_REGISTO");
  console.log("Base curada: " + seed.eventos.length + " eventos; " + registo.length + " fontes registadas.");

  const resumo = [];
  const importados = [];

  for (const fonte of registo) {
    try {
      const eventos = await importarFonte(fonte);
      importados.push(...eventos);
      resumo.push({ fonte: fonte.nome, n: eventos.length });
      console.log("  " + fonte.nome + ": " + eventos.length + " eventos");
    } catch (err) {
      resumo.push({ fonte: fonte.nome, erro: err.message });
      console.log("  " + fonte.nome + ": ERRO " + err.message);
    }
  }

  try {
    const fa = await importarFestasArraiais();
    importados.push(...fa);
    resumo.push({ fonte: "festasearraiais.pt", n: fa.length });
    console.log("  festasearraiais.pt: " + fa.length + " eventos");
  } catch (err) {
    resumo.push({ fonte: "festasearraiais.pt", erro: err.message });
    console.log("  festasearraiais.pt: ERRO " + err.message);
  }

  // Dedupe dos importados por nome+município+data e contra o dataset curado.
  const chavesBase = new Set(seed.eventos.map(e => normaliza(e.nome + "|" + e.municipio)));
  const porId = new Map();
  for (const ev of importados) {
    const chaveDup = normaliza(ev.nome + "|" + ev.municipio);
    if (chavesBase.has(chaveDup)) continue;        // já existe no dataset curado
    if (!porId.has(ev.id)) porId.set(ev.id, ev);
  }
  const novos = Array.from(porId.values());

  console.log("Importados (após dedupe): " + novos.length + " eventos. A geocodificar municípios em falta…");
  await geocodificar(novos);

  // Mantém os eventos curados como autoritativos; junta os importados.
  const finais = seed.eventos.concat(novos)
    .sort((a, b) => String(a.inicio || "9999").localeCompare(String(b.inicio || "9999")));

  const saida = {
    version: seed.version,
    atualizadoEm: new Date().toISOString().slice(0, 10),
    geradoPor: "scripts/import-fontes.mjs",
    fontesResumo: resumo,
    eventos: finais
  };

  fs.mkdirSync(path.dirname(FICHEIRO_EVENTOS), { recursive: true });
  fs.writeFileSync(FICHEIRO_EVENTOS, JSON.stringify(saida, null, 2) + "\n");
  fs.writeFileSync(FICHEIRO_GEOCACHE, JSON.stringify(geocache, null, 2) + "\n");

  console.log("Gravado data/events.json: " + finais.length + " eventos (" +
    seed.eventos.length + " curados + " + novos.length + " importados). " +
    "Geocodificações novas: " + geoPedidos + ".");
}

main().catch(err => { console.error(err); process.exit(1); });

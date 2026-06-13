# 🎉 Festas & Feiras Populares · Portugal

Aplicação web **sem backend** — corre inteiramente no browser — para consultar e pesquisar
**festas populares, feiras de artesanato, feiras medievais, romarias e feiras tradicionais**
em Portugal, com a respetiva **fonte municipal/oficial** em cada evento.

## Funcionalidades

- 📋 **Lista** — eventos agrupados por mês, com pesquisa de texto livre e filtros por
  categoria, distrito e mês, e indicação de eventos *a decorrer* / *terminados*.
- 🗺️ **Mapa** — todos os eventos georreferenciados num mapa interativo (Leaflet +
  OpenStreetMap), com cores por categoria.
- 📅 **Calendário** — vista mensal com os eventos distribuídos pelos dias em que decorrem.
- ℹ️ **Detalhe** — descrição, datas (com indicação de **confirmadas** vs. **previstas**),
  local, **link para a fonte oficial** (câmara municipal ou organização), link para o
  Google Maps e pesquisa rápida de atualizações na web.
- 🔗 **Fontes** — diretório de todas as fontes municipais e oficiais usadas, e descoberta
  de mais eventos através da API pública da Wikipédia.
- 🌐 **festasearraiais.pt** — importação manual (botão na vista Fontes) de todos os
  eventos do agregador [Festas & Arraiais](https://festasearraiais.pt/): o browser
  descarrega o sitemap e as páginas do site (diretamente ou via proxies CORS públicos),
  extrai os dados estruturados schema.org (JSON-LD `Event`), geocodifica municípios em
  falta via Nominatim/OpenStreetMap e guarda tudo localmente, sem duplicar eventos já
  existentes. Repetir a importação substitui os dados anteriores dessa fonte.
- 🏘️ **Juntas de freguesia** — registo de fontes locais (`js/fontes-registo.js`) com
  sites de juntas de freguesia; o importador genérico (`js/fontes-importador.js`) lê as
  páginas de agenda/eventos e os feeds RSS de cada site (JSON-LD `Event` + títulos de
  notícias que anunciem festas/arraiais). O utilizador pode adicionar a junta da sua
  freguesia na vista Fontes.
- 🎭 **Centros culturais, museus e teatros** — o registo de fontes inclui também Casa da
  Música, Serralves, CCB, Gulbenkian, Culturgest, MAAT, teatros nacionais, coliseus e
  centros culturais, cujos eventos/festivais são importados para a categoria «Festival /
  cultura».
- 🔄 **Reler todas as fontes** — botão na vista Fontes que reimporta de uma vez todas as
  fontes configuradas (festasearraiais.pt + juntas + culturais + fontes do utilizador),
  com relatório por fonte.
- 🤖 **Importação no servidor (GitHub Actions)** — o workflow `importar-fontes.yml` corre
  `scripts/import-fontes.mjs` num runner (rede livre, sem CORS), importa de todas as fontes,
  geocodifica e atualiza `data/events.json` no repositório (manualmente ou semanalmente).
  Assim os eventos importados ficam disponíveis para todos os utilizadores via «⟳ Atualizar
  dados», sem cada um ter de os importar no browser.
- 💾 **Armazenamento local** — tudo é guardado no `localStorage` do browser; funciona
  offline depois do primeiro carregamento (Leaflet incluído localmente em `vendor/`).
- ⟳ **Atualizar dados** — vai buscar à web a versão mais recente do dataset publicado
  neste repositório (`data/events.json`) e funde-a com os seus dados locais.
- ＋ **Adicionar / editar / remover** eventos manualmente, e **importar/exportar** JSON.

## Como usar

Não precisa de instalar nada:

1. **Abrir diretamente**: faça duplo clique em `index.html` (funciona via `file://`), ou
2. **Servidor local** (recomendado para a atualização via web funcionar sem restrições):

   ```bash
   npx serve .          # ou: python3 -m http.server 8080
   ```

   e abra http://localhost:8080, ou
3. **GitHub Pages**: publique o repositório em Pages e abra o URL.

## Dados e fontes

O dataset base (`js/seed-events.js`, espelhado em `data/events.json`) foi compilado a
partir de **fontes municipais e oficiais** — câmaras municipais, sites oficiais das
organizações dos eventos e Visit Portugal. Cada evento regista a(s) sua(s) fonte(s) com link.

- `estadoData: "confirmada"` — datas anunciadas pela organização para a edição indicada
  (verificadas em junho de 2026: Viagem Medieval, Mercado Medieval de Óbidos, Feira
  Medieval de Silves, FIA Lisboa, Feira de São Mateus, Feira Afonsina, Romaria d'Agonia,
  Feira Nacional de Artesanato de Vila do Conde, entre outras).
- `estadoData: "estimada"` — datas previstas com base em edições anteriores;
  **confirme sempre na fonte oficial** antes de se deslocar.

### Atualizar o dataset

Editar `js/seed-events.js` (incrementando `version`) e regenerar o JSON:

```bash
node -e "global.window={};require('./js/seed-events.js');require('fs').writeFileSync('data/events.json',JSON.stringify(global.window.SEED_DATA,null,2)+'\n')"
```

O botão **⟳ Atualizar dados** da aplicação descarrega `data/events.json` do GitHub
(raw) e atualiza os utilizadores sem reinstalarem nada.

## Estrutura

```
index.html            página única da aplicação
css/styles.css        estilos
js/seed-events.js     dataset base embebido (funciona via file://)
js/utils.js           utilitários (datas, categorias, escaping)
js/store.js           dados: localStorage, fusão seed+importados+utilizador, web/Wikipédia, import/export
js/web-fontes.js      utilitários partilhados: proxies CORS, JSON-LD, RSS, geocodificação
js/festasearraiais.js conector de importação do site festasearraiais.pt
js/fontes-registo.js  registo de fontes (juntas de freguesia + centros culturais/museus)
js/fontes-importador.js importador genérico de fontes locais + «reler todas as fontes»
scripts/import-fontes.mjs  importador no servidor (Node) que atualiza data/events.json
.github/workflows/importar-fontes.yml  corre o import e faz commit dos dados
js/map-view.js        vista de mapa (Leaflet)
js/views.js           vistas de lista, calendário, fontes, detalhe e formulário
js/app.js             controlador: filtros, navegação, ações
data/events.json      dataset canónico para atualização via web
vendor/leaflet/       Leaflet 1.9.4 (local, para funcionar offline)
```

## Tecnologia

HTML + CSS + JavaScript puro (sem build, sem dependências de runtime além do Leaflet,
incluído no repositório). Mapa: [Leaflet](https://leafletjs.com/) com tiles
© [OpenStreetMap](https://www.openstreetmap.org/copyright).

// Dataset base de festas e feiras populares de Portugal.
// Compilado a partir de fontes municipais e oficiais (câmaras municipais,
// organizações dos eventos, Visit Portugal). Cada evento inclui a fonte.
// estadoData: "confirmada" = datas anunciadas pela organização para a edição indicada;
//             "estimada"   = datas previstas com base em edições anteriores (confirmar na fonte).
window.SEED_DATA = {
  version: 2,
  atualizadoEm: "2026-06-13",
  eventos: [
    {
      id: "santo-antonio-lisboa-2026",
      nome: "Festas de Lisboa / Santo António",
      categoria: "festa-popular",
      municipio: "Lisboa",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "Bairros históricos (Alfama, Mouraria, Madragoa) e Avenida da Liberdade",
      lat: 38.7139, lng: -9.1334,
      inicio: "2026-06-01", fim: "2026-06-30",
      estadoData: "confirmada",
      descricao: "As Festas de Lisboa enchem a cidade durante todo o mês de junho: arraiais nos bairros históricos, sardinha assada, manjericos e as Marchas Populares na Avenida da Liberdade na noite de 12 de junho. O ponto alto é o feriado de Santo António (13 de junho), com os Casamentos de Santo António e cortejos por toda a cidade.",
      fonte: { nome: "Festas de Lisboa (EGEAC)", url: "https://www.festasdelisboa.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Lisboa", url: "https://www.lisboa.pt/" }
      ]
    },
    {
      id: "sao-joao-porto-2026",
      nome: "São João do Porto",
      categoria: "festa-popular",
      municipio: "Porto",
      distrito: "Porto",
      regiao: "Norte",
      local: "Ribeira, Fontainhas e toda a cidade",
      lat: 41.1430, lng: -8.6110,
      inicio: "2026-06-23", fim: "2026-06-24",
      estadoData: "confirmada",
      descricao: "Uma das maiores festas populares da Europa. Na noite de 23 para 24 de junho, o Porto celebra o São João com martelinhos, alho-porro, manjericos, sardinhada, balões de São João e o grande fogo de artifício sobre o rio Douro, seguido do tradicional banho na Praia dos Ingleses.",
      fonte: { nome: "Câmara Municipal do Porto", url: "https://www.porto.pt/" },
      fontesAdicionais: [
        { nome: "Visit Porto", url: "https://visitporto.travel/" }
      ]
    },
    {
      id: "sao-joao-braga-2026",
      nome: "São João de Braga",
      categoria: "festa-popular",
      municipio: "Braga",
      distrito: "Braga",
      regiao: "Norte",
      local: "Centro da cidade e Parque de São João da Ponte",
      lat: 41.5454, lng: -8.4265,
      inicio: "2026-06-17", fim: "2026-06-24",
      estadoData: "estimada",
      descricao: "Uma das mais antigas festas sanjoaninas do país, com cortejos históricos, o tradicional Carro dos Pastores, rusgas, cabeçudos e gigantones, arraiais e a Procissão de São João. O ponto alto é a noite de 23 para 24 de junho.",
      fonte: { nome: "Festas de São João de Braga (oficial)", url: "https://saojoaobraga.pt/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Braga", url: "https://www.cm-braga.pt/" }
      ]
    },
    {
      id: "feira-afonsina-guimaraes-2026",
      nome: "Feira Afonsina",
      categoria: "feira-medieval",
      municipio: "Guimarães",
      distrito: "Braga",
      regiao: "Norte",
      local: "Centro histórico de Guimarães",
      lat: 41.4425, lng: -8.2918,
      inicio: "2026-06-11", fim: "2026-06-14",
      estadoData: "confirmada",
      descricao: "A 14.ª edição da Feira Afonsina transforma o centro histórico de Guimarães num cenário medieval, sob o tema “A Afirmação do Infante”. Mercado medieval, recriações históricas, mercadores, figurantes e animação de rua no berço da nacionalidade, em articulação com as celebrações do Dia Um de Portugal.",
      fonte: { nome: "Agenda Cultural de Guimarães (Câmara Municipal)", url: "https://em.guimaraes.pt/cultura/geo_evento-86/feira-afonsina-2026" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Guimarães", url: "https://www.cm-guimaraes.pt/" }
      ]
    },
    {
      id: "viagem-medieval-feira-2026",
      nome: "Viagem Medieval em Terra de Santa Maria",
      categoria: "feira-medieval",
      municipio: "Santa Maria da Feira",
      distrito: "Aveiro",
      regiao: "Norte",
      local: "Centro histórico e Castelo de Santa Maria da Feira",
      lat: 40.9253, lng: -8.5419,
      inicio: "2026-07-29", fim: "2026-08-09",
      estadoData: "confirmada",
      descricao: "A maior recriação medieval da Europa celebra 30 anos em 2026, dedicada a D. Afonso Henriques e ao Condado Portucalense. Doze dias de mercado medieval, batalhas, torneios, cortejos e milhares de figurantes em redor do castelo. Espetáculo de abertura gratuito na noite de 28 de julho.",
      fonte: { nome: "Viagem Medieval (oficial)", url: "https://www.viagemmedieval.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Santa Maria da Feira", url: "https://cm-feira.pt/" }
      ]
    },
    {
      id: "mercado-medieval-obidos-2026",
      nome: "Mercado Medieval de Óbidos",
      categoria: "feira-medieval",
      municipio: "Óbidos",
      distrito: "Leiria",
      regiao: "Centro",
      local: "Vila de Óbidos, dentro das muralhas",
      lat: 39.3608, lng: -9.1571,
      inicio: "2026-07-16", fim: "2026-07-26",
      estadoData: "confirmada",
      descricao: "O Mercado Medieval regressa a Óbidos de 16 a 26 de julho de 2026, com o tema “D. Fernando e Leonor Teles”. Onze dias de animação histórica dentro das muralhas: música, teatro de rua, torneios, artesanato e gastronomia de inspiração medieval, diariamente das 17h00 às 23h55.",
      fonte: { nome: "Mercado Medieval de Óbidos (oficial)", url: "https://mercadomedievalobidos.pt/" },
      fontesAdicionais: [
        { nome: "Município de Óbidos", url: "https://www.cm-obidos.pt/viver/programacao/evento/mercado-medieval-de-obidos" }
      ]
    },
    {
      id: "feira-medieval-silves-2026",
      nome: "Feira Medieval de Silves",
      categoria: "feira-medieval",
      municipio: "Silves",
      distrito: "Faro",
      regiao: "Algarve",
      local: "Centro histórico e Castelo de Silves",
      lat: 37.1894, lng: -8.4389,
      inicio: "2026-08-07", fim: "2026-08-15",
      estadoData: "confirmada",
      descricao: "A XXI Feira Medieval de Silves recria o ambiente da antiga capital do Algarve islâmico: mercadores, artesãos, espetáculos, cortejos e gastronomia da época, entre o castelo e as ruas do centro histórico.",
      fonte: { nome: "Feira Medieval de Silves (Câmara Municipal)", url: "https://feiramedievaldesilves.pt/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Silves", url: "https://www.cm-silves.pt/" }
      ]
    },
    {
      id: "fia-lisboa-2026",
      nome: "FIA Lisboa — Feira Internacional do Artesanato",
      categoria: "feira-artesanato",
      municipio: "Lisboa",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "FIL — Parque das Nações",
      lat: 38.7686, lng: -9.0954,
      inicio: "2026-06-27", fim: "2026-07-05",
      estadoData: "confirmada",
      descricao: "O maior evento de artesanato da Península Ibérica regressa à FIL, com o Alentejo e Ribatejo como região convidada de 2026. Centenas de artesãos nacionais e internacionais, demonstrações ao vivo, gastronomia regional e programação cultural.",
      fonte: { nome: "FIA Lisboa (FIL, oficial)", url: "https://fialisboa.fil.pt/" },
      fontesAdicionais: [
        { nome: "FIL — Feira Internacional de Lisboa", url: "https://www.fil.pt/" }
      ]
    },
    {
      id: "feira-nacional-artesanato-vila-do-conde-2026",
      nome: "Feira Nacional de Artesanato de Vila do Conde",
      categoria: "feira-artesanato",
      municipio: "Vila do Conde",
      distrito: "Porto",
      regiao: "Norte",
      local: "Jardins da Avenida Júlio Graça",
      lat: 41.3517, lng: -8.7479,
      inicio: "2026-07-25", fim: "2026-08-09",
      estadoData: "confirmada",
      descricao: "A 48.ª edição da mais emblemática feira de artesanato do país reúne artesãos de todo o território nos jardins da Avenida Júlio Graça, com demonstrações ao vivo (rendas de bilros, olaria, tecelagem), gastronomia e folclore. Entrada gratuita.",
      fonte: { nome: "Feira Nacional de Artesanato (oficial)", url: "https://feiranacionaldeartesanato.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Vila do Conde", url: "https://www.cm-viladoconde.pt/" }
      ]
    },
    {
      id: "feira-sao-mateus-viseu-2026",
      nome: "Feira de São Mateus",
      categoria: "feira-tradicional",
      municipio: "Viseu",
      distrito: "Viseu",
      regiao: "Centro",
      local: "Campo de Viriato",
      lat: 40.6610, lng: -7.9097,
      inicio: "2026-08-06", fim: "2026-09-06",
      estadoData: "confirmada",
      descricao: "A 634.ª edição da “Guardiã das Feiras Populares”, a feira mais antiga de Portugal. Um mês de concertos (Fernando Daniel, Plutónio, Calema, entre outros), artesanato, diversões, gastronomia e tradição no Campo de Viriato.",
      fonte: { nome: "Feira de São Mateus (oficial)", url: "https://feirasaomateus.pt/" },
      fontesAdicionais: [
        { nome: "Município de Viseu", url: "https://www.cm-viseu.pt/" }
      ]
    },
    {
      id: "romaria-agonia-viana-2026",
      nome: "Romaria de Nossa Senhora d'Agonia",
      categoria: "romaria",
      municipio: "Viana do Castelo",
      distrito: "Viana do Castelo",
      regiao: "Norte",
      local: "Centro histórico e Ribeira de Viana do Castelo",
      lat: 41.6932, lng: -8.8329,
      inicio: "2026-08-15", fim: "2026-08-23",
      estadoData: "confirmada",
      descricao: "A “rainha das romarias” do Minho: Festa do Traje, cortejo etnográfico, gigantones e cabeçudos, tapetes floridos nas ruas da Ribeira (noite de 19 para 20 de agosto), Procissão ao Mar a 20 de agosto e fogo de artifício sobre o rio Lima. A Feira de Artesanato no Jardim Público abre já a 7 de agosto.",
      fonte: { nome: "Festas d'Agonia (oficial)", url: "https://festasdagonia.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Viana do Castelo", url: "https://www.cm-viana-castelo.pt/visite-viana/sentir-viana/festas-e-romarias" }
      ]
    },
    {
      id: "feira-nacional-cavalo-golega-2026",
      nome: "Feira Nacional do Cavalo",
      categoria: "feira-tradicional",
      municipio: "Golegã",
      distrito: "Santarém",
      regiao: "Centro",
      local: "Largo do Arneiro e centro da vila",
      lat: 39.4047, lng: -8.4868,
      inicio: "2026-11-06", fim: "2026-11-15",
      estadoData: "estimada",
      descricao: "A “Capital do Cavalo” recebe a maior feira equestre do país, em torno do São Martinho (11 de novembro): cavalo Lusitano, atrelagem, concursos, campinos, gastronomia ribatejana e castanhas com água-pé.",
      fonte: { nome: "Feira Nacional do Cavalo (oficial)", url: "https://feiranacionaldocavalo.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal da Golegã", url: "https://www.cm-golega.pt/" }
      ]
    },
    {
      id: "carnaval-torres-vedras-2026",
      nome: "Carnaval de Torres Vedras",
      categoria: "carnaval",
      municipio: "Torres Vedras",
      distrito: "Lisboa",
      regiao: "Oeste",
      local: "Centro da cidade",
      lat: 39.0910, lng: -9.2587,
      inicio: "2026-02-13", fim: "2026-02-18",
      estadoData: "confirmada",
      descricao: "“O Carnaval mais português de Portugal”: corsos diurnos e noturnos, matrafonas, cabeçudos, carros alegóricos de sátira política e os Reis do Carnaval. Seis dias de folia ininterrupta no centro de Torres Vedras.",
      fonte: { nome: "Carnaval de Torres Vedras (Promotorres)", url: "https://www.carnavaldetorres.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Torres Vedras", url: "https://www.cm-tvedras.pt/" }
      ]
    },
    {
      id: "carnaval-loule-2026",
      nome: "Carnaval de Loulé",
      categoria: "carnaval",
      municipio: "Loulé",
      distrito: "Faro",
      regiao: "Algarve",
      local: "Avenida José da Costa Mealha",
      lat: 37.1379, lng: -8.0200,
      inicio: "2026-02-15", fim: "2026-02-17",
      estadoData: "confirmada",
      descricao: "O carnaval mais antigo de Portugal (desde 1906), com corso de carros alegóricos, samba, sátira e milhares de foliões na avenida principal de Loulé.",
      fonte: { nome: "Câmara Municipal de Loulé", url: "https://www.cm-loule.pt/" },
      fontesAdicionais: [
        { nome: "Visit Algarve", url: "https://visitalgarve.pt/" }
      ]
    },
    {
      id: "festas-gualterianas-guimaraes-2026",
      nome: "Festas Gualterianas (São Gualter)",
      categoria: "festa-popular",
      municipio: "Guimarães",
      distrito: "Braga",
      regiao: "Norte",
      local: "Centro de Guimarães",
      lat: 41.4416, lng: -8.2955,
      inicio: "2026-07-31", fim: "2026-08-03",
      estadoData: "estimada",
      descricao: "As festas da cidade de Guimarães, realizadas desde 1906 no primeiro fim de semana de agosto: cortejo histórico, marcha gualteriana, batalha das flores, feira franca e arraiais em honra de São Gualter.",
      fonte: { nome: "Câmara Municipal de Guimarães", url: "https://www.cm-guimaraes.pt/" },
      fontesAdicionais: [
        { nome: "Agenda Cultural de Guimarães", url: "https://em.guimaraes.pt/" }
      ]
    },
    {
      id: "colete-encarnado-vfx-2026",
      nome: "Festa do Colete Encarnado",
      categoria: "festa-popular",
      municipio: "Vila Franca de Xira",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "Centro da cidade e Palha Blanco",
      lat: 38.9552, lng: -8.9897,
      inicio: "2026-07-03", fim: "2026-07-05",
      estadoData: "estimada",
      descricao: "A grande festa brava do Ribatejo, no primeiro fim de semana de julho: esperas de toiros nas ruas, largadas, corridas na Palha Blanco, campinos a cavalo, fandango e sardinha assada em honra do campino e do seu colete encarnado.",
      fonte: { nome: "Câmara Municipal de Vila Franca de Xira", url: "https://www.cm-vfxira.pt/" },
      fontesAdicionais: []
    },
    {
      id: "feira-santiago-setubal-2026",
      nome: "Feira de Sant'Iago",
      categoria: "feira-tradicional",
      municipio: "Setúbal",
      distrito: "Setúbal",
      regiao: "Área Metropolitana de Lisboa",
      local: "Parque de Exposições de Setúbal (Bonfim)",
      lat: 38.5290, lng: -8.8840,
      inicio: "2026-07-24", fim: "2026-08-09",
      estadoData: "estimada",
      descricao: "A grande feira anual de Setúbal, com mais de quatro séculos de história: concertos, tasquinhas, artesanato, diversões e produtos regionais, em torno do dia de Sant'Iago (25 de julho).",
      fonte: { nome: "Câmara Municipal de Setúbal", url: "https://www.mun-setubal.pt/" },
      fontesAdicionais: []
    },
    {
      id: "festas-mar-cascais-2026",
      nome: "Festas do Mar",
      categoria: "festa-popular",
      municipio: "Cascais",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "Baía de Cascais",
      lat: 38.6979, lng: -9.4215,
      inicio: "2026-08-21", fim: "2026-08-30",
      estadoData: "estimada",
      descricao: "Concertos gratuitos na baía de Cascais, procissão marítima em honra de Nossa Senhora dos Navegantes e homenagem às comunidades piscatórias, no final de agosto.",
      fonte: { nome: "Câmara Municipal de Cascais", url: "https://www.cascais.pt/" },
      fontesAdicionais: []
    },
    {
      id: "festa-vindimas-palmela-2026",
      nome: "Festa das Vindimas",
      categoria: "festa-popular",
      municipio: "Palmela",
      distrito: "Setúbal",
      regiao: "Área Metropolitana de Lisboa",
      local: "Centro histórico de Palmela",
      lat: 38.5690, lng: -8.9013,
      inicio: "2026-09-03", fim: "2026-09-08",
      estadoData: "estimada",
      descricao: "Desde 1963, Palmela celebra a vindima: bênção do primeiro mosto, cortejos alegóricos, pisa da uva, provas de vinhos da região, marchas populares e fogo de artifício junto ao castelo.",
      fonte: { nome: "Festa das Vindimas (oficial)", url: "https://www.festadasvindimas.org/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Palmela", url: "https://www.cm-palmela.pt/" }
      ]
    },
    {
      id: "romaria-remedios-lamego-2026",
      nome: "Romaria de Nossa Senhora dos Remédios",
      categoria: "romaria",
      municipio: "Lamego",
      distrito: "Viseu",
      regiao: "Norte",
      local: "Santuário de Nossa Senhora dos Remédios e centro de Lamego",
      lat: 41.0950, lng: -7.8120,
      inicio: "2026-09-04", fim: "2026-09-08",
      estadoData: "estimada",
      descricao: "A “Romaria de Portugal”: novena, majestosa Procissão do Triunfo com carros puxados por bois (8 de setembro), cortejo etnográfico, concertos e iluminações no escadório barroco do santuário.",
      fonte: { nome: "Câmara Municipal de Lamego", url: "https://www.cm-lamego.pt/" },
      fontesAdicionais: [
        { nome: "Santuário de Nossa Senhora dos Remédios", url: "https://santuarioremedioslamego.pt/" }
      ]
    },
    {
      id: "romaria-nazare-2026",
      nome: "Festas de Nossa Senhora da Nazaré",
      categoria: "romaria",
      municipio: "Nazaré",
      distrito: "Leiria",
      regiao: "Centro",
      local: "Sítio da Nazaré",
      lat: 39.6049, lng: -9.0762,
      inicio: "2026-09-07", fim: "2026-09-14",
      estadoData: "estimada",
      descricao: "Romaria secular em honra de Nossa Senhora da Nazaré, no Sítio: procissões, círio, festa popular, touradas e tradições piscatórias, em torno do feriado municipal de 8 de setembro.",
      fonte: { nome: "Câmara Municipal da Nazaré", url: "https://www.cm-nazare.pt/" },
      fontesAdicionais: [
        { nome: "Confraria de Nossa Senhora da Nazaré", url: "https://www.cnsn.pt/" }
      ]
    },
    {
      id: "feira-santa-iria-faro-2026",
      nome: "Feira de Santa Iria",
      categoria: "feira-tradicional",
      municipio: "Faro",
      distrito: "Faro",
      regiao: "Algarve",
      local: "Largo de São Francisco",
      lat: 37.0136, lng: -7.9330,
      inicio: "2026-10-16", fim: "2026-10-25",
      estadoData: "estimada",
      descricao: "A maior e mais antiga feira do Algarve, em meados de outubro: diversões, farturas, artesanato, tasquinhas e concertos no Largo de São Francisco, em Faro.",
      fonte: { nome: "Câmara Municipal de Faro", url: "https://www.cm-faro.pt/" },
      fontesAdicionais: []
    },
    {
      id: "feira-marco-aveiro-2026",
      nome: "Feira de Março",
      categoria: "feira-tradicional",
      municipio: "Aveiro",
      distrito: "Aveiro",
      regiao: "Centro",
      local: "Parque de Exposições de Aveiro",
      lat: 40.6356, lng: -8.6346,
      inicio: "2026-03-21", fim: "2026-04-13",
      estadoData: "estimada",
      descricao: "Com mais de 500 anos de história, a Feira de Março junta concertos, exposição comercial, diversões e gastronomia durante cerca de um mês, entre março e abril.",
      fonte: { nome: "Feira de Março (Câmara Municipal de Aveiro)", url: "https://www.feirademarco.pt/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Aveiro", url: "https://www.cm-aveiro.pt/" }
      ]
    },
    {
      id: "festa-sao-goncalinho-aveiro-2026",
      nome: "Festa de São Gonçalinho",
      categoria: "festa-popular",
      municipio: "Aveiro",
      distrito: "Aveiro",
      regiao: "Centro",
      local: "Capela de São Gonçalinho, Bairro da Beira-Mar",
      lat: 40.6443, lng: -8.6562,
      inicio: "2026-01-08", fim: "2026-01-12",
      estadoData: "estimada",
      descricao: "No bairro da Beira-Mar, em Aveiro, cumpre-se a tradição do lançamento de cavacas do alto da capela de São Gonçalinho, com a Dança dos Mancos, marchas e fogo de artifício, em janeiro.",
      fonte: { nome: "Mordomia de São Gonçalinho", url: "https://saogoncalinho.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Aveiro", url: "https://www.cm-aveiro.pt/" }
      ]
    },
    {
      id: "festa-cruzes-barcelos-2026",
      nome: "Festa das Cruzes",
      categoria: "romaria",
      municipio: "Barcelos",
      distrito: "Braga",
      regiao: "Norte",
      local: "Centro de Barcelos e Campo da Feira",
      lat: 41.5388, lng: -8.6151,
      inicio: "2026-04-25", fim: "2026-05-03",
      estadoData: "estimada",
      descricao: "A grande romaria minhota de Barcelos, em honra do Senhor da Cruz: tapetes de pétalas, procissões, bandas, feira de louça e do tradicional galo de Barcelos, e fogo de artifício sobre o rio Cávado, culminando a 3 de maio.",
      fonte: { nome: "Câmara Municipal de Barcelos", url: "https://www.cm-barcelos.pt/" },
      fontesAdicionais: []
    },
    {
      id: "sao-pedro-povoa-varzim-2026",
      nome: "Festas de São Pedro da Póvoa de Varzim",
      categoria: "festa-popular",
      municipio: "Póvoa de Varzim",
      distrito: "Porto",
      regiao: "Norte",
      local: "Centro da cidade e bairros piscatórios",
      lat: 41.3830, lng: -8.7669,
      inicio: "2026-06-28", fim: "2026-06-29",
      estadoData: "confirmada",
      descricao: "Na noite de 28 para 29 de junho, a Póvoa celebra o seu padroeiro com as rusgas dos bairros, tronos de São Pedro, sardinhada e arraiais junto ao mar.",
      fonte: { nome: "Câmara Municipal da Póvoa de Varzim", url: "https://www.cm-pvarzim.pt/" },
      fontesAdicionais: []
    },
    {
      id: "feira-sao-joao-evora-2026",
      nome: "Feira de São João de Évora",
      categoria: "feira-tradicional",
      municipio: "Évora",
      distrito: "Évora",
      regiao: "Alentejo",
      local: "Parque urbano / Rossio de São Brás",
      lat: 38.5667, lng: -7.9070,
      inicio: "2026-06-19", fim: "2026-06-29",
      estadoData: "estimada",
      descricao: "A grande feira anual do Alentejo, com séculos de tradição: artesanato, gastronomia alentejana, tasquinhas, concertos, diversões e exposição económica, em torno do São João.",
      fonte: { nome: "Câmara Municipal de Évora", url: "https://www.cm-evora.pt/" },
      fontesAdicionais: []
    },
    {
      id: "feira-nacional-agricultura-santarem-2026",
      nome: "Feira Nacional da Agricultura / Feira do Ribatejo",
      categoria: "feira-tradicional",
      municipio: "Santarém",
      distrito: "Santarém",
      regiao: "Centro",
      local: "CNEMA — Centro Nacional de Exposições",
      lat: 39.2270, lng: -8.6963,
      inicio: "2026-06-06", fim: "2026-06-14",
      estadoData: "estimada",
      descricao: "A montra do mundo rural português: agricultura, pecuária, cavalo Lusitano, campinos, gastronomia e folclore ribatejano, no CNEMA em Santarém, no início de junho.",
      fonte: { nome: "Feira Nacional da Agricultura (CNEMA)", url: "https://feiranacionalagricultura.pt/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Santarém", url: "https://www.cm-santarem.pt/" }
      ]
    },
    {
      id: "ovibeja-2026",
      nome: "Ovibeja",
      categoria: "feira-tradicional",
      municipio: "Beja",
      distrito: "Beja",
      regiao: "Alentejo",
      local: "Parque de Feiras e Exposições de Beja",
      lat: 38.0200, lng: -7.8632,
      inicio: "2026-04-29", fim: "2026-05-03",
      estadoData: "estimada",
      descricao: "A grande feira do mundo rural alentejano: ovinicultura, agricultura, artesanato, gastronomia e concertos, organizada pela ACOS em Beja, no final de abril.",
      fonte: { nome: "Ovibeja (ACOS)", url: "https://www.ovibeja.pt/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Beja", url: "https://www.cm-beja.pt/" }
      ]
    },
    {
      id: "sanjoaninas-angra-2026",
      nome: "Sanjoaninas",
      categoria: "festa-popular",
      municipio: "Angra do Heroísmo",
      distrito: "Açores (Terceira)",
      regiao: "Açores",
      local: "Centro histórico de Angra do Heroísmo",
      lat: 38.6553, lng: -27.2172,
      inicio: "2026-06-19", fim: "2026-06-28",
      estadoData: "estimada",
      descricao: "As maiores festas profanas dos Açores, na ilha Terceira: marchas, desfiles, touradas à corda, concertos e a coroação da rainha das festas, em torno do São João.",
      fonte: { nome: "Sanjoaninas (Câmara Municipal de Angra do Heroísmo)", url: "https://sanjoaninas.pt/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Angra do Heroísmo", url: "https://angradoheroismo.pt/" }
      ]
    },
    {
      id: "santo-cristo-ponta-delgada-2026",
      nome: "Festas do Senhor Santo Cristo dos Milagres",
      categoria: "romaria",
      municipio: "Ponta Delgada",
      distrito: "Açores (São Miguel)",
      regiao: "Açores",
      local: "Campo de São Francisco, Ponta Delgada",
      lat: 37.7412, lng: -25.6756,
      inicio: "2026-05-08", fim: "2026-05-14",
      estadoData: "estimada",
      descricao: "A maior manifestação religiosa dos Açores: a procissão do Senhor Santo Cristo dos Milagres percorre as ruas engalanadas de Ponta Delgada no quinto domingo depois da Páscoa, com arraial, iluminações e filarmónicas.",
      fonte: { nome: "Santuário do Senhor Santo Cristo dos Milagres", url: "https://santocristopdl.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Ponta Delgada", url: "https://www.cm-pontadelgada.pt/" }
      ]
    },
    {
      id: "festa-flor-funchal-2026",
      nome: "Festa da Flor",
      categoria: "festa-popular",
      municipio: "Funchal",
      distrito: "Madeira",
      regiao: "Madeira",
      local: "Centro do Funchal",
      lat: 32.6498, lng: -16.9084,
      inicio: "2026-04-16", fim: "2026-05-10",
      estadoData: "estimada",
      descricao: "O Funchal cobre-se de flores na primavera: Cortejo Alegórico da Flor, tapetes florais, Muro da Esperança e espetáculos, num dos maiores cartazes turísticos da Madeira, após a Páscoa.",
      fonte: { nome: "Visit Madeira (Governo Regional)", url: "https://visitmadeira.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal do Funchal", url: "https://funchal.pt/" }
      ]
    },
    {
      id: "mercado-quinhentista-machico-2026",
      nome: "Mercado Quinhentista de Machico",
      categoria: "feira-medieval",
      municipio: "Machico",
      distrito: "Madeira",
      regiao: "Madeira",
      local: "Centro histórico de Machico",
      lat: 32.7170, lng: -16.7676,
      inicio: "2026-06-05", fim: "2026-06-07",
      estadoData: "estimada",
      descricao: "Machico recua ao século XVI, evocando os descobrimentos e o quotidiano da primeira capitania da Madeira: mercado de época, cortejos, recriações históricas e gastronomia quinhentista.",
      fonte: { nome: "Câmara Municipal de Machico", url: "https://cm-machico.pt/" },
      fontesAdicionais: []
    },
    {
      id: "festa-tabuleiros-tomar-2027",
      nome: "Festa dos Tabuleiros (Festa do Espírito Santo)",
      categoria: "festa-popular",
      municipio: "Tomar",
      distrito: "Santarém",
      regiao: "Centro",
      local: "Centro histórico de Tomar",
      lat: 39.6029, lng: -8.4135,
      inicio: "2027-07-03", fim: "2027-07-12",
      estadoData: "estimada",
      descricao: "Uma das mais belas e antigas festas de Portugal, realizada de quatro em quatro anos: o Cortejo dos Tabuleiros leva centenas de raparigas com tabuleiros de pão e flores da altura de uma pessoa. Próxima edição prevista para julho de 2027.",
      fonte: { nome: "Festa dos Tabuleiros (oficial)", url: "https://www.tabuleiros.org/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Tomar", url: "https://www.cm-tomar.pt/" }
      ]
    },
    {
      id: "festival-islamico-mertola-2027",
      nome: "Festival Islâmico de Mértola",
      categoria: "feira-medieval",
      municipio: "Mértola",
      distrito: "Beja",
      regiao: "Alentejo",
      local: "Vila de Mértola",
      lat: 37.6438, lng: -7.6604,
      inicio: "2027-05-20", fim: "2027-05-23",
      estadoData: "estimada",
      descricao: "De dois em dois anos (anos ímpares), Mértola evoca o seu passado islâmico: souk, música do Mediterrâneo e do Magrebe, gastronomia, chá e artesanato nas ruas brancas da vila. Próxima edição prevista para maio de 2027.",
      fonte: { nome: "Festival Islâmico de Mértola (Câmara Municipal)", url: "https://festivalislamicodemertola.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Mértola", url: "https://www.cm-mertola.pt/" }
      ]
    },
    {
      id: "festas-povo-campo-maior",
      nome: "Festas do Povo de Campo Maior (Festas das Flores)",
      categoria: "festa-popular",
      municipio: "Campo Maior",
      distrito: "Portalegre",
      regiao: "Alentejo",
      local: "Ruas de Campo Maior",
      lat: 39.0149, lng: -7.0664,
      inicio: "2026-08-22", fim: "2026-08-30",
      estadoData: "estimada",
      descricao: "Património Cultural Imaterial da UNESCO: quando o povo decide, as ruas de Campo Maior cobrem-se de milhões de flores de papel feitas à mão pelos moradores. Não tem periodicidade fixa — confirme na fonte oficial se há edição anunciada.",
      fonte: { nome: "Câmara Municipal de Campo Maior", url: "https://www.cm-campo-maior.pt/" },
      fontesAdicionais: []
    },
    {
      id: "queima-fitas-coimbra-2026",
      nome: "Festas da Rainha Santa Isabel",
      categoria: "romaria",
      municipio: "Coimbra",
      distrito: "Coimbra",
      regiao: "Centro",
      local: "Centro histórico de Coimbra",
      lat: 40.2110, lng: -8.4292,
      inicio: "2026-07-02", fim: "2026-07-12",
      estadoData: "estimada",
      descricao: "De dois em dois anos (anos pares), Coimbra honra a sua padroeira: procissões noturna e diurna da Rainha Santa, cerimónias, feira e festa popular junto ao Mondego.",
      fonte: { nome: "Câmara Municipal de Coimbra", url: "https://www.cm-coimbra.pt/" },
      fontesAdicionais: [
        { nome: "Confraria da Rainha Santa Isabel", url: "https://www.rainhasantaisabel.org/" }
      ]
    },
    {
      id: "feira-medieval-leiria-2026",
      nome: "Mercado Medieval de Leiria",
      categoria: "feira-medieval",
      municipio: "Leiria",
      distrito: "Leiria",
      regiao: "Centro",
      local: "Castelo de Leiria e centro histórico",
      lat: 39.7472, lng: -8.8090,
      inicio: "2026-05-28", fim: "2026-05-31",
      estadoData: "estimada",
      descricao: "O centro histórico e o castelo de Leiria recuam à Idade Média: mercado de época, recriações, torneios e gastronomia medieval, habitualmente no final de maio/início de junho.",
      fonte: { nome: "Câmara Municipal de Leiria", url: "https://www.cm-leiria.pt/" },
      fontesAdicionais: []
    },
    {
      id: "serralves-em-festa-2026",
      nome: "Serralves em Festa",
      categoria: "festival",
      municipio: "Porto",
      distrito: "Porto",
      regiao: "Norte",
      local: "Fundação de Serralves e Parque",
      lat: 41.1592, lng: -8.6593,
      inicio: "2026-05-29", fim: "2026-05-31",
      estadoData: "confirmada",
      descricao: "A 20.ª edição do maior evento cultural gratuito do país: cerca de 50 horas contínuas de música, dança, teatro de rua, circo, cinema, visitas e oficinas, nos jardins e edifícios da Fundação de Serralves, no último fim de semana de maio.",
      fonte: { nome: "Fundação de Serralves", url: "https://www.serralves.pt/atividades-serralves/serralves-em-festa-2026/" },
      fontesAdicionais: [
        { nome: "Serralves", url: "https://www.serralves.pt/" }
      ]
    },
    {
      id: "jazz-em-agosto-2026",
      nome: "Jazz em Agosto",
      categoria: "festival",
      municipio: "Lisboa",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "Anfiteatro ao Ar Livre — Fundação Calouste Gulbenkian",
      lat: 38.7370, lng: -9.1539,
      inicio: "2026-07-31", fim: "2026-08-09",
      estadoData: "confirmada",
      descricao: "Festival de referência do jazz e da música improvisada, no jardim da Gulbenkian: catorze concertos com nomes de topo da cena internacional, entre 31 de julho e 9 de agosto de 2026.",
      fonte: { nome: "Jazz em Agosto (Fundação Calouste Gulbenkian)", url: "https://gulbenkian.pt/jazzemagosto/" },
      fontesAdicionais: [
        { nome: "Fundação Calouste Gulbenkian", url: "https://gulbenkian.pt/" }
      ]
    },
    {
      id: "nos-alive-2026",
      nome: "NOS Alive",
      categoria: "festival",
      municipio: "Oeiras",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "Passeio Marítimo de Algés",
      lat: 38.6975, lng: -9.2308,
      inicio: "2026-07-09", fim: "2026-07-11",
      estadoData: "confirmada",
      descricao: "Um dos maiores festivais de música da Europa, no Passeio Marítimo de Algés. A 18.ª edição decorre a 9, 10 e 11 de julho de 2026, com cartaz internacional (Foo Fighters, Nick Cave & The Bad Seeds, Florence + The Machine, entre outros).",
      fonte: { nome: "NOS Alive (oficial)", url: "https://nosalive.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Oeiras", url: "https://www.oeiras.pt/-/nos-alive-2026" }
      ]
    },
    {
      id: "festival-ao-largo-2026",
      nome: "Festival ao Largo",
      categoria: "festival",
      municipio: "Lisboa",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "Largo de São Carlos",
      lat: 38.7100, lng: -9.1411,
      inicio: "2026-07-01", fim: "2026-07-19",
      estadoData: "estimada",
      descricao: "Ciclo de espetáculos gratuitos de música clássica, ópera e dança ao ar livre, no Largo de São Carlos, em frente ao Teatro Nacional de São Carlos, ao longo do mês de julho.",
      fonte: { nome: "Teatro Nacional de São Carlos", url: "https://tnsc.pt/" },
      fontesAdicionais: [
        { nome: "OPART", url: "https://www.opart.pt/" }
      ]
    },
    {
      id: "vodafone-paredes-de-coura-2026",
      nome: "Vodafone Paredes de Coura",
      categoria: "festival",
      municipio: "Paredes de Coura",
      distrito: "Viana do Castelo",
      regiao: "Norte",
      local: "Praia Fluvial do Taboão",
      lat: 41.9110, lng: -8.5610,
      inicio: "2026-08-19", fim: "2026-08-22",
      estadoData: "estimada",
      descricao: "Festival de música de culto no anfiteatro natural da praia fluvial do Taboão, conhecido pela paisagem e pela curadoria indie/alternativa, em meados de agosto.",
      fonte: { nome: "Vodafone Paredes de Coura (oficial)", url: "https://paredesdecoura.com/" },
      fontesAdicionais: [
        { nome: "Câmara Municipal de Paredes de Coura", url: "https://www.paredesdecoura.pt/" }
      ]
    },
    {
      id: "meo-kalorama-2026",
      nome: "MEO Kalorama",
      categoria: "festival",
      municipio: "Lisboa",
      distrito: "Lisboa",
      regiao: "Área Metropolitana de Lisboa",
      local: "Parque da Bela Vista",
      lat: 38.7430, lng: -9.1240,
      inicio: "2026-08-27", fim: "2026-08-29",
      estadoData: "estimada",
      descricao: "Festival urbano no Parque da Bela Vista, em Lisboa, com cartaz pop/rock/eletrónica internacional, no final de agosto.",
      fonte: { nome: "MEO Kalorama (oficial)", url: "https://meokalorama.pt/" },
      fontesAdicionais: []
    }
  ]
};

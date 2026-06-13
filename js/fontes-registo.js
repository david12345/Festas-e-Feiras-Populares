// Registo de fontes locais e culturais adicionais que publicam agendas de
// eventos, festivais, festas e arraiais. O importador genérico tenta extrair
// eventos de cada uma (JSON-LD schema.org e feeds RSS). O utilizador pode
// acrescentar a junta da sua freguesia ou outra fonte na vista Fontes.
//
// Campos por fonte:
//   id, nome, tipo ("junta" | "cultura"), municipio, distrito, url
//   categoria  (opcional) categoria por omissão dos eventos desta fonte
//   paths      (opcional) caminhos de agenda/eventos a tentar, além dos habituais
window.FONTES_REGISTO = [
  // --- Juntas de freguesia ------------------------------------------------
  {
    id: "jf-ramalde", nome: "Junta de Freguesia de Ramalde", tipo: "junta",
    municipio: "Porto", distrito: "Porto", url: "https://www.jf-ramalde.pt"
  },
  {
    id: "jf-bonfim", nome: "Junta de Freguesia do Bonfim", tipo: "junta",
    municipio: "Porto", distrito: "Porto", url: "https://www.jfbonfim.pt",
    paths: ["/Eventos"]
  },
  {
    id: "jf-paranhos", nome: "Junta de Freguesia de Paranhos", tipo: "junta",
    municipio: "Porto", distrito: "Porto", url: "https://www.jfparanhos-porto.pt"
  },
  {
    id: "jf-alvalade", nome: "Junta de Freguesia de Alvalade", tipo: "junta",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://jf-alvalade.pt"
  },
  {
    id: "jf-arroios", nome: "Junta de Freguesia de Arroios", tipo: "junta",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://jfarroios.pt"
  },
  {
    id: "jf-campo-de-ourique", nome: "Junta de Freguesia de Campo de Ourique", tipo: "junta",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://jfcampodeourique.pt"
  },
  {
    id: "jf-benfica", nome: "Junta de Freguesia de Benfica", tipo: "junta",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://jfbenfica.pt"
  },

  // --- Centros culturais, casas das artes, museus e teatros ---------------
  {
    id: "casa-da-musica", nome: "Casa da Música", tipo: "cultura",
    municipio: "Porto", distrito: "Porto", url: "https://www.casadamusica.com",
    categoria: "festival", paths: ["/pt/agenda", "/agenda", "/pt/programacao"]
  },
  {
    id: "serralves", nome: "Fundação de Serralves", tipo: "cultura",
    municipio: "Porto", distrito: "Porto", url: "https://www.serralves.pt",
    categoria: "festival", paths: ["/agenda", "/pt/agenda", "/atividades-serralves"]
  },
  {
    id: "ccb", nome: "Centro Cultural de Belém (CCB)", tipo: "cultura",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://www.ccb.pt",
    categoria: "festival", paths: ["/agenda", "/pt/agenda", "/programacao"]
  },
  {
    id: "gulbenkian", nome: "Fundação Calouste Gulbenkian", tipo: "cultura",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://gulbenkian.pt",
    categoria: "festival", paths: ["/agenda", "/pt/agenda", "/agenda/"]
  },
  {
    id: "culturgest", nome: "Culturgest", tipo: "cultura",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://www.culturgest.pt",
    categoria: "festival", paths: ["/pt/agenda", "/agenda", "/pt/whats-on"]
  },
  {
    id: "maat", nome: "MAAT — Museu de Arte, Arquitetura e Tecnologia", tipo: "cultura",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://www.maat.pt",
    categoria: "festival", paths: ["/pt/agenda", "/agenda", "/pt/programa"]
  },
  {
    id: "tndm", nome: "Teatro Nacional D. Maria II", tipo: "cultura",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://www.tndm.pt",
    categoria: "festival", paths: ["/pt/agenda", "/agenda", "/programacao"]
  },
  {
    id: "tnsj", nome: "Teatro Nacional São João", tipo: "cultura",
    municipio: "Porto", distrito: "Porto", url: "https://www.tnsj.pt",
    categoria: "festival", paths: ["/pt/agenda", "/agenda", "/espetaculos"]
  },
  {
    id: "coliseu-porto", nome: "Coliseu do Porto", tipo: "cultura",
    municipio: "Porto", distrito: "Porto", url: "https://www.coliseu.pt",
    categoria: "festival", paths: ["/agenda", "/pt/agenda", "/eventos"]
  },
  {
    id: "coliseu-lisboa", nome: "Coliseu dos Recreios", tipo: "cultura",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://www.coliseulisboa.com",
    categoria: "festival", paths: ["/agenda", "/eventos", "/programacao"]
  },
  {
    id: "ccvf", nome: "Centro Cultural Vila Flor", tipo: "cultura",
    municipio: "Guimarães", distrito: "Braga", url: "https://www.ccvf.pt",
    categoria: "festival", paths: ["/pt/agenda", "/agenda", "/programacao"]
  },
  {
    id: "theatro-circo", nome: "Theatro Circo de Braga", tipo: "cultura",
    municipio: "Braga", distrito: "Braga", url: "https://www.theatrocirco.com",
    categoria: "festival", paths: ["/pt/agenda", "/agenda", "/espetaculos"]
  },
  {
    id: "convento-sao-francisco", nome: "Convento São Francisco (Coimbra)", tipo: "cultura",
    municipio: "Coimbra", distrito: "Coimbra", url: "https://conventosaofrancisco.pt",
    categoria: "festival", paths: ["/agenda", "/eventos", "/programacao"]
  },
  {
    id: "centro-cultural-gafanha", nome: "Casa das Artes / Centro Cultural", tipo: "cultura",
    municipio: "Lisboa", distrito: "Lisboa", url: "https://www.cm-lisboa.pt",
    categoria: "festival", paths: ["/agenda", "/viver/cultura/agenda-cultural"]
  }
];

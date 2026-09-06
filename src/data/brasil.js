/**
 * KidsGameHub — o Brasil
 * ElCamargo Soluções em TI LTDA
 *
 * Só dados: nenhuma lógica de jogo, nenhum componente.
 *
 * O app nasceu olhando o mundo — 176 bandeiras, capitais de sete regiões. A
 * escola brasileira faz o caminho contrário: começa pela rua, pelo município,
 * pelo estado, e só depois chega no mundo. Faltava justamente o começo.
 *
 * Aqui estão as cinco regiões com seus 27 estados, e os fatos que a prova de
 * 3º ao 5º ano cobra: símbolos, biomas, o rio, a capital do país.
 *
 * O campo n é o degrau: 1 é o que toda criança brasileira ouve falar, 4 é o
 * que aparece na prova de 5º ano.
 *
 * As capitais NÃO estão aqui de propósito: elas já são um jogo inteiro
 * (src/data/geografia.js + o mapa das capitais). Repetir seria duas trilhas
 * ensinando a mesma coisa.
 */

/* Sem figura de propósito: a pergunta de região mostra sempre o mapa, para
   não entregar a resposta antes de a criança pensar. */
export const REGIOES = {
  norte:    { nome: "Norte" },
  nordeste: { nome: "Nordeste" },
  centro:   { nome: "Centro-Oeste" },
  sudeste:  { nome: "Sudeste" },
  sul:      { nome: "Sul" },
};

/* Os 27 estados, com a região e o quanto a criança já ouviu falar deles. */
export const ESTADOS = [
  { w: "São Paulo", r: "sudeste", n: 1 },
  { w: "Rio de Janeiro", r: "sudeste", n: 1 },
  { w: "Minas Gerais", r: "sudeste", n: 1 },
  { w: "Bahia", r: "nordeste", n: 1 },
  { w: "Amazonas", r: "norte", n: 1 },
  { w: "Santa Catarina", r: "sul", n: 1 },
  { w: "Rio Grande do Sul", r: "sul", n: 1 },
  { w: "Paraná", r: "sul", n: 1 },
  { w: "Ceará", r: "nordeste", n: 2 },
  { w: "Pernambuco", r: "nordeste", n: 2 },
  { w: "Goiás", r: "centro", n: 2 },
  { w: "Pará", r: "norte", n: 2 },
  { w: "Espírito Santo", r: "sudeste", n: 2 },
  { w: "Mato Grosso", r: "centro", n: 2 },
  { w: "Distrito Federal", r: "centro", n: 2 },
  { w: "Maranhão", r: "nordeste", n: 3 },
  { w: "Paraíba", r: "nordeste", n: 3 },
  { w: "Rio Grande do Norte", r: "nordeste", n: 3 },
  { w: "Alagoas", r: "nordeste", n: 3 },
  { w: "Mato Grosso do Sul", r: "centro", n: 3 },
  { w: "Piauí", r: "nordeste", n: 3 },
  { w: "Sergipe", r: "nordeste", n: 4 },
  { w: "Acre", r: "norte", n: 4 },
  { w: "Rondônia", r: "norte", n: 4 },
  { w: "Roraima", r: "norte", n: 4 },
  { w: "Amapá", r: "norte", n: 4 },
  { w: "Tocantins", r: "norte", n: 4 },
];

/* Fatos com pergunta pronta. Mesma regra do banco de leitura: a alternativa
   errada tem que ser plausível para quem não sabe e claramente errada para
   quem sabe. */
export const FATOS = [
  /* ---------- símbolos ---------- */
  { tema: "simbolos", n: 1, e: "🏛️", q: "Qual é a capital do Brasil?", a: "Brasília",
    o: ["Brasília", "São Paulo", "Rio de Janeiro", "Salvador"],
    porque: "Brasília é a capital desde 1960. Antes dela foi o Rio de Janeiro." },
  { tema: "simbolos", n: 1, e: "🇧🇷", q: "De que cor é o losango da bandeira do Brasil?", a: "Amarelo",
    o: ["Amarelo", "Azul", "Branco", "Verde"],
    porque: "A bandeira tem o fundo verde, o losango amarelo e o círculo azul." },
  { tema: "simbolos", n: 2, e: "🇧🇷", q: "O que está escrito na faixa da bandeira?", a: "Ordem e Progresso",
    o: ["Ordem e Progresso", "Paz e Amor", "Brasil Unido", "Terra à Vista"],
    porque: "A faixa branca traz a frase Ordem e Progresso." },
  { tema: "simbolos", n: 2, e: "🎵", q: "Como se chama a música oficial do país?", a: "Hino Nacional",
    o: ["Hino Nacional", "Canção do Brasil", "Marcha do Povo", "Samba da Bandeira"],
    porque: "O Hino Nacional é um dos quatro símbolos oficiais, com a bandeira, as armas e o selo." },
  { tema: "simbolos", n: 3, e: "🌐", q: "O que o círculo azul da bandeira representa?", a: "O céu com estrelas",
    o: ["O céu com estrelas", "O mar do litoral", "Um lago grande", "A chuva"],
    porque: "O círculo azul é o céu do Rio de Janeiro com as estrelas, e cada estrela é um estado." },
  { tema: "simbolos", n: 3, e: "🗣️", q: "Qual é a língua oficial do Brasil?", a: "Português",
    o: ["Português", "Espanhol", "Inglês", "Tupi"],
    porque: "O Brasil é o único país da América com o português como língua oficial." },

  /* ---------- o mapa ---------- */
  { tema: "mapa", n: 1, e: "🗺️", q: "Quantas regiões tem o Brasil?", a: "5",
    o: ["5", "3", "7", "27"],
    porque: "São cinco: Norte, Nordeste, Centro-Oeste, Sudeste e Sul." },
  { tema: "mapa", n: 2, e: "🗺️", q: "Quantos estados tem o Brasil?", a: "26 e mais o Distrito Federal",
    o: ["26 e mais o Distrito Federal", "20", "30", "15"],
    porque: "São 26 estados mais o Distrito Federal, onde fica Brasília." },
  { tema: "mapa", n: 2, e: "🌎", q: "Em que continente fica o Brasil?", a: "América do Sul",
    o: ["América do Sul", "África", "Europa", "América do Norte"],
    porque: "O Brasil é o maior país da América do Sul." },
  { tema: "mapa", n: 3, e: "🌊", q: "Que oceano banha o litoral brasileiro?", a: "Atlântico",
    o: ["Atlântico", "Pacífico", "Índico", "Ártico"],
    porque: "Todo o litoral do Brasil é banhado pelo oceano Atlântico." },
  { tema: "mapa", n: 3, e: "🏞️", q: "Qual é o maior rio do Brasil?", a: "Amazonas",
    o: ["Amazonas", "São Francisco", "Tietê", "Paraná"],
    porque: "O rio Amazonas é o maior do Brasil e o de maior volume de água do mundo." },
  { tema: "mapa", n: 4, e: "🧭", q: "Qual região do Brasil é a maior em tamanho?", a: "Norte",
    o: ["Norte", "Sudeste", "Sul", "Centro-Oeste"],
    porque: "A região Norte é a maior em área, e é onde fica a maior parte da Amazônia." },
  { tema: "mapa", n: 4, e: "👨‍👩‍👧", q: "Qual região tem mais gente morando?", a: "Sudeste",
    o: ["Sudeste", "Norte", "Centro-Oeste", "Sul"],
    porque: "O Sudeste é a região mais populosa, com São Paulo, Rio de Janeiro, Minas e Espírito Santo." },

  /* ---------- os biomas ---------- */
  { tema: "biomas", n: 2, e: "🌳", q: "Qual é a maior floresta do Brasil?", a: "Amazônia",
    o: ["Amazônia", "Cerrado", "Caatinga", "Pantanal"],
    porque: "A Amazônia é a maior floresta tropical do mundo, e a maior parte dela fica no Brasil." },
  { tema: "biomas", n: 3, e: "🌵", q: "Que bioma é seco, com plantas espinhosas, e fica no Nordeste?", a: "Caatinga",
    o: ["Caatinga", "Pantanal", "Amazônia", "Pampa"],
    porque: "A Caatinga é o único bioma que só existe no Brasil. Suas plantas guardam água no caule." },
  { tema: "biomas", n: 3, e: "🐊", q: "Qual é a maior planície alagada do mundo, no Centro-Oeste?", a: "Pantanal",
    o: ["Pantanal", "Cerrado", "Caatinga", "Mata Atlântica"],
    porque: "O Pantanal alaga na época da chuva e é onde vive a maior variedade de bichos do país." },
  { tema: "biomas", n: 4, e: "🌾", q: "Que bioma tem árvores baixas e tortas, e é chamado de savana brasileira?", a: "Cerrado",
    o: ["Cerrado", "Pampa", "Amazônia", "Caatinga"],
    porque: "O Cerrado fica no meio do país e é onde nascem muitos dos grandes rios brasileiros." },
  { tema: "biomas", n: 4, e: "🌿", q: "Que floresta acompanha o litoral e quase desapareceu?", a: "Mata Atlântica",
    o: ["Mata Atlântica", "Amazônia", "Cerrado", "Pampa"],
    porque: "A Mata Atlântica cobria todo o litoral e hoje resta uma parte pequena dela." },
  { tema: "biomas", n: 4, e: "🐎", q: "Que bioma de campos abertos fica no extremo Sul?", a: "Pampa",
    o: ["Pampa", "Caatinga", "Cerrado", "Pantanal"],
    porque: "O Pampa é de campo aberto, no Rio Grande do Sul, e é onde se cria gado a cavalo." },

  /* ---------- gente e costume ---------- */
  { tema: "geral", n: 1, e: "⚽", q: "Quantas Copas do Mundo o Brasil já ganhou?", a: "5",
    o: ["5", "3", "7", "2"],
    porque: "O Brasil é o único país com cinco títulos: 1958, 1962, 1970, 1994 e 2002." },
  { tema: "geral", n: 2, e: "🎭", q: "Qual é a maior festa popular do Brasil?", a: "Carnaval",
    o: ["Carnaval", "Festa Junina", "Réveillon", "Folia de Reis"],
    porque: "O Carnaval acontece em todo o país, com formatos diferentes em cada região." },
  { tema: "geral", n: 2, e: "🌽", q: "Que festa acontece em junho, com quadrilha e fogueira?", a: "Festa Junina",
    o: ["Festa Junina", "Carnaval", "Natal", "Páscoa"],
    porque: "A Festa Junina é forte no Nordeste, com milho, quadrilha e fogueira." },
  { tema: "geral", n: 3, e: "🥁", q: "De qual estado é o frevo e o maracatu?", a: "Pernambuco",
    o: ["Pernambuco", "São Paulo", "Amazonas", "Paraná"],
    porque: "O frevo e o maracatu são de Pernambuco, e o frevo é dançado com sombrinha." },
  { tema: "geral", n: 3, e: "🧉", q: "Em que região se toma chimarrão?", a: "Sul",
    o: ["Sul", "Norte", "Nordeste", "Sudeste"],
    porque: "O chimarrão é do Sul, principalmente do Rio Grande do Sul." },
  { tema: "geral", n: 4, e: "🍲", q: "De onde vem o acarajé?", a: "Bahia",
    o: ["Bahia", "Minas Gerais", "Santa Catarina", "Goiás"],
    porque: "O acarajé é baiano, feito de feijão-fradinho frito no azeite de dendê." },
];

/* Que degraus entram em cada faixa, como no resto do app. */
export const NIVEIS_DO_BRASIL = {
  easy:   [1],
  medium: [1, 2],
  hard:   [2, 3],
  genius: [2, 3, 4],
  mestre: [3, 4],
  lenda:  [3, 4],
};

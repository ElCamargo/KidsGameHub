/**
 * KidsGameHub — o catálogo, a escada e a economia
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import { BANDEIRAS_PNG } from "../data/bandeiras-png.js";
import { LANG_CATALOG, PACKS, T } from "../data/textos.js";



/* ---------- i18n ---------- */
/* Assinatura da criadora, exibida na abertura e na área dos pais. */
export const MADE_BY = "ElCamargo Soluções em TI LTDA";


/* Idiomas embutidos no app; os demais vêm por download (ver LANG_CATALOG). */


/* ---------- Pacotes de idioma baixáveis ----------
   Só a INTERFACE precisa de tradução (~70 frases). Os nomes dos países
   vêm de Intl.DisplayNames, que já fala ~100 idiomas de fábrica.
   Todos os 6 idiomas viajam embutidos no app: nada é baixado de servidor
   nenhum, nem de CDN próprio — a promessa de zero requisição a terceiros
   vale também para o texto. */


/* Carrega um idioma. Ordem: já carregado → cache do aparelho → pacote
   embutido. Nunca deixa o app sem texto e nunca sai para a rede. */
export async function loadLang(code) {
  if (T[code]) return true;
  try {
    const c = await window.storage.get(`lumus:lang:${code}`);
    if (c?.value) { T[code] = JSON.parse(c.value); return true; }
  } catch { }
  if (PACKS[code]) {
    T[code] = PACKS[code];
    try { window.storage.set(`lumus:lang:${code}`, JSON.stringify(PACKS[code])); } catch { }
    return true;
  }
  return false;
}


/* Já está rodando como app instalado? Então não há o que convidar. */
export function jaInstalado() {
  try {
    return window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;
  } catch { return false; }
}

export function ehIOS() {
  try { return /iphone|ipad|ipod/i.test(navigator.userAgent); } catch { return false; }
}


/* Idioma do aparelho, se o app já falar */
export function deviceLang() {
  try {
    const l = (navigator.language || "en").slice(0, 2).toLowerCase();
    return LANG_CATALOG[l] ? l : "en";
  } catch { return "en"; }
}



/* Catálogo do hub: categorias e seus jogos.
   O campo leitura marca o jogo que só faz sentido para quem já lê — a
   pergunta é uma frase, ou a resposta é uma palavra escrita. Os de
   leitura: false uma criança de 3 anos joga olhando: memória, pintura e
   as contas, onde o conteúdo são números e figuras.

   É esse campo que decide o que nasce aberto para cada jogador. */
export const CATALOG = [
  { id: "letras", icon: "📚", color: "#FF7043", games: [
      { id: "montar", icon: "🔡", color: "#4C6FFF", preco: 0, leitura: false, ready: true },
      { id: "aliteracao", icon: "👂", color: "#00C2CB", preco: 120, leitura: true, vozBasta: true, ready: true },
      { id: "inicial", icon: "🅰️", color: "#00B894", preco: 150, leitura: false, vozBasta: true, ready: true },
      { id: "rimas", icon: "🎵", color: "#9B59B6", preco: 250, leitura: true, vozBasta: true, ready: true },
      { id: "silabas", icon: "🆎", color: "#FF7043", preco: 350, leitura: false, vozBasta: true, ready: true },
      { id: "ditado", icon: "✍️", color: "#6A5AE0", preco: 450, leitura: false, vozBasta: true, ready: true },
      { id: "leitura", icon: "📖", color: "#8D6E3A", preco: 500, leitura: true, vozBasta: true, ready: true },
      { id: "ortografia", icon: "📝", color: "#E84393", preco: 550, leitura: true, vozBasta: true, ready: true },
  ]},
  { id: "geo", icon: "🌍", color: "#4C6FFF", games: [
      { id: "flags", icon: "🚩", color: "#00B894", preco: 0, leitura: true, ready: true },
      { id: "memory", icon: "🧠", color: "#4C6FFF", preco: 150, leitura: false, ready: true },
      { id: "puzzle", icon: "🧩", color: "#F9A826", preco: 200, leitura: false, ready: true },
      { id: "capitals", icon: "🏛️", color: "#6A5AE0", preco: 500, leitura: true, ready: true },
      { id: "curiosidades", icon: "🗺️", color: "#00C2CB", preco: 800, leitura: true, ready: true },
  ]},
  { id: "math", icon: "🔢", color: "#F9A826", games: [
      { id: "count", icon: "🧮", color: "#F9A826", preco: 0, leitura: false, ready: true },
      { id: "mathPuzzle", icon: "🔟", color: "#00B894", preco: 150, leitura: false, ready: true },
      { id: "tabuada", icon: "✖️", color: "#E84393", preco: 200, leitura: false, ready: true },
      { id: "horas", icon: "🕐", color: "#6A5AE0", preco: 300, leitura: false, ready: true },
      { id: "dinheiro", icon: "💰", color: "#00B894", preco: 400, leitura: false, ready: true },
  ]},
  { id: "nature", icon: "🦁", color: "#00C2CB", games: [
      { id: "animals", icon: "🐾", color: "#00C2CB", preco: 0, leitura: false, ready: true },
      { id: "animalPuzzle", icon: "🦓", color: "#F9A826", preco: 200, leitura: false, ready: true },
      { id: "animalQuiz", icon: "🦉", color: "#00B894", preco: 300, leitura: true, vozBasta: true, ready: true },
      { id: "sciAnimals", icon: "🔬", color: "#6A5AE0", preco: 600, leitura: true, ready: true },
  ]},
  { id: "art", icon: "🎨", color: "#E84393", games: [
      { id: "color", icon: "🖍️", color: "#E84393", preco: 0, leitura: false, ready: true },
      { id: "colors", icon: "🌈", color: "#F9A826", preco: 200, leitura: true, vozBasta: true, ready: true },
      { id: "artPuzzle", icon: "🖼️", color: "#00C2CB", preco: 350, leitura: false, ready: true },
      { id: "artMem", icon: "🧩", color: "#9B59B6", preco: 500, leitura: false, ready: true },
  ]},
  { id: "eng", icon: "🔤", color: "#4C6FFF", games: [
      { id: "words", icon: "🔤", color: "#4C6FFF", preco: 0, leitura: true, ready: true },
      { id: "wordPuzzle", icon: "🔠", color: "#00C2CB", preco: 250, leitura: true, ready: true },
      { id: "wordMem", icon: "🃏", color: "#6A5AE0", preco: 350, leitura: true, ready: true },
  ]},
  { id: "faith", icon: "✝️", color: "#8D6E3A", games: [
      { id: "bible", icon: "✝️", color: "#8D6E3A", preco: 0, leitura: true, ready: true },
      { id: "biblePuzzle", icon: "🕯️", color: "#F9A826", preco: 250, leitura: false, ready: true },
      { id: "bibleMem", icon: "🕊️", color: "#00C2CB", preco: 350, leitura: false, ready: true },
  ]},
];


const TODOS_JOGOS = CATALOG.flatMap(c => c.games);

/* Um jogo que nasce grátis para uns e trancado para outros ainda precisa de
   preço quando aparece trancado. */
const PRECO_PADRAO = 150;

export const precoDe = g => g.preco || PRECO_PADRAO;

export const jogoDe = id => TODOS_JOGOS.find(g => g.id === id);


/* O que já nasce aberto depende de quem está jogando: quem lê começa pelos
   jogos grátis de sempre; quem ainda não lê começa pelos que se joga
   olhando. Os outros continuam ali, à vista, para abrir com lumicoins —
   ninguém fica sem ver o que ainda vai poder jogar. */
export const jogosGratisPara = leitor =>
  TODOS_JOGOS.filter(g => leitor ? !g.preco : !g.leitura).map(g => g.id);


/* Jogos em que a pergunta é texto mas as ALTERNATIVAS são figuras. Quem não
   lê não conseguia jogar; com a voz lendo a pergunta, consegue — e é a
   diferença entre dois jogos e quatro para uma criança de quatro anos.

   Os de alternativa escrita (bandeiras, capitais, ciências, curiosidades)
   continuam de fora: ouvir quatro frases e lembrar em qual tocar é outra
   dificuldade, e não é a que a voz resolve. */
export const JOGOS_POR_VOZ = TODOS_JOGOS.filter(g => g.vozBasta).map(g => g.id);


/* Se a pergunta da leitura ficou sem resposta, a idade responde por ela. */
export const ehLeitor = perfil =>
  perfil?.leitor != null ? perfil.leitor : (perfil?.idade ?? 6) >= 5;

export const JOGOS_GRATIS = jogosGratisPara(true);



/* Dentro de cada área os jogos abrem em ordem: o primeiro é livre e cada
   seguinte custa mais que o anterior. As áreas em si nunca ficam trancadas,
   então sempre há algo novo para fazer em outro canto do hub. */
export const PRECO_GERAR = 100;   // 9 desenhos novos no jogo de pintar


/* Dentro de cada jogo a progressão também se compra, como os continentes
   das bandeiras: o primeiro trecho é livre e os seguintes vão custando mais. */
/* Cada trilha compra os próprios níveis: abrir o Gênio da Europa não abre o
   da Ásia. Os preços saem do que a própria trilha rende — zerar o nível
   anterior com 100% quase paga o seguinte, e a folga vai diminuindo:
     Fácil   5 fases × 55 líquidos = 275  →  Médio  custa 200 (sobra)
     Médio   4 fases × 55          = 220  →  Difícil custa 250 (falta pouco)
     Difícil 3 fases × 55          = 165  →  Gênio  custa 300 (exige repetir)   */
export const BAND_PRECO = { easy: 0, medium: 200, hard: 250, genius: 300, mestre: 400, lenda: 500 };

export const MEM_PRECO  = { easy: 0, medium: 100, hard: 150, genius: 200, mestre: 400, lenda: 700 };   // ~3 a 5 rodadas boas cada

export const PZL_PRECO  = { easy: 0, medium: 100, hard: 150, genius: 250, mestre: 400, lenda: 600 };   // sobe com o número de peças

export const PAL_PRECO  = { easy: 0, medium: 80, hard: 120, genius: 200, mestre: 300, lenda: 450 };    // mais barato: é o chão do resto
export const DIT_PRECO  = { easy: 0, medium: 100, hard: 150, genius: 250, mestre: 350, lenda: 500 };   // vem depois do montar, custa um pouco mais

/* Um motor, seis entradas — como a memória. O que muda é só de onde vem a
   imagem: arquivo de bandeira, desenho pintado, ou cartaz de figuras. */
export const PZL_TEMAS = { puzzle: "flags", artPuzzle: "art", animalPuzzle: "animals", biblePuzzle: "bible", wordPuzzle: "words", mathPuzzle: "math" };

export const PZL_ICONE = { flags: "🧩", art: "🖼️", animals: "🦓", bible: "🕯️", words: "🔠", math: "🔟" };

export const PZL_JOGO = { flags: "puzzle", art: "artPuzzle", animals: "animalPuzzle", bible: "biblePuzzle", words: "wordPuzzle", math: "mathPuzzle" };

export const CAP_PRECO  = {                                                    // regiões das capitais
  cap_br: 0, cap_sa: 100, cap_na: 150, cap_eu: 250,
  cap_af: 350, cap_as: 450, cap_oc: 550, cap_us: 700,
};


/* Países-ilha, para a conquista "Caçador de ilhas" */
export const ISLANDS = new Set(["CU","JM","HT","DO","BS","TT","AG","BB","DM","GD","KN","LC","VC","PR",
  "IE","IS","MT","CY","GB","MG","CV","MU","SC","KM","ST","JP","ID","PH","LK","MV","BN","TL","BH","SG",
  "AU","NZ","FJ","PG","WS","TO","VU","SB","KI","TV","NR","MH","FM","PW"]);


/* Ordem de desbloqueio + meio de transporte para chegar lá */
export const ROUTE = [
  { id: "sa", cost: 0, emoji: "🚗", color: "#00B894" },
  { id: "na", cost: 150, emoji: "🚗", color: "#FF7043" },
  { id: "eu", cost: 300, emoji: "✈️", color: "#4C6FFF" },
  { id: "af", cost: 450, emoji: "🚢", color: "#F9A826" },
  { id: "as", cost: 600, emoji: "✈️", color: "#E84393" },
  { id: "oc", cost: 800, emoji: "🚢", color: "#00C2CB" },
];


/* ---------- Escada de fases ----------
   Toda trilha sobe pelas mesmas quatro faixas, na mesma proporção: um terço
   Fácil, um quarto Médio, um quinto Difícil, o resto Gênio. O que muda de um
   jogo para outro é só o NÚMERO de degraus: as bandeiras de um continente têm
   banco pequeno e param em 15, a Bíblia tem milhares de perguntas e vai a 100.
   Assim a sensação é a mesma em todo o app — muda o tamanho da escada, não o
   jeito de subir. */
/* Seis faixas, as mesmas em todo jogo: quiz, memória, tudo. Mestre e Lenda
   são o topo — sorteiam só do pool mais difícil de cada banco, o relógio
   aperta mais e a rodada tem mais perguntas. */
export const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];


/* Quantas perguntas por rodada. Rodada curta para os pequenos, longa para
   quem já chegou no topo — é parte do que faz o Lenda ser Lenda. */
export const PERGUNTAS_RODADA = { easy: 5, medium: 5, hard: 10, genius: 10, mestre: 12, lenda: 15 };

export const qtdPerguntas = band => PERGUNTAS_RODADA[band] || 10;


/* O relógio só entra no Médio e vai apertando dentro de cada faixa.

   Esses números são o dobro dos primeiros que escrevi. O jogo é para criança
   de 5 e 6 anos: ela ainda soletra, e um cronômetro de 4 segundos não mede o
   que ela sabe, mede se ela consegue ler a tempo. A pressa continua existindo
   — o Gênio ainda é bem mais apertado que o Médio —, só que agora sobra tempo
   para pensar entre ler e responder. */
export const FAIXA_TEMPO = { medium: [25, 18], hard: [16, 13], genius: [12, 10], mestre: [10, 8], lenda: [8, 6] };


function montarEscada(total) {
  const nE = Math.round(total * 0.24);
  const nM = Math.round(total * 0.20);
  const nH = Math.round(total * 0.17);
  const nG = Math.round(total * 0.15);
  const nX = Math.round(total * 0.13);
  const porFaixa = { easy: nE, medium: nM, hard: nH, genius: nG, mestre: nX,
    lenda: total - nE - nM - nH - nG - nX };
  const plan = DIFFS.flatMap(d => Array(porFaixa[d]).fill(d));
  const times = [];
  let i = 0;
  for (const d of DIFFS) {
    const k = porFaixa[d];
    for (let j = 0; j < k; j++, i++) {
      if (d === "easy") { times.push(null); continue; }
      const [ini, fim] = FAIXA_TEMPO[d];
      times.push(k > 1 ? Math.round(ini - (ini - fim) * (j / (k - 1))) : ini);
    }
  }
  return { total, plan, times };
}


/* Sessenta degraus é o padrão de toda trilha. A Bíblia vai a cem porque o
   banco dela aguenta: são mais de duas mil perguntas por idioma. O tabuleiro
   é paginado de 20 em 20, então escada longa não vira tela longa. */
const ESCADA_PADRAO = montarEscada(60);

const ESCADAS = {
  bible: montarEscada(100),
};

export const escadaDe = cont => ESCADAS[cont] || ESCADA_PADRAO;

export const totalDe = cont => escadaDe(cont).total;

export const bandFor = (cont, stage) => escadaDe(cont).plan[Math.min(stage, totalDe(cont)) - 1];

export const tempoDe = (cont, stage) => escadaDe(cont).times[Math.min(stage, totalDe(cont)) - 1];

export const BAND_COLOR = { easy: "#00B894", medium: "#4C6FFF", hard: "#F9A826", genius: "#E84393", mestre: "#6A5AE0", lenda: "#D4A017" };


/* ---------- Economia ---------- */
export const ECON = {
  start: 50,                       // com o que se começa
  refillAmount: 100,               // liberadas a cada 3h, mas só entram se resgatar
  refillMs: 3 * 60 * 60 * 1000,
  cap: Infinity,                   // sem teto: o contador só anda quando se resgata
  hint1: 8, hint2: 20, hint3: 80,
  reward: { 1: 25, 2: 45, 3: 65 },  // por estrela, +5 extra se não usar dica
  memReward: { 1: 10, 2: 25, 3: 50 },
  /* Cada erro consertado na revisão paga pouco, e não pode ser fábrica de
     moeda: a pergunta sai da fila quando é aprendida. */
  revisaoReward: 4,
  /* O responsável ganha 100 lumicoins por semana para dar de presente a
     quem quiser. Não é para ele gastar: é o motivo de ele abrir o app,
     olhar como os filhos estão indo e escolher quem premiar. O dinheiro
     que ele mesmo usa jogando é o dele, ganho como o de todo mundo. */
  presenteSemanal: 100,
  /* O primeiro registro do dia paga; o segundo não. Escrever tem que valer a
     pena, mas não pode virar uma torneira de moedas — senão a criança escreve
     dez linhas vazias e o caderno morre no mesmo dia em que nasceu. */
  cadernoReward: 15,
  /* Jogar junto é de graça, e paga todo mundo — ganhando ou perdendo. O que
     queremos que aconteça de novo amanhã é o irmão chamar o irmão, e os dois
     chamarem a mãe; não um vencer o outro. Uma vez por dia, senão vira
     fábrica de lumicoins. */
  duplaReward: 20,
  colorReward: 10,                 // por desenho terminado
  colorDailyCap: 200,              // 20 desenhos premiados por dia (20 × 10)
};


/* ---------- Loja de avatar ---------- */
export const SHOP_CATS = ["hairStyle", "cap", "glasses", "shirt", "shirtPattern"];


/* Raridades: poucos itens baratos para dar gosto logo no começo,
   e uma escada longa até os lendários, que exigem muito jogo. */
export const RARITY = {
  comum:     { cor: "#8B93AD", label: "•" },
  raro:      { cor: "#4C6FFF", label: "◆" },
  epico:     { cor: "#9B59B6", label: "★" },
  lendario:  { cor: "#F9A826", label: "👑" },
};


export const SHOP_ITEMS = [
  // ---- de graça: ninguém precisa juntar moeda para se parecer consigo ----
  { id: "h_bob", type: "hairStyle", val: "bob", price: 0, r: "comum" },
  { id: "h_wavy", type: "hairStyle", val: "wavy", price: 0, r: "comum" },
  // ---- comuns (30–90) ----
  { id: "h_buzz", type: "hairStyle", val: "buzz", price: 30, r: "comum" },
  { id: "c_red", type: "cap", val: "cap|#E74C3C", price: 40, r: "comum" },
  { id: "c_blue", type: "cap", val: "cap|#3498DB", price: 40, r: "comum" },
  { id: "h_curly", type: "hairStyle", val: "curly", price: 60, r: "comum" },
  { id: "s_purple", type: "shirt", val: "#9B59B6", price: 60, r: "comum" },
  { id: "g_round", type: "glasses", val: "round", price: 80, r: "comum" },
  { id: "p_stripe", type: "shirtPattern", val: "stripe", price: 90, r: "comum" },
  // ---- raros (250–700) ----
  { id: "h_pony", type: "hairStyle", val: "ponytail", price: 250, r: "raro" },
  { id: "c_green", type: "cap", val: "cap|#00B894", price: 300, r: "raro" },
  { id: "s_navy", type: "shirt", val: "#2C3E50", price: 350, r: "raro" },
  { id: "s_lime", type: "shirt", val: "#7BC950", price: 350, r: "raro" },
  { id: "g_nerd", type: "glasses", val: "nerd", price: 450, r: "raro" },
  { id: "p_dots", type: "shirtPattern", val: "dots", price: 500, r: "raro" },
  { id: "c_bow", type: "cap", val: "bow|#FF69B4", price: 700, r: "raro" },
  // ---- épicos (1200–2500) ----
  { id: "h_afro", type: "hairStyle", val: "afro", price: 1200, r: "epico" },
  { id: "c_beanie", type: "cap", val: "beanie|#9B59B6", price: 1400, r: "epico" },
  { id: "c_beanie2", type: "cap", val: "beanie|#E84393", price: 1400, r: "epico" },
  { id: "g_sun", type: "glasses", val: "sun", price: 1800, r: "epico" },
  { id: "p_star", type: "shirtPattern", val: "star", price: 2200, r: "epico" },
  { id: "c_explorer", type: "cap", val: "explorer", price: 2500, r: "epico" },
  // ---- lendários (4500–9000) ----
  { id: "g_heart", type: "glasses", val: "heart", price: 4500, r: "lendario" },
  { id: "p_heart", type: "shirtPattern", val: "heart", price: 5500, r: "lendario" },
  { id: "p_rainbow", type: "shirtPattern", val: "rainbow", price: 7000, r: "lendario" },
  { id: "c_crown", type: "cap", val: "crown", price: 9000, r: "lendario" },
];



/* ---------- Conquistas ----------
   Cada conquista tem categoria e nível. A categoria organiza a tela — são
   mais de 50 e sem agrupamento viram uma lista que ninguém lê. O nível vale
   moedas: quanto mais longe a criança precisa ir, maior o prêmio quando
   acende. As moedas entram uma única vez, na primeira vez. */
const PREMIO_CONQUISTA = { 1: 30, 2: 60, 3: 120, 4: 250 };


export const CONQ_CATS = [
  { id: "geral",  icon: "🎯", pt: "Geral",      en: "General",    es: "General" },
  { id: "geo",    icon: "🌍", pt: "Geografia",  en: "Geography",  es: "Geografía" },
  { id: "cap",    icon: "🏛️", pt: "Capitais",   en: "Capitals",   es: "Capitales" },
  { id: "nature", icon: "🦁", pt: "Natureza",   en: "Nature",     es: "Naturaleza" },
  { id: "math",   icon: "🔢", pt: "Matemática", en: "Math",       es: "Matemáticas" },
  { id: "art",    icon: "🎨", pt: "Arte",       en: "Art",        es: "Arte" },
  { id: "lang",   icon: "🔤", pt: "Idiomas",    en: "Languages",  es: "Idiomas" },
  { id: "bible",  icon: "✝️", pt: "Bíblia",     en: "Bible",      es: "Biblia" },
  { id: "mem",    icon: "🧠", pt: "Memória",    en: "Memory",     es: "Memoria" },
  { id: "pzl",    icon: "🧩", pt: "Quebra-cabeça", en: "Puzzle",  es: "Rompecabezas" },
  { id: "habit",  icon: "📅", pt: "Dedicação",  en: "Dedication", es: "Constancia" },
];


export const ACHIEVEMENTS = [
  /* --- geral --- */
  { id: "first", cat: "geral", n: 1, icon: "🎬", pt: "Primeira rodada", en: "First round", es: "Primera ronda", test: s => s.rounds >= 1 },
  { id: "perfect1", cat: "geral", n: 1, icon: "💯", pt: "Um 100%", en: "One perfect round", es: "Una ronda perfecta", test: s => s.perfect >= 1 },
  { id: "perfect5", cat: "geral", n: 2, icon: "🏆", pt: "Cinco 100%", en: "Five perfect rounds", es: "Cinco rondas perfectas", test: s => s.perfect >= 5 },
  { id: "perfect20", cat: "geral", n: 3, icon: "👑", pt: "Vinte 100%", en: "Twenty perfect rounds", es: "Veinte perfectas", test: s => s.perfect >= 20 },
  { id: "streak5", cat: "geral", n: 1, icon: "🔥", pt: "5 acertos seguidos", en: "5 in a row", es: "5 seguidas", test: s => s.bestStreak >= 5 },
  { id: "streak20", cat: "geral", n: 3, icon: "⚡", pt: "20 acertos seguidos", en: "20 in a row", es: "20 seguidas", test: s => s.bestStreak >= 20 },
  { id: "coins500", cat: "geral", n: 2, icon: "🪙", pt: "500 lumicoins ganhas", en: "500 lumicoins earned", es: "500 lumicoins", test: s => s.earned >= 500 },
  { id: "rich", cat: "geral", n: 3, icon: "💰", pt: "2000 lumicoins no cofre", en: "2000 lumicoins saved", es: "2000 lumicoins ahorradas", test: s => s.maxCoins >= 2000 },
  { id: "nohint", cat: "geral", n: 2, icon: "🧠", pt: "10 rodadas sem dica", en: "10 rounds, no hints", es: "10 rondas sin pistas", test: s => s.noHintRounds >= 10 },
  { id: "genius", cat: "geral", n: 2, icon: "🎓", pt: "Fase Gênio vencida", en: "Genius stage cleared", es: "Nivel Genio superado", test: s => s.geniusCleared >= 1 },
  { id: "flash20", cat: "geral", n: 1, icon: "💨", pt: "20 respostas relâmpago", en: "20 lightning answers", es: "20 respuestas relámpago", test: s => s.flash >= 20 },
  { id: "flash100", cat: "geral", n: 3, icon: "🚀", pt: "100 respostas relâmpago", en: "100 lightning answers", es: "100 respuestas relámpago", test: s => s.flash >= 100 },
  { id: "cleanperfect", cat: "geral", n: 2, icon: "✨", pt: "100% sem usar dica", en: "Perfect with no hints", es: "Perfecta sin pistas", test: s => s.perfectNoHint >= 1 },
  { id: "speedking", cat: "geral", n: 3, icon: "⏱️", pt: "100% na última fase", en: "Perfect on the last stage", es: "Perfecta en el último nivel", test: s => s.lastStagePerfect >= 1 },
  { id: "stars45", cat: "geral", n: 3, icon: "🌠", pt: "45 estrelas", en: "45 stars", es: "45 estrellas", test: s => s.stars >= 45 },
  { id: "stars200", cat: "geral", n: 4, icon: "💫", pt: "200 estrelas", en: "200 stars", es: "200 estrellas", test: s => s.stars >= 200 },
  { id: "marathon", cat: "geral", n: 3, icon: "🏃", pt: "50 rodadas jogadas", en: "50 rounds played", es: "50 rondas jugadas", test: s => s.rounds >= 50 },
  { id: "marathon300", cat: "geral", n: 4, icon: "🏅", pt: "300 rodadas jogadas", en: "300 rounds played", es: "300 rondas jugadas", test: s => s.rounds >= 300 },

  /* --- geografia --- */
  { id: "trav2", cat: "geo", n: 1, icon: "🗺️", pt: "2 continentes", en: "2 continents", es: "2 continentes", test: s => s.continents >= 2 },
  { id: "trav6", cat: "geo", n: 3, icon: "🌍", pt: "Mapa-múndi completo", en: "Whole world map", es: "Mapamundi completo", test: s => s.continents >= 6 },
  { id: "flags100", cat: "geo", n: 1, icon: "🎯", pt: "100 bandeiras certas", en: "100 flags right", es: "100 banderas", test: s => s.correct >= 100 },
  { id: "flags500", cat: "geo", n: 3, icon: "🎖️", pt: "500 bandeiras certas", en: "500 flags right", es: "500 banderas", test: s => s.correct >= 500 },
  { id: "islands", cat: "geo", n: 2, icon: "🏝️", pt: "25 bandeiras de ilhas", en: "25 island flags", es: "25 banderas de islas", test: s => s.islandRight >= 25 },
  { id: "regions", cat: "geo", n: 2, icon: "🏴", pt: "20 estados e regiões", en: "20 states and regions", es: "20 estados y regiones", test: s => s.subRight >= 20 },
  { id: "cont1done", cat: "geo", n: 2, icon: "🥇", pt: "Um continente inteiro", en: "A whole continent", es: "Un continente entero", test: s => s.contDone >= 1 },
  { id: "cont3done", cat: "geo", n: 4, icon: "🌟", pt: "Três continentes inteiros", en: "Three whole continents", es: "Tres continentes enteros", test: s => s.contDone >= 3 },
  { id: "cur1", cat: "geo", n: 1, icon: "🧭", pt: "Primeira curiosidade", en: "First fun fact", es: "Primera curiosidad", test: s => (s.curRight || 0) >= 1 },
  { id: "cur100", cat: "geo", n: 2, icon: "🗽", pt: "100 curiosidades certas", en: "100 fun facts right", es: "100 curiosidades correctas", test: s => (s.curRight || 0) >= 100 },
  { id: "cur500", cat: "geo", n: 3, icon: "🗿", pt: "500 curiosidades certas", en: "500 fun facts right", es: "500 curiosidades correctas", test: s => (s.curRight || 0) >= 500 },
  { id: "curEnd", cat: "geo", n: 4, icon: "🌐", pt: "Curiosidades até o fim", en: "Fun facts to the end", es: "Curiosidades hasta el final", test: s => (s.curStage || 0) >= 60 },

  /* --- capitais --- */
  { id: "cap1", cat: "cap", n: 1, icon: "🏛️", pt: "Primeira capital certa", en: "First capital right", es: "Primera capital correcta", test: s => (s.capRight || 0) >= 1 },
  { id: "capBR", cat: "cap", n: 2, icon: "🇧🇷", pt: "Brasil: 10 fases de capitais", en: "Brazil: 10 capital stages", es: "Brasil: 10 niveles", test: s => (s.capBrDone || 0) >= 10 },
  { id: "cap200", cat: "cap", n: 3, icon: "🗼", pt: "200 capitais certas", en: "200 capitals right", es: "200 capitales correctas", test: s => (s.capRight || 0) >= 200 },
  { id: "cap800", cat: "cap", n: 4, icon: "🌆", pt: "800 capitais certas", en: "800 capitals right", es: "800 capitales correctas", test: s => (s.capRight || 0) >= 800 },

  /* --- natureza --- */
  { id: "bicho1", cat: "nature", n: 1, icon: "🦉", pt: "Primeiro acerto nos animais", en: "First animal right", es: "Primer animal correcto", test: s => (s.bichoRight || 0) >= 1 },
  { id: "bicho100", cat: "nature", n: 2, icon: "🦜", pt: "100 animais certos", en: "100 animals right", es: "100 animales correctos", test: s => (s.bichoRight || 0) >= 100 },
  { id: "sci1", cat: "nature", n: 1, icon: "🔬", pt: "Primeira ciência certa", en: "First science answer", es: "Primera respuesta de ciencias", test: s => (s.sciRight || 0) >= 1 },
  { id: "sci100", cat: "nature", n: 2, icon: "🐘", pt: "100 respostas de ciências", en: "100 science answers", es: "100 respuestas de ciencias", test: s => (s.sciRight || 0) >= 100 },
  { id: "sci500", cat: "nature", n: 3, icon: "🐋", pt: "500 respostas de ciências", en: "500 science answers", es: "500 respuestas de ciencias", test: s => (s.sciRight || 0) >= 500 },
  { id: "sciEnd", cat: "nature", n: 4, icon: "🧬", pt: "Ciências até o fim", en: "Science to the end", es: "Ciencias hasta el final", test: s => (s.sciStage || 0) >= 60 },

  /* --- matemática --- */
  { id: "math1", cat: "math", n: 1, icon: "🧮", pt: "Primeira conta certa", en: "First sum right", es: "Primera cuenta correcta", test: s => (s.mathRight || 0) >= 1 },
  { id: "math100", cat: "math", n: 2, icon: "➕", pt: "100 contas certas", en: "100 sums right", es: "100 cuentas correctas", test: s => (s.mathRight || 0) >= 100 },
  { id: "math500", cat: "math", n: 3, icon: "✖️", pt: "500 contas certas", en: "500 sums right", es: "500 cuentas correctas", test: s => (s.mathRight || 0) >= 500 },
  { id: "mathGenius", cat: "math", n: 3, icon: "🎓", pt: "Fase 40 de matemática", en: "Math stage 40", es: "Nivel 40 de matemáticas", test: s => (s.mathStage || 0) >= 40 },

  /* --- arte --- */
  { id: "art1", cat: "art", n: 1, icon: "🖍️", pt: "Primeiro desenho pintado", en: "First drawing painted", es: "Primer dibujo pintado", test: s => (s.colorDone || 0) >= 1 },
  { id: "art10", cat: "art", n: 2, icon: "🎨", pt: "10 desenhos pintados", en: "10 drawings painted", es: "10 dibujos pintados", test: s => (s.colorDone || 0) >= 10 },
  { id: "art50", cat: "art", n: 3, icon: "🖼️", pt: "50 desenhos pintados", en: "50 drawings painted", es: "50 dibujos pintados", test: s => (s.colorDone || 0) >= 50 },

  /* --- idiomas --- */
  { id: "eng1", cat: "lang", n: 1, icon: "🔤", pt: "Primeira palavra nova", en: "First new word", es: "Primera palabra nueva", test: s => (s.engRight || 0) >= 1 },
  { id: "eng100", cat: "lang", n: 2, icon: "📘", pt: "100 palavras novas", en: "100 new words", es: "100 palabras nuevas", test: s => (s.engRight || 0) >= 100 },
  { id: "eng500", cat: "lang", n: 3, icon: "📗", pt: "500 palavras novas", en: "500 new words", es: "500 palabras nuevas", test: s => (s.engRight || 0) >= 500 },

  /* --- bíblia --- */
  { id: "bib1", cat: "bible", n: 1, icon: "✝️", pt: "Primeira resposta da Bíblia", en: "First Bible answer", es: "Primera respuesta bíblica", test: s => (s.bibRight || 0) >= 1 },
  { id: "bib100", cat: "bible", n: 2, icon: "📖", pt: "100 respostas da Bíblia", en: "100 Bible answers", es: "100 respuestas bíblicas", test: s => (s.bibRight || 0) >= 100 },
  { id: "bib500", cat: "bible", n: 3, icon: "📜", pt: "500 respostas da Bíblia", en: "500 Bible answers", es: "500 respuestas bíblicas", test: s => (s.bibRight || 0) >= 500 },
  { id: "bib2000", cat: "bible", n: 4, icon: "🕊️", pt: "2000 respostas da Bíblia", en: "2000 Bible answers", es: "2000 respuestas bíblicas", test: s => (s.bibRight || 0) >= 2000 },
  { id: "bibStage25", cat: "bible", n: 2, icon: "🌿", pt: "Bíblia: fase 25", en: "Bible: stage 25", es: "Biblia: nivel 25", test: s => (s.bibStage || 0) >= 25 },
  { id: "bibStage60", cat: "bible", n: 3, icon: "🔥", pt: "Bíblia: fase 60", en: "Bible: stage 60", es: "Biblia: nivel 60", test: s => (s.bibStage || 0) >= 60 },
  { id: "bibStage100", cat: "bible", n: 4, icon: "👑", pt: "Bíblia: as 100 fases", en: "Bible: all 100 stages", es: "Biblia: los 100 niveles", test: s => (s.bibStage || 0) >= 100 },

  /* --- memória --- */
  { id: "mem1", cat: "mem", n: 1, icon: "🃏", pt: "Primeira memória", en: "First memory game", es: "Primera memoria", test: s => s.memRounds >= 1 },
  { id: "mem3s", cat: "mem", n: 2, icon: "🧩", pt: "3 estrelas na memória", en: "3 stars in memory", es: "3 estrellas en memoria", test: s => s.mem3 >= 1 },
  { id: "memPerf", cat: "mem", n: 3, icon: "🎴", pt: "Memória sem errar par", en: "Memory with no wasted move", es: "Memoria sin fallar", test: s => s.memPerfect >= 1 },

  /* --- quebra-cabeça --- */
  { id: "pzl1", cat: "pzl", n: 1, icon: "🧩", pt: "Primeiro quebra-cabeça", en: "First puzzle", es: "Primer rompecabezas", test: s => (s.pzlRounds || 0) >= 1 },
  { id: "pzl3s", cat: "pzl", n: 2, icon: "🏆", pt: "3 estrelas num quebra-cabeça", en: "3 stars in a puzzle", es: "3 estrellas en un rompecabezas", test: s => (s.pzl3 || 0) >= 1 },
  { id: "pzl20", cat: "pzl", n: 3, icon: "🖼️", pt: "20 quebra-cabeças", en: "20 puzzles", es: "20 rompecabezas", test: s => (s.pzlRounds || 0) >= 20 },

  /* --- dedicação --- */
  { id: "day3", cat: "habit", n: 1, icon: "📅", pt: "3 dias seguidos jogando", en: "3 days in a row", es: "3 días seguidos", test: s => s.dayStreak >= 3 },
  { id: "day7", cat: "habit", n: 2, icon: "🗓️", pt: "7 dias seguidos jogando", en: "7 days in a row", es: "7 días seguidos", test: s => s.dayStreak >= 7 },
  { id: "duo1", cat: "habit", n: 1, icon: "👥", pt: "Primeira partida em grupo", en: "First game together", es: "Primera partida en grupo", test: s => s.duplas >= 1 },
  { id: "duo10", cat: "habit", n: 2, icon: "🤜", pt: "10 partidas em grupo", en: "10 games together", es: "10 partidas en grupo", test: s => s.duplas >= 10 },
  { id: "duo50", cat: "habit", n: 3, icon: "🎏", pt: "50 partidas em grupo", en: "50 games together", es: "50 partidas en grupo", test: s => s.duplas >= 50 },
  { id: "note1", cat: "habit", n: 1, icon: "📔", pt: "Primeira página do caderno", en: "First notebook page", es: "Primera página del cuaderno", test: s => s.registros >= 1 },
  { id: "note10", cat: "habit", n: 2, icon: "✏️", pt: "10 registros no caderno", en: "10 notebook entries", es: "10 registros en el cuaderno", test: s => s.registros >= 10 },
  { id: "note30", cat: "habit", n: 3, icon: "📚", pt: "30 registros no caderno", en: "30 notebook entries", es: "30 registros en el cuaderno", test: s => s.registros >= 30 },
  { id: "note100", cat: "habit", n: 4, icon: "🖋️", pt: "100 registros no caderno", en: "100 notebook entries", es: "100 registros en el cuaderno", test: s => s.registros >= 100 },
  { id: "moment1", cat: "habit", n: 1, icon: "🕊️", pt: "Primeiro Momento em Família", en: "First Family Moment", es: "Primer Momento en Familia", test: s => s.momentos >= 1 },
  { id: "moment7", cat: "habit", n: 2, icon: "📖", pt: "7 Momentos em Família", en: "7 Family Moments", es: "7 Momentos en Familia", test: s => s.momentos >= 7 },
  { id: "moment30", cat: "habit", n: 3, icon: "💚", pt: "30 Momentos em Família", en: "30 Family Moments", es: "30 Momentos en Familia", test: s => s.momentos >= 30 },
  { id: "moment100", cat: "habit", n: 4, icon: "🏛️", pt: "100 Momentos em Família", en: "100 Family Moments", es: "100 Momentos en Familia", test: s => s.momentos >= 100 },
  { id: "day30", cat: "habit", n: 4, icon: "🏵️", pt: "30 dias seguidos jogando", en: "30 days in a row", es: "30 días seguidos", test: s => s.dayStreak >= 30 },
];


export const premioDe = a => PREMIO_CONQUISTA[a.n] || 0;

/* Bolinhas em vez de palavras: funciona em qualquer idioma e a criança
   entende a escada só de olhar. */
export const NIVEL_LABEL = { 1: "●", 2: "●●", 3: "●●●", 4: "●●●●" };



/* Insígnias: raras de propósito. São o que distingue quem jogou muito. */
export const BADGES = [
  { id: "b_explorer", icon: "🧭", cor: "#00B894", pt: "Explorador", en: "Explorer", es: "Explorador", fr: "Explorateur", de: "Entdecker", it: "Esploratore",
    dPt: "Abriu 3 continentes", test: s => s.continents >= 3 },
  { id: "b_navigator", icon: "⛵", cor: "#4C6FFF", pt: "Navegador", en: "Navigator", es: "Navegante", fr: "Navigateur", de: "Navigator", it: "Navigatore",
    dPt: "Abriu o mapa-múndi inteiro", test: s => s.continents >= 6 },
  { id: "b_scholar", icon: "📚", cor: "#6A5AE0", pt: "Estudioso", en: "Scholar", es: "Erudito", fr: "Érudit", de: "Gelehrter", it: "Studioso",
    dPt: "1000 bandeiras certas", test: s => s.correct >= 1000 },
  { id: "b_lightning", icon: "⚡", cor: "#F9A826", pt: "Relâmpago", en: "Lightning", es: "Relámpago", fr: "Éclair", de: "Blitz", it: "Fulmine",
    dPt: "250 respostas relâmpago", test: s => s.flash >= 250 },
  { id: "b_star", icon: "🌟", cor: "#E84393", pt: "Estrela", en: "Star", es: "Estrella", fr: "Étoile", de: "Stern", it: "Stella",
    dPt: "100 estrelas conquistadas", test: s => s.stars >= 100 },
  { id: "b_mind", icon: "🧠", cor: "#00C2CB", pt: "Mente Afiada", en: "Sharp Mind", es: "Mente Ágil", fr: "Esprit Vif", de: "Scharfer Geist", it: "Mente Acuta",
    dPt: "10 memórias com 3 estrelas", test: s => s.mem3 >= 10 },
  { id: "b_faithful", icon: "📅", cor: "#8D6E3A", pt: "Constante", en: "Steady", es: "Constante", fr: "Assidu", de: "Beständig", it: "Costante",
    dPt: "30 dias seguidos", test: s => s.dayStreak >= 30 },
  { id: "b_cartographer", icon: "🏛️", cor: "#6A5AE0", pt: "Cartógrafo", en: "Cartographer", es: "Cartógrafo", fr: "Cartographe", de: "Kartograf", it: "Cartografo",
    dPt: "500 capitais certas", test: s => (s.capRight || 0) >= 500 },
  { id: "b_polyglot", icon: "🔤", cor: "#4C6FFF", pt: "Poliglota", en: "Polyglot", es: "Políglota", fr: "Polyglotte", de: "Polyglott", it: "Poliglotta",
    dPt: "500 palavras em inglês", test: s => (s.engRight || 0) >= 500 },
  { id: "b_artist", icon: "🎨", cor: "#E84393", pt: "Artista", en: "Artist", es: "Artista", fr: "Artiste", de: "Künstler", it: "Artista",
    dPt: "100 desenhos pintados", test: s => (s.colorDone || 0) >= 100 },
  { id: "b_legend", icon: "👑", cor: "#D4A017", pt: "Lenda", en: "Legend", es: "Leyenda", fr: "Légende", de: "Legende", it: "Leggenda",
    dPt: "300 rodadas e 50 perfeitas", test: s => s.rounds >= 300 && s.perfect >= 50 },
];


/* ---------- Helpers ---------- */
/* Bandeiras servidas pelo próprio app (public/flags), preparadas por
   scripts/prepare-flags.mjs. Nenhuma requisição sai para terceiros. */
const BASE = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";

/* Quase toda bandeira é SVG. As que têm brasão vieram em PNG para caber no
   aparelho — ver scripts/prepare-flags.mjs, que gera essa lista. */
export const flagUrl = c => {
  const k = String(c).toLowerCase();
  return `${BASE}flags/${k}.${BANDEIRAS_PNG.has(k) ? "png" : "svg"}`;
};


export function countryName(code, lang) {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code);
  } catch { return code; }
}

export const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; };

export const tempoFmt = seg => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`;

export const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${String(m).padStart(2, "0")}m`; };


/* ---------- Jogo da memória ----------
   Mesmas quatro dificuldades do jogo de bandeiras, mas aqui a estrela
   vem do relógio: saber não basta, tem que lembrar rápido. */
export const MEM_LEVELS = {
  easy:   { cols: 2, rows: 3, pares: 3,  estrelas: [300, 240, 150] },
  medium: { cols: 3, rows: 4, pares: 6,  estrelas: [300, 240, 150] },
  hard:   { cols: 4, rows: 4, pares: 8,  estrelas: [240, 180, 120] },
  genius: { cols: 4, rows: 6, pares: 12, estrelas: [180, 120,  60] },
  // 4 de largura por 7 de altura: 28 casas, 14 pares certinhos.
  mestre: { cols: 4, rows: 7, pares: 14, estrelas: [300, 210, 150] },
  // O topo: 5 por 8, 40 casas, 20 pares. Ainda cabe numa tela de celular
  // sem rolagem porque, com 5 colunas, cada carta fica mais estreita.
  lenda:  { cols: 5, rows: 8, pares: 20, estrelas: [420, 300, 210] },
};


/* Quanto custa jogar uma fase.
   Sobe de 5 em 5 com a dificuldade: quanto mais alto o degrau, mais a rodada
   vale — e mais pesa errar. Zero quando a fase já foi vencida com as três
   estrelas: cobrar de novo por algo que a criança já dominou só a empurra
   para longe de repetir. É o que dá sentido às lumicoins sem punir treino. */
export const CUSTO_FAIXA = { easy: 5, medium: 10, hard: 15, genius: 20, mestre: 25, lenda: 30 };

export const custoDaFase = (stars, cont, stage) =>
  (stars?.[cont]?.[stage] || 0) >= 3 ? 0 : CUSTO_FAIXA[bandFor(cont, stage)];

/* Na memória a "fase" é o próprio nível, e o recorde guarda as estrelas. */
export const custoDaMemoria = (memBest, tema, nivel) =>
  (memBest?.[`${tema}:${nivel}`]?.stars || 0) >= 3 ? 0 : CUSTO_FAIXA[nivel];

/* No quebra-cabeça a regra é a mesma: montado com as três estrelas, monta de
   novo de graça. Repetir a imagem que já se domina é treino, não conquista. */
export const custoDoQuebra = (pzlBest, tema, nivel) =>
  (pzlBest?.[`${tema}:${nivel}`]?.stars || 0) >= 3 ? 0 : CUSTO_FAIXA[nivel];

/* Montar palavra custa METADE. Quem está aprendendo a ler é justamente quem
   ainda não tem lumicoin nenhuma para gastar — cobrar caro aqui seria trancar
   a porta de entrada. */
export const custoDaPalavra = (palBest, nivel) =>
  (palBest?.[nivel]?.stars || 0) >= 3 ? 0 : Math.round(CUSTO_FAIXA[nivel] / 2);


export const memEstrelas = (nivel, seg) => {
  const [um, dois, tres] = MEM_LEVELS[nivel].estrelas;
  return seg <= tres ? 3 : seg <= dois ? 2 : seg <= um ? 1 : 0;
};


export const diaISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* A memória usa as mesmas seis faixas do resto do app. */
/* Semana corrida de sete dias contados do mesmo instante para todo mundo.
   Não uso semana de calendário de propósito: fuso e virada de domingo dão
   um monte de canto estranho, e aqui basta "a cada sete dias entram mais
   cem". */
/* A semana do app começa no DOMINGO, no fuso do aparelho, e a chave é a data
   desse domingo ("2026-08-30"). É a semana que a família reconhece — a mesma
   do calendário da geladeira — e não uma janela corrida de sete dias contada
   de um instante qualquer.

   Serve para as duas coisas que reiniciam junto: o presente do responsável e
   o resumo do que cada criança fez na semana. */
export function semanaAtual(quando = new Date()) {
  const d = new Date(quando);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());          // volta para o domingo
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}


/* Domingo e sábado daquela semana, para escrever "31/08 a 06/09". */
export function intervaloDaSemana(chave, lang) {
  const [a, m, d] = chave.split("-").map(Number);
  const ini = new Date(a, m - 1, d), fim = new Date(a, m - 1, d + 6);
  const fmt = x => x.toLocaleDateString(lang, { day: "2-digit", month: "2-digit" });
  return `${fmt(ini)} – ${fmt(fim)}`;
}


/* Quantas semanas de histórico ficam guardadas por criança. Três meses é o
   que um adulto olha para trás; mais que isso é entulho no aparelho. */
export const SEMANAS_GUARDADAS = 12;


export const SEMANA_VAZIA = { rodadas: 0, certas: 0, estrelas: 0, desenhos: 0, memorias: 0, quebras: 0, palavras: 0, momentos: 0, registros: 0, duplas: 0, lumicoins: 0 };


/* A mesma cor de cada princípio em devocional.js. Está repetida aqui porque é
   estilo de tela, não dado: o caderno não deveria carregar 49 devocionais só
   para saber pintar uma borda. */
export const CORES_PRINCIPIO = {
  soberania: "#6A5AE0", individualidade: "#00B894", autogoverno: "#4C6FFF",
  carater: "#F9A826", alianca: "#E84393", semeadura: "#00C2CB", mordomia: "#8D6E3A",
};


/* "2026-09-02" → "2 de set." no idioma de quem lê. */
export function diaCurto(iso, lang) {
  const [a, m, d] = String(iso || "").split("-").map(Number);
  if (!a) return iso || "";
  try { return new Date(a, m - 1, d).toLocaleDateString(lang, { day: "numeric", month: "short" }); }
  catch { return iso; }
}


/* ---------- telas em que o som se cala ----------
   Não é o app inteiro: o devocional é para a família ler junto em voz alta, e
   o caderno é o único lugar do app onde a criança pensa sem ser cronometrada.
   Música por cima dos dois seria estorvo. */
export const TELAS_SEM_SOM = new Set(["devocional", "caderno", "escrever", "familia"]);

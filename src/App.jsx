import React, { useState, useEffect, useRef, useCallback } from "react";

/* Bancos de perguntas. Ficam fora deste arquivo porque são DADOS, não lógica:
   um pastor pode revisar biblia-pessoas.js sem abrir o jogo, e o App.jsx não
   dobra de tamanho a cada cem perguntas novas. */
import { bancoBiblia } from "./data/biblia.js";
import { CURIOSIDADES, CURIOSIDADE_NIVEL, AGUAS } from "./data/curiosidades.js";
import { perguntasCiencia, CIENCIA_NIVEL, GRUPOS, DIETAS, CASAS, NASCE } from "./data/ciencias.js";
import { versoDoDia } from "./data/versos.js";
import { devocionalDoDia } from "./data/devocional.js";
import { CARIMBOS, carimboPorId, perguntaDoRegistro, semente as sementeDoTexto } from "./data/caderno.js";
import { T, LANG_CATALOG, PACKS } from "./data/textos.js";
import { DATA, SUBFLAGS, BR_ESTADOS, US_ESTADOS, CAPITAIS, CAP_PT, CAP_ES } from "./data/geografia.js";
import { PALETA, DESENHOS } from "./data/desenhos.js";

/* ============================================================
   LUMUS — Kids Game Hub
   "Iluminar a mente"
   © ElCamargo Soluções em TI LTDA — https://github.com/ElCamargo/KidsGameHub
   Licença MIT (ver LICENSE)
   ------------------------------------------------------------
   Jogo 1: Bandeiras do Mundo
   Persistência via window.storage (ver src/lib/storage.js).
   ============================================================ */

/* ---------- i18n ---------- */
/* Assinatura da criadora, exibida na abertura e na área dos pais. */
const MADE_BY = "ElCamargo Soluções em TI LTDA";

/* Idiomas embutidos no app; os demais vêm por download (ver LANG_CATALOG). */


/* ---------- Pacotes de idioma baixáveis ----------
   Só a INTERFACE precisa de tradução (~70 frases). Os nomes dos países
   vêm de Intl.DisplayNames, que já fala ~100 idiomas de fábrica.
   Todos os 6 idiomas viajam embutidos no app: nada é baixado de servidor
   nenhum, nem de CDN próprio — a promessa de zero requisição a terceiros
   vale também para o texto. */


/* Carrega um idioma. Ordem: já carregado → cache do aparelho → pacote
   embutido. Nunca deixa o app sem texto e nunca sai para a rede. */
async function loadLang(code) {
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
function jaInstalado() {
  try {
    return window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;
  } catch { return false; }
}
function ehIOS() {
  try { return /iphone|ipad|ipod/i.test(navigator.userAgent); } catch { return false; }
}

/* Idioma do aparelho, se o app já falar */
function deviceLang() {
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
const CATALOG = [
  { id: "geo", icon: "🌍", color: "#4C6FFF", games: [
      { id: "flags", icon: "🚩", color: "#00B894", preco: 0, leitura: true, ready: true },
      { id: "memory", icon: "🧠", color: "#4C6FFF", preco: 150, leitura: false, ready: true },
      { id: "capitals", icon: "🏛️", color: "#6A5AE0", preco: 500, leitura: true, ready: true },
      { id: "curiosidades", icon: "🗺️", color: "#00C2CB", preco: 800, leitura: true, ready: true },
  ]},
  { id: "math", icon: "🔢", color: "#F9A826", games: [
      { id: "count", icon: "🧮", color: "#F9A826", preco: 0, leitura: false, ready: true },
  ]},
  { id: "nature", icon: "🦁", color: "#00C2CB", games: [
      { id: "animals", icon: "🐾", color: "#00C2CB", preco: 0, leitura: false, ready: true },
      { id: "animalQuiz", icon: "🦉", color: "#00B894", preco: 300, leitura: true, ready: true },
      { id: "sciAnimals", icon: "🔬", color: "#6A5AE0", preco: 600, leitura: true, ready: true },
  ]},
  { id: "art", icon: "🎨", color: "#E84393", games: [
      { id: "color", icon: "🖍️", color: "#E84393", preco: 0, leitura: false, ready: true },
      { id: "colors", icon: "🌈", color: "#F9A826", preco: 200, leitura: true, ready: true },
      { id: "artMem", icon: "🧩", color: "#9B59B6", preco: 500, leitura: false, ready: true },
  ]},
  { id: "eng", icon: "🔤", color: "#4C6FFF", games: [
      { id: "words", icon: "🔤", color: "#4C6FFF", preco: 0, leitura: true, ready: true },
      { id: "wordMem", icon: "🃏", color: "#6A5AE0", preco: 350, leitura: true, ready: true },
  ]},
  { id: "faith", icon: "✝️", color: "#8D6E3A", games: [
      { id: "bible", icon: "✝️", color: "#8D6E3A", preco: 0, leitura: true, ready: true },
      { id: "bibleMem", icon: "🕊️", color: "#00C2CB", preco: 350, leitura: false, ready: true },
  ]},
];

const TODOS_JOGOS = CATALOG.flatMap(c => c.games);
/* Um jogo que nasce grátis para uns e trancado para outros ainda precisa de
   preço quando aparece trancado. */
const PRECO_PADRAO = 150;
const precoDe = g => g.preco || PRECO_PADRAO;

/* O que já nasce aberto depende de quem está jogando: quem lê começa pelos
   jogos grátis de sempre; quem ainda não lê começa pelos que se joga
   olhando. Os outros continuam ali, à vista, para abrir com lumicoins —
   ninguém fica sem ver o que ainda vai poder jogar. */
const jogosGratisPara = leitor =>
  TODOS_JOGOS.filter(g => leitor ? !g.preco : !g.leitura).map(g => g.id);

/* Se a pergunta da leitura ficou sem resposta, a idade responde por ela. */
const ehLeitor = perfil =>
  perfil?.leitor != null ? perfil.leitor : (perfil?.idade ?? 6) >= 5;
const JOGOS_GRATIS = jogosGratisPara(true);


/* Dentro de cada área os jogos abrem em ordem: o primeiro é livre e cada
   seguinte custa mais que o anterior. As áreas em si nunca ficam trancadas,
   então sempre há algo novo para fazer em outro canto do hub. */
const PRECO_GERAR = 100;   // 9 desenhos novos no jogo de pintar

/* Dentro de cada jogo a progressão também se compra, como os continentes
   das bandeiras: o primeiro trecho é livre e os seguintes vão custando mais. */
/* Cada trilha compra os próprios níveis: abrir o Gênio da Europa não abre o
   da Ásia. Os preços saem do que a própria trilha rende — zerar o nível
   anterior com 100% quase paga o seguinte, e a folga vai diminuindo:
     Fácil   5 fases × 55 líquidos = 275  →  Médio  custa 200 (sobra)
     Médio   4 fases × 55          = 220  →  Difícil custa 250 (falta pouco)
     Difícil 3 fases × 55          = 165  →  Gênio  custa 300 (exige repetir)   */
const BAND_PRECO = { easy: 0, medium: 200, hard: 250, genius: 300, mestre: 400, lenda: 500 };
const MEM_PRECO  = { easy: 0, medium: 100, hard: 150, genius: 200, mestre: 400, lenda: 700 };   // ~3 a 5 rodadas boas cada
const CAP_PRECO  = {                                                    // regiões das capitais
  cap_br: 0, cap_sa: 100, cap_na: 150, cap_eu: 250,
  cap_af: 350, cap_as: 450, cap_oc: 550, cap_us: 700,
};

/* Países-ilha, para a conquista "Caçador de ilhas" */
const ISLANDS = new Set(["CU","JM","HT","DO","BS","TT","AG","BB","DM","GD","KN","LC","VC","PR",
  "IE","IS","MT","CY","GB","MG","CV","MU","SC","KM","ST","JP","ID","PH","LK","MV","BN","TL","BH","SG",
  "AU","NZ","FJ","PG","WS","TO","VU","SB","KI","TV","NR","MH","FM","PW"]);

/* Ordem de desbloqueio + meio de transporte para chegar lá */
const ROUTE = [
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
const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];

/* Quantas perguntas por rodada. Rodada curta para os pequenos, longa para
   quem já chegou no topo — é parte do que faz o Lenda ser Lenda. */
const PERGUNTAS_RODADA = { easy: 5, medium: 5, hard: 10, genius: 10, mestre: 12, lenda: 15 };
const qtdPerguntas = band => PERGUNTAS_RODADA[band] || 10;

/* O relógio só entra no Médio e vai apertando dentro de cada faixa.

   Esses números são o dobro dos primeiros que escrevi. O jogo é para criança
   de 5 e 6 anos: ela ainda soletra, e um cronômetro de 4 segundos não mede o
   que ela sabe, mede se ela consegue ler a tempo. A pressa continua existindo
   — o Gênio ainda é bem mais apertado que o Médio —, só que agora sobra tempo
   para pensar entre ler e responder. */
const FAIXA_TEMPO = { medium: [25, 18], hard: [16, 13], genius: [12, 10], mestre: [10, 8], lenda: [8, 6] };

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
const escadaDe = cont => ESCADAS[cont] || ESCADA_PADRAO;
const totalDe = cont => escadaDe(cont).total;
const bandFor = (cont, stage) => escadaDe(cont).plan[Math.min(stage, totalDe(cont)) - 1];
const tempoDe = (cont, stage) => escadaDe(cont).times[Math.min(stage, totalDe(cont)) - 1];
const BAND_COLOR = { easy: "#00B894", medium: "#4C6FFF", hard: "#F9A826", genius: "#E84393", mestre: "#6A5AE0", lenda: "#D4A017" };

/* ---------- Economia ---------- */
const ECON = {
  start: 50,                       // com o que se começa
  refillAmount: 100,               // liberadas a cada 3h, mas só entram se resgatar
  refillMs: 3 * 60 * 60 * 1000,
  cap: Infinity,                   // sem teto: o contador só anda quando se resgata
  hint1: 8, hint2: 20, hint3: 80,
  reward: { 1: 25, 2: 45, 3: 65 },  // por estrela, +5 extra se não usar dica
  memReward: { 1: 10, 2: 25, 3: 50 },
  /* O responsável ganha 100 lumicoins por semana para dar de presente a
     quem quiser. Não é para ele gastar: é o motivo de ele abrir o app,
     olhar como os filhos estão indo e escolher quem premiar. O dinheiro
     que ele mesmo usa jogando é o dele, ganho como o de todo mundo. */
  presenteSemanal: 100,
  /* O primeiro registro do dia paga; o segundo não. Escrever tem que valer a
     pena, mas não pode virar uma torneira de moedas — senão a criança escreve
     dez linhas vazias e o caderno morre no mesmo dia em que nasceu. */
  cadernoReward: 15,
  /* Jogar em dupla é de graça, e paga os dois — ganhando ou perdendo. O que
     queremos que aconteça de novo amanhã é o irmão chamar o irmão, não um
     vencer o outro. Uma vez por dia, senão vira fábrica de lumicoins. */
  duplaReward: 20,
  colorReward: 10,                 // por desenho terminado
  colorDailyCap: 200,              // 20 desenhos premiados por dia (20 × 10)
};

/* ---------- Loja de avatar ---------- */
const SHOP_CATS = ["hairStyle", "cap", "glasses", "shirt", "shirtPattern"];

/* Raridades: poucos itens baratos para dar gosto logo no começo,
   e uma escada longa até os lendários, que exigem muito jogo. */
const RARITY = {
  comum:     { cor: "#8B93AD", label: "•" },
  raro:      { cor: "#4C6FFF", label: "◆" },
  epico:     { cor: "#9B59B6", label: "★" },
  lendario:  { cor: "#F9A826", label: "👑" },
};

const SHOP_ITEMS = [
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

const CONQ_CATS = [
  { id: "geral",  icon: "🎯", pt: "Geral",      en: "General",    es: "General" },
  { id: "geo",    icon: "🌍", pt: "Geografia",  en: "Geography",  es: "Geografía" },
  { id: "cap",    icon: "🏛️", pt: "Capitais",   en: "Capitals",   es: "Capitales" },
  { id: "nature", icon: "🦁", pt: "Natureza",   en: "Nature",     es: "Naturaleza" },
  { id: "math",   icon: "🔢", pt: "Matemática", en: "Math",       es: "Matemáticas" },
  { id: "art",    icon: "🎨", pt: "Arte",       en: "Art",        es: "Arte" },
  { id: "lang",   icon: "🔤", pt: "Idiomas",    en: "Languages",  es: "Idiomas" },
  { id: "bible",  icon: "✝️", pt: "Bíblia",     en: "Bible",      es: "Biblia" },
  { id: "mem",    icon: "🧠", pt: "Memória",    en: "Memory",     es: "Memoria" },
  { id: "habit",  icon: "📅", pt: "Dedicação",  en: "Dedication", es: "Constancia" },
];

const ACHIEVEMENTS = [
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

  /* --- dedicação --- */
  { id: "day3", cat: "habit", n: 1, icon: "📅", pt: "3 dias seguidos jogando", en: "3 days in a row", es: "3 días seguidos", test: s => s.dayStreak >= 3 },
  { id: "day7", cat: "habit", n: 2, icon: "🗓️", pt: "7 dias seguidos jogando", en: "7 days in a row", es: "7 días seguidos", test: s => s.dayStreak >= 7 },
  { id: "duo1", cat: "habit", n: 1, icon: "👥", pt: "Primeira partida em dupla", en: "First game in pairs", es: "Primera partida en pareja", test: s => s.duplas >= 1 },
  { id: "duo10", cat: "habit", n: 2, icon: "🤜", pt: "10 partidas em dupla", en: "10 games in pairs", es: "10 partidas en pareja", test: s => s.duplas >= 10 },
  { id: "duo50", cat: "habit", n: 3, icon: "🎏", pt: "50 partidas em dupla", en: "50 games in pairs", es: "50 partidas en pareja", test: s => s.duplas >= 50 },
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

const premioDe = a => PREMIO_CONQUISTA[a.n] || 0;
/* Bolinhas em vez de palavras: funciona em qualquer idioma e a criança
   entende a escada só de olhar. */
const NIVEL_LABEL = { 1: "●", 2: "●●", 3: "●●●", 4: "●●●●" };


/* Insígnias: raras de propósito. São o que distingue quem jogou muito. */
const BADGES = [
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
const flagUrl = c => `${BASE}flags/${c.toLowerCase()}.svg`;

function countryName(code, lang) {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code);
  } catch { return code; }
}
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; };
const tempoFmt = seg => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`;
const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${String(m).padStart(2, "0")}m`; };

/* ---------- Avatar SVG ----------
   Um único desenho serve para o jogo E para a vitrine da loja,
   então o que a criança vê na loja é exatamente o que ela leva. */
const SKINS = ["#FFDBAC", "#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#5C3317"];
const HAIRS = ["#2C1B10", "#6B3E26", "#C68642", "#E8B923", "#D64545", "#7B4EBE", "#2E86DE"];
const SHIRTS = ["#4C6FFF", "#00B894", "#FF7043", "#E84393", "#F9A826", "#00C2CB"];
const HAIR_STYLES = ["short", "buzz", "curly", "long", "bob", "wavy", "ponytail", "afro", null];

/* O cabelo é desenhado em duas camadas: HairBack fica ATRÁS do rosto (é a
   silhueta) e HairFront por cima (é a franja). Como o rosto é desenhado no
   meio das duas, basta a silhueta cobrir tudo — o que sobra por trás da
   cabeça é justamente o que a criança vê. */
function HairBack({ style, color }) {
  if (style === "afro") return <circle cx="50" cy="36" r="31" fill={color} />;
  if (style === "long") return <path d="M20 40 Q20 14 50 14 Q80 14 80 40 L80 76 Q71 70 71 52 L29 52 Q29 70 20 76 Z" fill={color} />;
  // Chanel: passa das orelhas e para na altura do queixo.
  if (style === "bob") return <path d="M17 46 Q17 10 50 10 Q83 10 83 46 L83 66 Q83 72 77 72 Q71 72 71 65 L71 44 L29 44 L29 65 Q29 72 23 72 Q17 72 17 66 Z" fill={color} />;
  // Comprido ondulado: duas mechas caem sobre os ombros, com a ponta em onda.
  if (style === "wavy") return <path d="M16 46 Q16 8 50 8 Q84 8 84 46 L84 80 Q84 87 79 85 Q74 90 71 84 L71 44 L29 44 L29 84 Q26 90 21 85 Q16 87 16 80 Z" fill={color} />;
  if (style === "ponytail") return <ellipse cx="80" cy="48" rx="9" ry="15" fill={color} />;
  return null;
}
function HairFront({ style, color }) {
  if (!style) return null;
  if (style === "buzz") return <path d="M25 40 Q28 22 50 22 Q72 22 75 40 Q62 32 50 32 Q38 32 25 40 Z" fill={color} />;
  // Franja reta, cortada na altura das sobrancelhas.
  if (style === "bob") return <path d="M23 40 Q24 12 50 12 Q76 12 77 40 Q77 31 50 29 Q23 31 23 40 Z" fill={color} />;
  // Franja repartida de lado.
  if (style === "wavy") return <path d="M22 41 Q23 11 50 11 Q78 11 79 41 Q73 24 54 28 Q36 32 22 41 Z" fill={color} />;
  if (style === "curly") return (
    <g fill={color}>
      <circle cx="30" cy="31" r="11" /><circle cx="44" cy="23" r="12" />
      <circle cx="58" cy="23" r="12" /><circle cx="71" cy="32" r="11" />
    </g>
  );
  return <path d="M24 40 Q26 16 50 16 Q74 16 76 40 Q66 28 50 30 Q34 32 24 40 Z" fill={color} />;
}

function Glasses({ kind }) {
  if (kind === "round") return <g stroke="#2b2b2b" strokeWidth="2.5" fill="none"><circle cx="40" cy="45" r="8" /><circle cx="60" cy="45" r="8" /><path d="M48 45 H52" /></g>;
  if (kind === "nerd") return <g stroke="#2b2b2b" strokeWidth="3.5" fill="none"><rect x="30" y="38" width="18" height="14" rx="4" /><rect x="52" y="38" width="18" height="14" rx="4" /><path d="M48 45 H52" /></g>;
  if (kind === "sun") return <g><rect x="29" y="38" width="19" height="13" rx="5" fill="#2b2b2b" /><rect x="52" y="38" width="19" height="13" rx="5" fill="#2b2b2b" /><path d="M48 44 H52" stroke="#2b2b2b" strokeWidth="3" /><path d="M31 41 L36 41" stroke="#fff" strokeWidth="2" opacity=".6" /></g>;
  if (kind === "heart") return (
    <g stroke="#E84393" strokeWidth="2.5" fill="none">
      <path d="M40 40 c -1.6 -3.6 -8 -2.6 -8 1.8 c 0 3.6 5.2 6 8 8.4 c 2.8 -2.4 8 -4.8 8 -8.4 c 0 -4.4 -6.4 -5.4 -8 -1.8 z" transform="translate(-1,0)" />
      <path d="M60 40 c -1.6 -3.6 -8 -2.6 -8 1.8 c 0 3.6 5.2 6 8 8.4 c 2.8 -2.4 8 -4.8 8 -8.4 c 0 -4.4 -6.4 -5.4 -8 -1.8 z" transform="translate(3,0)" />
    </g>
  );
  return null;
}

function Headwear({ value }) {
  if (!value) return null;
  const [shape, color] = String(value).split("|");
  if (shape === "crown") return (
    <g>
      <path d="M24 32 L24 14 L36 24 L50 10 L64 24 L76 14 L76 32 Z" fill="#F1C40F" stroke="#D4A017" strokeWidth="2" strokeLinejoin="round" />
      <rect x="23" y="31" width="54" height="8" rx="4" fill="#F1C40F" stroke="#D4A017" strokeWidth="2" />
      <circle cx="50" cy="35" r="3" fill="#E74C3C" /><circle cx="34" cy="35" r="2.4" fill="#4C6FFF" /><circle cx="66" cy="35" r="2.4" fill="#00B894" />
    </g>
  );
  if (shape === "explorer") return (
    <g>
      <path d="M6 40 Q50 30 94 40 Q50 50 6 40 Z" fill="#8D6E3A" />
      <path d="M28 38 Q30 14 50 14 Q70 14 72 38 Z" fill="#A98047" />
      <path d="M28 34 H72 V39 H28 Z" fill="#5C4326" />
    </g>
  );
  if (shape === "beanie") return (
    <g>
      <path d="M24 34 Q24 12 50 12 Q76 12 76 34 Z" fill={color} />
      <rect x="21" y="32" width="58" height="9" rx="4.5" fill="#fff" opacity=".85" />
      <circle cx="50" cy="10" r="5" fill="#fff" opacity=".85" />
    </g>
  );
  if (shape === "bow") return (
    <g fill={color}>
      <path d="M50 24 L34 15 L34 33 Z" /><path d="M50 24 L66 15 L66 33 Z" /><circle cx="50" cy="24" r="5" />
    </g>
  );
  // boné
  return (
    <g>
      <path d="M22 34 Q24 12 50 12 Q76 12 78 34 Z" fill={color} />
      <path d="M22 34 Q10 36 8 42 Q30 42 50 36 Z" fill={color} opacity=".85" />
      <circle cx="50" cy="13" r="3.5" fill="#fff" opacity=".8" />
    </g>
  );
}

function ShirtPattern({ kind }) {
  if (kind === "stripe") return <path d="M23 86 H77 M22 94 H78" stroke="#fff" strokeWidth="5" opacity=".75" />;
  if (kind === "dots") return (
    <g fill="#fff" opacity=".8">
      <circle cx="36" cy="85" r="3" /><circle cx="50" cy="92" r="3" /><circle cx="64" cy="85" r="3" />
      <circle cx="43" cy="98" r="3" /><circle cx="57" cy="98" r="3" />
    </g>
  );
  if (kind === "star") return <path d="M50 80 L54 89 L64 90 L56 96 L59 100 L50 95 L41 100 L44 96 L36 90 L46 89 Z" fill="#FFE066" />;
  if (kind === "heart") return <path d="M50 100 C40 93 34 89 34 84 c 0 -5 7 -6 9 -1 c 2 -5 9 -4 9 1 c 0 5 -6 9 -2 16 z" fill="#fff" opacity=".85" transform="translate(-1,-4)" />;
  if (kind === "rainbow") return (
    <g fill="none" strokeWidth="4" strokeLinecap="round">
      <path d="M34 100 A16 16 0 0 1 66 100" stroke="#E74C3C" />
      <path d="M40 100 A10 10 0 0 1 60 100" stroke="#F9A826" />
      <path d="M46 100 A4 4 0 0 1 54 100" stroke="#00B894" />
    </g>
  );
  return null;
}

function Avatar({ a, size = 96 }) {
  const hs = a.hairStyle === undefined ? "short" : a.hairStyle;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <path d="M20 100 Q20 74 50 74 Q80 74 80 100 Z" fill={a.shirt} />
      <ShirtPattern kind={a.shirtPattern} />
      <rect x="43" y="64" width="14" height="14" rx="6" fill={a.skin} />
      <HairBack style={hs} color={a.hair} />
      <ellipse cx="50" cy="44" rx="26" ry="27" fill={a.skin} />
      <circle cx="23" cy="46" r="5" fill={a.skin} />
      <circle cx="77" cy="46" r="5" fill={a.skin} />
      <HairFront style={hs} color={a.hair} />
      <ellipse cx="40" cy="45" rx="4" ry="5" fill="#2b2b2b" />
      <ellipse cx="60" cy="45" rx="4" ry="5" fill="#2b2b2b" />
      <circle cx="41.5" cy="43" r="1.4" fill="#fff" />
      <circle cx="61.5" cy="43" r="1.4" fill="#fff" />
      <circle cx="32" cy="53" r="4.5" fill="#FF8FA3" opacity=".55" />
      <circle cx="68" cy="53" r="4.5" fill="#FF8FA3" opacity=".55" />
      <path d="M42 57 Q50 64 58 57" stroke="#2b2b2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Glasses kind={a.glasses} />
      <Headwear value={a.cap} />
    </svg>
  );
}

/* ---------- Marca ----------
   Fica no topo de todas as telas, discreta o bastante para não competir com
   o título de cada uma, mas presente o suficiente para fixar o nome. */
function Marca() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10, opacity: .6 }}>
      <svg width="17" height="17" viewBox="0 0 100 100" aria-hidden="true">
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r = (a * Math.PI) / 180;
          return <line key={a} x1={50 + Math.cos(r) * 40} y1={44 + Math.sin(r) * 40}
            x2={50 + Math.cos(r) * 52} y2={44 + Math.sin(r) * 52}
            stroke="#F9A826" strokeWidth="7" strokeLinecap="round" />;
        })}
        <circle cx="50" cy="44" r="29" fill="#FFD659" />
        <rect x="38" y="72" width="24" height="8" rx="4" fill="#B8C2DA" />
        <rect x="41" y="83" width="18" height="7" rx="3.5" fill="#96A2C3" />
      </svg>
      <span className="display" style={{ color: "#C9D2FF", fontSize: 13, letterSpacing: 3 }}>LUMUS</span>
    </div>
  );
}

/* ---------- Mundi, o mascote ---------- */
function Mundi({ size = 72, bounce = true }) {
  return (
    <div className={bounce ? "mundi-bob" : ""} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="46" r="34" fill="#4C6FFF" />
        <path d="M22 36 Q34 30 44 38 Q52 46 44 54 Q32 58 24 52 Z" fill="#00B894" />
        <path d="M58 26 Q72 28 76 40 Q70 48 60 44 Q54 34 58 26 Z" fill="#00B894" />
        <path d="M56 56 Q72 54 78 62 Q68 74 58 70 Q52 62 56 56 Z" fill="#00B894" />
        <circle cx="40" cy="44" r="7" fill="#fff" /><circle cx="41" cy="45" r="3.4" fill="#222" />
        <circle cx="62" cy="44" r="7" fill="#fff" /><circle cx="63" cy="45" r="3.4" fill="#222" />
        <path d="M42 60 Q50 68 60 60" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M38 82 L34 94 M62 82 L66 94" stroke="#F9A826" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ---------- UI base ---------- */
/* rotulo vira aria-label: um botão cujo conteúdo é só "←" não tem nome nenhum
   para um leitor de tela, e o adulto que usa VoiceOver ouve apenas "botão". */
const Btn = ({ children, onClick, color = "#4C6FFF", disabled, full, small, rotulo }) => (
  <button aria-label={rotulo} onClick={onClick} disabled={disabled}
    className={`chunky ${full ? "w-full" : ""}`}
    style={{
      background: disabled ? "#B9C0CC" : color,
      padding: small ? "10px 16px" : "16px 22px",
      fontSize: small ? 15 : 19,
      opacity: disabled ? .8 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    }}>{children}</button>
);

const Coin = ({ n }) => (
  <span className="inline-flex items-center gap-1 font-extrabold">
    <span style={{ fontSize: "1.05em" }}>🪙</span>{n}
  </span>
);

/* ============================================================
   APP
   ============================================================ */
/* Se algo quebrar, mostra um aviso amigável em vez de tela branca — e deixa
   claro que o progresso continua salvo, que é o medo real de quem joga. */
class Guarda extends React.Component {
  constructor(p) { super(p); this.state = { erro: null }; }
  static getDerivedStateFromError(e) { return { erro: e }; }
  componentDidCatch(e, info) { console.error("Lumus:", e, info); }
  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", background: "#1B2A6B", display: "grid", placeItems: "center",
        padding: 28, textAlign: "center", fontFamily: "system-ui, sans-serif",
      }}>
        <div>
          <div style={{ fontSize: 56 }}>🔧</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: "12px 0 6px" }}>
            Algo deu errado
          </div>
          <div style={{ color: "#C9D2FF", fontWeight: 600, fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
            Seu progresso continua salvo. Feche e abra o Lumus de novo.
          </div>
          <button onClick={() => window.location.reload()}
            style={{
              marginTop: 20, border: "none", borderRadius: 18, padding: "14px 26px",
              background: "#00B894", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
            }}>
            Tentar de novo
          </button>
        </div>
      </div>
    );
  }
}

function AppInterno() {
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState("pt");
  const [screen, setScreen] = useState("boot"); // boot|create|map|stages|game|result|shop|awards
  /* papel: "filho" joga; "pai" só acompanha. idade e leitor decidem o que
     nasce aberto — ver jogosGratisPara. Perfis antigos não têm esses campos:
     tratamos como criança que já lê, que era o comportamento de antes. */
  const [player, setPlayer] = useState({
    name: "", papel: "filho", idade: null, leitor: null, pin: null,
    avatar: { skin: SKINS[1], hair: HAIRS[0], hairStyle: "short", cap: null, glasses: null, shirt: SHIRTS[0], shirtPattern: null },
  });
  const [coins, setCoins] = useState(ECON.start);
  const [lastRefill, setLastRefill] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [unlocked, setUnlocked] = useState(["sa"]);
  const [progress, setProgress] = useState({});
  const [owned, setOwned] = useState([]);
  const [stars, setStars] = useState({});     // {continente: {fase: 1..3}}
  const [records, setRecords] = useState({}); // {continente: {fase: segundos}}
  const [memBest, setMemBest] = useState({}); // {nivel: {stars, time}}
  const [stats, setStats] = useState({
    rounds: 0, perfect: 0, bestStreak: 0, streak: 0, earned: 0, correct: 0,
    noHintRounds: 0, geniusCleared: 0, continents: 1,
    flash: 0, perfectNoHint: 0, lastStagePerfect: 0, islandRight: 0, subRight: 0,
    contDone: 0, dayStreak: 1, lastDay: "", maxCoins: ECON.start,
      stars: 0, momentos: 0, registros: 0, duplas: 0, memRounds: 0, memPerfect: 0, mem3: 0, colorDone: 0, mathRight: 0, mathStage: 0, bichoRight: 0, engRight: 0, bibRight: 0, capRight: 0,
  });
  const [seenAch, setSeenAch] = useState([]);
  const [toast, setToast] = useState(null);
  const [travelFx, setTravelFx] = useState(null);
  const [tutorial, setTutorial] = useState(false);
  const [installTip, setInstallTip] = useState(false);
  const [voltaPara, setVoltaPara] = useState("home"); // de onde a loja/conquistas foram abertas

  const [sel, setSel] = useState({ cont: "sa", stage: 1 });
  const [round, setRound] = useState(null);
  const [mem, setMem] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [colorDay, setColorDay] = useState({ dia: "", moedas: 0 });
  const [pintando, setPintando] = useState(null);
  const [memTema, setMemTema] = useState("flags");
  const [gerados, setGerados] = useState([]);
  const [jogosAbertos, setJogosAbertos] = useState(JOGOS_GRATIS);
  const [secoes, setSecoes] = useState([]); // níveis e regiões já comprados
  const [destinoIdioma, setDestinoIdioma] = useState("quiz"); // quiz ou memória
  const [editando, setEditando] = useState(false);            // criando ou editando ficha

  /* ----- Momento em Família -----
     Isto não é do jogador, é do lar: o devocional é feito junto, uma vez por
     dia, por quem estiver ali. Por isso mora em "lumus:familia", fora dos
     saves de cada perfil, e a sequência é da família inteira.

     fe: null = ninguém escolheu ainda · true = a família quer · false = não. */
  const [momento, setMomento] = useState({ fe: null, ultimoDia: "", sequencia: 0, feitos: 0 });
  const momentoFeitoHoje = momento.ultimoDia === diaISO();
  /* {semana, restante} — quanto ainda há para presentear nesta semana. */
  const [presente, setPresente] = useState({ semana: semanaAtual(), restante: ECON.presenteSemanal });
  /* { "2026-08-30": {rodadas, certas, estrelas, desenhos, memorias, lumicoins} } */
  const [semanas, setSemanas] = useState({});
  /* Meu Caderno: o que a criança registrou, do mais antigo para o mais novo.
     Chaves curtas de propósito — isto cresce e mora no localStorage.
     { d: dia, t: texto, c: [carimbos], p: princípio, s: sobre o quê } */
  const [caderno, setCaderno] = useState([]);
  /* O dia em que a dupla já foi premiada, para não pagar duas vezes. */
  const [duplaDia, setDuplaDia] = useState("");
  /* Com quem se está jogando agora: {id, name, avatar}. id nulo = convidado,
     alguém que não tem perfil no aparelho e por isso não recebe lumicoins. */
  const [dupla, setDupla] = useState(null);
  const [escolhendoDupla, setEscolhendoDupla] = useState(false);
  /* A pergunta que está sendo respondida agora, e para onde voltar depois. */
  const [rascunho, setRascunho] = useState(null);

  /* Bônus dado pelo responsável e ainda não mostrado: {valor, de}. */
  const [presenteRecebido, setPresenteRecebido] = useState(null);

  /* Soma no balde da semana corrente. Os totais de sempre continuam em stats;
     isto aqui é só o "o que aconteceu desde domingo", que é o que o adulto
     pergunta quando pega o celular. */
  function registrarSemana(campos) {
    const chave = semanaAtual();
    setSemanas(atual => {
      const balde = { ...SEMANA_VAZIA, ...(atual[chave] || {}) };
      for (const [k, v] of Object.entries(campos)) balde[k] = (balde[k] || 0) + v;
      const proximo = { ...atual, [chave]: balde };
      // guarda só as últimas semanas: histórico longo não cabe e ninguém lê
      const chaves = Object.keys(proximo).sort();
      for (const velha of chaves.slice(0, Math.max(0, chaves.length - SEMANAS_GUARDADAS))) delete proximo[velha];
      return proximo;
    });
  }

  /* Feito hoje. A sequência quebra se pular um dia — não é castigo, é o que
     faz existir o "não vamos perder hoje", que é o ponto do hábito. */
  function marcarMomento() {
    if (momentoFeitoHoje) return;
    const hoje = diaISO(), ontem = diaISO(new Date(Date.now() - 864e5));
    setMomento(m => ({
      ...m, fe: true, ultimoDia: hoje, feitos: (m.feitos || 0) + 1,
      sequencia: m.ultimoDia === ontem ? (m.sequencia || 0) + 1 : 1,
    }));
    // Quem estava ali leva o crédito no próprio perfil. De propósito não há
    // lumicoin nenhuma aqui: fé neste app não se troca por moeda.
    if (activeId) setStats(x => ({ ...x, momentos: (x.momentos || 0) + 1 }));
    registrarSemana({ momentos: 1 });
  }

  const t = T[lang];

  /* O <html lang> mandava sempre "pt-BR". Leitor de tela lê inglês com sotaque
     português quando isso está errado, e o navegador oferece traduzir por cima. */
  useEffect(() => { try { document.documentElement.lang = lang; } catch { } }, [lang]);

  /* ----- perfis: vários jogadores no mesmo aparelho -----
     Índice leve em "lumus:profiles" (id, nome, avatar) para desenhar a
     tela de escolha sem abrir todos os saves. O progresso de cada um fica
     em "lumus:p:<id>", separado — irmão não mexe no do irmão. */
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const blankSave = () => ({
    coins: ECON.start, lastRefill: Date.now(), unlocked: ["sa"], progress: {}, owned: [], seenAch: [],
    stars: {}, records: {}, memBest: {}, gallery: [], colorDay: { dia: "", moedas: 0 }, gerados: [], jogosAbertos: JOGOS_GRATIS, secoes: [],
    presente: { semana: semanaAtual(), restante: ECON.presenteSemanal }, semanas: {}, presenteRecebido: null, caderno: [], duplaDia: "",
    stats: {
      rounds: 0, perfect: 0, bestStreak: 0, streak: 0, earned: 0, correct: 0,
      noHintRounds: 0, geniusCleared: 0, continents: 1,
      flash: 0, perfectNoHint: 0, lastStagePerfect: 0, islandRight: 0, subRight: 0,
      contDone: 0, dayStreak: 1, lastDay: "", maxCoins: ECON.start,
      stars: 0, momentos: 0, registros: 0, duplas: 0, memRounds: 0, memPerfect: 0, mem3: 0, colorDone: 0, mathRight: 0, mathStage: 0, bichoRight: 0, engRight: 0, bibRight: 0, capRight: 0,
    },
  });

  function applySave(d, perfil) {
    setPlayer({
      name: perfil.name, avatar: perfil.avatar,
      papel: perfil.papel || "filho",
      idade: perfil.idade ?? null,
      leitor: perfil.leitor ?? null,
      pin: perfil.pin || null,
    });
    // Cada jogador tem o seu idioma: um irmão pode jogar em inglês e o outro
    // em português no mesmo aparelho.
    if (d.lang && T[d.lang]) setLang(d.lang);
    else if (d.lang) loadLang(d.lang).then(ok => ok && setLang(d.lang));
    setCoins(d.coins); setLastRefill(d.lastRefill); setUnlocked(d.unlocked);
    const oldFmt = Object.keys(d.progress || {}).some(k => k.includes(":"));
    setProgress(oldFmt ? {} : (d.progress || {}));
    setOwned(d.owned || []); setStats(d.stats); setSeenAch(d.seenAch || []);
    setStars(d.stars || {}); setRecords(d.records || {}); setMemBest(d.memBest || {});
    setGallery(d.gallery || []); setColorDay(d.colorDay || { dia: "", moedas: 0 });
    setGerados(d.gerados || []);
    setJogosAbertos([...new Set([...jogosGratisPara(ehLeitor(perfil)), ...(d.jogosAbertos || [])])]);
    setSecoes(d.secoes || []);
    // Semana nova, cofre cheio de novo. Sobra da semana passada não acumula:
    // é uma mesada para usar, não um saldo para juntar.
    const sem = semanaAtual();
    setPresente(d.presente?.semana === sem ? d.presente : { semana: sem, restante: ECON.presenteSemanal });
    setSemanas(d.semanas || {});
    setPresenteRecebido(d.presenteRecebido || null);
    setCaderno(d.caderno || []);
    setDuplaDia(d.duplaDia || "");
  }

  useEffect(() => {
    (async () => {
      let list = [];
      try {
        const r = await window.storage.get("lumus:profiles");
        if (r?.value) list = JSON.parse(r.value);
      } catch { }
      // O app já se chamou Mundi: traz o que foi salvo com o nome antigo.
      if (!list.length) {
        try {
          const velho = await window.storage.get("mundi:profiles");
          if (velho?.value) {
            list = JSON.parse(velho.value);
            window.storage.set("lumus:profiles", velho.value);
            for (const pr of list) {
              try {
                const sv = await window.storage.get(`mundi:p:${pr.id}`);
                if (sv?.value) window.storage.set(`lumus:p:${pr.id}`, sv.value);
              } catch { }
            }
          }
        } catch { }
      }
      let chosen = null;
      try { const l = await window.storage.get("lumus:lang"); chosen = l?.value || null; } catch { }
      const want = chosen || deviceLang();
      if (await loadLang(want)) setLang(want);
      setProfiles(list);
      if (list.length) setScreen("profiles");
      else {
        // Primeiro acesso: já nasce com identificador, senão o jogador
        // criado agora não teria onde ser gravado.
        setActiveId(`p${Date.now()}`);
        setScreen("create");
      }
      // Convite para instalar: só fora do app instalado e só até ser dispensado.
      if (!jaInstalado()) {
        let visto = false;
        try { const v = await window.storage.get("lumus:installTip"); visto = !!v?.value; } catch { }
        if (!visto) setInstallTip(true);
      }
      try {
        const f = await window.storage.get("lumus:familia");
        if (f?.value) setMomento(m => ({ ...m, ...JSON.parse(f.value) }));
      } catch { }
      setLoaded(true);
    })();
  }, []);

  /* O lar tem um arquivo só, fora dos perfis: irmão não reinicia a sequência. */
  useEffect(() => {
    if (!loaded) return;
    try { window.storage.set("lumus:familia", JSON.stringify(momento)); } catch { }
  }, [loaded, momento]);

  /* ----- memória ----- */
  function comecarMemoria(nivel, tema = memTema, comDupla = null) {
    // Em dupla não se cobra: o que queremos é que eles joguem juntos.
    const custo = comDupla ? 0 : custoDaMemoria(memBest, tema, nivel);
    if (coins < custo) { setToast(t.notEnough); return; }
    if (custo) setCoins(c => c - custo);
    const cfg = MEM_LEVELS[nivel];
    let cartas;
    const alvoMem = alvoDe(tema);
    if (alvoMem) {
      // aqui o par é figura + palavra: casar os dois é o que ensina
      const vs = shuffle(VOCAB).slice(0, cfg.pares);
      cartas = shuffle(vs.flatMap(v => [
        { key: v.w.en, face: v.e, tipo: "emoji" },
        { key: v.w.en, face: v.w[alvoMem], tipo: "word" },
      ]));
    } else {
      const fonte =
        tema === "animals" ? [...new Set(ANIMAIS)]
        : tema === "arts" ? todosEmojis().map(o => o.e)
        : tema === "bible" ? BIBLIA_EMOJI
        : [...new Set(unlocked.flatMap(c => Object.keys(DATA[c])))];
      const tipo = tema === "flags" ? "flag" : "emoji";
      const escolhidas = shuffle([...new Set(fonte)]).slice(0, cfg.pares);
      cartas = shuffle(escolhidas.flatMap(k => [{ key: k, face: k, tipo }, { key: k, face: k, tipo }]));
    }
    setMem({ nivel, cartas, tema, duo: comDupla || null });
    setScreen("mem");
  }

  /* Fim de uma partida em dupla. Não mexe em estrelas nem em recordes: é outro
     jogo, com outra graça, e o recorde de um não pode ser feito a quatro mãos. */
  async function fimDupla({ seg, jogadas, pontos }) {
    const hoje = diaISO();
    const premio = duplaDia === hoje ? 0 : ECON.duplaReward;
    const outro = mem.duo;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setDuplaDia(hoje);
      registrarSemana({ lumicoins: premio });
    }
    setStats(x => ({ ...x, earned: x.earned + premio, duplas: (x.duplas || 0) + 1 }));
    registrarSemana({ duplas: 1 });

    // O outro jogador recebe no save dele, direto — ele não está com o app
    // aberto para receber de outro jeito. Convidado não tem save, e tudo bem.
    if (outro?.id) {
      try {
        const d = await lerSave(outro.id);
        if (premio) {
          d.coins = Math.min(ECON.cap, (d.coins || 0) + premio);
          d.stats = { ...d.stats, earned: (d.stats?.earned || 0) + premio,
            maxCoins: Math.max(d.stats?.maxCoins || 0, d.coins) };
        }
        d.stats = { ...d.stats, duplas: (d.stats?.duplas || 0) + 1 };
        window.storage.set(`lumus:p:${outro.id}`, JSON.stringify(d));
      } catch { }
    }

    const vencedor = pontos[0] === pontos[1] ? null : pontos[0] > pontos[1] ? 0 : 1;
    setMem(m => ({ ...m, done: true, seg, jogadas, pontos, vencedor, reward: premio }));
    setScreen("memResult");
  }

  function fimMemoria({ seg, jogadas, pontos }) {
    if (mem?.duo) { fimDupla({ seg, jogadas, pontos }); return; }
    const nivel = mem.nivel;
    const st = memEstrelas(nivel, seg);
    const reward = st ? ECON.memReward[st] : 0;
    setCoins(c => Math.min(ECON.cap, c + reward));
    const chave = `${mem.tema}:${nivel}`;
    const antes = memBest[chave];
    const recorde = !antes || seg < antes.time;
    setMemBest(b => ({
      ...b,
      [chave]: { stars: Math.max(antes?.stars || 0, st), time: recorde ? seg : antes.time },
    }));
    const today = new Date().toISOString().slice(0, 10);
    const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    setStats(x => ({
      ...x,
      earned: x.earned + reward,
      memRounds: x.memRounds + 1,
      mem3: x.mem3 + (st === 3 ? 1 : 0),
      memPerfect: x.memPerfect + (jogadas === mem.cartas.length / 2 ? 1 : 0),
      maxCoins: Math.max(x.maxCoins, Math.min(ECON.cap, coins + reward)),
      dayStreak: x.lastDay === today ? x.dayStreak : x.lastDay === yest ? x.dayStreak + 1 : 1,
      lastDay: today,
    }));
    registrarSemana({ memorias: 1, estrelas: st, lumicoins: reward });
    setMem(m => ({ ...m, done: true, seg, jogadas, st, reward, recorde }));
    setScreen("memResult");
  }

  /* ----- colorir ----- */
  function gerarMais(cobrar = true) {
    if (cobrar) {
      if (coins < PRECO_GERAR) { setToast(t.notEnough); return; }
      setCoins(c => c - PRECO_GERAR);
    }
    // Guardamos só as sementes: 9 desenhos novos custam 9 números.
    const novos = Array.from({ length: 9 }, () => Math.floor(Math.random() * 2 ** 31));
    setGerados(g => [...g, ...novos].slice(-90));
    setToast("✨ +9");
  }

  /* Abre o próximo jogo da área, se o anterior dela já estiver aberto */
  const temSecao = k => secoes.includes(k);
  function comprarSecao(k, preco) {
    if (temSecao(k) || !preco) return;
    if (coins < preco) { setToast(t.notEnough); return; }
    setCoins(c => c - preco);
    setSecoes(x => [...x, k]);
    setToast("🔓");
  }

  function abrirJogo(id) {
    const area = CATALOG.find(c => c.games.some(g => g.id === id));
    if (!area) return;
    const i = area.games.findIndex(g => g.id === id);
    const jogo = area.games[i];
    if (jogosAbertos.includes(id)) return;
    const anteriorOk = i === 0 || jogosAbertos.includes(area.games[i - 1].id);
    if (!anteriorOk) return;
    const preco = precoDe(jogo);
    if (coins < preco) { setToast(t.notEnough); return; }
    setCoins(c => c - preco);
    setJogosAbertos(g => [...g, id]);
    setToast(`🔓 ${t.games[id]}`);
  }

  function salvarDesenho(fills, completo) {
    const hoje = new Date().toISOString().slice(0, 10);
    const dia = colorDay.dia === hoje ? colorDay : { dia: hoje, moedas: 0 };
    // 10 moedas por desenho, até 20 desenhos por dia — mas pintar continua livre.
    const premio = (completo && dia.moedas < ECON.colorDailyCap) ? ECON.colorReward : 0;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setColorDay({ dia: hoje, moedas: dia.moedas + premio });
      setStats(x => ({ ...x, earned: x.earned + premio }));
    } else setColorDay(dia);
    if (completo) registrarSemana({ desenhos: 1, lumicoins: premio });
    setGallery(g => [...g, { id: pintando.art.id, fills, data: hoje }].slice(-81));  // 9 páginas de 9
    if (completo) setStats(x => ({ ...x, colorDone: (x.colorDone || 0) + 1 }));
    setToast(premio ? `🎨 +${premio} 🪙` : "🎨 💾");
    setPintando(null);
    setScreen("gallery");
  }

  /* ----- Meu Caderno -----
     Registrar é o 4º R da AEP, e o único passo do app em que não existe
     resposta certa. Nada aqui é corrigido, pontuado ou comparado. */
  function salvarRegistro({ texto, carimbos, principio, sobre }) {
    const hoje = diaISO();
    const primeiroDoDia = !caderno.some(r => r.d === hoje);
    const premio = primeiroDoDia ? ECON.cadernoReward : 0;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setStats(x => ({ ...x, earned: x.earned + premio }));
    }
    // 200 páginas: uma por dia dá mais de meio ano de caderno, e o
    // localStorage do aparelho mais simples continua dando conta.
    setCaderno(g => [...g, { d: hoje, t: texto || "", c: carimbos || [], p: principio, s: sobre || "" }].slice(-200));
    setStats(x => ({ ...x, registros: (x.registros || 0) + 1 }));
    registrarSemana({ registros: 1, lumicoins: premio });
    setToast(premio ? `📔 +${premio} 🪙` : "📔 💾");
    setRascunho(null);
    setScreen("caderno");
  }

  /* Sorteia a pergunta uma vez e guarda: se ficasse no render da tela, ela
     trocaria a cada tecla digitada. */
  function abrirCaderno({ principio, pergunta }, sobre, volta) {
    setRascunho({ principio, pergunta, sobre, volta: volta || screen });
    setScreen("escrever");
  }

  /* Puxar a tela para baixo recarrega a página no Chrome Android — e no meio
     de uma partida isso perde a rodada e as moedas. Nos menus continua valendo. */
  const EM_PARTIDA = ["game", "mem", "color"];
  useEffect(() => {
    const jogando = EM_PARTIDA.includes(screen);
    const el = document.documentElement;
    el.style.overscrollBehaviorY = jogando ? "none" : "auto";
    document.body.style.overscrollBehaviorY = jogando ? "none" : "auto";
    const avisar = e => { e.preventDefault(); e.returnValue = ""; };
    if (jogando) window.addEventListener("beforeunload", avisar);
    return () => {
      window.removeEventListener("beforeunload", avisar);
      el.style.overscrollBehaviorY = "auto";
      document.body.style.overscrollBehaviorY = "auto";
    };
  }, [screen]);

  /* O tempo libera o resgate; o contador só reinicia quando se resgata.
     Assim ninguém perde moedas por ficar dias sem abrir o app. */
  const podeResgatar = now - lastRefill >= ECON.refillMs;
  function resgatar() {
    if (!podeResgatar) return;
    setCoins(c => c + ECON.refillAmount);
    setLastRefill(Date.now());
    setStats(x => ({ ...x, earned: x.earned + ECON.refillAmount, maxCoins: Math.max(x.maxCoins, coins + ECON.refillAmount) }));
    setToast(`🎁 +${ECON.refillAmount} 🪙`);
  }

  function abrir(tela, origem) { setVoltaPara(origem); setScreen(tela); }

  function dispensarInstallTip() {
    setInstallTip(false);
    try { window.storage.set("lumus:installTip", "1"); } catch { }
  }

  async function openProfile(pr) {
    try {
      const r = await window.storage.get(`lumus:p:${pr.id}`);
      applySave(r?.value ? JSON.parse(r.value) : blankSave(), pr);
    } catch { applySave(blankSave(), pr); }
    setActiveId(pr.id);
    // Responsável não joga: entra direto no acompanhamento dos filhos.
    if (pr.papel === "pai") { carregarFamilia(pr.id); setScreen("familia"); }
    else setScreen("home");
  }

  /* Presenteia um filho com parte da mesada da semana.
     Escrevo direto no save da criança porque ela não está logada — é o mesmo
     aparelho e o mesmo armazenamento, só que outro arquivo. Recarrego a lista
     depois para o número na tela ser o que está gravado, não um palpite. */
  /* Lê o save de outro perfil. window.storage.get lança quando a chave não
     existe, e um perfil recém-criado ainda não tem save nenhum — sem isto,
     escrever no save do irmão falha calado justamente na primeira vez. */
  async function lerSave(id) {
    try {
      const r = await window.storage.get(`lumus:p:${id}`);
      if (r?.value) return JSON.parse(r.value);
    } catch { }
    return blankSave();
  }

  async function presentear(pr, quanto) {
    const sem = semanaAtual();
    const cofre = presente.semana === sem ? presente : { semana: sem, restante: ECON.presenteSemanal };
    const valor = Math.min(quanto, cofre.restante);
    if (valor <= 0) return;
    try {
      const d = await lerSave(pr.id);
      d.coins = Math.min(ECON.cap, (d.coins || 0) + valor);
      // O presente entra no cofre, mas não conta como ganho no jogo: quem
      // ganhou lumicoins jogando é outra história, e as conquistas sabem.
      d.stats = { ...d.stats, maxCoins: Math.max(d.stats?.maxCoins || 0, d.coins) };
      // Um recado esperando a criança abrir o perfil dela. Se o responsável
      // der duas vezes antes disso, soma: ela vê um bônus só, com o total.
      d.presenteRecebido = {
        valor: (d.presenteRecebido?.valor || 0) + valor,
        de: player.name || t.roleParent,
      };
      window.storage.set(`lumus:p:${pr.id}`, JSON.stringify(d));
    } catch { return; }
    setPresente({ semana: sem, restante: cofre.restante - valor });
    setToast(`🎁 ${pr.name} +${valor} 🪙`);
    carregarFamilia(activeId);
  }

  /* Perfil com senha só é aberto, editado, zerado ou apagado depois dela.
     Se a tranca valesse só para entrar, a criança apagaria o perfil do pai. */
  const [pedirPin, setPedirPin] = useState(null);   // { pr, acao }
  const [pinErrado, setPinErrado] = useState(false);

  function comSenha(pr, acao) {
    if (pr.pin) { setPinErrado(false); setPedirPin({ pr, acao }); return; }
    acao(pr);
  }

  async function conferirPin(digitado) {
    const { pr, acao } = pedirPin;
    if (await resumoSenha(digitado, pr.id) !== pr.pin) { setPinErrado(true); return; }
    setPedirPin(null); setPinErrado(false);
    acao(pr);
  }

  /* Editar um jogador que já existe.
     A ficha (nome, avatar, papel, idade, leitura) mora em "lumus:profiles";
     o progresso mora em "lumus:p:<id>", outro arquivo. Editar a ficha não
     encosta no progresso — e mesmo assim carrego o save antes de abrir a
     tela, para que o "Pronto" grave de volta exatamente o que estava lá. */
  async function editProfile(pr) {
    try {
      const r = await window.storage.get(`lumus:p:${pr.id}`);
      applySave(r?.value ? JSON.parse(r.value) : blankSave(), pr);
    } catch { applySave(blankSave(), pr); }
    setActiveId(pr.id);
    setEditando(true);
    setScreen("create");
  }

  function newProfile() {
    setEditando(false);
    const d = blankSave();
    setActiveId(`p${Date.now()}`);
    applySave(d, {
      name: "", papel: "filho", idade: null, leitor: null, pin: null,
      avatar: { skin: SKINS[1], hair: HAIRS[0], hairStyle: "short", cap: null, glasses: null, shirt: SHIRTS[0], shirtPattern: null },
    });
    setScreen("create");
  }

  /* ----- acompanhamento dos filhos -----
     O responsável lê o save de cada criança do próprio aparelho. Nada sai
     daqui: é o mesmo localStorage, só que aberto por outra tela. */
  const [familia, setFamilia] = useState([]);
  async function carregarFamilia(eu = activeId) {
    const filhos = [];
    for (const pr of profiles) {
      if (pr.papel === "pai" || pr.id === eu) continue;
      try {
        const r = await window.storage.get(`lumus:p:${pr.id}`);
        filhos.push({ perfil: pr, save: r?.value ? JSON.parse(r.value) : null });
      } catch { filhos.push({ perfil: pr, save: null }); }
    }
    setFamilia(filhos);
  }

  function resetProfile(id) {
    const zerado = blankSave();
    try { window.storage.set(`lumus:p:${id}`, JSON.stringify(zerado)); } catch { }
    if (id === activeId) {
      applySave(zerado, player);
      setToast("↺");
    }
  }

  function deleteProfile(id) {
    const next = profiles.filter(p => p.id !== id);
    setProfiles(next);
    try {
      window.storage.set("lumus:profiles", JSON.stringify(next));
      window.storage.delete(`lumus:p:${id}`);
    } catch { }
    if (id === activeId) { setActiveId(null); setScreen(next.length ? "profiles" : "create"); }
  }

  async function pickLang(code) {
    const ok = await loadLang(code);
    if (!ok) return false;
    setLang(code);
    try { if (!activeId) window.storage.set("lumus:lang", code); } catch { }  // padrão para novos jogadores
    return true;
  }

  /* grava o jogador ativo a cada mudança */
  useEffect(() => {
    if (!loaded || !activeId || screen === "create" || screen === "boot" || screen === "profiles") return;
    const d = { lang, coins, lastRefill, unlocked, progress, owned, stats, seenAch, stars, records, memBest, gallery, colorDay, gerados, jogosAbertos, secoes, presente, semanas, presenteRecebido, caderno, duplaDia };
    try { window.storage.set(`lumus:p:${activeId}`, JSON.stringify(d)); } catch { }
    setProfiles(ps => {
      const has = ps.some(p => p.id === activeId);
      const next = has
        ? ps.map(p => p.id === activeId
            ? { ...p, name: player.name, avatar: player.avatar, papel: player.papel, idade: player.idade, leitor: player.leitor, pin: player.pin }
            : p)
        : [...ps, { id: activeId, name: player.name, avatar: player.avatar, papel: player.papel, idade: player.idade, leitor: player.leitor, pin: player.pin }];
      try { window.storage.set("lumus:profiles", JSON.stringify(next)); } catch { }
      return next;
    });
  }, [loaded, activeId, screen, lang, coins, unlocked, progress, owned, stats, player, seenAch, stars, records, memBest, gallery, colorDay, gerados, jogosAbertos, secoes, presente, semanas, presenteRecebido, caderno, duplaDia]);

  /* ----- relógio + refill ----- */
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => { if (toast) { const x = setTimeout(() => setToast(null), 2200); return () => clearTimeout(x); } }, [toast]);

  /* ----- botão voltar do aparelho -----
     Sem isto, o "voltar" do Android fecha o app no meio da partida: como o
     jogo é uma tela só, o navegador não tem para onde voltar e sai.

     Guardo o caminho que a criança percorreu e devolvo um passo por vez. A
     casa é o chão: chegando na home, "voltar" não faz mais nada em vez de
     fechar. E a cada volta reponho uma entrada no histórico, senão o toque
     seguinte cai fora do app de novo. */
  const trilha = useRef(["home"]);
  const voltandoRef = useRef(false);

  useEffect(() => {
    if (screen === "boot") return;
    if (voltandoRef.current) { voltandoRef.current = false; return; }
    const t = trilha.current;
    if (t[t.length - 1] !== screen) t.push(screen);
    if (t.length > 50) t.shift();
  }, [screen]);

  useEffect(() => {
    try { window.history.pushState({ lumus: true }, ""); } catch { }
    const aoVoltar = () => {
      try { window.history.pushState({ lumus: true }, ""); } catch { }
      const t = trilha.current;
      if (t.length > 1) {
        t.pop();
        voltandoRef.current = true;
        setScreen(t[t.length - 1]);
      } else {
        // já está na primeira tela: fica onde está em vez de fechar
        voltandoRef.current = true;
        setScreen(t[0] || "home");
      }
    };
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, []);

  /* ----- conquistas -----
     Acendeu, paga. O prêmio vem do nível da conquista e entra uma vez só —
     seenAch é a garantia de que ninguém recebe duas vezes pela mesma. */
  useEffect(() => {
    const novas = ACHIEVEMENTS.filter(a => a.test(stats) && !seenAch.includes(a.id));
    if (!novas.length) return;
    const premio = novas.reduce((soma, a) => soma + premioDe(a), 0);
    const a = novas[0];
    setToast(`${a.icon} ${a[lang] || a.en}${premio ? ` · +${premio} 🪙` : ""}`);
    setSeenAch(s => [...s, ...novas.map(x => x.id)]);
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setStats(s2 => ({ ...s2, earned: s2.earned + premio }));
    }
  }, [stats]);

  /* ----- montar rodada ----- */
  // REGRA DE OURO: nunca sai do continente escolhido.
  // A dificuldade vem de QUAIS bandeiras daquele continente entram no sorteio:
  // as mais conhecidas primeiro, as raras nas fases finais.

  /* Fase já vencida com 3 estrelas é treino livre: cobrar de novo por algo
     que a criança já dominou só a empurra para longe de repetir. As outras
     continuam custando — é o que dá sentido às lumicoins. */
  function startRound(comDupla = null) {
    // Duelo é de graça, como a memória em dupla, e pelo mesmo motivo.
    const custo = comDupla ? 0 : custoDaFase(stars, sel.cont, sel.stage);
    if (coins < custo) { setToast(t.notEnough); return; }
    if (custo) setCoins(c => c - custo);
    const quiz = quizDe(sel.cont);
    const r = quiz ? quiz.montar(sel.stage, t, lang, sel.cont) : buildRound(sel.cont, sel.stage, lang);
    setRound(comDupla ? { ...r, duo: comDupla, pontos: [0, 0] } : r);
    setScreen("game");
  }

  /* Um duelo não mexe em fase, estrela nem recorde: as perguntas foram
     divididas entre dois, e metade de uma rodada não vence fase nenhuma. */
  async function fimDuelo(r) {
    const hoje = diaISO();
    const premio = duplaDia === hoje ? 0 : ECON.duplaReward;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setDuplaDia(hoje);
      registrarSemana({ lumicoins: premio });
    }
    setStats(x => ({ ...x, earned: x.earned + premio, duplas: (x.duplas || 0) + 1 }));
    registrarSemana({ duplas: 1 });
    if (r.duo?.id) {
      try {
        const d = await lerSave(r.duo.id);
        if (premio) {
          d.coins = Math.min(ECON.cap, (d.coins || 0) + premio);
          d.stats = { ...d.stats, earned: (d.stats?.earned || 0) + premio,
            maxCoins: Math.max(d.stats?.maxCoins || 0, d.coins) };
        }
        d.stats = { ...d.stats, duplas: (d.stats?.duplas || 0) + 1 };
        window.storage.set(`lumus:p:${r.duo.id}`, JSON.stringify(d));
      } catch { }
    }
    const [a, b] = r.pontos;
    setRound({ ...r, vencedor: a === b ? null : a > b ? 0 : 1, reward: premio });
    setScreen("result");
  }

  function finishRound(r) {
    if (r.duo) { fimDuelo(r); return; }
    const pct = Math.round((r.right / r.qs.length) * 100);
    // As estrelas contam ERROS, não porcentagem: numa rodada de 5 perguntas
    // a régua de porcentagem pula de 80% para 100% e as 2 estrelas somem.
    const erros = r.qs.length - r.right;
    const limite1 = r.qs.length >= 10 ? 3 : 2;   // erros ainda aceitos para 1 estrela
    const st = erros === 0 ? 3 : erros === 1 ? 2 : erros <= limite1 ? 1 : 0;
    let reward = ECON.reward[st] || 0;
    if (r.hintsUsed === 0 && st > 0) reward += 5;
    setCoins(c => Math.min(ECON.cap, c + reward));
    const today = new Date().toISOString().slice(0, 10);
    const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const clearedAll = st > 0 && r.stage === totalDe(r.cont);
    setStats(s => ({
      ...s,
      rounds: s.rounds + 1,
      perfect: s.perfect + (pct === 100 ? 1 : 0),
      streak: st > 0 ? s.streak + 1 : 0,
      bestStreak: Math.max(s.bestStreak, r.bestStreak || s.streak),
      earned: s.earned + reward,
      correct: s.correct + (quizDe(r.cont) ? 0 : r.right),
      bichoRight: (s.bichoRight || 0) + (r.cont === "bichos" ? r.right : 0),
      engRight: (s.engRight || 0) + (alvoDe(r.cont) ? r.right : 0),
      bibRight: (s.bibRight || 0) + (r.cont === "bible" ? r.right : 0),
      capRight: (s.capRight || 0) + (r.cont.startsWith("cap_") ? r.right : 0),
      curRight: (s.curRight || 0) + (r.cont === "curiosidades" ? r.right : 0),
      curStage: r.cont === "curiosidades" && st > 0 ? Math.max(s.curStage || 0, r.stage) : (s.curStage || 0),
      sciRight: (s.sciRight || 0) + (r.cont === "ciencias" ? r.right : 0),
      sciStage: r.cont === "ciencias" && st > 0 ? Math.max(s.sciStage || 0, r.stage) : (s.sciStage || 0),
      bibStage: r.cont === "bible" && st > 0 ? Math.max(s.bibStage || 0, r.stage) : (s.bibStage || 0),
      capBrDone: r.cont === "cap_br" && st > 0 ? Math.max(s.capBrDone || 0, r.stage) : (s.capBrDone || 0),
      mathRight: (s.mathRight || 0) + (r.cont === "math" ? r.right : 0),
      mathStage: r.cont === "math" && st > 0 ? Math.max(s.mathStage || 0, r.stage) : (s.mathStage || 0),
      noHintRounds: s.noHintRounds + (r.hintsUsed === 0 ? 1 : 0),
      geniusCleared: s.geniusCleared + (r.diff === "genius" && st > 0 ? 1 : 0),
      flash: s.flash + r.flash,
      islandRight: s.islandRight + r.islandRight,
      subRight: s.subRight + r.subRight,
      perfectNoHint: s.perfectNoHint + (pct === 100 && r.hintsUsed === 0 ? 1 : 0),
      lastStagePerfect: s.lastStagePerfect + (pct === 100 && r.stage === totalDe(r.cont) ? 1 : 0),
      contDone: s.contDone + (clearedAll ? 1 : 0),
      maxCoins: Math.max(s.maxCoins, Math.min(ECON.cap, coins + reward)),
      dayStreak: s.lastDay === today ? s.dayStreak : s.lastDay === yest ? s.dayStreak + 1 : 1,
      lastDay: today,
    }));
    registrarSemana({ rodadas: 1, certas: r.right, estrelas: st, lumicoins: reward });
    const seg = Math.round((Date.now() - (r.t0 || Date.now())) / 1000);
    if (st > 0) {
      setProgress(p => ({ ...p, [r.cont]: Math.max(p[r.cont] || 0, r.stage) }));
      setStars(x => {
        const antes = x[r.cont]?.[r.stage] || 0;
        setStats(s2 => ({ ...s2, stars: s2.stars + Math.max(0, st - antes) }));
        return { ...x, [r.cont]: { ...(x[r.cont] || {}), [r.stage]: Math.max(antes, st) } };
      });
      setRecords(x => {
        const antes = x[r.cont]?.[r.stage];
        return { ...x, [r.cont]: { ...(x[r.cont] || {}), [r.stage]: antes ? Math.min(antes, seg) : seg } };
      });
    }
    const recAntigo = records[r.cont]?.[r.stage];
    setRound({ ...r, done: true, pct, reward, st, seg, novoRecorde: st > 0 && (!recAntigo || seg < recAntigo) });
    setScreen("result");
  }

  function unlockContinent(id, cost) {
    if (coins < cost) { setToast(t.notEnough); return; }
    setCoins(c => c - cost);
    setUnlocked(u => [...u, id]);
    setStats(s => ({ ...s, continents: s.continents + 1 }));
    const r = ROUTE.find(x => x.id === id);
    setTravelFx(r.emoji);
    setTimeout(() => setTravelFx(null), 2600);
  }

  const nextRefill = ECON.refillMs - (now - lastRefill);

  /* ============================================================ */
  const styles = `
    .app{font-family:'Nunito',system-ui,-apple-system,sans-serif;}
    .display{font-family:'Baloo 2','Nunito',system-ui,sans-serif;letter-spacing:.4px;}
    .chunky{border:none;border-radius:20px;color:#fff;font-family:'Baloo 2',system-ui,sans-serif;
      font-weight:800;box-shadow:0 5px 0 rgba(0,0,0,.22);transition:transform .08s, box-shadow .08s;}
    .chunky:active:not(:disabled){transform:translateY(4px);box-shadow:0 1px 0 rgba(0,0,0,.22);}
    .card{border-radius:26px;background:#fff;box-shadow:0 6px 0 rgba(20,25,60,.13);}
    @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    .mundi-bob{animation:bob 2.2s ease-in-out infinite}
    @keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
    .pop{animation:pop .3s ease-out}
    @keyframes cross{0%{left:-18%;transform:scaleX(1)}100%{left:104%;transform:scaleX(1)}}
    .crossing{position:absolute;top:38%;font-size:56px;animation:cross 2.6s ease-in-out forwards}
    @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .shake{animation:shake .32s}
    /* Quem navega por teclado precisa ver onde está. :focus-visible não
       aparece para quem usa o dedo, então não atrapalha a criança. */
    :focus-visible{outline:3px solid #F9A826;outline-offset:3px;border-radius:6px}
    /* Sem isto, dois toques rápidos numa carta dão zoom em vez de virar. */
    button,.chunky{touch-action:manipulation}
    @media (prefers-reduced-motion: reduce){.mundi-bob,.pop,.crossing,.shake{animation:none!important}}

    /* No celular tudo é uma coluna de 460 — é o formato certo para o polegar.
       No desktop a mesma coluna vira uma folha larga e as listas ganham
       colunas em vez de esticar cada card até virar uma faixa. */
    .shell{max-width:460px;margin:0 auto;}
    .grid2{display:grid;gap:10px;grid-template-columns:1fr 1fr;}
    .grid3{display:grid;gap:9px;grid-template-columns:1fr 1fr 1fr;}
    .lista{display:grid;gap:10px;}
    /* Telas de jogar seguem estreitas de propósito: bandeira, cartas e desenho
       perto dos olhos, sem obrigar a criança a varrer 900px com a vista. */
    .narrow{max-width:520px;margin:0 auto;}
    @media (min-width:860px){
      .shell{max-width:920px;}
      .grid2{grid-template-columns:repeat(auto-fill,minmax(210px,1fr));}
      .grid3{grid-template-columns:repeat(auto-fill,minmax(155px,1fr));}
      .lista{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));}
    }
  `;

  if (!loaded) return <div style={{ padding: 40, textAlign: "center" }}>🌍</div>;

  return (
    <div className="app" style={{ background: "linear-gradient(175deg,#1B2A6B 0%,#3C4FC4 45%,#6A5AE0 100%)", minHeight: "100vh", padding: "14px 12px 28px" }}>
      <style>{styles}</style>
      <div className="shell">

        {toast && (
          <div className="pop" style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 60, background: "#fff", color: "#1B2A6B", padding: "12px 20px", borderRadius: 999, fontWeight: 800, boxShadow: "0 6px 20px rgba(0,0,0,.3)" }}>{toast}</div>
        )}
        {travelFx && (
          <div style={{ position: "fixed", inset: 0, zIndex: 55, pointerEvents: "none", overflow: "hidden" }}>
            <div className="crossing">{travelFx}</div>
          </div>
        )}

        {/* O bônus de mérito. Aparece assim que a criança entra no perfil,
            antes de qualquer outra coisa, e some depois de lida. */}
        {presenteRecebido && !["create", "boot", "profiles"].includes(screen) && (
          <Modal onClose={() => setPresenteRecebido(null)}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56 }}>🎁</div>
              <div className="display" style={{ fontSize: 24, color: "#1B2A6B", marginTop: 4 }}>{t.bonusTitle}</div>
              <div style={{ color: "#3B4468", fontWeight: 800, fontSize: 15, lineHeight: 1.7, margin: "10px 0" }}>
                {t.bonusFrom.replace("{quem}", presenteRecebido.de)}
              </div>
              <div className="display" style={{
                display: "inline-block", background: "#F9A826", color: "#5A3B00",
                borderRadius: 999, padding: "8px 22px", fontSize: 26, margin: "2px 0 10px",
              }}>
                🪙 +{presenteRecebido.valor}
              </div>
              <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                {t.bonusCheers}
              </div>
              <Btn full color="#00B894" onClick={() => setPresenteRecebido(null)}>🎉 {t.bonusOk}</Btn>
            </div>
          </Modal>
        )}

        {pedirPin && (
          <PinModal t={t} erro={pinErrado} titulo={pedirPin.pr.name || t.roleParent}
            onOk={conferirPin} onCancelar={() => { setPedirPin(null); setPinErrado(false); }} />
        )}

        {installTip && (
          <Modal onClose={dispensarInstallTip}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44 }}>📲</div>
              <div className="display" style={{ fontSize: 22, color: "#1B2A6B", marginTop: 4 }}>{t.installTitle}</div>
              <div style={{ color: "#3B4468", fontWeight: 700, fontSize: 15, lineHeight: 1.7, margin: "12px 0" }}>
                {ehIOS() ? t.installIOS : t.installAndroid}
              </div>
              <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 12, marginBottom: 14 }}>{t.installWhy}</div>
              <Btn full color="#00B894" onClick={dispensarInstallTip}>{t.gotIt}</Btn>
              <button onClick={dispensarInstallTip}
                style={{ background: "none", border: "none", color: "#8B93AD", fontWeight: 800, fontSize: 13, marginTop: 10, cursor: "pointer" }}>
                {t.installLater}
              </button>
            </div>
          </Modal>
        )}

        {!["boot", "create", "profiles"].includes(screen) && <Marca />}

        {screen === "create" && <Create {...{ t, lang, onLang: () => setScreen("lang"), player, setPlayer,
          editando, perfilId: activeId,
          onDone: () => {
            // Perfil novo: troca a base do que nasce aberto, agora que se sabe
            // se a criança lê. Perfil que já jogou: só ACRESCENTA. Editar a
            // ficha de quem já está no meio do caminho não pode tirar da mão
            // dela um jogo que ela já estava jogando.
            const gratis = jogosGratisPara(ehLeitor(player));
            setJogosAbertos(js => stats.rounds === 0 && !editando
              ? [...new Set([...gratis, ...js.filter(id => !JOGOS_GRATIS.includes(id))])]
              : [...new Set([...gratis, ...js])]);
            setEditando(false);
            if (player.papel === "pai") { carregarFamilia(activeId); setScreen("familia"); }
            else setScreen("home");
          } }} />}
        {screen === "profiles" && <Profiles {...{ t, profiles, openProfile, newProfile, editProfile, deleteProfile, resetProfile, setScreen, comSenha }} />}
        {screen === "gallery" && <Gallery {...{ t, gallery, setScreen, gerados, gerarMais, coins,
          abrirDesenho: (art, fills) => { setPintando({ art, fills }); setScreen("color"); } }} />}
        {screen === "color" && pintando && <Coloring {...{ t, art: pintando.art, fillsIniciais: pintando.fills,
          onSalvar: salvarDesenho, onSair: () => { setPintando(null); setScreen("gallery"); },
          ganhouHoje: colorDay.dia === new Date().toISOString().slice(0, 10) ? colorDay.moedas : 0 }} />}
        {screen === "capMap" && <CapMap {...{ t, lang, progress, coins, setSel, setScreen, temSecao, comprarSecao }} />}
        {screen === "langGame" && <LangGame {...{ t, lang, setScreen,
          escolher: alvo => {
            if (destinoIdioma === "mem") { setMemTema(`idiomas_${alvo}`); setScreen("memLevels"); return; }
            const k = `idiomas_${alvo}`;
            setSel({ cont: k, stage: Math.min(totalDe(k), (progress[k] || 0) + 1) });
            setScreen("stages");
          } }} />}
        {screen === "memLevels" && <MemLevels {...{ t, coins, memBest, setScreen, comecar: comecarMemoria, tema: memTema, temSecao, comprarSecao,
          titulo: alvoDe(memTema) ? `${t.games.wordMem} · ${LANG_CATALOG[alvoDe(memTema)]}`
            : { flags: t.games.memory, animals: t.games.animals, arts: t.games.artMem, bible: t.games.bibleMem }[memTema],
          icone: alvoDe(memTema) ? "🃏" : { flags: "🧠", animals: "🐾", arts: "🧩", bible: "🕊️" }[memTema],
          dupla, pedirDupla: () => setEscolhendoDupla(true), sairDaDupla: () => setDupla(null) }} />}
        {escolhendoDupla && (
          <EscolherDupla {...{ t, perfis: profiles.filter(pr => pr.id !== activeId),
            escolher: pr => { setDupla({ id: pr.id, name: pr.name, avatar: pr.avatar }); setEscolhendoDupla(false); },
            fechar: () => setEscolhendoDupla(false) }} />
        )}
        {screen === "mem" && mem && <MemoryGame {...{ t, lang, nivel: mem.nivel, cartas: mem.cartas,
          duo: mem.duo, eu: { name: player.name, avatar: player.avatar },
          onFinish: fimMemoria, onQuit: () => setScreen("memLevels") }} />}
        {screen === "memResult" && mem?.duo && (
          <PlacarDupla {...{ t, eu: { name: player.name, avatar: player.avatar }, outro: mem.duo,
            pontos: mem.pontos, vencedor: mem.vencedor, reward: mem.reward,
            rodape: `⏱️ ${tempoFmt(mem.seg)} · ${t.moves}: ${mem.jogadas}`,
            aoRepetir: () => comecarMemoria(mem.nivel, mem.tema, mem.duo),
            aoSair: () => setScreen("memLevels") }} />
        )}
        {screen === "memResult" && mem && !mem.duo && (
          <div style={{ paddingTop: 20 }}>
            <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
              <div style={{ fontSize: 54 }}>{mem.st === 3 ? "🏆" : mem.st ? "🎉" : "💪"}</div>
              <div className="display" style={{ fontSize: 26, color: "#1B2A6B" }}>{t.roundOver}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 4, margin: "10px 0 6px" }}>
                {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 34, opacity: mem.st >= i ? 1 : .2 }}>⭐</span>)}
              </div>
              <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>
                ⏱️ {tempoFmt(mem.seg)} · {t.moves}: {mem.jogadas}{mem.recorde ? ` · 🏆 ${t.newRecord}` : ""}
              </div>
              <div className="display" style={{ fontSize: 22, color: "#F9A826", marginBottom: 16 }}>🪙 {mem.reward}</div>
              <div style={{ display: "grid", gap: 9 }}>
                <Btn full color="#4C6FFF" onClick={() => comecarMemoria(mem.nivel, mem.tema)} disabled={coins < custoDaMemoria(memBest, mem.tema, mem.nivel)}>{t.again}</Btn>
                <Btn full color="#8B93AD" onClick={() => setScreen("memLevels")} rotulo={t.a11yBack}>←</Btn>
              </div>
            </div>
          </div>
        )}
        {screen === "familia" && <FamilyScreen {...{ t, lang, familia, setScreen, presente, presentear, momento, setMomento, momentoFeitoHoje }} />}
        {screen === "caderno" && <CadernoScreen {...{ t, lang, caderno, setScreen, voltar: voltaPara,
          novo: () => { abrirCaderno(perguntaDoRegistro(sementeDoTexto(diaISO())), ""); } }} />}
        {screen === "escrever" && rascunho && <EscreverScreen {...{ t, lang, rascunho,
          salvar: salvarRegistro, cancelar: () => { setRascunho(null); setScreen(rascunho.volta || "caderno"); } }} />}
        {screen === "devocional" && <DevocionalScreen {...{ t, lang, momento, marcarMomento, feitoHoje: momentoFeitoHoje, setScreen,
          voltar: player.papel === "pai" ? "familia" : "home" }} />}
        {screen === "player" && <PlayerCard {...{ t, lang, player, coins, stats, progress, unlocked, seenAch, setScreen, abrir, podeResgatar, resgatar }} />}
        {screen === "lang" && <LangScreen {...{ t, lang, pickLang, setScreen, back: activeId ? "home" : "profiles" }} />}
        {screen === "home" && <Home {...{ t, lang, player, coins, nextRefill, setScreen, profiles, abrir, podeResgatar, resgatar, jogosAbertos, abrirJogo,
          momento, setMomento, momentoFeitoHoje,
          onPickGame: (g) => {
            const memTemas = { memory: "flags", animals: "animals", artMem: "arts", bibleMem: "bible" };
            const quizzes = { count: "math", animalQuiz: "bichos", colors: "arts", bible: "bible",
              curiosidades: "curiosidades", sciAnimals: "ciencias" };
            if (g === "capitals") { setScreen("capMap"); return; }
            if (g === "words" || g === "wordMem") { setDestinoIdioma(g === "wordMem" ? "mem" : "quiz"); setScreen("langGame"); return; }
            if (g === "color") { if (!gerados.length) gerarMais(false); setScreen("gallery"); return; }
            if (memTemas[g]) { setMemTema(memTemas[g]); setScreen("memLevels"); return; }
            if (quizzes[g]) {
              const k = quizzes[g];
              setSel({ cont: k, stage: Math.min(totalDe(k), (progress[k] || 0) + 1) });
              setScreen("stages"); return;
            }
            setScreen("map"); if (!stats.rounds) setTutorial(true);
          } }} />}
        {screen === "map" && <MapScreen {...{ t, lang, player, coins, nextRefill, unlocked, progress, unlockContinent, setSel, setScreen, stats, tutorial, setTutorial }} />}
        {screen === "stages" && <Stages {...{ t, lang, sel, setSel, progress, coins, startRound, setScreen, player, stars, records, temSecao, comprarSecao,
          dupla, pedirDupla: () => setEscolhendoDupla(true), sairDaDupla: () => setDupla(null) }} />}
        {screen === "game" && round && <Game {...{ t, lang, round, setRound, coins, setCoins, finishRound, player, setScreen,
          onQuit: () => { setRound(null); setScreen("stages"); } }} />}
        {screen === "result" && round?.duo && (
          <PlacarDupla {...{ t, eu: { name: player.name, avatar: player.avatar }, outro: round.duo,
            pontos: round.pontos, vencedor: round.vencedor, reward: round.reward,
            rodape: `${nomeDaTrilha(round.cont, t)} · ${t.stage} ${round.stage}`,
            aoRepetir: () => startRound(round.duo),
            aoSair: () => setScreen("stages") }} />
        )}
        {screen === "result" && round && !round.duo && <Result {...{ t, round, player, setScreen, setSel, sel, startRound, coins,
          escrever: () => abrirCaderno(perguntaDoRegistro(sementeDoTexto(round.cont) + round.stage),
            `${nomeDaTrilha(round.cont, t)} · ${t.stage} ${round.stage}`, "result") }} />}
        {screen === "shop" && <Shop {...{ t, lang, coins, setCoins, owned, setOwned, player, setPlayer, setScreen, voltaPara }} />}
        {screen === "awards" && <Awards {...{ t, lang, stats, seenAch, setScreen, player, voltaPara }} />}
      </div>
    </div>
  );
}

export default function App() {
  return <Guarda><AppInterno /></Guarda>;
}

/* ---------- Criação do avatar ----------
   Aqui só o básico e de graça. Chapéu, óculos e estampa vêm da loja,
   para a criança ter o que conquistar com as moedas. */
function Create({ t, lang, onLang, player, setPlayer, onDone, editando = false, perfilId }) {
  const a = player.avatar;
  const set = (k, v) => setPlayer(p => ({ ...p, avatar: { ...p.avatar, [k]: v } }));
  const campo = (k, v) => setPlayer(p => ({ ...p, [k]: v }));
  const [pinNovo, setPinNovo] = useState("");
  const Swatches = ({ label, items, k }) => (
    <div style={{ marginBottom: 14 }}>
      <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((v, i) => (
          <button key={i} onClick={() => set(k, v)} style={{
            width: 40, height: 40, borderRadius: 14,
            border: a[k] === v ? "4px solid #1B2A6B" : "3px solid #E4E8F5",
            background: v, cursor: "pointer",
          }} />
        ))}
      </div>
    </div>
  );
  return (
    <div className="narrow">
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div className="display" style={{ color: "#fff", fontSize: 44, lineHeight: 1 }}>LUMUS</div>
        <div style={{ color: "#C9D2FF", fontWeight: 700, fontSize: 14 }}>{t.tagline}</div>
        <button onClick={onLang} className="chunky" style={{ marginTop: 10, padding: "7px 16px", fontSize: 13, background: "rgba(255,255,255,.22)" }}>
          🌐 {LANG_CATALOG[lang] || lang}
        </button>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ background: "#EEF1FF", borderRadius: 24, padding: 6 }}><Avatar a={a} size={92} /></div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 20 }}>{t.createAvatar}</div>
            <input value={player.name} onChange={e => setPlayer(p => ({ ...p, name: e.target.value }))}
              placeholder={t.name} maxLength={12}
              style={{ marginTop: 8, width: "100%", padding: "10px 12px", borderRadius: 14, border: "3px solid #E4E8F5", fontWeight: 800, fontSize: 16, outline: "none" }} />
          </div>
        </div>

        {/* Três perguntas antes da aparência. Elas decidem o que a criança
            encontra aberto no hub: quem ainda não lê começa pelos jogos que
            se joga olhando, e não por uma tela de texto que ela não entende. */}
        <div style={{ marginBottom: 14 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.whoIsIt}</div>
          {editando && (
            <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
              🔒 {t.keepsProgress}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            {[["filho", "🧒", t.roleChild], ["pai", "🧑‍🏫", t.roleParent]].map(([v, ic, rot]) => (
              <button key={v} onClick={() => campo("papel", v)} className="chunky"
                style={{ flex: 1, padding: "10px 6px", fontSize: 13,
                  background: player.papel === v ? "#4C6FFF" : "#E4E8F5",
                  color: player.papel === v ? "#fff" : "#6C7695" }}>
                {ic} {rot}
              </button>
            ))}
          </div>
        </div>

        {player.papel === "pai" && (
          <div style={{ marginBottom: 14 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 4 }}>🔒 {t.pinTitle}</div>
            <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
              {t.pinWhy}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={pinNovo} onChange={e => setPinNovo(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric" placeholder="0000" aria-label={t.pinTitle}
                style={{ width: 100, padding: "10px 12px", borderRadius: 14, border: "3px solid #E4E8F5",
                  fontWeight: 900, fontSize: 20, letterSpacing: 6, textAlign: "center", outline: "none" }} />
              <div style={{ flex: 1, color: player.pin ? "#00B894" : "#8B93AD", fontWeight: 800, fontSize: 12 }}>
                {player.pin ? `✅ ${t.pinSet}` : t.pinNone}
              </div>
              {player.pin && (
                <Btn small color="#8B93AD" onClick={() => { setPinNovo(""); setPlayer(p => ({ ...p, pin: null })); }}>
                  {t.pinRemove}
                </Btn>
              )}
            </div>
          </div>
        )}

        {player.papel !== "pai" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.howOld}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {[3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                  <button key={i} onClick={() => campo("idade", i)} className="chunky"
                    style={{ width: 40, padding: "9px 0", fontSize: 14,
                      background: player.idade === i ? "#00B894" : "#E4E8F5",
                      color: player.idade === i ? "#fff" : "#6C7695" }}>{i}</button>
                ))}
                <input
                  value={player.idade > 10 ? String(player.idade) : ""}
                  onChange={e => {
                    const n = parseInt(e.target.value.replace(/D/g, "").slice(0, 3), 10);
                    campo("idade", Number.isFinite(n) && n > 10 ? Math.min(n, 120) : null);
                  }}
                  inputMode="numeric" placeholder={t.ageMore} aria-label={t.ageAny}
                  style={{
                    width: 62, padding: "9px 6px", borderRadius: 20, textAlign: "center",
                    fontWeight: 900, fontSize: 14, outline: "none",
                    border: player.idade > 10 ? "3px solid #00B894" : "3px solid #E4E8F5",
                    background: player.idade > 10 ? "#00B894" : "#E4E8F5",
                    color: player.idade > 10 ? "#fff" : "#6C7695",
                  }} />
              </div>
              <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, marginTop: 5 }}>{t.ageAny}</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.canRead}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[[false, "🙂", t.readNo], [true, "📖", t.readYes]].map(([v, ic, rot]) => (
                  <button key={String(v)} onClick={() => campo("leitor", v)} className="chunky"
                    style={{ flex: 1, padding: "10px 6px", fontSize: 13,
                      background: player.leitor === v ? "#6A5AE0" : "#E4E8F5",
                      color: player.leitor === v ? "#fff" : "#6C7695" }}>
                    {ic} {rot}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <Swatches label={t.skin} items={SKINS} k="skin" />
        <Swatches label={t.hair} items={HAIRS} k="hair" />

        <div style={{ marginBottom: 14 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.slots.hairStyle}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["short", "buzz", "long", null].map((v, i) => (
              <button key={i} onClick={() => set("hairStyle", v)} style={{
                width: 56, height: 56, borderRadius: 16, padding: 0, overflow: "hidden",
                border: a.hairStyle === v ? "4px solid #1B2A6B" : "3px solid #E4E8F5",
                background: "#EEF1FF", cursor: "pointer", display: "grid", placeItems: "center",
              }}><Avatar a={{ ...a, hairStyle: v, cap: null, glasses: null }} size={50} /></button>
            ))}
          </div>
        </div>

        <Swatches label={t.shirt} items={SHIRTS} k="shirt" />

        <div style={{ color: "#6C7695", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>🛍️ {t.shopHint}</div>
        <Btn full color="#00B894" disabled={!player.name.trim()}
          onClick={async () => {
            if (player.papel === "pai" && pinNovo.length === 4) {
              setPlayer(p => ({ ...p, pin: null }));            // limpa antes de gravar o novo
              const resumo = await resumoSenha(pinNovo, perfilId);
              setPlayer(p => ({ ...p, pin: resumo }));
            }
            onDone();
          }}>{t.ready} 🎉</Btn>
      </div>
    </div>
  );
}

/* ---------- Topo com moedas ---------- */
function TopBar({ t, player, coins, nextRefill, right, onAvatar, onSwitch, quantos, podeResgatar, resgatar }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <button onClick={onAvatar} aria-label={t.profileTitle}
        style={{ background: "rgba(255,255,255,.16)", borderRadius: 20, padding: 4, border: "none", cursor: onAvatar ? "pointer" : "default" }}>
        <Avatar a={player.avatar} size={44} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="display" style={{ color: "#fff", fontSize: 17, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</div>
        {nextRefill != null && !podeResgatar && <div style={{ color: "#B9C6FF", fontSize: 11, fontWeight: 700 }}>{t.nextCoins} {fmt(nextRefill)}</div>}
        {podeResgatar && <div style={{ color: "#9BF3D6", fontSize: 11, fontWeight: 800 }}>🎁 {t.claimReady}</div>}
      </div>
      {onSwitch && (
        <button onClick={onSwitch} aria-label={t.switchPlayer} className="chunky"
          style={{ background: "rgba(255,255,255,.18)", padding: "9px 11px", fontSize: 16, position: "relative" }}>
          👥
          {quantos > 1 && (
            <span style={{
              position: "absolute", top: -5, right: -5, background: "#E84393", color: "#fff",
              borderRadius: 999, fontSize: 10, fontWeight: 900, padding: "1px 5px",
            }}>{quantos}</span>
          )}
        </button>
      )}
      <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "8px 12px", fontWeight: 900, fontSize: 16 }}><Coin n={coins} /></div>
      {podeResgatar && <Btn small color="#00B894" onClick={resgatar}>🎁</Btn>}
      {right}
    </div>
  );
}

/* Animais em emoji: nada para baixar, nada de licença, e o desenho já
   vem pronto em qualquer aparelho. Serve à memória e, depois, ao quiz. */
const BIBLIA_EMOJI = ["🕊️","✝️","📖","🐑","🌈","🐟","🍞","🔥","⭐","⛵","🌿","🦁","👑","🎺","🕯️","⛰️",
  "🍇","🫒","🏺","🧺","🐫","🌾"];

const ANIMAIS = [
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
  "🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉",
  "🦇","🐺","🐗","🐴","🦄","🐝","🦋","🐌","🐞","🐢",
  "🐍","🦎","🦖","🐙","🦑","🦀","🐠","🐟","🐬","🐳",
  "🦈","🐊","🐘","🦏","🦒","🦓","🐪","🦩","🦜","🦔",
];

/* ---------- Rodada de bandeiras ----------
   Fora do componente de propósito: assim scripts/check-rodadas.mjs consegue
   montar uma rodada de cada continente e faixa antes de todo build. A função
   que ninguém conseguia testar foi justamente a que quebrou no Lenda.

   REGRA DE OURO: nunca sai do continente escolhido. A dificuldade vem de
   QUAIS bandeiras daquele continente entram no sorteio — as mais conhecidas
   primeiro, as raras nas faixas de cima. */
const FAIXA_POOL = {
  easy:   [0,   .55],
  medium: [0,   .8],
  hard:   [.25, 1],
  genius: [.45, 1],
  mestre: [.6,  1],
  lenda:  [.7,  1],   // só as mais raras do continente
};

function poolFor(cont, diff, minimo = 10) {
  const ranked = Object.entries(DATA[cont])
    .sort((a, b) => (a[1] - b[1]) || (Math.random() - .5))
    .map(([c]) => c);
  const n = ranked.length;
  const [de, ate] = FAIXA_POOL[diff] || FAIXA_POOL.genius;
  let inicio = Math.floor(n * de);
  const fim = Math.ceil(n * ate);
  // A faixa pode não juntar bandeiras suficientes para a rodada — a Oceania
  // tem 14 países no total. Nesse caso desce para as vizinhas mais fáceis,
  // uma a uma, até caber. Nunca sai do continente: essa é a regra de ouro.
  while (fim - inicio < minimo && inicio > 0) inicio--;
  return ranked.slice(inicio, fim);
}

function buildRound(cont, stage, lang, t = T[lang] || T.pt) {
  const diff = bandFor(cont, stage);
  const pool = poolFor(cont, diff, qtdPerguntas(diff));
  const wide = Object.keys(DATA[cont]); // distratores também só do continente
  const subs = (SUBFLAGS[cont] || []);
  const subDeck = shuffle(subs);
  let subAt = 0;
  // Gênio (13-15): metade da rodada vira estado/região.
  // Difícil (10-12): só a última pergunta, como aperitivo.
  const subSlots = new Set();
  if (subs.length) {
    if (diff === "genius") [1, 3, 5, 7, 9].forEach(n => subSlots.add(n));  // 5 de 10
    else if (diff === "hard" && stage >= 12) subSlots.add(9);
  }
  // Rodadas curtas para os pequenos, longas para quem já pegou o jeito
  const qCount = qtdPerguntas(diff);
  const deck = shuffle(pool).slice(0, qCount); // bandeiras SEMPRE diferentes
  const qs = [];
  let deckAt = 0;
  for (let i = 0; i < qCount; i++) {
    const useSub = subSlots.has(i) && subAt < subDeck.length;
    if (useSub) {
      const s = subDeck[subAt++];
      const others = shuffle(subs.filter(x => x.code !== s.code)).slice(0, 3);
      qs.push({
        flag: s.code, answer: s[lang], sub: true,
        porque: t.porq.regiao.replace("{reg}", s[lang]).replace("{pais}", countryName(s.code.slice(0, 2).toUpperCase(), lang)),
        options: shuffle([s[lang], ...others.map(o => o[lang])]).slice(0, 4),
      });
    } else {
      // Um índice próprio para o baralho: com as fases de estado ocupando
      // posições, usar o mesmo i desperdiçava bandeiras boas.
      const code = deck[deckAt++];
      // Acabaram as bandeiras diferentes do continente: a rodada termina
      // aqui. Melhor uma rodada mais curta do que repetir bandeira — ou,
      // como acontecia, montar pergunta sem bandeira nenhuma.
      if (!code) break;
      const ans = countryName(code, lang);
      const distr = shuffle(wide).filter(c => c !== code && countryName(c, lang) !== ans).slice(0, 3);
      qs.push({
        flag: code, answer: ans,
        porque: t.porq.bandeira.replace("{pais}", ans)
          .replace("{cont}", t.continents[cont]).replace("{cap}", capNome(code, lang) || "—"),
        options: shuffle([ans, ...distr.map(c => countryName(c, lang))]),
      });
    }
  }
  // Modo Fácil: sem cronômetro. Depois o tempo cai a cada fase.
  const time = tempoDe(cont, stage);
  return { cont, diff, stage, qs, time, t0: Date.now(), i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* O 2º R da Abordagem Educacional por Princípios: Raciocinar.
   Quando a criança erra, ela precisa saber POR QUE a outra estava certa —
   senão a rodada ensina só que ela errou.

   Onde há fato a acrescentar (o continente e a capital do país, o livro em
   que a história está), a rodada já traz esse fato pronto em "porque". Onde
   não há, a própria pergunta com a resposta ao lado já é a frase verdadeira
   que faltava: "Qual destes voa? 🦅". */
function explicacaoDe(q) {
  if (!q) return "";
  if (q.porque) return q.porque;
  const enunciado = [q.prompt, q.ask].filter(Boolean).join(" ");
  return enunciado ? `${enunciado} ${q.answer}` : String(q.answer ?? "");
}

/* ---------- Jogo da memória ----------
   Mesmas quatro dificuldades do jogo de bandeiras, mas aqui a estrela
   vem do relógio: saber não basta, tem que lembrar rápido. */
const MEM_LEVELS = {
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
function semanaAtual(quando = new Date()) {
  const d = new Date(quando);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());          // volta para o domingo
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* Domingo e sábado daquela semana, para escrever "31/08 a 06/09". */
function intervaloDaSemana(chave, lang) {
  const [a, m, d] = chave.split("-").map(Number);
  const ini = new Date(a, m - 1, d), fim = new Date(a, m - 1, d + 6);
  const fmt = x => x.toLocaleDateString(lang, { day: "2-digit", month: "2-digit" });
  return `${fmt(ini)} – ${fmt(fim)}`;
}

/* Quantas semanas de histórico ficam guardadas por criança. Três meses é o
   que um adulto olha para trás; mais que isso é entulho no aparelho. */
const SEMANAS_GUARDADAS = 12;
/* Dia local em "AAAA-MM-DD". toISOString não serve: em UTC-3 ele já vira o dia
   seguinte às 21h, e o devocional feito à noite contaria como o de amanhã. */
const diaISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* A mesma cor de cada princípio em devocional.js. Está repetida aqui porque é
   estilo de tela, não dado: o caderno não deveria carregar 49 devocionais só
   para saber pintar uma borda. */
const CORES_PRINCIPIO = {
  soberania: "#6A5AE0", individualidade: "#00B894", autogoverno: "#4C6FFF",
  carater: "#F9A826", alianca: "#E84393", semeadura: "#00C2CB", mordomia: "#8D6E3A",
};

/* "2026-09-02" → "2 de set." no idioma de quem lê. */
function diaCurto(iso, lang) {
  const [a, m, d] = String(iso || "").split("-").map(Number);
  if (!a) return iso || "";
  try { return new Date(a, m - 1, d).toLocaleDateString(lang, { day: "numeric", month: "short" }); }
  catch { return iso; }
}

const SEMANA_VAZIA = { rodadas: 0, certas: 0, estrelas: 0, desenhos: 0, memorias: 0, momentos: 0, registros: 0, duplas: 0, lumicoins: 0 };

/* Quanto custa jogar uma fase.
   Sobe de 5 em 5 com a dificuldade: quanto mais alto o degrau, mais a rodada
   vale — e mais pesa errar. Zero quando a fase já foi vencida com as três
   estrelas: cobrar de novo por algo que a criança já dominou só a empurra
   para longe de repetir. É o que dá sentido às lumicoins sem punir treino. */
const CUSTO_FAIXA = { easy: 5, medium: 10, hard: 15, genius: 20, mestre: 25, lenda: 30 };
const custoDaFase = (stars, cont, stage) =>
  (stars?.[cont]?.[stage] || 0) >= 3 ? 0 : CUSTO_FAIXA[bandFor(cont, stage)];
/* Na memória a "fase" é o próprio nível, e o recorde guarda as estrelas. */
const custoDaMemoria = (memBest, tema, nivel) =>
  (memBest?.[`${tema}:${nivel}`]?.stars || 0) >= 3 ? 0 : CUSTO_FAIXA[nivel];

const memEstrelas = (nivel, seg) => {
  const [um, dois, tres] = MEM_LEVELS[nivel].estrelas;
  return seg <= tres ? 3 : seg <= dois ? 2 : seg <= um ? 1 : 0;
};

function MemoryGame({ t, lang, nivel, cartas, onFinish, onQuit, duo, eu }) {
  const [viradas, setViradas] = useState([]);   // índices virados agora
  const [achadas, setAchadas] = useState([]);   // índices já casados
  const [jogadas, setJogadas] = useState(0);
  const [seg, setSeg] = useState(0);
  /* Em dupla: de quem é a vez (0 ou 1) e quantos pares cada um levou.
     Quem acerta continua — é a regra do jogo de mesa, e é ela que faz a
     criança querer prestar atenção na jogada do outro. */
  const [vez, setVez] = useState(0);
  const [pontos, setPontos] = useState([0, 0]);
  const travado = useRef(false);
  const cfg = MEM_LEVELS[nivel];
  const jogadores = duo ? [eu, duo] : null;

  useEffect(() => {
    const i = setInterval(() => setSeg(x => x + 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (achadas.length && achadas.length === cartas.length) {
      const id = setTimeout(() => onFinish({ seg, jogadas, pontos }), 600);
      return () => clearTimeout(id);
    }
  }, [achadas]);

  function tocar(i) {
    if (travado.current || viradas.includes(i) || achadas.includes(i)) return;
    const novas = [...viradas, i];
    setViradas(novas);
    if (novas.length === 2) {
      setJogadas(j => j + 1);
      travado.current = true;
      const [a, b] = novas;
      const igual = cartas[a].key === cartas[b].key && a !== b;
      setTimeout(() => {
        if (igual) {
          setAchadas(x => [...x, a, b]);
          if (duo) setPontos(p => { const q = [...p]; q[vez]++; return q; });
        } else if (duo) setVez(v => 1 - v);
        setViradas([]);
        travado.current = false;
      }, igual ? 420 : 850);
    }
  }

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onQuit} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{t.levels[nivel]}</div>
        <div style={{ background: "rgba(255,255,255,.18)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontWeight: 900 }}>
          ⏱️ {tempoFmt(seg)}
        </div>
      </div>

      {/* De quem é a vez, do tamanho que uma criança de cinco anos enxerga do
          outro lado da mesa. Sem isto o jogo em dupla vira discussão. */}
      {duo && (
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {jogadores.map((j, i) => (
            <div key={i} className="card" style={{
              flex: 1, padding: "5px 8px", display: "flex", alignItems: "center", gap: 7,
              opacity: vez === i ? 1 : .5,
              outline: vez === i ? "3px solid #F9A826" : "none",
            }}>
              <Rosto p={j} size={26} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#1B2A6B", fontWeight: 900, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {j?.name || "—"}
                </div>
                {vez === i && <div style={{ color: "#F9A826", fontWeight: 900, fontSize: 9 }}>{t.yourTurn}</div>}
              </div>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 18 }}>{pontos[i]}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cfg.cols},1fr)`, gap: 8 }}>
        {cartas.map((c, i) => {
          const aberta = viradas.includes(i) || achadas.includes(i);
          const casada = achadas.includes(i);
          return (
            <button key={i} onClick={() => tocar(i)} className="chunky"
              aria-label={aberta ? undefined : t.a11yCard}
              style={{
                aspectRatio: "1", borderRadius: 16, padding: 4, overflow: "hidden",
                background: casada ? "#00B894" : aberta ? "#fff" : "#6A5AE0",
                display: "grid", placeItems: "center", fontSize: 26,
                transition: "background .2s",
              }}>
              {!aberta ? "❓"
                : c.tipo === "flag"
                  ? <img src={flagUrl(c.face)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  : c.tipo === "word"
                    ? <span style={{ fontSize: "min(3.4vw,15px)", color: "#1B2A6B", fontWeight: 900, lineHeight: 1.1, wordBreak: "break-word" }}>{c.face}</span>
                    : <span style={{ fontSize: "min(9vw,40px)" }}>{c.face}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center", color: "#C9D2FF", fontWeight: 800, fontSize: 12, marginTop: 12 }}>
        {t.pairs}: {achadas.length / 2}/{cartas.length / 2}{duo ? "" : ` · ${t.moves}: ${jogadas}`}
      </div>
    </div>
  );
}

/* Convidado não tem perfil no aparelho, então não tem avatar. Um rosto neutro
   resolve, e ninguém precisa se cadastrar só para jogar uma partida. */
function Rosto({ p, size = 40 }) {
  if (p?.avatar) return <Avatar a={p.avatar} size={size} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#E9ECF7",
      display: "grid", placeItems: "center", fontSize: size * 0.55 }}>🙂</div>
  );
}

/* Com quem vou jogar: os outros perfis do aparelho, mais um convidado. */
function EscolherDupla({ t, perfis, escolher, fechar }) {
  return (
    <Modal onClose={fechar}>
      <div className="display" style={{ fontSize: 21, color: "#1B2A6B", textAlign: "center" }}>👥 {t.duoWho}</div>
      <div style={{ color: "#6C7695", fontWeight: 700, fontSize: 12, textAlign: "center", lineHeight: 1.6, margin: "6px 0 14px" }}>
        {t.duoHint}
      </div>
      <div style={{ display: "grid", gap: 8, maxHeight: 300, overflowY: "auto" }}>
        {perfis.map(pr => (
          <button key={pr.id} onClick={() => escolher(pr)} className="card"
            style={{ border: "none", padding: 10, cursor: "pointer", display: "flex",
              alignItems: "center", gap: 10, textAlign: "left" }}>
            <Rosto p={pr} size={40} />
            <div className="display" style={{ color: "#1B2A6B", fontSize: 16, flex: 1 }}>{pr.name}</div>
          </button>
        ))}
        <button onClick={() => escolher({ id: null, name: t.guest, avatar: null })} className="card"
          style={{ border: "none", padding: 10, cursor: "pointer", display: "flex",
            alignItems: "center", gap: 10, textAlign: "left" }}>
          <Rosto p={null} size={40} />
          <div className="display" style={{ color: "#1B2A6B", fontSize: 16, flex: 1 }}>{t.guest}</div>
        </button>
      </div>
      <div style={{ height: 10 }} />
      <Btn full color="#8B93AD" onClick={fechar} rotulo={t.a11yClose}>✕</Btn>
    </Modal>
  );
}

/* ---------- Escolha de nível da memória ---------- */
function MemLevels({ t, coins, memBest, setScreen, comecar, tema = "flags", titulo, icone, temSecao, comprarSecao, dupla, pedirDupla, sairDaDupla }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>{icone} {titulo}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>
      {/* Jogar em dupla é do tamanho de um botão porque é para ser achado.
          Era o pedido mais simples da casa e o mais difícil de descobrir. */}
      {dupla ? (
        <div className="card" style={{ padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <Rosto p={dupla} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.duoWith} {dupla.name}</div>
            <div style={{ color: "#00B894", fontWeight: 900, fontSize: 11 }}>⭐ {t.duoFree}</div>
          </div>
          <Btn small color="#8B93AD" onClick={sairDaDupla} rotulo={t.a11yClose}>✕</Btn>
        </div>
      ) : (
        <Btn full color="#00C2CB" onClick={pedirDupla}>👥 {t.duoPlay}</Btn>
      )}
      <div style={{ height: 12 }} />

      <div className="lista">
        {DIFFS.map((d, di) => {
          const cfg = MEM_LEVELS[d];
          const b = memBest[`${tema}:${d}`];
          const chave = `m:${tema}:${d}`;
          const preco = MEM_PRECO[d];
          const aberto = !preco || temSecao(chave);
          const anteriorOk = di === 0 || !MEM_PRECO[DIFFS[di - 1]] || temSecao(`m:${tema}:${DIFFS[di - 1]}`);
          return (
            <div key={d} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: aberto || anteriorOk ? 1 : .45 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: aberto ? BAND_COLOR[d] : "#B9C0CC", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 13 }}>
                {aberto ? `${cfg.cols}×${cfg.rows}` : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 18 }}>{t.levels[d]}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                  {aberto ? (
                    <>
                      {[1, 2, 3].map(i2 => <span key={i2} style={{ opacity: (b?.stars || 0) >= i2 ? 1 : .25 }}>★</span>)}
                      {b?.time != null && ` · ⏱️ ${tempoFmt(b.time)}`}
                    </>
                  ) : anteriorOk ? `${t.unlockFor} 🪙${preco}` : t.needPrev}
                </div>
              </div>
              {aberto ? (
                <Btn small color={BAND_COLOR[d]}
                  disabled={!dupla && coins < custoDaMemoria(memBest, tema, d)}
                  onClick={() => comecar(d, tema, dupla)}>
                  {dupla ? "👥" : custoDaMemoria(memBest, tema, d) ? `🪙${custoDaMemoria(memBest, tema, d)}` : `⭐ ${t.free}`}
                </Btn>
              ) : anteriorOk ? (
                <Btn small color={coins >= preco ? "#E84393" : "#8B93AD"} disabled={coins < preco}
                  onClick={() => comprarSecao(chave, preco)}>🔓 🪙{preco}</Btn>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ color: "#A7B3EA", fontSize: 11, fontWeight: 700, marginTop: 14, textAlign: "center", lineHeight: 1.7 }}>
        ⭐ {t.memStarsHint}
      </div>
    </div>
  );
}

/* ---------- Matemática ----------
   As contas são geradas por algoritmo, não por lista fixa: cada rodada é
   diferente e a dificuldade sobe fase a fase, parando no conteúdo de 5º ano. */
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function fazerConta(stage) {
  const band = bandFor("math", stage);
  const n = stage;
  if (band === "easy") {
    const teto = 5 + n * 3;                       // 8 → 20
    if (Math.random() < 0.5) {
      const a = rnd(1, teto), b = rnd(1, teto);
      return { prompt: `${a} + ${b}`, answer: a + b };
    }
    const a = rnd(2, teto), b = rnd(1, a);
    return { prompt: `${a} − ${b}`, answer: a - b };
  }
  if (band === "medium") {
    const r = Math.random();
    if (r < 0.35) { const a = rnd(10, 60), b = rnd(10, 40); return { prompt: `${a} + ${b}`, answer: a + b }; }
    if (r < 0.65) { const a = rnd(20, 99), b = rnd(1, a - 1); return { prompt: `${a} − ${b}`, answer: a - b }; }
    const a = rnd(2, 5), b = rnd(2, 10);
    return { prompt: `${a} × ${b}`, answer: a * b };
  }
  if (band === "hard") {
    const r = Math.random();
    if (r < 0.4) { const a = rnd(2, 10), b = rnd(2, 10); return { prompt: `${a} × ${b}`, answer: a * b }; }
    if (r < 0.7) { const b = rnd(2, 10), q = rnd(2, 10); return { prompt: `${b * q} ÷ ${b}`, answer: q }; }
    // subtração sempre com o maior primeiro: nada de resultado negativo
    const x = rnd(100, 900), y = rnd(50, 400);
    const a = Math.max(x, y), b = Math.min(x, y);
    return Math.random() < 0.5
      ? { prompt: `${a} + ${b}`, answer: a + b }
      : { prompt: `${a} − ${b}`, answer: a - b };
  }
  // gênio: fração de quantidade, porcentagem, decimal, ordem das operações
  const r = Math.random();
  if (r < 0.25) { const d = [2, 3, 4, 5][rnd(0, 3)], q = rnd(2, 12); return { prompt: `1/${d} de ${d * q}`, answer: q }; }
  if (r < 0.5)  { const p = [10, 20, 25, 50][rnd(0, 3)], base = rnd(2, 20) * 10; return { prompt: `${p}% de ${base}`, answer: Math.round(base * p / 100) }; }
  if (r < 0.75) { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9); return { prompt: `${a} + ${b} × ${c}`, answer: a + b * c }; }
  const a = rnd(11, 99) / 10, b = rnd(11, 99) / 10;
  return { prompt: `${a.toFixed(1)} + ${b.toFixed(1)}`.replace(/\./g, ","), answer: Number((a + b).toFixed(1)) };
}

function opcoesConta(certa) {
  const set = new Set([certa]);
  let guarda = 0;
  while (set.size < 4 && guarda++ < 60) {
    const delta = [1, -1, 2, -2, 3, -3, 10, -10][rnd(0, 7)];
    let alt = Math.round((certa + delta) * 10) / 10;
    if (alt < 0) alt = Math.abs(alt) + 1;
    if (alt !== certa) set.add(alt);
  }
  while (set.size < 4) set.add(certa + set.size * 7);
  const fmtN = v => String(v).replace(".", ",");
  return { answer: fmtN(certa), options: shuffle([...set].map(fmtN)) };
}

function montarRodadaMath(stage) {
  const band = bandFor("math", stage);
  const qCount = qtdPerguntas(band);
  const qs = [];
  const vistas = new Set();
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 200) {
    const c = fazerConta(stage);
    if (vistas.has(c.prompt)) continue;
    vistas.add(c.prompt);
    const { answer, options } = opcoesConta(c.answer);
    qs.push({ kind: "math", prompt: c.prompt, answer, options, porque: `${c.prompt} = ${answer}` });
  }
  const time = tempoDe("math", stage);
  return { cont: "math", diff: band, stage, qs, time, t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Quiz dos Animais ----------
   As respostas são os próprios bichos, não palavras. Assim a criança que
   ainda não lê bem responde olhando, e a tradução custa só as perguntas. */
const BICHOS = [
  { e: "🐶", tags: ["mamifero", "patas4", "fazenda", "domestico"] },
  { e: "🐱", tags: ["mamifero", "patas4", "domestico"] },
  { e: "🐭", tags: ["mamifero", "patas4"] },
  { e: "🐰", tags: ["mamifero", "patas4", "domestico"] },
  { e: "🦊", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐻", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐼", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐯", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦁", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐮", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐷", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐴", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐑", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐘", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦒", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦓", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦏", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐺", tags: ["mamifero", "patas4"] },
  { e: "🦇", tags: ["mamifero", "voa"] },
  { e: "🐳", tags: ["mamifero", "agua"] },
  { e: "🐬", tags: ["mamifero", "agua"] },
  { e: "🐔", tags: ["ave", "ovos", "fazenda"] },
  { e: "🐧", tags: ["ave", "ovos", "gelo", "agua"] },
  { e: "🦆", tags: ["ave", "ovos", "voa", "agua", "fazenda"] },
  { e: "🦉", tags: ["ave", "ovos", "voa"] },
  { e: "🦜", tags: ["ave", "ovos", "voa", "selva"] },
  { e: "🦩", tags: ["ave", "ovos", "voa", "agua"] },
  { e: "🐦", tags: ["ave", "ovos", "voa"] },
  { e: "🐢", tags: ["reptil", "ovos", "patas4", "agua"] },
  { e: "🐍", tags: ["reptil", "ovos"] },
  { e: "🦎", tags: ["reptil", "ovos", "patas4"] },
  { e: "🐊", tags: ["reptil", "ovos", "patas4", "agua"] },
  { e: "🐟", tags: ["peixe", "ovos", "agua"] },
  { e: "🐠", tags: ["peixe", "ovos", "agua"] },
  { e: "🦈", tags: ["peixe", "ovos", "agua"] },
  { e: "🐝", tags: ["inseto", "voa", "ovos"] },
  { e: "🦋", tags: ["inseto", "voa", "ovos"] },
  { e: "🐞", tags: ["inseto", "voa", "ovos"] },
  { e: "🐜", tags: ["inseto", "ovos"] },
  { e: "🦗", tags: ["inseto", "ovos"] },
  { e: "🐸", tags: ["anfibio", "ovos", "agua"] },
  { e: "🐙", tags: ["agua", "ovos"] },
  { e: "🦀", tags: ["agua", "ovos"] },
  { e: "🐌", tags: ["ovos"] },
];

/* Cada pergunta é uma etiqueta a procurar. As difíceis são as menos óbvias. */
const PERGUNTAS_BICHO = {
  easy:   [["voa", 0], ["agua", 0], ["fazenda", 0]],
  medium: [["ave", 0], ["mamifero", 0], ["inseto", 0], ["selva", 0]],
  hard:   [["reptil", 0], ["ovos", 0], ["peixe", 0], ["patas4", 0], ["gelo", 0]],
  genius: [["anfibio", 0], ["mamifero", 1], ["reptil", 1], ["inseto", 1], ["ave", 1]],
  // Mestre e Lenda só perguntam pelo avesso: achar quem NÃO tem a etiqueta
  // exige olhar os quatro bichos, não reconhecer um.
  mestre: [["agua", 1], ["voa", 1], ["fazenda", 1], ["peixe", 1], ["selva", 1]],
  lenda:  [["patas4", 1], ["ovos", 1], ["domestico", 1], ["gelo", 1], ["anfibio", 1]],
};

function montarRodadaBichos(stage, t) {
  const band = bandFor("bichos", stage);
  const qCount = qtdPerguntas(band);
  const qs = [];
  const usadas = new Set();
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 300) {
    const [tag, negar] = PERGUNTAS_BICHO[band][Math.floor(Math.random() * PERGUNTAS_BICHO[band].length)];
    const com = BICHOS.filter(b => b.tags.includes(tag));
    const sem = BICHOS.filter(b => !b.tags.includes(tag));
    const certos = negar ? sem : com;
    const errados = negar ? com : sem;
    if (certos.length < 1 || errados.length < 3) continue;
    const certo = certos[Math.floor(Math.random() * certos.length)];
    const chave = `${tag}${negar}${certo.e}`;
    if (usadas.has(chave)) continue;
    usadas.add(chave);
    const distr = shuffle(errados).slice(0, 3);
    qs.push({
      kind: "emojiPick",
      prompt: t.bicho[negar ? `nao_${tag}` : tag],
      answer: certo.e,
      options: shuffle([certo.e, ...distr.map(d => d.e)]),
    });
  }
  const time = tempoDe("bichos", stage);
  return { cont: "bichos", diff: band, stage, qs, time, t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Inglês ----------
   O emoji mostra a coisa, a resposta é a palavra em inglês. Como a resposta
   já É o conteúdo aprendido, não há nada para traduzir nas alternativas. */
const VOCAB = [
  { e: "🐶", n: 1, w: { pt: "cachorro", en: "dog", es: "perro", fr: "chien", de: "Hund", it: "cane" } },
  { e: "🐱", n: 1, w: { pt: "gato", en: "cat", es: "gato", fr: "chat", de: "Katze", it: "gatto" } },
  { e: "☀️", n: 1, w: { pt: "sol", en: "sun", es: "sol", fr: "soleil", de: "Sonne", it: "sole" } },
  { e: "🌙", n: 1, w: { pt: "lua", en: "moon", es: "luna", fr: "lune", de: "Mond", it: "luna" } },
  { e: "⭐", n: 1, w: { pt: "estrela", en: "star", es: "estrella", fr: "étoile", de: "Stern", it: "stella" } },
  { e: "🌳", n: 1, w: { pt: "árvore", en: "tree", es: "árbol", fr: "arbre", de: "Baum", it: "albero" } },
  { e: "🏠", n: 1, w: { pt: "casa", en: "house", es: "casa", fr: "maison", de: "Haus", it: "casa" } },
  { e: "🚗", n: 1, w: { pt: "carro", en: "car", es: "coche", fr: "voiture", de: "Auto", it: "auto" } },
  { e: "📖", n: 1, w: { pt: "livro", en: "book", es: "libro", fr: "livre", de: "Buch", it: "libro" } },
  { e: "⚽", n: 1, w: { pt: "bola", en: "ball", es: "pelota", fr: "ballon", de: "Ball", it: "palla" } },
  { e: "🍎", n: 1, w: { pt: "maçã", en: "apple", es: "manzana", fr: "pomme", de: "Apfel", it: "mela" } },
  { e: "🐟", n: 1, w: { pt: "peixe", en: "fish", es: "pez", fr: "poisson", de: "Fisch", it: "pesce" } },
  { e: "🐦", n: 1, w: { pt: "pássaro", en: "bird", es: "pájaro", fr: "oiseau", de: "Vogel", it: "uccello" } },
  { e: "🥛", n: 1, w: { pt: "leite", en: "milk", es: "leche", fr: "lait", de: "Milch", it: "latte" } },
  { e: "💧", n: 1, w: { pt: "água", en: "water", es: "agua", fr: "eau", de: "Wasser", it: "acqua" } },
  { e: "🐘", n: 2, w: { pt: "elefante", en: "elephant", es: "elefante", fr: "éléphant", de: "Elefant", it: "elefante" } },
  { e: "🦋", n: 2, w: { pt: "borboleta", en: "butterfly", es: "mariposa", fr: "papillon", de: "Schmetterling", it: "farfalla" } },
  { e: "🌈", n: 2, w: { pt: "arco-íris", en: "rainbow", es: "arcoíris", fr: "arc-en-ciel", de: "Regenbogen", it: "arcobaleno" } },
  { e: "🚲", n: 2, w: { pt: "bicicleta", en: "bicycle", es: "bicicleta", fr: "vélo", de: "Fahrrad", it: "bicicletta" } },
  { e: "🌸", n: 2, w: { pt: "flor", en: "flower", es: "flor", fr: "fleur", de: "Blume", it: "fiore" } },
  { e: "☁️", n: 2, w: { pt: "nuvem", en: "cloud", es: "nube", fr: "nuage", de: "Wolke", it: "nuvola" } },
  { e: "🔑", n: 2, w: { pt: "chave", en: "key", es: "llave", fr: "clé", de: "Schlüssel", it: "chiave" } },
  { e: "🕐", n: 2, w: { pt: "relógio", en: "clock", es: "reloj", fr: "horloge", de: "Uhr", it: "orologio" } },
  { e: "🪑", n: 2, w: { pt: "cadeira", en: "chair", es: "silla", fr: "chaise", de: "Stuhl", it: "sedia" } },
  { e: "🚪", n: 2, w: { pt: "porta", en: "door", es: "puerta", fr: "porte", de: "Tür", it: "porta" } },
  { e: "👟", n: 2, w: { pt: "sapato", en: "shoe", es: "zapato", fr: "chaussure", de: "Schuh", it: "scarpa" } },
  { e: "🎩", n: 2, w: { pt: "chapéu", en: "hat", es: "sombrero", fr: "chapeau", de: "Hut", it: "cappello" } },
  { e: "🍞", n: 2, w: { pt: "pão", en: "bread", es: "pan", fr: "pain", de: "Brot", it: "pane" } },
  { e: "🧀", n: 2, w: { pt: "queijo", en: "cheese", es: "queso", fr: "fromage", de: "Käse", it: "formaggio" } },
  { e: "🐝", n: 2, w: { pt: "abelha", en: "bee", es: "abeja", fr: "abeille", de: "Biene", it: "ape" } },
  { e: "🦒", n: 3, w: { pt: "girafa", en: "giraffe", es: "jirafa", fr: "girafe", de: "Giraffe", it: "giraffa" } },
  { e: "🐊", n: 3, w: { pt: "crocodilo", en: "crocodile", es: "cocodrilo", fr: "crocodile", de: "Krokodil", it: "coccodrillo" } },
  { e: "☂️", n: 3, w: { pt: "guarda-chuva", en: "umbrella", es: "paraguas", fr: "parapluie", de: "Regenschirm", it: "ombrello" } },
  { e: "✈️", n: 3, w: { pt: "avião", en: "airplane", es: "avión", fr: "avion", de: "Flugzeug", it: "aereo" } },
  { e: "🍓", n: 3, w: { pt: "morango", en: "strawberry", es: "fresa", fr: "fraise", de: "Erdbeere", it: "fragola" } },
  { e: "🕯️", n: 3, w: { pt: "vela", en: "candle", es: "vela", fr: "bougie", de: "Kerze", it: "candela" } },
  { e: "🕷️", n: 3, w: { pt: "aranha", en: "spider", es: "araña", fr: "araignée", de: "Spinne", it: "ragno" } },
  { e: "🐳", n: 3, w: { pt: "baleia", en: "whale", es: "ballena", fr: "baleine", de: "Wal", it: "balena" } },
  { e: "🚀", n: 3, w: { pt: "foguete", en: "rocket", es: "cohete", fr: "fusée", de: "Rakete", it: "razzo" } },
  { e: "🍯", n: 3, w: { pt: "mel", en: "honey", es: "miel", fr: "miel", de: "Honig", it: "miele" } },
  { e: "⛰️", n: 3, w: { pt: "montanha", en: "mountain", es: "montaña", fr: "montagne", de: "Berg", it: "montagna" } },
  { e: "🌉", n: 3, w: { pt: "ponte", en: "bridge", es: "puente", fr: "pont", de: "Brücke", it: "ponte" } },
  { e: "🦉", n: 3, w: { pt: "coruja", en: "owl", es: "búho", fr: "hibou", de: "Eule", it: "gufo" } },
  { e: "🧦", n: 3, w: { pt: "meias", en: "socks", es: "calcetines", fr: "chaussettes", de: "Socken", it: "calzini" } },
  { e: "🪞", n: 3, w: { pt: "espelho", en: "mirror", es: "espejo", fr: "miroir", de: "Spiegel", it: "specchio" } },
];

const VOCAB_NIVEL = { easy: [1], medium: [1, 2], hard: [2, 3], genius: [3], mestre: [3], lenda: [3] };

function montarRodadaIdioma(stage, t, alvo) {
  const band = bandFor(`idiomas_${alvo}`, stage);
  const qCount = qtdPerguntas(band);
  const pool = VOCAB.filter(v => VOCAB_NIVEL[band].includes(v.n));
  const escolhidos = shuffle(pool).slice(0, qCount);
  const qs = escolhidos.map(v => {
    const certa = v.w[alvo];
    // alternativas erradas também no idioma-alvo, senão a resposta se entrega
    const distr = shuffle(VOCAB.filter(o => o.w[alvo] !== certa)).slice(0, 3);
    return {
      kind: "emojiAsk", prompt: v.e,
      ask: t.howSayIn.replace("{x}", LANG_CATALOG[alvo]),
      answer: certa, options: shuffle([certa, ...distr.map(d => d.w[alvo])]),
    };
  });
  return { cont: `idiomas_${alvo}`, diff: band, stage, qs, time: tempoDe(`idiomas_${alvo}`, stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Cores e Formas ----------
   Emoji já traz forma e cor combinadas, então dá para perguntar as duas
   coisas sem desenhar nada e sem depender de leitura na resposta. */
const FORMAS = {
  circulo: { vermelho: "🔴", laranja: "🟠", amarelo: "🟡", verde: "🟢", azul: "🔵", roxo: "🟣", marrom: "🟤", preto: "⚫", branco: "⚪" },
  quadrado: { vermelho: "🟥", laranja: "🟧", amarelo: "🟨", verde: "🟩", azul: "🟦", roxo: "🟪", marrom: "🟫", preto: "⬛", branco: "⬜" },
  coracao: { vermelho: "❤️", laranja: "🧡", amarelo: "💛", verde: "💚", azul: "💙", roxo: "💜", marrom: "🤎", preto: "🖤", branco: "🤍" },
};
const CORES_LISTA = ["vermelho", "laranja", "amarelo", "verde", "azul", "roxo", "marrom", "preto", "branco"];
const FORMAS_LISTA = ["circulo", "quadrado", "coracao"];
const todosEmojis = () => FORMAS_LISTA.flatMap(f => CORES_LISTA.map(c => ({ f, c, e: FORMAS[f][c] })));

function montarRodadaArte(stage, t) {
  const band = bandFor("arts", stage);
  const qCount = qtdPerguntas(band);
  const todos = todosEmojis();
  const qs = [];
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 300) {
    const alvo = todos[Math.floor(Math.random() * todos.length)];
    let prompt, errados;
    if (band === "easy") {            // só a cor, tudo em círculos
      prompt = t.artQ.cor.replace("{x}", t.cores[alvo.c]);
      errados = todos.filter(o => o.f === "circulo" && o.c !== alvo.c);
      if (alvo.f !== "circulo") continue;
    } else if (band === "medium") {   // só a forma, cores variadas
      prompt = t.artQ.forma.replace("{x}", t.formas[alvo.f]);
      errados = todos.filter(o => o.f !== alvo.f);
    } else if (band === "hard") {     // forma e cor juntas
      prompt = t.artQ.ambos.replace("{f}", t.formas[alvo.f]).replace("{c}", t.cores[alvo.c]);
      errados = todos.filter(o => o.f !== alvo.f || o.c !== alvo.c);
    } else {                          // o que NÃO é
      prompt = t.artQ.nao.replace("{x}", t.cores[alvo.c]);
      const fora = todos.filter(o => o.c !== alvo.c);
      const certo2 = fora[Math.floor(Math.random() * fora.length)];
      const iguais = todos.filter(o => o.c === alvo.c);
      qs.push({ kind: "emojiPick", prompt, answer: certo2.e, options: shuffle([certo2.e, ...shuffle(iguais).slice(0, 3).map(o => o.e)]) });
      continue;
    }
    qs.push({ kind: "emojiPick", prompt, answer: alvo.e, options: shuffle([alvo.e, ...shuffle(errados).slice(0, 3).map(o => o.e)]) });
  }
  return { cont: "arts", diff: band, stage, qs, time: tempoDe("arts", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Curiosidades do Mundo ----------
   O emoji faz as vezes de foto e a pergunta vem do tipo da curiosidade.
   Nada de imagem de terceiro: a "foto" é um glifo que o próprio sistema
   desenha, então continua funcionando em modo avião e sem baixar nada.

   As alternativas erradas saem do MESMO universo da certa — outros países
   citados no banco, outros mares, outros continentes. Sem isso a resposta se
   entrega: bastaria escolher a única opção que é um país. */
const CONTINENTES_IDS = ["sa", "na", "eu", "af", "as", "oc"];

function rotuloCuriosidade(tipo, valor, t, lang) {
  if (tipo === "pais") return countryName(valor, lang);
  if (tipo === "agua") return AGUAS[valor][lang] || AGUAS[valor].en;
  if (tipo === "continente") return t.continents[valor];
  return valor;                                   // cidade: nome próprio
}

function universoCuriosidade(tipo) {
  if (tipo === "agua") return Object.keys(AGUAS);
  if (tipo === "continente") return CONTINENTES_IDS;
  return [...new Set(CURIOSIDADES.filter(o => o.t === tipo).map(o => o.r))];
}

function montarRodadaCuriosidades(stage, t, lang) {
  const band = bandFor("curiosidades", stage);
  const qCount = qtdPerguntas(band);
  const pool = CURIOSIDADES.filter(c => CURIOSIDADE_NIVEL[band].includes(c.n));
  const escolhidas = shuffle(pool).slice(0, qCount);
  const qs = [];
  for (const c of escolhidas) {
    const certa = rotuloCuriosidade(c.t, c.r, t, lang);
    const outros = universoCuriosidade(c.t)
      .map(x => rotuloCuriosidade(c.t, x, t, lang))
      .filter(x => x && x !== certa);
    const distr = shuffle([...new Set(outros)]).slice(0, 3);
    if (distr.length < 3) continue;
    qs.push({
      kind: "emojiAsk", prompt: c.e,
      ask: t.curQ[c.t].replace("{x}", c.nome[lang] || c.nome.en),
      answer: certa, options: shuffle([certa, ...distr]),
    });
  }
  return { cont: "curiosidades", diff: band, stage, qs, time: tempoDe("curiosidades", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Ciências dos Animais ----------
   Mesma ideia, mas as perguntas são geradas: 94 animais × 5 moldes. Ver
   src/data/ciencias.js — lá estão os fatos, aqui só a montagem da rodada. */
const PERGUNTAS_CIENCIA = perguntasCiencia();
const DICS_CIENCIA = { grupo: GRUPOS, dieta: DIETAS, casa: CASAS, nasce: NASCE };

function montarRodadaCiencias(stage, t, lang) {
  const band = bandFor("ciencias", stage);
  const qCount = qtdPerguntas(band);
  const pool = PERGUNTAS_CIENCIA.filter(x => CIENCIA_NIVEL[band].includes(x.n));
  const escolhidas = shuffle(pool).slice(0, qCount);
  const qs = [];
  for (const x of escolhidas) {
    const dic = DICS_CIENCIA[x.campo];
    const rotulo = v => dic ? (dic[v][lang] || dic[v].en) : t.continents[v];
    const universo = dic ? Object.keys(dic) : CONTINENTES_IDS;
    const certa = rotulo(x.r);
    const distr = shuffle(universo.map(rotulo).filter(o => o && o !== certa)).slice(0, 3);
    if (distr.length < 3) continue;
    qs.push({
      kind: "emojiAsk", prompt: x.e, ask: t.sciQ[x.molde],
      answer: certa, options: shuffle([certa, ...distr]),
    });
  }
  return { cont: "ciencias", diff: band, stage, qs, time: tempoDe("ciencias", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Bíblia ----------
   Foco em fatos narrativos: quem fez o quê, onde, em que livro. Deixei de
   fora questões de doutrina, que variam entre igrejas e não cabem num quiz
   infantil. As perguntas devem ser revisadas por um adulto antes de publicar. */
const BIBLIA = {
  pt: {
    easy: [
      ["Quem construiu a arca?", "Noé", ["Moisés", "Davi", "Pedro"]],
      ["Quem enfrentou o gigante Golias?", "Davi", ["Sansão", "José", "Josué"]],
      ["Onde Jesus nasceu?", "Belém", ["Nazaré", "Jerusalém", "Cafarnaum"]],
      ["Quem foi jogado na cova dos leões?", "Daniel", ["Elias", "Jonas", "Jó"]],
      ["Quem foi engolido por um grande peixe?", "Jonas", ["Paulo", "Tiago", "Isaías"]],
      ["Qual é o primeiro livro da Bíblia?", "Gênesis", ["Êxodo", "Salmos", "João"]],
      ["Quem era a mãe de Jesus?", "Maria", ["Marta", "Rute", "Ana"]],
      ["Quantos dias durou a criação, com o descanso?", "7", ["3", "12", "40"]],
      ["Quem abriu o Mar Vermelho pela mão de Deus?", "Moisés", ["Arão", "Josué", "Samuel"]],
      ["O que Deus criou no primeiro dia?", "A luz", ["Os animais", "O sol", "O homem"]],
    ],
    medium: [
      ["Quantos discípulos Jesus escolheu?", "12", ["7", "10", "40"]],
      ["Quem batizou Jesus?", "João Batista", ["Pedro", "André", "Tiago"]],
      ["Qual foi o primeiro milagre de Jesus?", "Transformar água em vinho", ["Andar sobre as águas", "Curar um cego", "Multiplicar os pães"]],
      ["Quem negou Jesus três vezes?", "Pedro", ["Tomé", "Judas", "Filipe"]],
      ["Quantos livros tem a Bíblia?", "66", ["27", "40", "100"]],
      ["Quem recebeu os Dez Mandamentos?", "Moisés", ["Abraão", "Isaque", "Josué"]],
      ["Qual rei escreveu muitos Salmos?", "Davi", ["Saul", "Salomão", "Ezequias"]],
      ["Quem foi o rei mais sábio de Israel?", "Salomão", ["Davi", "Josias", "Acabe"]],
      ["Em que rio Jesus foi batizado?", "Jordão", ["Nilo", "Eufrates", "Tigre"]],
      ["Quem traiu Jesus?", "Judas Iscariotes", ["Pedro", "Tomé", "Mateus"]],
      ["Quantos irmãos José tinha?", "11", ["3", "7", "12"]],
      ["Quem derrubou os muros de Jericó?", "Josué", ["Gideão", "Sansão", "Baraque"]],
    ],
    hard: [
      ["Quantos Evangelhos existem?", "4", ["2", "5", "7"]],
      ["Qual é o último livro da Bíblia?", "Apocalipse", ["Judas", "Atos", "Hebreus"]],
      ["Quem escreveu a maior parte das cartas do Novo Testamento?", "Paulo", ["Pedro", "João", "Lucas"]],
      ["Quantos anos o povo de Israel andou pelo deserto?", "40", ["7", "12", "70"]],
      ["Quem foi o primeiro rei de Israel?", "Saul", ["Davi", "Samuel", "Salomão"]],
      ["Qual profeta foi levado ao céu num carro de fogo?", "Elias", ["Eliseu", "Isaías", "Enoque"]],
      ["Quem era o pai de Isaque?", "Abraão", ["Jacó", "Ló", "Labão"]],
      ["Como se chamava o jardim onde viveram Adão e Eva?", "Éden", ["Getsêmani", "Siló", "Carmelo"]],
      ["Quantas pragas caíram sobre o Egito?", "10", ["7", "12", "3"]],
      ["Quem sucedeu Moisés como líder do povo?", "Josué", ["Calebe", "Arão", "Gideão"]],
    ],
    genius: [
      ["Qual é o menor livro do Novo Testamento em versículos?", "3 João", ["Filemom", "Judas", "Tito"]],
      ["Quantos capítulos tem o livro de Salmos?", "150", ["100", "120", "180"]],
      ["Qual apóstolo era médico e escreveu um Evangelho?", "Lucas", ["Marcos", "Mateus", "João"]],
      ["Em que monte Moisés recebeu a Lei?", "Sinai", ["Nebo", "Carmelo", "Hermom"]],
      ["Qual era a profissão de Pedro antes de seguir Jesus?", "Pescador", ["Carpinteiro", "Cobrador de impostos", "Fabricante de tendas"]],
      ["Qual profeta menor teve seu livro citado por Jesus sobre Nínive?", "Jonas", ["Amós", "Naum", "Oseias"]],
      ["Quantos anos Matusalém viveu, segundo Gênesis?", "969", ["777", "900", "1000"]],
      ["Qual é o primeiro livro dos Profetas Maiores?", "Isaías", ["Jeremias", "Ezequiel", "Daniel"]],
      ["Quem era o irmão mais velho de Moisés?", "Arão", ["Miriã", "Josué", "Cale"]],
      ["Em que cidade os seguidores de Jesus foram chamados cristãos pela primeira vez?", "Antioquia", ["Jerusalém", "Roma", "Éfeso"]],
    ],
  },
  en: {
    easy: [
      ["Who built the ark?", "Noah", ["Moses", "David", "Peter"]],
      ["Who faced the giant Goliath?", "David", ["Samson", "Joseph", "Joshua"]],
      ["Where was Jesus born?", "Bethlehem", ["Nazareth", "Jerusalem", "Capernaum"]],
      ["Who was thrown into the lions' den?", "Daniel", ["Elijah", "Jonah", "Job"]],
      ["Who was swallowed by a great fish?", "Jonah", ["Paul", "James", "Isaiah"]],
      ["What is the first book of the Bible?", "Genesis", ["Exodus", "Psalms", "John"]],
      ["Who was the mother of Jesus?", "Mary", ["Martha", "Ruth", "Hannah"]],
      ["How many days did creation take, counting the rest?", "7", ["3", "12", "40"]],
      ["Who parted the Red Sea by God's hand?", "Moses", ["Aaron", "Joshua", "Samuel"]],
      ["What did God create on the first day?", "Light", ["Animals", "The sun", "Man"]],
    ],
    medium: [
      ["How many disciples did Jesus choose?", "12", ["7", "10", "40"]],
      ["Who baptized Jesus?", "John the Baptist", ["Peter", "Andrew", "James"]],
      ["What was the first miracle of Jesus?", "Turning water into wine", ["Walking on water", "Healing a blind man", "Feeding the crowd"]],
      ["Who denied Jesus three times?", "Peter", ["Thomas", "Judas", "Philip"]],
      ["How many books are in the Bible?", "66", ["27", "40", "100"]],
      ["Who received the Ten Commandments?", "Moses", ["Abraham", "Isaac", "Joshua"]],
      ["Which king wrote many Psalms?", "David", ["Saul", "Solomon", "Hezekiah"]],
      ["Who was the wisest king of Israel?", "Solomon", ["David", "Josiah", "Ahab"]],
      ["In which river was Jesus baptized?", "Jordan", ["Nile", "Euphrates", "Tigris"]],
      ["Who betrayed Jesus?", "Judas Iscariot", ["Peter", "Thomas", "Matthew"]],
      ["How many brothers did Joseph have?", "11", ["3", "7", "12"]],
      ["Who brought down the walls of Jericho?", "Joshua", ["Gideon", "Samson", "Barak"]],
    ],
    hard: [
      ["How many Gospels are there?", "4", ["2", "5", "7"]],
      ["What is the last book of the Bible?", "Revelation", ["Jude", "Acts", "Hebrews"]],
      ["Who wrote most of the New Testament letters?", "Paul", ["Peter", "John", "Luke"]],
      ["How many years did Israel wander in the desert?", "40", ["7", "12", "70"]],
      ["Who was the first king of Israel?", "Saul", ["David", "Samuel", "Solomon"]],
      ["Which prophet was taken to heaven in a chariot of fire?", "Elijah", ["Elisha", "Isaiah", "Enoch"]],
      ["Who was Isaac's father?", "Abraham", ["Jacob", "Lot", "Laban"]],
      ["What was the garden where Adam and Eve lived?", "Eden", ["Gethsemane", "Shiloh", "Carmel"]],
      ["How many plagues struck Egypt?", "10", ["7", "12", "3"]],
      ["Who succeeded Moses as leader?", "Joshua", ["Caleb", "Aaron", "Gideon"]],
    ],
    genius: [
      ["Which is the shortest New Testament book by verses?", "3 John", ["Philemon", "Jude", "Titus"]],
      ["How many chapters are in Psalms?", "150", ["100", "120", "180"]],
      ["Which Gospel writer was a physician?", "Luke", ["Mark", "Matthew", "John"]],
      ["On which mountain did Moses receive the Law?", "Sinai", ["Nebo", "Carmel", "Hermon"]],
      ["What was Peter's job before following Jesus?", "Fisherman", ["Carpenter", "Tax collector", "Tentmaker"]],
      ["Which prophet did Jesus cite about Nineveh?", "Jonah", ["Amos", "Nahum", "Hosea"]],
      ["How many years did Methuselah live, per Genesis?", "969", ["777", "900", "1000"]],
      ["Which is the first of the Major Prophets?", "Isaiah", ["Jeremiah", "Ezekiel", "Daniel"]],
      ["Who was Moses' older brother?", "Aaron", ["Miriam", "Joshua", "Caleb"]],
      ["In which city were followers first called Christians?", "Antioch", ["Jerusalem", "Rome", "Ephesus"]],
    ],
  },
  es: {
    easy: [
      ["¿Quién construyó el arca?", "Noé", ["Moisés", "David", "Pedro"]],
      ["¿Quién enfrentó al gigante Goliat?", "David", ["Sansón", "José", "Josué"]],
      ["¿Dónde nació Jesús?", "Belén", ["Nazaret", "Jerusalén", "Cafarnaúm"]],
      ["¿Quién fue echado al foso de los leones?", "Daniel", ["Elías", "Jonás", "Job"]],
      ["¿Quién fue tragado por un gran pez?", "Jonás", ["Pablo", "Santiago", "Isaías"]],
      ["¿Cuál es el primer libro de la Biblia?", "Génesis", ["Éxodo", "Salmos", "Juan"]],
      ["¿Quién era la madre de Jesús?", "María", ["Marta", "Rut", "Ana"]],
      ["¿Cuántos días duró la creación, con el descanso?", "7", ["3", "12", "40"]],
      ["¿Quién abrió el Mar Rojo por la mano de Dios?", "Moisés", ["Aarón", "Josué", "Samuel"]],
      ["¿Qué creó Dios el primer día?", "La luz", ["Los animales", "El sol", "El hombre"]],
    ],
    medium: [
      ["¿Cuántos discípulos eligió Jesús?", "12", ["7", "10", "40"]],
      ["¿Quién bautizó a Jesús?", "Juan el Bautista", ["Pedro", "Andrés", "Santiago"]],
      ["¿Cuál fue el primer milagro de Jesús?", "Convertir agua en vino", ["Caminar sobre el agua", "Sanar a un ciego", "Multiplicar los panes"]],
      ["¿Quién negó a Jesús tres veces?", "Pedro", ["Tomás", "Judas", "Felipe"]],
      ["¿Cuántos libros tiene la Biblia?", "66", ["27", "40", "100"]],
      ["¿Quién recibió los Diez Mandamientos?", "Moisés", ["Abraham", "Isaac", "Josué"]],
      ["¿Qué rey escribió muchos Salmos?", "David", ["Saúl", "Salomón", "Ezequías"]],
      ["¿Quién fue el rey más sabio de Israel?", "Salomón", ["David", "Josías", "Acab"]],
      ["¿En qué río fue bautizado Jesús?", "Jordán", ["Nilo", "Éufrates", "Tigris"]],
      ["¿Quién traicionó a Jesús?", "Judas Iscariote", ["Pedro", "Tomás", "Mateo"]],
      ["¿Cuántos hermanos tenía José?", "11", ["3", "7", "12"]],
      ["¿Quién derribó los muros de Jericó?", "Josué", ["Gedeón", "Sansón", "Barac"]],
    ],
    hard: [
      ["¿Cuántos Evangelios hay?", "4", ["2", "5", "7"]],
      ["¿Cuál es el último libro de la Biblia?", "Apocalipsis", ["Judas", "Hechos", "Hebreos"]],
      ["¿Quién escribió la mayoría de las cartas del Nuevo Testamento?", "Pablo", ["Pedro", "Juan", "Lucas"]],
      ["¿Cuántos años anduvo Israel por el desierto?", "40", ["7", "12", "70"]],
      ["¿Quién fue el primer rey de Israel?", "Saúl", ["David", "Samuel", "Salomón"]],
      ["¿Qué profeta fue llevado al cielo en un carro de fuego?", "Elías", ["Eliseo", "Isaías", "Enoc"]],
      ["¿Quién era el padre de Isaac?", "Abraham", ["Jacob", "Lot", "Labán"]],
      ["¿Cómo se llamaba el jardín de Adán y Eva?", "Edén", ["Getsemaní", "Silo", "Carmelo"]],
      ["¿Cuántas plagas cayeron sobre Egipto?", "10", ["7", "12", "3"]],
      ["¿Quién sucedió a Moisés como líder?", "Josué", ["Caleb", "Aarón", "Gedeón"]],
    ],
    genius: [
      ["¿Cuál es el libro más corto del Nuevo Testamento en versículos?", "3 Juan", ["Filemón", "Judas", "Tito"]],
      ["¿Cuántos capítulos tiene Salmos?", "150", ["100", "120", "180"]],
      ["¿Qué evangelista era médico?", "Lucas", ["Marcos", "Mateo", "Juan"]],
      ["¿En qué monte recibió Moisés la Ley?", "Sinaí", ["Nebo", "Carmelo", "Hermón"]],
      ["¿Cuál era el oficio de Pedro?", "Pescador", ["Carpintero", "Recaudador", "Fabricante de tiendas"]],
      ["¿Qué profeta citó Jesús sobre Nínive?", "Jonás", ["Amós", "Nahúm", "Oseas"]],
      ["¿Cuántos años vivió Matusalén, según Génesis?", "969", ["777", "900", "1000"]],
      ["¿Cuál es el primero de los Profetas Mayores?", "Isaías", ["Jeremías", "Ezequiel", "Daniel"]],
      ["¿Quién era el hermano mayor de Moisés?", "Aarón", ["María", "Josué", "Caleb"]],
      ["¿En qué ciudad se llamó cristianos por primera vez a los discípulos?", "Antioquía", ["Jerusalén", "Roma", "Éfeso"]],
    ],
  },
};

function montarRodadaBiblia(stage, lang) {
  const band = bandFor("bible", stage);
  const banco = bancoBiblia(lang, band);
  const qCount = qtdPerguntas(band);
  const escolhidas = shuffle(banco).slice(0, Math.min(qCount, banco.length));
  const qs = escolhidas.map(([pergunta, certa, erradas, porque]) => ({
    kind: "texto", prompt: pergunta, answer: certa, options: shuffle([certa, ...erradas]), porque,
  }));
  return { cont: "bible", diff: band, stage, qs, time: tempoDe("bible", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}


const capNome = (code, lang) =>
  (lang === "pt" && CAP_PT[code]) || (lang === "es" && CAP_ES[code]) || CAPITAIS[code];

/* A ordem em que o mundo se abre. Cada região exige 10 fases da anterior. */
const CAP_REGIOES = [
  { id: "cap_br", icone: "🇧🇷", cor: "#00B894" },
  { id: "cap_sa", icone: "🌎", cor: "#00C2CB" },
  { id: "cap_na", icone: "🌎", cor: "#FF7043" },
  { id: "cap_eu", icone: "🌍", cor: "#4C6FFF" },
  { id: "cap_af", icone: "🌍", cor: "#F9A826" },
  { id: "cap_as", icone: "🌏", cor: "#E84393" },
  { id: "cap_oc", icone: "🌏", cor: "#6A5AE0" },
  { id: "cap_us", icone: "🇺🇸", cor: "#9B59B6" },
];

function paresCapitais(regiao, lang) {
  if (regiao === "cap_br") return BR_ESTADOS.map(([n, c]) => [n, c]);
  if (regiao === "cap_us") return US_ESTADOS.map(([n, c]) => [n, c]);
  const cont = regiao.slice(4);
  return Object.keys(DATA[cont]).map(code => [countryName(code, lang), capNome(code, lang)]);
}

function montarRodadaCapitais(stage, t, lang, cont) {
  const band = bandFor(cont, stage);
  const qCount = qtdPerguntas(band);
  const pares = paresCapitais(cont, lang).filter(([n, c]) => n && c);
  // As fases fáceis usam os primeiros da lista; as difíceis, o conjunto todo
  const fatia = band === "easy" ? Math.ceil(pares.length * 0.5)
    : band === "medium" ? Math.ceil(pares.length * 0.75) : pares.length;
  const pool = shuffle(pares).slice(0, Math.max(qCount + 3, fatia));
  const escolhidos = shuffle(pool).slice(0, qCount);
  const qs = escolhidos.map(([lugar, capital]) => {
    const distr = shuffle(pares.filter(([, c]) => c !== capital)).slice(0, 3);
    return {
      kind: "texto", prompt: lugar, ask: t.whichCapital,
      answer: capital, options: shuffle([capital, ...distr.map(d => d[1])]),
      porque: t.porq.capital.replace("{cap}", capital).replace("{lugar}", lugar),
    };
  });
  return { cont, diff: band, stage, qs, time: tempoDe(cont, stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* Jogos de perguntas que não ficam no mapa-múndi */
const alvoDe = cont => (cont || "").startsWith("idiomas_") ? cont.slice(8) : null;
const quizDe = cont => QUIZZES[cont] || (alvoDe(cont) ? QUIZZES.idiomas : (cont || "").startsWith("cap_") ? QUIZZES.capitais : null);

const QUIZZES = {
  math:    { icone: "🔢", cor: "#F9A826", nome: t => t.games.count,      montar: (st, t, lang) => montarRodadaMath(st) },
  bichos:  { icone: "🦉", cor: "#00B894", nome: t => t.games.animalQuiz, montar: (st, t) => montarRodadaBichos(st, t) },
  idiomas: { icone: "🔤", cor: "#4C6FFF", nome: t => t.games.words,      montar: (st, t, lang, cont) => montarRodadaIdioma(st, t, alvoDe(cont)) },
  arts:    { icone: "🌈", cor: "#E84393", nome: t => t.games.colors,     montar: (st, t) => montarRodadaArte(st, t) },
  bible:   { icone: "✝️", cor: "#8D6E3A", nome: t => t.games.bible,      montar: (st, t, lang) => montarRodadaBiblia(st, lang) },
  capitais:{ icone: "🏛️", cor: "#6A5AE0", nome: t => t.games.capitals,   montar: (st, t, lang, cont) => montarRodadaCapitais(st, t, lang, cont) },
  curiosidades: { icone: "🗺️", cor: "#00C2CB", nome: t => t.games.curiosidades, montar: (st, t, lang) => montarRodadaCuriosidades(st, t, lang) },
  ciencias:     { icone: "🔬", cor: "#6A5AE0", nome: t => t.games.sciAnimals,   montar: (st, t, lang) => montarRodadaCiencias(st, t, lang) },
};


/* ---------- Desenhos gerados ----------
   Cada semente produz sempre o mesmo desenho, então basta guardar o número
   para o desenho existir de novo — nenhuma imagem ocupa espaço. */
function semente(n) {
  let a = n >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function desenhoGerado(seed) {
  const r = semente(seed);
  const ent = (a, b) => a + Math.floor(r() * (b - a + 1));
  const um = arr => arr[Math.floor(r() * arr.length)];
  const areas = [];
  const estrelaPts = (cx, cy, R1, R2, n, rot) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const rr = i % 2 === 0 ? R1 : R2;
      const ang = ((rot + i * 180 / n) * Math.PI) / 180;
      pts.push(`${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const tipo = um(["mandala", "bandeira", "robo", "flor", "bicho", "vitral"]);
  let vb = "0 0 200 200", emoji = "✨";

  if (tipo === "mandala") {
    emoji = "🌀";
    const camadas = ent(3, 4);
    for (let k = camadas; k >= 1; k--) {
      const raio = 26 + k * ent(16, 22);
      const n = ent(6, 10);
      const petala = um(["c", "e", "p"]);
      for (let i = 0; i < n; i++) {
        const ang = (i * 360 / n) * Math.PI / 180;
        const cx = 100 + Math.cos(ang) * raio, cy = 100 + Math.sin(ang) * raio;
        const t = 12 + k * 3;
        if (petala === "c") areas.push({ t: "c", cx: +cx.toFixed(1), cy: +cy.toFixed(1), r: t });
        else if (petala === "e") areas.push({ t: "e", cx: +cx.toFixed(1), cy: +cy.toFixed(1), rx: t + 5, ry: t - 4 });
        else areas.push({ t: "p", pts: estrelaPts(cx, cy, t + 4, (t + 4) * 0.45, 5, -90) });
      }
    }
    areas.push({ t: "c", cx: 100, cy: 100, r: ent(18, 26) });
    areas.push({ t: "c", cx: 100, cy: 100, r: ent(8, 14) });

  } else if (tipo === "bandeira") {
    emoji = "🏳️"; vb = "0 0 200 134";
    const layout = um(["h3", "v3", "h5", "cruz", "tri", "cantao"]);
    if (layout === "h3") [0, 45, 89].forEach((y, i) => areas.push({ t: "r", x: 0, y, w: 200, h: i === 1 ? 44 : 45 }));
    else if (layout === "v3") [0, 67, 133].forEach((x, i) => areas.push({ t: "r", x, y: 0, w: i === 1 ? 66 : 67, h: 134 }));
    else if (layout === "h5") for (let i = 0; i < 5; i++) areas.push({ t: "r", x: 0, y: i * 27, w: 200, h: 27 });
    else if (layout === "cruz") {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 134 });
      areas.push({ t: "r", x: ent(46, 72), y: 0, w: 30, h: 134 });
      areas.push({ t: "r", x: 0, y: 52, w: 200, h: 30 });
    } else if (layout === "tri") {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 67 });
      areas.push({ t: "r", x: 0, y: 67, w: 200, h: 67 });
      areas.push({ t: "p", pts: `0,0 ${ent(60, 96)},67 0,134` });
    } else {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 134 });
      areas.push({ t: "r", x: 0, y: 0, w: 86, h: 60 });
    }
    const enfeite = um(["circulo", "estrela", "nada", "estrela"]);
    if (enfeite === "circulo") areas.push({ t: "c", cx: 100, cy: 67, r: ent(24, 34) });
    if (enfeite === "estrela") areas.push({ t: "p", pts: estrelaPts(layout === "cantao" ? 43 : 100, layout === "cantao" ? 30 : 67, ent(18, 28), ent(8, 12), 5, -90) });

  } else if (tipo === "robo") {
    emoji = "🤖";
    const lc = ent(70, 100), ac = ent(50, 70);
    areas.push({ t: "r", x: 100 - lc / 2, y: 42, w: lc, h: ac });
    const olho = um(["c", "r"]);
    [-1, 1].forEach(sx => olho === "c"
      ? areas.push({ t: "c", cx: 100 + sx * ent(14, 20), cy: 42 + ac / 2, r: ent(8, 13) })
      : areas.push({ t: "r", x: 100 + sx * 18 - 10, y: 42 + ac / 2 - 8, w: 20, h: 16 }));
    areas.push({ t: "r", x: 82, y: 42 + ac - 16, w: 36, h: 8 });
    const lcorpo = ent(90, 120), acorpo = ent(46, 62);
    areas.push({ t: "r", x: 100 - lcorpo / 2, y: 42 + ac + 10, w: lcorpo, h: acorpo });
    areas.push({ t: "r", x: 100 - lcorpo / 2 - 30, y: 42 + ac + 22, w: 30, h: 14 });
    areas.push({ t: "r", x: 100 + lcorpo / 2, y: 42 + ac + 22, w: 30, h: 14 });
    areas.push({ t: "r", x: 76, y: 42 + ac + 10 + acorpo, w: 22, h: 20 });
    areas.push({ t: "r", x: 106, y: 42 + ac + 10 + acorpo, w: 22, h: 20 });
    areas.push({ t: "r", x: 96, y: 42 - 22, w: 8, h: 22 });
    areas.push({ t: "c", cx: 100, cy: 42 - 26, r: ent(7, 11) });

  } else if (tipo === "flor") {
    emoji = "🌼";
    const n = ent(5, 9), raio = ent(38, 50), tam = ent(20, 28);
    areas.push({ t: "r", x: 94, y: 100, w: 12, h: 88 });
    areas.push({ t: "e", cx: 66, cy: ent(140, 156), rx: 24, ry: 12 });
    areas.push({ t: "e", cx: 134, cy: ent(150, 168), rx: 24, ry: 12 });
    for (let i = 0; i < n; i++) {
      const ang = (i * 360 / n - 90) * Math.PI / 180;
      areas.push({ t: "c", cx: +(100 + Math.cos(ang) * raio).toFixed(1), cy: +(88 + Math.sin(ang) * raio).toFixed(1), r: tam });
    }
    areas.push({ t: "c", cx: 100, cy: 88, r: ent(20, 26) });

  } else if (tipo === "bicho") {
    emoji = "🐾";
    const rb = ent(38, 50);
    areas.push({ t: "e", cx: 100, cy: 128, rx: rb, ry: rb - 6 });
    areas.push({ t: "c", cx: 100, cy: 70, r: ent(28, 38) });
    const orelha = um(["c", "p"]);
    [-1, 1].forEach(sx => orelha === "c"
      ? areas.push({ t: "c", cx: 100 + sx * 26, cy: 46, r: 13 })
      : areas.push({ t: "p", pts: `${100 + sx * 12},52 ${100 + sx * 34},${ent(14, 26)} ${100 + sx * 36},56` }));
    const no = ent(2, 3);
    for (let i = 0; i < no; i++) areas.push({ t: "c", cx: 100 + (i - (no - 1) / 2) * 22, cy: 66, r: ent(7, 10) });
    areas.push({ t: "e", cx: 100, cy: 84, rx: 8, ry: 6 });
    [-1, 1].forEach(sx => areas.push({ t: "e", cx: 100 + sx * 24, cy: 170, rx: 15, ry: 11 }));

  } else {
    emoji = "🪟";
    const cols = ent(3, 4), rows = ent(3, 4);
    const w = 200 / cols, h = 200 / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const forma = um(["r", "c", "p", "p"]);
      if (forma === "r") areas.push({ t: "r", x: +(i * w).toFixed(1), y: +(j * h).toFixed(1), w: +w.toFixed(1), h: +h.toFixed(1) });
      else if (forma === "c") areas.push({ t: "c", cx: +(i * w + w / 2).toFixed(1), cy: +(j * h + h / 2).toFixed(1), r: +(Math.min(w, h) / 2).toFixed(1) });
      else areas.push({ t: "p", pts: `${(i * w).toFixed(1)},${(j * h + h).toFixed(1)} ${(i * w + w / 2).toFixed(1)},${(j * h).toFixed(1)} ${(i * w + w).toFixed(1)},${(j * h + h).toFixed(1)}` });
    }
  }
  return { id: `g${seed}`, emoji, cat: "gen", vb, areas };
}

/* Acha o desenho pelo id, seja da lista fixa ou gerado */
const acharArte = id => id.startsWith("g")
  ? desenhoGerado(Number(id.slice(1)))
  : DESENHOS.find(d => d.id === id);

function Peca({ a, fill, onClick }) {
  const p = { fill: fill || "#fff", stroke: "#2b2b2b", strokeWidth: 3, strokeLinejoin: "round", onClick, style: { cursor: "pointer" } };
  if (a.t === "c") return <circle cx={a.cx} cy={a.cy} r={a.r} {...p} />;
  if (a.t === "e") return <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry} {...p} />;
  if (a.t === "r") return <rect x={a.x} y={a.y} width={a.w} height={a.h} {...p} />;
  if (a.t === "p") return <polygon points={a.pts} {...p} />;
  return <path d={a.d} {...p} />;
}

/* Miniatura sem interação, para a galeria */
function Mini({ art, fills, size = 72 }) {
  return (
    <svg viewBox={art.vb} width={size} height={size}>
      {art.areas.map((a, i) => <Peca key={i} a={a} fill={fills?.[i]} />)}
    </svg>
  );
}

function Coloring({ t, art, fillsIniciais, onSalvar, onSair, ganhouHoje }) {
  const [cor, setCor] = useState(PALETA[0]);
  const [fills, setFills] = useState(fillsIniciais || {});
  const total = art.areas.length;
  const pintadas = Object.values(fills).filter(Boolean).length;
  const completo = pintadas >= total;

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onSair} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{art.emoji} {pintadas}/{total}</div>
        <Btn small color="#8B93AD" onClick={() => setFills({})}>🧽</Btn>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 10 }}>
        <svg viewBox={art.vb} style={{ width: "100%", display: "block", touchAction: "manipulation" }}>
          {art.areas.map((a, i) => (
            <Peca key={i} a={a} fill={fills[i]} onClick={() => setFills(f => ({ ...f, [i]: cor }))} />
          ))}
        </svg>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 6 }}>
          {PALETA.map(c => (
            <button key={c} onClick={() => setCor(c)} aria-label={c}
              style={{
                aspectRatio: "1", borderRadius: 12, background: c, cursor: "pointer",
                border: cor === c ? "4px solid #1B2A6B" : "2px solid #E4E8F5",
              }} />
          ))}
        </div>
      </div>

      <Btn full color={pintadas ? "#00B894" : "#8B93AD"} disabled={!pintadas}
        onClick={() => onSalvar(fills, completo)}>
        {completo ? `✅ ${t.finish}` : `💾 ${t.saveAnyway}`}
      </Btn>
      {ganhouHoje >= ECON.colorDailyCap && (
        <div style={{ textAlign: "center", color: "#C9D2FF", fontSize: 11, fontWeight: 800, marginTop: 10 }}>
          {t.dailyCap}
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ---------- Galeria em fichário ----------
   Páginas de 9, como um álbum de figurinhas. */
const CATS_DESENHO = ["flag", "animal", "obj", "space", "gen"];
const CAT_ICON = { flag: "🏳️", animal: "🐾", obj: "🧸", space: "🪐", gen: "✨" };
const POR_PAGINA = 9;

function Gallery({ t, gallery, setScreen, abrirDesenho, gerados, gerarMais, coins }) {
  const [aba, setAba] = useState("saved");
  const [pag, setPag] = useState(0);

  const salvos = gallery.slice().reverse();
  const lista = aba === "saved"
    ? salvos
    : aba === "gen"
      ? gerados.map(desenhoGerado)
      : DESENHOS.filter(d => d.cat === aba);
  const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const p = Math.min(pag, paginas - 1);
  const fatia = lista.slice(p * POR_PAGINA, p * POR_PAGINA + POR_PAGINA);

  const trocarAba = a => { setAba(a); setPag(0); };

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🎨 {t.games.color}</div>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        <button onClick={() => trocarAba("saved")} className="chunky"
          style={{ flex: 1.3, padding: "9px 2px", fontSize: 12, background: aba === "saved" ? "#E84393" : "rgba(255,255,255,.18)" }}>
          🖼️ {gallery.length}
        </button>
        {CATS_DESENHO.map(c => (
          <button key={c} onClick={() => trocarAba(c)} className="chunky"
            style={{ flex: 1, padding: "9px 2px", fontSize: 16, background: aba === c ? "#6A5AE0" : "rgba(255,255,255,.18)" }}>
            {CAT_ICON[c]}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 10, minHeight: 300 }}>
        {fatia.length === 0 ? (
          <div style={{ display: "grid", placeItems: "center", height: 280, color: "#8B93AD", fontWeight: 800, fontSize: 14, textAlign: "center", padding: 20 }}>
            {t.emptyGallery}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {fatia.map((item, k) => {
              const art = aba === "saved" ? acharArte(item.id) : item;
              if (!art) return null;
              const fills = aba === "saved" ? item.fills : null;
              return (
                <button key={k} onClick={() => abrirDesenho(art, fills)}
                  style={{
                    border: "3px solid #E4E8F5", borderRadius: 16, background: "#fff",
                    padding: 4, cursor: "pointer", aspectRatio: "1",
                    display: "grid", placeItems: "center", overflow: "hidden",
                  }}>
                  <Mini art={art} fills={fills} size={82} />
                </button>
              );
            })}
            {Array.from({ length: POR_PAGINA - fatia.length }).map((_, k) => (
              <div key={`v${k}`} style={{ border: "3px dashed #EEF1FF", borderRadius: 16, aspectRatio: "1" }} />
            ))}
          </div>
        )}
      </div>

      {aba === "gen" && (
        <Btn full color="#9B59B6" disabled={coins < PRECO_GERAR}
          onClick={() => { gerarMais(); setPag(Math.floor(gerados.length / POR_PAGINA)); }}>
          ✨ {t.generateMore} · 🪙{PRECO_GERAR}
        </Btn>
      )}

      {paginas > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <Btn small color={p === 0 ? "#8B93AD" : "#4C6FFF"} disabled={p === 0} onClick={() => setPag(p - 1)} rotulo={t.a11yPrev}>◀</Btn>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: paginas }).map((_, k) => (
              <button key={k} onClick={() => setPag(k)} aria-label={`${k + 1}`}
                style={{
                  width: 11, height: 11, borderRadius: 6, border: "none", cursor: "pointer",
                  background: k === p ? "#F9A826" : "rgba(255,255,255,.35)",
                }} />
            ))}
          </div>
          <Btn small color={p >= paginas - 1 ? "#8B93AD" : "#4C6FFF"} disabled={p >= paginas - 1} onClick={() => setPag(p + 1)} rotulo={t.a11yNext}>▶</Btn>
        </div>
      )}
      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 11, fontWeight: 800, marginTop: 8 }}>
        {p + 1} / {paginas}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Quem vai jogar ---------- */
function Profiles({ t, profiles, openProfile, newProfile, editProfile, deleteProfile, resetProfile, setScreen, comSenha }) {
  const [editing, setEditing] = useState(false);
  const [ask, setAsk] = useState(null);
  const [zerar, setZerar] = useState(null);
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div className="display" style={{ color: "#fff", fontSize: 40, lineHeight: 1 }}>LUMUS</div>
        <div className="display" style={{ color: "#C9D2FF", fontSize: 18, marginTop: 6 }}>{t.players}</div>
      </div>

      {editing && (
        <div style={{ color: "#C9D2FF", fontWeight: 700, fontSize: 12, textAlign: "center", marginBottom: 10, lineHeight: 1.6 }}>
          ✏️ {t.editHint}
        </div>
      )}

      <div className="grid2">
        {profiles.map(pr => (
          <div key={pr.id} style={{ position: "relative" }}>
            <button onClick={() => !editing && comSenha(pr, openProfile)} className="card"
              style={{ border: "none", width: "100%", padding: 14, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Avatar a={pr.avatar} size={84} />
              <div className="display" style={{ color: "#1B2A6B", fontSize: 17, marginTop: 6 }}>{pr.name}</div>
              {pr.papel === "pai" && (
                <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11 }}>
                  {pr.pin ? "🔒" : "🧑‍🏫"} {t.roleParent}
                </div>
              )}
            </button>
            {editing && (
              <>
                <button onClick={() => comSenha(pr, setAsk)} className="chunky" aria-label={t.del}
                  style={{ position: "absolute", top: -6, right: -6, width: 34, height: 34, borderRadius: 17, background: "#E74C3C", fontSize: 15 }}>✕</button>
                <button onClick={() => comSenha(pr, setZerar)} className="chunky" aria-label={t.reset}
                  style={{ position: "absolute", top: -6, left: -6, width: 34, height: 34, borderRadius: 17, background: "#F9A826", fontSize: 15 }}>↺</button>
                <button onClick={() => comSenha(pr, editProfile)} className="chunky" aria-label={t.editProfile}
                  style={{ position: "absolute", bottom: -6, right: -6, width: 34, height: 34, borderRadius: 17, background: "#4C6FFF", fontSize: 14 }}>✏️</button>
              </>
            )}
          </div>
        ))}
        <button onClick={newProfile} className="card"
          style={{ border: "none", padding: 14, display: "grid", placeItems: "center", cursor: "pointer", background: "rgba(255,255,255,.9)" }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: "#EEF1FF", display: "grid", placeItems: "center", fontSize: 40, color: "#4C6FFF" }}>+</div>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginTop: 6 }}>{t.newPlayer}</div>
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Btn full small color="rgba(255,255,255,.2)" onClick={() => setEditing(e => !e)}>{editing ? "✓" : "✏️"}</Btn>
        <Btn full small color="rgba(255,255,255,.2)" onClick={() => setScreen("lang")}>🌐 {t.language}</Btn>
      </div>

      <div style={{ textAlign: "center", marginTop: 22, color: "#8E9CE0", fontSize: 11, fontWeight: 700, lineHeight: 1.6 }}>
        {t.parentsInfo}<br />
        <span style={{ color: "#6E7FCC" }}>{MADE_BY}</span>
      </div>

      {zerar && (
        <Modal onClose={() => setZerar(null)}>
          <div style={{ textAlign: "center" }}>
            <Avatar a={zerar.avatar} size={70} />
            <div style={{ color: "#1B2A6B", fontWeight: 800, margin: "12px 0", fontSize: 15 }}>{t.resetAsk}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full small color="#8B93AD" onClick={() => setZerar(null)}>{t.cancel}</Btn>
              <Btn full small color="#F9A826" onClick={() => { resetProfile(zerar.id); setZerar(null); }}>{t.reset}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {ask && (
        <Modal onClose={() => setAsk(null)}>
          <div style={{ textAlign: "center" }}>
            <Avatar a={ask.avatar} size={70} />
            <div style={{ color: "#1B2A6B", fontWeight: 800, margin: "12px 0", fontSize: 15 }}>{t.deleteAsk}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full small color="#8B93AD" onClick={() => setAsk(null)}>{t.cancel}</Btn>
              <Btn full small color="#E74C3C" onClick={() => { deleteProfile(ask.id); setAsk(null); }}>{t.del}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Idiomas ---------- */
function LangScreen({ t, lang, pickLang, setScreen, back }) {
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(back)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24 }}>🌐 {t.language}</div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {Object.entries(LANG_CATALOG).map(([code, label]) => {
          const on = lang === code;
          return (
            <div key={code} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <div className="display" style={{ flex: 1, color: "#1B2A6B", fontSize: 17 }}>{label}</div>
              <Btn small color={on ? "#00B894" : "#4C6FFF"} onClick={() => pickLang(code)}>
                {on ? "✓" : t.use}
              </Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Senha do responsável ----------
   ISTO É UMA TRANCA CONTRA CRIANÇA, NÃO SEGURANÇA.

   Tudo mora no aparelho, em localStorage. Quem souber abrir o navegador por
   dentro passa por aqui em um minuto — e não há como ser diferente num app
   sem servidor e sem conta. O que estes quatro números resolvem é o problema
   real: a criança de 6 anos não entra na tela do pai nem apaga o perfil dele.

   Guardo o resumo SHA-256 com o id do perfil como tempero, para a senha não
   ficar legível a olho nu no armazenamento. Quatro dígitos se quebram por
   tentativa e erro; o resumo só evita a leitura casual.

   ponytail: quatro dígitos e resumo local. Se um dia isso virar conta de
   verdade, aí sim entra senha forte e servidor. */
async function resumoSenha(pin, id) {
  const txt = `lumus:${id}:${pin}`;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Sem WebCrypto (contexto inseguro): guarda um resumo fraco, melhor que texto puro.
    let h = 2166136261;
    for (const c of txt) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    return "fraco:" + h.toString(16);
  }
}

/* Teclado de quatro dígitos. Sem teclado do sistema: dedo de adulto com o
   celular na mão da criança, e nada de texto para ler. */
function PinModal({ t, titulo, onOk, onCancelar, erro }) {
  const [pin, setPin] = useState("");
  const digitar = d => setPin(x => (x + d).slice(0, 4));
  return (
    <Modal onClose={onCancelar}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>🔒</div>
        <div className="display" style={{ fontSize: 21, color: "#1B2A6B", margin: "6px 0 4px" }}>{titulo}</div>
        <div style={{ color: erro ? "#E74C3C" : "#8B93AD", fontWeight: 800, fontSize: 12, marginBottom: 12 }}>
          {erro ? t.pinWrong : t.pinHint}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 34, height: 42, borderRadius: 12, display: "grid", placeItems: "center",
              background: "#EEF1FF", color: "#1B2A6B", fontWeight: 900, fontSize: 22,
              border: pin.length === i ? "3px solid #4C6FFF" : "3px solid #E4E8F5",
            }}>{pin[i] ? "•" : ""}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map(d => (
            <button key={d} className="chunky"
              disabled={d === "✓" && pin.length < 4}
              onClick={() => d === "⌫" ? setPin(x => x.slice(0, -1)) : d === "✓" ? onOk(pin) : digitar(d)}
              style={{
                padding: "14px 0", fontSize: 19,
                background: d === "✓" ? (pin.length === 4 ? "#00B894" : "#B9C0CC") : d === "⌫" ? "#8B93AD" : "#4C6FFF",
              }}>{d}</button>
          ))}
        </div>
        <button onClick={onCancelar}
          style={{ background: "none", border: "none", color: "#8B93AD", fontWeight: 800, fontSize: 13, marginTop: 12, cursor: "pointer" }}>
          {t.cancel}
        </button>
      </div>
    </Modal>
  );
}

/* O placar de uma partida em dupla — o mesmo na memória e no quiz, porque é a
   mesma pergunta: quem fez quantos, e quanto os dois levaram. */
function PlacarDupla({ t, eu, outro, pontos, vencedor, reward, rodape, aoRepetir, aoSair }) {
  return (
    <div className="narrow" style={{ paddingTop: 20 }}>
      <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 54 }}>{vencedor == null ? "🤝" : "🏆"}</div>
        <div className="display" style={{ fontSize: 24, color: "#1B2A6B" }}>
          {vencedor == null ? t.duoTie : t.duoWon.replace("{quem}", (vencedor === 0 ? eu : outro)?.name || "—")}
        </div>

        <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
          {[eu, outro].map((j, i) => (
            <div key={i} style={{ flex: 1, background: "#EEF1FF", borderRadius: 16, padding: 12 }}>
              <div style={{ display: "grid", placeItems: "center" }}><Rosto p={j} size={44} /></div>
              <div style={{ color: "#1B2A6B", fontWeight: 900, fontSize: 12, marginTop: 5,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j?.name || "—"}</div>
              <div className="display" style={{ fontSize: 26, color: vencedor === i ? "#00B894" : "#1B2A6B" }}>
                {pontos?.[i] ?? 0}
              </div>
            </div>
          ))}
        </div>

        {rodape && <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 12 }}>{rodape}</div>}

        {/* Os dois levam o mesmo, tenham ganhado ou perdido. */}
        <div className="display" style={{ fontSize: 18, color: reward ? "#F9A826" : "#8B93AD", marginBottom: 16 }}>
          {reward ? `🪙 ${reward} ${t.duoBoth}` : t.duoPaidToday}
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          <Btn full color="#4C6FFF" onClick={aoRepetir}>{t.again}</Btn>
          <Btn full color="#8B93AD" onClick={aoSair} rotulo={t.a11yBack}>←</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Meu Caderno ----------
   Registrar, o 4º R. A criança escreve o que ficou — e quem ainda não escreve
   toca carimbos. Os dois valem: o caderno não pode ser só de quem já lê.

   Nada aqui é corrigido nem pontuado. É o único lugar do app assim. */
function EscreverScreen({ t, lang, rascunho, salvar, cancelar }) {
  const [texto, setTexto] = useState("");
  const [marcados, setMarcados] = useState([]);
  const txt = o => o[lang] || o.en;
  const vazio = !texto.trim() && !marcados.length;

  const alternar = id => setMarcados(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id]);

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={cancelar} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 20, flex: 1 }}>📔 {t.notebook}</div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Mundi size={44} bounce={false} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {rascunho.sobre && (
              <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 3 }}>
                {rascunho.sobre}
              </div>
            )}
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 16, lineHeight: 1.45 }}>
              {txt(rascunho.pergunta)}
            </div>
          </div>
        </div>
      </div>

      {/* Os carimbos vêm antes do texto: quem não escreve precisa encontrar o
          seu jeito primeiro, e não depois de um campo que não sabe usar. */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>{t.howWasIt}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {CARIMBOS.map(c => {
            const on = marcados.includes(c.id);
            return (
              <button key={c.id} onClick={() => alternar(c.id)}
                style={{ border: "none", cursor: "pointer", borderRadius: 999, padding: "8px 12px",
                  background: on ? "#4C6FFF" : "#E9ECF7", color: on ? "#fff" : "#3B4468",
                  fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 16 }}>{c.e}</span>{txt(c)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>{t.writeHere}</div>
        <textarea value={texto} onChange={e => setTexto(e.target.value.slice(0, 500))}
          rows={5} placeholder={t.writePlaceholder}
          style={{ width: "100%", boxSizing: "border-box", border: "2px solid #E4E8F5", borderRadius: 14,
            padding: 12, fontSize: 15, fontWeight: 700, color: "#1B2A6B", fontFamily: "inherit",
            resize: "none", outline: "none", lineHeight: 1.5 }} />
        <div style={{ textAlign: "right", color: "#B3BBD4", fontWeight: 800, fontSize: 11 }}>{texto.length}/500</div>
      </div>

      <Btn full color="#00B894" disabled={vazio}
        onClick={() => salvar({ texto: texto.trim(), carimbos: marcados, principio: rascunho.principio, sobre: rascunho.sobre })}>
        📔 {t.saveNote}
      </Btn>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* Uma página do caderno, do jeito que ela é lida — pela criança e pelo pai. */
function PaginaCaderno({ r, lang, compacta }) {
  const cor = CORES_PRINCIPIO[r.p] || "#8B93AD";
  return (
    <div className="card" style={{ padding: compacta ? 10 : 14, borderLeft: `6px solid ${cor}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, flex: 1 }}>{diaCurto(r.d, lang)}</div>
        {r.s && <div style={{ color: "#B3BBD4", fontWeight: 800, fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "55%" }}>{r.s}</div>}
      </div>
      {!!r.c?.length && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: r.t ? 6 : 0 }}>
          {r.c.map(id => {
            const c = carimboPorId(id);
            return c ? (
              <span key={id} style={{ background: "#EEF1FF", borderRadius: 999, padding: "3px 8px",
                fontWeight: 800, fontSize: 11, color: "#3B4468" }}>
                {c.e} {c[lang] || c.en}
              </span>
            ) : null;
          })}
        </div>
      )}
      {r.t && (
        <div style={{ color: "#1B2A6B", fontWeight: 700, fontSize: compacta ? 12 : 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
          {r.t}
        </div>
      )}
    </div>
  );
}

function CadernoScreen({ t, lang, caderno, setScreen, novo, voltar }) {
  const POR_PAGINA = 8;
  const paginas = Math.max(1, Math.ceil(caderno.length / POR_PAGINA));
  const [pag, setPag] = useState(0);           // 0 = as mais recentes
  const p = Math.min(pag, paginas - 1);
  const doNovoAoVelho = [...caderno].reverse();
  const fatia = doNovoAoVelho.slice(p * POR_PAGINA, (p + 1) * POR_PAGINA);

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltar)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 20, flex: 1 }}>📔 {t.notebook}</div>
        {caderno.length > 0 && (
          <div style={{ background: "rgba(255,255,255,.2)", color: "#fff", borderRadius: 999,
            padding: "6px 12px", fontWeight: 900, fontSize: 13 }}>
            {caderno.length}
          </div>
        )}
      </div>

      <Btn full color="#00B894" onClick={novo}>✏️ {t.newNote}</Btn>
      <div style={{ height: 12 }} />

      {!caderno.length ? (
        <div className="card" style={{ padding: 22, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>📔</div>
          <div style={{ color: "#3B4468", fontWeight: 800, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>
            {t.notebookEmpty}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 9 }}>
          {fatia.map((r, i) => <PaginaCaderno key={p * POR_PAGINA + i} r={r} lang={lang} />)}
        </div>
      )}

      {paginas > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <Btn small color={p === 0 ? "rgba(255,255,255,.12)" : "#4C6FFF"} disabled={p === 0} onClick={() => setPag(p - 1)} rotulo={t.a11yPrev}>◀</Btn>
          <div style={{ flex: 1, textAlign: "center", color: "#C9D2FF", fontWeight: 900, fontSize: 12 }}>{p + 1} / {paginas}</div>
          <Btn small color={p >= paginas - 1 ? "rgba(255,255,255,.12)" : "#4C6FFF"} disabled={p >= paginas - 1} onClick={() => setPag(p + 1)} rotulo={t.a11yNext}>▶</Btn>
        </div>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Momento em Família ----------
   O devocional do dia, para ser lido junto: um versículo, uma pergunta para
   conversar e uma pequena atitude para hoje.

   Não existe resposta certa aqui, e é de propósito. O resto do app mede
   acerto; este pedaço mede presença. */
function DevocionalScreen({ t, lang, momento, marcarMomento, feitoHoje, setScreen, voltar }) {
  const { principio, dia } = devocionalDoDia();
  const txt = o => o[lang] || o.en;
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltar)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 20, flex: 1 }}>🕊️ {t.momentTitle}</div>
        {momento.sequencia > 0 && (
          <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900, fontSize: 13 }}>
            🔥 {momento.sequencia}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 16, background: principio.cor, display: "grid", placeItems: "center", fontSize: 24 }}>
            {principio.icone}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>{t.principle}</div>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 20, lineHeight: 1.1 }}>{txt(principio)}</div>
          </div>
        </div>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 19, lineHeight: 1.45 }}>“{txt(dia.v)}”</div>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 12, marginTop: 6 }}>{txt(dia.ref)}</div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Mundi size={44} bounce={false} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 3 }}>{t.talkAbout}</div>
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, lineHeight: 1.5 }}>{txt(dia.q)}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12, borderLeft: `8px solid ${principio.cor}` }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 3 }}>{t.todayDo}</div>
        <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, lineHeight: 1.5 }}>{txt(dia.a)}</div>
      </div>

      {feitoHoje ? (
        <div className="card" style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 32 }}>💚</div>
          <div className="display" style={{ color: "#00B894", fontSize: 18, marginTop: 4 }}>{t.momentDone}</div>
          <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 12, marginTop: 4 }}>
            {t.momentCount.replace("{n}", momento.feitos || 0)}
          </div>
        </div>
      ) : (
        <Btn full color="#00B894" onClick={marcarMomento}>✓ {t.momentMark}</Btn>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}

/* O atalho quando a família já disse que quer, e o convite quando ninguém
   escolheu ainda. Um dos dois, nunca os dois. */
function CartaoMomento({ t, lang, momento, feitoHoje, setMomento, abrir, responsavel }) {
  const { principio } = devocionalDoDia();

  if (momento.fe == null) return (
    <div className="card" style={{ padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 26 }}>🕊️</div>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 17, flex: 1 }}>{t.momentTitle}</div>
      </div>
      <div style={{ color: "#3B4468", fontWeight: 700, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{t.momentInvite}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn full small color="#00B894" onClick={() => { setMomento(m => ({ ...m, fe: true })); abrir(); }}>{t.momentYes}</Btn>
        <Btn full small color="#8B93AD" onClick={() => setMomento(m => ({ ...m, fe: false }))}>{t.momentNo}</Btn>
      </div>
    </div>
  );

  /* Disse "agora não". Some do hub, mas o responsável precisa de um caminho
     de volta — senão a escolha de um dia vira definitiva. */
  if (!momento.fe) return responsavel ? (
    <button onClick={() => { setMomento(m => ({ ...m, fe: true })); abrir(); }} className="card"
      style={{ border: "none", width: "100%", padding: 12, marginBottom: 14, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
      <div style={{ fontSize: 20 }}>🕊️</div>
      <div style={{ flex: 1, color: "#6C7695", fontWeight: 800, fontSize: 13 }}>{t.momentTitle}</div>
      <div style={{ color: "#00B894", fontWeight: 900, fontSize: 13 }}>{t.momentTurnOn}</div>
    </button>
  ) : null;

  return (
    <button onClick={abrir} className="card"
      style={{ border: "none", width: "100%", padding: 14, marginBottom: 14, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12, textAlign: "left",
        borderLeft: `8px solid ${principio.cor}` }}>
      <div style={{ fontSize: 28 }}>{feitoHoje ? "💚" : "🕊️"}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.momentTitle}</div>
        <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 11 }}>
          {feitoHoje ? t.momentDone : `${principio.icone} ${principio[lang] || principio.en}`}
        </div>
      </div>
      {momento.sequencia > 0 && (
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "4px 10px", fontWeight: 900, fontSize: 12 }}>
          🔥 {momento.sequencia}
        </div>
      )}
    </button>
  );
}

/* ---------- Acompanhamento do responsável ----------
   Um perfil marcado como responsável não joga: abre esta tela, que lê o
   save de cada criança do próprio aparelho e mostra até onde ela chegou.
   Nada sai do aparelho — é o mesmo localStorage, aberto por outra porta. */
function nomeDaTrilha(cont, t) {
  if (t.continents?.[cont]) return `${t.games.flags} · ${t.continents[cont]}`;
  if (cont.startsWith("cap_")) {
    const r = cont.slice(4);
    return `${t.games.capitals} · ${r === "br" ? t.capBrasil : r === "us" ? t.capEUA : t.continents[r] || r}`;
  }
  const alvo = alvoDe(cont);
  if (alvo) return `${t.games.words} · ${LANG_CATALOG[alvo] || alvo}`;
  const q = QUIZZES[cont];
  return q ? q.nome(t) : cont;
}

/* Melhor nível vencido em cada tema da memória. memBest é "tema:nivel", e o
   que interessa ao adulto é até onde a criança chegou em cada um. */
function memoriaResumo(save) {
  const por = new Map();
  for (const [chave, v] of Object.entries(save?.memBest || {})) {
    const corte = chave.lastIndexOf(":");
    const tema = chave.slice(0, corte), nivel = chave.slice(corte + 1);
    const ordem = DIFFS.indexOf(nivel);
    if (ordem < 0) continue;
    const atual = por.get(tema);
    if (!atual || ordem > atual.ordem) por.set(tema, { tema, nivel, ordem, ...v });
  }
  return [...por.values()].sort((a, b) => b.ordem - a.ordem);
}

function nomeDoTemaMemoria(tema, t) {
  const alvo = alvoDe(tema);
  if (alvo) return `${t.games.wordMem} · ${LANG_CATALOG[alvo] || alvo}`;
  return { flags: t.games.memory, animals: t.games.animals, arts: t.games.artMem, bible: t.games.bibleMem }[tema] || tema;
}

/* Um cartão de criança: os números da semana escolhida, os desenhos daquela
   semana, os recordes de memória e o progresso por trilha. */
function CartaoFilho({ t, lang, perfil, save, presente, presentear }) {
  const st = save?.stats || {};
  const semanas = save?.semanas || {};
  const chaves = Object.keys(semanas).sort();
  const atual = semanaAtual();
  if (!chaves.includes(atual)) chaves.push(atual);      // a semana corrente sempre aparece
  const [qual, setQual] = useState(chaves.length - 1);
  const chave = chaves[Math.min(qual, chaves.length - 1)];
  const semana = { ...SEMANA_VAZIA, ...(semanas[chave] || {}) };
  const vazia = !Object.values(semana).some(v => v > 0);

  const conquistas = ACHIEVEMENTS.filter(a => a.test(st)).length;
  const trilhas = Object.entries(save?.progress || {}).filter(([, v]) => v > 0);
  // A galeria guarda a data de cada desenho: dá para mostrar os da semana.
  const [ini] = [chave];
  const fimSemana = (() => { const [a, m, d] = chave.split("-").map(Number); const x = new Date(a, m - 1, d + 6);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; })();
  const desenhosDaSemana = (save?.gallery || []).filter(g => g.data >= ini && g.data <= fimSemana);
  const cadernoDaSemana = (save?.caderno || []).filter(r => r.d >= ini && r.d <= fimSemana);

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <Avatar a={perfil.avatar} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 19 }}>{perfil.name || "—"}</div>
          <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 12 }}>
            {perfil.idade ? `${perfil.idade} ${t.years} · ` : ""}
            {ehLeitor(perfil) ? t.reads : t.readsNot}
          </div>
        </div>
      </div>

      {/* A semana, que recomeça todo domingo. É a primeira coisa do cartão
          porque é a pergunta que o adulto faz: o que ele fez esta semana? */}
      <div style={{ background: "#EEF1FF", borderRadius: 16, padding: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Btn small color={qual === 0 ? "#C7CEE0" : "#4C6FFF"} disabled={qual === 0}
            onClick={() => setQual(q => q - 1)} rotulo={t.a11yPrev}>◀</Btn>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 14 }}>
              {chave === atual ? t.thisWeek : t.week} {intervaloDaSemana(chave, lang)}
            </div>
          </div>
          <Btn small color={qual >= chaves.length - 1 ? "#C7CEE0" : "#4C6FFF"} disabled={qual >= chaves.length - 1}
            onClick={() => setQual(q => q + 1)} rotulo={t.a11yNext}>▶</Btn>
        </div>

        {vazia ? (
          <div style={{ textAlign: "center", color: "#8B93AD", fontWeight: 700, fontSize: 11, padding: "2px 0 4px" }}>
            {t.weekNothing}
          </div>
        ) : (
          <div style={{ display: "flex" }}>
            {[["🎮", semana.rodadas], ["🎯", semana.certas], ["⭐", semana.estrelas],
              ["🎨", semana.desenhos], ["🧠", semana.memorias], ["📔", semana.registros],
              ["👥", semana.duplas], ["🕊️", semana.momentos], ["🪙", semana.lumicoins]].map(([ic, v]) => (
              <div key={ic} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 14 }}>{ic}</div>
                <div className="display" style={{ fontSize: String(v).length > 3 ? 13 : 15, color: "#1B2A6B" }}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {desenhosDaSemana.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
            {desenhosDaSemana.slice(-5).reverse().map((g, i) => {
              const art = acharArte(g.id);
              return art ? (
                <div key={i} style={{ border: "2px solid #fff", borderRadius: 12, padding: 2, background: "#fff", lineHeight: 0 }}>
                  <Mini art={art} fills={g.fills} size={40} />
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, flex: 1 }}>🎁 {t.giveGift}</div>
        {[10, 25, 50].map(v => (
          <Btn key={v} small color={presente.restante >= v ? "#E84393" : "#C7CEE0"}
            disabled={presente.restante < v} onClick={() => presentear(perfil, v)}>+{v}</Btn>
        ))}
      </div>

      <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginBottom: 5 }}>∑ {t.allTime}</div>
      <div style={{ display: "flex", marginBottom: 10 }}>
        {[["🎮", st.rounds || 0], ["⭐", st.stars || 0], ["🏅", `${conquistas}/${ACHIEVEMENTS.length}`],
          ["📅", st.dayStreak || 0], ["🪙", st.earned || 0]].map(([ic, v]) => (
          <div key={ic} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>{ic}</div>
            <div className="display" style={{ fontSize: 16, color: "#1B2A6B" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* O caderno da criança, com as palavras dela. É a parte do cartão que
          o adulto lê inteira — o resto ele confere. */}
      {cadernoDaSemana.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, flex: 1 }}>📔 {t.notebook}</div>
            <div style={{ color: "#6C7695", fontWeight: 900, fontSize: 11 }}>{st.registros || 0} {t.notesTotal}</div>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {cadernoDaSemana.slice(-3).reverse().map((r, i) => (
              <PaginaCaderno key={i} r={r} lang={lang} compacta />
            ))}
          </div>
        </div>
      )}

      {!!(save?.gallery?.length) && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, flex: 1 }}>🎨 {t.games.color}</div>
            <div style={{ color: "#6C7695", fontWeight: 900, fontSize: 11 }}>{st.colorDone || 0} {t.painted}</div>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {save.gallery.slice(-5).reverse().map((g, i) => {
              const art = acharArte(g.id);
              return art ? (
                <div key={i} style={{ border: "2px solid #E4E8F5", borderRadius: 12, padding: 2, background: "#fff", lineHeight: 0 }}>
                  <Mini art={art} fills={g.fills} size={44} />
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {memoriaResumo(save).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginBottom: 5 }}>🧠 {t.memories}</div>
          <div style={{ display: "grid", gap: 4 }}>
            {memoriaResumo(save).map(m => (
              <div key={m.tema} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ background: BAND_COLOR[m.nivel], color: "#fff", borderRadius: 8,
                  padding: "2px 6px", fontWeight: 900, fontSize: 10, whiteSpace: "nowrap" }}>
                  {MEM_LEVELS[m.nivel].cols}×{MEM_LEVELS[m.nivel].rows}
                </div>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 800, color: "#3B4468", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {nomeDoTemaMemoria(m.tema, t)}
                </div>
                <div style={{ fontSize: 10, letterSpacing: -1 }}>
                  {[1, 2, 3].map(i => <span key={i} style={{ opacity: (m.stars || 0) >= i ? 1 : .25 }}>★</span>)}
                </div>
                {m.time != null && (
                  <div style={{ fontSize: 10, fontWeight: 900, color: "#8B93AD", width: 40, textAlign: "right" }}>
                    ⏱️ {tempoFmt(m.time)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {trilhas.length > 0 && (
        <>
          <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginBottom: 5 }}>{t.byGame}</div>
          <div style={{ display: "grid", gap: 5 }}>
            {trilhas.map(([cont, feitas]) => {
              const total = totalDe(cont);
              return (
                <div key={cont} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 800, color: "#3B4468", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {nomeDaTrilha(cont, t)}
                  </div>
                  <div style={{ width: 70, height: 8, borderRadius: 5, background: "#E9ECF7", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (feitas / total) * 100)}%`, height: "100%", background: "#00B894" }} />
                  </div>
                  <div style={{ width: 46, textAlign: "right", fontSize: 11, fontWeight: 900, color: "#6C7695" }}>
                    {feitas}/{total}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function FamilyScreen({ t, lang, familia, setScreen, presente, presentear, momento, setMomento, momentoFeitoHoje }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("profiles")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 22, flex: 1 }}>👨‍👩‍👧 {t.family}</div>
      </div>
      <div style={{ color: "#C9D2FF", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>{t.familyHint}</div>

      <CartaoMomento {...{ t, lang, momento, setMomento, feitoHoje: momentoFeitoHoje, responsavel: true, abrir: () => setScreen("devocional") }} />

      {/* A mesada da semana. Fica no topo porque é o que traz o adulto de volta. */}
      <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 30 }}>🎁</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{t.giftWeek}</div>
          <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, lineHeight: 1.5 }}>{t.giftHint}</div>
        </div>
        <div className="display" style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 14px", fontSize: 17 }}>
          🪙 {presente.restante}
        </div>
      </div>

      {!familia.length && (
        <div className="card" style={{ padding: 20, textAlign: "center", color: "#6C7695", fontWeight: 800, fontSize: 14 }}>
          {t.familyEmpty}
        </div>
      )}

      <div className="lista">
        {familia.map(({ perfil, save }) => (
          <CartaoFilho key={perfil.id} {...{ t, lang, perfil, save, presente, presentear }} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        {/* O responsável também joga: é o mesmo perfil, com progresso próprio. */}
        <Btn full color="#00B894" onClick={() => setScreen("home")}>🎮 {t.play}</Btn>
        <Btn full color="#4C6FFF" onClick={() => setScreen("profiles")}>👥 {t.switchPlayer}</Btn>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Perfil do jogador ---------- */
function PlayerCard({ t, lang, player, coins, stats, progress, unlocked, seenAch, setScreen, abrir, podeResgatar, resgatar }) {
  const verso = versoDoDia(lang);
  const Num = ({ icon, n, label }) => (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div className="display" style={{ fontSize: 20, color: "#1B2A6B", lineHeight: 1.2 }}>{n}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#8B93AD" }}>{label}</div>
    </div>
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 22, flex: 1 }}>{t.profileTitle}</div>
      </div>

      <div className="card" style={{ padding: 18, textAlign: "center", marginBottom: 12 }}>
        {/* O avatar sozinho deixava metade do cartão em branco. Ali agora fica
            o versículo do dia — o mesmo o dia inteiro, para dar tempo de
            decorar, e só de Salmos e Provérbios. */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
          <Avatar a={player.avatar} size={104} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <Mundi size={24} />
              <span className="display" style={{ color: "#8B93AD", fontSize: 12, letterSpacing: 1 }}>LUMUS</span>
            </div>
            <div style={{ color: "#3B4468", fontWeight: 800, fontSize: 13, lineHeight: 1.45 }}>
              “{verso.texto}”
            </div>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginTop: 5 }}>{verso.ref}</div>
          </div>
        </div>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 24, marginTop: 10 }}>{player.name}</div>
        <div style={{ display: "inline-block", background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 16px", fontWeight: 900, marginTop: 8 }}>
          <Coin n={coins} />
        </div>
        {podeResgatar && (
          <div style={{ marginTop: 10 }}>
            <Btn small color="#00B894" onClick={resgatar}>🎁 {t.claim} +{ECON.refillAmount}</Btn>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex" }}>
        <Num icon="🎮" n={stats.rounds} label={t.statRounds} />
        <Num icon="💯" n={stats.perfect} label={t.statPerfect} />
        <Num icon="🎯" n={stats.correct} label={t.statFlags} />
        <Num icon="🔥" n={stats.bestStreak} label={t.streak} />
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex" }}>
        <Num icon="🪙" n={stats.earned} label={t.coins} />
        <Num icon="📅" n={stats.dayStreak} label={t.statDays} />
        <Num icon="⭐" n={stats.stars || 0} label={t.awards} />
        <Num icon="🏅" n={`${seenAch.length}/${ACHIEVEMENTS.length}`} label={t.achievementsGot} />
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 16, marginBottom: 10 }}>🎖️ {t.badges}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {BADGES.map(b => {
            const tem = b.test(stats);
            return (
              <div key={b.id} title={b.dPt} style={{ textAlign: "center", opacity: tem ? 1 : .35 }}>
                <div style={{
                  width: 46, height: 46, margin: "0 auto", borderRadius: 23,
                  background: tem ? b.cor : "#E4E8F5", display: "grid", placeItems: "center", fontSize: 22,
                  filter: tem ? "none" : "grayscale(1)",
                  boxShadow: tem ? `0 3px 0 rgba(0,0,0,.18)` : "none",
                }}>{tem ? b.icon : "🔒"}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#6C7695", marginTop: 3, lineHeight: 1.2 }}>{b[lang] || b.en}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 16, marginBottom: 10 }}>🌍 {t.worldProgress}</div>
        {ROUTE.map(r => {
          const aberto = unlocked.includes(r.id);
          const feitas = progress[r.id] || 0;
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, opacity: aberto ? 1 : .4 }}>
              <div style={{ width: 96, fontSize: 11, fontWeight: 800, color: "#3B4468" }}>{t.continents[r.id]}</div>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#E9ECF7", overflow: "hidden" }}>
                <div style={{ width: `${(feitas / totalDe(r.id)) * 100}%`, height: "100%", background: r.color, borderRadius: 6 }} />
              </div>
              <div style={{ width: 34, textAlign: "right", fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                {aberto ? `${feitas}/${totalDe(r.id)}` : "🔒"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Btn full color="#E84393" onClick={() => abrir("shop", "player")}>🛍️ {t.shop}</Btn>
        <Btn full color="#00C2CB" onClick={() => abrir("awards", "player")}>🏅 {t.awards}</Btn>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn full color="#4C6FFF" onClick={() => setScreen("profiles")}>👥 {t.switchPlayer}</Btn>
        <Btn full color="#6A5AE0" onClick={() => setScreen("lang")}>🌐 {t.language}</Btn>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Mapa das capitais ---------- */
function CapMap({ t, lang, progress, coins, setSel, setScreen, temSecao, comprarSecao }) {
  const nomeRegiao = r =>
    r.id === "cap_br" ? t.capBrasil
    : r.id === "cap_us" ? t.capEUA
    : t.continents[r.id.slice(4)];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🏛️ {t.games.capitals}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div className="lista">
        {CAP_REGIOES.map((r, i) => {
          const feitas = progress[r.id] || 0;
          const preco = CAP_PRECO[r.id];
          const chave = `r:${r.id}`;
          const aberto = !preco || temSecao(chave);
          const anteriorOk = i === 0 || !CAP_PRECO[CAP_REGIOES[i - 1].id] || temSecao(`r:${CAP_REGIOES[i - 1].id}`);
          return (
            <div key={r.id} className="card" style={{ padding: 13, display: "flex", alignItems: "center", gap: 12, opacity: aberto || anteriorOk ? 1 : .45 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: aberto ? r.cor : "#B9C0CC", display: "grid", placeItems: "center", fontSize: 24 }}>
                {aberto ? r.icone : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{nomeRegiao(r)}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                  {aberto ? `⭐ ${feitas}/${totalDe(r.id)}` : anteriorOk ? `${t.unlockFor} 🪙${preco}` : t.needPrev}
                </div>
              </div>
              {aberto ? (
                <Btn small color={r.cor}
                  onClick={() => { setSel({ cont: r.id, stage: Math.min(totalDe(r.id), feitas + 1) }); setScreen("stages"); }}>
                  {t.play}
                </Btn>
              ) : anteriorOk ? (
                <Btn small color={coins >= preco ? "#E84393" : "#8B93AD"} disabled={coins < preco}
                  onClick={() => comprarSecao(chave, preco)}>🔓 🪙{preco}</Btn>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Qual idioma aprender ---------- */
function LangGame({ t, lang, escolher, setScreen }) {
  const opcoes = Object.keys(LANG_CATALOG).filter(c => c !== lang && T[c]);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🔤 {t.whichLang}</div>
      </div>
      <div className="lista">
        {opcoes.map(c => (
          <button key={c} onClick={() => escolher(c)} className="card"
            style={{ border: "none", padding: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#4C6FFF", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 14 }}>
              {c.toUpperCase()}
            </div>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 19 }}>{LANG_CATALOG[c]}</div>
          </button>
        ))}
      </div>
      <div style={{ color: "#A7B3EA", fontSize: 11, fontWeight: 700, marginTop: 14, textAlign: "center", lineHeight: 1.7 }}>
        {t.langHint}
      </div>
    </div>
  );
}

/* ---------- Home do hub ---------- */
function Home({ t, lang, player, coins, nextRefill, setScreen, profiles, onPickGame, abrir, podeResgatar, resgatar, jogosAbertos, abrirJogo, momento, setMomento, momentoFeitoHoje }) {
  return (
    <div>
      <TopBar t={t} player={player} coins={coins} nextRefill={nextRefill}
        onAvatar={() => setScreen("player")} onSwitch={() => setScreen("profiles")} quantos={profiles?.length || 1}
        podeResgatar={podeResgatar} resgatar={resgatar} />

      {podeResgatar && (
        <div className="card pop" style={{ padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 34 }}>🎁</div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{t.claimTitle}</div>
            <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 12 }}>+{ECON.refillAmount} 🪙</div>
          </div>
          <Btn small color="#00B894" onClick={resgatar}>{t.claim}</Btn>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16 }}>
        <Mundi size={64} />
        <div className="card" style={{ padding: "12px 14px", flex: 1, borderBottomLeftRadius: 6 }}>
          <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 14 }}>{t.mascotHome}</div>
        </div>
      </div>

      {/* Antes dos jogos: a família vem primeiro, e o convite só o adulto
          responde — a decisão é do lar, não da criança. */}
      {(momento.fe != null || player.papel === "pai") && (
        <CartaoMomento {...{ t, lang, momento, setMomento, feitoHoje: momentoFeitoHoje, abrir: () => setScreen("devocional") }} />
      )}

      <div className="display" style={{ color: "#fff", fontSize: 22, marginBottom: 10 }}>{t.home}</div>
      {/* Para quem ainda não lê, os jogos de texto aparecem trancados. Dizer
          por quê evita a criança achar que quebrou — e o adulto, que faltou. */}
      {!ehLeitor(player) && (
        <div style={{ color: "#A7B3EA", fontWeight: 700, fontSize: 11, marginTop: -6, marginBottom: 10 }}>
          🔒 {t.needsReading}
        </div>
      )}

      {CATALOG.map(c => (
        <div key={c.id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <span className="display" style={{ color: "#C9D2FF", fontSize: 16 }}>{t.cat[c.id]}</span>
          </div>
          <div className="grid2">
            {c.games.map((g, gi) => {
              const aberto = jogosAbertos.includes(g.id);
              const anteriorOk = gi === 0 || jogosAbertos.includes(c.games[gi - 1].id);
              const compravel = !aberto && anteriorOk && g.ready;
              return (
                <button key={g.id} disabled={!g.ready || (!aberto && !compravel)}
                  onClick={() => aberto ? onPickGame(g.id) : compravel && abrirJogo(g.id)}
                  className="card" style={{
                    border: "none", padding: 14, textAlign: "left",
                    cursor: aberto || compravel ? "pointer" : "default",
                    opacity: !g.ready ? .35 : aberto ? 1 : compravel ? .92 : .4,
                    borderTop: `7px solid ${aberto ? g.color : "#B9C0CC"}`,
                  }}>
                  <div style={{ fontSize: 32 }}>{!g.ready ? "🔒" : aberto ? g.icon : compravel ? "🔓" : "🔒"}</div>
                  <div className="display" style={{ color: "#1B2A6B", fontSize: 15, lineHeight: 1.15, marginTop: 4 }}>{t.games[g.id]}</div>
                  {!g.ready && <div style={{ color: "#8B93AD", fontSize: 11, fontWeight: 800, marginTop: 2 }}>{t.soon}</div>}
                  {g.ready && compravel && (
                    <div style={{ color: coins >= precoDe(g) ? "#E84393" : "#8B93AD", fontSize: 12, fontWeight: 900, marginTop: 3 }}>
                      🪙 {precoDe(g)}
                    </div>
                  )}
                  {g.ready && !aberto && !compravel && (
                    <div style={{ color: "#8B93AD", fontSize: 11, fontWeight: 800, marginTop: 2 }}>{t.needPrev}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Btn full color="#8D6E3A" onClick={() => abrir("caderno", "home")}>📔 {t.notebook}</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <Btn full color="#E84393" onClick={() => abrir("shop", "home")}>🛍️ {t.shop}</Btn>
        <Btn full color="#00C2CB" onClick={() => abrir("awards", "home")}>🏅 {t.awards}</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {player.papel === "pai" && (
          <Btn full small color="rgba(255,255,255,.2)" onClick={() => setScreen("familia")}>👨‍👩‍👧 {t.family}</Btn>
        )}
        <Btn full small color="rgba(255,255,255,.2)" onClick={() => setScreen("lang")}>🌐 {t.language}</Btn>
      </div>
      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 11, fontWeight: 700, marginTop: 14, lineHeight: 1.6 }}>
        🔒 {t.parentsInfo}<br />
        <span style={{ color: "#7E8CD0" }}>{MADE_BY}</span>
      </div>
    </div>
  );
}

/* ---------- Mapa ---------- */
function MapScreen({ t, lang, player, coins, nextRefill, unlocked, progress, unlockContinent, setSel, setScreen, stats, tutorial, setTutorial }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🚩 {t.games.flags}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
        <Mundi size={64} />
        <div className="card" style={{ padding: "12px 14px", flex: 1, borderBottomLeftRadius: 6 }}>
          <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 14 }}>{t.mascotHub}</div>
        </div>
      </div>

      <div className="lista">
        {ROUTE.map((r, i) => {
          const open = unlocked.includes(r.id);
          const prev = i === 0 || unlocked.includes(ROUTE[i - 1].id);
          const stars = progress[r.id] || 0;
          return (
            <div key={r.id} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: open || prev ? 1 : .45 }}>
              <div style={{ width: 52, height: 52, borderRadius: 18, background: r.color, display: "grid", placeItems: "center", fontSize: 26 }}>
                {open ? "🌍" : r.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 19 }}>{t.continents[r.id]}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#6C7695" }}>
                  {open ? `⭐ ${stars}/${totalDe(r.id)}` : `${t.unlockFor} 🪙${r.cost}`}
                </div>
              </div>
              {open
                ? <Btn small color={r.color} onClick={() => { setSel({ cont: r.id, stage: Math.min(totalDe(r.id), (progress[r.id] || 0) + 1) }); setScreen("stages"); }}>{t.play}</Btn>
                : <Btn small color="#8B93AD" disabled={!prev || coins < r.cost} onClick={() => unlockContinent(r.id, r.cost)}>{r.emoji}</Btn>}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 12, fontWeight: 700, marginTop: 16 }}>
        {nextRefill > 0 ? `${t.nextCoins} ${fmt(nextRefill)}` : `🎁 ${t.claimReady}`}
      </div>

      {tutorial && (
        <Modal onClose={() => setTutorial(false)}>
          <div style={{ textAlign: "center" }}>
            <Mundi size={80} />
            <div className="display" style={{ fontSize: 24, color: "#1B2A6B", marginTop: 6 }}>{t.tutorial}</div>
            <div style={{ textAlign: "left", margin: "12px 0", color: "#3B4468", fontWeight: 700, lineHeight: 1.7, fontSize: 15 }}>
              🚩 {t.tut1}<br />👆 {t.tut2}<br />⏱️ {t.tut3}<br />🪙 {t.tut4}
            </div>
            <Btn full color="#00B894" onClick={() => setTutorial(false)}>{t.gotIt}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,20,55,.66)", zIndex: 50, display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card pop" onClick={e => e.stopPropagation()} style={{ padding: 20, maxWidth: 380, width: "100%" }}>{children}</div>
    </div>
  );
}

/* ---------- Seleção de fases ---------- */
function Stages({ t, lang, sel, setSel, progress, coins, startRound, setScreen, player, stars, records, temSecao, comprarSecao, dupla, pedirDupla, sairDaDupla }) {
  const quiz = quizDe(sel.cont);             // jogos fora do mapa-múndi
  const cont = quiz ? { color: quiz.cor } : ROUTE.find(r => r.id === sel.cont);
  const done = progress[sel.cont] || 0;
  const band = bandFor(sel.cont, sel.stage);
  const totalFases = totalDe(sel.cont);
  /* Trilha de 100 fases não cabe num tabuleiro só: 20 linhas de botões
     empurram o "Jogar" para fora da tela. Página de 20, sempre 5 colunas,
     e a página abre junto com a fase — a de número 21 só existe quando a 20
     estiver vencida. */
  const custoFase = custoDaFase(stars, sel.cont, sel.stage);
  const POR_PAGINA = 20;
  const paginas = Math.ceil(totalFases / POR_PAGINA);
  const [pag, setPag] = useState(Math.min(paginas - 1, Math.floor((sel.stage - 1) / POR_PAGINA)));
  const p0 = pag * POR_PAGINA;
  const fasesDaPagina = Array.from({ length: Math.min(POR_PAGINA, totalFases - p0) }, (_, i) => p0 + i + 1);
  const paginaAberta = i => done >= i * POR_PAGINA;
  const chaveBanda = b => `b:${sel.cont}:${b}`;
  const bandaAberta = b => !BAND_PRECO[b] || temSecao(chaveBanda(b));
  const bandaAnterior = b => DIFFS[DIFFS.indexOf(b) - 1];
  const podeComprar = b => {
    const ant = bandaAnterior(b);
    return !ant || bandaAberta(ant);
  };
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(sel.cont.startsWith("cap_") ? "capMap" : quiz ? "home" : "map")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>{quiz
            ? `${quiz.icone} ${quiz.nome(t)}${alvoDe(sel.cont) ? ` · ${LANG_CATALOG[alvoDe(sel.cont)]}` : ""}${
                sel.cont.startsWith("cap_")
                  ? ` · ${sel.cont === "cap_br" ? t.capBrasil : sel.cont === "cap_us" ? t.capEUA : t.continents[sel.cont.slice(4)]}`
                  : ""}`
            : t.continents[sel.cont]}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      {/* legenda das faixas de dificuldade */}
      {/* Seis faixas não cabem numa fileira de celular: deixo quebrar, dá três
          por linha em 375px e as seis numa só quando a tela é larga. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {DIFFS.map(d => {
          const aberta = bandaAberta(d);
          return (
            <div key={d} style={{
              flex: "1 1 28%", textAlign: "center", borderRadius: 12, padding: "6px 2px",
              background: aberta ? BAND_COLOR[d] : "#8B93AD", color: "#fff", fontWeight: 900, fontSize: 11,
              opacity: !aberta ? .6 : band === d ? 1 : .45,
            }}>{aberta ? t.levels[d] : `🔒 ${t.levels[d]}`}</div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {fasesDaPagina.map(n => {
            const b0 = bandFor(sel.cont, n);
            const open = n <= done + 1 && bandaAberta(b0);
            const cleared = n <= done;
            const b = b0;
            const st = stars?.[sel.cont]?.[n] || 0;
            return (
              <button key={n} disabled={!open} onClick={() => setSel(s => ({ ...s, stage: n }))}
                className="chunky" style={{
                  aspectRatio: "1", fontSize: 15, borderRadius: 16, padding: 2,
                  background: !open ? "#DDE2F0" : cleared ? "#00B894" : BAND_COLOR[b],
                  outline: sel.stage === n && open ? "4px solid #1B2A6B" : "none",
                  color: open ? "#fff" : "#A6AFC6",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                }}>
                <span>{n}</span>
                <span style={{ fontSize: 9, letterSpacing: -1 }}>
                  {[1, 2, 3].map(i => (
                    <span key={i} style={{ opacity: st >= i ? 1 : .28 }}>★</span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        {paginas > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <Btn small color={pag === 0 ? "#C7CEE0" : "#4C6FFF"} disabled={pag === 0}
              onClick={() => setPag(pag - 1)} rotulo={t.a11yPrev}>◀</Btn>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15 }}>
                {t.stage} {p0 + 1}–{p0 + fasesDaPagina.length}
              </div>
              <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 11 }}>{pag + 1}/{paginas}</div>
            </div>
            <Btn small color={pag >= paginas - 1 || !paginaAberta(pag + 1) ? "#C7CEE0" : "#4C6FFF"}
              disabled={pag >= paginas - 1 || !paginaAberta(pag + 1)}
              onClick={() => setPag(pag + 1)}>{pag < paginas - 1 && !paginaAberta(pag + 1) ? "🔒" : "▶"}</Btn>
          </div>
        )}
      </div>

      {(() => {
        const prox = DIFFS.find(d => !bandaAberta(d) && podeComprar(d));
        if (!prox) return null;
        const preco = BAND_PRECO[prox];
        return (
          <div className="card" style={{ padding: 13, marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: BAND_COLOR[prox], display: "grid", placeItems: "center", fontSize: 20 }}>🔓</div>
            <div style={{ flex: 1 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.levels[prox]}</div>
              <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 12 }}>{t.unlockFor} 🪙{preco}</div>
            </div>
            <Btn small color={coins >= preco ? BAND_COLOR[prox] : "#8B93AD"} disabled={coins < preco}
              onClick={() => comprarSecao(chaveBanda(prox), preco)}>🪙{preco}</Btn>
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", margin: "14px 0" }}>
        <Mundi size={56} />
        <div className="card" style={{ padding: "10px 12px", flex: 1, borderBottomLeftRadius: 6, color: "#1B2A6B", fontWeight: 800, fontSize: 13 }}>
          {t.mascotStage}
        </div>
      </div>

      {records?.[sel.cont]?.[sel.stage] != null && (
        <div style={{ textAlign: "center", color: "#C9D2FF", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
          ⏱️ {t.record}: {tempoFmt(records[sel.cont][sel.stage])}
        </div>
      )}
      {dupla ? (
        <>
          <div className="card" style={{ padding: 10, marginBottom: 9, display: "flex", alignItems: "center", gap: 10 }}>
            <Rosto p={dupla} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15 }}>{t.duoWith} {dupla.name}</div>
              <div style={{ color: "#00B894", fontWeight: 900, fontSize: 11 }}>{t.duoTakeTurns}</div>
            </div>
            <Btn small color="#8B93AD" onClick={sairDaDupla} rotulo={t.a11yClose}>✕</Btn>
          </div>
          <Btn full color="#00C2CB" disabled={!bandaAberta(band)} onClick={() => startRound(dupla)}>
            👥 {t.stage} {sel.stage} · {t.levels[band]}
          </Btn>
        </>
      ) : (
        <>
          <Btn full color={BAND_COLOR[band]} disabled={coins < custoFase || !bandaAberta(band)} onClick={() => startRound()}>
            ▶ {t.stage} {sel.stage} · {t.levels[band]} · {custoFase ? `${t.cost} 🪙${custoFase}` : `⭐ ${t.free}`}
          </Btn>
          <div style={{ height: 9 }} />
          <Btn full color="rgba(255,255,255,.2)" onClick={pedirDupla}>👥 {t.duoPlay}</Btn>
        </>
      )}
    </div>
  );
}

/* ---------- Jogo ---------- */
/* ---------- Folga de leitura ----------
   O cronômetro existe para medir o que a criança SABE, não a velocidade com
   que ela lê. Uma bandeira tem quatro nomes curtos; uma pergunta da Bíblia
   pode ter quatro frases inteiras. Sem esta folga, a fase 100 dava 4 segundos
   para ler quase 200 caracteres — nem adulto faz isso.

   O tempo base já cobre uma pergunta curta (50 caracteres com as quatro
   opções). Cada 10 caracteres além disso valem mais um segundo, até 25.
   Perguntas de bandeira quase não mudam: quatro nomes de país cabem na base. */
const LEITURA_BASE = 50;
const LEITURA_POR_SEG = 10;
const FOLGA_MAX = 25;

function folgaLeitura(q) {
  const texto = ((q.ask || q.prompt || "") + q.options.join("")).length;
  return Math.min(FOLGA_MAX, Math.max(0, Math.round((texto - LEITURA_BASE) / LEITURA_POR_SEG)));
}
const tempoDaPergunta = (round, q) => round.time == null ? null : round.time + folgaLeitura(q);

function Game({ t, lang, round, setRound, coins, setCoins, finishRound, player, setScreen, onQuit }) {
  const q = round.qs[round.i];
  /* Em duelo as perguntas se alternam: a de índice par é de quem convidou.
     Entre uma e outra entra a tela de passar o celular — sem ela o segundo
     jogador vê a resposta do primeiro e o duelo acaba antes de começar. */
  const duo = round.duo;
  const vez = duo ? round.i % 2 : 0;
  const daVez = duo ? (vez === 0 ? { name: player.name, avatar: player.avatar } : duo) : null;
  const [passando, setPassando] = useState(false);
  const tempoQ = tempoDaPergunta(round, q);
  const [left, setLeft] = useState(tempoQ);
  const [removed, setRemoved] = useState([]);
  const [picked, setPicked] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [imgOk, setImgOk] = useState(true);
  const [sair, setSair] = useState(false);
  /* Guarda a rodada seguinte enquanto a criança lê o porquê do erro. */
  const [explicando, setExplicando] = useState(null);
  const lockRef = useRef(false);

  useEffect(() => {
    setLeft(tempoDaPergunta(round, round.qs[round.i])); setRemoved([]); setPicked(null); setHintLevel(0); setImgOk(true);
    setExplicando(null);
    lockRef.current = false;
  }, [round.i]);

  useEffect(() => {
    if (passando) return;                              // relógio parado na troca de mãos
    if (round.time == null || picked !== null) return; // Fácil não tem cronômetro
    if (left <= 0) { answer(null); return; }
    const x = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(x);
  }, [left, picked, round.time, passando]);

  function answer(opt) {
    if (lockRef.current) return;
    lockRef.current = true;
    setPicked(opt ?? "__timeout__");
    const ok = opt === q.answer;
    setTimeout(() => {
      const streak = ok ? round.streak + 1 : 0;
      const fast = ok && tempoQ != null && left >= tempoQ - 3;   // respondeu em ~3s
      const next = {
        ...round,
        ...(duo ? { pontos: round.pontos.map((v, k) => v + (ok && k === vez ? 1 : 0)) } : null),
        i: round.i + 1,
        right: round.right + (ok ? 1 : 0),
        flash: round.flash + (fast ? 1 : 0),
        islandRight: round.islandRight + (ok && q.flag && !q.sub && ISLANDS.has(q.flag.toUpperCase()) ? 1 : 0),
        subRight: round.subRight + (ok && q.sub ? 1 : 0),
        score: round.score + (ok ? 100 + (tempoQ == null ? 30 : left * 10) : 0),
        streak,
        bestStreak: Math.max(round.bestStreak || 0, streak),
      };
      // Errou: a rodada para e explica. Acertar não interrompe — quem já
      // sabe não precisa de aula, e o ritmo é metade da graça do jogo.
      if (!ok) { setExplicando({ next, certa: q.answer, porque: explicacaoDe(q) }); return; }
      if (next.i >= round.qs.length) finishRound(next);
      else { setRound(next); if (duo) setPassando(true); }
    }, 900);
  }

  function useHint(n) {
    const cost = n === 1 ? ECON.hint1 : n === 2 ? ECON.hint2 : ECON.hint3;
    if (duo || coins < cost || hintLevel >= n || picked) return;
    setCoins(c => c - cost);
    const wrongs = shuffle(q.options.filter(o => o !== q.answer && !removed.includes(o)));
    setRemoved(r => [...r, ...wrongs.slice(0, n - hintLevel)]);
    setHintLevel(n);
    setRound(r => ({ ...r, hintsUsed: r.hintsUsed + 1 }));
  }

  const pct = tempoQ == null ? 100 : (left / tempoQ) * 100;
  const barColor = pct > 55 ? "#00B894" : pct > 25 ? "#F9A826" : "#E74C3C";

  function seguir() {
    const { next } = explicando;
    setExplicando(null);
    if (next.i >= round.qs.length) finishRound(next);
    else { setRound(next); if (duo) setPassando(true); }
  }

  if (passando) return (
    <div className="narrow" style={{ paddingTop: 40 }}>
      <div className="card pop" style={{ padding: 26, textAlign: "center" }}>
        <div style={{ fontSize: 46 }}>🤝</div>
        <div style={{ display: "grid", placeItems: "center", margin: "10px 0 6px" }}>
          <Rosto p={daVez} size={72} />
        </div>
        <div className="display" style={{ fontSize: 22, color: "#1B2A6B", lineHeight: 1.2 }}>
          {t.duoPass.replace("{quem}", daVez?.name || "—")}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, margin: "14px 0" }}>
          {[{ name: player.name }, duo].map((j, i) => (
            <div key={i} style={{ textAlign: "center", opacity: vez === i ? 1 : .5 }}>
              <div className="display" style={{ fontSize: 24, color: "#1B2A6B" }}>{round.pontos[i]}</div>
              <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10 }}>{j?.name}</div>
            </div>
          ))}
        </div>
        <Btn full color="#00B894" onClick={() => setPassando(false)}>{t.duoReady}</Btn>
      </div>
    </div>
  );

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <button onClick={() => setSair(true)} aria-label={t.quit} className="chunky"
          style={{ background: "rgba(255,255,255,.18)", padding: "6px 11px", fontSize: 15 }}>✕</button>
        <div className="display" style={{ color: "#fff", fontSize: 14 }}>{round.i + 1}/{round.qs.length}</div>
        <div style={{ flex: 1, display: "flex", gap: 3 }}>
          {Array.from({ length: round.qs.length }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: i < round.i ? "#00E5A0" : "rgba(255,255,255,.25)" }} />
          ))}
        </div>
        {duo ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {round.pontos.map((v, i) => (
              <div key={i} style={{ background: vez === i ? "#F9A826" : "rgba(255,255,255,.18)",
                color: vez === i ? "#5A3B00" : "#fff", borderRadius: 999, padding: "5px 9px", fontWeight: 900, fontSize: 14 }}>
                {v}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "5px 10px", fontWeight: 900, fontSize: 14 }}><Coin n={coins} /></div>
        )}
      </div>

      {/* De quem é a vez, ao lado da pergunta: a criança confere sem perguntar. */}
      {duo && (
        <div className="card" style={{ padding: "6px 10px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <Rosto p={daVez} size={24} />
          <div style={{ color: "#1B2A6B", fontWeight: 900, fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {daVez?.name}
          </div>
          <div style={{ color: "#F9A826", fontWeight: 900, fontSize: 10 }}>{t.yourTurn}</div>
        </div>
      )}

      {/* timer (o modo Fácil joga sem cronômetro) */}
      {round.time == null ? (
        <div style={{ height: 14, borderRadius: 10, background: "rgba(0,229,160,.22)", marginBottom: 12, display: "grid", placeItems: "center", color: "#9BF3D6", fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>
          🐢 {t.noRush}
        </div>
      ) : (
        <div style={{ height: 14, borderRadius: 10, background: "rgba(0,0,0,.22)", overflow: "hidden", marginBottom: 12, position: "relative" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: barColor, transition: "width 1s linear", borderRadius: 10 }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 11 }}>{left}s</div>
        </div>
      )}

      {/* bandeira */}
      <div className="card" style={{ padding: 14, marginBottom: 12, textAlign: "center" }}>
        <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
          {q.kind === "math" ? t.howMuch : q.kind === "emojiAsk" ? q.ask : q.ask ? q.ask : ["emojiPick", "texto"].includes(q.kind) ? q.prompt : q.sub ? t.whichRegion : t.whichCountry}
        </div>
        {q.kind === "emojiPick" ? (
          <div style={{ fontSize: 46, padding: "6px 0 2px" }}>🔎</div>
        ) : q.kind === "texto" ? (
          <div className={`display ${picked && picked !== q.answer ? "shake" : ""}`}
            style={{ fontSize: q.ask ? 30 : 44, color: "#1B2A6B", padding: "10px 6px", lineHeight: 1.2 }}>
            {q.ask ? q.prompt : "📖"}
          </div>
        ) : q.kind === "emojiAsk" ? (
          <div className={picked && picked !== q.answer ? "shake" : ""} style={{ fontSize: 76, padding: "4px 0" }}>{q.prompt}</div>
        ) : q.kind === "math" ? (
          <div className={`display ${picked && picked !== q.answer ? "shake" : ""}`}
            style={{ fontSize: 44, color: "#1B2A6B", padding: "14px 8px", lineHeight: 1.2 }}>
            {q.prompt}
          </div>
        ) : (
        <div className={picked && picked !== q.answer ? "shake" : ""} style={{ display: "inline-block", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 14px rgba(20,25,60,.25)", background: "#EEF1FF" }}>
          {imgOk
            ? <img src={flagUrl(q.flag)} alt="" onError={() => setImgOk(false)} style={{ width: 210, height: 140, objectFit: "contain", display: "block", background: "#fff" }} />
            : <div style={{ width: 210, height: 140, display: "grid", placeItems: "center", fontSize: 64 }}>
              {q.sub
                ? "🏴"
                : String.fromCodePoint(...q.flag.slice(0, 2).toUpperCase().split("").map(c => 127397 + c.charCodeAt(0)))}
            </div>}
        </div>
        )}
      </div>

      {/* opções */}
      <div style={{ display: "grid", gap: 9 }}>
        {q.options.map(o => {
          const gone = removed.includes(o);
          const isAns = picked && o === q.answer;
          const isBad = picked === o && o !== q.answer;
          return (
            <button key={o} disabled={gone || !!picked} onClick={() => answer(o)} className="chunky"
              style={{
                padding: q.kind === "emojiPick" ? "14px" : "16px 14px",
                fontSize: q.kind === "emojiPick" ? 40 : 18,
                textAlign: q.kind === "emojiPick" ? "center" : "left",
                background: gone ? "#7C86A8" : isAns ? "#00B894" : isBad ? "#E74C3C" : "#fff",
                color: gone ? "rgba(255,255,255,.35)" : (isAns || isBad) ? "#fff" : "#1B2A6B",
                textDecoration: gone ? "line-through" : "none",
                opacity: gone ? .5 : 1,
              }}>
              {isAns ? "✅ " : isBad ? "❌ " : ""}{o}
            </button>
          );
        })}
      </div>

      {/* dicas — em duelo não existem: comprar a vitória sobre o irmão
          não é jogo, e o outro estaria pagando com as lumicoins dele */}
      <div style={{ marginTop: 14, display: duo ? "none" : "block" }}>
        <div style={{ color: "#C9D2FF", fontWeight: 800, fontSize: 12, marginBottom: 6 }}>💡 {t.hints}</div>
        <div style={{ display: "flex", gap: 7 }}>
          {[[1, ECON.hint1, t.remove1], [2, ECON.hint2, t.remove2], [3, ECON.hint3, t.remove3]].map(([n, c, label]) => (
            <button key={n} onClick={() => useHint(n)} disabled={coins < c || hintLevel >= n || !!picked} className="chunky"
              style={{ flex: 1, padding: "10px 4px", fontSize: 11, lineHeight: 1.3, background: hintLevel >= n ? "#7C86A8" : coins < c ? "#8B93AD" : "#6A5AE0" }}>
              {label}<br />🪙{c}
            </button>
          ))}
        </div>
      </div>

      {/* Raciocinar: a frase verdadeira que a criança não sabia, com a
          resposta certa do lado. Sem "você errou" — o erro ela já viu. */}
      {explicando && (
        <Modal onClose={seguir}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>💡</div>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginTop: 6 }}>
              {t.whyTitle}
            </div>
            <div className="display" style={{ color: "#00B894", fontSize: 26, lineHeight: 1.15, margin: "2px 0 10px" }}>
              {explicando.certa}
            </div>
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
              {explicando.porque}
            </div>
            <Btn full color="#00B894" onClick={seguir}>{t.gotIt}</Btn>
          </div>
        </Modal>
      )}

      {sair && (
        <Modal onClose={() => setSair(false)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>🚪</div>
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, margin: "10px 0 14px" }}>{t.quitAsk}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full small color="#8B93AD" onClick={() => setSair(false)}>{t.cancel}</Btn>
              <Btn full small color="#E74C3C" onClick={onQuit}>{t.quit}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {picked && (
        <div className="pop" style={{ textAlign: "center", marginTop: 12, color: "#fff" }}>
          <span className="display" style={{ fontSize: 22 }}>
            {picked === q.answer ? `🎉 ${t.correct}` : picked === "__timeout__" ? `⏰ ${t.timeUp}` : `💪 ${t.wrong}`}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- Resultado ---------- */
function Result({ t, round, player, setScreen, setSel, sel, startRound, coins, escrever }) {
  const perfect = round.pct === 100;
  return (
    <div className="narrow" style={{ paddingTop: 20 }}>
      <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 54 }}>{perfect ? "🏆" : round.st > 0 ? "🎉" : "💪"}</div>
        <div className="display" style={{ fontSize: 28, color: "#1B2A6B" }}>{perfect ? t.perfect : t.roundOver}</div>

        <div style={{ display: "flex", justifyContent: "center", gap: 18, margin: "16px 0" }}>
          <div><div style={{ fontSize: 12, color: "#6C7695", fontWeight: 800 }}>{t.accuracy}</div>
            <div className="display" style={{ fontSize: 26, color: "#00B894" }}>{round.right}/{round.qs.length}</div></div>
          <div><div style={{ fontSize: 12, color: "#6C7695", fontWeight: 800 }}>{t.score}</div>
            <div className="display" style={{ fontSize: 26, color: "#4C6FFF" }}>{round.score}</div></div>
          <div><div style={{ fontSize: 12, color: "#6C7695", fontWeight: 800 }}>{t.reward}</div>
            <div className="display" style={{ fontSize: 26, color: "#F9A826" }}>🪙{round.reward}</div></div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 6 }}>
          {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 34, opacity: (round.st || 0) >= i ? 1 : .2 }}>⭐</span>)}
        </div>
        <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>
          ⏱️ {tempoFmt(round.seg || 0)}{round.novoRecorde ? ` · 🏆 ${t.newRecord}` : ""}
        </div>

        {/* Relacionar e Registrar, os dois passos que faltavam. Vem antes dos
            botões de jogar de novo de propósito: pensar no que passou é mais
            valioso que a próxima rodada, e quem quiser pular, pula. */}
        <Btn full color="#8D6E3A" onClick={escrever}>📔 {t.writeIt}</Btn>
        <div style={{ height: 9 }} />

        <div style={{ display: "grid", gap: 9 }}>
          {round.st > 0 && round.stage < totalDe(round.cont) && (
            <Btn full color="#00B894"
              onClick={() => { setSel(s => ({ ...s, stage: round.stage + 1 })); setScreen("stages"); }}>
              {t.nextStage} →
            </Btn>
          )}
          <Btn full color="#4C6FFF" onClick={() => setScreen("stages")}>{t.again}</Btn>
          <Btn full color="#8B93AD" onClick={() => setScreen(round.cont.startsWith("cap_") ? "capMap" : quizDe(round.cont) ? "home" : "map")}>{t.backMap}</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Loja ----------
   Cada vitrine é o avatar do jogador com a peça já vestida:
   o que aparece no cartão é literalmente o que ele leva. */
function Shop({ t, lang, coins, setCoins, owned, setOwned, player, setPlayer, setScreen, voltaPara = "home" }) {
  const [cat, setCat] = useState("hairStyle");
  const a = player.avatar;
  const optional = ["cap", "glasses", "shirtPattern"]; // dá para não usar nada

  const wear = (type, val) => setPlayer(p => ({ ...p, avatar: { ...p.avatar, [type]: val } }));
  const act = it => {
    if (owned.includes(it.id)) { wear(it.type, it.val); return; }
    if (coins < it.price) return;
    setCoins(c => c - it.price);
    setOwned(o => [...o, it.id]);
    wear(it.type, it.val);
  };

  const items = SHOP_ITEMS.filter(i => i.type === cat);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltaPara)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24, flex: 1 }}>🛍️ {t.shop}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "grid", placeItems: "center" }}>
        <Avatar a={a} size={130} />
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {SHOP_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className="chunky"
            style={{ flex: 1, padding: "9px 2px", fontSize: 11, background: cat === c ? "#6A5AE0" : "rgba(255,255,255,.18)" }}>
            {t.slots[c]}
          </button>
        ))}
      </div>

      <div className="grid3">
        {optional.includes(cat) && (
          <div className="card" style={{ padding: 8, textAlign: "center" }}>
            <div style={{ height: 74, display: "grid", placeItems: "center", fontSize: 30, color: "#B9C0CC" }}>🚫</div>
            <Btn small full color={a[cat] == null ? "#00B894" : "#8B93AD"} onClick={() => wear(cat, null)}>
              {a[cat] == null ? t.equipped : t.remove}
            </Btn>
          </div>
        )}
        {items.map(it => {
          const has = owned.includes(it.id);
          const on = a[it.type] === it.val;
          const preview = { ...a, [it.type]: it.val };
          return (
            <div key={it.id} className="card" style={{ padding: 8, textAlign: "center", borderTop: `6px solid ${RARITY[it.r].cor}` }}>
              <div style={{ height: 74, display: "grid", placeItems: "center", overflow: "hidden", position: "relative" }}>
                <Avatar a={preview} size={74} />
                <span style={{ position: "absolute", top: 0, right: 0, fontSize: 11 }}>{RARITY[it.r].label}</span>
              </div>
              <Btn small full color={on ? "#00B894" : has ? "#4C6FFF" : coins >= it.price ? "#E84393" : "#8B93AD"}
                disabled={!has && coins < it.price} onClick={() => act(it)}>
                {on ? t.equipped : has ? t.equip : it.price ? `🪙${it.price}` : t.free}
              </Btn>
            </div>
          );
        })}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Conquistas ---------- */
function Awards({ t, lang, stats, seenAch, setScreen, player, voltaPara = "home" }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltaPara)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24 }}>🏅 {t.awards}</div>
      </div>
      <div className="card" style={{ padding: 14, marginBottom: 12, maxWidth: 520, marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        {[["🏅", `${ACHIEVEMENTS.filter(a => a.test(stats)).length}/${ACHIEVEMENTS.length}`],
          ["🔥", stats.bestStreak], ["💯", stats.perfect],
          ["🪙", ACHIEVEMENTS.filter(a => a.test(stats)).reduce((x, a) => x + premioDe(a), 0)]].map(([i, v]) => (
          <div key={i}><div style={{ fontSize: 22 }}>{i}</div><div className="display" style={{ fontSize: 19, color: "#1B2A6B" }}>{v}</div></div>
        ))}
      </div>
      {CONQ_CATS.map(c => {
        const doGrupo = ACHIEVEMENTS.filter(a => a.cat === c.id);
        if (!doGrupo.length) return null;
        const abertas = doGrupo.filter(a => a.test(stats)).length;
        return (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <span className="display" style={{ color: "#C9D2FF", fontSize: 16, flex: 1 }}>{c[lang] || c.en}</span>
              <span style={{ color: "#A7B3EA", fontSize: 12, fontWeight: 800 }}>{abertas}/{doGrupo.length}</span>
            </div>
            <div className="lista">
              {doGrupo.map(a => {
                const got = a.test(stats);
                return (
                  <div key={a.id} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, opacity: got ? 1 : .5 }}>
                    <div style={{ fontSize: 26, filter: got ? "none" : "grayscale(1)" }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: "#1B2A6B", fontSize: 14 }}>{a[lang] || a.en}</div>
                      <div style={{ fontWeight: 900, fontSize: 11, color: got ? "#00B894" : "#8B93AD" }}>
                        {NIVEL_LABEL[a.n]} · 🪙 {premioDe(a)}
                      </div>
                    </div>
                    <div style={{ fontSize: 19 }}>{got ? "✅" : "🔒"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

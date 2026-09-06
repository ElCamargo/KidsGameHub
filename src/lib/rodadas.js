/**
 * KidsGameHub — como cada rodada é montada
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import { bancoBiblia } from "../data/biblia.js";
import { CASAS, CIENCIA_NIVEL, DIETAS, GRUPOS, NASCE, perguntasCiencia } from "../data/ciencias.js";
import { AGUAS, CURIOSIDADES, CURIOSIDADE_NIVEL } from "../data/curiosidades.js";
import { BR_ESTADOS, CAPITAIS, CAP_DE, CAP_ES, CAP_FR, CAP_IT, CAP_PT, DATA, SUBFLAGS, US_ESTADOS } from "../data/geografia.js";
import { ALFABETO, DIGRAFOS_INICIAIS, PALAVRAS } from "../data/palavras.js";
import { LEITURAS, NIVEIS_DA_LEITURA } from "../data/leitura.js";
import { palavrasDaFaixa } from "./alfabetizacao.js";
import { ISCAS, MODO_DA_FAIXA, silabaCobrada } from "./silabas.js";
import { ARMADILHA_DA_FAIXA, gruposDeSom, mesmaLetraOutroSom, somInicial, somIrmao } from "./sons.js";
import { LANG_CATALOG, T } from "../data/textos.js";
import { bandFor, countryName, qtdPerguntas, shuffle, tempoDe } from "./catalogo.js";
import { RELOGIOS, contaDaTabuada, daquiA, formatarReal, horaEscrita, numerosParecidos, punhado, relogiosDaFaixa, valoresParecidos } from "./matematica.js";


/* Animais em emoji: nada para baixar, nada de licença, e o desenho já
   vem pronto em qualquer aparelho. Serve à memória e, depois, ao quiz. */
export const BIBLIA_EMOJI = ["🕊️","✝️","📖","🐑","🌈","🐟","🍞","🔥","⭐","⛵","🌿","🦁","👑","🎺","🕯️","⛰️",
  "🍇","🫒","🏺","🧺","🐫","🌾"];


export const ANIMAIS = [
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
export const FAIXA_POOL = {
  easy:   [0,   .55],
  medium: [0,   .8],
  hard:   [.25, 1],
  genius: [.45, 1],
  mestre: [.6,  1],
  lenda:  [.7,  1],   // só as mais raras do continente
};


export function poolFor(cont, diff, minimo = 10) {
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


export function buildRound(cont, stage, lang, t = T[lang] || T.pt) {
  const diff = bandFor(cont, stage);
  const pool = poolFor(cont, diff, qtdPerguntas(diff));
  const wide = Object.keys(DATA[cont]); // distratores também só do continente
  const subs = (SUBFLAGS[cont] || []);
  const subDeck = shuffle(subs);
  let subAt = 0;
  /* Quantas perguntas da rodada são de estado/região, e não de país.
     Difícil: uma só, como aperitivo. Gênio: metade. Mestre e Lenda: quase
     metade — e é o que finalmente enche a rodada na América do Sul, que tem
     doze países e pedia quinze bandeiras diferentes. */
  const QUANTAS_SUB = { hard: 1, genius: 5, mestre: 5, lenda: 7 };
  const subSlots = new Set();
  if (subs.length && (diff !== "hard" || stage >= 12)) {
    const quantas = Math.min(QUANTAS_SUB[diff] || 0, subs.length);
    // Espalhadas pela rodada, sempre nas posições ímpares: assim nunca abrem
    // a partida e nunca caem duas seguidas.
    for (let i = 1, postas = 0; i < qtdPerguntas(diff) && postas < quantas; i += 2, postas++)
      subSlots.add(i);
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
export function explicacaoDe(q) {
  if (!q) return "";
  if (q.porque) return q.porque;
  const enunciado = [q.prompt, q.ask].filter(Boolean).join(" ");
  return enunciado ? `${enunciado} ${q.answer}` : String(q.answer ?? "");
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


export function montarRodadaMath(stage) {
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
export const PERGUNTAS_BICHO = {
  easy:   [["voa", 0], ["agua", 0], ["fazenda", 0]],
  medium: [["ave", 0], ["mamifero", 0], ["inseto", 0], ["selva", 0]],
  hard:   [["reptil", 0], ["ovos", 0], ["peixe", 0], ["patas4", 0], ["gelo", 0]],
  genius: [["anfibio", 0], ["mamifero", 1], ["reptil", 1], ["inseto", 1], ["ave", 1]],
  // Mestre e Lenda só perguntam pelo avesso: achar quem NÃO tem a etiqueta
  // exige olhar os quatro bichos, não reconhecer um.
  mestre: [["agua", 1], ["voa", 1], ["fazenda", 1], ["peixe", 1], ["selva", 1]],
  lenda:  [["patas4", 1], ["ovos", 1], ["domestico", 1], ["gelo", 1], ["anfibio", 1]],
};


export function montarRodadaBichos(stage, t) {
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
export const VOCAB = [
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


export const VOCAB_NIVEL = { easy: [1], medium: [1, 2], hard: [2, 3], genius: [3], mestre: [3], lenda: [3] };


export function montarRodadaIdioma(stage, t, alvo) {
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

export const todosEmojis = () => FORMAS_LISTA.flatMap(f => CORES_LISTA.map(c => ({ f, c, e: FORMAS[f][c] })));


export function montarRodadaArte(stage, t) {
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


export function montarRodadaCuriosidades(stage, t, lang) {
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


export function montarRodadaCiencias(stage, t, lang) {
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


export function montarRodadaBiblia(stage, lang) {
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



/* A grafia própria de cada idioma, quando existe. Cada dicionário traz só
   as capitais que MUDAM: "Paris" é Paris em toda parte, "Peking" não. */
const CAP_IDIOMA = { pt: CAP_PT, es: CAP_ES, fr: CAP_FR, de: CAP_DE, it: CAP_IT };

const capNome = (code, lang) => CAP_IDIOMA[lang]?.[code] || CAPITAIS[code];


/* A ordem em que o mundo se abre. Cada região exige 10 fases da anterior. */
export const CAP_REGIOES = [
  { id: "cap_br", icone: "🇧🇷", cor: "#00B894" },
  { id: "cap_sa", icone: "🌎", cor: "#00C2CB" },
  { id: "cap_na", icone: "🌎", cor: "#FF7043" },
  { id: "cap_eu", icone: "🌍", cor: "#4C6FFF" },
  { id: "cap_af", icone: "🌍", cor: "#F9A826" },
  { id: "cap_as", icone: "🌏", cor: "#E84393" },
  { id: "cap_oc", icone: "🌏", cor: "#6A5AE0" },
  { id: "cap_us", icone: "🇺🇸", cor: "#9B59B6" },
];


/* [lugar, capital, bandeira]. A bandeira é o que faz a criança reconhecer o
   estado antes de saber o nome — e é opcional: nem todo estado americano tem
   a sua no pacote, e país nenhum precisa dela aqui, porque a bandeira do país
   já é o jogo ao lado. */
function paresCapitais(regiao, lang) {
  if (regiao === "cap_br") return BR_ESTADOS.map(([n, c, f]) => [n, c, f]);
  if (regiao === "cap_us") return US_ESTADOS.map(([n, c, f]) => [n, c, f]);
  const cont = regiao.slice(4);
  return Object.keys(DATA[cont]).map(code => [countryName(code, lang), capNome(code, lang)]);
}


export function montarRodadaCapitais(stage, t, lang, cont) {
  const band = bandFor(cont, stage);
  const qCount = qtdPerguntas(band);
  const pares = paresCapitais(cont, lang).filter(([n, c]) => n && c);
  // As fases fáceis usam os primeiros da lista; as difíceis, o conjunto todo
  const fatia = band === "easy" ? Math.ceil(pares.length * 0.5)
    : band === "medium" ? Math.ceil(pares.length * 0.75) : pares.length;
  const pool = shuffle(pares).slice(0, Math.max(qCount + 3, fatia));
  const escolhidos = shuffle(pool).slice(0, qCount);
  const qs = escolhidos.map(([lugar, capital, bandeira]) => {
    const distr = shuffle(pares.filter(([, c]) => c !== capital)).slice(0, 3);
    return {
      kind: "texto", prompt: lugar, ask: t.whichCapital, flag: bandeira || undefined,
      answer: capital, options: shuffle([capital, ...distr.map(d => d[1])]),
      porque: t.porq.capital.replace("{cap}", capital).replace("{lugar}", lugar),
    };
  });
  return { cont, diff: band, stage, qs, time: tempoDe(cont, stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}


/* Jogos de perguntas que não ficam no mapa-múndi */
export const alvoDe = cont => (cont || "").startsWith("idiomas_") ? cont.slice(8) : null;

export const quizDe = cont => QUIZZES[cont] || (alvoDe(cont) ? QUIZZES.idiomas : (cont || "").startsWith("cap_") ? QUIZZES.capitais : null);


/* ---------- Tabuada ----------
   Fato básico, e é fato básico que trava criança de 3º ano na hora da conta
   grande. As alternativas erradas são vizinhas na tabuada, e não números ao
   acaso: alternativa absurda se elimina sem pensar, e aí a pergunta não
   ensinou nada. */
export function montarRodadaTabuada(stage, t) {
  const band = bandFor("tabuada", stage);
  const qs = [];
  let guarda = 0;
  while (qs.length < qtdPerguntas(band) && guarda++ < 300) {
    const c = contaDaTabuada(band);
    if (qs.some(q => q.prompt === c.prompt)) continue;
    const certo = String(c.resposta);
    qs.push({
      kind: "math", prompt: c.prompt, answer: certo,
      options: shuffle([certo, ...numerosParecidos(c.resposta, 3).map(String)]),
      porque: c.conta,
    });
  }
  return { cont: "tabuada", diff: band, stage, qs, time: tempoDe("tabuada", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}


/* ---------- Dinheiro ----------
   Real de verdade, com as moedas e notas que existem no bolso. É a conta mais
   usada fora da escola e a que quase nenhum app ensina. Nas faixas altas vira
   troco, que é subtração com um motivo. */
export function montarRodadaDinheiro(stage, t) {
  const band = bandFor("dinheiro", stage);
  const qs = [];
  let guarda = 0;
  const troco = band === "genius" || band === "mestre" || band === "lenda";
  while (qs.length < qtdPerguntas(band) && guarda++ < 400) {
    const { pecas, total } = punhado(band);
    if (troco) {
      // Paga com uma nota que dê para pagar, e sobra troco de verdade.
      const nota = [500, 1000, 2000, 5000].find(v => v > total);
      if (!nota) continue;
      const resto = nota - total;
      const certo = formatarReal(resto);
      // Repetido é a CONTA inteira, não a nota: só existem quatro notas que
      // servem de troco, e barrar por nota deixava a rodada com 4 perguntas.
      const enunciado = `${formatarReal(nota)} − ${formatarReal(total)}`;
      if (qs.some(q => q.prompt === enunciado)) continue;
      qs.push({
        kind: "texto", ask: t.askChange,
        prompt: enunciado,
        answer: certo,
        options: shuffle([certo, ...valoresParecidos(resto, 3).map(formatarReal)]),
        porque: t.whyChange.replace("{a}", formatarReal(nota)).replace("{b}", formatarReal(total)).replace("{c}", certo),
      });
      continue;
    }
    const mostra = pecas.map(formatarReal).join(" + ");
    if (qs.some(q => q.prompt === mostra)) continue;
    const certo = formatarReal(total);
    qs.push({
      kind: "math", prompt: mostra, answer: certo,
      options: shuffle([certo, ...valoresParecidos(total, 3).map(formatarReal)]),
      porque: t.whyMoney.replace("{a}", mostra).replace("{b}", certo),
    });
  }
  return { cont: "dinheiro", diff: band, stage, qs, time: tempoDe("dinheiro", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}


/* ---------- Horas ----------
   O relógio é o emoji do próprio Unicode, que tem as 24 caras de hora cheia e
   meia hora — exatamente o que um 2º ano precisa ler. Desenhar um relógio em
   SVG daria o mesmo e custaria mais.

   Três perguntas diferentes com o mesmo material: ler o relógio, achar o
   relógio da hora dita, e adiantar o ponteiro. */
export function montarRodadaHoras(stage, t) {
  const band = bandFor("horas", stage);
  const cabem = relogiosDaFaixa(band);
  const qs = [];
  let guarda = 0;
  while (qs.length < qtdPerguntas(band) && guarda++ < 400) {
    const alvo = cabem[Math.floor(Math.random() * cabem.length)];
    const sorteio = band === "easy" || band === "medium" ? 0 : Math.floor(Math.random() * 3);

    if (sorteio === 1) {                       // qual relógio marca esta hora
      if (qs.some(q => q.prompt === t.askClock.replace("{h}", horaEscrita(alvo)))) continue;
      const erradas = shuffle(RELOGIOS.filter(r => r.e !== alvo.e)).slice(0, 3);
      qs.push({
        kind: "emojiPick", prompt: t.askClock.replace("{h}", horaEscrita(alvo)),
        answer: alvo.e, options: shuffle([alvo.e, ...erradas.map(r => r.e)]),
        porque: t.whyTime.replace("{r}", alvo.e).replace("{h}", horaEscrita(alvo)),
      });
      continue;
    }

    if (sorteio === 2) {                       // daqui a quantas horas
      const somar = 1 + Math.floor(Math.random() * 3);
      const depois = daquiA(alvo, somar);
      if (!depois) continue;
      const certo = horaEscrita(depois);
      if (qs.some(q => q.prompt === alvo.e && q.ask !== t.askTime)) continue;
      const erradas = shuffle(RELOGIOS.filter(r => horaEscrita(r) !== certo)).slice(0, 3);
      qs.push({
        kind: "emojiAsk", prompt: alvo.e, ask: t.askLater.replace("{n}", somar),
        answer: certo, options: shuffle([certo, ...erradas.map(horaEscrita)]),
        porque: t.whyLater.replace("{a}", horaEscrita(alvo)).replace("{n}", somar).replace("{b}", certo),
      });
      continue;
    }

    const certo = horaEscrita(alvo);           // que horas são
    if (qs.some(q => q.prompt === alvo.e)) continue;
    const erradas = shuffle(RELOGIOS.filter(r => horaEscrita(r) !== certo)).slice(0, 3);
    qs.push({
      kind: "emojiAsk", prompt: alvo.e, ask: t.askTime,
      answer: certo, options: shuffle([certo, ...erradas.map(horaEscrita)]),
      porque: t.whyTime.replace("{r}", alvo.e).replace("{h}", certo),
    });
  }
  return { cont: "horas", diff: band, stage, qs, time: tempoDe("horas", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}


/* ---------- Que letra começa ----------
   A figura é a pergunta; as alternativas são letras. Palavra que começa com
   dígrafo fica de fora: quem vê "chave" e ouve o som do X não deve procurar
   o C — isso se ensina depois, e não por adivinhação. */
export function montarRodadaInicial(stage, t) {
  const band = bandFor("inicial", stage);
  const qCount = qtdPerguntas(band);
  const cabem = PALAVRAS.filter(p =>
    !DIGRAFOS_INICIAIS.some(d => p.s[0].toLowerCase().startsWith(d)));
  const qs = [];
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 300) {
    const alvo = cabem[Math.floor(Math.random() * cabem.length)];
    if (!alvo || qs.some(q => q.prompt === alvo.e)) continue;
    const certa = alvo.w[0].toLowerCase();
    const outras = shuffle(ALFABETO.filter(l => l !== certa)).slice(0, 3);
    qs.push({
      kind: "emojiAsk", prompt: alvo.e, ask: t.askLetter,
      answer: certa.toUpperCase(),
      options: shuffle([certa, ...outras]).map(l => l.toUpperCase()),
      porque: t.whyLetter.replace("{p}", alvo.w).replace("{l}", certa.toUpperCase()),
    });
  }
  return { cont: "inicial", diff: band, stage, qs, time: tempoDe("inicial", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}


/* ---------- Família silábica ----------
   O app NUNCA diz a sílaba: ele diz a palavra inteira, dentro da pergunta, e
   as sílabas ficam escritas nas alternativas. É a cartilha de papel — "BA de
   bala" — e é a saída para a voz do aparelho não saber dizer sílaba solta
   (ver docs/decisoes/0004 e 0006).

   Por isso a pergunta vem com `calaOpcoes`: se a voz lesse as alternativas,
   ela soletraria "bê-á" e ensinaria justamente o errado. */
export function montarRodadaSilaba(stage, t) {
  const band = bandFor("silabas", stage);
  const qCount = qtdPerguntas(band);
  const modo = MODO_DA_FAIXA[band] || MODO_DA_FAIXA.easy;
  const cabem = palavrasDaFaixa(PALAVRAS, band);
  const qs = [];
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 400) {
    const alvo = cabem[Math.floor(Math.random() * cabem.length)];
    if (!alvo) continue;
    const cobrada = silabaCobrada(alvo, modo.onde);
    if (!cobrada) continue;
    if (qs.some(q => q.prompt === alvo.e && q.answer === cobrada.silaba)) continue;
    const fora = ISCAS[modo.iscas](cobrada.silaba, 3);
    if (fora.length < 3) continue;
    const ask = (cobrada.noFim ? t.askSylEnd : t.askSylStart).replace("{p}", alvo.w);
    const porque = (cobrada.noFim ? t.whySylEnd : t.whySylStart)
      .replace("{p}", alvo.w).replace("{s}", cobrada.silaba.toUpperCase());
    /* Em CAIXA ALTA, como na cartilha: é a letra que a criança de 1º ano
       reconhece primeiro. A voz não lê isto — lê só a pergunta. */
    qs.push({
      kind: "emojiAsk", prompt: alvo.e, ask, calaOpcoes: true,
      answer: cobrada.silaba.toUpperCase(),
      options: shuffle([cobrada.silaba, ...fora]).map(x => x.toUpperCase()),
      porque,
    });
  }
  return { cont: "silabas", diff: band, stage, qs, time: tempoDe("silabas", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Começa igual ----------
   Consciência FONÊMICA: ouvir que "bola" e "bebê" começam com o mesmo som,
   antes de saber que aquilo se escreve com B. É a habilidade que o "som da
   letra" gravado ia ensinar — e que não precisa de gravação nenhuma, porque
   o app só diz palavras inteiras (ver docs/decisoes/0004 e 0006).

   E ela não precisaria mesmo: metade das consoantes NÃO TEM som isolado.
   O /b/ existe só no instante em que a boca abre para a vogal — ninguém diz
   /b/ puro, nem gravando. O que se ensina é a comparação, e é ela que está
   aqui.

   Agrupa por SOM e não por letra: "casa" e "queijo" começam igual, "casa" e
   "cebola" não (ver src/lib/sons.js). */
export function montarRodadaAliteracao(stage, t) {
  const band = bandFor("aliteracao", stage);
  const qCount = qtdPerguntas(band);
  const modo = ARMADILHA_DA_FAIXA[band] || "nenhuma";
  const grupos = [...gruposDeSom(PALAVRAS).values()].filter(g => g.length >= 2);
  const qs = [];
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 400) {
    const grupo = grupos[Math.floor(Math.random() * grupos.length)];
    const [alvo, certa] = shuffle(grupo).slice(0, 2);
    if (!alvo || !certa || qs.some(q => q.prompt === alvo.e)) continue;
    const som = somInicial(alvo.w);
    /* Toda isca tem que começar com som DIFERENTE do alvo, senão a pergunta
       teria duas respostas certas. */
    const fora = PALAVRAS.filter(p => somInicial(p.w) !== som);
    const iscas = [];
    if (modo !== "nenhuma") {
      const irmao = somIrmao(som);
      const doIrmao = shuffle(fora.filter(p => somInicial(p.w) === irmao))[0];
      if (doIrmao) iscas.push(doIrmao);
    }
    if (modo === "letra") {
      const trapaca = shuffle(fora.filter(p => mesmaLetraOutroSom(p.w, alvo.w) && !iscas.includes(p)))[0];
      if (trapaca) iscas.push(trapaca);
    }
    for (const p of shuffle(fora)) {
      if (iscas.length >= 3) break;
      if (!iscas.includes(p)) iscas.push(p);
    }
    if (iscas.length < 3) continue;
    qs.push({
      kind: "emojiAsk", prompt: alvo.e,
      ask: t.askAlit.replace("{p}", alvo.w),
      answer: certa.w,
      options: shuffle([certa.w, ...iscas.map(p => p.w)]),
      porque: t.whyAlit.replace("{a}", certa.w).replace("{b}", alvo.w),
    });
  }
  return { cont: "aliteracao", diff: band, stage, qs, time: tempoDe("aliteracao", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Interpretação de texto ----------
   Do 2º ano em diante é o que mais cai em prova, e não só em Português: o
   enunciado da conta, a pergunta de Ciências e a questão de História são
   texto para interpretar. Era o maior buraco do app.

   Duas decisões que valem explicação:

   SEM CRONÔMETRO, em todas as faixas. Compreender não é corrida, e relógio
   correndo em cima de quem está lendo mede pressa, não leitura.

   As perguntas do mesmo texto vêm JUNTAS e na ordem. É assim numa prova, e
   é o que permite ler uma vez e responder três — embaralhar faria a criança
   reler o mesmo texto três vezes salteadas. */
export function montarRodadaLeitura(stage, t) {
  const band = bandFor("leitura", stage);
  const qCount = qtdPerguntas(band);
  const niveis = NIVEIS_DA_LEITURA[band] || NIVEIS_DA_LEITURA.easy;
  const cabem = shuffle(LEITURAS.filter(l => niveis.includes(l.n)));
  const qs = [];
  for (const texto of cabem) {
    if (qs.length >= qCount) break;
    for (const p of texto.p) {
      if (qs.length >= qCount) break;
      qs.push({
        kind: "leitura",
        /* A figura vai em `figura` e não em `prompt` de propósito: a chave da
           revisão usa o prompt, e o emoji é o mesmo nas três perguntas do
           texto — as três virariam uma só na fila de revisão. */
        figura: texto.e, texto: texto.t,
        ask: p.q, answer: p.a, options: shuffle(p.o), porque: p.porque,
      });
    }
  }
  return { cont: "leitura", diff: band, stage, qs, time: null, t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Rimas ----------
   Ouvir que "gato" e "pato" terminam igual é consciência fonológica pura, e
   vem antes de ler. A figura pergunta, as palavras respondem — e a voz do
   Lumus lê as alternativas para quem ainda não lê. */
export function montarRodadaRima(stage, t) {
  const band = bandFor("rimas", stage);
  const qCount = qtdPerguntas(band);
  const comRima = PALAVRAS.filter(p => p.r);
  const qs = [];
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 300) {
    const alvo = comRima[Math.floor(Math.random() * comRima.length)];
    if (!alvo || qs.some(q => q.prompt === alvo.e)) continue;
    const parceiras = comRima.filter(p => p.r === alvo.r && p.w !== alvo.w);
    if (!parceiras.length) continue;
    const certa = shuffle(parceiras)[0];
    // As erradas não podem rimar com o alvo, senão há duas respostas certas.
    const erradas = shuffle(PALAVRAS.filter(p => p.r !== alvo.r && p.w !== alvo.w)).slice(0, 3);
    if (erradas.length < 3) continue;
    qs.push({
      kind: "emojiAsk", prompt: alvo.e, ask: t.askRhyme,
      answer: certa.w, options: shuffle([certa.w, ...erradas.map(p => p.w)]),
      porque: t.whyRhyme.replace("{a}", certa.w).replace("{b}", alvo.w),
    });
  }
  return { cont: "rimas", diff: band, stage, qs, time: tempoDe("rimas", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}


const QUIZZES = {
  inicial: { icone: "🅰️", cor: "#00B894", nome: t => t.games.inicial, montar: (st, t) => montarRodadaInicial(st, t) },
  silabas: { icone: "🆎", cor: "#FF7043", nome: t => t.games.silabas, montar: (st, t) => montarRodadaSilaba(st, t) },
  aliteracao: { icone: "👂", cor: "#00C2CB", nome: t => t.games.aliteracao, montar: (st, t) => montarRodadaAliteracao(st, t) },
  leitura: { icone: "📖", cor: "#8D6E3A", nome: t => t.games.leitura, montar: (st, t) => montarRodadaLeitura(st, t) },
  tabuada: { icone: "✖️", cor: "#E84393", nome: t => t.games.tabuada, montar: (st, t) => montarRodadaTabuada(st, t) },
  horas:   { icone: "🕐", cor: "#6A5AE0", nome: t => t.games.horas,   montar: (st, t) => montarRodadaHoras(st, t) },
  dinheiro:{ icone: "💰", cor: "#00B894", nome: t => t.games.dinheiro, montar: (st, t) => montarRodadaDinheiro(st, t) },
  rimas:   { icone: "🎵", cor: "#9B59B6", nome: t => t.games.rimas,   montar: (st, t) => montarRodadaRima(st, t) },
  math:    { icone: "🔢", cor: "#F9A826", nome: t => t.games.count,      montar: (st, t, lang) => montarRodadaMath(st) },
  bichos:  { icone: "🦉", cor: "#00B894", nome: t => t.games.animalQuiz, montar: (st, t) => montarRodadaBichos(st, t) },
  idiomas: { icone: "🔤", cor: "#4C6FFF", nome: t => t.games.words,      montar: (st, t, lang, cont) => montarRodadaIdioma(st, t, alvoDe(cont)) },
  arts:    { icone: "🌈", cor: "#E84393", nome: t => t.games.colors,     montar: (st, t) => montarRodadaArte(st, t) },
  bible:   { icone: "✝️", cor: "#8D6E3A", nome: t => t.games.bible,      montar: (st, t, lang) => montarRodadaBiblia(st, lang) },
  capitais:{ icone: "🏛️", cor: "#6A5AE0", nome: t => t.games.capitals,   montar: (st, t, lang, cont) => montarRodadaCapitais(st, t, lang, cont) },
  curiosidades: { icone: "🗺️", cor: "#00C2CB", nome: t => t.games.curiosidades, montar: (st, t, lang) => montarRodadaCuriosidades(st, t, lang) },
  ciencias:     { icone: "🔬", cor: "#6A5AE0", nome: t => t.games.sciAnimals,   montar: (st, t, lang) => montarRodadaCiencias(st, t, lang) },
};


/* ---------- Acompanhamento do responsável ----------
   Um perfil marcado como responsável não joga: abre esta tela, que lê o
   save de cada criança do próprio aparelho e mostra até onde ela chegou.
   Nada sai do aparelho — é o mesmo localStorage, aberto por outra porta. */
export function nomeDaTrilha(cont, t) {
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

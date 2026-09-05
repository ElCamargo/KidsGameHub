/**
 * KidsGameHub — as contas que a escola cobra
 * ElCamargo Soluções em TI LTDA
 *
 * Tabuada, dinheiro brasileiro e horas do relógio. É o que mais aparece em
 * prova de 1º ao 5º ano e o que o app não tinha: havia uma trilha só de
 * contas, e nada de dinheiro nem de relógio.
 *
 * Aqui mora só o cálculo. A tela e as perguntas ficam no App.
 */

/* ---------- tabuada ---------- */

/* Que tabuadas entram em cada faixa, na ordem em que a escola ensina: as
   fáceis de contar primeiro (2, 5, 10), depois as do meio, e por último as
   que travam todo mundo — 6, 7, 8. */
export const TABUADAS = {
  easy:   [2, 5, 10],
  medium: [2, 3, 4, 5, 10],
  hard:   [3, 4, 6, 7, 8, 9],
  genius: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  mestre: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  lenda:  [2, 3, 4, 5, 6, 7, 8, 9, 10],
};

/* Da faixa Mestre em diante entra divisão — que é a tabuada lida ao
   contrário, e é assim que ela deveria ser ensinada. */
export const COM_DIVISAO = new Set(["mestre", "lenda"]);

export function contaDaTabuada(banda, sorte = Math.random) {
  const tabelas = TABUADAS[banda] || TABUADAS.easy;
  const a = tabelas[Math.floor(sorte() * tabelas.length)];
  const b = 1 + Math.floor(sorte() * 10);
  const produto = a * b;
  if (COM_DIVISAO.has(banda) && sorte() < 0.5)
    return { prompt: `${produto} ÷ ${a}`, resposta: b, conta: `${produto} ÷ ${a} = ${b}` };
  // Nas faixas altas a ordem também troca: 8 × 3 é a mesma conta que 3 × 8,
  // e a criança precisa enxergar isso.
  const inverte = banda !== "easy" && sorte() < 0.5;
  const [x, y] = inverte ? [b, a] : [a, b];
  return { prompt: `${x} × ${y}`, resposta: produto, conta: `${x} × ${y} = ${produto}` };
}

/* Alternativas erradas que são PLAUSÍVEIS: vizinhas na tabuada, e não números
   ao acaso. Alternativa absurda a criança elimina sem pensar, e a pergunta
   deixa de ensinar. */
export function numerosParecidos(certo, quantos, sorte = Math.random) {
  const candidatos = new Set();
  for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    if (certo - d > 0) candidatos.add(certo - d);
    candidatos.add(certo + d);
  }
  candidatos.delete(certo);
  const lista = [...candidatos].sort((a, b) => Math.abs(a - certo) - Math.abs(b - certo));
  // Sorteia entre os doze mais próximos: perto o bastante para enganar, longe
  // o bastante para não ser sempre o mesmo par.
  const perto = lista.slice(0, 12);
  const fora = [];
  let guarda = 0;
  while (fora.length < quantos && guarda++ < 200) {
    const v = perto[Math.floor(sorte() * perto.length)];
    if (v != null && !fora.includes(v)) fora.push(v);
  }
  return fora;
}

/* ---------- dinheiro ---------- */

/* As moedas e notas que existem no bolso de um brasileiro, em centavos. */
export const MOEDAS = [5, 10, 25, 50, 100];
export const NOTAS = [200, 500, 1000, 2000, 5000, 10000];

export function formatarReal(centavos) {
  const sinal = centavos < 0 ? "-" : "";
  const v = Math.abs(Math.round(centavos));
  return `${sinal}R$ ${Math.floor(v / 100)},${String(v % 100).padStart(2, "0")}`;
}

/* Um punhado de dinheiro: quantas peças, e de que tamanho, conforme a faixa. */
export function punhado(banda, sorte = Math.random) {
  const so = { easy: MOEDAS.slice(0, 4), medium: MOEDAS, hard: [...MOEDAS, 200, 500] };
  const fonte = so[banda] || [...MOEDAS, ...NOTAS.slice(0, 4)];
  const quantas = banda === "easy" ? 2 : banda === "medium" ? 3 : 3 + Math.floor(sorte() * 2);
  const pecas = Array.from({ length: quantas }, () => fonte[Math.floor(sorte() * fonte.length)]);
  return { pecas, total: pecas.reduce((s, v) => s + v, 0) };
}

/* Valores errados que ainda parecem dinheiro: erram por uma moeda, não por
   um número qualquer. */
export function valoresParecidos(certo, quantos, sorte = Math.random) {
  /* A diferença tem que caber no tamanho da resposta: numa conta que deu
     R$ 0,60, oferecer R$ 10,60 é alternativa que a criança elimina sem
     pensar — e pergunta que se elimina sem pensar não ensinou nada. */
  const cabem = [...MOEDAS, ...NOTAS].filter(m => m <= Math.max(certo, MOEDAS[0]));
  const candidatos = new Set();
  for (const m of (cabem.length ? cabem : [MOEDAS[0]])) {
    if (certo - m > 0) candidatos.add(certo - m);
    candidatos.add(certo + m);
  }
  candidatos.delete(certo);
  const lista = [...candidatos].sort((a, b) => Math.abs(a - certo) - Math.abs(b - certo)).slice(0, 12);
  const fora = [];
  let guarda = 0;
  while (fora.length < quantos && guarda++ < 200) {
    const v = lista[Math.floor(sorte() * lista.length)];
    if (v != null && !fora.includes(v)) fora.push(v);
  }
  return fora;
}

/* ---------- horas ---------- */

/* O Unicode tem o relógio de cada hora e de cada meia hora — as 24 caras que
   um 2º ano precisa ler. Usar o emoji em vez de desenhar um relógio poupa
   código, e sai igual em qualquer aparelho. */
export const RELOGIOS = [
  { e: "🕛", h: 12, m: 0 }, { e: "🕧", h: 12, m: 30 },
  { e: "🕐", h: 1, m: 0 }, { e: "🕜", h: 1, m: 30 },
  { e: "🕑", h: 2, m: 0 }, { e: "🕝", h: 2, m: 30 },
  { e: "🕒", h: 3, m: 0 }, { e: "🕞", h: 3, m: 30 },
  { e: "🕓", h: 4, m: 0 }, { e: "🕟", h: 4, m: 30 },
  { e: "🕔", h: 5, m: 0 }, { e: "🕠", h: 5, m: 30 },
  { e: "🕕", h: 6, m: 0 }, { e: "🕡", h: 6, m: 30 },
  { e: "🕖", h: 7, m: 0 }, { e: "🕢", h: 7, m: 30 },
  { e: "🕗", h: 8, m: 0 }, { e: "🕣", h: 8, m: 30 },
  { e: "🕘", h: 9, m: 0 }, { e: "🕤", h: 9, m: 30 },
  { e: "🕙", h: 10, m: 0 }, { e: "🕥", h: 10, m: 30 },
  { e: "🕚", h: 11, m: 0 }, { e: "🕦", h: 11, m: 30 },
];

export const horaEscrita = ({ h, m }) => `${h}:${String(m).padStart(2, "0")}`;

/* Que relógios entram: só hora cheia no começo, meia hora depois. */
export function relogiosDaFaixa(banda) {
  if (banda === "easy") return RELOGIOS.filter(r => r.m === 0);
  if (banda === "medium") return RELOGIOS.filter(r => r.m === 0 || r.h % 2 === 0);
  return RELOGIOS;
}

/* Daqui a quantas horas. Fecha o ciclo de 12, porque relógio de ponteiro não
   tem 13 horas. */
export function daquiA(relogio, horas) {
  const h = ((relogio.h + horas - 1) % 12) + 1;
  return RELOGIOS.find(r => r.h === h && r.m === relogio.m);
}

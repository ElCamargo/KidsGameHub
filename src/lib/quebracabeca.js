/**
 * KidsGameHub — quebra-cabeça
 * ElCamargo Soluções em TI LTDA
 *
 * Só as regras: quantas peças tem cada nível, quanto tempo vale quantas
 * estrelas, e onde um dedo que soltou a peça quis soltá-la. A tela e o
 * arrastar ficam no App; o que precisa estar certo mesmo quando ninguém está
 * olhando mora aqui, com teste.
 */

/* Grades deitadas de propósito: bandeira é 4:3 e desenho é 3:2, então mais
   colunas que linhas mantém a peça perto do quadrado — peça muito comprida
   fica difícil de pegar com o dedo, e feia na bandejinha.

   No Lenda a peça fica com uns 57 px de largura num celular de 360. É o
   limite: abaixo disso não é mais dedo de criança, é alfinete. */
export const GRADES = {
  easy:   { cols: 2, rows: 2 },   //  4 peças
  medium: { cols: 3, rows: 2 },   //  6
  hard:   { cols: 3, rows: 3 },   //  9
  genius: { cols: 4, rows: 3 },   // 12
  mestre: { cols: 4, rows: 4 },   // 16
  lenda:  { cols: 6, rows: 4 },   // 24
};

/* Segundos para 1, 2 e 3 estrelas. Medidos com folga: criança de cinco anos
   arrasta devagar, e estrela que só adulto alcança não é prêmio, é castigo. */
export const TEMPOS = {
  easy:   [150,  90,  45],
  medium: [180, 120,  70],
  hard:   [260, 180, 110],
  genius: [360, 250, 150],
  mestre: [480, 340, 210],
  lenda:  [700, 500, 320],
};

export const totalDePecas = nivel => GRADES[nivel].cols * GRADES[nivel].rows;

/* As peças na ordem do tabuleiro: a 0 é a de cima à esquerda. */
export function pecasDe(nivel) {
  const { cols } = GRADES[nivel];
  return Array.from({ length: totalDePecas(nivel) }, (_, i) => ({ i, col: i % cols, row: Math.floor(i / cols) }));
}

export function estrelasDo(nivel, seg) {
  const [um, dois, tres] = TEMPOS[nivel];
  return seg <= tres ? 3 : seg <= dois ? 2 : seg <= um ? 1 : 0;
}

/* Em qual buraco o dedo soltou a peça. Mede pelo centro, e devolve null se
   soltou longe de todos: soltar no meio do nada não pode virar encaixe, senão
   a peça voa para o buraco certo sozinha e o jogo se joga sem a criança. */
export function buracoMaisPerto(x, y, buracos, tolerancia) {
  let melhor = null, menor = Infinity;
  for (const b of buracos) {
    const d = Math.hypot(x - (b.x + b.w / 2), y - (b.y + b.h / 2));
    if (d < menor) { menor = d; melhor = b; }
  }
  return melhor && menor <= tolerancia ? melhor : null;
}

/* ---------- as bordas de encaixe ----------
   Peça quadrada não diz nada à criança: numa bandeira de duas cores, seis
   peças são iguais e ela acerta por sorte. Com o encaixe de quebra-cabeça de
   verdade, a FORMA já conta onde a peça vai — e é isso que ela aprende a ler
   antes de saber ler letra.

   O desenho de uma peça é feito das quatro bordas. Cada borda entre duas
   peças é UMA só: o que sai de uma tem que entrar na outra, exatamente. Por
   isso o sinal da saliência é sorteado por LINHA de corte, e não por peça. */

/* Quanto a saliência avança para fora da célula, em fração da célula. A caixa
   da peça é a célula mais isto de cada lado. */
export const SALIENCIA = 0.26;

/* Altura da cabeça do encaixe, na mesma fração. Menor que a saliência para o
   desenho nunca vazar da caixa. */
const CABECA = 0.22;

/* Sorteia para que lado aponta a cabeça de cada linha de corte.
   sv[r][c]: corte horizontal acima da linha r  (+1 = cabeça aponta para baixo)
   sh[c][r]: corte vertical à esquerda da coluna c (+1 = cabeça aponta à direita) */
export function sortearBordas(nivel, aleatorio = Math.random) {
  const { cols, rows } = GRADES[nivel];
  const sorteio = () => (aleatorio() < 0.5 ? -1 : 1);
  const sv = Array.from({ length: rows }, () => Array.from({ length: cols }, sorteio));
  const sh = Array.from({ length: cols }, () => Array.from({ length: rows }, sorteio));
  return { sv, sh };
}

/* Os pontos de uma borda, do começo ao fim, já no sistema do tabuleiro (a
   célula mede 1×1). São o começo, dois pares de controle com os âncoras da
   cabeça, e o fim — na ordem em que o path os consome.

   `s` diz para que lado a cabeça aponta em relação à perpendicular à
   esquerda do sentido da borda. A borda vizinha usa o sinal trocado, e é isso
   que faz a saliência de uma ser exatamente o buraco da outra. */
export function pontosDaBorda(x0, y0, x1, y1, s) {
  const dx = x1 - x0, dy = y1 - y0;
  const px = -dy, py = dx;                       // perpendicular, 90° à esquerda
  const P = (a, b) => [x0 + dx * a + px * b * s, y0 + dy * a + py * b * s];
  const C = CABECA;
  return [
    P(0, 0),
    P(0.36, 0),
    P(0.36, 0.5 * C), P(0.26, C), P(0.50, C),    // sobe e abre o lado esquerdo da cabeça
    P(0.74, C), P(0.64, 0.5 * C), P(0.64, 0),    // fecha o lado direito e volta
    P(1, 0),
  ];
}

/* O contorno de uma peça, em coordenadas de 0 a 1 da CAIXA da peça — que é o
   que o clipPath do SVG pede em objectBoundingBox. Borda de fora do
   tabuleiro é reta: quebra-cabeça não tem dente virado para o nada. */
export function caminhoDaPeca(nivel, i, bordas) {
  const { cols, rows } = GRADES[nivel];
  const col = i % cols, row = Math.floor(i / cols);
  const s = SALIENCIA;
  const norm = v => (v + s) / (1 + 2 * s);
  const N = ([x, y]) => `${norm(x).toFixed(4)},${norm(y).toFixed(4)}`;

  /* Uma borda vira "L x,y" quando é o lado de fora, e uma sequência de duas
     cúbicas quando tem encaixe. */
  const lado = (x0, y0, x1, y1, sinal) => {
    if (sinal === 0) return `L${N([x1, y1])}`;
    const p = pontosDaBorda(x0, y0, x1, y1, sinal);
    return `L${N(p[1])}C${N(p[2])} ${N(p[3])} ${N(p[4])}C${N(p[5])} ${N(p[6])} ${N(p[7])}L${N(p[8])}`;
  };

  const { sv, sh } = bordas;
  return [
    `M${N([0, 0])}`,
    lado(0, 0, 1, 0, row === 0 ? 0 : sv[row][col]),            // topo
    lado(1, 0, 1, 1, col === cols - 1 ? 0 : -sh[col + 1][row]), // direita
    lado(1, 1, 0, 1, row === rows - 1 ? 0 : -sv[row + 1][col]), // baixo
    lado(0, 1, 0, 0, col === 0 ? 0 : sh[col][row]),            // esquerda
    "Z",
  ].join("");
}

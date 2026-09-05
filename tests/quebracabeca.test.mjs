/**
 * KidsGameHub — quebra-cabeça
 * ElCamargo Soluções em TI LTDA
 *
 * Peça que não cabe no tabuleiro, ou estrela que ninguém alcança, é jogo
 * quebrado na mão da criança — e ela não sabe dizer o que aconteceu.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { GRADES, TEMPOS, pecasDe, estrelasDo, totalDePecas, buracoMaisPerto } from "../src/lib/quebracabeca.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];

test("todo nível tem grade e tempos, e nenhum a mais", () => {
  assert.deepEqual(Object.keys(GRADES), DIFFS);
  assert.deepEqual(Object.keys(TEMPOS), DIFFS);
});

test("a grade é deitada: nunca mais linhas que colunas", () => {
  // A imagem é deitada (bandeira 4:3, desenho 3:2). Mais linhas que colunas
  // faria peças compridas, difíceis de pegar.
  for (const n of DIFFS)
    assert.ok(GRADES[n].cols >= GRADES[n].rows, `${n}: ${GRADES[n].cols}x${GRADES[n].rows}`);
});

test("cada nível tem mais peças que o anterior", () => {
  for (let i = 1; i < DIFFS.length; i++)
    assert.ok(totalDePecas(DIFFS[i]) > totalDePecas(DIFFS[i - 1]),
      `${DIFFS[i]} não tem mais peças que ${DIFFS[i - 1]}`);
});

test("as peças cobrem o tabuleiro inteiro, uma vez cada", () => {
  for (const n of DIFFS) {
    const { cols, rows } = GRADES[n];
    const vistas = new Set(pecasDe(n).map(p => `${p.col},${p.row}`));
    assert.equal(vistas.size, cols * rows, `${n}: peça repetida ou faltando`);
    for (const p of pecasDe(n)) {
      assert.ok(p.col >= 0 && p.col < cols, `${n}: coluna ${p.col} fora do tabuleiro`);
      assert.ok(p.row >= 0 && p.row < rows, `${n}: linha ${p.row} fora do tabuleiro`);
    }
  }
});

test("os tempos das estrelas descem, e mais rápido nunca vale menos", () => {
  for (const n of DIFFS) {
    const [um, dois, tres] = TEMPOS[n];
    assert.ok(um > dois && dois > tres, `${n}: tempos fora de ordem`);
    assert.equal(estrelasDo(n, tres), 3);
    assert.equal(estrelasDo(n, dois), 2);
    assert.equal(estrelasDo(n, um), 1);
    assert.equal(estrelasDo(n, um + 1), 0);
    assert.equal(estrelasDo(n, 0), 3, `${n}: terminar num piscar tem que valer 3`);
  }
});

test("a peça encaixa no buraco mais perto, e só se soltou perto", () => {
  const buracos = [
    { i: 0, x: 0, y: 0, w: 100, h: 100 },
    { i: 1, x: 100, y: 0, w: 100, h: 100 },
  ];
  assert.equal(buracoMaisPerto(60, 50, buracos, 80)?.i, 0);
  assert.equal(buracoMaisPerto(140, 50, buracos, 80)?.i, 1);
  // soltou no meio do caminho: ainda cai no mais perto
  assert.equal(buracoMaisPerto(99, 50, buracos, 80)?.i, 0);
  // soltou longe de tudo: não encaixa em ninguém
  assert.equal(buracoMaisPerto(600, 600, buracos, 80), null);
  assert.equal(buracoMaisPerto(0, 0, [], 80), null);
});

/* ---------- as bordas de encaixe ---------- */
import { SALIENCIA, sortearBordas, pontosDaBorda, caminhoDaPeca } from "../src/lib/quebracabeca.js";

/* Um sorteio previsível, para o teste falar sempre do mesmo tabuleiro. */
const dado = () => { let n = 0; return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648); };

const iguais = (a, b) => a.length === b.length &&
  a.every((p, i) => Math.abs(p[0] - b[i][0]) < 1e-9 && Math.abs(p[1] - b[i][1]) < 1e-9);

test("a saliência cabe dentro da caixa da peça", () => {
  // Se a cabeça do encaixe passar da saliência, o desenho sai cortado.
  assert.ok(SALIENCIA > 0 && SALIENCIA < 0.5);
  const p = pontosDaBorda(0, 0, 1, 0, 1);
  for (const [, y] of p) assert.ok(Math.abs(y) <= SALIENCIA, `cabeça de ${y} passa da saliência`);
});

test("o que sai de uma peça é exatamente o buraco da outra, na horizontal", () => {
  for (const nivel of DIFFS) {
    const { cols, rows } = GRADES[nivel];
    const { sv } = sortearBordas(nivel, dado());
    for (let r = 1; r < rows; r++) for (let c = 0; c < cols; c++) {
      // topo da peça de baixo, em coordenadas do tabuleiro
      const topo = pontosDaBorda(0, 0, 1, 0, sv[r][c]).map(([x, y]) => [x + c, y + r]);
      // base da peça de cima, no mesmo lugar do tabuleiro
      const base = pontosDaBorda(1, 1, 0, 1, -sv[r][c]).map(([x, y]) => [x + c, y + r - 1]);
      assert.ok(iguais(topo, base.slice().reverse()),
        `${nivel}: corte ${c},${r} não fecha entre as duas peças`);
    }
  }
});

test("o que sai de uma peça é exatamente o buraco da outra, na vertical", () => {
  for (const nivel of DIFFS) {
    const { cols, rows } = GRADES[nivel];
    const { sh } = sortearBordas(nivel, dado());
    for (let c = 1; c < cols; c++) for (let r = 0; r < rows; r++) {
      const direita = pontosDaBorda(1, 0, 1, 1, -sh[c][r]).map(([x, y]) => [x + c - 1, y + r]);
      const esquerda = pontosDaBorda(0, 1, 0, 0, sh[c][r]).map(([x, y]) => [x + c, y + r]);
      assert.ok(iguais(direita, esquerda.slice().reverse()),
        `${nivel}: corte ${c},${r} não fecha entre as duas peças`);
    }
  }
});

test("a peça de canto tem os lados de fora retos", () => {
  const bordas = sortearBordas("hard", dado());
  const primeira = caminhoDaPeca("hard", 0, bordas);
  // duas bordas retas (topo e esquerda) e duas com encaixe (direita e baixo)
  assert.equal((primeira.match(/C/g) || []).length, 4, "esperava 2 bordas com encaixe");
  assert.ok(primeira.startsWith("M") && primeira.endsWith("Z"));
});

test("todo caminho fica dentro da caixa, entre 0 e 1", () => {
  for (const nivel of DIFFS) {
    const bordas = sortearBordas(nivel, dado());
    for (let i = 0; i < totalDePecas(nivel); i++) {
      const d = caminhoDaPeca(nivel, i, bordas);
      for (const v of d.match(/-?\d+\.\d+/g).map(Number))
        assert.ok(v >= -0.0001 && v <= 1.0001, `${nivel} peça ${i}: ${v} fora da caixa`);
    }
  }
});

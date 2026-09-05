/**
 * KidsGameHub — as contas que a escola cobra
 * ElCamargo Soluções em TI LTDA
 *
 * Conta errada num app que ensina conta é o pior defeito possível: a criança
 * confia, decora errado, e desaprende na prova.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TABUADAS, COM_DIVISAO, contaDaTabuada, numerosParecidos,
  MOEDAS, NOTAS, formatarReal, punhado, valoresParecidos,
  RELOGIOS, horaEscrita, relogiosDaFaixa, daquiA,
} from "../src/lib/matematica.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const dado = () => { let n = 3; return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648); };

test("a conta da tabuada bate, em todas as faixas e mil sorteios", () => {
  for (const d of DIFFS) {
    const sorte = dado();
    for (let i = 0; i < 1000; i++) {
      const c = contaDaTabuada(d, sorte);
      const [esq, op, dir] = c.prompt.split(" ");
      const esperado = op === "×" ? Number(esq) * Number(dir) : Number(esq) / Number(dir);
      assert.equal(c.resposta, esperado, `${d}: ${c.prompt} deu ${c.resposta}`);
      assert.ok(Number.isInteger(c.resposta), `${d}: ${c.prompt} não deu número inteiro`);
      assert.ok(c.resposta > 0, `${d}: ${c.prompt} deu ${c.resposta}`);
      assert.ok(c.conta.includes(String(c.resposta)), "a explicação tem que dizer o resultado");
    }
  }
});

test("divisão só aparece onde deve, e nunca no Fácil", () => {
  for (const d of DIFFS) {
    const sorte = dado();
    let viuDivisao = false;
    for (let i = 0; i < 400; i++) if (contaDaTabuada(d, sorte).prompt.includes("÷")) viuDivisao = true;
    assert.equal(viuDivisao, COM_DIVISAO.has(d), `${d}: divisão ${viuDivisao ? "apareceu" : "não apareceu"}`);
  }
});

test("a tabuada do Fácil é só a que se conta nos dedos", () => {
  assert.deepEqual(TABUADAS.easy, [2, 5, 10]);
  const sorte = dado();
  for (let i = 0; i < 300; i++) {
    const [a] = contaDaTabuada("easy", sorte).prompt.split(" ");
    assert.ok(TABUADAS.easy.includes(Number(a)), `saiu a tabuada do ${a} no Fácil`);
  }
});

test("as alternativas erradas são vizinhas, e nunca a resposta certa", () => {
  const sorte = dado();
  for (const certo of [6, 12, 42, 56, 100]) {
    const fora = numerosParecidos(certo, 3, sorte);
    assert.equal(fora.length, 3);
    assert.equal(new Set(fora).size, 3, "alternativa repetida");
    assert.ok(!fora.includes(certo), "a resposta certa entrou como errada");
    for (const v of fora) {
      assert.ok(v > 0, `alternativa ${v} não é número de contar`);
      assert.ok(Math.abs(v - certo) <= 10, `${v} está longe demais de ${certo}`);
    }
  }
});

test("o dinheiro é escrito como no Brasil", () => {
  assert.equal(formatarReal(0), "R$ 0,00");
  assert.equal(formatarReal(5), "R$ 0,05");
  assert.equal(formatarReal(175), "R$ 1,75");
  assert.equal(formatarReal(1000), "R$ 10,00");
  assert.equal(formatarReal(10000), "R$ 100,00");
  assert.equal(formatarReal(-50), "-R$ 0,50");
});

test("o punhado soma o que mostra, e só usa dinheiro que existe", () => {
  const existe = new Set([...MOEDAS, ...NOTAS]);
  for (const d of DIFFS) {
    const sorte = dado();
    for (let i = 0; i < 300; i++) {
      const { pecas, total } = punhado(d, sorte);
      assert.ok(pecas.length >= 2, `${d}: punhado de ${pecas.length} peça(s)`);
      assert.equal(pecas.reduce((s, v) => s + v, 0), total, `${d}: a soma não bate`);
      for (const v of pecas) assert.ok(existe.has(v), `${d}: ${v} centavos não existe no Brasil`);
    }
  }
});

test("os valores errados do dinheiro erram por uma moeda, e nunca ficam negativos", () => {
  const sorte = dado();
  for (const certo of [75, 175, 500, 1250]) {
    const fora = valoresParecidos(certo, 3, sorte);
    assert.equal(new Set(fora).size, 3);
    assert.ok(!fora.includes(certo));
    for (const v of fora) {
      assert.ok(v > 0, `${formatarReal(v)} não é dinheiro`);
      // A alternativa erra por uma moeda do tamanho da resposta, e não por
      // uma nota de 10 numa conta de 60 centavos.
      assert.ok(Math.abs(v - certo) <= certo,
        `${formatarReal(v)} está longe demais de ${formatarReal(certo)}`);
    }
  }
});

test("os 24 relógios existem, sem repetir hora", () => {
  assert.equal(RELOGIOS.length, 24);
  const vistos = new Set(RELOGIOS.map(horaEscrita));
  assert.equal(vistos.size, 24, "duas caras para a mesma hora");
  for (const r of RELOGIOS) {
    assert.ok(r.h >= 1 && r.h <= 12, `hora ${r.h}`);
    assert.ok(r.m === 0 || r.m === 30, `minuto ${r.m}`);
    assert.ok(r.e && r.e.trim(), `${horaEscrita(r)} sem carinha`);
  }
});

test("o Fácil só tem hora cheia, e as faixas altas têm tudo", () => {
  assert.ok(relogiosDaFaixa("easy").every(r => r.m === 0));
  assert.equal(relogiosDaFaixa("easy").length, 12);
  assert.equal(relogiosDaFaixa("lenda").length, 24);
  assert.ok(relogiosDaFaixa("medium").length > 12);
});

test("daqui a uma hora dá a volta no 12, como relógio de ponteiro", () => {
  assert.equal(horaEscrita(daquiA({ h: 3, m: 0 }, 1)), "4:00");
  assert.equal(horaEscrita(daquiA({ h: 12, m: 0 }, 1)), "1:00");
  assert.equal(horaEscrita(daquiA({ h: 11, m: 30 }, 2)), "1:30");
  for (const r of RELOGIOS)
    for (const h of [1, 2, 3])
      assert.ok(daquiA(r, h), `${horaEscrita(r)} + ${h}h não achou relógio`);
});

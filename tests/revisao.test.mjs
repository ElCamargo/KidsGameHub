/**
 * KidsGameHub — a memória do erro
 * ElCamargo Soluções em TI LTDA
 *
 * Fila de revisão que cresce sem fim enche o armazenamento do celular; fila
 * que esquece o erro não ensina nada. Os dois defeitos são silenciosos.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  INTERVALOS, LIMITE, chaveDaPergunta, diasEntre,
  guardarErro, acertouNaRevisao, errouNaRevisao, aRevisar, ondeEstaDevendo,
} from "../src/lib/revisao.js";

const q = n => ({ prompt: `pergunta ${n}`, answer: "x", options: ["x"] });
const dia = n => new Date(Date.UTC(2026, 0, 1 + n)).toISOString().slice(0, 10);

test("a chave sai da bandeira, do enunciado ou da resposta, e não cresce sem fim", () => {
  assert.equal(chaveDaPergunta("flags", { flag: "BR" }), "flags:BR");
  assert.equal(chaveDaPergunta("math", { prompt: "7 × 8" }), "math:7 × 8");
  assert.equal(chaveDaPergunta("x", { answer: 42 }), "x:42");
  const longa = chaveDaPergunta("bible", { prompt: "a".repeat(200) });
  assert.ok(longa.length <= 70, `chave de ${longa.length} caracteres`);
});

test("os dias entre duas datas, inclusive virando o mês", () => {
  assert.equal(diasEntre("2026-01-01", "2026-01-01"), 0);
  assert.equal(diasEntre("2026-01-01", "2026-01-08"), 7);
  assert.equal(diasEntre("2026-01-28", "2026-02-04"), 7);
  assert.equal(diasEntre("lixo", "2026-01-01"), 0);
});

test("errar guarda a pergunta; errar de novo não duplica", () => {
  let l = guardarErro([], "flags", { flag: "BR" }, dia(0));
  assert.equal(l.length, 1);
  assert.equal(l[0].vezes, 1);
  l = guardarErro(l, "flags", { flag: "BR" }, dia(5));
  assert.equal(l.length, 1, "a mesma pergunta não pode ocupar duas vagas");
  assert.equal(l[0].vezes, 2);
  assert.equal(l[0].nivel, 0, "errar de novo volta ao primeiro degrau");
});

test("a lista tem teto, e quem sai é quem está mais perto de aprender", () => {
  let l = [];
  for (let i = 0; i < LIMITE; i++) l = guardarErro(l, "c", q(i), dia(0));
  assert.equal(l.length, LIMITE);
  l = l.map((x, i) => i === 0 ? { ...x, nivel: 3 } : x);
  const quaseAprendida = l[0].chave;
  l = guardarErro(l, "c", q(999), dia(1));
  assert.equal(l.length, LIMITE, "a lista passou do teto");
  assert.ok(!l.some(x => x.chave === quaseAprendida), "devia ter saído a mais perto de aprender");
  assert.ok(l.some(x => x.chave === chaveDaPergunta("c", q(999))), "a recém-errada não pode sair");
});

test("só volta o que venceu, e a mais errada vem na frente", () => {
  let l = guardarErro([], "c", q(1), dia(0));
  l = guardarErro(l, "c", q(2), dia(0));
  l = guardarErro(l, "c", q(2), dia(0));
  assert.deepEqual(aRevisar(l, dia(0)), [], "no mesmo dia não se revisa nada");
  const vencidas = aRevisar(l, dia(1));
  assert.equal(vencidas.length, 2);
  assert.equal(vencidas[0].vezes, 2, "a mais errada tem que vir primeiro");
  assert.equal(aRevisar(l, dia(1), 1).length, 1, "o limite de quantas é respeitado");
});

test("acertando em todos os degraus a pergunta é aprendida e sai da fila", () => {
  let l = guardarErro([], "c", q(1), dia(0));
  const chave = l[0].chave;
  let aprendida = false;
  for (let k = 0; k < INTERVALOS.length; k++) {
    assert.equal(l.length, 1, `sumiu cedo demais, no degrau ${k}`);
    const r = acertouNaRevisao(l, chave, dia(k + 1));
    l = r.lista; aprendida = r.aprendida;
  }
  assert.ok(aprendida);
  assert.equal(l.length, 0, "depois do último degrau tem que sair da fila");
});

test("errar na revisão volta ao começo e conta mais uma", () => {
  let l = guardarErro([], "c", q(1), dia(0));
  const chave = l[0].chave;
  l = acertouNaRevisao(l, chave, dia(1)).lista;
  assert.equal(l[0].nivel, 1);
  l = errouNaRevisao(l, chave, dia(2));
  assert.equal(l[0].nivel, 0);
  assert.equal(l[0].vezes, 2);
});

test("o resumo diz em que trilha o filho está devendo mais", () => {
  let l = [];
  l = guardarErro(l, "flags", q(1), dia(0));
  l = guardarErro(l, "math", q(2), dia(0));
  l = guardarErro(l, "math", q(2), dia(0));
  l = guardarErro(l, "math", q(3), dia(0));
  const resumo = ondeEstaDevendo(l);
  assert.equal(resumo[0].cont, "math");
  assert.equal(resumo[0].vezes, 3);
  assert.equal(resumo[1].cont, "flags");
});

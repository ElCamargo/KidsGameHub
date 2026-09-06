/**
 * KidsGameHub — a situação-problema
 * ElCamargo Soluções em TI LTDA
 *
 * Problema gerado tem dois riscos que problema escrito à mão não tem: a conta
 * não fechar, e a isca coincidir com a resposta. Os dois passam calados — a
 * criança lê, resolve certo, e o app diz que errou.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { montarProblema, OPERACOES, TAMANHO, COISAS, NOMES, quantos } from "../src/lib/problemas.js";
import { montarRodadaProblema } from "../src/lib/rodadas.js";
import { T } from "../src/data/textos.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const FASE = { easy: 1, medium: 15, hard: 27, genius: 37, mestre: 46, lenda: 54 };
const PERGUNTAS = { easy: 5, medium: 5, hard: 10, genius: 10, mestre: 12, lenda: 15 };
const dado = () => { let n = 13; return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648); };

test("a conta do enunciado fecha, em mil sorteios por faixa", () => {
  for (const banda of DIFFS) {
    const sorte = dado();
    for (let i = 0; i < 1000; i++) {
      const p = montarProblema(banda, sorte);
      // A explicação traz a conta inteira: "27 − 12 = 15". Confiro que ela
      // bate com a resposta, e que a resposta é número de contar.
      const [esq, dir] = p.conta.split(" = ");
      assert.equal(Number(dir), p.resposta, `${banda}: "${p.conta}" não bate com ${p.resposta}`);
      const [a, op, b] = esq.split(" ");
      const esperado = op === "+" ? Number(a) + Number(b)
        : op === "−" ? Number(a) - Number(b)
        : op === "×" ? Number(a) * Number(b) : Number(a) / Number(b);
      assert.equal(p.resposta, esperado, `${banda}: ${p.conta} está errada`);
      assert.ok(Number.isInteger(p.resposta) && p.resposta > 0, `${banda}: resposta ${p.resposta}`);
    }
  }
});

test("nunca há duas alternativas iguais nem isca igual à resposta", () => {
  for (const banda of DIFFS) {
    const sorte = dado();
    for (let i = 0; i < 1000; i++) {
      const p = montarProblema(banda, sorte);
      assert.equal(p.erradas.length, 3, `${banda}: ${p.erradas.length} iscas`);
      const todas = [p.resposta, ...p.erradas];
      assert.equal(new Set(todas).size, 4, `${banda}: alternativa repetida em ${todas.join(",")}`);
      for (const v of p.erradas)
        assert.ok(Number.isInteger(v) && v > 0, `${banda}: isca ${v} não é número de contar`);
    }
  }
});

test("na subtração, a soma daqueles números é uma das iscas", () => {
  /* É o erro de verdade: ver dois números e somar sem ler o enunciado. Se
     essa isca sumir, a pergunta deixa de medir interpretação. */
  const sorte = dado();
  let vistos = 0;
  for (let i = 0; i < 500; i++) {
    const p = montarProblema("hard", sorte);
    if (!p.conta.includes("−")) continue;
    vistos++;
    const [a, , b] = p.conta.split(" = ")[0].split(" ");
    assert.ok(p.erradas.includes(Number(a) + Number(b)),
      `"${p.texto}": a soma ${Number(a) + Number(b)} não está entre as iscas`);
  }
  assert.ok(vistos > 50, `só ${vistos} subtrações para conferir`);
});

test("a divisão sempre dá conta exata", () => {
  const sorte = dado();
  for (let i = 0; i < 1000; i++) {
    const p = montarProblema("mestre", sorte);
    if (!p.conta.includes("÷")) continue;
    const [a, , b] = p.conta.split(" = ")[0].split(" ");
    assert.equal(Number(a) % Number(b), 0, `${p.conta} deixa resto`);
  }
});

test("a pergunta concorda com a coisa contada", () => {
  // "Com quantos ficou?" para flores está errado, e é o que um pai vê primeiro.
  for (const c of COISAS) {
    assert.ok(["m", "f"].includes(c.g), `${c.s}: sem gênero`);
    assert.equal(quantos(c), c.g === "f" ? "quantas" : "quantos");
  }
  const sorte = dado();
  const femininas = new Set(COISAS.filter(c => c.g === "f").flatMap(c => [c.s, c.p]));
  for (let i = 0; i < 600; i++) {
    const p = montarProblema("lenda", sorte);
    const coisa = [...femininas].find(w => p.texto.includes(" " + w));
    if (coisa) assert.ok(/quantas/i.test(p.pergunta),
      `"${p.texto}" fala de ${coisa} e pergunta "${p.pergunta}"`);
  }
});

test("cada faixa cobra as operações que a escola ensina nela", () => {
  assert.deepEqual(OPERACOES.easy, ["soma"], "o Fácil não pode ter subtração");
  assert.ok(OPERACOES.genius.includes("vezes"));
  assert.ok(OPERACOES.mestre.includes("divide"));
  for (const banda of DIFFS) {
    assert.ok(OPERACOES[banda]?.length, `${banda}: sem operação`);
    assert.ok(TAMANHO[banda]?.max > 0, `${banda}: sem tamanho de número`);
  }
});

test("a rodada não repete o mesmo enunciado", () => {
  for (const banda of DIFFS)
    for (let i = 0; i < 20; i++) {
      const { qs } = montarRodadaProblema(FASE[banda], T.pt);
      assert.equal(qs.length, PERGUNTAS[banda], `${banda}: rodada com ${qs.length}`);
      assert.equal(new Set(qs.map(q => q.texto)).size, qs.length, `${banda}: enunciado repetido`);
      for (const q of qs) {
        assert.ok(q.options.includes(q.answer), "a resposta certa não está entre as alternativas");
        assert.equal(new Set(q.options).size, 4);
      }
    }
});

test("todo nome do banco é nome de gente", () => {
  for (const n of NOMES) assert.match(n, /^[A-ZÁÉÍÓÚÂÊÔÃÕ][a-zá-ú]+$/, `nome estranho: ${n}`);
});

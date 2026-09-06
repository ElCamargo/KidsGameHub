/**
 * KidsGameHub — a trilha do ano escolar
 * ElCamargo Soluções em TI LTDA
 *
 * A trilha do ano é a única porta do app que abre faixa e dispensa moeda.
 * Um item apontando para faixa errada não trava nada — dá coisa fácil demais
 * ou difícil demais para a criança, calado. Estes testes é que reclamam.
 *
 * Que os ids de jogo e de trilha existem mesmo, quem confere é o
 * scripts/check-escola.mjs, que abre o CATALOG de verdade do App.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ANOS, CONTEUDO, IDADE_DO_ANO, conteudoDoAno, anoPorIdade, faixaDaBanda, faseDeEntrada } from "../src/lib/escola.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
/* A escada padrão do app: 60 fases repartidas nas seis faixas. */
const PLAN = [
  ...Array(14).fill("easy"), ...Array(12).fill("medium"), ...Array(10).fill("hard"),
  ...Array(9).fill("genius"), ...Array(8).fill("mestre"), ...Array(7).fill("lenda"),
];

test("todo ano tem conteúdo, e nenhum ano de fora", () => {
  assert.deepEqual(Object.keys(CONTEUDO).sort(), [...ANOS].sort());
  for (const ano of ANOS) {
    const itens = conteudoDoAno(ano);
    assert.ok(itens.length >= 4, `${ano}: só ${itens.length} coisa(s) para o ano inteiro`);
    assert.ok(itens.length <= 7, `${ano}: ${itens.length} itens não cabem numa tela de criança`);
  }
});

test("todo item aponta para uma faixa que existe, ou para uma tela", () => {
  for (const ano of ANOS)
    for (const item of conteudoDoAno(ano)) {
      assert.ok(item.jogo?.trim(), `${ano}: item sem jogo`);
      if (item.tela) {
        assert.ok(!item.cont && !item.banda, `${ano}/${item.jogo}: tela e trilha ao mesmo tempo`);
        continue;
      }
      assert.ok(item.cont?.trim(), `${ano}/${item.jogo}: sem trilha`);
      assert.ok(DIFFS.includes(item.banda), `${ano}/${item.jogo}: faixa "${item.banda}" não existe`);
    }
});

test("nenhum ano repete a mesma trilha duas vezes", () => {
  for (const ano of ANOS) {
    const trilhas = conteudoDoAno(ano).filter(i => i.cont).map(i => i.cont);
    assert.equal(new Set(trilhas).size, trilhas.length, `${ano}: trilha repetida`);
  }
});

test("a mesma trilha nunca fica mais fácil de um ano para o outro", () => {
  // Ano que passa e conteúdo que recua é o avesso de reforço escolar. Repetir
  // a faixa pode: o pré e o 1º ano dividem a alfabetização de propósito.
  const nivel = {};
  for (const ano of ANOS)
    for (const item of conteudoDoAno(ano)) {
      if (!item.cont) continue;
      const agora = DIFFS.indexOf(item.banda);
      const antes = nivel[item.cont];
      if (antes != null)
        assert.ok(agora >= antes,
          `${item.cont} vai de ${DIFFS[antes]} para ${item.banda} em ${ano}`);
      nivel[item.cont] = agora;
    }
});

test("a idade cai no ano que a escola brasileira usa", () => {
  assert.equal(anoPorIdade(3), "pre");
  assert.equal(anoPorIdade(5), "pre");
  assert.equal(anoPorIdade(6), "a1");
  assert.equal(anoPorIdade(9), "a4");
  assert.equal(anoPorIdade(10), "a5");
  assert.equal(anoPorIdade(13), "a5");
  assert.equal(anoPorIdade(null), "a1");
  for (const [ano, idade] of Object.entries(IDADE_DO_ANO))
    assert.equal(anoPorIdade(idade), ano, `${idade} anos deveria dar ${ano}`);
});

test("a faixa vira um trecho contínuo de fases", () => {
  assert.deepEqual(faixaDaBanda(PLAN, "easy"), [1, 14]);
  assert.deepEqual(faixaDaBanda(PLAN, "medium"), [15, 26]);
  assert.deepEqual(faixaDaBanda(PLAN, "lenda"), [54, 60]);
  assert.equal(faixaDaBanda(PLAN, "nenhuma"), null);
  // O que a escada promete: cada faixa em um bloco só, sem buraco no meio.
  for (const d of DIFFS) {
    const [ini, fim] = faixaDaBanda(PLAN, d);
    for (let n = ini; n <= fim; n++) assert.equal(PLAN[n - 1], d);
  }
});

test("a entrada respeita onde a criança parou, sem sair da faixa do ano", () => {
  // Nunca jogou: entra no primeiro degrau da faixa.
  assert.equal(faseDeEntrada(PLAN, "hard", 0), 27);
  // Parou no meio da faixa: continua de onde estava.
  assert.equal(faseDeEntrada(PLAN, "hard", 29), 30);
  // Já passou da faixa do ano: não volta para o começo dela.
  assert.equal(faseDeEntrada(PLAN, "easy", 40), 1);
  // Última fase da faixa vencida: a próxima já é de outra faixa, então fica.
  assert.equal(faseDeEntrada(PLAN, "hard", 36), 27);
  assert.equal(faseDeEntrada(PLAN, "easy", 0), 1);
  assert.equal(faseDeEntrada(PLAN, "nenhuma", 5), 1);
});

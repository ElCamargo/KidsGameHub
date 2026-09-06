/**
 * KidsGameHub — o som com que a palavra começa
 * ElCamargo Soluções em TI LTDA
 *
 * Este é o teste que impede o app de ensinar errado. Agrupar por letra faria
 * *casa* e *cebola* "começarem igual" e separaria *casa* de *queijo* — e a
 * criança forma a regra na cabeça justamente nessa idade.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  somInicial, comecamIgual, mesmaLetraOutroSom, PARES_DE_SOM, somIrmao,
  ARMADILHA_DA_FAIXA, gruposDeSom,
} from "../src/lib/sons.js";
import { PALAVRAS } from "../src/data/palavras.js";
import { T } from "../src/data/textos.js";
import { montarRodadaAliteracao } from "../src/lib/rodadas.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];

test("o C e o G mudam de som conforme a vogal que vem depois", () => {
  assert.equal(somInicial("casa"), "k");
  assert.equal(somInicial("cobra"), "k");
  assert.equal(somInicial("cuia"), "k");
  assert.equal(somInicial("cebola"), "s");
  assert.equal(somInicial("cinema"), "s");
  assert.equal(somInicial("gato"), "g");
  assert.equal(somInicial("gota"), "g");
  assert.equal(somInicial("gelo"), "Z");
  assert.equal(somInicial("girafa"), "Z");
});

test("letras diferentes, mesmo som — e o contrário", () => {
  assert.ok(comecamIgual("casa", "queijo"), "casa e queijo começam com /k/");
  assert.ok(comecamIgual("gelo", "jogo"), "gelo e jogo começam com o mesmo som");
  assert.ok(comecamIgual("cebola", "sapo"), "cebola e sapo começam com /s/");
  assert.ok(!comecamIgual("casa", "cebola"), "casa e cebola NÃO começam igual");
  assert.ok(!comecamIgual("gato", "gelo"), "gato e gelo NÃO começam igual");
});

test("o dígrafo é um som só, e o H inicial é mudo", () => {
  assert.equal(somInicial("chocolate"), "X");
  assert.equal(somInicial("chave"), "X");
  assert.equal(somInicial("queijo"), "k");
  assert.equal(somInicial("guitarra"), "g");
  assert.equal(somInicial("helicóptero"), "e");
  assert.equal(somInicial("hora"), "o");
  assert.ok(comecamIgual("helicóptero", "elefante"), "o H não soa: sobra o E");
});

test("vogal com acento soa como a mesma vogal", () => {
  assert.equal(somInicial("água"), "a");
  assert.equal(somInicial("índio"), "i");
  assert.equal(somInicial("ônibus"), "o");
  assert.ok(comecamIgual("água", "asa"));
});

test("a armadilha da mesma letra só existe onde a letra muda de som", () => {
  assert.ok(mesmaLetraOutroSom("casa", "cebola"));
  assert.ok(mesmaLetraOutroSom("gato", "gelo"));
  assert.ok(!mesmaLetraOutroSom("casa", "cama"), "mesma letra e mesmo som não é armadilha");
  assert.ok(!mesmaLetraOutroSom("casa", "sapo"), "letras diferentes não é armadilha");
});

test("todo som irmão é recíproco", () => {
  for (const [a, b] of PARES_DE_SOM) {
    assert.equal(somIrmao(a), b);
    assert.equal(somIrmao(b), a);
  }
  assert.equal(somIrmao("l"), null, "nem todo som tem irmão, e tudo bem");
});

test("toda palavra do banco tem um som inicial conhecido", () => {
  // Uma palavra sem som some do jogo em silêncio — e ninguém percebe.
  for (const p of PALAVRAS)
    assert.ok(somInicial(p.w), `${p.w}: não sei com que som começa`);
});

test("há grupos de sobra para montar pergunta", () => {
  const grupos = [...gruposDeSom(PALAVRAS).values()].filter(g => g.length >= 2);
  assert.ok(grupos.length >= 10, `só ${grupos.length} sons com par no banco`);
  // Nenhum grupo pode ter duas palavras iguais, senão a resposta certa e a
  // figura da pergunta seriam a mesma coisa.
  for (const g of grupos)
    assert.equal(new Set(g.map(p => p.w)).size, g.length);
});

test("a escada da aliteração cobre as seis faixas e endurece", () => {
  assert.deepEqual(Object.keys(ARMADILHA_DA_FAIXA).sort(), [...DIFFS].sort());
  assert.equal(ARMADILHA_DA_FAIXA.easy, "nenhuma");
  assert.equal(ARMADILHA_DA_FAIXA.lenda, "letra");
  const peso = { nenhuma: 0, irmao: 1, letra: 2 };
  for (let i = 1; i < DIFFS.length; i++)
    assert.ok(peso[ARMADILHA_DA_FAIXA[DIFFS[i]]] >= peso[ARMADILHA_DA_FAIXA[DIFFS[i - 1]]],
      `${DIFFS[i]} ficou mais fácil que ${DIFFS[i - 1]}`);
});

test("nenhuma pergunta do Começa Igual tem duas respostas certas", () => {
  // A isca tem que começar com som DIFERENTE. Uma isca do mesmo som faria a
  // criança acertar e o app dizer que errou — o pior defeito possível num
  // jogo de aprender.
  const alvoDa = q => q.ask.replace(/^[^]*?igual a /, "").replace("?", "");
  for (const stage of [1, 15, 27, 37, 46, 54])
    for (let i = 0; i < 12; i++)
      for (const q of montarRodadaAliteracao(stage, T.pt).qs) {
        const alvo = alvoDa(q);
        const certas = q.options.filter(o => comecamIgual(o, alvo));
        assert.equal(certas.length, 1,
          `fase ${stage}, "${alvo}": ${certas.length} respostas certas (${q.options.join(", ")})`);
        assert.ok(certas.includes(q.answer), `fase ${stage}: a resposta marcada não começa igual`);
        assert.ok(!q.options.includes(alvo), `fase ${stage}: o próprio alvo entrou como alternativa`);
      }
});

test("nas faixas altas a armadilha da mesma letra aparece sempre que existe", () => {
  const alvoDa = q => q.ask.replace(/^[^]*?igual a /, "").replace("?", "");
  let comCG = 0, comArmadilha = 0;
  for (let i = 0; i < 20; i++)
    for (const q of montarRodadaAliteracao(54, T.pt).qs) {
      const alvo = alvoDa(q);
      if (!/^[cg]/.test(alvo)) continue;
      comCG++;
      if (q.options.some(o => mesmaLetraOutroSom(o, alvo))) comArmadilha++;
    }
  assert.ok(comCG > 20, `só ${comCG} alvos com c/g para conferir`);
  assert.equal(comArmadilha, comCG, "a Lenda deixou passar alvo de c/g sem armadilha");
});

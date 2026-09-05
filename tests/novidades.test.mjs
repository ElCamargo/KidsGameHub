/**
 * KidsGameHub — o que mudou no app
 * ElCamargo Soluções em TI LTDA
 *
 * Esta lista é o único lugar onde o responsável descobre que apareceu jogo
 * novo — não há loja, notificação nem e-mail. Um idioma faltando aqui é uma
 * família que nunca fica sabendo.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { NOVIDADES, IDIOMAS_NOVIDADES, ULTIMA_NOVIDADE } from "../src/data/novidades.js";
import { LANG_CATALOG } from "../src/data/textos.js";

test("os idiomas das novidades são exatamente os do app", () => {
  assert.deepEqual([...IDIOMAS_NOVIDADES].sort(), Object.keys(LANG_CATALOG).sort());
});

test("toda versão tem os seis idiomas, com título e itens", () => {
  assert.ok(NOVIDADES.length >= 1, "sem nenhuma novidade a área fica vazia");
  for (const nova of NOVIDADES) {
    assert.match(nova.v, /^\d+\.\d+\.\d+$/, `versão estranha: ${nova.v}`);
    assert.match(nova.d, /^\d{4}-\d{2}-\d{2}$/, `${nova.v}: data estranha`);
    for (const lang of IDIOMAS_NOVIDADES) {
      const bloco = nova.t[lang];
      assert.ok(bloco, `${nova.v} não tem ${lang}`);
      assert.ok(bloco.titulo?.trim(), `${nova.v}/${lang}: sem título`);
      assert.ok(Array.isArray(bloco.itens) && bloco.itens.length, `${nova.v}/${lang}: sem itens`);
      for (const item of bloco.itens)
        assert.ok(typeof item === "string" && item.trim(), `${nova.v}/${lang}: item vazio`);
    }
  }
});

test("os seis idiomas contam a mesma quantidade de novidades", () => {
  // Um idioma com um item a menos é um pedaço da história que aquela família
  // nunca lê — e ninguém percebe sem conferir.
  for (const nova of NOVIDADES) {
    const quantos = IDIOMAS_NOVIDADES.map(l => nova.t[l].itens.length);
    assert.equal(new Set(quantos).size, 1,
      `${nova.v}: os idiomas têm ${quantos.join(", ")} itens`);
  }
});

test("a lista vem da mais nova para a mais velha", () => {
  const peso = v => v.split(".").map(Number).reduce((a, b) => a * 1000 + b, 0);
  for (let i = 1; i < NOVIDADES.length; i++)
    assert.ok(peso(NOVIDADES[i - 1].v) > peso(NOVIDADES[i].v),
      `${NOVIDADES[i].v} está depois de ${NOVIDADES[i - 1].v}`);
  assert.equal(ULTIMA_NOVIDADE, NOVIDADES[0].v);
});

test("nenhuma versão repetida", () => {
  const vistas = new Set(NOVIDADES.map(x => x.v));
  assert.equal(vistas.size, NOVIDADES.length);
});

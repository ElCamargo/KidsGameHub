/**
 * KidsGameHub — os textos da interface
 * ElCamargo Soluções em TI LTDA
 *
 * O app fala 6 idiomas e nenhum deles tem servidor por trás: se uma chave
 * faltar em italiano, a criança italiana vê "undefined" na tela e não há
 * como corrigir sem publicar de novo. Estes testes são o que impede isso.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { T, PACKS, LANG_CATALOG } from "../src/data/textos.js";

const IDIOMAS = { ...T, ...PACKS };

/* Achata { a: { b: "x" } } em ["a.b"], para comparar árvores inteiras. */
const chaves = (o, pre = "") => Object.entries(o).flatMap(([k, v]) =>
  v && typeof v === "object" && !Array.isArray(v) ? chaves(v, `${pre}${k}.`) : [`${pre}${k}`]);

const valor = (o, caminho) => caminho.split(".").reduce((x, k) => x?.[k], o);

/* {n}, {quem} — se um idioma perde o marcador, a frase sai sem o número. */
const marcadores = txt => (String(txt).match(/\{\w+\}/g) || []).sort().join(",");

test("os 6 idiomas do catálogo existem", () => {
  for (const code of Object.keys(LANG_CATALOG))
    assert.ok(IDIOMAS[code], `idioma ${code} está no catálogo mas não tem textos`);
  assert.equal(Object.keys(IDIOMAS).length, Object.keys(LANG_CATALOG).length);
});

test("todo idioma tem exatamente as mesmas chaves do português", () => {
  const base = chaves(IDIOMAS.pt);
  for (const [code, textos] of Object.entries(IDIOMAS)) {
    if (code === "pt") continue;
    const minhas = new Set(chaves(textos));
    const faltam = base.filter(k => !minhas.has(k));
    const sobram = [...minhas].filter(k => !base.includes(k));
    assert.deepEqual(faltam, [], `${code}: faltam chaves`);
    assert.deepEqual(sobram, [], `${code}: chaves que só existem aqui`);
  }
});

test("nenhum texto está vazio", () => {
  for (const [code, textos] of Object.entries(IDIOMAS))
    for (const k of chaves(textos)) {
      const v = valor(textos, k);
      assert.equal(typeof v, "string", `${code}.${k} não é texto`);
      assert.ok(v.trim().length > 0, `${code}.${k} está vazio`);
    }
});

test("os marcadores {n} e {quem} sobrevivem à tradução", () => {
  for (const k of chaves(IDIOMAS.pt)) {
    const esperado = marcadores(valor(IDIOMAS.pt, k));
    if (!esperado) continue;
    for (const [code, textos] of Object.entries(IDIOMAS))
      assert.equal(marcadores(valor(textos, k)), esperado,
        `${code}.${k} perdeu ou trocou um marcador`);
  }
});

/* Espanhol e português escrevem algumas frases exatamente igual. São poucas e
   estão listadas aqui: é mais honesto do que afrouxar o teste até ele não
   pegar mais nada. Chave no formato "idioma.caminho". */
const IGUAIS_DE_PROPOSITO = new Set(["es.thisWeek", "es.talkAbout"]);

test("nenhuma tradução ficou em português por engano", () => {
  // Não é revisão de idioma: só pega o caso óbvio de copiar e não traduzir.
  const iguaisDemais = [];
  for (const [code, textos] of Object.entries(IDIOMAS)) {
    if (code === "pt") continue;
    const ks = chaves(textos).filter(k => {
      const a = valor(IDIOMAS.pt, k), b = valor(textos, k);
      return a.length > 12 && a === b && !IGUAIS_DE_PROPOSITO.has(`${code}.${k}`);
    });
    if (ks.length) iguaisDemais.push(`${code}: ${ks.join(", ")}`);
  }
  assert.deepEqual(iguaisDemais, [], "frases longas idênticas ao português");
});

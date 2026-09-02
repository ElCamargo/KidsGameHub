/**
 * KidsGameHub — países, bandeiras e capitais
 * ElCamargo Soluções em TI LTDA
 *
 * Um país sem capital cadastrada vira uma pergunta sem resposta certa no meio
 * da rodada — e a criança perde a fase por um erro nosso.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { DATA, SUBFLAGS, CAPITAIS, CAP_PT, CAP_ES, CAP_FR, CAP_DE, CAP_IT, BR_ESTADOS, US_ESTADOS } from "../src/data/geografia.js";

const paises = Object.values(DATA).flatMap(c => Object.keys(c));

test("todo país tem código de duas letras maiúsculas", () => {
  for (const c of paises) assert.match(c, /^[A-Z]{2}$/, `código estranho: ${c}`);
});

test("nenhum país aparece em dois continentes", () => {
  const vistos = new Map();
  for (const [cont, lista] of Object.entries(DATA))
    for (const c of Object.keys(lista)) {
      assert.equal(vistos.get(c), undefined, `${c} está em ${vistos.get(c)} e em ${cont}`);
      vistos.set(c, cont);
    }
});

test("todo país tem uma capital", () => {
  const sem = paises.filter(c => !CAPITAIS[c]);
  assert.deepEqual(sem, [], "países sem capital em CAPITAIS");
});

test("as capitais traduzidas são de países que existem", () => {
  for (const [idioma, dic] of Object.entries({ pt: CAP_PT, es: CAP_ES, fr: CAP_FR, de: CAP_DE, it: CAP_IT }))
    for (const [c, capital] of Object.entries(dic)) {
      assert.ok(paises.includes(c), `${idioma}: ${c} tem capital traduzida mas não está em DATA`);
      assert.ok(capital?.trim(), `${idioma}: ${c} com capital vazia`);
    }
});

test("dicionário de grafia só guarda o que realmente muda", () => {
  // Repetir a forma canônica é peso morto e esconde o que foi traduzido.
  for (const [idioma, dic] of Object.entries({ pt: CAP_PT, es: CAP_ES, fr: CAP_FR, de: CAP_DE, it: CAP_IT })) {
    const iguais = Object.entries(dic).filter(([c, v]) => v === CAPITAIS[c]).map(([c]) => c);
    assert.deepEqual(iguais, [], `${idioma}: entradas idênticas à forma canônica`);
  }
});

test("todo tier de dificuldade vai de 1 a 4", () => {
  for (const lista of Object.values(DATA))
    for (const [c, tier] of Object.entries(lista))
      assert.ok(Number.isInteger(tier) && tier >= 1 && tier <= 4, `${c}: tier ${tier}`);
});

test("as bandeiras de região têm código no formato pais-regiao", () => {
  for (const lista of Object.values(SUBFLAGS))
    for (const r of lista) {
      assert.match(r.code, /^[a-z]{2}-[a-z]{2,3}$/, `código de região estranho: ${r.code}`);
      for (const l of ["pt", "en", "es"])
        assert.ok(r[l]?.trim(), `${r.code} sem nome em ${l}`);
    }
});

test("os estados brasileiros e americanos vêm em pares nome/capital", () => {
  assert.equal(BR_ESTADOS.length, 27, "o Brasil tem 26 estados e o Distrito Federal");
  for (const par of [...BR_ESTADOS, ...US_ESTADOS]) {
    assert.equal(par.length, 2);
    assert.ok(par[0]?.trim() && par[1]?.trim(), `par incompleto: ${par}`);
  }
});

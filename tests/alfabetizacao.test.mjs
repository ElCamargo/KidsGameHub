/**
 * KidsGameHub — a alfabetização
 * ElCamargo Soluções em TI LTDA
 *
 * Bandeja com sílaba que também serve na palavra faz o jogo aceitar o errado
 * como certo. É o pior defeito possível num jogo que ensina a ler.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { PALAVRAS } from "../src/data/palavras.js";
import {
  NIVEIS_DA_FAIXA, QUANTAS_PALAVRAS, SILABAS_EXTRAS,
  palavrasDaFaixa, silabasExtras, montarRodadaPalavras, estrelasDaPalavra,
} from "../src/lib/alfabetizacao.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
/* Sorteio previsível, para o teste falar sempre da mesma rodada. */
const dado = () => { let n = 7; return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648); };

test("toda faixa tem palavras e sabe quantas pedir", () => {
  for (const d of DIFFS) {
    assert.ok(NIVEIS_DA_FAIXA[d], `${d} sem degraus`);
    assert.ok(QUANTAS_PALAVRAS[d] >= 3, `${d}: rodada curta demais`);
    assert.ok(SILABAS_EXTRAS[d] >= 0);
    const cabem = palavrasDaFaixa(PALAVRAS, d);
    assert.ok(cabem.length >= QUANTAS_PALAVRAS[d] * 2,
      `${d}: só ${cabem.length} palavras para uma rodada de ${QUANTAS_PALAVRAS[d]}`);
  }
});

test("a sílaba que atrapalha nunca serve na palavra", () => {
  for (const p of PALAVRAS) {
    const extras = silabasExtras(p, PALAVRAS, 3, dado());
    for (const s of extras)
      assert.ok(!p.s.includes(s), `${p.w}: a sílaba "${s}" entrou como isca mas serve na palavra`);
    assert.equal(new Set(extras).size, extras.length, `${p.w}: isca repetida`);
  }
});

test("a rodada traz as palavras pedidas, sem repetir", () => {
  for (const d of DIFFS) {
    const r = montarRodadaPalavras(PALAVRAS, d, dado());
    assert.equal(r.length, QUANTAS_PALAVRAS[d], `${d}: veio ${r.length} palavra(s)`);
    assert.equal(new Set(r.map(x => x.w)).size, r.length, `${d}: palavra repetida na rodada`);
  }
});

test("a bandeja tem as sílabas da palavra mais as iscas, e nada a menos", () => {
  for (const d of DIFFS) {
    const r = montarRodadaPalavras(PALAVRAS, d, dado());
    for (const p of r) {
      assert.equal(p.pecas.length, p.s.length + SILABAS_EXTRAS[d],
        `${d}/${p.w}: bandeja com ${p.pecas.length} peças`);
      // cada sílaba da palavra aparece na bandeja a mesma quantidade de vezes
      for (const s of new Set(p.s)) {
        const naPalavra = p.s.filter(x => x === s).length;
        const naBandeja = p.pecas.filter(x => x === s).length;
        assert.equal(naBandeja, naPalavra,
          `${d}/${p.w}: a sílaba "${s}" aparece ${naBandeja} vez(es) na bandeja e ${naPalavra} na palavra`);
      }
    }
  }
});

test("a palavra sempre pode ser montada com o que está na bandeja", () => {
  for (const d of DIFFS) {
    for (let volta = 0; volta < 5; volta++) {
      const r = montarRodadaPalavras(PALAVRAS, d, dado());
      for (const p of r) {
        const sobra = [...p.pecas];
        for (const s of p.s) {
          const onde = sobra.indexOf(s);
          assert.ok(onde >= 0, `${d}/${p.w}: falta a sílaba "${s}" na bandeja`);
          sobra.splice(onde, 1);
        }
      }
    }
  }
});

test("as estrelas caem com o erro, e nunca sobem", () => {
  assert.equal(estrelasDaPalavra(0, 5), 3);
  assert.equal(estrelasDaPalavra(1, 5), 2);
  assert.equal(estrelasDaPalavra(3, 5), 1);
  assert.equal(estrelasDaPalavra(9, 5), 0);
  let antes = 4;
  for (let e = 0; e <= 10; e++) {
    const st = estrelasDaPalavra(e, 5);
    assert.ok(st <= antes, `errar mais deu mais estrela em ${e}`);
    antes = st;
  }
});

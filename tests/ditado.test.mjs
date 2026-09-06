/**
 * KidsGameHub — o ditado
 * ElCamargo Soluções em TI LTDA
 *
 * O ditado é o Monta a Palavra com LETRAS na bandeja. O motor confere peça a
 * peça, então a bandeja tem que conter exatamente as letras da palavra — com
 * as repetidas — mais as iscas. Faltando uma, a criança trava sem entender;
 * sobrando uma que encaixa, o jogo mente para ela.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  QUANTAS_DITADO, LETRAS_EXTRAS, LETRAS_NO_MAXIMO,
  montarRodadaDitado, palavrasDoDitado, letrasExtras, estrelasDaPalavra,
} from "../src/lib/alfabetizacao.js";
import { PALAVRAS, ALFABETO } from "../src/data/palavras.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const dado = () => { let n = 11; return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648); };

test("toda faixa tem palavras de sobra para uma rodada", () => {
  for (const banda of DIFFS) {
    const cabem = palavrasDoDitado(PALAVRAS, banda);
    assert.ok(cabem.length >= QUANTAS_DITADO[banda],
      `${banda}: ${cabem.length} palavra(s) para uma rodada de ${QUANTAS_DITADO[banda]}`);
  }
});

test("nenhuma palavra de ditado é comprida demais para a bandeja", () => {
  for (const banda of DIFFS)
    for (const p of palavrasDoDitado(PALAVRAS, banda))
      assert.ok([...p.w].length <= LETRAS_NO_MAXIMO,
        `${p.w} tem ${[...p.w].length} letras e viraria parede`);
});

test("a bandeja tem as letras da palavra, na conta certa, mais as iscas", () => {
  for (const banda of DIFFS) {
    const sorte = dado();
    for (let i = 0; i < 60; i++)
      for (const p of montarRodadaDitado(PALAVRAS, ALFABETO, banda, sorte)) {
        assert.deepEqual(p.s, [...p.w], `${p.w}: os lugares não são as letras da palavra`);
        assert.equal(p.pecas.length, p.s.length + LETRAS_EXTRAS[banda],
          `${p.w}: bandeja com ${p.pecas.length} peças`);
        // Cada letra tem que aparecer pelo menos tantas vezes quanto a palavra
        // pede — "casa" tem dois "a", e com um só ela trava na terceira letra.
        for (const l of new Set(p.s)) {
          const pede = p.s.filter(x => x === l).length;
          const tem = p.pecas.filter(x => x === l).length;
          assert.ok(tem >= pede, `${p.w}: pede ${pede} "${l}" e a bandeja tem ${tem}`);
        }
      }
  }
});

test("a isca nunca é uma letra que a palavra usa", () => {
  const sorte = dado();
  for (const p of PALAVRAS.slice(0, 40)) {
    const iscas = letrasExtras(p, ALFABETO, 4, sorte);
    assert.equal(new Set(iscas).size, iscas.length, `${p.w}: isca repetida`);
    for (const l of iscas)
      assert.ok(![...p.w].includes(l), `${p.w}: a isca "${l}" encaixaria de verdade`);
  }
});

test("a rodada não repete palavra", () => {
  const sorte = dado();
  for (const banda of DIFFS)
    for (let i = 0; i < 40; i++) {
      const r = montarRodadaDitado(PALAVRAS, ALFABETO, banda, sorte);
      assert.equal(new Set(r.map(p => p.w)).size, r.length, `${banda}: palavra repetida na rodada`);
      assert.equal(r.length, QUANTAS_DITADO[banda], `${banda}: rodada com ${r.length} palavras`);
    }
});

test("o ditado sobe de tamanho junto com a faixa", () => {
  for (let i = 1; i < DIFFS.length; i++)
    assert.ok(QUANTAS_DITADO[DIFFS[i]] >= QUANTAS_DITADO[DIFFS[i - 1]],
      `${DIFFS[i]} pede menos palavras que ${DIFFS[i - 1]}`);
  assert.equal(LETRAS_EXTRAS.easy, 0, "no Fácil a bandeja não tem isca");
});

test("as estrelas do ditado contam erro, como as do montar", () => {
  assert.equal(estrelasDaPalavra(0, 4), 3);
  assert.equal(estrelasDaPalavra(1, 4), 2);
  assert.equal(estrelasDaPalavra(2, 4), 1);
  assert.equal(estrelasDaPalavra(9, 4), 0);
});

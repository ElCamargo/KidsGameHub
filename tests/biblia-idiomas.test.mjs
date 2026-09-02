/**
 * KidsGameHub — o banco bíblico em francês, alemão e italiano
 * ElCamargo Soluções em TI LTDA
 *
 * Dois testes de naturezas opostas convivem aqui:
 *
 *   - o que EXIGE tradução: livros, grupos, autores, papéis, pessoas,
 *     lugares, milagres, parábolas, números e fatos. Tudo isso é frase nossa
 *     ou nome próprio consagrado, e ficar em inglês seria descuido.
 *
 *   - o que EXIGE ficar em inglês: VERSICULOS e CITACOES. São citação de
 *     Escritura, e traduzir texto bíblico de cabeça é inventá-lo. O teste
 *     falha se alguém acrescentar fr/de/it ali sem trazer junto a edição em
 *     domínio público conferida — Louis Segond 1910, Luther 1912, Diodati.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { LIVROS, GRUPOS_BIBLIA, AUTORES } from "../src/data/biblia-livros.js";
import { PERSONAGENS, PAPEIS } from "../src/data/biblia-pessoas.js";
import { LUGARES, MILAGRES, PARABOLAS } from "../src/data/biblia-lugares.js";
import { VERSICULOS, CITACOES, NUMEROS, FATOS } from "../src/data/biblia-fatos.js";
import { bancoBiblia } from "../src/data/biblia.js";

const NOVOS = ["fr", "de", "it"];

/* Confere que todo objeto de uma lista tem os três idiomas nos campos dados. */
function exigirIdiomas(rotulo, itens, campos) {
  const faltas = [];
  for (const item of itens)
    for (const campo of campos)
      for (const l of NOVOS) {
        const v = campo ? item[campo]?.[l] : item[l];
        if (!v || !String(v).trim()) faltas.push(`${rotulo}[${item[campo]?.pt ?? item.pt ?? "?"}].${campo || ""}.${l}`);
      }
  assert.deepEqual(faltas.slice(0, 10), [], `${rotulo}: ${faltas.length} campos sem tradução`);
}

test("os 66 livros, os grupos e os autores falam os seis idiomas", () => {
  exigirIdiomas("livros", LIVROS, [null]);
  exigirIdiomas("grupos", Object.values(GRUPOS_BIBLIA), [null]);
  exigirIdiomas("autores", Object.values(AUTORES), [null]);
  assert.equal(LIVROS.length, 66);
});

test("as pessoas e os papéis falam os seis idiomas", () => {
  exigirIdiomas("pessoas", PERSONAGENS, ["nome", "feito"]);
  exigirIdiomas("papéis", Object.values(PAPEIS), [null]);
});

test("lugares, milagres e parábolas falam os seis idiomas", () => {
  exigirIdiomas("lugares", LUGARES, ["lugar", "evento"]);
  exigirIdiomas("milagres", MILAGRES, ["obra", "lugar"]);
  exigirIdiomas("parábolas", PARABOLAS, ["nome", "ensina"]);
});

test("números e fatos falam os seis idiomas", () => {
  exigirIdiomas("números", NUMEROS, ["q"]);
  exigirIdiomas("fatos", FATOS, ["q", "a"]);
  for (const f of FATOS)
    for (const d of f.d)
      for (const l of NOVOS)
        assert.ok(d[l]?.trim(), `alternativa "${d.pt}" sem ${l}`);
});

test("citação de Escritura NÃO é traduzida por nós", () => {
  // Se este teste falhar, alguém traduziu texto bíblico sem edição conferida.
  // O certo é trazer a edição em domínio público e mudar este teste junto.
  const vazando = [];
  for (const v of VERSICULOS)
    for (const l of NOVOS)
      if (v.ini?.[l] || v.fim?.[l]) vazando.push(`versículo "${v.ini.pt}" em ${l}`);
  for (const c of CITACOES)
    for (const l of NOVOS)
      if (c.fala?.[l]) vazando.push(`fala "${c.fala.pt.slice(0, 30)}" em ${l}`);
  assert.deepEqual(vazando, [],
    "texto bíblico traduzido sem edição em domínio público conferida");
});

test("o banco existe de verdade nos três idiomas novos", () => {
  for (const l of NOVOS) {
    const banco = bancoBiblia(l, "genius");
    assert.ok(banco.length > 1000, `${l}: só ${banco.length} perguntas`);
    for (const [pergunta, certa, erradas] of banco.slice(0, 200)) {
      assert.ok(pergunta?.trim(), `${l}: pergunta vazia`);
      assert.ok(certa != null && String(certa).trim(), `${l}: resposta vazia`);
      assert.equal(erradas.length, 3, `${l}: alternativas erradas ≠ 3`);
      assert.ok(!pergunta.includes("undefined"), `${l}: "undefined" na pergunta`);
      assert.ok(!/\{\w+\}/.test(pergunta), `${l}: marcador não substituído em "${pergunta}"`);
    }
  }
});

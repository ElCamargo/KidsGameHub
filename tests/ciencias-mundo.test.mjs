/**
 * KidsGameHub — Ciências além dos bichos, e o Brasil
 * ElCamargo Soluções em TI LTDA
 *
 * Estes dois bancos são escritos à mão, e o defeito que passa calado é sempre
 * o mesmo: alternativa que não é plausível (a criança acerta sem saber) ou
 * duas alternativas defensáveis (ela sabe e o app diz que errou).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { CIENCIAS_MUNDO, NIVEIS_DA_CIENCIA } from "../src/data/ciencias-mundo.js";
import { ESTADOS, FATOS, REGIOES, NIVEIS_DO_BRASIL } from "../src/data/brasil.js";
import { montarRodadaCorpo, montarRodadaBrasil } from "../src/lib/rodadas.js";
import { chaveDaPergunta } from "../src/lib/revisao.js";
import { T } from "../src/data/textos.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const PERGUNTAS = { easy: 5, medium: 5, hard: 10, genius: 10, mestre: 12, lenda: 15 };
const FASE = { easy: 1, medium: 15, hard: 27, genius: 37, mestre: 46, lenda: 54 };

const bemFormada = (x, onde) => {
  assert.ok(x.q?.trim().endsWith("?"), `${onde}: a pergunta não termina com ?`);
  assert.equal(x.o.length, 4, `${onde}: ${x.o.length} alternativas`);
  assert.equal(new Set(x.o).size, 4, `${onde}: alternativa repetida`);
  assert.ok(x.o.includes(x.a), `${onde}: a resposta certa não está entre as alternativas`);
  assert.ok(x.porque?.trim(), `${onde}: sem explicação para quem errar`);
  assert.ok(x.e?.trim(), `${onde}: sem figura`);
  assert.ok([1, 2, 3, 4].includes(x.n), `${onde}: degrau ${x.n}`);
};

test("todo fato de ciências está bem formado", () => {
  for (const x of CIENCIAS_MUNDO) bemFormada(x, `ciências · "${x.q}"`);
});

test("todo fato do Brasil está bem formado", () => {
  for (const x of FATOS) bemFormada(x, `brasil · "${x.q}"`);
});

test("nenhuma pergunta se repete nos bancos", () => {
  for (const [nome, banco] of [["ciências", CIENCIAS_MUNDO], ["brasil", FATOS]]) {
    const vistas = banco.map(x => x.q);
    assert.equal(new Set(vistas).size, vistas.length, `${nome}: pergunta repetida`);
  }
});

test("a explicação não é a resposta repetida com outras palavras", () => {
  for (const x of [...CIENCIAS_MUNDO, ...FATOS])
    assert.ok(x.porque.length > x.a.length + 12,
      `"${x.q}": a explicação é curta demais para ensinar alguma coisa`);
});

test("os 27 estados estão lá, cada um numa região só", () => {
  assert.equal(ESTADOS.length, 27, `são ${ESTADOS.length} estados`);
  const nomes = ESTADOS.map(e => e.w);
  assert.equal(new Set(nomes).size, 27, "estado repetido");
  for (const e of ESTADOS) {
    assert.ok(REGIOES[e.r], `${e.w}: região "${e.r}" não existe`);
    assert.ok([1, 2, 3, 4].includes(e.n), `${e.w}: degrau ${e.n}`);
  }
  // Uma região vazia deixaria a alternativa nunca ser a certa.
  for (const r of Object.keys(REGIOES))
    assert.ok(ESTADOS.some(e => e.r === r), `a região ${r} ficou sem estado`);
});

test("as regiões conhecidas são as cinco do IBGE", () => {
  assert.deepEqual(Object.values(REGIOES).map(r => r.nome).sort(),
    ["Centro-Oeste", "Nordeste", "Norte", "Sudeste", "Sul"]);
});

test("toda faixa monta rodada cheia, nos dois jogos", () => {
  for (const banda of DIFFS) {
    const ciencia = CIENCIAS_MUNDO.filter(x => NIVEIS_DA_CIENCIA[banda].includes(x.n)).length;
    assert.ok(ciencia >= PERGUNTAS[banda], `ciências/${banda}: ${ciencia} para uma rodada de ${PERGUNTAS[banda]}`);
    const brasil = ESTADOS.filter(e => NIVEIS_DO_BRASIL[banda].includes(e.n)).length
      + FATOS.filter(f => NIVEIS_DO_BRASIL[banda].includes(f.n)).length;
    assert.ok(brasil >= PERGUNTAS[banda], `brasil/${banda}: ${brasil} para uma rodada de ${PERGUNTAS[banda]}`);
  }
});

test("a rodada não repete pergunta, e a revisão distingue todas", () => {
  for (const banda of DIFFS)
    for (const [cont, montar] of [["corpo", montarRodadaCorpo], ["brasil", montarRodadaBrasil]])
      for (let i = 0; i < 20; i++) {
        const { qs } = montar(FASE[banda], T.pt);
        assert.equal(qs.length, PERGUNTAS[banda], `${cont}/${banda}: rodada com ${qs.length}`);
        assert.equal(new Set(qs.map(q => q.ask)).size, qs.length, `${cont}/${banda}: pergunta repetida`);
        /* A chave da revisão junta figura e enunciado: duas perguntas com o
           mesmo emoji viravam uma só na fila, e uma delas se perdia. */
        const chaves = qs.map(q => chaveDaPergunta(cont, q));
        assert.equal(new Set(chaves).size, qs.length, `${cont}/${banda}: duas chaves de revisão iguais`);
      }
});

test("a pergunta de região mostra sempre o mapa, e nunca uma pista", () => {
  /* Uma figura típica da região — 🌵, 🧉 — responderia a pergunta antes de a
     criança pensar. Toda pergunta gerada a partir de um estado usa o mapa. */
  const nomes = ESTADOS.map(e => e.w);
  let vistas = 0;
  for (let i = 0; i < 30; i++)
    for (const q of montarRodadaBrasil(54, T.pt).qs) {
      if (!nomes.some(n => q.ask.includes(n))) continue;
      vistas++;
      assert.equal(q.prompt, "🗺️", `"${q.ask}" mostra ${q.prompt} em vez do mapa`);
    }
  assert.ok(vistas > 30, `só ${vistas} perguntas de região para conferir`);
});

test("os temas de ciências cobrem o que a escola cobra", () => {
  const temas = new Set(CIENCIAS_MUNDO.map(x => x.tema));
  for (const t of ["corpo", "plantas", "agua", "sentidos", "materiais", "higiene"])
    assert.ok(temas.has(t), `nenhuma pergunta sobre ${t}`);
});

/**
 * KidsGameHub — o conteúdo de formação
 * ElCamargo Soluções em TI LTDA
 *
 * Momento em Família, Meu Caderno e o versículo do dia. Não é conteúdo de
 * jogo: é o que a família lê junto. Um campo vazio aqui aparece como um
 * buraco no meio de uma conversa de mesa.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { PRINCIPIOS, DEVOCIONAIS, devocionalDoDia } from "../src/data/devocional.js";
import { PERGUNTAS, CARIMBOS, perguntaDoRegistro, semente } from "../src/data/caderno.js";
import { versoDoDia } from "../src/data/versos.js";

const IDIOMAS = ["pt", "en", "es"];

test("são 7 princípios, e cada um tem 7 devocionais", () => {
  assert.equal(PRINCIPIOS.length, 7);
  for (const p of PRINCIPIOS) {
    assert.equal(DEVOCIONAIS[p.id]?.length, 7, `${p.id} não tem 7 dias`);
    for (const l of IDIOMAS) assert.ok(p[l]?.trim(), `princípio ${p.id} sem nome em ${l}`);
  }
});

test("todo devocional tem versículo, referência, pergunta e atitude nos 3 idiomas", () => {
  for (const [id, dias] of Object.entries(DEVOCIONAIS))
    for (const [i, d] of dias.entries())
      for (const campo of ["v", "ref", "q", "a"])
        for (const l of IDIOMAS)
          assert.ok(d[campo]?.[l]?.trim(), `${id}[${i}].${campo}.${l} vazio`);
});

test("o ciclo do devocional cobre as 7 semanas sem repetir princípio", () => {
  const vistos = [];
  for (let semana = 0; semana < 7; semana++) {
    const dia = new Date(2026, 0, 4 + semana * 7);        // 4/1/2026 é um domingo
    vistos.push(devocionalDoDia(dia).principio.id);
  }
  assert.equal(new Set(vistos).size, 7, "duas semanas caíram no mesmo princípio");
});

test("o devocional do dia é sempre o mesmo para o mesmo dia", () => {
  for (let i = 0; i < 400; i++) {
    const dia = new Date(2026, 0, 1 + i);
    const a = devocionalDoDia(dia), b = devocionalDoDia(dia);
    assert.equal(a.dia, b.dia, "sorteio instável");
    assert.ok(a.dia?.v?.pt, `dia ${i} sem versículo`);
  }
});

test("as 28 perguntas do caderno são alcançáveis e estáveis", () => {
  const vistas = new Set();
  for (let i = 0; i < 500; i++) {
    const r = perguntaDoRegistro(i);
    assert.equal(perguntaDoRegistro(i).pergunta, r.pergunta, "sorteio instável");
    for (const l of IDIOMAS) assert.ok(r.pergunta[l]?.trim(), `pergunta ${i} sem ${l}`);
    vistas.add(r.pergunta.pt);
  }
  assert.equal(vistas.size, 28, "nem toda pergunta é sorteável");
  assert.equal(Object.keys(PERGUNTAS).length, 7);
});

test("sementes diferentes não caem sempre na mesma pergunta", () => {
  const trilhas = ["sa", "na", "eu", "math", "bichos", "bible", "curiosidades", "ciencias"];
  const ids = new Set(trilhas.map(x => semente(x)));
  assert.equal(ids.size, trilhas.length, "duas trilhas geraram a mesma semente");
});

test("os carimbos servem a quem ainda não escreve", () => {
  assert.ok(CARIMBOS.length >= 6, "poucos carimbos para uma criança escolher");
  const ids = CARIMBOS.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length, "carimbo com id repetido");
  for (const c of CARIMBOS) {
    assert.ok(c.e?.trim(), `${c.id} sem emoji — é o que a criança que não lê enxerga`);
    for (const l of IDIOMAS) assert.ok(c[l]?.trim(), `${c.id} sem texto em ${l}`);
  }
});

test("o versículo do dia existe em todo idioma e não muda no mesmo dia", () => {
  for (const l of ["pt", "en", "es", "fr", "de", "it"]) {
    const v = versoDoDia(l);
    assert.ok(v?.texto?.trim(), `sem versículo em ${l}`);
    assert.ok(v?.ref?.trim(), `sem referência em ${l}`);
    assert.deepEqual(versoDoDia(l), v, "o versículo mudou entre duas leituras do mesmo dia");
  }
});

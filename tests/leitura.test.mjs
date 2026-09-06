/**
 * KidsGameHub — interpretação de texto
 * ElCamargo Soluções em TI LTDA
 *
 * Aqui o defeito perigoso não é a tela quebrar: é a pergunta ter duas
 * respostas defensáveis, ou a resposta certa não estar entre as alternativas.
 * A criança leu, entendeu, respondeu — e o app disse que errou. Isso ensina a
 * ela que não adianta ler com atenção, que é o contrário do jogo.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { LEITURAS, NIVEIS_DA_LEITURA } from "../src/data/leitura.js";
import { montarRodadaLeitura } from "../src/lib/rodadas.js";
import { T } from "../src/data/textos.js";

const DIFFS = ["easy", "medium", "hard", "genius", "mestre", "lenda"];
const PERGUNTAS = { easy: 5, medium: 5, hard: 10, genius: 10, mestre: 12, lenda: 15 };
const TIPOS = ["literal", "inferencia", "vocabulario"];

test("todo texto está inteiro e bem formado", () => {
  const ids = new Set();
  for (const l of LEITURAS) {
    assert.ok(l.id?.trim(), "texto sem id");
    assert.ok(!ids.has(l.id), `id repetido: ${l.id}`);
    ids.add(l.id);
    assert.ok([1, 2, 3, 4].includes(l.n), `${l.id}: degrau ${l.n}`);
    assert.ok(l.e?.trim(), `${l.id}: sem figura`);
    assert.ok(l.t?.trim().length > 30, `${l.id}: texto curto demais`);
    assert.ok(l.p?.length >= 3, `${l.id}: só ${l.p?.length} pergunta(s)`);
  }
});

test("toda pergunta tem 4 alternativas, distintas, com a certa entre elas", () => {
  for (const l of LEITURAS)
    for (const p of l.p) {
      const onde = `${l.id} · "${p.q}"`;
      assert.ok(TIPOS.includes(p.tipo), `${onde}: tipo "${p.tipo}"`);
      assert.ok(p.q?.trim().endsWith("?"), `${onde}: a pergunta não termina com ?`);
      assert.equal(p.o.length, 4, `${onde}: ${p.o.length} alternativas`);
      assert.equal(new Set(p.o).size, 4, `${onde}: alternativa repetida`);
      assert.ok(p.o.includes(p.a), `${onde}: a resposta certa não está entre as alternativas`);
      for (const o of p.o) assert.ok(String(o).trim(), `${onde}: alternativa vazia`);
      assert.ok(p.porque?.trim(), `${onde}: sem explicação para quem errar`);
    }
});

test("a explicação aponta o texto, não repete a pergunta", () => {
  for (const l of LEITURAS)
    for (const p of l.p)
      assert.notEqual(p.porque.trim().toLowerCase(), p.q.trim().toLowerCase(),
        `${l.id}: a explicação é a própria pergunta`);
});

test("a resposta de pergunta literal aparece no texto", () => {
  /* Literal quer dizer que está escrito lá. Se a resposta não encosta em
     nenhuma palavra do texto, ou a pergunta não é literal, ou o texto mudou e
     a pergunta ficou órfã. */
  const limpar = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
  for (const l of LEITURAS) {
    const texto = " " + limpar(l.t) + " ";
    for (const p of l.p.filter(x => x.tipo === "literal")) {
      const palavras = limpar(p.a).split(/\s+/).filter(w => w.length > 2);
      assert.ok(palavras.some(w => texto.includes(" " + w)) || palavras.length === 0,
        `${l.id} · "${p.q}": a resposta "${p.a}" não aparece no texto`);
    }
  }
});

test("toda faixa tem perguntas de sobra para a rodada inteira", () => {
  for (const banda of DIFFS) {
    const quantas = LEITURAS
      .filter(l => NIVEIS_DA_LEITURA[banda].includes(l.n))
      .reduce((s, l) => s + l.p.length, 0);
    assert.ok(quantas >= PERGUNTAS[banda],
      `${banda}: ${quantas} perguntas para uma rodada de ${PERGUNTAS[banda]}`);
  }
});

test("as perguntas do mesmo texto vêm juntas", () => {
  // Embaralhadas, a criança releria o mesmo texto três vezes salteadas.
  for (const banda of Object.keys(PERGUNTAS)) {
    const stage = { easy: 1, medium: 15, hard: 27, genius: 37, mestre: 46, lenda: 54 }[banda];
    for (let i = 0; i < 20; i++) {
      const { qs } = montarRodadaLeitura(stage, T.pt);
      assert.equal(qs.length, PERGUNTAS[banda], `${banda}: rodada com ${qs.length} perguntas`);
      const vistos = [];
      for (const q of qs) if (vistos.at(-1) !== q.texto) vistos.push(q.texto);
      assert.equal(new Set(vistos).size, vistos.length, `${banda}: um texto voltou depois de outro`);
    }
  }
});

test("a rodada de leitura nunca tem cronômetro", () => {
  // Compreender não é corrida: relógio correndo mede pressa, não leitura.
  for (const stage of [1, 15, 27, 37, 46, 54])
    assert.equal(montarRodadaLeitura(stage, T.pt).time, null, `fase ${stage} veio com tempo`);
});

test("a figura não vai no prompt, para a revisão não juntar as perguntas", () => {
  /* A chave da revisão usa o prompt. Com o emoji ali, as três perguntas do
     mesmo texto virariam uma só na fila — e duas delas se perderiam. */
  const { qs } = montarRodadaLeitura(46, T.pt);
  for (const q of qs) {
    assert.equal(q.prompt, undefined, "a figura vazou para o prompt");
    assert.ok(q.figura?.trim(), "pergunta sem figura");
    assert.ok(q.texto?.trim(), "pergunta sem texto");
  }
  assert.equal(new Set(qs.map(q => q.ask)).size, qs.length, "duas perguntas iguais na mesma rodada");
});

test("há inferência e vocabulário, e não só o que está escrito", () => {
  const tipos = {};
  for (const l of LEITURAS) for (const p of l.p) tipos[p.tipo] = (tipos[p.tipo] || 0) + 1;
  assert.ok(tipos.inferencia >= 15, `só ${tipos.inferencia} perguntas de inferência`);
  assert.ok(tipos.vocabulario >= 5, `só ${tipos.vocabulario} perguntas de vocabulário`);
  // Nos degraus 3 e 4 não pode ser tudo literal, ou a faixa alta não é alta.
  for (const l of LEITURAS.filter(x => x.n >= 3))
    assert.ok(l.p.some(p => p.tipo !== "literal"), `${l.id}: só perguntas literais no degrau ${l.n}`);
});

/**
 * KidsGameHub — o banco de palavras da alfabetização
 * ElCamargo Soluções em TI LTDA
 *
 * Sílaba separada errada aqui não é bug de tela: é criança aprendendo a
 * separar errado, e depois desaprendendo na escola. Este é o teste mais
 * importante do banco.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { PALAVRAS, ALFABETO, DIGRAFOS_INICIAIS } from "../src/data/palavras.js";

test("as sílabas remontam exatamente a palavra", () => {
  for (const p of PALAVRAS)
    assert.equal(p.s.join(""), p.w, `${p.w}: as sílabas dão "${p.s.join("")}"`);
});

test("toda palavra tem figura, pelo menos duas sílabas e nenhuma vazia", () => {
  for (const p of PALAVRAS) {
    assert.ok(p.e && p.e.trim(), `${p.w} sem figura`);
    assert.ok(p.s.length >= 2, `${p.w}: uma sílaba só não dá jogo de montar`);
    for (const s of p.s) assert.ok(s.trim().length > 0, `${p.w} tem sílaba vazia`);
  }
});

test("nenhuma palavra repetida", () => {
  const vistas = new Set();
  for (const p of PALAVRAS) {
    assert.ok(!vistas.has(p.w), `${p.w} aparece duas vezes`);
    vistas.add(p.w);
  }
});

test("o degrau vai de 1 a 4 e acompanha o tamanho da palavra", () => {
  for (const p of PALAVRAS) {
    assert.ok([1, 2, 3, 4].includes(p.n), `${p.w}: degrau ${p.n}`);
    // Degrau 1 é a promessa de "duas sílabas simples": ninguém pode ter três.
    if (p.n === 1) assert.equal(p.s.length, 2, `${p.w} está no degrau 1 com ${p.s.length} sílabas`);
  }
});

test("todo degrau tem palavra suficiente para montar uma rodada", () => {
  for (const n of [1, 2, 3, 4]) {
    const quantas = PALAVRAS.filter(p => p.n === n).length;
    assert.ok(quantas >= 10, `degrau ${n} tem só ${quantas} palavras`);
  }
});

test("rima é sempre o fim da palavra, e nunca fica sozinha", () => {
  const grupos = {};
  for (const p of PALAVRAS) {
    if (!p.r) continue;
    assert.ok(p.w.endsWith(p.r), `${p.w} não termina em "${p.r}"`);
    (grupos[p.r] = grupos[p.r] || []).push(p.w);
  }
  for (const [rima, palavras] of Object.entries(grupos))
    assert.ok(palavras.length >= 2, `a rima "${rima}" só tem ${palavras[0]} — sem par não vira pergunta`);
  assert.ok(Object.keys(grupos).length >= 10, "poucas rimas para variar as perguntas");
});

test("a letra inicial existe no alfabeto do jogo", () => {
  for (const p of PALAVRAS) {
    const l = p.w[0].toLowerCase();
    assert.ok(ALFABETO.includes(l), `${p.w} começa com "${l}", que não está no alfabeto do jogo`);
  }
});

test("há palavras suficientes sem dígrafo inicial para o jogo da letra", () => {
  // Quem vê "chave" e ouve o som do X não deve procurar o C: essas ficam fora.
  const boas = PALAVRAS.filter(p => !DIGRAFOS_INICIAIS.some(d => p.s[0].toLowerCase().startsWith(d)));
  assert.ok(boas.length >= 60, `só ${boas.length} palavras servem ao jogo da letra inicial`);
  // E as letras iniciais têm que variar, senão a resposta certa fica óbvia.
  const iniciais = new Set(boas.map(p => p.w[0].toLowerCase()));
  assert.ok(iniciais.size >= 12, `só ${iniciais.size} letras diferentes começam palavra`);
});

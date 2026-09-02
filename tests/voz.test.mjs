/**
 * KidsGameHub — a voz do Lumus
 * ElCamargo Soluções em TI LTDA
 *
 * O que dá para testar sem aparelho: a frase que vai ser falada. Se ela sair
 * com o emoji dentro, o sintetizador lê "rosto sorridente" no meio da
 * pergunta; se sair sem as alternativas, quem não lê ouve a pergunta e
 * continua sem saber em que tocar.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { juntar, textoDaPergunta, TONS } from "../src/lib/voz.js";

test("juntar não dobra pontuação", () => {
  assert.equal(juntar(["Que país é essa bandeira?", "Brasil, Chile"]),
    "Que país é essa bandeira? Brasil, Chile");
  assert.equal(juntar(["Colômbia", "Fica na América do Sul."]),
    "Colômbia. Fica na América do Sul.");
  assert.equal(juntar(["", null, "só isto"]), "só isto");
  assert.equal(juntar([]), "");
});

test("a pergunta falada inclui as alternativas legíveis", () => {
  const q = { ask: "O que este animal come?", prompt: "🐰", options: ["Só plantas", "Carne", "Insetos", "Peixe"], answer: "Só plantas" };
  const txt = textoDaPergunta(q, {});
  assert.ok(txt.includes("O que este animal come?"), "sem o enunciado");
  for (const o of q.options) assert.ok(txt.includes(o), `alternativa "${o}" ficou de fora`);
});

test("emoji não entra na fala", () => {
  // "Qual destes voa?" com quatro bichos: falar os emojis lê "rosto de coelho"
  const q = { kind: "emojiPick", prompt: "Qual destes voa?", options: ["🦉", "🐘", "🐢", "🐟"], answer: "🦉" };
  const txt = textoDaPergunta(q, {});
  assert.equal(txt, "Qual destes voa?");
  for (const e of q.options) assert.ok(!txt.includes(e), `o emoji ${e} foi para a fala`);
});

test("na bandeira, o enunciado vem da tradução", () => {
  const q = { flag: "br", options: ["Brasil", "Chile", "Peru", "Bolívia"], answer: "Brasil" };
  const txt = textoDaPergunta(q, { whichCountry: "Que país é essa bandeira?" });
  assert.ok(txt.startsWith("Que país é essa bandeira?"));
  assert.ok(txt.includes("Brasil"));
});

test("pergunta vazia não vira fala", () => {
  assert.equal(textoDaPergunta(null, {}), "");
  assert.equal(textoDaPergunta({}, {}), "");
});

test("os dois tons são diferentes, e o da Palavra é mais grave e mais lento", () => {
  assert.ok(TONS.palavra.pitch < TONS.lumus.pitch, "a leitura do versículo tem que ser mais grave");
  assert.ok(TONS.palavra.rate < TONS.lumus.rate, "e mais pausada");
  for (const tom of Object.values(TONS)) {
    assert.ok(tom.pitch > 0 && tom.pitch <= 2, "pitch fora do que a API aceita");
    assert.ok(tom.rate >= 0.1 && tom.rate <= 10, "rate fora do que a API aceita");
  }
});

/**
 * KidsGameHub — os desenhos de colorir
 * ElCamargo Soluções em TI LTDA
 *
 * Pintar é o jogo de quem ainda não lê. Um desenho sem áreas pintáveis é uma
 * tela que não responde ao dedo, e a criança conclui que ela é que errou.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { PALETA, DESENHOS } from "../src/data/desenhos.js";

const TIPOS = new Set(["c", "e", "r", "p", "d"]);   // círculo, elipse, retângulo, polígono, path

test("a paleta é de cores válidas e sem repetição", () => {
  for (const c of PALETA) assert.match(c, /^#[0-9A-Fa-f]{6}$/, `cor estranha: ${c}`);
  const baixa = PALETA.map(c => c.toLowerCase());
  assert.equal(new Set(baixa).size, baixa.length, "cor repetida na paleta");
  assert.ok(PALETA.length >= 12, "paleta curta demais para uma criança escolher");
});

test("todo desenho tem id único, viewBox e pelo menos duas áreas", () => {
  const ids = DESENHOS.map(d => d.id);
  assert.equal(new Set(ids).size, ids.length, "id de desenho repetido");
  for (const d of DESENHOS) {
    assert.match(d.vb, /^-?\d+(\.\d+)? -?\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?$/, `${d.id}: viewBox inválido`);
    assert.ok(Array.isArray(d.areas) && d.areas.length >= 2,
      `${d.id}: precisa de pelo menos duas áreas, senão não há o que colorir`);
    assert.ok(d.emoji?.trim(), `${d.id} sem emoji na galeria`);
    assert.ok(d.cat?.trim(), `${d.id} sem categoria`);
  }
});

test("toda área tem forma conhecida e as medidas que aquela forma pede", () => {
  const precisa = {
    c: ["cx", "cy", "r"],
    e: ["cx", "cy", "rx", "ry"],
    r: ["x", "y", "w", "h"],
    p: ["pts"],
    d: ["d"],
  };
  for (const d of DESENHOS)
    for (const [i, a] of d.areas.entries()) {
      assert.ok(TIPOS.has(a.t), `${d.id}[${i}]: forma desconhecida "${a.t}"`);
      for (const campo of precisa[a.t])
        assert.notEqual(a[campo], undefined, `${d.id}[${i}] (${a.t}): falta ${campo}`);
    }
});

test("as categorias da galeria são as que a tela sabe mostrar", () => {
  const CATS = new Set(["flag", "animal", "obj", "space", "gen"]);
  for (const d of DESENHOS) assert.ok(CATS.has(d.cat), `${d.id}: categoria ${d.cat}`);
  // "gen" é a categoria dos desenhos sorteados na hora, que não vivem nesta
  // lista — nenhum arquivo, só a semente. As outras quatro são desenhadas.
  for (const cat of ["flag", "animal", "obj", "space"])
    assert.ok(DESENHOS.filter(d => d.cat === cat).length >= 1, `categoria ${cat} vazia`);
  assert.equal(DESENHOS.filter(d => d.cat === "gen").length, 0,
    "desenho gerado não deveria estar na lista fixa");
});

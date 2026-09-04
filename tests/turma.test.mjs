/**
 * KidsGameHub — jogar junto
 * ElCamargo Soluções em TI LTDA
 *
 * Placar errado numa partida da família é briga na mesa, não bug de tela.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_JOGADORES, vencedorDe, perguntasParaTodos } from "../src/lib/turma.js";

test("o vencedor é quem fez mais pontos", () => {
  assert.equal(vencedorDe([3, 1]), 0);
  assert.equal(vencedorDe([1, 3]), 1);
  assert.equal(vencedorDe([0, 2, 5, 1]), 2);
});

test("empate no topo não tem vencedor, com dois ou com quatro", () => {
  assert.equal(vencedorDe([2, 2]), null);
  assert.equal(vencedorDe([4, 1, 4, 0]), null);
  assert.equal(vencedorDe([0, 0, 0, 0]), null);
  assert.equal(vencedorDe([]), null);
  assert.equal(vencedorDe(null), null);
});

test("a rodada em grupo dá o mesmo número de perguntas a cada um", () => {
  for (const total of [5, 7, 10]) {
    for (let n = 2; n <= MAX_JOGADORES; n++) {
      const qs = perguntasParaTodos(Array.from({ length: total }, (_, i) => i), n);
      assert.equal(qs.length % n, 0, `${total} perguntas entre ${n} não dividem`);
      assert.ok(qs.length > 0 && qs.length <= total, `${total}/${n}: sobrou ${qs.length}`);
      assert.ok(total - qs.length < n, `${total}/${n}: cortou perguntas demais`);
    }
  }
});

test("perguntas de menos que jogadores ficam como estão", () => {
  assert.equal(perguntasParaTodos([1, 2, 3], 4).length, 3);
});

test("jogando sozinho a rodada não é cortada", () => {
  assert.equal(perguntasParaTodos([1, 2, 3, 4, 5], 1).length, 5);
});

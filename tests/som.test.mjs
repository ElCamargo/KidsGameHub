/**
 * KidsGameHub — o som de fundo
 * ElCamargo Soluções em TI LTDA
 *
 * Som de fundo mal medido não é bug bonito: é a criança com pressa a rodada
 * inteira, ou uma nota torta no meio da fase.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { NOTAS, intervaloDaNota, proximaNota } from "../src/lib/som.js";

test("a escala não tem meio-tom: nota nenhuma soa errada depois da outra", () => {
  // Meio-tom é 1,0595 de razão. Exigimos pelo menos um tom inteiro (1,1225)
  // entre notas vizinhas — é isso que faz qualquer sequência soar bem.
  for (let i = 1; i < NOTAS.length; i++) {
    const razao = NOTAS[i] / NOTAS[i - 1];
    assert.ok(razao > 1.11, `${NOTAS[i - 1]} → ${NOTAS[i]} é intervalo curto demais`);
  }
});

test("as notas sobem, e cabem no que um celular reproduz bem", () => {
  for (let i = 1; i < NOTAS.length; i++)
    assert.ok(NOTAS[i] > NOTAS[i - 1], "a escala tem que ser crescente");
  assert.ok(NOTAS[0] >= 200, "grave demais some no alto-falante do celular");
  assert.ok(NOTAS[NOTAS.length - 1] <= 1200, "agudo demais incomoda");
});

test("o ritmo acelera conforme o tempo acaba, e nunca ao contrário", () => {
  let antes = Infinity;
  for (const f of [1, 0.8, 0.6, 0.4, 0.2, 0]) {
    const ms = intervaloDaNota(f);
    assert.ok(ms <= antes, `em ${f} o intervalo subiu em vez de descer`);
    antes = ms;
  }
  assert.equal(intervaloDaNota(1), 900);
  assert.equal(intervaloDaNota(0), 260);
});

test("sem cronômetro o passo é calmo, e valor estranho não quebra", () => {
  assert.equal(intervaloDaNota(null), 900);
  assert.equal(intervaloDaNota(undefined), 900);
  assert.equal(intervaloDaNota(NaN), 900);
  assert.equal(intervaloDaNota(5), 900, "acima de 1 vale como cheio");
  assert.equal(intervaloDaNota(-3), 260, "abaixo de 0 vale como acabado");
});

test("a melodia anda de vizinha em vizinha, e não sai da escala", () => {
  for (const sorte of [() => 0, () => 0.9, () => 0.3, Math.random]) {
    let i = 4;
    for (let n = 0; n < 200; n++) {
      const proximo = proximaNota(i, sorte);
      assert.ok(proximo >= 0 && proximo < NOTAS.length, `saiu da escala: ${proximo}`);
      assert.ok(Math.abs(proximo - i) <= 2, `pulo grande demais: ${i} → ${proximo}`);
      i = proximo;
    }
  }
});
